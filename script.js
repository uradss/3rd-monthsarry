// ===== I-EDIT DITO =====
const HER_NAME = "Baby ko";

const TRACKS = [
  { title: "A Thousand Years", artist: "Christina Perri", src: "src/assets/music/A thousand Years.mp3", cover: "src/assets/images/heart.jpg" },
];

const MAIN_LETTER = {
  title: "Happy 3rd Monthsarry Baby",
  date: "9/30/2026",
  body: "Hi baby ko una sa lahat gusto ko muna mag pasalamat sayo sa pag tanggap mo saakin as your boyfriend and we're 3months na and still counting no and I'm really sorry sa mga nagawa ko na nakakasakit sayo and syempre hindi naman din natin mapigilan mag away dahil sa hindi pag kakaunawaan o misunderstanding but yon mas pinili pa natin na ayusin lahat kesa mag hiwalay kasi hindi naman yun yung solution to fix it right? hayaan mo mas pag iigihan ko pa bilang boyfriend mo to make you happy always and being comfortable with me, safe na ikaw saakin baby I will protect you always and I'm always here if you have a problems just say it to me I will help you to fix it and comfort you to make you ok kung math yan waahha kay mo nayan, and sobrang ganda mo baby hehehehehehe pakiss nga and yon sorry sa lahat and always remember that you're worth it. mag tulungan lang tayo baby para maging successfull couple tayong dalawa hanggang sa yumaman tayo and yun lang and syempre dahil wala ako jan alagaan mo sarili mo always wag kang mag papalipas ng gutom and ingat ikaw palagi sa mga lakad mo lalo na pag nag jojogging ikaw o walking and ingat ikaw palagi mahal na mahal kita baby. Happy 3rd Monthsarry I love you"
};

const WORDS = ["hi baby", "mwaaaaaa", "pakisss", "sakin lang ikawwww", "labyuu", "ganda moo", "cutee mo so muchhhh", "sakin kalang uli", "syimpri sayo lang din aku", "mwaaaaa", "mwaaaa mwaaa", "mwaaaaa", "i love you", "hehehehe"];

// =======================

const $ = id => document.getElementById(id);
$("herName").textContent = HER_NAME;

const modal = $("modal");
modal.addEventListener("click", e => { if (e.target === modal) modal.close(); });

// Player
const audio = $("audio"), wave = $("wave"), play = $("play"), seek = $("seek");
let idx = 0;
let unlocked = false;

for (let i = 0; i < 30; i++) wave.append(document.createElement("i"));
const fmt = s => isNaN(s) ? "0:00" : Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");

function load(i) {
  const t = TRACKS[i];
  $("title").textContent = t.title;
  $("artist").textContent = t.artist;
  audio.onerror = () => {
    $("artist").textContent = "Wala pang mp3 sa " + t.src;
    setPlaying(false);
  };
  audio.src = t.src;
  const img = new Image();
  img.onload = () => {
    $("cover").style.backgroundImage = `url(${t.cover})`;
    $("cover").classList.add("has");
  };
  img.src = t.cover;
}

// Music visualizer
let ac, an, data, raf;
function initAudio() {
  if (ac) return;
  ac = new (window.AudioContext || window.webkitAudioContext)();
  an = ac.createAnalyser();
  an.fftSize = 128;
  an.smoothingTimeConstant = 0.8;
  // createMediaElementSource ONCE only — before any play()
  ac.createMediaElementSource(audio).connect(an);
  an.connect(ac.destination);
  data = new Uint8Array(an.frequencyBinCount);
}

function draw() {
  raf = requestAnimationFrame(draw);
  const bars = wave.childNodes;
  if (an) {
    an.getByteFrequencyData(data);
    bars.forEach((b, i) => {
      const v = data[1 + Math.floor(i * 1.6)] / 255;
      b.style.height = (12 + Math.pow(v, 1.3) * 88) + "%";
    });
  } else if (Math.random() < 0.2) {
    bars.forEach(b => b.style.height = 15 + Math.random() * 85 + "%");
  }
}

