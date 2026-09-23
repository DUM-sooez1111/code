const cards = document.querySelectorAll(".game-card");
const categoryButtons = document.querySelectorAll("[data-category-filter]");
const visibleGameCount = document.querySelector("#visibleGameCount");
const categoryStatus = document.querySelector("#categoryStatus");

const promoAds = [
  ["crownvale", "CROWNVALE", "KINGDOM BUILDER", "영토를 넓혀 나만의 왕국을 건설하세요.", "https://dum-sooez1111.github.io/kingdom/"],
  ["fortune-bastion", "포춘 바스티온", "TOWER DEFENSE", "타워를 뽑고 합성해 끝없는 웨이브를 막으세요.", "https://dum-sooez1111.github.io/RNG2/"],
  ["tetris-battle", "TETRIS BATTLE", "PUZZLE BATTLE", "블록을 쌓고 AI와 네온 퍼즐 대결을 펼치세요.", "https://dum-sooez1111.github.io/tetris-battle/"],
  ["tycoon-park", "타이쿤 파크", "PARK TYCOON", "시설과 손님을 관리해 최고의 파크를 만드세요.", "https://dum-sooez1111.github.io/Tycoon/"],
  ["chess-game", "체스 게임", "BOARD GAME", "말을 움직여 AI의 킹을 체크메이트하세요.", "https://dum-sooez1111.github.io/chess/"],
  ["sunshine-farm", "햇살마을 농장", "COZY FARMING", "작물을 키우며 천천히 쉬어가는 농장 생활.", "https://dum-sooez1111.github.io/5678/"],
  ["demon-defense", "마왕의 최종 방어선", "ACTION DEFENSE", "마왕을 조작해 몰려오는 용사를 막아내세요.", "https://dum-sooez1111.github.io/ssr/"],
  ["neon-trails", "NEON TRAILS", "OPEN WORLD DRIVING", "자동차와 바이크로 3D 월드를 질주하세요.", "https://dum-sooez1111.github.io/bike/"],
  ["idle-island-planning", "IDLE ISLAND PLANNING", "IDLE CITY BUILDER", "산업과 무역망을 세워 작은 섬을 키우세요.", "https://dum-sooez1111.github.io/city/"],
  ["spin-out", "SPIN OUT", "PHYSICS SURVIVAL", "회전 막대를 피하고 마지막까지 살아남으세요.", "https://dum-sooez1111.github.io/spin/"],
  ["core-blade", "코어 블레이드", "3D ARENA ACTION", "쌍검을 휘둘러 블록 적의 웨이브를 베어내세요.", "https://dum-sooez1111.github.io/white/?v=6ee5ddc"],
  ["keycap-clicker", "키캡 클릭커", "CASUAL CLICKER", "세라믹 키캡의 반응과 타건음을 즐겨보세요.", "https://dum-sooez1111.github.io/c/"],
];

const promoVideo = document.querySelector("#promoVideo");
const promoLink = document.querySelector("#promoLink");
const promoCounter = document.querySelector("#promoCounter");
let currentPromoIndex = -1;

const playNextPromo = () => {
  const choices = promoAds.map((_, index) => index).filter((index) => index !== currentPromoIndex);
  currentPromoIndex = choices[Math.floor(Math.random() * choices.length)];
  const [slug, title, genre, tagline, url] = promoAds[currentPromoIndex];
  promoLink.href = url;
  promoLink.setAttribute("aria-label", `${title} 플레이`);
  promoCounter.textContent = `${currentPromoIndex + 1} / ${promoAds.length}`;
  promoVideo.src = `assets/promos/${slug}.webm`;
  promoVideo.load();
  promoVideo.play().catch(() => {});
};

promoVideo.addEventListener("ended", playNextPromo);
promoVideo.addEventListener("error", playNextPromo);
playNextPromo();

const categoryNames = {
  all: "전체",
  strategy: "전략·경영",
  puzzle: "퍼즐·보드",
  action: "액션",
  driving: "드라이빙",
  casual: "캐주얼",
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
