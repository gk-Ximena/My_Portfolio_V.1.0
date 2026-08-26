
const CASE_STUDIES = [
  {
    title: "Musicfy — UI Design",
    desc: "Figma designs for the Musicfy desktop widget: the pixel-art player, now published as v1.0.0, and the V2.0 vinyl-inspired redesign, still in progress.",
    tag: "Figma · v1.0.0 published",
    file: "musicfy-ui-design.pdf",
  },
  {
    title: "Vera — Plant Care Co-op",
    desc: "Style guide and home page design for Vera, a co-op app that guides people through caring for their specific plants. I'm the front-end / UI designer.",
    tag: "Figma · In progress",
    file: "vera-style-guide.pdf",
  },
  {
    title: "Smooth Studio — Employee Dashboard",
    desc: "Brand identity and employee-dashboard UI for Smooth Studio, a barbershop concept built around compassionate, judgment-free shaving services, including for clients navigating hair loss from medical treatment. I own all UI/UX design; a development partner handles the build.",
    tag: "Figma · In progress",
    file: "smooth-studio-style-guide.pdf",
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

const LOGOS = [
  { name: "GK · Ximena Alvarez", tag: "Personal brand", file: "assets/logos/gk-logo.jpg" },
  { name: "Musicfy", tag: "Product logo", file: "assets/logos/musicfy-logo.jpg" },
  { name: "Vera", tag: "In style guide", file: "assets/logos/vera-logo.png" },
  { name: "Smooth Studio", tag: "In style guide", file: "assets/logos/smooth-logo.png" },
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
try{
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
} catch (err) {
  // Decorative canvas only — never let it block the rest of the page (gallery, modal, GSAP) from initializing.
  console.warn('Hero loom animation failed to start:', err);
}

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

/* ---------- logo design grid ---------- */
const logoGrid = document.getElementById('logoGrid');
LOGOS.forEach(logo => {
  const card = document.createElement('div');
  card.className = 'logo-card';
  card.innerHTML = `
    <img class="logo-card__img" src="${logo.file}" alt="${logo.name} logo" loading="lazy">
    <p class="logo-card__name">${logo.name}</p>
    <p class="logo-card__tag">${logo.tag}</p>`;
  logoGrid.appendChild(card);
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

/* ---------- GSAP scroll animation ---------- */
if (window.gsap && !reduceMotion) {
  gsap.registerPlugin(ScrollTrigger);

  // Dividers: a left-to-right "weaving" wipe, echoing the thread/loom motif
  gsap.utils.toArray('.divider').forEach(div => {
    gsap.fromTo(div,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: { trigger: div, start: 'top 85%' }
      }
    );
  });

  // Section headers: fade + rise
  gsap.utils.toArray('.section-head').forEach(head => {
    gsap.fromTo(head, { opacity: 0, y: 28 }, {
      opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: head, start: 'top 85%' }
    });
  });

  // About: fact rows stagger in
  gsap.fromTo('.about__facts li', { opacity: 0, x: 18 }, {
    opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out',
    scrollTrigger: { trigger: '.about__facts', start: 'top 85%' }
  });
  gsap.fromTo('.about__lead, .about__body', { opacity: 0, y: 20 }, {
    opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out',
    scrollTrigger: { trigger: '.about__grid', start: 'top 85%' }
  });

  // Skills: chip groups stagger in by column
  gsap.utils.toArray('.skills__col').forEach((col, i) => {
    gsap.fromTo(col.querySelectorAll('.chips li'), { opacity: 0, y: 12 }, {
      opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: 'power2.out',
      scrollTrigger: { trigger: col, start: 'top 88%' },
      delay: i * 0.03
    });
  });

  // Projects: meta + visual rise in, slightly offset
  gsap.utils.toArray('.project').forEach(proj => {
    const meta = proj.querySelector('.project__meta');
    const visual = proj.querySelector('.project__visual');
    gsap.fromTo(meta, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: proj, start: 'top 78%' }
    });
    gsap.fromTo(visual, { opacity: 0, y: 30, scale: 0.97 }, {
      opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power2.out', delay: 0.12,
      scrollTrigger: { trigger: proj, start: 'top 78%' }
    });
  });

  // Design case-study cards: grid stagger
  gsap.fromTo('#designGrid .design-card', { opacity: 0, y: 24 }, {
    opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out',
    scrollTrigger: { trigger: '#designGrid', start: 'top 85%' }
  });

  // Logo grid: subtle scale-in stagger
  gsap.fromTo('#logoGrid .logo-card', { opacity: 0, y: 20, scale: 0.94 }, {
    opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.09, ease: 'back.out(1.6)',
    scrollTrigger: { trigger: '#logoGrid', start: 'top 85%' }
  });

  // Path (education/work timeline): stagger
  gsap.fromTo('.path__item', { opacity: 0, y: 18 }, {
    opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out',
    scrollTrigger: { trigger: '.path__grid', start: 'top 85%' }
  });

  // Contact: fade up
  gsap.fromTo('.contact__inner > *', { opacity: 0, y: 20 }, {
    opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out',
    scrollTrigger: { trigger: '.contact__inner', start: 'top 85%' }
  });

  // Gentle tilt interaction on design & logo cards (desktop pointer only)
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.design-card, .logo-card').forEach(card => {
      const rotX = gsap.quickTo(card, 'rotateX', { duration: 0.4, ease: 'power2.out' });
      const rotY = gsap.quickTo(card, 'rotateY', { duration: 0.4, ease: 'power2.out' });
      card.style.transformPerspective = 600;
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        rotY(px * 10);
        rotX(py * -10);
      });
      card.addEventListener('mouseleave', () => { rotX(0); rotY(0); });
    });
  }
}
