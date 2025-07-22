const MENU_ITEMS = [
  
  { icon: "😍", label: "텃밭식당" },
  { icon: "😍", label: "돌짜장" },
  { icon: "😍", label: "맘스터치" },
  { icon: "😍", label: "용우동" },
  { icon: "😍", label: "서브웨이" },
];

const slotStrip = document.getElementById("slot");
const resultEl = document.getElementById("result");
const spinBtn = document.querySelector("button");
let isSpinning = false
const REPEAT_COUNT = 40;

function buildStrip() {
  const frag = document.createDocumentFragment();
  for (let r = 0; r < REPEAT_COUNT; r++) {
    MENU_ITEMS.forEach(item => {
      const div = document.createElement("div");
      div.textContent = `${item.icon} ${item.label}`;  // ✅ 백틱으로 감싸기
      frag.appendChild(div);
    });
  }
  slotStrip.appendChild(frag);
}


buildStrip();

function getSlotMetrics() {
  const firstItem = slotStrip.children[0];
  const itemHeight = firstItem ? firstItem.offsetHeight : 60;
  const windowEl = slotStrip.parentElement;
  const windowHeight = windowEl.offsetHeight;
  return { itemHeight, windowHeight };
}

function fireConfetti() {
  console.log("🔥 fireConfetti 호출됨");
  if (typeof confetti === "function") {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  } else {
    console.warn("⚠️ confetti 함수가 정의되지 않았습니다.");
  }
}


function showResult(text) {
  resultEl.innerHTML = `그럼 우리 오늘<br>${text}! 먹자`;  // ✅ 줄바꿈으로 두 줄 구성

  resultEl.classList.remove("celebrate");
  void resultEl.offsetWidth;
  resultEl.classList.add("celebrate");

  resultEl.style.opacity = 0;
  requestAnimationFrame(() => {
    resultEl.style.opacity = 1;
  });

  fireConfetti();
}




function spin() {
  if (isSpinning) return;
  isSpinning = true;
  spinBtn.disabled = true;

  const { itemHeight, windowHeight } = getSlotMetrics();
  const pickIndex = Math.floor(Math.random() * MENU_ITEMS.length);
  const pickItem = MENU_ITEMS[pickIndex];
  const minLoops = 8;
  const extraLoops = Math.floor(Math.random() * 6);
  const loops = minLoops + extraLoops;
  const targetIndex = loops * MENU_ITEMS.length + pickIndex;
  const offsetCenter = (windowHeight - itemHeight) / 2;
  const targetY = -(targetIndex * itemHeight - offsetCenter);

  slotStrip.style.transition = "none";
  slotStrip.style.transform = "translateY(0px)";

  requestAnimationFrame(() => {
  const spinDuration = 2500 + Math.random() * 1000;
  slotStrip.style.transition = `transform ${spinDuration}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;  // ✅
  slotStrip.style.transform = `translateY(${targetY}px)`;  // ✅
});


  const onDone = () => {
    slotStrip.removeEventListener("transitionend", onDone);
    showResult(pickItem.label);       
    fireConfetti();
    isSpinning = false;
    spinBtn.disabled = false;
  };
  slotStrip.addEventListener("transitionend", onDone);
}

//무슨 폭죽 오류인진 몰라도 더블클릭시 폭죽 나오게 설정
spinBtn.addEventListener("dblclick", () => {
  console.log("💥 직접 폭죽 테스트");
  fireConfetti();
});
