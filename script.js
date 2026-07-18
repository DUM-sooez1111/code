const cards = document.querySelectorAll(".game-card");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

cards.forEach((card, index) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(28px)";
  card.style.transition = `opacity 550ms ease ${Math.min(index % 2, 1) * 90}ms, transform 550ms ease ${Math.min(index % 2, 1) * 90}ms`;
  revealObserver.observe(card);
});

const style = document.createElement("style");
style.textContent = `
  .game-card.is-visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
  .game-card.is-visible:hover {
    transform: translateY(-7px) !important;
  }
`;
document.head.appendChild(style);
