/* ===========================
   ÍNTIMA — app.js
   =========================== */

// ---- STATE ----
let playing    = false;
let progress   = 0;       // 0–100
let timer      = null;
let speedIdx   = 1;
let muted      = false;
let volume     = 80;
let totalSec   = 120;     // prévia: 2 minutos
let currentPremium = false;

const SPEEDS = [0.75, 1, 1.25, 1.5];

// ---- AUDIO DATA ----
// Quando tiver os arquivos de áudio reais, coloque-os em /public/audio/
// e atualize os caminhos abaixo.
const TRACKS = {
  intenso:  { src: 'https://res.cloudinary.com/dgyqkpsby/video/upload/v1776252019/intenso_preview_ezenoq.mp3',   dur: 522 },  // 8:42
  poder:    { src: 'https://res.cloudinary.com/dgyqkpsby/video/upload/v1776252019/poder_preview_cmrboe.mp3',      dur: 555 },  // 9:15
  semfiltro:{ src: 'https://res.cloudinary.com/dgyqkpsby/video/upload/v1776252020/semfiltro_preview_m3epht.mp3',  dur: 538 },  // 8:58
  asmr:     { src: 'https://res.cloudinary.com/dgyqkpsby/video/upload/v1776252017/asmr_preview_lmjuhw.mp3',       dur: 602 },  // 10:02
  diverso:  { src: 'https://res.cloudinary.com/dgyqkpsby/video/upload/v1776252019/diverso_preview_ncslym.mp3',    dur: 573 },  // 9:33
};

let audioEl = null;  // HTMLAudioElement quando áudio real estiver disponível

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  buildWaveform();
  updateDisplay();
  initHamburger();
});

// ---- WAVEFORM ----
function buildWaveform() {
  const container = document.getElementById('waveform-bars');
  if (!container) return;
  container.innerHTML = '';
  const count = 90;
  for (let i = 0; i < count; i++) {
    const h = 8 + Math.abs(Math.sin(i * 0.4 + Math.random())) * 44;
    const bar = document.createElement('div');
    bar.className = 'wbar';
    bar.style.height = h + 'px';
    bar.dataset.idx = i;
    container.appendChild(bar);
  }
}

function updateWaveform() {
  const bars = document.querySelectorAll('.wbar');
  const filled = Math.floor((progress / 100) * bars.length);
  bars.forEach((b, i) => b.classList.toggle('played', i < filled));

  const cursor = document.getElementById('waveform-cursor');
  const waveform = document.getElementById('waveform');
  if (cursor && waveform) {
    cursor.style.left = (progress / 100 * waveform.offsetWidth) + 'px';
  }
}

// ---- TIME FORMAT ----
function fmt(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ':' + (s < 10 ? '0' : '') + s;
}

// ---- DISPLAY UPDATE ----
function updateDisplay() {
  const fill  = document.getElementById('progress-fill');
  const thumb = document.getElementById('progress-thumb');
  const cur   = document.getElementById('time-cur');
  const tot   = document.getElementById('time-tot');

  if (fill)  fill.style.width = progress + '%';
  if (thumb) thumb.style.left = progress + '%';
  if (cur)   cur.textContent  = fmt((progress / 100) * totalSec);
  if (tot)   tot.textContent  = fmt(totalSec);

  updateWaveform();
}

