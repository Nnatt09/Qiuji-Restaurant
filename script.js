/* ── Custom cursor ── */
const cur = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cur.style.left = e.clientX + 'px';
  cur.style.top  = e.clientY + 'px';
});
document.querySelectorAll('a,button,.dish-card,.today-card,.drink-card,.side-row,.time-slot,.cinfo-row,.about-feat').forEach(el => {
  el.addEventListener('mouseenter', () => cur.classList.add('big'));
  el.addEventListener('mouseleave', () => cur.classList.remove('big'));
});

/* ── Nav scroll ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── Hero zoom on scroll ── */
const heroBg = document.getElementById('heroBg');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const vh = window.innerHeight;
  if (y < vh) {
    heroBg.style.animation = y > 0 ? 'none' : '';
    heroBg.style.transform = `scale(${1 + (y / vh) * 0.60})`;
  }
}, { passive: true });

/* ════════════════════════════════════════
   INFINITE AUTO-SCROLL CAROUSEL (Popular)
════════════════════════════════════════ */
(function initInfiniteCarousel() {
  const outer = document.getElementById('popularInfOuter');
  const track = document.getElementById('popularInfTrack');
  if (!outer || !track) return;

  const originalCards = Array.from(track.querySelectorAll('.inf-card'));
  const cardCount = originalCards.length;

  // Clone cards for seamless loop (prepend + append one full set)
  originalCards.forEach(card => track.appendChild(card.cloneNode(true)));
  originalCards.forEach(card => track.prepend(card.cloneNode(true)));

  const allCards = Array.from(track.querySelectorAll('.dish-card'));
  const SPEED = 0.4;
  let paused = false;
  let position = 0;

  function getCardWidth() {
    const c = allCards[0];
    return c ? c.offsetWidth + 20 : 320;
  }

  function animate() {
    if (!paused) {
      position += SPEED;
      const setWidth = getCardWidth() * cardCount;
      // Loop: if we've scrolled past two full sets, reset by one set
      if (position >= setWidth * 2) position -= setWidth;
      track.style.transform = `translateX(-${position}px)`;
    }
    requestAnimationFrame(animate);
  }

  // Start offset at one full set (the prepended clones)
  setTimeout(() => {
    position = getCardWidth() * cardCount;
    track.style.transform = `translateX(-${position}px)`;
    animate();
  }, 50);

  // Hover: pause + center + highlight
  allCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      paused = true;
      allCards.forEach(c => c.classList.remove('inf-focused'));
      card.classList.add('inf-focused');

      const outerRect = outer.getBoundingClientRect();
      const cardRect  = card.getBoundingClientRect();
      const diff = (cardRect.left + cardRect.width / 2) - (outerRect.left + outerRect.width / 2);
      position += diff;
      track.style.transition = 'transform 0.45s cubic-bezier(.25,.46,.45,.94)';
      track.style.transform  = `translateX(-${position}px)`;
    });
    card.addEventListener('mouseleave', () => {
      paused = false;
      card.classList.remove('inf-focused');
      track.style.transition = 'none';
    });
  });
})();

/* ════════════════════════════════════════
   MENU TAB SWITCHER
════════════════════════════════════════ */
const PANEL_MAP = {
  all:     'panel-all',
  special: 'panel-special',
  sides:   'panel-sides',
};

function switchTab(key, btn) {
  // Update active tab button
  document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');

  // Hide all panels then show target
  Object.values(PANEL_MAP).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  const target = document.getElementById(PANEL_MAP[key]);
  if (target) {
    target.style.display = 'block';
    // Re-trigger reveal animations for newly visible panels
    target.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      revealObserver.observe(el);
    });
  }
}

/* ════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

/* ── Time slot highlight ── */
(function () {
  const h = new Date().getHours() + new Date().getMinutes() / 60;
  const slots = document.querySelectorAll('.time-slot');
  if      (h >= 11   && h < 13.5) slots[0]?.classList.add('active');
  else if (h >= 13.5 && h < 16.5) slots[1]?.classList.add('active');
  else if (h >= 16.5 && h < 19)   slots[2]?.classList.add('active');
})();

/* ── Mobile menu ── */
function toggleMobile() {
  const m = document.getElementById('mobileMenu');
  const b = document.getElementById('burger');
  m.classList.toggle('open');
  b.classList.toggle('open');
  document.body.style.overflow = m.classList.contains('open') ? 'hidden' : '';
}
function closeMobile() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('burger').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Char counter ── */
function countChars() {
  const el = document.getElementById('fmsg');
  if (el.value.length > 500) el.value = el.value.slice(0, 500);
  document.getElementById('charCount').textContent = el.value.length;
}

/* ── Form submit ── */
function submitForm() {
  const name    = document.getElementById('fname').value.trim();
  const contact = document.getElementById('fcontact').value.trim();
  const msg     = document.getElementById('fmsg').value.trim();
  if (!name || !contact || !msg) {
    const btn = document.querySelector('.form-submit');
    btn.style.transform = 'translateX(-6px)';
    setTimeout(() => { btn.style.transform = 'translateX(6px)'; }, 80);
    setTimeout(() => { btn.style.transform = 'translateX(0)'; },   160);
    return;
  }
  document.getElementById('formArea').style.display    = 'none';
  document.getElementById('formSuccess').style.display = 'block';
}

/* ── Dish btn feedback ── */
document.querySelectorAll('.dish-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    const orig = this.textContent;
    this.textContent = '✓ 已備註';
    this.style.color = '#f5c518';
    setTimeout(() => { this.textContent = orig; this.style.color = ''; }, 1800);
  });
});

/* ── About image carousel ── */
const aboutImgs = document.querySelectorAll('.about-img img');
if (aboutImgs.length > 1) {
  let idx = 0;
  setInterval(() => {
    aboutImgs[idx].classList.remove('active');
    idx = (idx + 1) % aboutImgs.length;
    aboutImgs[idx].classList.add('active');
  }, 4500);
}

/* ── Init on DOMContentLoaded ── */
document.addEventListener('DOMContentLoaded', () => {
  // Activate default 'all' tab
  const defaultBtn = document.querySelector('.menu-tab.active') || document.querySelector('.menu-tab');
  switchTab('all', defaultBtn);
});