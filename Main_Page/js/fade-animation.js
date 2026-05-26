import { $$, $ } from './utils.js';

/**
 * Handles IntersectionObserver animations for fade-up, fade-left, fade-right
 */
export function initFadeAnimation() {
  // Fade Left (from left)
  const fadeLeftSelectors = [
    '.nn-tng-chuyn-i-s-ton-d-parent', 
    '.detail-container-parent', 
    '.primary-header-parent', 
    '.info-component'
  ];
  $$(fadeLeftSelectors.join(', ')).forEach(el => {
    if (el.closest('.vector-parent')) return;
    if (!el.classList.contains('fade-left')) el.classList.add('fade-left');
  });

  // Fade Right (from right)
  const fadeRightSelectors = [
    '.core-block', 
    '.system-platform', 
    '.interface-elements-inner'
  ];
  $$(fadeRightSelectors.join(', ')).forEach(el => {
    if (el.closest('.vector-parent')) return;
    if (!el.classList.contains('fade-right')) el.classList.add('fade-right');
  });

  // Elements that just fade up
  const fadeUpSelectors = [
    'h1', 'h2', 'h3',
    '.h-tr-nh', '.t-ng-ha', '.c-thit-k', '.gii-php-qun',
    '.header-block'
  ];
  
  $$(fadeUpSelectors.join(', ')).forEach(el => {
    // Exclude footer elements from fading
    if (el.closest('.site-disclaimer')) return;
    
    // Exclude hero right circle elements from fading
    if (el.closest('.vector-parent')) return;

    // Exclude background-1-parent (the Management Carousel banner) and main-services from fading
    if (el.closest('.background-1-parent') || el.closest('.main-services')) return;
    
    // Only add if it's not already handled by stagger or left/right
    if (!el.classList.contains('fade-up') && !el.classList.contains('fade-left') && !el.classList.contains('fade-right')) {
      el.classList.add('fade-up');
    }
  });

  // Staggered elements
  const staggerGroups = [
    $$('.logo-collection img'),
    $$('.module-interface, .area-interface, .system-examine')
  ];

  staggerGroups.forEach(group => {
    group.forEach((el, index) => {
      // Ensure only fade-up is used for stagger items to keep it consistent
      el.classList.remove('fade-left', 'fade-right');
      if (!el.classList.contains('fade-up')) el.classList.add('fade-up');
      el.classList.add('stagger-item');
      el.style.transitionDelay = `${index * 0.1}s`;
    });
  });

  // Intersection Observer configuration
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // trigger when 15% visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        // Remove class when leaving viewport so it can fade in again later
        entry.target.classList.remove('visible');
      }
    });
  }, observerOptions);

  $$('.fade-up, .fade-left, .fade-right').forEach(el => {
    observer.observe(el);
  });
}
