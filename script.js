document.documentElement.classList.add("js");

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
  if (autoplayTimer) return;
  if (currentIndex === totalSlides) {
    snapBackToStart();
  }
  autoplayTimer = setInterval(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex > totalSlides) {
      snapBackToStart();
      return;
    }
    goToSlide(nextIndex);

    if (nextIndex === totalSlides) {
      snapTimer = setTimeout(snapBackToStart, 650);
    }
  }, 5000);
}

function stopAutoplay() {
  clearInterval(autoplayTimer);
  clearTimeout(snapTimer);
  autoplayTimer = null;
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

window.addEventListener(
  "scroll",
  () => {
    header.classList.toggle("is-sticky", window.scrollY > 80);
  },
  { passive: true }
);

const backToTop = document.getElementById("back-to-top");
const backToTopThreshold = 300;

if (backToTop) {
  window.addEventListener(
    "scroll",
    () => {
      backToTop.classList.toggle("visible", window.scrollY > backToTopThreshold);
    },
    { passive: true }
  );
}

const revealElements = document.querySelectorAll(".scroll-reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add("in-view"));
}

const bookingModal = document.getElementById("booking-modal");
const bookingForm = document.getElementById("booking-form");
const bookingStatus = document.getElementById("booking-form-status");
let bookingTrigger;

function openBookingModal() {
  bookingTrigger = document.activeElement;
  bookingModal.classList.add("open");
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => {
    const firstField = bookingModal.querySelector("#bk-name");
    if (firstField) firstField.focus();
  });
}

function closeBookingModal() {
  bookingModal.classList.remove("open");
  document.body.classList.remove("modal-open");
  bookingStatus.hidden = true;
  if (bookingTrigger && bookingTrigger.focus) bookingTrigger.focus();
}

function trapFocus(event) {
  if (event.key !== "Tab") return;
  const focusables = [...bookingModal.querySelectorAll('button:not([disabled]), input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')].filter(
    (el) => el.offsetParent !== null
  );
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

document.querySelectorAll("[data-open-booking]").forEach((el) => {
  el.addEventListener("click", (event) => {
    event.preventDefault();
    openBookingModal();
  });
});

bookingModal.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-booking]")) closeBookingModal();
});

bookingModal.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeBookingModal();
  else trapFocus(event);
});

bookingForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitBtn = bookingForm.querySelector('[type="submit"]');
  const originalLabel = submitBtn.textContent;
  bookingStatus.hidden = true;
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";
  try {
    const data = Object.fromEntries(new FormData(bookingForm).entries());
    const response = await fetch(bookingForm.action, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      bookingStatus.classList.remove("error");
      bookingStatus.classList.add("success");
      bookingStatus.textContent = "Request sent! AquaPalm will be in touch to confirm your stay.";
      bookingStatus.hidden = false;
      bookingForm.reset();
    } else {
      bookingStatus.classList.remove("success");
      bookingStatus.classList.add("error");
      bookingStatus.textContent = "That didn't go through. Please email your request or try again.";
      bookingStatus.hidden = false;
    }
  } catch (error) {
    bookingStatus.classList.remove("success");
    bookingStatus.classList.add("error");
    bookingStatus.textContent = "Something went wrong. Please email your request or try again.";
    bookingStatus.hidden = false;
  }
  submitBtn.disabled = false;
  submitBtn.textContent = originalLabel;
});