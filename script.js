/*
   CONFIG — ganti bagian ini sesuai kebutuhanmu
   ============================================================ */
const CONFIG = {
  recipientName: "Mentor funny K-37",          // nama penerima, tampil di amplop
  senderLabel: "dari maba funny",        // tampil di kartu surat terakhir

  passcode: "1213",               // kode rahasia untuk buka pesan
  hint: "hayo, kode rahasianya apa? 👀",
  hintDetail: "petunjuk: 2 tanggal osfak kitaaa kakkk~",

  whispers: [
    "Sebelum  ini kebuka, guaa mau ngomong satu hal dulu.",
    "Beberapa waktu kemarin osfak rasanya seru kak, mungkin karena mentor nya elu.",
    "Awalnya gua pikir bakal bosen duluan di osfak kemarin WKWKWWK.",
    "Yaaaa walaupun gua ga di bolehin tidur yaaa tapi okelah",
    "Jadi... gw mau mintaa maaf kak kalo osfak kemarin gw rewel banget...?"
  ],

  letterTitle: "Ini yang sebenarnya",
  letterParagraphs: [
    "Makasih udah mau buka pesan ini sampai sini.",
    "Gua nulis ini karena pengenn bilang makasih ke eluu kak, walaupun udah telat banget sih WWKKWWKWKWK.",
    "YAAA GIMANEE, minggu pertama gw masuk kampus langsung di habek tugas, jadinya gabisa ngelanjutin ini, soryyy yakkkk." ,
    "INTINYAA, makasih udah jadi mentor yang ngerangkul semua mentee lu kakkk, gw pribadi jujur pasti gabakal bisa ngelakuin apa yang udah lu lakuin, ELUU HARUS TAU apa yang lu kemarin lakuin kelewat KEREN kakk, ga semua orang bisa ngambil sikap ke orang lain se welcome elu, gw akuin postive vibes lu kenceng banget, terusin jadi orang baekk yakk, ohh sorry salah, terusin jadi kating baekk kakk🙌🏻"
    
  ],

  closingText: "Makasih udah baca sampai akhir yaaa. Apapun yang lu hadepin kedepannya, semoga bisa lu lewatin sambil tutup mata, THANK U KAK MAYDA ZAHRA NUGRAHANTI.",
};

/* ============================================================
   Screen navigation
   ============================================================ */
const screens = document.querySelectorAll(".screen");

function showScreen(name) {
  screens.forEach((s) => s.classList.toggle("is-active", s.dataset.screen === name));
}

/* ============================================================
   Floating petals background
   ============================================================ */
function spawnPetals(count = 16) {
  const container = document.getElementById("petals");
  const emojis = ["🌸", "🌷", "🌼"];
  for (let i = 0; i < count; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.fontSize = 12 + Math.random() * 14 + "px";
    const duration = 10 + Math.random() * 12;
    petal.style.animationDuration = duration + "s";
    petal.style.animationDelay = -(Math.random() * duration) + "s";
    container.appendChild(petal);
  }
}

/* ============================================================
   Screen 1 — Envelope
   ============================================================ */
document.getElementById("recipientSlot").textContent = CONFIG.recipientName;

document.getElementById("btnOpen").addEventListener("click", () => {
  showScreen("lock");
});

/* ============================================================
   Screen 2 — Passcode lock
   ============================================================ */
const lockCard = document.getElementById("lockCard");
const lockIcon = document.getElementById("lockIcon");
const dotsEl = document.getElementById("dots");
const keypadEl = document.getElementById("keypad");
const hintText = document.getElementById("hintText");
const hintToggle = document.getElementById("hintToggle");

let entered = "";
let hintShown = false;

hintText.textContent = CONFIG.hint;

function buildDots() {
  dotsEl.innerHTML = "";
  for (let i = 0; i < CONFIG.passcode.length; i++) {
    const dot = document.createElement("span");
    dot.className = "dot";
    dotsEl.appendChild(dot);
  }
}

