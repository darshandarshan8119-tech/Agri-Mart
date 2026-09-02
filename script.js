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

// Check if user is logged in
const checkAuthState = () => {
  try {
    const rawUser = localStorage.getItem("agrimart_user");
    if (!rawUser) return;
    const user = JSON.parse(rawUser);
    if (!user || !user.isLoggedIn) return;

    const navAuth = document.querySelector('[data-auth-link="signin"]');
    const navRegister = document.querySelector('[data-auth-link="register"]');

    if (navAuth && navRegister) {
      const displayName = user.fullname || (user.email ? user.email.split("@")[0] : "Farmer");
      navAuth.textContent = `📊 ${displayName} (Dashboard)`;
      navAuth.href = "dashboard.html";
      navAuth.title = "Open Smart Farming Dashboard";

      navRegister.textContent = "Sign Out";
      navRegister.href = "javascript:void(0)";
      navRegister.style.background = "#c82333";
      navRegister.addEventListener("click", () => {
        localStorage.removeItem("agrimart_user");
        window.location.reload();
      });
    }
  } catch (e) {
    console.error("Auth state error:", e);
  }
};

checkAuthState();

