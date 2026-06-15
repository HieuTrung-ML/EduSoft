const HERO_CONFIG = {
  DESKTOP_MIN_WIDTH: 901,
  BASE_WIDTH: 1920,
  BASE_HEIGHT: 1080,

  ORBIT_MIN: 0.50,
  ORBIT_MAX: 1.04,

  TITLE_MIN: 32,
  TITLE_MAX: 72,

  HERO_MIN: 600,
  HERO_MAX: 1200,

  PAGE_PAD_MIN: 32,
  PAGE_PAD_MAX: 380,
  PAGE_MAX: 1720,
  COPY_WIDTH_MIN: 420,
  COPY_WIDTH_MAX: 880,
  GAP_MIN: 20,
  GAP_MAX: 56,

  SHORT_HEIGHT: 820,
  VERY_SHORT_HEIGHT: 760,
  WIDE_ASPECT: 2,

  ORBIT_CLIP_PAD: 8,
  COLLISION_GAP: 24,
  ORBIT_CORRECTION_FACTOR: 0.97,
  TITLE_CORRECTION_FACTOR: 0.95,
  MAX_CORRECTIONS: 10,
};

const ROOT = document.documentElement;
const RUNTIME_PROPS = [
  '--hero-runtime-h',
  '--hero-runtime-container',
  '--hero-runtime-gap',
  '--hero-runtime-copy-width',
  '--hero-title-runtime',
  '--orbit-runtime-scale',
];

let rafId = 0;
let isRunning = false;

function clamp(min, value, max) {
  return Math.max(min, Math.min(value, max));
}

function getViewport() {
  const viewport = window.visualViewport;
  const vw = Math.round(viewport?.width || window.innerWidth || ROOT.clientWidth);
  const vh = Math.round(viewport?.height || window.innerHeight || ROOT.clientHeight);

  return {
    vw,
    vh,
    aspect: vw / Math.max(vh, 1),
  };
}

function getPagePad(vw) {
  if (vw >= 2200) {
    return clamp(120, vw * 0.12, HERO_CONFIG.PAGE_PAD_MAX);
  }

  if (vw >= 1920) {
    return clamp(88, vw * 0.055, 120);
  }

  if (vw >= 1729) {
    return clamp(76, vw * 0.05, 96);
  }

  if (vw >= 1537) {
    return clamp(64, vw * 0.046, 84);
  }

  if (vw >= 1367) {
    return clamp(52, vw * 0.044, 68);
  }

  if (vw >= 1200) {
    return clamp(40, vw * 0.038, 56);
  }

  return clamp(72, vw * 0.074, 84);
}

