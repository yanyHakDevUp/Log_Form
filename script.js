// LOG FORM — interactions & shop logic
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = matchMedia('(hover: hover)').matches;
const FREE_SHIP = 120;

/* ---------- SMOOTH INERTIA SCROLL (Lenis) ---------- */
let lenis = null;
if (window.Lenis && !reduce) {
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 });
  (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]'); if (!a || a.getAttribute('href').length < 2) return;
    const t = document.querySelector(a.getAttribute('href')); if (!t) return;
    e.preventDefault(); lenis.scrollTo(t, { duration: 1.6, easing: (x) => 1 - Math.pow(1 - x, 4) });
  });
}

/* ---------- PRODUCT DATA (edit here to add / change products) ---------- */
const PRODUCTS = [
  { id: 'hoodie-form', name: 'Form Hoodie', cat: 'Hoodies', price: 98, colors: ['#171717'], tag: 'New', desc: 'Heavyweight oversized hoodie. Tonal LF on the chest, full wear-the-form statement across the back.', spec: ['480 GSM brushed fleece', 'Oversized, drop shoulder', 'Ribbed cuffs & hem'], front: 'assets/hoodie-form-front.jpg', back: 'assets/hoodie-form-back.jpg' },
  { id: 'pants-wide', name: 'Wide Leg Pants', cat: 'Bottoms', price: 88, colors: ['#1e1e1e'], tag: 'New', desc: 'Relaxed wide-leg pants in washed black. The wordmark runs the length of the leg.', spec: ['380 GSM cotton twill', 'Wide straight leg', 'Embroidered LF at the hip'], front: 'assets/pants-wide-front.jpg', back: 'assets/pants-wide-back.jpg' },
  { id: 'jersey-ls', name: 'Log Jersey LS', cat: 'Long Sleeve', price: 72, colors: ['#E8E2D4', '#171717'], tag: 'New', desc: 'Long-sleeve football jersey with contrast panels. Numbered 01 on the back.', spec: ['260 GSM mesh cotton', 'Boxy fit', 'Contrast sleeve panels'], front: 'assets/jersey-ls-front.jpg', back: 'assets/jersey-ls-back.jpg' },
  { id: 'spine', name: 'Spine Tee', cat: 'Tees', price: 48, colors: ['#171717', '#F3F0E8'], tag: 'New', desc: 'Boxy oversized tee. Tiny LF embroidered on the chest, wordmark down the spine.', spec: ['320 GSM heavy cotton', 'Oversized boxy fit', 'Embroidered LF chest'], front: 'assets/tee-spine-front.jpg', back: 'assets/tee-spine-back.jpg' },
  { id: 'spec', name: 'Spec Tag Tee', cat: 'Tees', price: 52, colors: ['#E8E2D4'], tag: 'New', desc: 'Warm ivory tee with a spec block and barcode on the back. Numbered, logged.', spec: ['320 GSM heavy cotton', 'Oversized boxy fit', 'Screen-printed spec block'], front: 'assets/tee-spec-front.jpg', back: 'assets/tee-spec-back.jpg' },
  { id: 'tonal', name: 'Tonal Tee', cat: 'Tees', price: 56, colors: ['#333333'], tag: 'New', desc: 'Grey on charcoal. A giant LF that only shows in the light.', spec: ['320 GSM heavy cotton', 'Oversized boxy fit', 'Tonal oversized print'], front: 'assets/tee-tonal-front.jpg', back: 'assets/tee-tonal-back.jpg' },
  { id: 'grid', name: 'Grid Tee', cat: 'Tees', price: 54, colors: ['#171717'], tag: 'Limited', desc: 'Architectural line grid printed tone-on-tone, with the wordmark across the chest.', spec: ['320 GSM heavy cotton', 'Oversized boxy fit', 'Tone-on-tone grid print'], front: 'assets/tee-grid-front.jpg', back: 'assets/tee-grid-back.jpg' },
  { id: 'bone', name: 'Bone Tee', cat: 'Tees', price: 50, colors: ['#E4DFD2'], tag: 'New', desc: 'Bone-coloured tee with an oversized black LF across the back.', spec: ['320 GSM heavy cotton', 'Oversized boxy fit', 'Back print 30cm'], front: 'assets/tee-bone-front.jpg', back: 'assets/tee-bone-back.jpg' },
  { id: 'steel', name: 'Steel Tee', cat: 'Tees', price: 50, colors: ['#969696', '#171717'], tag: 'Limited', desc: 'Steel grey with a bold black LF and a numbered edition tag.', spec: ['320 GSM heavy cotton', 'Oversized boxy fit', 'Numbered /250'], front: 'assets/tee-steel-front.jpg', back: 'assets/tee-steel-back.jpg' },
];
const byId = (id) => PRODUCTS.find((p) => p.id === id);

