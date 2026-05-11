(() => {
  const navbar = document.querySelector('.navbar');
  const orbitStage = document.querySelector('.spiral-scale-wrapper > div');
  const orbitCards = [...document.querySelectorAll('.orbit-card')];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (navbar) {
    const syncNavbar = () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 12);
    };

    syncNavbar();
    window.addEventListener('scroll', syncNavbar, { passive: true });
  }

  const setupScrollFade = () => {
    const fadeSelectors = [
      'section h2',
      'section h3',
      'section h4',
      'section p',
      'section li',
      '.stats-glass-pill',
      '.partner-logos img',
      '.value-prop-image img',
      '.feature-card',
      '.ecosystem-panel',
      '.ecosystem-graphic',
      '.cta-card',
      '.newsletter-form'
    ];

    const fadeItems = [...document.querySelectorAll(fadeSelectors.join(','))]
      .filter((el) => !el.closest('.hero') && !el.closest('.spiral-scale-wrapper'))
      .filter((el) => {
        const animatedContainer = el.closest('.feature-card, .cta-card, .ecosystem-panel');
        return !animatedContainer || animatedContainer === el;
      });

    fadeItems.forEach((el) => {
      el.classList.add('scroll-fade');
    });

    document.querySelectorAll('section').forEach((section) => {
      section.querySelectorAll('.scroll-fade').forEach((el, index) => {
        const step = el.closest('.partner-logos') ? 60 : 90;
        const delay = `${index * step}ms`;
        el.dataset.fadeDelay = delay;
        el.style.setProperty('--fade-delay', delay);
      });
    });

    if (prefersReducedMotion) {
      fadeItems.forEach((el) => {
        el.classList.add('is-visible');
        el.style.setProperty('--fade-delay', '0ms');
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target;

        if (entry.isIntersecting) {
          el.style.setProperty('--fade-delay', el.dataset.fadeDelay || '0ms');
          el.classList.add('is-visible', 'is-animating');
        } else {
          el.classList.remove('is-visible');
          el.style.setProperty('--fade-delay', '0ms');
        }
      });
    }, {
      threshold: 0,
      rootMargin: '0px 0px -80px 0px'
    });

    fadeItems.forEach((el) => {
      el.addEventListener('transitionend', () => {
        el.classList.remove('is-animating');
      });
      observer.observe(el);
    });
  };

  setupScrollFade();

  if (!orbitStage || orbitCards.length === 0) return;

  const layerConfig = {
    main: { radius: 230, speed: 0.11, currentAngle: -Math.PI / 2 },
    inner: { radius: 200, speed: 0.16, currentAngle: -Math.PI / 2 },
    middle: { radius: 320, speed: 0.11, currentAngle: 0 },
    outer: { radius: 455, speed: -0.055, currentAngle: -Math.PI / 2 }
  };

  const groupedCards = orbitCards.reduce((groups, el) => {
    const layerName = el.dataset.layer || 'outer';
    groups[layerName] = groups[layerName] || [];
    groups[layerName].push(el);
    return groups;
  }, {});

  const cardsByLayer = {};
  const cards = Object.entries(groupedCards).flatMap(([layerName, elements]) => {
    const layer = layerConfig[layerName] || layerConfig.outer;
    const layerCards = elements.map((el) => {
      el.style.left = '0px';
      el.style.top = '0px';
      el.style.transformOrigin = 'center';
      el.style.opacity = '0';

      return {
        el,
        layer,
        angleOffset: 0,
        angularSize: 0
      };
    });

    cardsByLayer[layerName] = layerCards;
    return layerCards;
  });

  const distributeLayer = (layerCards, layerName) => {
    const layer = layerConfig[layerName] || layerConfig.outer;
    const padding = 40;
    let totalNeeded = 0;

    layerCards.forEach((card) => {
      const diagonal = Math.hypot(card.el.offsetWidth, card.el.offsetHeight);
      card.angularSize = (diagonal + padding) / layer.radius;
      totalNeeded += card.angularSize;
    });

    if (totalNeeded > 2 * Math.PI) {
      console.warn(`Orbit layer "${layerName}" is too crowded for radius ${layer.radius}px`);
    }

    const extraGap = Math.max((2 * Math.PI - totalNeeded) / layerCards.length, 0);
    let currentAngle = 0;

    layerCards.forEach((card) => {
      card.angleOffset = currentAngle + card.angularSize / 2;
      currentAngle += card.angularSize + extraGap;
    });
  };

  const distributeLayers = () => {
    Object.entries(cardsByLayer).forEach(([layerName, layerCards]) => {
      distributeLayer(layerCards, layerName);
    });
  };

  const render = () => {
    const centerX = orbitStage.clientWidth / 2;
    const centerY = orbitStage.clientHeight / 2;

    cards.forEach(({ el, layer, angleOffset }) => {
      const angle = layer.currentAngle + angleOffset;
      const radius = layer.radius;
      const x = centerX + Math.cos(angle) * radius - el.offsetWidth / 2;
      const y = centerY + Math.sin(angle) * radius - el.offsetHeight / 2;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  };

  if (prefersReducedMotion) {
    distributeLayers();
    render();
    cards.forEach(({ el }) => {
      el.style.opacity = '1';
    });
    return;
  }

  let previousTime = performance.now();
  const animate = (time) => {
    const deltaTime = Math.min((time - previousTime) / 1000, 0.05);
    previousTime = time;

    Object.values(layerConfig).forEach((layer) => {
      layer.currentAngle += layer.speed * deltaTime;
    });

    render();
    requestAnimationFrame(animate);
  };

  const startOrbit = () => {
    distributeLayers();
    render();
    cards.forEach(({ el }) => {
      el.style.opacity = '1';
    });
    requestAnimationFrame(animate);
  };

  let resizeFrame = null;
  window.addEventListener('resize', () => {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      distributeLayers();
      render();
    });
  });

  requestAnimationFrame(startOrbit);
})();
