const cards = document.querySelectorAll(".game-card");
const categoryButtons = document.querySelectorAll("[data-category-filter]");
const visibleGameCount = document.querySelector("#visibleGameCount");
const categoryStatus = document.querySelector("#categoryStatus");

const categoryNames = {
  all: "전체",
  strategy: "전략·경영",
  puzzle: "퍼즐·보드",
  action: "액션",
  driving: "드라이빙",
};

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

const mobileNavLinks = document.querySelectorAll("[data-mobile-nav]");
const gamesSection = document.querySelector("#games");
const randomGameButton = document.querySelector("#randomGame");
const mobileToast = document.querySelector("#mobileToast");
let toastTimer;
let previousRandomIndex = -1;

const updateMobileNav = () => {
  const gamesAreActive = gamesSection.getBoundingClientRect().top < window.innerHeight * 0.55;
  mobileNavLinks.forEach((link) => {
    link.classList.toggle(
      "active",
      link.dataset.mobileNav === (gamesAreActive ? "games" : "home"),
    );
  });
};

const showMobileToast = (message) => {
  mobileToast.textContent = message;
  mobileToast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => mobileToast.classList.remove("show"), 1800);
};

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedCategory = button.dataset.categoryFilter;
    let visibleCount = 0;

    categoryButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    cards.forEach((card) => {
      const isVisible = selectedCategory === "all" || card.dataset.category === selectedCategory;
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    visibleGameCount.textContent = visibleCount;
    categoryStatus.textContent = `${categoryNames[selectedCategory]} 게임 ${visibleCount}개를 표시합니다.`;
    previousRandomIndex = -1;
  });
});

randomGameButton.addEventListener("click", () => {
  const visibleCards = [...cards].filter((card) => !card.hidden);
  let index = Math.floor(Math.random() * visibleCards.length);
  if (visibleCards.length > 1 && index === previousRandomIndex) {
    index = (index + 1) % visibleCards.length;
  }
  previousRandomIndex = index;

  const card = visibleCards[index];
  const title = card.querySelector("h3").textContent;
  card.classList.remove("mobile-highlight");
  card.scrollIntoView({ behavior: "smooth", block: "center" });
  window.setTimeout(() => card.classList.add("mobile-highlight"), 350);
  window.setTimeout(() => card.classList.remove("mobile-highlight"), 1300);
  showMobileToast(`${title} 카드로 이동했어요`);
});

window.addEventListener("scroll", updateMobileNav, { passive: true });
updateMobileNav();