// ---- PLAY / PAUSE ----
function togglePlay() {
  // Se for premium e não tiver acesso, redirecionar para planos
  if (currentPremium) {
    const planosEl = document.getElementById('planos');
    if (planosEl) planosEl.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  playing = !playing;

  const iconPlay  = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');

  if (playing) {
    if (iconPlay)  iconPlay.style.display  = 'none';
    if (iconPause) iconPause.style.display = 'block';
    startTimer();

    // Se tiver áudio real carregado
    if (audioEl) {
      audioEl.play();
      return;
    }

  } else {
    if (iconPlay)  iconPlay.style.display  = 'block';
    if (iconPause) iconPause.style.display = 'none';
    clearInterval(timer);

    if (audioEl) audioEl.pause();
  }
}

function startTimer() {
  clearInterval(timer);
  const speed = SPEEDS[speedIdx];
  timer = setInterval(() => {
    progress += (100 / totalSec) * (0.1 * speed);
    if (progress >= 100) {
      progress = 0;
      playing  = false;
      const ip = document.getElementById('icon-play');
      const ia = document.getElementById('icon-pause');
      if (ip) ip.style.display  = 'block';
      if (ia) ia.style.display  = 'none';
      clearInterval(timer);
    }
    updateDisplay();
  }, 100);
}

// ---- SEEK ----
function seekTrack(e) {
  const track = e.currentTarget;
  const rect  = track.getBoundingClientRect();
  progress    = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
  updateDisplay();

  if (audioEl) {
    audioEl.currentTime = (progress / 100) * totalSec;
  }

  if (playing) {
    clearInterval(timer);
    startTimer();
  }
}

// ---- SKIP ----
function skipBack() {
  const skipSec = 10;
  progress = Math.max(0, progress - (skipSec / totalSec) * 100);
  updateDisplay();
  if (audioEl) audioEl.currentTime = (progress / 100) * totalSec;
}

function skipFwd() {
  const skipSec = 10;
  progress = Math.min(100, progress + (skipSec / totalSec) * 100);
  updateDisplay();
  if (audioEl) audioEl.currentTime = (progress / 100) * totalSec;
}

// ---- SPEED ----
function cycleSpeed() {
  speedIdx = (speedIdx + 1) % SPEEDS.length;
  const label = document.getElementById('speed-label');
  if (label) label.textContent = SPEEDS[speedIdx] + '×';

  if (audioEl) audioEl.playbackRate = SPEEDS[speedIdx];

  if (playing) {
    clearInterval(timer);
    startTimer();
  }
}

// ---- VOLUME ----
function setVolume(val) {
  volume = parseInt(val);
  if (audioEl) audioEl.volume = volume / 100;
}

// ---- SELECT CARD ----
function selectCard(el) {
  // Parar reprodução atual
  if (playing) togglePlay();
  progress = 0;

  // Atualizar cards
  document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');

  // Ler dados do card
  const title   = el.dataset.title;
  const linha   = el.dataset.linha;
  const desc    = el.dataset.desc;
  const premium = el.dataset.premium === 'true';

  currentPremium = premium;

  // Atualizar player header
  const elTitle = document.getElementById('player-title');
  const elLinha = document.getElementById('player-linha');
  const elDesc  = document.getElementById('player-desc');
  const elLock  = document.getElementById('player-lock');
  const elPrev  = document.getElementById('preview-label');
  const elPrem  = document.getElementById('premium-label');
  const elCta   = document.getElementById('player-cta');

  if (elTitle) elTitle.textContent = title;
  if (elLinha) elLinha.textContent = linha;
  if (elDesc)  elDesc.textContent  = desc;

  if (premium) {
    if (elLock) elLock.style.display = 'flex';
    if (elPrev) elPrev.style.display = 'none';
    if (elPrem) elPrem.style.display = 'block';
    if (elCta)  elCta.style.display  = 'block';
  } else {
    if (elLock) elLock.style.display = 'none';
    if (elPrev) elPrev.style.display = 'block';
    if (elPrem) elPrem.style.display = 'none';
    if (elCta)  elCta.style.display  = 'block';
  }

  // Reconstruir waveform
  buildWaveform();
  updateDisplay();

  // Scroll suave para player
  const playerSection = document.querySelector('.player-section');
  if (playerSection) {
    setTimeout(() => {
      playerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  // Carregar áudio real se disponível
  loadAudio(el.dataset.linha);
}

// ---- LOAD AUDIO (quando arquivos reais estiverem disponíveis) ----
function loadAudio(linha) {
  // Mapeamento linha → chave
  const map = {
    'Linha Intenso':    'intenso',
    'Linha Poder':      'poder',
    'Linha Sem Filtro': 'semfiltro',
    'Linha ASMR Íntimo':'asmr',
    'Linha Diverso +40':'diverso',
  };

  const key   = map[linha];
  const track = TRACKS[key];
  if (!track) return;

  // Tenta carregar o áudio (vai funcionar quando os arquivos existirem)
  try {
    if (audioEl) {
      audioEl.pause();
      audioEl.src = '';
    }
    const a = new Audio();
    a.src = track.src;
    a.volume = volume / 100;
    a.playbackRate = SPEEDS[speedIdx];

    a.addEventListener('loadedmetadata', () => {
      totalSec = a.duration || track.dur;
      updateDisplay();
    });

    a.addEventListener('timeupdate', () => {
      if (!playing) return;
      progress = (a.currentTime / a.duration) * 100;
      updateDisplay();
    });

    a.addEventListener('ended', () => {
      progress = 0;
      playing  = false;
      const ip = document.getElementById('icon-play');
      const ia = document.getElementById('icon-pause');
      if (ip) ip.style.display  = 'block';
      if (ia) ia.style.display  = 'none';
      updateDisplay();
    });

    a.addEventListener('error', () => {
      // Áudio não encontrado — usa simulação
      audioEl = null;
      totalSec = track.dur;
      updateDisplay();
    });

    audioEl = a;
    totalSec = track.dur;
  } catch(e) {
    audioEl = null;
  }
}

// ---- FAQ ----
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');

  // Fechar todos
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));

  // Abrir o clicado (se estava fechado)
  if (!isOpen) item.classList.add('open');
}

// ---- HAMBURGER / MOBILE MENU ----
function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.remove('open');
}

// ---- WAVEFORM CLICK ----
document.addEventListener('DOMContentLoaded', () => {
  const waveform = document.getElementById('waveform');
  if (waveform) {
    waveform.addEventListener('click', (e) => {
      if (currentPremium) return;
      const rect = waveform.getBoundingClientRect();
      progress = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      updateDisplay();
      if (audioEl) audioEl.currentTime = (progress / 100) * totalSec;
      if (playing) { clearInterval(timer); startTimer(); }
    });
  }
});
