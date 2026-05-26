import { $ } from './utils.js';

/**
 * Handles navbar two-step scroll behavior:
 * - any scroll: glass background
 * - past the .frame-wrapper3 section: dark text and logo swap
 */
export function initNavbar() {
  const mainNav = $('#main-nav');
  const colorSwitchSection = $('.frame-parent');
  
  // Move navbar to body to fix z-index overlay issues
  if (mainNav && mainNav.parentNode !== document.body) {
    document.body.insertBefore(mainNav, document.body.firstChild);
  }
  
  if (mainNav) {
    let colorSwitchThreshold = Number.POSITIVE_INFINITY;

    const refreshColorSwitchThreshold = () => {
      if (!colorSwitchSection) {
        colorSwitchThreshold = Number.POSITIVE_INFINITY;
        return;
      }

      const sectionRect = colorSwitchSection.getBoundingClientRect();
      colorSwitchThreshold = Math.ceil(
        sectionRect.top + window.scrollY + sectionRect.height
      );
    };

    const updateNavbarState = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;

      mainNav.classList.toggle('is-glass', scrollY > 0);
      mainNav.classList.toggle('scrolled', scrollY > colorSwitchThreshold);
    };

    refreshColorSwitchThreshold();
    updateNavbarState();
    window.addEventListener('scroll', updateNavbarState, { passive: true });
    window.addEventListener('resize', () => {
      refreshColorSwitchThreshold();
      updateNavbarState();
    });
    window.addEventListener('load', () => {
      refreshColorSwitchThreshold();
      updateNavbarState();
    });
  }
}
