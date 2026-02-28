/* ── Header scroll background ─────────────────────── */
document.documentElement.classList.add('js');

const siteHeader = document.querySelector('.site-header');

function onScroll() {
  if (window.scrollY > 0) {
    siteHeader.classList.add('scrolled');
  } else {
    siteHeader.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Mobile nav toggle ────────────────────────────── */
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#primary-nav');
const logoLink = document.querySelector('.logo');

function setMobileNavState(isOpen) {
  if (!menuToggle || !nav) return;
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.classList.toggle('open', isOpen);
  nav.classList.toggle('open', isOpen);
  document.body.classList.toggle('nav-open', isOpen);
  document.documentElement.classList.toggle('nav-open', isOpen);
}

if (menuToggle && nav) {
  setMobileNavState(false);

  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    setMobileNavState(!expanded);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href') || '';
      const isHashLink = href.startsWith('#');

      if (!isHashLink) {
        setMobileNavState(false);
        return;
      }

      const target = document.querySelector(href);
      if (!target) {
        setMobileNavState(false);
        return;
      }

      const isMobileDrawer = window.innerWidth <= 760;

      if (isMobileDrawer) {
        setMobileNavState(false);
        return;
      }
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) {
      setMobileNavState(false);
    }
  });
}

if (logoLink) {
  logoLink.addEventListener('click', (event) => {
    const href = logoLink.getAttribute('href');
    if (href !== '#top') return;

    const isMobileDrawer = window.innerWidth <= 760;
    event.preventDefault();

    if (isMobileDrawer) {
      window.scrollTo(0, 0);
      location.hash = '#top';
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.pushState(null, '', '#top');
  });
}

const tabButtons = document.querySelectorAll('.tab-button');
const tabPanels = document.querySelectorAll('.tab-panel');

function setActiveTab(tabKey) {
  tabButtons.forEach((button) => {
    const active = button.dataset.tab === tabKey;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });

  tabPanels.forEach((panel) => {
    const active = panel.dataset.panel === tabKey;
    panel.classList.toggle('active', active);
    panel.hidden = !active;
  });
}

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setActiveTab(button.dataset.tab);
  });
});

/* ── Demo video overlay play ───────────────────────── */
const howSection = document.querySelector('.section-how');
const demoVideo = howSection?.querySelector('.demo-video');
const videoOverlay = howSection?.querySelector('.video-overlay');
const videoContainer = howSection?.querySelector('.video-container');

if (demoVideo && videoOverlay && videoContainer) {
  let hasStartedPlayback = false;

  const handleVideoInteraction = async () => {
    if (!hasStartedPlayback) {
      videoOverlay.style.display = 'none';
      demoVideo.setAttribute('playsinline', '');

      try {
        await demoVideo.play();
        hasStartedPlayback = true;
      } catch {
        videoOverlay.style.display = '';
      }

      return;
    }

    if (demoVideo.paused) {
      await demoVideo.play();
      return;
    }

    demoVideo.pause();
  };

  videoContainer.addEventListener('click', handleVideoInteraction);
} else {
  console.warn('Demo video elements not found, skipping video setup');
}

/* ── FAQ accordion animation ───────────────────────── */
const faqItems = Array.from(document.querySelectorAll('.faq-list details'));
const animatingFaqItems = new WeakSet();

function animateFaqItem(item, shouldOpen) {
  const summary = item.querySelector('summary');
  if (!summary || animatingFaqItems.has(item) || item.open === shouldOpen) {
    return;
  }

  const startHeight = item.offsetHeight;
  animatingFaqItems.add(item);

  item.style.overflow = 'hidden';
  item.style.height = `${startHeight}px`;
  item.style.transition = 'height 240ms ease';

  if (shouldOpen) {
    item.open = true;
  }

  const endHeight = shouldOpen ? item.scrollHeight : summary.offsetHeight;

  requestAnimationFrame(() => {
    item.style.height = `${endHeight}px`;
  });

  const onTransitionEnd = (transitionEvent) => {
    if (transitionEvent.target !== item || transitionEvent.propertyName !== 'height') {
      return;
    }

    item.removeEventListener('transitionend', onTransitionEnd);

    if (!shouldOpen) {
      item.open = false;
    }

    item.style.height = '';
    item.style.overflow = '';
    item.style.transition = '';
    animatingFaqItems.delete(item);
  };

  item.addEventListener('transitionend', onTransitionEnd);
}

faqItems.forEach((item) => {
  const summary = item.querySelector('summary');
  if (!summary) return;

  summary.addEventListener('click', (event) => {
    event.preventDefault();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      if (item.open) {
        item.open = false;
        return;
      }

      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.open = false;
        }
      });

      item.open = true;
      return;
    }

    if (item.open) {
      animateFaqItem(item, false);
      return;
    }

    faqItems.forEach((otherItem) => {
      if (otherItem !== item && otherItem.open) {
        animateFaqItem(otherItem, false);
      }
    });

    animateFaqItem(item, true);
  });
});

/* ── Demo form validation ──────────────────────────── */
const demoForm = document.querySelector('.demo-form');

