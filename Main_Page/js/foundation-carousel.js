import { $, $$ } from './utils.js';

/**
 * Handles the Foundation carousel transition logic and dots/arrows.
 */
export function initFoundationCarousel() {
  const fndLeftArrow = $('.content-details-parent .content-details-icon');
  const fndRightArrow = $('.content-details-parent .content-details-icon2');
  const fndSlideContent = $('.frame-parent7');
  const fndDotsContainer = $('.foundation-dots');
  const fndSlideImg = $('.foundation-slide-img');
  
  if (fndLeftArrow && fndRightArrow && fndSlideContent) {
    fndLeftArrow.style.cursor = 'pointer';
    fndRightArrow.style.cursor = 'pointer';
    
    const fndSlideTitle = fndSlideContent.querySelector('.ph-hp-vi');
    const fndSlideDesc = fndSlideContent.querySelector('.tch-hp-b');
    
    const fndSlides = [
      {
        title: "Phù hợp với Giáo dục",
        desc: "Tích hợp bộ tính năng chuyển đổi số toàn diện trên một nền tảng duy nhất",
        img: "./public/Setting 1.svg"
      },
      {
        title: "Cấu hình linh hoạt",
        desc: "Phù hợp với quy chuẩn của Bộ ban hành, tổ chức, linh hoạt theo mô hình của đơn vị",
        img: "./public/extend 1.svg"
      },
      {
        title: "Mở rộng không hạn chế",
        desc: "Liên kết chặt chẽ giữa các module, tính năng cập nhật được và cải tiến liên tục giúp trải nghiệm thông suốt",
        img: "./public/protected 1.png"
      }
    ];
    
    let fndCurrentSlide = 0;
    
    // Create dots
    if (fndDotsContainer) {
      fndDotsContainer.innerHTML = ''; // clear any static children
      fndSlides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.style.width = '12px';
        dot.style.height = '12px';
        dot.style.borderRadius = '50%';
        dot.style.backgroundColor = i === 0 ? '#0072ff' : 'rgba(0,0,0,0.2)';
        dot.style.cursor = 'pointer';
        dot.style.transition = 'background-color 0.3s';
        dot.addEventListener('click', () => updateFndSlide(i - fndCurrentSlide));
        fndDotsContainer.appendChild(dot);
      });
    }
    
    const updateFndSlide = (direction) => {
      fndCurrentSlide = (fndCurrentSlide + direction + fndSlides.length) % fndSlides.length;
      
      fndSlideContent.style.opacity = '0';
      fndSlideContent.style.transform = `translateX(${direction > 0 ? '-30px' : '30px'})`;
      
      setTimeout(() => {
        if(fndSlideTitle) fndSlideTitle.textContent = fndSlides[fndCurrentSlide].title;
        if(fndSlideDesc) fndSlideDesc.textContent = fndSlides[fndCurrentSlide].desc;
        if(fndSlideImg) fndSlideImg.src = fndSlides[fndCurrentSlide].img;
        
        if (fndDotsContainer) {
          Array.from(fndDotsContainer.children).forEach((dot, i) => {
            dot.style.backgroundColor = i === fndCurrentSlide ? '#0072ff' : 'rgba(0,0,0,0.2)';
          });
        }
        
        fndSlideContent.style.transform = `translateX(${direction > 0 ? '30px' : '-30px'})`;
        void fndSlideContent.offsetWidth; // Force reflow
        
        fndSlideContent.style.opacity = '1';
        fndSlideContent.style.transform = 'translateX(0)';
      }, 300);
    };
    
    fndLeftArrow.addEventListener('click', () => updateFndSlide(-1));
    fndRightArrow.addEventListener('click', () => updateFndSlide(1));
    
    fndSlideContent.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
    
    [fndLeftArrow, fndRightArrow].forEach(arrow => {
      arrow.addEventListener('mouseenter', () => arrow.style.transform = arrow === fndRightArrow ? 'rotate(180deg) scale(1.1)' : 'scale(1.1)');
      arrow.addEventListener('mouseleave', () => arrow.style.transform = arrow === fndRightArrow ? 'rotate(180deg) scale(1)' : 'scale(1)');
      arrow.style.transition = 'transform 0.2s ease';
    });
    
    // Auto-slide every 5s
    setInterval(() => updateFndSlide(1), 5000);
  }
}
