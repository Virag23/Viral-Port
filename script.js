/* ============================================================
   PORTFOLIO — script.js
   Virag Nandgaonkar
   ============================================================ */

// ─── Page open: preloader + staggered entrance ─────────────
document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  const staggerTargets = [
    document.querySelector('.navbar'),
    ...document.querySelectorAll('section'),
    document.querySelector('.footer')
  ].filter(Boolean);

  staggerTargets.forEach((el, i) => {
    el.style.setProperty('--page-delay', `${120 + i * 90}ms`);
  });

  setTimeout(() => {
    document.body.classList.remove('is-loading');
    document.body.classList.add('loaded');

    if (preloader) {
      preloader.classList.add('hide');
      setTimeout(() => preloader.remove(), 700);
    }
  }, 920);
});

// ─── Navbar scroll behaviour ────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ─── Hamburger menu ─────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const open = navLinks.classList.contains('open');
  hamburger.setAttribute('aria-expanded', open);
  hamburger.children[0].style.transform = open ? 'translateY(7px) rotate(45deg)' : '';
  hamburger.children[1].style.opacity   = open ? '0' : '1';
  hamburger.children[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
});

// close menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.children[0].style.transform = '';
    hamburger.children[1].style.opacity   = '1';
    hamburger.children[2].style.transform = '';
  });
});

// ─── Active nav link on scroll ──────────────────────────────
const sections    = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (scrollPos >= top && scrollPos < bottom) {
      allNavLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${section.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}
window.addEventListener('scroll', updateActiveLink);

// ─── Typing animation ───────────────────────────────────────
const roles = [
  'Full Stack Developer',
  'MERN Stack Developer',
  'Problem Solver',
  'SIH 2024 Winner',
  'Team Leader',
];
let roleIdx = 0, charIdx = 0, deleting = false;
const typedEl   = document.getElementById('typedText');
const typingDelay  = 100;
const erasingDelay  = 55;
const newRoleDelay = 1800;

function type() {
  const current = roles[roleIdx];
  if (!deleting) {
    typedEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(type, newRoleDelay);
      return;
    }
    setTimeout(type, typingDelay);
  } else {
    typedEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      roleIdx  = (roleIdx + 1) % roles.length;
    }
    setTimeout(type, erasingDelay);
  }
}
setTimeout(type, 500);

// ─── Hero parallax motion ───────────────────────────────────
const heroSection = document.querySelector('.hero');
const heroShapes = document.querySelectorAll('.shape');
const heroAvatar = document.querySelector('.avatar-container');

if (heroSection && window.matchMedia('(hover:hover)').matches) {
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    heroShapes.forEach((shape, i) => {
      const depth = (i + 1) * 8;
      shape.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
    });

    if (heroAvatar) {
      heroAvatar.style.transform = `translate(${x * -12}px, ${y * -12}px)`;
    }
  });

  heroSection.addEventListener('mouseleave', () => {
    heroShapes.forEach(shape => { shape.style.transform = ''; });
    if (heroAvatar) heroAvatar.style.transform = '';
  });
}

// ─── Intersection Observer — general fade-in ────────────────
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
      entry.target.style.opacity = '1';
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.about-card, .timeline-item').forEach((el, i) => {
  el.style.animationDelay  = `${i * 0.15}s`;
  el.style.animationPlayState = 'paused';
  fadeObserver.observe(el);
});

// ─── Section reveal utility ─────────────────────────────────
const revealTargets = document.querySelectorAll(
  '.section-header, .about-text-left, .about-text-right, .info-card, .contact-info, .contact-form'
);

revealTargets.forEach((el, i) => {
  el.classList.add('reveal-up');
  el.style.setProperty('--reveal-delay', `${Math.min(i * 80, 320)}ms`);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealTargets.forEach(el => revealObserver.observe(el));

// ─── Project cards — animated entrance ──────────────────────
const projectObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.project-card').forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity   = '1';
          card.style.transform = 'translateY(0)';
          // Remove inline transform after reveal so CSS hover/tilt transforms can take over.
          setTimeout(() => {
            card.style.transform = '';
          }, 700);
        }, i * 120);
      });
      projectObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

