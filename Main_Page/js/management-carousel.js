import { $, $$ } from './utils.js';

/**
 * Handles the management carousel large scale scaling and navigation.
 */
export function initManagementCarousel() {
  const mngTrack = $('#management-track');
  const mngPrev = $('#management-prev');
  const mngNext = $('#management-next');
  const mngDotsCont = $('#management-dots');
  const mngViewport = $('#management-slider');

  if (mngTrack && mngPrev && mngNext && mngDotsCont && mngViewport) {
    const mngSlides = $$('.mng-slide', mngTrack);
    const mngScalers = $$('.mng-card-scaler', mngTrack);
    const totalSlides = mngSlides.length;
    let currentSlide = 0;
    let autoSlideInterval;

    // Scale each 1530x800 scaler to fit the viewport without shrinking it more
    // than needed. CSS controls the viewport max width; JS only preserves ratio.
    const applyScale = () => {
      let vpW = mngViewport.clientWidth;
      if (vpW <= 0) {
        const parentW = mngViewport.parentElement ? mngViewport.parentElement.clientWidth : window.innerWidth;
        const arrowGutter = window.innerWidth <= 1728 ? 210 : 0;
        vpW = Math.min(1530, Math.max(720, parentW - arrowGutter));
      }

      const section = mngViewport.closest('.integrate-school');
      const sectionRect = section ? section.getBoundingClientRect() : null;
      const header = section ? section.querySelector('.mng-header') : null;
      const headerH = header ? header.getBoundingClientRect().height : 0;
      const sectionH = sectionRect ? sectionRect.height : window.innerHeight;
      const availableH = Math.max(420, sectionH - headerH - 140);
      const widthScale = vpW / 1530;
      const heightScale = availableH / 800;
      const scale = Math.min(widthScale, heightScale, 1);

      mngScalers.forEach(scaler => {
        scaler.style.transform = `scale(${scale})`;
      });

      const scaledH = Math.round(800 * scale);
      mngSlides.forEach(slide => { slide.style.height = scaledH + 'px'; });
      mngViewport.style.height = scaledH + 'px';
    };

    applyScale();

    // Size tracking using ResizeObserver
    if (window.ResizeObserver) {
      const observer = new ResizeObserver(() => {
        applyScale();
      });
      observer.observe(mngViewport);
    } else {
      window.addEventListener('resize', applyScale);
    }

    // ── Create dots ──
    mngDotsCont.innerHTML = ''; // clear any static children
    mngSlides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'mng-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      mngDotsCont.appendChild(dot);
    });
    const dots = $$('.mng-dot', mngDotsCont);

    // ── Navigate to slide ──
    const goTo = (index) => {
      currentSlide = (index + totalSlides) % totalSlides;
      sessionStorage.setItem('managementCarouselSlide', currentSlide);

      // Update slide active class for opacity transition
      mngSlides.forEach((slide, i) => {
        if (i === currentSlide) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      dots.forEach((d, i) => {
        d.className = 'mng-dot' + (i === currentSlide ? ' active' : '');
      });

      // Restart auto-slide
      startAutoSlide();
    };

    // ── Auto-slide Logic ──
    const startAutoSlide = () => {
      stopAutoSlide();
      autoSlideInterval = setInterval(() => {
        goTo(currentSlide + 1);
      }, 5000);
    };

    const stopAutoSlide = () => {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
      }
    };

    // ── Arrow clicks ──
    mngPrev.addEventListener('click', () => goTo(currentSlide - 1));
    mngNext.addEventListener('click', () => goTo(currentSlide + 1));

    // ── Init ──
    const savedSlide = sessionStorage.getItem('managementCarouselSlide');
    const initialSlide = savedSlide ? parseInt(savedSlide, 10) : 0;
    goTo(initialSlide);
    startAutoSlide();
  }
}
