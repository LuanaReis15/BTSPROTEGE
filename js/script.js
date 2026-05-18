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
