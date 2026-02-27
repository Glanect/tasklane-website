/* ── Header scroll background ─────────────────────── */
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