/* ---------- RENDER CARDS ---------- */
const card = (p, cls = '') => `
  <article class="product pcard reveal ${cls}" data-id="${p.id}">
    <div class="pimg" data-tilt data-cursor="View" style="aspect-ratio:1000/1250">
      <img src="${p.front}" alt="${p.name} front" loading="lazy"><img src="${p.back}" alt="${p.name} back" class="alt" loading="lazy">
      <span class="tag">${p.tag}</span><button class="qv" type="button">Quick view</button>
    </div>
    <div class="pmeta"><h3>${p.name}</h3><span>$${p.price}</span></div>
    <div class="swatches">${p.colors.map((c) => `<i style="background:${c}"></i>`).join('')}</div>
  </article>`;

$('#featured').innerHTML = [
  card(byId('hoodie-form'), 'col-span-2 md:col-span-6'),
  card(byId('pants-wide'), 'col-span-1 md:col-span-3 md:mt-32'),
  card(byId('jersey-ls'), 'col-span-1 md:col-span-3'),
].join('');

const cats = ['All', ...new Set(PRODUCTS.map((p) => p.cat))];
$('#filters').innerHTML = cats.map((c, i) => `<button class="fbtn${i ? '' : ' on'}" data-c="${c}">${c}</button>`).join('');
$('#grid').innerHTML = PRODUCTS.map((p) => card(p)).join('');
$('#filters').addEventListener('click', (e) => {
  const b = e.target.closest('.fbtn'); if (!b) return;
  $$('.fbtn').forEach((x) => x.classList.toggle('on', x === b));
  $$('#grid .pcard').forEach((el) => {
    const show = b.dataset.c === 'All' || byId(el.dataset.id).cat === b.dataset.c;
    el.classList.toggle('hide', !show);
    if (show) { el.classList.remove('show'); requestAnimationFrame(() => el.classList.add('show')); }
  });
});

/* ---------- LOOKBOOK ---------- */
$('#lbTrack').innerHTML = PRODUCTS.map((p, i) => `
  <div class="lb" data-id="${p.id}"><div class="pimg" data-cursor="View"><img src="${i % 2 ? p.back : p.front}" alt="${p.name}" loading="lazy"></div>
  <p><span><b class="lbn">${String(i + 1).padStart(2, '0')}</b>${p.name}</span><span>$${p.price}</span></p></div>`).join('');
$('#lbTotal').textContent = String(PRODUCTS.length).padStart(2, '0');

/* ---------- PRELOADER ---------- */
(function () {
  const loader = $('#loader'), num = $('#loadnum');
  document.body.classList.add('locked');
  let n = 0;
  const t = setInterval(() => {
    n = Math.min(100, n + Math.ceil(Math.random() * 9));
    num.textContent = String(n).padStart(3, '0');
    if (n >= 100) {
      clearInterval(t);
      setTimeout(() => {
        loader.classList.add('done');
        document.body.classList.remove('locked');
        document.body.classList.add('ready');
        scramble();
      }, 250);
    }
  }, reduce ? 1 : 45);
})();

/* ---------- TEXT SCRAMBLE (hero eyebrow) ---------- */
function scramble() {
  const el = $('#scramble'); if (!el || reduce) return;
  const txt = el.dataset.text, chars = 'LOGFRM/—_01#', start = performance.now();
  (function step(now) {
    const p = Math.min(1, (now - start) / 1300);
    el.textContent = [...txt].map((c, i) => (c === ' ' || i < p * txt.length ? c : chars[Math.floor(Math.random() * chars.length)])).join('');
    if (p < 1) requestAnimationFrame(step); else el.textContent = txt;
  })(start);
}

/* ---------- HERO GARMENT STAGE ---------- */
/* hero photo: scroll parallax + fade, and pointer drift (desktop) */
(function () {
  if (reduce) return;
  const photo = $('#heroPhoto'), img = $('#heroImg'), hero = $('#hero');
  let mx = 0, my = 0;
  const run = () => {
    const y = Math.min(scrollY, innerHeight * 1.2);
    photo.style.transform = `translateY(${y * 0.25}px)`;
    img.style.setProperty('--dx', `${mx * -18}px`); img.style.setProperty('--dy', `${my * -12}px`);
    photo.style.opacity = Math.max(0, 1 - y / (innerHeight * 1.1));
  };
  addEventListener('scroll', run, { passive: true });
  if (canHover) hero.addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; run(); });
  run();
})();