if (demoForm) {
  demoForm.setAttribute('novalidate', 'novalidate');

  const fields = Array.from(
    demoForm.querySelectorAll('input:not([type="hidden"]):not([name="bot-field"]), textarea')
  );

  function getFieldLabelText(field) {
    const label = demoForm.querySelector(`label[for="${field.id}"]`);
    if (!label) return 'this field';
    return label.textContent.replace('*', '').trim().toLowerCase();
  }

  function getFieldErrorMessage(field) {
    if (field.validity.valueMissing) {
      return `Please enter ${getFieldLabelText(field) === 'email address' ? `an ${getFieldLabelText(field)}` : `a ${getFieldLabelText(field)}`}`;
    }

    if (field.validity.typeMismatch && field.type === 'email') {
      return 'Please enter a valid email address';
    }

    return 'Please check this field';
  }

  function getOrCreateErrorMessageElement(field) {
    const fieldRow = field.closest('.field-row');
    if (!fieldRow) return null;

    let errorMessageElement = fieldRow.querySelector('.error-message');
    if (!errorMessageElement) {
      errorMessageElement = document.createElement('p');
      errorMessageElement.className = 'error-message';
      fieldRow.appendChild(errorMessageElement);
    }

    return errorMessageElement;
  }

  function setFieldValidationState(field) {
    const errorMessageElement = getOrCreateErrorMessageElement(field);
    if (!errorMessageElement) return true;

    const isFieldValid = field.checkValidity();
    field.classList.toggle('error', !isFieldValid);

    if (!isFieldValid) {
      errorMessageElement.textContent = getFieldErrorMessage(field);
      errorMessageElement.classList.add('visible');
      return false;
    }

    errorMessageElement.classList.remove('visible');
    return true;
  }

  fields.forEach((field) => {
    field.addEventListener('input', () => {
      setFieldValidationState(field);
    });

    field.addEventListener('blur', () => {
      setFieldValidationState(field);
    });
  });

  demoForm.addEventListener('submit', (event) => {
    let hasInvalidField = false;

    fields.forEach((field) => {
      const isFieldValid = setFieldValidationState(field);
      if (!isFieldValid && !hasInvalidField) {
        hasInvalidField = true;
      }
    });

    if (hasInvalidField) {
      event.preventDefault();

      const firstInvalidField = fields.find((field) => !field.checkValidity());
      firstInvalidField?.focus();
    }
  });
}

/* ── Promo shots parallax ──────────────────────────── */
const promoSection = document.querySelector('.section-promo-shots');

if (promoSection) {
  const desktopMediaQuery = window.matchMedia('(min-width: 761px)');
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  let rafScheduled = false;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const updatePromoParallax = () => {
    rafScheduled = false;

    if (!desktopMediaQuery.matches || reducedMotionQuery.matches) {
      promoSection.style.setProperty('--promo-progress', '1');
      return;
    }

    const rect = promoSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const startPoint = viewportHeight * 0.9;
    const totalDistance = startPoint + rect.height;
    const rawProgress = (startPoint - rect.top) / Math.max(totalDistance, 1);
    const progress = clamp(rawProgress, 0, 1);

    promoSection.style.setProperty('--promo-progress', progress.toFixed(4));
  };

  const requestPromoParallaxUpdate = () => {
    if (rafScheduled) return;
    rafScheduled = true;
    window.requestAnimationFrame(updatePromoParallax);
  };

  window.addEventListener('scroll', requestPromoParallaxUpdate, { passive: true });
  window.addEventListener('resize', requestPromoParallaxUpdate);
  desktopMediaQuery.addEventListener('change', requestPromoParallaxUpdate);
  reducedMotionQuery.addEventListener('change', requestPromoParallaxUpdate);

  requestPromoParallaxUpdate();
}

/* ── Scroll reveal animations ─────────────────────── */
const revealReduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealElements = Array.from(document.querySelectorAll('[data-reveal-on-scroll]'));
const validRevealDirections = new Set(['up', 'left', 'right']);

revealElements.forEach((element) => {
  const requestedDirection = element.dataset.revealOnScroll;
  const requestedDelay = element.dataset.revealDelay;

  if (!validRevealDirections.has(requestedDirection)) {
    console.warn(
      `Invalid data-reveal-on-scroll value "${requestedDirection}". Falling back to "up".`,
      element
    );
  }

  const direction = validRevealDirections.has(requestedDirection) ? requestedDirection : 'up';
  element.classList.add('reveal-on-scroll', `reveal-${direction}`);

  if (requestedDelay !== undefined) {
    const delayValue = Number(requestedDelay);

    if (requestedDelay.trim() !== '' && Number.isFinite(delayValue) && delayValue >= 0) {
      element.style.transitionDelay = `${delayValue}ms`;
    } else {
      console.warn(
        `Invalid data-reveal-delay value "${requestedDelay}". Expected a non-negative number in milliseconds.`,
        element
      );
    }
  }
});

if (revealReduceMotionQuery.matches || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => {
    element.classList.add('is-visible');
  });
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('is-visible');

        observer.unobserve(entry.target);
      });
    },
    {
      root: null,
      threshold: 0.2,
      rootMargin: '0px 0px -8% 0px',
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}
