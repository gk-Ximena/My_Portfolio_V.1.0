
const CASE_STUDIES = [
  {
    title: "Musicfy — UI Design",
    desc: "Figma designs for the Musicfy desktop widget: the pixel-art V1.0 player and the V2.0 vinyl-inspired redesign, still in progress.",
    tag: "Figma · In progress",
    file: "musicfy-ui-design.pdf",
  },
  {
    title: "Vera — Plant Care Co-op",
    desc: "Style guide and home page design for Vera, a co-op app that guides people through caring for their specific plants. I'm the front-end / UI designer.",
    tag: "Figma · In progress",
    file: "vera-style-guide.pdf",
  },
  {
    title: "Personal Portfolio — Design",
    desc: "The design behind this developer identity: a React, JavaScript &amp; GSAP portfolio built around a Peruvian mountain palette and animation-rich storytelling.",
    tag: "Figma · In progress",
    file: "my-portfolio-design.pdf",
  },
  {
    title: "Portfolio Wireframes — v1",
    desc: "My very first portfolio proposal, sketched out in my first semester at Langara: full low-fidelity wireframes from home page to contact.",
    tag: "Wireframes · Semester 1",
    file: "portfolio-wireframes-v1.pdf",
  },
];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- nav scroll state + progress thread ---------- */
const nav = document.getElementById('nav');
const threadFill = document.getElementById('threadFill');

function onScroll(){
  nav.classList.toggle('is-scrolled', window.scrollY > 40);
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
  threadFill.style.width = pct + '%';
}
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- mobile nav toggle ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav__links');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(open));
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

/* ---------- hero loom / chakana canvas ---------- */
(function loom(){
  const canvas = document.getElementById('loom');
  const ctx = canvas.getContext('2d');
  let w, h, cell, cols, rows;
  const palette = ['#B23A2E', '#C89B3C', '#2F7A78', '#263859'];

  // classic stepped-cross (chakana) mask, 15x15
  const pattern = [
    "000001111000000",
    "000011111100000",
    "000111111110000",
    "001111111111000",
    "000111111110000",
    "011111111111110",
    "111111111111111",
    "111111111111111",
    "111111111111111",
    "011111111111110",
    "000111111110000",
    "001111111111000",
    "000111111110000",
    "000011111100000",
    "000001111000000",
  ];

  let cellsOn = [];
  let frame = 0;

  function resize(){
    w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    cols = pattern[0].length;
    rows = pattern.length;
    cell = Math.min(w, h) / (rows + 6);
  }
  window.addEventListener('resize', resize);
  resize();

  // build reveal order: diagonal wave so it feels woven, not scanned
  const order = [];
  for (let r = 0; r < rows; r++){
    for (let c = 0; c < cols; c++){
      if (pattern[r][c] === '1') order.push({ r, c, key: r + c });
    }
  }
  order.sort((a, b) => a.key - b.key);
  const total = order.length;

  function draw(){
    frame++;
    ctx.clearRect(0, 0, w, h);
    const originX = w / 2 - (cols * cell) / 2;
    const originY = h / 2 - (rows * cell) / 2;
    const revealCount = reduceMotion ? total : Math.min(total, Math.floor(frame / 2));

    for (let i = 0; i < revealCount; i++){
      const { r, c } = order[i];
      const age = revealCount - i;
      const shimmer = reduceMotion ? 1 : 0.75 + 0.25 * Math.sin((frame - age * 3) / 40 + r + c);
      const color = palette[(r + c) % palette.length];
      ctx.globalAlpha = Math.max(0.25, Math.min(1, shimmer));
      ctx.fillStyle = color;
      ctx.fillRect(
        originX + c * cell + 1,
        originY + r * cell + 1,
        cell - 2,
        cell - 2
      );
    }
    ctx.globalAlpha = 1;
    if (!reduceMotion || revealCount < total) requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

/* ---------- design gallery ---------- */
const grid = document.getElementById('designGrid');
const modal = document.getElementById('pdfModal');
const modalBody = document.getElementById('modalBody');
const modalTitle = document.getElementById('modalTitle');
const modalClose = document.getElementById('modalClose');

CASE_STUDIES.forEach(cs => {
  const card = document.createElement('button');
  card.className = 'design-card' + (cs.file ? '' : ' design-card--empty');
  card.innerHTML = `
    <div class="design-card__thumb"><span>${cs.tag || (cs.file ? 'PDF' : 'Empty slot')}</span></div>
    <div class="design-card__body">
      <p class="design-card__title">${cs.title}</p>
      <p class="design-card__desc">${cs.desc}</p>
    </div>`;
  card.addEventListener('click', () => openModal(cs));
  grid.appendChild(card);
});

function openModal(cs){
  modalTitle.textContent = cs.title;
  modalBody.innerHTML = cs.file
    ? `<iframe src="design/${cs.file}" title="${cs.title}"></iframe>`
    : `<p class="modal__empty">No PDF linked yet. Add the file to /design and set its name as "file" in the CASE_STUDIES array in script.js — this viewer will pick it up automatically.</p>`;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeModal(){
  modal.hidden = true;
  modalBody.innerHTML = '';
  document.body.style.overflow = '';
}
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
