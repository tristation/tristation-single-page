(function () {
  var navToggle = document.getElementById('nav-toggle');
  var mainNav = document.getElementById('main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var heroSlides = document.querySelectorAll('.hero-slide');
  if (heroSlides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var activeSlide = 0;
    setInterval(function () {
      heroSlides[activeSlide].classList.remove('is-active');
      activeSlide = (activeSlide + 1) % heroSlides.length;
      heroSlides[activeSlide].classList.add('is-active');
    }, 3500);
  }

  var toast = document.getElementById('toast');
  var toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('visible');
    }, 2600);
  }

  document.querySelectorAll('.store-btn').forEach(function (button) {
    button.addEventListener('click', function () {
      showToast('Em breve! Estamos quase lá 🚀');
    });
  });

  /**
   * Section geometry helpers — used by the discreet "next section" arrow
   * for a smoothly-eased click-to-advance jump. Free scrolling otherwise.
   */
  var sections = [];
  var headerHeight = 0;
  var animating = false;

  function measure() {
    sections = Array.prototype.slice.call(
      document.querySelectorAll('main > section, .site-footer')
    );
    var raw = getComputedStyle(document.documentElement).getPropertyValue('--header-height');
    headerHeight = parseFloat(raw) || 0;
  }

  function sectionTop(el) {
    return el.offsetTop - headerHeight;
  }

  function findCurrentIndex() {
    var y = window.scrollY;
    var idx = 0;
    for (var i = 0; i < sections.length; i++) {
      if (sectionTop(sections[i]) <= y + 1) idx = i;
    }
    return idx;
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animateScrollTo(targetY, duration) {
    var startY = window.scrollY;
    var distance = targetY - startY;
    if (Math.abs(distance) < 1) return;
    var startTime = null;
    animating = true;

    function step(now) {
      if (startTime === null) startTime = now;
      var elapsed = now - startTime;
      var progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + distance * easeInOutCubic(progress));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        animating = false;
      }
    }
    requestAnimationFrame(step);
  }

  window.addEventListener('load', measure);
  window.addEventListener('resize', measure);
  measure();

  /**
   * Discreet "next section" arrow — a click-to-advance shortcut for people
   * who'd rather not scroll/wheel at all, using the same eased animation.
   */
  var scrollDownBtn = document.getElementById('scroll-down');
  if (scrollDownBtn) {
    scrollDownBtn.addEventListener('click', function () {
      if (animating) return;
      var idx = findCurrentIndex();
      var next = Math.min(idx + 1, sections.length - 1);
      if (next === idx) return;
      animateScrollTo(sectionTop(sections[next]), 700);
    });

    function updateIndicator() {
      var idx = findCurrentIndex();
      var sec = sections[idx];
      var atEnd = idx >= sections.length - 1;
      scrollDownBtn.classList.toggle('is-hidden', atEnd);
      scrollDownBtn.classList.toggle('on-dark', !!sec && sec.classList.contains('section-dark'));
    }

    var indicatorTicking = false;
    window.addEventListener('scroll', function () {
      if (indicatorTicking) return;
      indicatorTicking = true;
      requestAnimationFrame(function () {
        updateIndicator();
        indicatorTicking = false;
      });
    });
    window.addEventListener('load', updateIndicator);
    window.addEventListener('resize', updateIndicator);
    updateIndicator();
  }
})();
