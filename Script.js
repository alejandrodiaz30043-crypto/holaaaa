/* ============================================================
   CONFIGURACIÓN — esto es lo único que tienes que editar tú
   ============================================================ */

// Tu nombre y (si quieres) el de ella. Si lo dejas vacío, no aparece.
const MI_NOMBRE = "";          // ej: "Alejandro"
const SU_NOMBRE = "";          // ej: "Ana" — si está vacío se usa "hola,"

// La música de fondo usa el archivo cancion.mp4 (súbelo junto a estos archivos
// en la misma carpeta). Si quieres cambiar la canción, reemplaza ese archivo
// por otro con el mismo nombre, o cambia el atributo src en el <audio> de index.html.

// Si quieres limitar a días específicos, pon aquí los números (ej: [4, 5, 11, 12]).
// Si lo dejas vacío [], cualquier día futuro del mes queda disponible para elegir.
const AVAILABLE_DAYS = [];

// Tu número de WhatsApp con código de país, sin "+", sin espacios ni guiones.
// Ejemplo Colombia: si tu celular es 300 123 4567, pon "573001234567"
const MI_WHATSAPP = "573227325292"; // <-- tu número

/* ============================================================
   CONTENIDO — textos de la carta
   ============================================================ */

const saludo = SU_NOMBRE ? `Hola ${SU_NOMBRE},` : "Hola,";
const firma = MI_NOMBRE ? `— ${MI_NOMBRE}` : "—";

const LETTER_TEXT = `${saludo}

Sé que no nos conocemos todavía, pero me gustaría cambiar eso. Me pareces alguien interesante y se me ocurrió que podríamos salir y ver qué tal nos llevamos.

No quiero que sea nada complicado ni forzado, solo una oportunidad de conocernos.

Por aquí te dejo varias opciones de plan, todas tranquilas, para que escojas la que más te llame — y también el día que mejor te quede.

De verdad espero que te animes, me haría muy feliz.

${firma}`;

const PLANS = [
  { icon: "🎬", name: "Cine o museo", desc: "Una peli y buena conversación" },
  { icon: "🎨", name: "Museo Botero", desc: "Arte, color y una caminata tranquila" },
  { icon: "🌿", name: "Jardín Botánico", desc: "Rodeados de flores y silencio" },
  { icon: "⛰️", name: "Monserrate", desc: "Una caminata con vista a la ciudad" },
  { icon: "🌳", name: "Parque Simón Bolívar", desc: "Aire libre, sin afán" },
  { icon: "🚂", name: "Turistrén", desc: "Un paseo distinto, fuera de lo común" },
  { icon: "🏞️", name: "Laguna de Guatavita", desc: "Historia, leyenda y buena caminata" },
  { icon: "🎥", name: "Autocinema Cajicá", desc: "Cine bajo las estrellas" },
  { icon: "☕", name: "La Candelaria", desc: "Café, calles coloniales y arte urbano" },
  { icon: "🦆", name: "Humedal Sta. María", desc: "Naturaleza tranquila, ideal para hablar" },
  { icon: "📚", name: "Biblioteca Virgilio Barco", desc: "Un lugar bonito para sentarnos a charlar" },
  { icon: "🛍️", name: "Mercado de Usaquén", desc: "Ferias, artesanías y algo rico de comer" }
];

/* ============================================================
   ESTADO
   ============================================================ */
let selectedPlan = null;
let selectedDay = null;

/* ============================================================
   NAVEGACIÓN ENTRE PANTALLAS
   ============================================================ */
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("is-active"));
  document.getElementById(id).classList.add("is-active");
}

/* ============================================================
   PANTALLA 1 -> 2: abrir el rollo
   ============================================================ */
document.getElementById("btn-open").addEventListener("click", (e) => {
  playPaperSound();
  playMusic();
  e.currentTarget.classList.add("is-opening");
  setTimeout(() => {
    showScreen("screen-letter");
    typeLetter();
  }, 340);
});

/* Sonido corto de papel, generado con Web Audio (no necesita archivo de audio aparte) */
function playPaperSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const duration = 0.25;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-3 * i / bufferSize);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 1200;
    const gain = ctx.createGain();
    gain.gain.value = 0.3;
    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start();
  } catch (err) {
    console.warn("No se pudo reproducir el sonido de papel:", err);
  }
}

/* Efecto máquina de escribir para la carta */
function typeLetter() {
  const el = document.getElementById("letter-text");
  const btn = document.getElementById("btn-continue-letter");
  el.textContent = "";
  btn.classList.add("is-hidden");
  let i = 0;
  const speed = 18; // ms por letra
  function step() {
    if (i <= LETTER_TEXT.length) {
      el.textContent = LETTER_TEXT.slice(0, i);
      i++;
      setTimeout(step, speed);
    } else {
      btn.classList.remove("is-hidden");
    }
  }
  step();
}

