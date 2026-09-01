const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navPanel = document.querySelector("[data-nav-panel]");
const revealItems = document.querySelectorAll(".reveal");

const setHeaderState = () => {
  const scrolled = window.scrollY > 18;
  header.classList.toggle("scrolled", scrolled);
};

const closeMenu = () => {
  document.body.classList.remove("menu-open");
  header.classList.remove("menu-active");
  navPanel.classList.remove("is-open");
  menuToggle.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
};

menuToggle.addEventListener("click", () => {
  const isOpen = navPanel.classList.toggle("is-open");
  document.body.classList.toggle("menu-open", isOpen);
  header.classList.toggle("menu-active", isOpen);
  menuToggle.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

navPanel.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    closeMenu();
  }
});

window.addEventListener("scroll", setHeaderState, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 820) {
    closeMenu();
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => revealObserver.observe(item));
setHeaderState();
