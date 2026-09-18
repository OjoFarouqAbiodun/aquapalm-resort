const wrapper = document.querySelector(".hero-slider-wrapper");
const dots = document.querySelectorAll(".indicator-dot");

let currentIndex = 0; // The slide we are currently looking at
const totalSlides = dots.length; // How many slides we have in total (3)
let autoplayTimer; // The box that holds our repeating alarm clock

// --- FUNCTION 1: THE SLIDE MOVER ---
// This function handles the physical movement of the belt and updates the dots
function goToSlide(index) {
  currentIndex = index;
  
  // Move the horizontal belt
  wrapper.style.transform = `translateX(-${currentIndex * 100}vw)`;
  
  // Reset all dots to faint, make the active one bright
  dots.forEach(d => d.classList.remove("active"));
  dots[currentIndex].classList.add("active");
}

// --- FUNCTION 2: START AUTOPLAY ---
// This function starts our repeating 5-second alarm clock
function startAutoplay() {
  autoplayTimer = setInterval(() => {
    // Calculate the next slide index. (0 -> 1 -> 2 -> then back to 0)
    let nextIndex = (currentIndex + 1) % totalSlides;
    goToSlide(nextIndex);
  }, 5000); // 5000 milliseconds = 5 seconds
}

// --- FUNCTION 3: STOP AUTOPLAY ---
// This clears the alarm clock so timers don't clash when a user clicks manually
function stopAutoplay() {
  clearInterval(autoplayTimer);
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
