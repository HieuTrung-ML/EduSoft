/**
 * mobile-menu.js — EduSoft Landing Page
 * ----------------------------------------
 * Handles: open/close panel, outside-click, resize-reset,
 *          submenu toggle, desktop dropdown keyboard support, ARIA.
 */
export function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobilePanel  = document.getElementById('mobile-nav-panel');

  if (!hamburgerBtn || !mobilePanel) return;

  // ── 1. Open / Close panel ──────────────────────────────────────────────────
  const openPanel = () => {
    hamburgerBtn.classList.add('active');
    mobilePanel.classList.add('open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobilePanel.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closePanel = () => {
    hamburgerBtn.classList.remove('active');
    mobilePanel.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobilePanel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  hamburgerBtn.addEventListener('click', () => {
    hamburgerBtn.classList.contains('active') ? closePanel() : openPanel();
  });

  // ── 2. Outside click ───────────────────────────────────────────────────────
  document.addEventListener('click', (e) => {
    if (
      mobilePanel.classList.contains('open') &&
      !mobilePanel.contains(e.target) &&
      !hamburgerBtn.contains(e.target)
    ) {
      closePanel();
    }
  });

  // ── 3. Resize reset ────────────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closePanel();
  });

  // ── 4. Mobile submenu toggle ───────────────────────────────────────────────
  mobilePanel.querySelectorAll('.mobile-dropdown-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const isOpen  = trigger.classList.contains('open');
      const submenu = trigger.nextElementSibling;

      // Close all submenus first
      mobilePanel.querySelectorAll('.mobile-dropdown-trigger').forEach((t) => {
        t.classList.remove('open');
        t.setAttribute('aria-expanded', 'false');
        const sub = t.nextElementSibling;
        if (sub && sub.classList.contains('mobile-dropdown-menu')) {
          sub.classList.remove('open');
          sub.setAttribute('aria-hidden', 'true');
        }
      });

      // Open current if it was closed
      if (!isOpen) {
        trigger.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        if (submenu && submenu.classList.contains('mobile-dropdown-menu')) {
          submenu.classList.add('open');
          submenu.setAttribute('aria-hidden', 'false');
        }
      }
    });
  });

  // ── 5. Desktop dropdown keyboard support ───────────────────────────────────
  const desktopDropdown = document.querySelector('.frame-header .nav-dropdown');
  if (desktopDropdown) {
    const trigger = desktopDropdown.querySelector('.nav-dropdown-trigger');
    if (trigger) {
      trigger.setAttribute('tabindex', '0');
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          desktopDropdown.classList.toggle('active');
        }
        if (e.key === 'Escape') {
          desktopDropdown.classList.remove('active');
        }
      });
    }

    // ── 6. Click outside desktop dropdown ──────────────────────────────────
    document.addEventListener('click', (e) => {
      if (!desktopDropdown.contains(e.target)) {
        desktopDropdown.classList.remove('active');
      }
    });
  }
}