const projectsGrid = document.querySelector('.projects-grid');
if (projectsGrid) {
  projectsGrid.querySelectorAll('.project-card').forEach(card => {
    card.style.opacity   = '0';
    card.style.transform = 'translateY(28px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  projectObserver.observe(projectsGrid);
}

// ─── Skill progress bars ────────────────────────────────────
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-progress').forEach(bar => {
        bar.style.width = bar.getAttribute('data-width') + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skills-panel').forEach(panel => skillObserver.observe(panel));

// ─── Skills tabs ────────────────────────────────────────────
document.querySelectorAll('.skill-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.skill-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.skills-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById('tab-' + tab.dataset.tab);
    panel.classList.add('active');
    // Animate bars in newly visible panel
    panel.querySelectorAll('.skill-progress').forEach(bar => {
      bar.style.width = '0';
      setTimeout(() => { bar.style.width = bar.getAttribute('data-width') + '%'; }, 50);
    });
  });
});

// Trigger bars for default active panel
setTimeout(() => {
  document.querySelectorAll('#tab-frontend .skill-progress').forEach(bar => {
    bar.style.width = bar.getAttribute('data-width') + '%';
  });
}, 800);

// Hide setup note (it's only for developer reference)
const setupNoteLink = document.getElementById('setupNote');
if (setupNoteLink) {
  setupNoteLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert(
      'EmailJS Setup (free):\n\n' +
      '1. Visit https://www.emailjs.com and sign up\n' +
      '2. Add Gmail service → connect viragsjain1975@gmail.com\n' +
      '3. Create a template with {{from_name}}, {{from_email}}, {{subject}}, {{message}}\n' +
      '4. Copy Service ID, Template ID, and Public Key\n' +
      '5. Paste them into script.js (top — clearly marked)\n\n' +
      'Until configured, the Send button opens your mail client as a fallback.'
    );
  });
}

// ─── EmailJS — sends form to viragsjain1975@gmail.com ────────
//
// QUICK SETUP (one-time, free):
// 1. Go to https://www.emailjs.com  →  create a FREE account
// 2. Add Email Service  →  choose Gmail  →  connect viragsjain1975@gmail.com
//    Note your SERVICE ID (e.g. service_abc123)
// 3. Create Email Template with these variables in the body:
//       Name:    {{from_name}}
//       Email:   {{from_email}}
//       Subject: {{subject}}
//       Message: {{message}}
//    Set "To Email" field to: viragsjain1975@gmail.com
//    Note your TEMPLATE ID (e.g. template_xyz789)
// 4. Account → API Keys → copy your PUBLIC KEY
// 5. Paste all three values below and you're done — no backend needed!
//
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // ← replace
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // ← replace
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // ← replace

try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch(e) { /* SDK not yet configured */ }

// ─── Contact form ────────────────────────────────────────────
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formError   = document.getElementById('formError');
const submitBtn   = document.getElementById('submitBtn');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  formSuccess.classList.remove('show');
  formError.classList.remove('show');

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

  // Check if EmailJS has been configured
  const notConfigured = EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID';

  if (notConfigured) {
    // Fallback: open mail client with prefilled content
    const name    = form.from_name.value;
    const email   = form.from_email.value;
    const subject = encodeURIComponent(form.subject.value);
    const body    = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${form.message.value}`
    );
    window.location.href = `mailto:viragsjain1975@gmail.com?subject=${subject}&body=${body}`;
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    return;
  }

  emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
    .then(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 6000);
    })
    .catch((err) => {
      console.error('EmailJS error:', err);
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      formError.classList.add('show');
      setTimeout(() => formError.classList.remove('show'), 8000);
    });
});

// ─── Smooth-scroll for anchor links ─────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── Achievement cards — animated entrance ───────────────────
const achieveObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity    = '1';
      entry.target.style.transform  = 'translateY(0)';
      achieveObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.achievement-card').forEach((card, i) => {
  card.style.opacity    = '0';
  card.style.transform  = 'translateY(30px)';
  card.style.transition = `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`;
  achieveObserver.observe(card);
});

// ─── Skill cards — animated entrance ────────────────────────
const skillCardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-card').forEach((card, j) => {
        setTimeout(() => {
          card.style.opacity   = '1';
          card.style.transform = 'translateY(0)';
          setTimeout(() => {
            card.style.transform = '';
          }, 520);
        }, j * 80);
      });
      skillCardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skills-panel').forEach(panel => {
  panel.querySelectorAll('.skill-card').forEach(card => {
    card.style.opacity   = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  skillCardObserver.observe(panel);
});

// ─── Interactive tilt cards ─────────────────────────────────
if (window.matchMedia('(hover:hover)').matches) {
  document.querySelectorAll('.project-card, .timeline-content').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--tilt-x', `${(y * -4).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${(x * 4).toFixed(2)}deg`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
}
