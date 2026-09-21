const wrapper = document.querySelector(".hero-slider-wrapper");
const dots = document.querySelectorAll(".indicator-dot");
const slides = wrapper.querySelectorAll(".hero-slide");

const firstClone = slides[0].cloneNode(true);
const cloneHeading = firstClone.querySelector("h1");
if (cloneHeading) {
  const cloneH2 = document.createElement("h2");
  cloneH2.textContent = cloneHeading.textContent;
  cloneHeading.replaceWith(cloneH2);
}
wrapper.appendChild(firstClone);

const totalSlides = dots.length;
const totalPanels = slides.length + 1;

wrapper.style.width = totalPanels * 100 + "%";
slides.forEach((slide) => {
  slide.style.flexBasis = 100 / totalPanels + "%";
});

let currentIndex = 0;
let autoplayTimer;
let snapTimer;

function goToSlide(index) {
  currentIndex = index;
  wrapper.style.transform = `translateX(-${currentIndex * (100 / totalPanels)}%)`;
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
    const nextIndex = currentIndex + 1;
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

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const clickedIndex = parseInt(dot.getAttribute("data-index"));

    stopAutoplay();
    goToSlide(clickedIndex);
    startAutoplay();
  });
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopAutoplay();
  } else if (!reducedMotion) {
    startAutoplay();
  }
});

if (!reducedMotion) {
  wrapper.addEventListener("mouseenter", stopAutoplay);
  wrapper.addEventListener("mouseleave", startAutoplay);
  dots.forEach((dot) => {
    dot.addEventListener("focusin", stopAutoplay);
    dot.addEventListener("focusout", startAutoplay);
  });
}

if (!reducedMotion) {
  startAutoplay();
}

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

function closeNav() {
  siteNav.classList.remove("open");
  navToggle.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
}

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNav);
});

const header = document.querySelector("header");

let lastScrollY = window.scrollY;
const hideThreshold = 120;

window.addEventListener(
  "scroll",
  () => {
    const scrollY = window.scrollY;

    if (scrollY > lastScrollY && scrollY > hideThreshold) {
      header.classList.add("header-hidden");
      closeNav();
    } else if (scrollY < lastScrollY) {
      header.classList.remove("header-hidden");
    }

    lastScrollY = scrollY;
  },
  { passive: true }
);