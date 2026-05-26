document.addEventListener("DOMContentLoaded", ()=>{
    // --- 1. SET UP FADE UP, LEFT, RIGHT AND STAGGERED ELEMENTS ---
    // Fade Left (from left)
    const fadeLeftSelectors = [
        '.nn-tng-chuyn-i-s-ton-d-parent',
        '.detail-container-parent',
        '.primary-header-parent',
        '.info-component'
    ];
    document.querySelectorAll(fadeLeftSelectors.join(', ')).forEach((el)=>{
        if (el.closest('.vector-parent')) return;
        if (!el.classList.contains('fade-left')) el.classList.add('fade-left');
    });
    // Fade Right (from right)
    const fadeRightSelectors = [
        '.core-block',
        '.system-platform',
        '.interface-elements-inner'
    ];
    document.querySelectorAll(fadeRightSelectors.join(', ')).forEach((el)=>{
        if (el.closest('.vector-parent')) return;
        if (!el.classList.contains('fade-right')) el.classList.add('fade-right');
    });
    // Elements that just fade up
    const fadeUpSelectors = [
        'h1',
        'h2',
        'h3',
        '.h-tr-nh',
        '.t-ng-ha',
        '.c-thit-k',
        '.gii-php-qun',
        '.khng-ch-l',
        '.khng-ch-l2',
        '.header-block'
    ];
    document.querySelectorAll(fadeUpSelectors.join(', ')).forEach((el)=>{
        // Exclude footer elements from fading
        if (el.closest('.site-disclaimer')) return;
        // Exclude hero right circle elements from fading
        if (el.closest('.vector-parent')) return;
        // Only add if it's not already handled by stagger or left/right
        if (!el.classList.contains('fade-up') && !el.classList.contains('fade-left') && !el.classList.contains('fade-right')) el.classList.add('fade-up');
    });
    // Staggered elements
    const staggerGroups = [
        document.querySelectorAll('.logo-collection img'),
        document.querySelectorAll('.module-interface, .area-interface, .system-examine')
    ];
    staggerGroups.forEach((group)=>{
        group.forEach((el, index)=>{
            // Ensure only fade-up is used for stagger items to keep it consistent
            el.classList.remove('fade-left', 'fade-right');
            if (!el.classList.contains('fade-up')) el.classList.add('fade-up');
            el.classList.add('stagger-item');
            el.style.transitionDelay = `${index * 0.1}s`;
        });
    });
    // --- 2. INTERSECTION OBSERVER FOR FADE IN / FADE OUT ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // trigger when 15% visible
    };
    const observer = new IntersectionObserver((entries)=>{
        entries.forEach((entry)=>{
            if (entry.isIntersecting) entry.target.classList.add('visible');
            else // Remove class when leaving viewport so it can fade in again later
            entry.target.classList.remove('visible');
        });
    }, observerOptions);
    document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach((el)=>{
        observer.observe(el);
    });
    // --- 3. DYNAMIC NAVBAR & LOGO SWITCH ---
    const mainNav = document.getElementById('main-nav');
    // Move navbar to body to fix z-index overlay issues
    if (mainNav && mainNav.parentNode !== document.body) document.body.insertBefore(mainNav, document.body.firstChild);
    // Change background only when scrolling past the hero section
    const heroSection = document.querySelector('.ellipse-parent');
    const scrollThreshold = heroSection ? heroSection.offsetHeight - 80 : 800;
    if (mainNav) window.addEventListener('scroll', ()=>{
        if (window.scrollY > scrollThreshold) mainNav.classList.add('scrolled');
        else mainNav.classList.remove('scrolled');
    });
    // --- 4. FOUNDATION CAROUSEL FUNCTIONALITY ---
    const fndLeftArrow = document.querySelector('.content-details-parent .content-details-icon');
    const fndRightArrow = document.querySelector('.content-details-parent .content-details-icon2');
    const fndSlideContent = document.querySelector('.frame-parent7');
    const fndDotsContainer = document.querySelector('.foundation-dots');
    const fndSlideImg = document.querySelector('.foundation-slide-img');
    if (fndLeftArrow && fndRightArrow && fndSlideContent) {
        fndLeftArrow.style.cursor = 'pointer';
        fndRightArrow.style.cursor = 'pointer';
        const fndSlideTitle = fndSlideContent.querySelector('.ph-hp-vi');
        const fndSlideDesc = fndSlideContent.querySelector('.tch-hp-b');
        const fndSlides = [
            {
                title: "Ph\xf9 h\u1EE3p v\u1EDBi Gi\xe1o d\u1EE5c",
                desc: "T\xedch h\u1EE3p b\u1ED9 t\xednh n\u0103ng chuy\u1EC3n \u0111\u1ED5i s\u1ED1 to\xe0n di\u1EC7n tr\xean m\u1ED9t n\u1EC1n t\u1EA3ng duy nh\u1EA5t",
                img: "./public/Setting 1.svg"
            },
            {
                title: "C\u1EA5u h\xecnh linh ho\u1EA1t",
                desc: "Ph\xf9 h\u1EE3p v\u1EDBi quy chu\u1EA9n c\u1EE7a B\u1ED9 ban h\xe0nh, t\u1ED5 ch\u1EE9c, linh ho\u1EA1t theo m\xf4 h\xecnh c\u1EE7a \u0111\u01A1n v\u1ECB",
                img: "./public/extend 1.svg"
            },
            {
                title: "M\u1EDF r\u1ED9ng kh\xf4ng h\u1EA1n ch\u1EBF",
                desc: "Li\xean k\u1EBFt ch\u1EB7t ch\u1EBD gi\u1EEFa c\xe1c module, t\xednh n\u0103ng c\u1EADp nh\u1EADt \u0111\u01B0\u1EE3c v\xe0 c\u1EA3i ti\u1EBFn li\xean t\u1EE5c gi\xfap tr\u1EA3i nghi\u1EC7m th\xf4ng su\u1ED1t",
                img: "./public/protected 1.svg"
            }
        ];
        let fndCurrentSlide = 0;
        // Create dots
        if (fndDotsContainer) fndSlides.forEach((_, i)=>{
            const dot = document.createElement('div');
            dot.style.width = '12px';
            dot.style.height = '12px';
            dot.style.borderRadius = '50%';
            dot.style.backgroundColor = i === 0 ? '#0072ff' : 'rgba(0,0,0,0.2)';
            dot.style.cursor = 'pointer';
            dot.style.transition = 'background-color 0.3s';
            dot.addEventListener('click', ()=>updateFndSlide(i - fndCurrentSlide));
            fndDotsContainer.appendChild(dot);
        });
        const updateFndSlide = (direction)=>{
            fndCurrentSlide = (fndCurrentSlide + direction + fndSlides.length) % fndSlides.length;
            fndSlideContent.style.opacity = '0';
            fndSlideContent.style.transform = `translateX(${direction > 0 ? '-30px' : '30px'})`;
            setTimeout(()=>{
                if (fndSlideTitle) fndSlideTitle.textContent = fndSlides[fndCurrentSlide].title;
                if (fndSlideDesc) fndSlideDesc.textContent = fndSlides[fndCurrentSlide].desc;
                if (fndSlideImg) fndSlideImg.src = fndSlides[fndCurrentSlide].img;
                if (fndDotsContainer) Array.from(fndDotsContainer.children).forEach((dot, i)=>{
                    dot.style.backgroundColor = i === fndCurrentSlide ? '#0072ff' : 'rgba(0,0,0,0.2)';
                });
                fndSlideContent.style.transform = `translateX(${direction > 0 ? '30px' : '-30px'})`;
                fndSlideContent.offsetWidth; // Force reflow
                fndSlideContent.style.opacity = '1';
                fndSlideContent.style.transform = 'translateX(0)';
            }, 300);
        };
        fndLeftArrow.addEventListener('click', ()=>updateFndSlide(-1));
        fndRightArrow.addEventListener('click', ()=>updateFndSlide(1));
        fndSlideContent.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        [
            fndLeftArrow,
            fndRightArrow
        ].forEach((arrow)=>{
            arrow.addEventListener('mouseenter', ()=>arrow.style.transform = arrow === fndRightArrow ? 'rotate(180deg) scale(1.1)' : 'scale(1.1)');
            arrow.addEventListener('mouseleave', ()=>arrow.style.transform = arrow === fndRightArrow ? 'rotate(180deg) scale(1)' : 'scale(1)');
            arrow.style.transition = 'transform 0.2s ease';
        });
        setInterval(()=>updateFndSlide(1), 5000); // Auto-slide every 5s
    }
    // ── Management Carousel ──────────────────────────────────────
    const mngTrack = document.getElementById('management-track');
    const mngPrev = document.getElementById('management-prev');
    const mngNext = document.getElementById('management-next');
    const mngDotsCont = document.getElementById('management-dots');
    const mngViewport = document.getElementById('management-slider');
    if (mngTrack && mngPrev && mngNext && mngDotsCont && mngViewport) {
        const mngSlides = Array.from(mngTrack.querySelectorAll('.mng-slide'));
        const mngScalers = Array.from(mngTrack.querySelectorAll('.mng-card-scaler'));
        const totalSlides = mngSlides.length;
        let currentSlide = 0;
        let autoSlideInterval;
        // ── Scale each 1530×800 scaler to fit the viewport ──
        const applyScale = ()=>{
            let vpW = mngViewport.clientWidth;
            if (vpW <= 0) {
                const parentW = mngViewport.parentElement ? mngViewport.parentElement.clientWidth : window.innerWidth;
                vpW = Math.min(1000, Math.max(300, parentW - 80));
            }
            const scale = vpW / 1530;
            mngScalers.forEach((scaler)=>{
                scaler.style.transform = `scale(${scale})`;
            });
            // Also set the slide height so the viewport collapses correctly
            const scaledH = Math.round(800 * scale);
            mngSlides.forEach((slide)=>{
                slide.style.height = scaledH + 'px';
            });
            mngViewport.style.height = scaledH + 'px';
        };
        applyScale();
        // Bulletproof size tracking using ResizeObserver
        if (window.ResizeObserver) {
            const observer = new ResizeObserver(()=>{
                applyScale();
            });
            observer.observe(mngViewport);
        } else window.addEventListener('resize', applyScale);
        // ── Create dots ──
        mngSlides.forEach((_, i)=>{
            const dot = document.createElement('button');
            dot.className = 'mng-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            dot.addEventListener('click', ()=>goTo(i));
            mngDotsCont.appendChild(dot);
        });
        const dots = Array.from(mngDotsCont.querySelectorAll('.mng-dot'));
        // ── Navigate to slide ──
        const goTo = (index)=>{
            currentSlide = (index + totalSlides) % totalSlides;
            // Update slide active class for opacity transition
            mngSlides.forEach((slide, i)=>{
                if (i === currentSlide) slide.classList.add('active');
                else slide.classList.remove('active');
            });
            dots.forEach((d, i)=>{
                d.className = 'mng-dot' + (i === currentSlide ? ' active' : '');
            });
            // Restart auto-slide
            startAutoSlide();
        };
        // ── Auto-slide Logic ──
        const startAutoSlide = ()=>{
            stopAutoSlide();
            autoSlideInterval = setInterval(()=>{
                goTo(currentSlide + 1);
            }, 5000);
        };
        const stopAutoSlide = ()=>{
            if (autoSlideInterval) clearInterval(autoSlideInterval);
        };
        // ── Arrow clicks ──
        mngPrev.addEventListener('click', ()=>goTo(currentSlide - 1));
        mngNext.addEventListener('click', ()=>goTo(currentSlide + 1));
        // ── Init ──
        goTo(0);
        startAutoSlide();
    }
// Parallax removed as requested.
});

//# sourceMappingURL=MainPage2.672d4772.js.map
