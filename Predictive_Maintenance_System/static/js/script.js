/* ════════════════════════════════════════════════════════
   Predictive Maintenance System — Client-Side Logic
   ════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Animate probability bars on result page ──────────── */
  const fills = document.querySelectorAll('.prob-fill[data-width]');
  if (fills.length) {
    // Start at 0 then animate
    fills.forEach(el => {
      el.style.width = '0%';
      requestAnimationFrame(() => {
        setTimeout(() => {
          el.style.width = el.dataset.width + '%';
        }, 150);
      });
    });
  }

  /* ── Form validation & submit button loading state ───── */
  const form = document.getElementById('predictionForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      const inputs = form.querySelectorAll('input[required], select[required]');
      let valid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.style.borderColor = 'var(--danger)';
        } else {
          input.style.borderColor = '';
        }
      });

      if (!valid) {
        e.preventDefault();
        return;
      }

      // Show loading state on button
      const btn = form.querySelector('.btn-submit');
      if (btn) {
        const spinner = btn.querySelector('.spinner');
        btn.disabled = true;
        btn.querySelector('.btn-text').textContent = 'Analysing…';
        if (spinner) spinner.style.display = 'inline-block';
      }
    });

    // Clear error border on input
    form.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('input', () => {
        el.style.borderColor = '';
      });
    });
  }

  /* ── Active nav link highlight ───────────────────────── */
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
    }
  });

  /* ── Smooth number counter for stat cards ────────────── */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length) {
    const countUp = (el, target, decimals = 0, suffix = '') => {
      let start = 0;
      const duration = 1200;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const val = progress * target;
        el.textContent = decimals ? val.toFixed(decimals) + suffix : Math.floor(val) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.target);
          const decimals = parseInt(el.dataset.decimals || '0');
          const suffix = el.dataset.suffix || '';
          countUp(el, target, decimals, suffix);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
  }

  /* ── Animate metric bars on about page ───────────────── */
  const metricFills = document.querySelectorAll('.metric-bar-fill[data-width]');
  if (metricFills.length) {
    metricFills.forEach(el => {
      el.style.width = '0%';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.transition = 'width 1s ease';
          el.style.width = el.dataset.width + '%';
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    metricFills.forEach(el => observer.observe(el));
  }

  /* ── Tooltip for input range hints ───────────────────── */
  const numericInputs = document.querySelectorAll('input[type="number"]');
  numericInputs.forEach(input => {
    input.addEventListener('change', () => {
      const min = parseFloat(input.min);
      const max = parseFloat(input.max);
      if (!isNaN(min) && !isNaN(max)) {
        if (parseFloat(input.value) < min || parseFloat(input.value) > max) {
          input.style.borderColor = 'var(--warning)';
        } else {
          input.style.borderColor = '';
        }
      }
    });
  });

});
