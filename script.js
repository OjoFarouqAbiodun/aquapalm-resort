const wrapper = document.querySelector(".hero-slider-wrapper");
const dots = document.querySelectorAll(".indicator-dot");
const slides = wrapper.querySelectorAll(".hero-slide");
const firstClone = slides[0].cloneNode(true);
wrapper.appendChild(firstClone);
const totalSlides = dots.length;
const totalPanels = slides.length + 1;
wrapper.style.width = totalPanels * 100 + "%";

let currentIndex = 0; 
let autoplayTimer;
let snapTimer;

function goToSlide(index) {
  currentIndex = index;
  wrapper.style.transform = `translateX(-${currentIndex * 100}vw)`;
  const activeDot = currentIndex === totalSlides ? 0 : currentIndex;
  dots.forEach((d) => d.classList.remove("active"));
  dots[activeDot].classList.add("active");
}

function snapBackToStart() {
  wrapper.style.transition = "none";
  goToSlide(0);
  void wrapper.offsetHeight;
  wrapper.style.transition = "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)";
}

function startAutoplay() {
  autoplayTimer = setInterval(() => {
    let nextIndex = currentIndex + 1;
    goToSlide(nextIndex);

    if (nextIndex === totalSlides) {
      snapTimer = setTimeout(snapBackToStart, 650);
    }
  }, 5000);
}

function stopAutoplay() {
  clearInterval(autoplayTimer);
  clearTimeout(snapTimer);
}

dots.forEach((dot) => {
  dot.addEventListener("click", (e) => {
    const clickedIndex = parseInt(e.target.getAttribute("data-index"));

    stopAutoplay();
    goToSlide(clickedIndex);
    startAutoplay();
  });
});

startAutoplay();