function computeBaseScale(viewport) {
  const { vw, vh, aspect } = viewport;
  const short = vh <= HERO_CONFIG.SHORT_HEIGHT;
  const veryShort = vh <= HERO_CONFIG.VERY_SHORT_HEIGHT;
  const wideShort = vw >= 1537 && short && aspect >= HERO_CONFIG.WIDE_ASPECT;

  const minHeroHeight = Math.max(HERO_CONFIG.HERO_MIN, vh);
  const maxHeroHeight = Math.max(HERO_CONFIG.HERO_MAX, minHeroHeight);
  const heroHeight = clamp(
    minHeroHeight,
    vw >= 1200 ? vh * 1.08 : vh,
    maxHeroHeight
  );
  const widthFactor = clamp(0.75, vw / HERO_CONFIG.BASE_WIDTH, 1.1);
  const heightFactor = clamp(0.85, vh / HERO_CONFIG.BASE_HEIGHT, 1.05);
  const wideShortBoost = wideShort ? 1.1 : 1;

  let orbitScale;

  if (vw >= 2200) {
    orbitScale = clamp(0.94, widthFactor * heightFactor * wideShortBoost * 1.04, HERO_CONFIG.ORBIT_MAX);
  } else if (vw >= 1729) {
    orbitScale = clamp(0.92, widthFactor * heightFactor * wideShortBoost * 1.12, 1.00);
  } else if (vw >= 1537) {
    orbitScale = clamp(0.88, widthFactor * heightFactor * wideShortBoost * 1.18, 0.96);
  } else if (vw >= 1367) {
    orbitScale = clamp(0.78, widthFactor * heightFactor * wideShortBoost * 1.18, 0.86);
  } else if (vw >= 1200) {
    orbitScale = clamp(0.76, widthFactor * heightFactor * wideShortBoost * 1.30, 0.84);
  } else {
    orbitScale = clamp(0.50, widthFactor * 0.92, 0.56);
  }

  if (short && !wideShort) {
    orbitScale *= clamp(0.88, vh / HERO_CONFIG.SHORT_HEIGHT, 1);
    orbitScale = clamp(HERO_CONFIG.ORBIT_MIN, orbitScale, HERO_CONFIG.ORBIT_MAX);
  }

  if (short) {
    const maxScaleByHeight = clamp(
      HERO_CONFIG.ORBIT_MIN,
      (heroHeight - 132) / 1051,
      HERO_CONFIG.ORBIT_MAX
    );
    orbitScale = Math.min(orbitScale, maxScaleByHeight);
  }

  let titleSize;

  if (vw >= 2200) {
    titleSize = clamp(60, vw * 0.026, HERO_CONFIG.TITLE_MAX);
  } else if (vw >= 1920) {
    titleSize = clamp(54, vw * 0.028, 68);
  } else if (vw >= 1729) {
    titleSize = clamp(50, vw * 0.029, 62);
  } else if (vw >= 1537) {
    titleSize = clamp(46, vw * 0.03, 56);
  } else if (vw >= 1367) {
    titleSize = clamp(42, vw * 0.031, 52);
  } else if (vw >= 1200) {
    titleSize = clamp(38, vw * 0.032, 46);
  } else {
    titleSize = clamp(HERO_CONFIG.TITLE_MIN, vw * 0.036, 42);
  }

  if (veryShort && !wideShort) {
    titleSize *= 0.93;
  } else if (short && !wideShort) {
    titleSize *= 0.96;
  }

  titleSize = clamp(HERO_CONFIG.TITLE_MIN, titleSize, HERO_CONFIG.TITLE_MAX);

  const pagePad = getPagePad(vw);
  const container = clamp(600, Math.min(vw - 2 * pagePad, HERO_CONFIG.PAGE_MAX), HERO_CONFIG.PAGE_MAX);
  const copyWidthRatio = vw >= 1537 ? 0.42 : vw >= 1367 ? 0.40 : vw >= 1200 ? 0.38 : 0.32;
  const copyWidthMin = vw >= 1537 ? 680 : vw >= 1367 ? 620 : vw >= 1200 ? 540 : HERO_CONFIG.COPY_WIDTH_MIN;
  const copyWidth = clamp(copyWidthMin, vw * copyWidthRatio, HERO_CONFIG.COPY_WIDTH_MAX);
  const gapRatio = wideShort ? 0.042 : 0.032;
  const gap = clamp(HERO_CONFIG.GAP_MIN, vw * gapRatio, HERO_CONFIG.GAP_MAX);

  return {
    container,
    gap,
    heroHeight,
    orbitScale,
    titleSize,
    copyWidth,
  };
}

function setHeroVars(scale) {
  ROOT.style.setProperty('--hero-runtime-h', `${scale.heroHeight.toFixed(2)}px`);
  ROOT.style.setProperty('--hero-runtime-container', `${scale.container.toFixed(2)}px`);
  ROOT.style.setProperty('--hero-runtime-gap', `${scale.gap.toFixed(2)}px`);
  ROOT.style.setProperty('--hero-runtime-copy-width', `${scale.copyWidth.toFixed(2)}px`);
  ROOT.style.setProperty('--hero-title-runtime', `${scale.titleSize.toFixed(2)}px`);
  ROOT.style.setProperty('--orbit-runtime-scale', scale.orbitScale.toFixed(4));
}

function clearHeroVars() {
  RUNTIME_PROPS.forEach((prop) => ROOT.style.removeProperty(prop));
  ROOT.classList.remove('hero-runtime-ready');
}

function getHeroElements() {
  const hero = document.querySelector('.ellipse-parent');
  const orbit = document.querySelector('.ellipse-parent .frame-container');
  const copyColumn = document.querySelector('.ellipse-parent .frame-group');
  const title = document.querySelector('.ellipse-parent .nn-tng-chuyn');
  const orbitItems = Array.from(document.querySelectorAll('.ellipse-parent .orbit-item > *, .ellipse-parent .glass-parent7'));

  if (!hero || !orbit || !copyColumn || !title) {
    return null;
  }

  return { hero, orbit, copyColumn, title, orbitItems };
}

function getUnionRect(rects) {
  if (!rects.length) return null;

  return rects.reduce((acc, rect) => ({
    left: Math.min(acc.left, rect.left),
    right: Math.max(acc.right, rect.right),
    top: Math.min(acc.top, rect.top),
    bottom: Math.max(acc.bottom, rect.bottom),
  }), {
    left: rects[0].left,
    right: rects[0].right,
    top: rects[0].top,
    bottom: rects[0].bottom,
  });
}

