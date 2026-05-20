/* ── Navbar: scroll effect + mobile toggle ── */
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateProgress();
}, { passive: true });

navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

/* ── Progress bar ── */
const progressBar = document.getElementById('progressBar');
function updateProgress() {
  const scrollTop  = document.documentElement.scrollTop;
  const scrollMax  = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrollTop / scrollMax * 100) + '%';
}

/* ── Intersection Observer: reveal ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

document.querySelectorAll('.reveal, .reveal-hero').forEach(el => revealObs.observe(el));

/* ── Counter animation ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1800;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(eased * target);
    el.textContent = prefix + current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && e.target.dataset.target) {
      animateCounter(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.metric-val[data-target]').forEach(el => counterObs.observe(el));

/* ── FAQ accordion ── */
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-q');
  const ans = item.querySelector('.faq-a');

  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // close all
    document.querySelectorAll('.faq-item.open').forEach(other => {
      other.classList.remove('open');
      other.querySelector('.faq-a').style.maxHeight = '0';
      other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('open');
      ans.style.maxHeight = ans.scrollHeight + 'px';
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ── Contact form → WhatsApp ── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const data    = Object.fromEntries(new FormData(contactForm));
    const lines   = [
      `Olá! Sou *${data.nome}* da empresa *${data.empresa}*.`,
      data.email    ? `E-mail: ${data.email}` : '',
      data.telefone ? `Telefone: ${data.telefone}` : '',
      data.usuarios ? `Usuários: ${data.usuarios}` : '',
      data.interesse ? `Necessidade: ${data.interesse}` : '',
    ].filter(Boolean).join('\n');

    window.open(`https://wa.me/5561983158515?text=${encodeURIComponent(lines)}`, '_blank');
    showToast();
    contactForm.reset();
  });
}