/* horizontal drift for the big outline word */
(function () {
  if (reduce) return;
  const els = $$('[data-px]');
  const run = () => els.forEach((el) => {
    const r = el.parentElement.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
    el.style.transform = `translateX(${(r.top - innerHeight / 2) * parseFloat(el.dataset.px) * 4}px)`;
  });
  addEventListener('scroll', run, { passive: true }); run();
})();

/* ---------- ANNOUNCEMENT ---------- */
(function () {
  const items = $$('.ann'); let i = 0;
  setInterval(() => { items[i].classList.remove('is-on'); i = (i + 1) % items.length; items[i].classList.add('is-on'); }, 3500);
})();

/* ---------- SCROLL REVEAL ---------- */
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  const el = e.target, sibs = el.parentElement ? $$('.reveal', el.parentElement) : [el];
  setTimeout(() => el.classList.add('show'), Math.max(0, sibs.indexOf(el)) % 4 * 110);
  io.unobserve(el);
}), { threshold: 0.1 });
$$('.reveal, .ir').forEach((el) => io.observe(el)); // .ir = photo clip-path wipe

const st = $('#statement');
new IntersectionObserver(([e], o) => { if (e.isIntersecting) { st.classList.add('in'); o.disconnect(); } }, { threshold: 0.35 }).observe(st);

/* count-up stats */
new IntersectionObserver(([e], o) => {
  if (!e.isIntersecting) return; o.disconnect();
  $$('.count').forEach((c) => {
    const to = +c.dataset.to, t0 = performance.now();
    (function f(t) { const p = Math.min(1, (t - t0) / 1600); c.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); })(t0);
  });
}, { threshold: 0.4 }).observe($('#stats'));

/* ---------- NAV hide/show + mobile menu ---------- */
(function () {
  const nav = $('#nav'); let last = 0;
  nav.style.transition = 'transform .5s cubic-bezier(.7,0,.2,1)';
  addEventListener('scroll', () => { const y = scrollY; nav.style.transform = y > last && y > 200 ? 'translateY(-160%)' : ''; last = y; }, { passive: true });
  const m = $('#mobileMenu'), close = () => m.classList.remove('open');
  $('#menuBtn').addEventListener('click', () => m.classList.add('open'));
  $('#menuClose').addEventListener('click', close);
  $$('.mm').forEach((a) => a.addEventListener('click', close));
})();

