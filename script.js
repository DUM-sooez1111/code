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

const qrModal = document.querySelector("#qrModal");
const qrImage = document.querySelector("#qrImage");
const qrTitle = document.querySelector("#qrTitle");
const qrLink = document.querySelector("#qrLink");
const qrButtons = document.querySelectorAll(".qr-button");
const qrCloseButtons = document.querySelectorAll("[data-qr-close]");

const closeQrModal = () => {
  qrModal.hidden = true;
  document.body.classList.remove("qr-open");
};

qrButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const title = button.dataset.title;
    qrImage.src = button.dataset.qr;
    qrImage.alt = `${title} 게임 QR 코드`;
    qrTitle.textContent = title;
    qrLink.href = button.dataset.url;
    qrModal.hidden = false;
    document.body.classList.add("qr-open");
    qrModal.querySelector(".qr-close").focus();
  });
});

qrCloseButtons.forEach((button) => button.addEventListener("click", closeQrModal));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !qrModal.hidden) {
    closeQrModal();
  }
});
