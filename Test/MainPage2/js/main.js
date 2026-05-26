import { initFadeAnimation } from './fade-animation.js';
import { initNavbar } from './navbar.js';
import { initFoundationCarousel } from './foundation-carousel.js';
import { initManagementCarousel } from './management-carousel.js';
import { initLogoMarquee } from './logo-marquee.js';

document.addEventListener("DOMContentLoaded", () => {
  initFadeAnimation();
  initNavbar();
  initFoundationCarousel();
  initManagementCarousel();
  initLogoMarquee();
});