document.getElementById("btn-continue-letter").addEventListener("click", () => {
  showScreen("screen-question");
});

/* ============================================================
   PANTALLA 3: botón "sí" que crece, "no" que se escapa
   ============================================================ */
const noBtn = document.getElementById("btn-no");
const yesBtn = document.getElementById("btn-yes");
const questionButtons = document.getElementById("question-buttons");
let growLevel = 0;

function dodgeNo() {
  const w = questionButtons.clientWidth;
  const h = questionButtons.clientHeight;
  const bw = noBtn.offsetWidth || 60;
  const bh = noBtn.offsetHeight || 40;
  const x = Math.random() * Math.max(w - bw, 10);
  const y = Math.random() * Math.max(h - bh, 10);
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
  noBtn.style.transform = "none";
  growYes();
}
function growYes() {
  growLevel = Math.min(growLevel + 1, 6);
  const fontSize = 16 + growLevel * 3;
  const pad = 10 + growLevel * 3;
  yesBtn.style.fontSize = fontSize + "px";
  yesBtn.style.padding = pad + "px " + (pad * 2) + "px";
}
noBtn.addEventListener("mouseenter", dodgeNo);
noBtn.addEventListener("click", dodgeNo);
noBtn.addEventListener("touchstart", (e) => { e.preventDefault(); dodgeNo(); }, { passive: false });

yesBtn.addEventListener("click", () => {
  showScreen("screen-plans");
  renderPlans();
});

/* ============================================================
   PANTALLA 4: carrusel de planes
   ============================================================ */
function renderPlans() {
  const container = document.getElementById("plans-carousel");
  container.innerHTML = "";
  PLANS.forEach((plan, index) => {
    const card = document.createElement("li");
    card.className = "plan-card";
    card.setAttribute("role", "button");
    card.tabIndex = 0;
    card.innerHTML = `
      <span class="plan-icon">${plan.icon}</span>
      <p class="plan-name">${plan.name}</p>
      <p class="plan-desc">${plan.desc}</p>
    `;
    const selectCard = () => {
      document.querySelectorAll(".plan-card").forEach(c => c.classList.remove("is-selected"));
      card.classList.add("is-selected");
      selectedPlan = plan;
      document.getElementById("btn-continue-plan").classList.remove("is-hidden");
    };
    card.addEventListener("click", selectCard);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectCard();
      }
    });
    container.appendChild(card);
  });
}
document.getElementById("btn-continue-plan").addEventListener("click", () => {
  showScreen("screen-calendar");
  renderCalendar();
});
document.getElementById("btn-back-plan").addEventListener("click", () => {
  showScreen("screen-question");
});
document.getElementById("btn-back-day").addEventListener("click", () => {
  showScreen("screen-plans");
});

/* ============================================================
   PANTALLA 5: calendario del mes actual
   ============================================================ */
const MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

function renderCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();

  document.getElementById("calendar-month").textContent =
    MESES[month].charAt(0).toUpperCase() + MESES[month].slice(1) + " " + year;

  const tbody = document.getElementById("calendar-days");
  tbody.innerHTML = "";

  let rowCells = [];

  function flushRow() {
    if (rowCells.length === 0) return;
    while (rowCells.length < 7) {
      rowCells.push(document.createElement("td"));
    }
    const tr = document.createElement("tr");
    rowCells.forEach(td => tr.appendChild(td));
    tbody.appendChild(tr);
    rowCells = [];
  }

  for (let i = 0; i < firstWeekday; i++) {
    rowCells.push(document.createElement("td"));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const td = document.createElement("td");
    const btn = document.createElement("button");
    btn.textContent = day;
    const isPast = day < today.getDate();
    const isAvailable = (AVAILABLE_DAYS.length === 0 || AVAILABLE_DAYS.includes(day)) && !isPast;

    if (isAvailable) {
      btn.classList.add("is-available");
      btn.addEventListener("click", () => {
        document.querySelectorAll(".calendar-days button").forEach(b => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        selectedDay = day;
        document.getElementById("btn-continue-day").classList.remove("is-hidden");
      });
    } else {
      btn.disabled = true;
    }
    td.appendChild(btn);
    rowCells.push(td);

    if (rowCells.length === 7) flushRow();
  }
  flushRow();
}
document.getElementById("btn-continue-day").addEventListener("click", () => {
  showScreen("screen-confirm");
  const monthName = MESES[new Date().getMonth()];
  document.getElementById("confirm-text").textContent =
    `¿Confirmamos el ${selectedDay} de ${monthName} para ${selectedPlan.name}?`;
});

/* ============================================================
   PANTALLA 6: confirmar, confeti y notificación
   ============================================================ */
