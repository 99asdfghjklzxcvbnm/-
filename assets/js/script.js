const header = document.getElementById("header");
const progressBar = document.getElementById("progressBar");
const menuButton = document.getElementById("menuButton");
const nav = document.getElementById("nav");

function updateScrollUI() {
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

  if (progressBar) progressBar.style.width = `${progress}%`;
  if (header) header.classList.toggle("scrolled", scrollTop > 24);
}

function toggleMenu(forceClose = false) {
  if (!nav || !menuButton) return;

  const shouldOpen = forceClose ? false : !nav.classList.contains("open");
  nav.classList.toggle("open", shouldOpen);
  menuButton.classList.toggle("active", shouldOpen);
  menuButton.setAttribute("aria-expanded", String(shouldOpen));
  menuButton.setAttribute("aria-label", shouldOpen ? "메뉴 닫기" : "메뉴 열기");
  document.body.classList.toggle("menu-open", shouldOpen);
}

if (menuButton) {
  menuButton.addEventListener("click", () => toggleMenu());
}

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => toggleMenu(true));
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = Number(counter.dataset.target);
      const duration = 1100;
      const start = performance.now();

      function animate(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(target * eased);

        if (progress < 1) requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
      counterObserver.unobserve(counter);
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll(".counter").forEach((counter) => {
  counterObserver.observe(counter);
});

const currentYear = new Date().getFullYear();
const yearTarget = document.getElementById("currentYear");
const careerYears = document.getElementById("careerYears");

if (yearTarget) yearTarget.textContent = currentYear;
if (careerYears) careerYears.textContent = currentYear - 2013;

window.addEventListener("scroll", updateScrollUI, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 720) toggleMenu(true);
});

updateScrollUI();
