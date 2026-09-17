/* ===== Hero slider ===== */
(function () {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const dotsWrap = document.getElementById("dots");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  if (!slides.length) return;

  let current = 0;
  let timer;
  const INTERVAL = 6000;

  // Build dots
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", "Go to slide " + (i + 1));
    if (i === 0) b.classList.add("is-active");
    b.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(b);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(index) {
    slides[current].classList.remove("is-active");
    dots[current].classList.remove("is-active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("is-active");
    dots[current].classList.add("is-active");
    restart();
  }

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  function restart() {
    clearInterval(timer);
    timer = setInterval(next, INTERVAL);
  }

  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  // Pause on hover
  const hero = document.getElementById("slider");
  hero.addEventListener("mouseenter", () => clearInterval(timer));
  hero.addEventListener("mouseleave", restart);

  // Keyboard support
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  // Basic touch swipe
  let startX = null;
  hero.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
  hero.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    startX = null;
  });

  restart();
})();

/* ===== Mobile nav ===== */
(function () {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
})();

/* ===== Contact form -> WhatsApp ===== */
function sendWhatsApp(e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const message = document.getElementById("message").value.trim();
  const text =
    `Hello RAKAEZ GOODS,%0A%0A` +
    `Name: ${encodeURIComponent(name)}%0A` +
    (phone ? `Phone: ${encodeURIComponent(phone)}%0A` : "") +
    `Message: ${encodeURIComponent(message)}`;
  window.open(`https://wa.me/971566224523?text=${text}`, "_blank");
  return false;
}

/* ===== Footer year ===== */
document.getElementById("year").textContent = new Date().getFullYear();
