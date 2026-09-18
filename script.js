const wrapper = document.querySelector(".hero-slider-wrapper");
const dots = document.querySelectorAll(".indicator-dot");

// --- CONTINUOUS LOOP SETUP ---
// Clone slide 1 and append it at the very end. This gives us a fake "slide 4"
// that is visually identical to slide 1, so when the belt reaches the end it
// keeps sliding in the same direction, then snaps back to the real slide 1
// without the viewer ever seeing a backward jump.
const slides = wrapper.querySelectorAll(".hero-slide");
const firstClone = slides[0].cloneNode(true);
wrapper.appendChild(firstClone);

const totalSlides = dots.length; // 3 real slides
const totalPanels = slides.length + 1; // 3 real + 1 clone = 4 panels
wrapper.style.width = totalPanels * 100 + "%"; // belt must be 400% wide now

let currentIndex = 0; // The slide we are currently looking at
let autoplayTimer; // The box that holds our repeating alarm clock
let snapTimer; // The box that holds the invisible "snap back to real slide 1" job

// --- FUNCTION 1: THE SLIDE MOVER ---
// This function handles the physical movement of the belt and updates the dots
function goToSlide(index) {
  currentIndex = index;

  // Move the horizontal belt
  wrapper.style.transform = `translateX(-${currentIndex * 100}vw)`;

  // When we are parked on the clone, it looks like slide 1, so highlight dot 1.
  const activeDot = currentIndex === totalSlides ? 0 : currentIndex;
  dots.forEach((d) => d.classList.remove("active"));
  dots[activeDot].classList.add("active");
}

// --- FUNCTION 2: SNAP BACK AFTER WRAPPING ---
// When the belt finishes sliding onto the clone (end of the day), this fires
// right after the animation and teleports the belt back to the real slide 1
// with no transition, so the loop never appears to go backwards.
function snapBackToStart() {
  wrapper.style.transition = "none"; // disable the animation for this jump
  goToSlide(0);
  void wrapper.offsetHeight; // force the browser to re-read the new transform
  wrapper.style.transition =
    "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)"; // bring the animation back
}

// --- FUNCTION 3: START AUTOPLAY ---
// This function starts our repeating 5-second alarm clock
function startAutoplay() {
  autoplayTimer = setInterval(() => {
    // Always step FORWARD by one. (0 -> 1 -> 2 -> clone -> snap to 0)
    let nextIndex = currentIndex + 1;
    goToSlide(nextIndex);

    // If we just landed on the clone, wait for the slide to finish, then snap.
    if (nextIndex === totalSlides) {
      snapTimer = setTimeout(snapBackToStart, 650); // 600ms slide + a little buffer
    }
  }, 5000); // 5000 milliseconds = 5 seconds
}

// --- FUNCTION 4: STOP AUTOPLAY ---
// This clears the alarm clock so timers don't clash when a user clicks manually
function stopAutoplay() {
  clearInterval(autoplayTimer);
  clearTimeout(snapTimer); // cancel any pending snap-back as well
}

// --- CORE INTERACTION: USER CLICKS ---
// Listen for manual clicks on the dots
dots.forEach((dot) => {
  dot.addEventListener("click", (e) => {
    const clickedIndex = parseInt(e.target.getAttribute("data-index"));

    stopAutoplay(); // 1. Stop the automatic timer immediately
    goToSlide(clickedIndex); // 2. Jump to the slide the user clicked
    startAutoplay(); // 3. Restart the 5-second clock fresh!
  });
});

// --- KICKSTART STARTUP ---
// Turn on the automatic slider the moment the webpage loads up
startAutoplay();