function measureHero(elements, viewport) {
  const { hero, orbit, title, orbitItems } = elements;
  const { vw, vh, aspect } = viewport;

  const heroRect = hero.getBoundingClientRect();
  const orbitRect = orbit.getBoundingClientRect();
  const orbitVisualRect = getUnionRect(orbitItems.map((item) => item.getBoundingClientRect())) || orbitRect;
  const titleRect = title.getBoundingClientRect();

  const isWideShort =
    vw >= 1537 &&
    vh <= HERO_CONFIG.SHORT_HEIGHT &&
    aspect >= HERO_CONFIG.WIDE_ASPECT;

  const orbitClipped =
    orbitVisualRect.left < HERO_CONFIG.ORBIT_CLIP_PAD ||
    orbitVisualRect.right > vw - HERO_CONFIG.ORBIT_CLIP_PAD ||
    orbitVisualRect.bottom > heroRect.bottom - HERO_CONFIG.ORBIT_CLIP_PAD ||
    orbitVisualRect.top < heroRect.top + HERO_CONFIG.ORBIT_CLIP_PAD;

  const titleCollides = titleRect.right > orbitVisualRect.left - HERO_CONFIG.COLLISION_GAP;
  const heroTooTall = heroRect.height > Math.max(vh + 4, vh * 1.12);

  return {
    orbitClipped,
    titleCollides,
    heroTooTall,
  };
}

function applyHeroScale() {
  const viewport = getViewport();

  if (viewport.vw < HERO_CONFIG.DESKTOP_MIN_WIDTH) {
    clearHeroVars();
    return;
  }

  const elements = getHeroElements();
  if (!elements) {
    clearHeroVars();
    return;
  }

  const scale = computeBaseScale(viewport);

  for (let i = 0; i < HERO_CONFIG.MAX_CORRECTIONS; i += 1) {
    setHeroVars(scale);
    elements.hero.getBoundingClientRect();

    const state = measureHero(elements, viewport);
    if (!state.orbitClipped && !state.titleCollides && !state.heroTooTall) {
      break;
    }

    if (state.heroTooTall) {
      const minHeroHeight = Math.max(HERO_CONFIG.HERO_MIN, viewport.vh);
      const maxHeroHeight = Math.max(HERO_CONFIG.HERO_MAX, minHeroHeight);
      scale.heroHeight = clamp(
        minHeroHeight,
        scale.heroHeight - 20,
        maxHeroHeight
      );
      scale.orbitScale = clamp(
        HERO_CONFIG.ORBIT_MIN,
        scale.orbitScale * HERO_CONFIG.ORBIT_CORRECTION_FACTOR,
        HERO_CONFIG.ORBIT_MAX
      );
    }

    if (state.orbitClipped && !state.heroTooTall) {
      scale.orbitScale = clamp(
        HERO_CONFIG.ORBIT_MIN,
        scale.orbitScale * HERO_CONFIG.ORBIT_CORRECTION_FACTOR,
        HERO_CONFIG.ORBIT_MAX
      );
    }

    if (state.titleCollides) {
      scale.titleSize = clamp(
        HERO_CONFIG.TITLE_MIN,
        scale.titleSize * HERO_CONFIG.TITLE_CORRECTION_FACTOR,
        HERO_CONFIG.TITLE_MAX
      );
      scale.gap = clamp(HERO_CONFIG.GAP_MIN, scale.gap + 10, HERO_CONFIG.GAP_MAX);
    }
  }

  ROOT.classList.add('hero-runtime-ready');
}

function scheduleHeroScale() {
  if (isRunning) {
    return;
  }

  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    isRunning = true;
    applyHeroScale();
    isRunning = false;
  });
}

export function initHeroRuntimeScale() {
  const viewport = window.visualViewport;

  window.addEventListener('resize', scheduleHeroScale, { passive: true });
  window.addEventListener('load', scheduleHeroScale, { passive: true });
  viewport?.addEventListener('resize', scheduleHeroScale, { passive: true });

  scheduleHeroScale();

  if (document.readyState !== 'complete') {
    window.addEventListener('load', scheduleHeroScale, { passive: true, once: true });
  }

  return () => {
    window.removeEventListener('resize', scheduleHeroScale);
    window.removeEventListener('load', scheduleHeroScale);
    viewport?.removeEventListener('resize', scheduleHeroScale);
    cancelAnimationFrame(rafId);
    clearHeroVars();
  };
}
