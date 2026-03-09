// ============================================
// RAJ HEALTH CARE — Premium JS
// ============================================

/* --- Navbar scroll effect --- */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

/* --- Mobile nav toggle --- */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');
hamburger && hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});
document.addEventListener('click', e => {
  if (hamburger && navMenu && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navMenu) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  }
});

/* --- Scroll-reveal animation --- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
});

/* --- Animated counters --- */
function animateCount(el) {
  const target = parseInt(el.dataset.target || el.textContent.replace(/\D/g,''));
  const suffix = el.textContent.replace(/[0-9]/g,'');
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current).toLocaleString() + suffix;
  }, 16);
}
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number, .floating-text-num').forEach(animateCount);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.stats-grid, .hero-stats').forEach(s => countObserver.observe(s));

/* --- Testimonials Slider --- */
class TestimonialSlider {
  constructor() {
    this.cards  = document.querySelectorAll('.testimonial-card');
    this.dots   = document.querySelectorAll('.testimonial-dots .dot');
    this.current = 0;
    if (!this.cards.length) return;
    this.init();
  }
  init() {
    this.dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { this.go(i); this.reset(); });
    });
    this.interval = setInterval(() => this.next(), 5500);
  }
  go(n) {
    this.cards[this.current].classList.remove('active');
    this.dots[this.current]?.classList.remove('active');
    this.current = n;
    this.cards[this.current].classList.add('active');
    this.dots[this.current]?.classList.add('active');
  }
  next() { this.go((this.current + 1) % this.cards.length); }
  reset() { clearInterval(this.interval); this.interval = setInterval(() => this.next(), 5500); }
}
document.addEventListener('DOMContentLoaded', () => new TestimonialSlider());

/* --- Doctor filter --- */
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const doctorCards = document.querySelectorAll('.doctor-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.dataset.filter;
      doctorCards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? '' : 'none';
        if (show) { card.style.animation = 'none'; card.offsetHeight; card.style.animation = ''; }
      });
    });
  });
});

/* --- FAQ Accordion --- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', function() {
      const item   = this.closest('.faq-item');
      const isOpen = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isOpen) item.classList.add('active');
    });
  });
});

/* --- Form Validation --- */
class FormValidator {
  constructor(id) {
    this.form = document.getElementById(id);
    if (this.form) this.init();
  }
  init() {
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      if (this.validate()) this.submit();
    });
    this.form.querySelectorAll('input, textarea, select').forEach(f => {
      f.addEventListener('blur', () => this.validateField(f));
      f.addEventListener('input', () => this.clearError(f));
    });
  }
  validate() {
    let ok = true;
    this.form.querySelectorAll('[required]').forEach(f => { if (!this.validateField(f)) ok = false; });
    return ok;
  }
  validateField(f) {
    const v = f.value.trim();
    this.clearError(f);
    if (f.hasAttribute('required') && !v) { this.showError(f, this.label(f) + ' is required'); return false; }
    if (f.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { this.showError(f, 'Enter a valid email'); return false; }
    if (f.type === 'tel' && v && (!/^[\d\s\-\+\(\)]+$/.test(v) || v.length < 10)) { this.showError(f, 'Enter a valid phone number'); return false; }
    return true;
  }
  showError(f, msg) {
    f.classList.add('error');
    let span = f.parentNode.querySelector('.error-message');
    if (!span) { span = document.createElement('span'); span.className = 'error-message'; f.parentNode.appendChild(span); }
    span.textContent = msg;
  }
  clearError(f) {
    f.classList.remove('error');
    f.parentNode.querySelector('.error-message')?.remove();
  }
  label(f) {
    const map = { firstName:'First Name', lastName:'Last Name', name:'Full Name', email:'Email', phone:'Phone', date:'Date', time:'Time', department:'Department', message:'Message', subject:'Subject', reason:'Reason', consent:'Consent' };
    return map[f.name || f.id] || (f.name || f.id);
  }
  submit() {
    const btn = this.form.querySelector('[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = orig; btn.disabled = false;
      const msg = document.createElement('div');
      msg.className = 'success-message';
      msg.innerHTML = '<i class="fas fa-check-circle"></i><h3>Success!</h3><p>We\'ll be in touch shortly.</p>';
      this.form.after(msg);
      this.form.reset();
      setTimeout(() => msg.remove(), 6000);
    }, 2000);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  new FormValidator('appointmentForm');
  new FormValidator('contactForm');
});

/* --- Appointment: date min & dept-doctor map --- */
document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('date');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

  const deptMap = {
    'cardiology':['dr-rajesh-kumar','dr-anjali-gupta'],
    'neurology' :['dr-amit-patel','dr-rahul-mehra'],
    'pediatrics':['dr-priya-sharma','dr-kavita-joshi'],
    'gynecology':['dr-sneha-reddy','dr-meena-iyer'],
    'orthopedics':['dr-vikram-singh','dr-arjun-nair']
  };
  const deptSel = document.getElementById('department');
  const drSel   = document.getElementById('doctor');
  if (deptSel && drSel) {
    const allOptions = Array.from(drSel.options);
    deptSel.addEventListener('change', function() {
      const dept = this.value;
      drSel.innerHTML = '<option value="">Any Available Doctor</option>';
      allOptions.slice(1).forEach(opt => {
        if (!dept || !deptMap[dept] || deptMap[dept].includes(opt.value)) {
          drSel.appendChild(opt.cloneNode(true));
        }
      });
    });
  }
});

/* --- Phone formatter --- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', () => {
      let v = input.value.replace(/\D/g,'').slice(0,10);
      if (v.length > 5) v = v.slice(0,5) + '-' + v.slice(5);
      input.value = v;
    });
  });
});

/* --- Back to top --- */
const btt = document.createElement('button');
btt.className = 'back-to-top'; btt.setAttribute('aria-label','Back to top');
btt.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(btt);
window.addEventListener('scroll', () => btt.classList.toggle('show', window.scrollY > 300));
btt.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

/* --- Smooth scroll for hash links --- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior:'smooth', block:'start' }); }
  });
});

/* --- Page load class --- */
window.addEventListener('load', () => document.body.classList.add('loaded'));