function refreshDots() {
  const dots = dotsEl.querySelectorAll(".dot");
  dots.forEach((dot, i) => dot.classList.toggle("is-filled", i < entered.length));
}

function buildKeypad() {
  const layout = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];
  layout.forEach((key) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "key";
    if (key === "") {
      btn.style.visibility = "hidden";
    } else if (key === "del") {
      btn.textContent = "⌫";
      btn.addEventListener("click", () => handleKey("del"));
    } else {
      btn.textContent = key;
      btn.addEventListener("click", () => handleKey(key));
    }
    keypadEl.appendChild(btn);
  });
}

function handleKey(key) {
  if (key === "del") {
    entered = entered.slice(0, -1);
    refreshDots();
    return;
  }
  if (entered.length >= CONFIG.passcode.length) return;

  entered += key;
  refreshDots();

  if (entered.length === CONFIG.passcode.length) {
    setTimeout(checkPasscode, 150);
  }
}

function checkPasscode() {
  if (entered === CONFIG.passcode) {
    lockCard.classList.add("is-unlocked");
    lockIcon.textContent = "🔓";
    setTimeout(() => {
      startWhispers();
      showScreen("whisper");
    }, 550);
  } else {
    lockCard.classList.add("is-shaking");
    setTimeout(() => {
      lockCard.classList.remove("is-shaking");
      entered = "";
      refreshDots();
    }, 400);
  }
}

hintToggle.addEventListener("click", () => {
  hintShown = !hintShown;
  hintText.textContent = hintShown ? CONFIG.hintDetail : CONFIG.hint;
});

// allow physical keyboard input too
document.addEventListener("keydown", (e) => {
  const lockActive = document.querySelector('[data-screen="lock"]').classList.contains("is-active");
  if (!lockActive) return;
  if (/^[0-9]$/.test(e.key)) handleKey(e.key);
  if (e.key === "Backspace") handleKey("del");
});

/* ============================================================
   Screen 3 — Whisper sequence
   ============================================================ */
const whisperProgress = document.getElementById("whisperProgress");
const whisperText = document.getElementById("whisperText");
const btnNextWhisper = document.getElementById("btnNextWhisper");

let whisperIndex = 0;

function startWhispers() {
  whisperIndex = 0;
  renderWhisper();
}

function renderWhisper() {
  const total = CONFIG.whispers.length;
  whisperProgress.textContent = `bisik-bisik ${whisperIndex + 1}/${total}`;
  whisperText.textContent = CONFIG.whispers[whisperIndex];
  btnNextWhisper.textContent = whisperIndex === total - 1 ? "Baca Suratnya" : "Lanjut";
}

btnNextWhisper.addEventListener("click", () => {
  whisperIndex++;
  if (whisperIndex < CONFIG.whispers.length) {
    renderWhisper();
  } else {
    renderLetter();
    showScreen("letter");
  }
});

/* ============================================================
   Screen 4 — Final letter
   ============================================================ */
function renderLetter() {
  document.getElementById("fromLabel").textContent = CONFIG.senderLabel;
  document.getElementById("letterTitle").textContent = CONFIG.letterTitle;

  const body = document.getElementById("letterBody");
  body.innerHTML = "";
  CONFIG.letterParagraphs.forEach((p) => {
    const para = document.createElement("p");
    para.textContent = p;
    para.style.margin = "0 0 12px";
    body.appendChild(para);
  });
}

document.getElementById("btnFinish").addEventListener("click", () => {
  document.getElementById("closingText").textContent = CONFIG.closingText;
  showScreen("closing");
});

/* ============================================================
   Screen 5 — Closing / restart
   ============================================================ */
document.getElementById("btnRestart").addEventListener("click", () => {
  entered = "";
  refreshDots();
  lockCard.classList.remove("is-unlocked");
  lockIcon.textContent = "🔒";
  showScreen("envelope");
});

/* ============================================================
   Init
   ============================================================ */
buildDots();
buildKeypad();
spawnPetals();