document.getElementById("btn-confirm").addEventListener("click", () => {
  const monthName = MESES[new Date().getMonth()];
  document.getElementById("confirm-text").textContent = "¡Nos vemos pronto!";
  document.getElementById("btn-confirm").classList.add("is-hidden");
  const peng = document.getElementById("confirm-penguin");
  peng.classList.remove("is-hidden");
  peng.classList.add("is-waving");
  launchConfettiFromCorners();

  const mensaje = `${SU_NOMBRE || "Ella"} eligió: ${selectedPlan.name}, el ${selectedDay} de ${monthName}.`;
  openWhatsAppNotification(mensaje);
  document.getElementById("sent-note").classList.remove("is-hidden");
});

function launchConfettiFromCorners() {
  const stage = document.getElementById("confetti-stage");
  const w = stage.clientWidth;
  const h = stage.clientHeight;
  const colors = ["#5DCAA5", "#F4C0D1", "#FAC775", "#D4537E", "#9FE1CB"];

  function burstFrom(x, y, dx, dy) {
    for (let i = 0; i < 8; i++) {
      const p = document.createElement("span");
      p.className = "confetti-piece";
      p.setAttribute("aria-hidden", "true");
      const color = colors[Math.floor(Math.random() * colors.length)];
      const pw = 4 + Math.random() * 4;
      const pl = 14 + Math.random() * 10;
      p.style.left = x + "px";
      p.style.top = y + "px";
      p.style.width = pw + "px";
      p.style.height = pl + "px";
      p.style.background = color;
      const angle = Math.random() * 40 - 20;
      p.style.transform = `rotate(${angle}deg)`;
      p.style.transition = "transform 950ms cubic-bezier(.2,.7,.3,1), opacity 950ms linear, top 950ms cubic-bezier(.2,.7,.3,1), left 950ms cubic-bezier(.2,.7,.3,1)";
      stage.appendChild(p);
      requestAnimationFrame(() => {
        p.style.top = (y + dy - 50 - Math.random() * 70) + "px";
        p.style.left = (x + dx * (0.6 + Math.random() * 0.9)) + "px";
        p.style.transform = `rotate(${angle + Math.random() * 360}deg)`;
        p.style.opacity = "0";
      });
      setTimeout(() => p.remove(), 1000);
    }
  }
  burstFrom(0, 0, w * 0.4, h * 0.3);
  burstFrom(w, 0, -w * 0.4, h * 0.3);
  burstFrom(0, h, w * 0.4, -h * 0.3);
  burstFrom(w, h, -w * 0.4, -h * 0.3);
}

/* Abre WhatsApp con el mensaje ya escrito, dirigido a tu número.
   Importante: quien confirma el plan tiene que tocar "Enviar" dentro de
   WhatsApp para que el mensaje realmente te llegue — no se envía solo.
   Si no configuraste MI_WHATSAPP, no hace nada. */
function openWhatsAppNotification(text) {
  if (!MI_WHATSAPP) {
    console.warn("Falta configurar MI_WHATSAPP en script.js");
    return;
  }
  const url = `https://wa.me/${MI_WHATSAPP}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
}

/* ============================================================
   MÚSICA DE FONDO (archivo de audio propio)
   ============================================================ */
const bgMusic = document.getElementById("bg-music");
let musicMuted = false;

bgMusic.addEventListener("canplaythrough", () => {
  document.getElementById("btn-mute").classList.remove("is-hidden");
}, { once: true });

function playMusic() {
  bgMusic.play().catch((err) => {
    console.error("No se pudo reproducir la música:", err);
  });
}

/* ============================================================
   LLUVIA DE FONDO: lirios y corazones cayendo lentamente
   ============================================================ */
const FALLING_SYMBOLS = [
  { ch: "❀", color: "#ED93B1" },
  { ch: "❁", color: "#9FE1CB" },
  { ch: "♥", color: "#D4537E" }
];

function spawnFallingItem() {
  const bg = document.getElementById("falling-bg");
  if (!bg) return;
  const item = document.createElement("span");
  const s = FALLING_SYMBOLS[Math.floor(Math.random() * FALLING_SYMBOLS.length)];
  item.className = "falling-item";
  item.textContent = s.ch;
  item.style.color = s.color;
  item.style.left = Math.random() * 100 + "vw";
  item.style.fontSize = (14 + Math.random() * 14) + "px";
  const duration = 9 + Math.random() * 8;
  item.style.animationDuration = duration + "s";
  item.addEventListener("animationend", () => item.remove());
  bg.appendChild(item);
}
setInterval(spawnFallingItem, 500);
for (let i = 0; i < 6; i++) setTimeout(spawnFallingItem, i * 300);

document.getElementById("btn-mute").addEventListener("click", (e) => {
  musicMuted = !musicMuted;
  bgMusic.muted = musicMuted;
  e.target.textContent = musicMuted ? "🔇" : "🔊";
});