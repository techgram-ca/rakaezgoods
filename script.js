/* =========================================================
   RAKAEZ GOODS — interactions
   ========================================================= */

/* ----- Header scroll state + progress bar ----- */
(function () {
  const header = document.getElementById("header");
  const progress = document.getElementById("progress");
  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle("scrolled", y > 30);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* ----- Hero slider (Ken Burns crossfade) ----- */
(function () {
  const slides = Array.from(document.querySelectorAll(".hero__slide"));
  const dotsWrap = document.getElementById("heroDots");
  if (!slides.length) return;
  let i = 0, timer;
  const INT = 6000;

  slides.forEach((_, idx) => {
    const b = document.createElement("button");
    b.setAttribute("aria-label", "Go to slide " + (idx + 1));
    if (idx === 0) b.classList.add("is-active");
    b.addEventListener("click", () => go(idx));
    dotsWrap.appendChild(b);
  });
  const dots = Array.from(dotsWrap.children);

  function go(n) {
    slides[i].classList.remove("is-active");
    dots[i] && dots[i].classList.remove("is-active");
    i = (n + slides.length) % slides.length;
    slides[i].classList.add("is-active");
    dots[i] && dots[i].classList.add("is-active");
    restart();
  }
  const next = () => go(i + 1);
  function restart() { clearInterval(timer); timer = setInterval(next, INT); }
  restart();
})();

/* ----- Mobile nav ----- */
(function () {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  if (!toggle || !nav) return;
  const close = () => { nav.classList.remove("is-open"); toggle.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); };
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
})();

/* ----- Reveal on scroll ----- */
(function () {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
  els.forEach((e) => io.observe(e));
})();

/* ----- Animated counters ----- */
(function () {
  const counters = document.querySelectorAll(".count");
  if (!counters.length) return;
  const run = (el) => {
    const target = +el.dataset.target;
    const dur = 1600, start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (!("IntersectionObserver" in window)) { counters.forEach(run); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
  }, { threshold: 0.6 });
  counters.forEach((c) => io.observe(c));
})();

/* ----- Global sourcing map ----- */
(function () {
  const mount = document.getElementById("worldMap");
  if (!mount) return;

  const W = 1000, H = 500;
  const HUB = { x: 655, y: 182 }; // Dubai (equirectangular approx)

  // name, ISO code (for flag image), x, y, mode
  const origins = [
    { n: "Netherlands", c: "nl", x: 515, y: 108, m: "air" },
    { n: "Spain",       c: "es", x: 490, y: 140, m: "sea" },
    { n: "Turkey",      c: "tr", x: 597, y: 146, m: "sea" },
    { n: "Egypt",       c: "eg", x: 585, y: 178, m: "air" },
    { n: "Kenya",       c: "ke", x: 606, y: 250, m: "air" },
    { n: "South Africa",c: "za", x: 567, y: 332, m: "sea" },
    { n: "India",       c: "in", x: 716, y: 196, m: "air" },
    { n: "Thailand",    c: "th", x: 778, y: 210, m: "air" },
    { n: "China",       c: "cn", x: 792, y: 156, m: "sea" },
    { n: "Peru",        c: "pe", x: 292, y: 280, m: "air" },
    { n: "Chile",       c: "cl", x: 305, y: 344, m: "sea" },
    { n: "USA",         c: "us", x: 232, y: 150, m: "sea" },
    { n: "Australia",   c: "au", x: 865, y: 320, m: "sea" },
  ];

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

  const frag = document.createDocumentFragment();

  // routes first (under nodes)
  origins.forEach((o, idx) => {
    const mx = (o.x + HUB.x) / 2;
    const my = (o.y + HUB.y) / 2;
    const dist = Math.hypot(HUB.x - o.x, HUB.y - o.y);
    const cy = my - dist * 0.28;
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", `M ${o.x} ${o.y} Q ${mx} ${cy} ${HUB.x} ${HUB.y}`);
    path.setAttribute("class", "route route--" + o.m);
    path.style.animationDelay = (idx * 0.18) + "s";
    frag.appendChild(path);
  });

  // origin nodes
  origins.forEach((o) => {
    const c = document.createElementNS(svgNS, "circle");
    c.setAttribute("cx", o.x); c.setAttribute("cy", o.y); c.setAttribute("r", 4.5);
    c.setAttribute("class", "node node--" + o.m);
    frag.appendChild(c);
  });

  // Dubai hub — pulse rings + glow + label
  [16, 26].forEach((r, k) => {
    const ring = document.createElementNS(svgNS, "circle");
    ring.setAttribute("cx", HUB.x); ring.setAttribute("cy", HUB.y); ring.setAttribute("r", r);
    ring.setAttribute("class", "node-pulse");
    const an = document.createElementNS(svgNS, "animate");
    an.setAttribute("attributeName", "r"); an.setAttribute("values", `${r};${r + 16}`);
    an.setAttribute("dur", "2.6s"); an.setAttribute("begin", (k * 0.8) + "s"); an.setAttribute("repeatCount", "indefinite");
    const ao = document.createElementNS(svgNS, "animate");
    ao.setAttribute("attributeName", "opacity"); ao.setAttribute("values", "0.5;0");
    ao.setAttribute("dur", "2.6s"); ao.setAttribute("begin", (k * 0.8) + "s"); ao.setAttribute("repeatCount", "indefinite");
    ring.appendChild(an); ring.appendChild(ao);
    frag.appendChild(ring);
  });
  const hub = document.createElementNS(svgNS, "circle");
  hub.setAttribute("cx", HUB.x); hub.setAttribute("cy", HUB.y); hub.setAttribute("r", 7);
  hub.setAttribute("class", "hub-glow");
  frag.appendChild(hub);

  const hubLabel = document.createElementNS(svgNS, "text");
  hubLabel.setAttribute("x", HUB.x + 14); hubLabel.setAttribute("y", HUB.y + 5);
  hubLabel.setAttribute("class", "hub-label"); hubLabel.textContent = "Dubai";
  frag.appendChild(hubLabel);

  // a few origin labels (avoid clutter — label the widely-spread ones)
  const labelled = { "Netherlands": [8, -8], "South Africa": [8, 16], "Peru": [-8, -8], "China": [10, -6], "Australia": [8, 16], "India": [8, 16] };
  origins.forEach((o) => {
    if (!labelled[o.n]) return;
    const [dx, dy] = labelled[o.n];
    const t = document.createElementNS(svgNS, "text");
    t.setAttribute("x", o.x + dx); t.setAttribute("y", o.y + dy);
    if (dx < 0) t.setAttribute("text-anchor", "end");
    t.setAttribute("class", "node-label"); t.textContent = o.n;
    frag.appendChild(t);
  });

  svg.appendChild(frag);
  mount.appendChild(svg);

  // country chips (flag images via flagcdn — rendered by the visitor's browser)
  const airWrap = document.getElementById("airChips");
  const seaWrap = document.getElementById("seaChips");
  const extraAir = [{ n: "Jordan", c: "jo" }, { n: "Lebanon", c: "lb" }, { n: "Vietnam", c: "vn" }, { n: "Ethiopia", c: "et" }];
  const extraSea = [{ n: "Brazil", c: "br" }, { n: "New Zealand", c: "nz" }, { n: "Iran", c: "ir" }, { n: "Pakistan", c: "pk" }, { n: "Morocco", c: "ma" }];
  const makeChip = (o) => {
    const s = document.createElement("span");
    s.className = "chip";
    s.innerHTML =
      `<img class="chip__flag" src="https://flagcdn.com/w40/${o.c}.png" ` +
      `srcset="https://flagcdn.com/w80/${o.c}.png 2x" width="26" height="18" ` +
      `alt="${o.n} flag" loading="lazy" />${o.n}`;
    return s;
  };
  origins.filter((o) => o.m === "air").concat(extraAir).forEach((o) => airWrap.appendChild(makeChip(o)));
  origins.filter((o) => o.m === "sea").concat(extraSea).forEach((o) => seaWrap.appendChild(makeChip(o)));
})();

/* ----- Client logo marquees -----
   NOTE: These are the UAE hospitality & retail brands RAKAEZ GOODS supplies,
   shown as styled wordmarks. Replace with official logo image assets once you
   have permission/artwork, and only list brands you actually supply.          */
(function () {
  const hotels = [
    "Atlantis", "Jumeirah", "Address Hotels", "Rotana", "Kempinski",
    "Fairmont", "Anantara", "Marriott", "Hilton", "Emirates Palace",
  ];
  const retail = [
    "Carrefour", "LuLu Hypermarket", "Spinneys", "Union Coop",
    "Choithrams", "Al Maya", "Nesto", "Géant", "West Zone",
  ];
  const fill = (id, names) => {
    const track = document.getElementById(id);
    if (!track) return;
    const add = () => names.forEach((n) => {
      const d = document.createElement("div");
      d.className = "logo-pill"; d.textContent = n;
      track.appendChild(d);
    });
    add(); add(); // duplicate for seamless loop
  };
  fill("logosHotels", hotels);
  fill("logosRetail", retail);
})();

/* ----- Purpose accordion (drives the crossfading image) ----- */
(function () {
  const acc = document.getElementById("purposeAcc");
  if (!acc) return;
  const items = Array.from(acc.querySelectorAll(".acc"));
  const media = Array.from(document.querySelectorAll(".pmedia"));
  const badge = document.getElementById("purposeBadge");
  const open = (idx) => {
    items.forEach((it, i) => {
      const on = i === idx;
      it.classList.toggle("is-active", on);
      const head = it.querySelector(".acc__head");
      if (head) head.setAttribute("aria-expanded", String(on));
    });
    media.forEach((m) => m.classList.toggle("is-active", +m.dataset.i === idx));
    if (badge && items[idx].dataset.badge) badge.textContent = items[idx].dataset.badge;
  };
  items.forEach((it, i) => {
    const head = it.querySelector(".acc__head");
    if (head) head.addEventListener("click", () => open(i));
  });
})();

/* ----- KPI progress bars (fill on scroll) ----- */
(function () {
  const kpis = Array.from(document.querySelectorAll(".kpi"));
  if (!kpis.length) return;
  const fill = (el) => {
    const pct = Math.max(0, Math.min(100, +el.dataset.pct || 0));
    el.style.setProperty("--fill", pct + "%");
    el.classList.add("filled");
  };
  if (!("IntersectionObserver" in window)) { kpis.forEach(fill); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { fill(en.target); io.unobserve(en.target); } });
  }, { threshold: 0.35 });
  kpis.forEach((k) => io.observe(k));
})();