function setPlaying(on) {
  play.textContent = on ? "❚❚" : "▶";
  cancelAnimationFrame(raf);
  if (on) {
    draw();
  } else {
    wave.childNodes.forEach(b => b.style.height = "20%");
  }
}

// Unlock AudioContext + start song (always create graph BEFORE play)
function unlockAndPlay() {
  if (location.protocol !== "file:") {
    initAudio();
    if (ac.state === "suspended") ac.resume();
  }
  unlocked = true;

  // remove one-time listeners
  document.removeEventListener("click", onFirstInteract);
  document.removeEventListener("touchstart", onFirstInteract);
  document.removeEventListener("keydown", onFirstInteract);

  if (audio.paused) {
    audio.play().catch(() => {});
  }
}

function onFirstInteract() {
  unlockAndPlay();
}

// First click / tap / key anywhere → unlock + play (once)
document.addEventListener("click", onFirstInteract, { once: true });
document.addEventListener("touchstart", onFirstInteract, { once: true, passive: true });
document.addEventListener("keydown", onFirstInteract, { once: true });

// Play / Pause button — no double play
play.onclick = (e) => {
  e.stopPropagation(); // para di ma-trigger yung document listener
  if (audio.paused) {
    unlockAndPlay();
  } else {
    audio.pause();
  }
};

audio.onplay = () => setPlaying(true);
audio.onpause = () => setPlaying(false);
audio.onloadedmetadata = () => $("dur").textContent = fmt(audio.duration);
audio.ontimeupdate = () => {
  $("cur").textContent = fmt(audio.currentTime);
  seek.value = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
};
audio.onended = () => step(1, true);

seek.oninput = () => {
  if (audio.duration) audio.currentTime = (seek.value / 100) * audio.duration;
};
$("vol").oninput = e => audio.volume = e.target.value;
audio.volume = 0.7;

function step(d, auto) {
  idx = (idx + d + TRACKS.length) % TRACKS.length;
  load(idx);
  if (auto || !audio.paused) {
    audio.play().catch(() => {});
  }
}
$("prev").onclick = (e) => { e.stopPropagation(); step(-1); };
$("next").onclick = (e) => { e.stopPropagation(); step(1); };

load(0);

// Main letter button (center of heart)
$("openLetter").onclick = () => {
  $("mTitle").textContent = MAIN_LETTER.title;
  $("mDate").textContent = MAIN_LETTER.date;
  $("mBody").textContent = MAIN_LETTER.body;
  modal.showModal();
};

