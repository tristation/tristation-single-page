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
   * Custom-eased section snapping (desktop wheel only).
   * CSS scroll-snap stays in place as the fallback for touch/keyboard;
   * this replaces it for wheel/trackpad input with a controlled,
   * smoothly-eased animation instead of the browser's native snap jump.
   */
  var mq = window.matchMedia('(min-width: 961px)');
  var sections = [];
  var headerHeight = 0;
  var currentIndex = 0;
  var animating = false;
  var cooldownUntil = 0;

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

  function sectionBottom(el) {
    return el.offsetTop + el.offsetHeight;
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
    // native scroll-snap fights a JS-driven animation frame-by-frame
    // (each intermediate position isn't a snap point) — suspend it for the duration
    document.documentElement.classList.add('js-scrolling');

    function step(now) {
      if (startTime === null) startTime = now;
      var elapsed = now - startTime;
      var progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + distance * easeInOutCubic(progress));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        animating = false;
        cooldownUntil = performance.now() + 150;
        document.documentElement.classList.remove('js-scrolling');
      }
    }
    requestAnimationFrame(step);
  }

  function onWheel(e) {
    if (!mq.matches) return;
    if (animating || performance.now() < cooldownUntil) {
      e.preventDefault();
      return;
    }

    currentIndex = findCurrentIndex();
    var sec = sections[currentIndex];
    if (!sec) return;

    var goingDown = e.deltaY > 0;

    if (goingDown) {
      var viewportBottom = window.scrollY + window.innerHeight;
      if (viewportBottom < sectionBottom(sec) - 1) return; // more of this section to reveal natively
      var next = Math.min(currentIndex + 1, sections.length - 1);
      if (next === currentIndex) return;
      e.preventDefault();
      animateScrollTo(sectionTop(sections[next]), 700);
    } else {
      if (window.scrollY > sectionTop(sec) + 1) return; // more of this section above to reveal natively
      var prev = Math.max(currentIndex - 1, 0);
      if (prev === currentIndex) return;
      e.preventDefault();
      animateScrollTo(sectionTop(sections[prev]), 700);
    }
  }

  window.addEventListener('load', measure);
  window.addEventListener('resize', measure);
  measure();
  window.addEventListener('wheel', onWheel, { passive: false });

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
      scrollDownBtn.classList.toggle('on-dark', !!sec && sec.classList.contains('final-cta'));
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