/* ── Toast ── */
function showToast() {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ── Active nav link on scroll ── */
const sections    = document.querySelectorAll('section[id]');
const navAnchors  = document.querySelectorAll('.navbar__links a[href^="#"]');

const activeObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAnchors.forEach(a => {
        const active = a.getAttribute('href') === `#${e.target.id}`;
        a.style.color = active ? '#fff' : '';
        a.style.fontWeight = active ? '600' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeObs.observe(s));

/* ── Smooth hover glow on solution cards (optional polish) ── */
document.querySelectorAll('.solution-card, .plano, .pain-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x    = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const y    = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});
/* ══════════════════════════════════════════════════════════════════
   CONVERSÃO — 3 FEATURES
   Cole no FINAL do js/script.js
══════════════════════════════════════════════════════════════════ */

(function () {

  /* ── ELEMENTOS ──────────────────────────────────────────────── */
  const announceBar     = document.getElementById('announceBar');
  const announceClose   = document.getElementById('announceBarClose');
  const announceCta     = document.getElementById('announceBarCta');
  const scoreSticky     = document.getElementById('scoreSticky');
  const stickyDismiss   = document.getElementById('scoreStickyDismiss');
  const whatsappBtn     = document.querySelector('.whatsapp-float');
  const scoreSection    = document.getElementById('score');

  /* ════════════════════════════════════════════════════════════════
     OPÇÃO 2 — ANNOUNCEMENT BAR
  ════════════════════════════════════════════════════════════════ */

  let barDismissed = false;

  function initAnnounceBar() {
    if (!announceBar) return;

    // Verifica se já foi fechada nesta sessão
    if (sessionStorage.getItem('announceDismissed')) {
      hideAnnounceBar(false);
      return;
    }

    document.body.classList.add('has-announce-bar');

    // Fechar ao clicar no X
    announceClose && announceClose.addEventListener('click', function () {
      hideAnnounceBar(true);
    });

    // Fechar quando clicar no CTA (já vai para a seção)
    announceCta && announceCta.addEventListener('click', function () {
      hideAnnounceBar(true);
    });
  }

  function hideAnnounceBar(save) {
    barDismissed = true;
    announceBar && announceBar.classList.add('hidden');
    document.body.classList.remove('has-announce-bar');
    if (save) sessionStorage.setItem('announceDismissed', '1');
  }

  // Esconde a bar quando o usuário chega na seção #score
  function checkAnnounceBarOnScroll() {
    if (barDismissed || !scoreSection) return;
    const rect = scoreSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.5) {
      hideAnnounceBar(false); // Esconde mas não salva (pode reaparecer)
    }
  }

  /* ════════════════════════════════════════════════════════════════
     OPÇÃO 1 — WHATSAPP BUTTON INTELIGENTE
  ════════════════════════════════════════════════════════════════ */

  let waDemoMode     = false;
  let waDemoTimeout  = null;
  let waOriginalHref = whatsappBtn ? whatsappBtn.getAttribute('href') : '';
  let waOriginalLabel = '';

  function initSmartWhatsapp() {
    if (!whatsappBtn) return;
    const labelEl = whatsappBtn.querySelector('.whatsapp-float__label');
    waOriginalLabel = labelEl ? labelEl.textContent : 'Falar com Especialista';
  }

  function setWaDemo() {
    if (!whatsappBtn || waDemoMode) return;
    waDemoMode = true;
    const labelEl = whatsappBtn.querySelector('.whatsapp-float__label');

    whatsappBtn.classList.add('mode-demo', 'shake');
    whatsappBtn.setAttribute('href', '#score');
    whatsappBtn.setAttribute('aria-label', 'Ver demonstração do BTS Protege Score');
    if (labelEl) labelEl.textContent = 'Ver a Demo';

    // Remove o shake após animação
    setTimeout(() => whatsappBtn.classList.remove('shake'), 600);

    // Volta ao normal depois de 8 segundos
    clearTimeout(waDemoTimeout);
    waDemoTimeout = setTimeout(resetWaDemo, 8000);

    // Ao clicar no modo demo, já vai para #score e reseta
    whatsappBtn.addEventListener('click', onWaDemoClick, { once: true });
  }

  function resetWaDemo() {
    if (!whatsappBtn || !waDemoMode) return;
    waDemoMode = false;
    const labelEl = whatsappBtn.querySelector('.whatsapp-float__label');

    whatsappBtn.classList.remove('mode-demo', 'shake');
    whatsappBtn.setAttribute('href', waOriginalHref);
    whatsappBtn.setAttribute('aria-label', 'Falar pelo WhatsApp');
    if (labelEl) labelEl.textContent = waOriginalLabel;
    clearTimeout(waDemoTimeout);
  }

  function onWaDemoClick() {
    resetWaDemo();
  }

  // Lógica de quando ativar o modo demo:
  // Usuário passou pela seção #score sem interagir com ela
  let passedScore    = false;
  let demoTriggered  = false;

  function checkSmartWhatsapp() {
    if (!scoreSection || demoTriggered || waDemoMode) return;

    const rect = scoreSection.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const sectionBottom = rect.bottom + scrollY;

    // Usuário passou do final da seção score
    if (scrollY > sectionBottom - 100 && !passedScore) {
      passedScore = true;
      demoTriggered = true;
      // Pequeno delay para não sobrepor o sticky CTA
      setTimeout(setWaDemo, 1200);
    }
  }

  /* ════════════════════════════════════════════════════════════════
     OPÇÃO 3 — STICKY CTA
  ════════════════════════════════════════════════════════════════ */

  let stickyDismissed = false;
  let stickyVisible   = false;

  function initSticky() {
    if (!scoreSticky || !stickyDismiss) return;

    stickyDismiss.addEventListener('click', function () {
      stickyDismissed = true;
      hideSticky();
    });
  }

  function showSticky() {
    if (stickyDismissed || stickyVisible) return;
    stickyVisible = true;
    scoreSticky.classList.add('visible');
    document.body.classList.add('sticky-demo-visible');
  }

  function hideSticky() {
    stickyVisible = false;
    scoreSticky.classList.remove('visible');
    document.body.classList.remove('sticky-demo-visible');
  }

  function checkSticky() {
    if (!scoreSection || stickyDismissed) return;

    const rect = scoreSection.getBoundingClientRect();
    const inSection =
      rect.top  < window.innerHeight * 0.7 &&
      rect.bottom > window.innerHeight * 0.3;

    if (inSection) {
      showSticky();
    } else {
      if (stickyVisible) hideSticky();
    }
  }

  /* ── SCROLL HANDLER UNIFICADO ───────────────────────────────── */
  function onScroll() {
    checkAnnounceBarOnScroll();
    checkSmartWhatsapp();
    checkSticky();
  }

  /* ── INIT ───────────────────────────────────────────────────── */
  initAnnounceBar();
  initSmartWhatsapp();
  initSticky();

  window.addEventListener('scroll', onScroll, { passive: true });

  // Roda uma vez no load para pegar a posição inicial
  onScroll();

})();