/* ----- Who We Are: feature selector drives image + caption ----- */
(function () {
  const wrap = document.getElementById("aboutFeatures");
  if (!wrap) return;
  const feats = Array.from(wrap.querySelectorAll(".feature"));
  const imgs = Array.from(document.querySelectorAll(".amedia"));
  const tagNum = document.getElementById("aboutTagNum");
  const tagTxt = document.getElementById("aboutTagTxt");
  const sel = (i) => {
    feats.forEach((f, k) => f.classList.toggle("is-active", k === i));
    imgs.forEach((im) => im.classList.toggle("is-active", +im.dataset.i === i));
    const f = feats[i];
    if (tagNum) tagNum.textContent = f.dataset.title || "";
    if (tagTxt) tagTxt.textContent = f.dataset.sub || "";
  };
  feats.forEach((f, i) => {
    f.addEventListener("click", () => sel(i));
    f.addEventListener("mouseenter", () => sel(i));
  });
})();

/* ----- Operations stepper (auto-advancing, click to select) ----- */
(function () {
  const stepper = document.getElementById("opsStepper");
  if (!stepper) return;
  const steps = Array.from(stepper.querySelectorAll(".step"));
  const imgs = Array.from(document.querySelectorAll(".opsimg"));
  const DUR = 5000;
  let idx = 0, timer, started = false;
  const go = (n) => {
    idx = (n + steps.length) % steps.length;
    steps.forEach((s, i) => s.classList.toggle("is-active", i === idx));
    imgs.forEach((im) => im.classList.toggle("is-active", +im.dataset.i === idx));
    const bar = steps[idx].querySelector(".step__bar i");
    if (bar) { bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = ""; }
  };
  const play = () => { clearInterval(timer); timer = setInterval(() => go(idx + 1), DUR); };
  steps.forEach((s, i) => s.addEventListener("click", () => { go(i); play(); }));
  stepper.addEventListener("mouseenter", () => clearInterval(timer));
  stepper.addEventListener("mouseleave", play);
  const start = () => { if (started) return; started = true; go(0); play(); };
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((e) => { e.forEach((en) => { if (en.isIntersecting) { start(); io.disconnect(); } }); }, { threshold: 0.3 });
    io.observe(stepper);
  } else { start(); }
})();

/* ----- Cursor spotlight (Quality, KPIs, Segments) ----- */
(function () {
  if (window.matchMedia("(hover: none)").matches) return;
  document.querySelectorAll(".spotlight").forEach((grid) => {
    Array.from(grid.children).forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
        card.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
      });
    });
  });
})();

/* ----- Contact form -> WhatsApp ----- */
function sendWhatsApp(e) {
  e.preventDefault();
  const v = (id) => (document.getElementById(id).value || "").trim();
  const name = v("name"), phone = v("phone"), company = v("company"), message = v("message");
  const text =
    `Hello RAKAEZ GOODS,%0A%0A` +
    `Name: ${encodeURIComponent(name)}%0A` +
    (company ? `Company: ${encodeURIComponent(company)}%0A` : "") +
    (phone ? `Phone: ${encodeURIComponent(phone)}%0A` : "") +
    `Requirements: ${encodeURIComponent(message)}`;
  window.open(`https://wa.me/971566224523?text=${text}`, "_blank");
  return false;
}

/* ----- Footer year ----- */
document.getElementById("year").textContent = new Date().getFullYear();