// 3D scene: particle heart over a spiral galaxy, orbiting words, rising hearts
(function () {
  const cv = $("heart"), btn = $("openLetter"), T = THREE, TAU = Math.PI * 2, rnd = Math.random;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const r = new T.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
  r.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new T.Scene(), cam = new T.PerspectiveCamera(50, 1, 0.1, 200);
  const HEART_Y = 5.6;

  // round soft sprite
  const c2 = document.createElement("canvas"); c2.width = c2.height = 64;
  const g = c2.getContext("2d"), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "#fff"); gr.addColorStop(0.25, "rgba(255,255,255,.7)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  const DOT = new T.CanvasTexture(c2);
  const mat = (size, op = 1) => new T.PointsMaterial({ size, map: DOT, vertexColors: true, transparent: true, opacity: op, depthWrite: false, blending: T.AdditiveBlending });
  const geo = (p, c) => { const b = new T.BufferGeometry(); b.setAttribute("position", new T.BufferAttribute(p, 3)); b.setAttribute("color", new T.BufferAttribute(c, 3)); return b; };
  const glowSprite = (color, op, w, h, y) => { const s = new T.Sprite(new T.SpriteMaterial({ map: DOT, color, transparent: true, opacity: op, blending: T.AdditiveBlending, depthWrite: false })); s.scale.set(w, h, 1); s.position.y = y; scene.add(s); return s; };

  // heart
  const HN = 11000, hp = new Float32Array(HN * 3), hc = new Float32Array(HN * 3);
  const hcol = ["#ff3d8b", "#ff9cc4", "#ffffff"].map(c => new T.Color(c));
  for (let i = 0; i < HN; i++) {
    const t = rnd() * TAU, x = 16 * Math.pow(Math.sin(t), 3), y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const a = rnd() * TAU, rr = Math.pow(rnd(), 0.6) * 1.5;
    hp.set([(x + Math.cos(a) * rr) * 0.27, (y + Math.sin(a) * rr * 0.8) * 0.27, Math.sin(a) * rr * 0.5 + (rnd() - 0.5) * 0.5], i * 3);
    const c = hcol[rnd() < 0.7 ? 0 : rnd() < 0.7 ? 1 : 2]; hc.set([c.r, c.g, c.b], i * 3);
  }
  const heart = new T.Points(geo(hp, hc), mat(0.085)); heart.position.y = HEART_Y; scene.add(heart);
  const halo = glowSprite(0xff2f7f, 0.35, 11, 11, HEART_Y);

  // galaxy vortex
  const GN = 30000, gp = new Float32Array(GN * 3), gc = new Float32Array(GN * 3);
  const ci = new T.Color("#ffe3ef"), cm = new T.Color("#ff3d8b"), co = new T.Color("#7a1046");
  for (let i = 0; i < GN; i++) {
    const rad = Math.pow(rnd(), 1.7) * 17 + 0.7, ang = (i % 3) / 3 * TAU + rad * 0.42, sp = 0.25 + rad * 0.09;
    gp.set([Math.cos(ang) * rad + (rnd() - 0.5) * sp * (rnd() + 0.3) * 2, (rnd() - 0.5) * 0.35 * (1 + 1 / rad), Math.sin(ang) * rad + (rnd() - 0.5) * sp * (rnd() + 0.3) * 2], i * 3);
    const f = rad / 17.7, c = f < 0.25 ? ci.clone().lerp(cm, f * 4) : cm.clone().lerp(co, (f - 0.25) / 0.75);
    c.multiplyScalar(0.55 + rnd() * 0.6); gc.set([c.r, c.g, c.b], i * 3);
  }
  const galaxy = new T.Points(geo(gp, gc), mat(0.075, 0.9)); scene.add(galaxy);
  glowSprite(0xff5fa5, 0.75, 5, 2.2, 0);

  // background stars
  const SN = 900, sp = new Float32Array(SN * 3), sc = new Float32Array(SN * 3);
  for (let i = 0; i < SN; i++) {
    const d = 25 + rnd() * 40, a = rnd() * TAU, b = Math.acos(2 * rnd() - 1);
    sp.set([d * Math.sin(b) * Math.cos(a), Math.abs(d * Math.cos(b)) * 0.7, d * Math.sin(b) * Math.sin(a)], i * 3);
    sc.set([1, 0.7, 0.85], i * 3);
  }
  scene.add(new T.Points(geo(sp, sc), mat(0.22, 0.6)));

  // orbiting words
  const words = [];
  function label(text) {
    const k = document.createElement("canvas"), x = k.getContext("2d"), f = 'italic 700 54px "Cormorant Garamond",serif';
    x.font = f; k.width = Math.ceil(x.measureText(text).width) + 40; k.height = 90; x.font = f; x.textBaseline = "middle";
    x.shadowColor = "#ff2f7f"; x.shadowBlur = 18; x.fillStyle = "#ffd6e6"; x.fillText(text, 20, 47);
    const s = new T.Sprite(new T.SpriteMaterial({ map: new T.CanvasTexture(k), transparent: true, depthWrite: false }));
    s.scale.set(k.width / 90 * 0.62, 0.62, 1); return s;
  }
  function buildWords() {
    words.forEach(w => scene.remove(w.s)); words.length = 0;
    const n = WORDS.length * 2;
    for (let i = 0; i < n; i++) {
      const s = label(WORDS[i % WORDS.length]); scene.add(s);
      words.push({ s, r: 4.5 + i / n * 12 + rnd() * 1.2, a: rnd() * TAU, v: (0.09 + rnd() * 0.05) / Math.sqrt(4 + i * 0.5), y: 0.4 + rnd() * 1.6 });
    }
  }
  buildWords(); if (document.fonts) document.fonts.ready.then(buildWords);

  // rising mini hearts
  const hk = document.createElement("canvas"); hk.width = hk.height = 64;
  const hx = hk.getContext("2d"); hx.fillStyle = "#ff4d94"; hx.shadowColor = "#ff2f7f"; hx.shadowBlur = 10;
  hx.beginPath(); hx.moveTo(32, 54); hx.bezierCurveTo(4, 34, 10, 8, 32, 20); hx.bezierCurveTo(54, 8, 60, 34, 32, 54); hx.fill();
  const HT = new T.CanvasTexture(hk), mini = [];
  for (let i = 0; i < 34; i++) {
    const s = new T.Sprite(new T.SpriteMaterial({ map: HT, transparent: true, depthWrite: false })); scene.add(s);
    mini.push({ s, a: rnd() * TAU, r: 3 + rnd() * 13, y: rnd() * 9, v: 0.25 + rnd() * 0.5, sz: 0.3 + rnd() * 0.5, ph: rnd() * TAU });
  }

  // camera orbit
  let th = 0, ph = 1.2, dist = 20, tth = 0, tph = 1.2, tdist = 20, drag = false, lx = 0, ly = 0, idle = 0;
  cv.addEventListener("pointerdown", e => { drag = true; lx = e.clientX; ly = e.clientY; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener("pointerup", () => { drag = false; idle = 0; });
  cv.addEventListener("pointermove", e => {
    if (!drag) return;
    tth -= (e.clientX - lx) * 0.006;
    tph = Math.min(1.5, Math.max(0.55, tph - (e.clientY - ly) * 0.005));
    lx = e.clientX; ly = e.clientY;
  });
  cv.addEventListener("wheel", e => {
    e.preventDefault();
    tdist = Math.min(32, Math.max(11, tdist + e.deltaY * 0.01));
  }, { passive: false });

  function fit() {
    const w = cv.clientWidth, h = cv.clientHeight;
    r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
    tdist = dist = w / h < 0.8 ? 27 : 20;
  }
  addEventListener("resize", fit); fit();

  const clock = new T.Clock(), v3 = new T.Vector3();
  let last = 0;
  (function loop() {
    requestAnimationFrame(loop);
    const t = clock.getElapsedTime(), dt = Math.min(t - last, 0.05); last = t;
    heart.scale.setScalar(1 + 0.045 * Math.sin(t * 2.6));
    halo.material.opacity = 0.28 + 0.12 * Math.sin(t * 2.6);
    if (!still) {
      galaxy.rotation.y -= dt * 0.06; heart.rotation.y += dt * 0.35;
      words.forEach(w => {
        w.a += w.v * dt;
        w.s.position.set(Math.cos(w.a) * w.r, w.y + Math.sin(t + w.r) * 0.15, Math.sin(w.a) * w.r);
      });
      mini.forEach(m => {
        m.y += m.v * dt;
        if (m.y > 10) { m.y = 0.3; m.a = rnd() * TAU; }
        m.s.position.set(Math.cos(m.a + t * 0.05) * m.r + Math.sin(t + m.ph) * 0.4, m.y, Math.sin(m.a + t * 0.05) * m.r);
        m.s.material.opacity = Math.max(0, Math.min(1, m.y / 1.5, (10 - m.y) / 3)) * 0.9;
        m.s.scale.setScalar(m.sz);
      });
      idle += dt; if (!drag && idle > 3) tth += dt * 0.05;
    } else {
      words.forEach(w => w.s.position.set(Math.cos(w.a) * w.r, w.y, Math.sin(w.a) * w.r));
    }
    th += (tth - th) * 0.08; ph += (tph - ph) * 0.08; dist += (tdist - dist) * 0.08;
    cam.position.set(Math.sin(th) * Math.sin(ph) * dist, Math.cos(ph) * dist + 2, Math.cos(th) * Math.sin(ph) * dist);
    cam.lookAt(0, 3.6, 0);
    v3.set(0, HEART_Y, 0).project(cam);
    btn.style.left = (v3.x * 0.5 + 0.5) * cv.clientWidth + "px";
    btn.style.top = (-v3.y * 0.5 + 0.5) * cv.clientHeight + "px";
    r.render(scene, cam);
  })();
})();