/* ---------- TILT / PARALLAX / MAGNETIC / HERO MOUSE ---------- */
if (!reduce && canHover) {
  document.addEventListener('pointermove', (e) => {
    const c = e.target.closest && e.target.closest('[data-tilt]'); if (!c) return;
    const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    c.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  });
  document.addEventListener('pointerout', (e) => { const c = e.target.closest && e.target.closest('[data-tilt]'); if (c) c.style.transform = ''; });
  $$('.magnetic').forEach((b) => {
    b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`; });
    b.addEventListener('pointerleave', () => (b.style.transform = ''));
  });
}
(function () {
  if (reduce) return;
  const els = $$('.parallax');
  const run = () => els.forEach((el) => {
    const r = el.parentElement.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
    el.style.transform = `translateY(${(r.top + r.height / 2 - innerHeight / 2) * parseFloat(el.dataset.speed || .1)}px)`;
  });
  addEventListener('scroll', run, { passive: true }); run();
})();

/* ---------- LOOKBOOK horizontal scroll ---------- */
(function () {
  const sec = $('#lookbook'), track = $('#lbTrack'), bar = $('#lbBar'), num = $('#lbNum');
  const run = () => {
    const r = sec.getBoundingClientRect(), total = sec.offsetHeight - innerHeight;
    const p = Math.max(0, Math.min(1, -r.top / total));
    const dist = Math.max(0, track.scrollWidth - innerWidth + 40);
    track.style.transform = `translateX(${-p * dist}px)`;
    bar.style.transform = `scaleX(${p})`;
    num.textContent = String(Math.min(PRODUCTS.length, Math.floor(p * PRODUCTS.length) + 1)).padStart(2, '0');
  };
  addEventListener('scroll', run, { passive: true }); addEventListener('resize', run); run();
})();

/* ---------- CUSTOM CURSOR ---------- */
if (canHover && !reduce) {
  const cur = $('#cursor'), lab = $('#cursorLabel'); let x = 0, y = 0, tx = 0, ty = 0;
  document.body.classList.add('has-cursor');
  addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; cur.classList.add('on'); const t = e.target.closest && e.target.closest('[data-cursor]'); cur.classList.toggle('big', !!t); if (t) lab.textContent = t.dataset.cursor; });
  (function loop() { x += (tx - x) * .2; y += (ty - y) * .2; cur.style.transform = `translate(${x}px,${y}px)`; requestAnimationFrame(loop); })();
}

/* ---------- QUICK VIEW ---------- */
const modal = $('#qvModal'); let current = null, size = 'M';
const lock = (on) => { document.body.classList.toggle('locked', on); if (lenis) on ? lenis.stop() : lenis.start(); };
const closeModal = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); lock(false); };
$('#qvSizes').innerHTML = ['S', 'M', 'L', 'XL'].map((s) => `<button class="size${s === 'M' ? ' on' : ''}" data-s="${s}">${s}</button>`).join('');
$('#qvSizes').addEventListener('click', (e) => { const b = e.target.closest('.size'); if (!b) return; size = b.dataset.s; $$('.size').forEach((x) => x.classList.toggle('on', x === b)); });
function setView(v) { $('#qvImg2').style.opacity = v === 'back' ? 1 : 0; $$('.vbtn').forEach((b) => b.classList.toggle('on', b.dataset.v === v)); }
$$('.vbtn').forEach((b) => b.addEventListener('click', () => setView(b.dataset.v)));
function openQV(id) {
  current = byId(id);
  $('#qvImg').src = current.front; $('#qvImg2').src = current.back; setView('front');
  $('#qvName').textContent = current.name; $('#qvPrice').textContent = '$' + current.price;
  $('#qvDesc').textContent = current.desc; $('#qvCat').textContent = current.cat + ' — ' + current.tag;
  $('#qvSpec').innerHTML = current.spec.map((s) => `<li>— ${s}</li>`).join('');
  modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); lock(true);
}
document.addEventListener('click', (e) => {
  const c = e.target.closest('.pcard, .lb, .idx-row'); if (!c || e.target.closest('.swatches')) return;
  closeSearch(); openQV(c.dataset.id);
});
$$('[data-close]', modal).forEach((b) => b.addEventListener('click', closeModal));
addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeModal(); closeCart(); closeSearch(); } });

/* ---------- CART ---------- */
let cart = [];
try { cart = JSON.parse(localStorage.getItem('lf-cart') || '[]').filter((i) => byId(i.id)); } catch (e) {}
const cartEl = $('#cart');
const openCart = () => { cartEl.classList.add('open'); cartEl.setAttribute('aria-hidden', 'false'); lock(true); };
function closeCart() { cartEl.classList.remove('open'); cartEl.setAttribute('aria-hidden', 'true'); if (!modal.classList.contains('open')) lock(false); }
const toast = (msg) => { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2200); };
function renderCart() {
  const n = cart.reduce((a, i) => a + i.q, 0), total = cart.reduce((a, i) => a + i.q * byId(i.id).price, 0);
  $('#bagCount').textContent = n; $('#cartN').textContent = n; $('#cartTotal').textContent = '$' + total;
  const left = FREE_SHIP - total;
  $('#shipMsg').textContent = total === 0 ? `Free shipping over $${FREE_SHIP}` : left > 0 ? `You're $${left} away from free shipping` : 'You unlocked free shipping';
  $('#shipBar').style.width = Math.min(100, (total / FREE_SHIP) * 100) + '%';
  $('#cartItems').innerHTML = cart.length ? cart.map((it, idx) => { const p = byId(it.id); return `
    <div class="ci"><img src="${p.front}" alt="${p.name}"><div class="flex flex-col justify-between"><div><div class="flex justify-between font-display text-sm uppercase tracking-[.1em]"><span>${p.name}</span><span>$${p.price * it.q}</span></div><p class="mt-1 font-edit text-xs uppercase tracking-[.15em] text-char">Size ${it.s}</p></div>
    <div class="flex items-center justify-between"><div class="qty"><button data-a="dec" data-i="${idx}">−</button><span>${it.q}</span><button data-a="inc" data-i="${idx}">+</button></div><button data-a="rm" data-i="${idx}" class="link-u font-edit text-xs uppercase tracking-[.15em]">Remove</button></div></div></div>`; }).join('')
    : '<p class="p-8 font-edit text-sm uppercase tracking-[.2em] text-char">Your bag is empty.</p>';
  try { localStorage.setItem('lf-cart', JSON.stringify(cart)); } catch (e) {}
}
$('#cartItems').addEventListener('click', (e) => {
  const b = e.target.closest('[data-a]'); if (!b) return; const it = cart[+b.dataset.i];
  if (b.dataset.a === 'inc') it.q++; else if (b.dataset.a === 'dec') it.q--; else it.q = 0;
  cart = cart.filter((i) => i.q > 0); renderCart();
});
$('#qvAdd').addEventListener('click', () => {
  const ex = cart.find((i) => i.id === current.id && i.s === size);
  ex ? ex.q++ : cart.push({ id: current.id, s: size, q: 1 });
  renderCart(); closeModal(); openCart();
});
$('#bagBtn').addEventListener('click', openCart);
$$('[data-cclose]').forEach((b) => b.addEventListener('click', closeCart));
$('#checkout').addEventListener('click', () => toast(cart.length ? 'Demo site — checkout not connected' : 'Your bag is empty'));
renderCart();

/* ---------- SEARCH ---------- */
const searchEl = $('#search'), sInput = $('#searchInput');
function closeSearch() { searchEl.classList.remove('open'); searchEl.setAttribute('aria-hidden', 'true'); if (!modal.classList.contains('open')) lock(false); }
function results(q) {
  q = q.trim().toLowerCase();
  const list = q ? PRODUCTS.filter((p) => (p.name + p.cat + p.desc).toLowerCase().includes(q)) : PRODUCTS.slice(0, 4);
  $('#searchRes').innerHTML = list.length ? list.map((p) => `<button class="sr lb" data-id="${p.id}"><img src="${p.front}" alt=""><div><div class="font-display text-sm uppercase tracking-[.1em]">${p.name}</div><div class="font-edit text-xs uppercase tracking-[.2em] text-soft">${p.cat} — $${p.price}</div></div></button>`).join('') : '<p class="font-edit text-soft">No results.</p>';
}
$('#searchBtn').addEventListener('click', () => { searchEl.classList.add('open'); searchEl.setAttribute('aria-hidden', 'false'); lock(true); results(''); setTimeout(() => sInput.focus(), 300); });
$('#searchClose').addEventListener('click', closeSearch);
sInput.addEventListener('input', () => results(sInput.value));

/* ---------- CLOCK ---------- */
(function () {
  const c = $('#clock'), pad = (n) => String(n).padStart(2, '0');
  const tick = () => { const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' })); c.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; };
  tick(); setInterval(tick, 1000);
})();

/* ---------- BACK TO TOP + SCROLL PROGRESS ---------- */
(function () {
  const btn = $('#toTop'), ring = $('#toTopRing'), bar = $('#progress'), C = 138.2;
  const run = () => {
    const p = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);
    ring.style.strokeDashoffset = C * (1 - p); bar.style.transform = `scaleX(${p})`;
    btn.classList.toggle('show', scrollY > innerHeight * .7);
  };
  addEventListener('scroll', run, { passive: true }); run();
  btn.addEventListener('click', () => lenis ? lenis.scrollTo(0, { duration: 1.8 }) : scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
})();

/* ---------- THE INDEX: ivory flip + cursor-following preview ---------- */
(function () {
  const list = $('#idxList'), peek = $('#peek'), pimg = $('img', peek), sec = $('#index');
  list.innerHTML = PRODUCTS.map((p, i) => `
    <button class="idx-row" data-id="${p.id}">
      <span class="idx-n">${String(i + 1).padStart(2, '0')}</span>
      <span class="idx-name">${p.name}</span>
      <img class="idx-thumb" src="${p.front}" alt="" loading="lazy">
      <span class="idx-meta"><span>${p.cat}</span><span>$${p.price}</span></span>
    </button>`).join('');

  // page flips to ivory while the index is centred in the viewport
  new IntersectionObserver(([e]) => document.body.classList.toggle('light', e.isIntersecting),
    { rootMargin: '-45% 0px -45% 0px' }).observe(sec);

  // floating preview follows the cursor (desktop)
  if (!canHover) return;
  let x = 0, y = 0, tx = 0, ty = 0, on = false;
  const loop = () => { x += (tx - x) * .14; y += (ty - y) * .14; peek.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${(tx - x) * .04}deg)`; requestAnimationFrame(loop); };
  loop();
  list.addEventListener('pointermove', (e) => { tx = e.clientX + 40; ty = e.clientY; });
  list.addEventListener('pointerover', (e) => {
    const r = e.target.closest('.idx-row'); if (!r) return;
    if (!on) { x = tx; y = ty; on = true; }
    pimg.src = byId(r.dataset.id).front; peek.classList.add('on');
    $$('.idx-row').forEach((o) => o.classList.toggle('dim', o !== r));
  });
  list.addEventListener('pointerleave', () => { peek.classList.remove('on'); on = false; $$('.idx-row').forEach((o) => o.classList.remove('dim')); });
})();
