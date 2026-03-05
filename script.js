// PREMIUM PORTFOLIO JS
// - smooth scroll active links
// - scroll reveal animation
// - mobile nav toggle
// - project modal content
// - contact form UX feedback (no backend)

const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close menu when a link is clicked (mobile)
  navLinks.forEach((a) => {
    a.addEventListener("click", () => {
      if (navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("show");
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach((el) => revealObserver.observe(el));

// Active nav highlight
const sections = ["about", "projects", "tools", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((a) => a.classList.remove("active"));
      const match = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (match) match.classList.add("active");
    });
  },
  { rootMargin: "-55% 0px -40% 0px", threshold: 0.01 }
);

sections.forEach((s) => navObserver.observe(s));

// Modal
const modal = document.getElementById("projectModal");
const modalBody = document.getElementById("modalBody");
const modalTitle = document.getElementById("modalTitle");
const closeModalBtn = document.getElementById("closeModal");
const modalLink = document.getElementById("modalLink");

const openButtons = document.querySelectorAll(".openModal");

const PROJECTS = {
  1: {
    title: "Financial Tracker",
    desc:
      "Interactive dashboard for tracking expenses, budgets, and personal finance habits. Built with clean UI and responsive layout.",
    stack: ["HTML", "CSS", "JavaScript"],
    link: "https://example.com",
  },
  2: {
    title: "Tetris Game",
    desc:
      "Classic arcade game built with JavaScript. Includes scoring, speed progression, and keyboard controls.",
    stack: ["HTML", "CSS", "JavaScript"],
    link: "https://example.com",
  },
  3: {
    title: "Digimart",
    desc:
      "Mobile-first grocery e-commerce experience. Clean product browsing, cart flow, and scalable layout approach.",
    stack: ["MongoDB", "Express", "React", "Node"],
    link: "https://example.com",
  },
};

function openModal(projectId) {
  const p = PROJECTS[projectId];
  if (!p) return;

  modalTitle.textContent = p.title;

  modalBody.innerHTML = `
    <p>${p.desc}</p>
    <p><strong>Tech Stack:</strong> ${p.stack.join(" · ")}</p>
  `;

  modalLink.href = p.link;

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

openButtons.forEach((btn) => {
  btn.addEventListener("click", () => openModal(btn.dataset.project));
});

if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("show")) closeModal();
  });
}

// Contact form UX (no backend)
const form = document.getElementById("contactForm");
const note = document.getElementById("formNote");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (note) note.textContent = "✅ Message prepared! (Demo only — add backend/email later.)";
    form.reset();
  });
}