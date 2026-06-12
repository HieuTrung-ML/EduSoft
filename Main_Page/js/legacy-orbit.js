/**
 * legacy-orbit.js
 * ----------------
 * Dynamic Orbit Engine — Integrated and responsive-safe.
 */

export function initOrbit() {
  'use strict';

  const stage = document.querySelector('.ellipse-parent .frame-div');
  if (!stage) return;

  const CX = 525.5;   // Center of the 1051x1051px stage
  const CY = 525.5;

  const ORBITS = [
    { r: 200,  dps:  6.0 },   // 0: inner,  CW,  6°/s (cycle: 60s)
    { r: 370,  dps: -4.5 },   // 1: outer,  CCW, -4.5°/s (cycle: 80s)
  ];

  const COLLISION_PAD  = 6;    // px extra padding on top of item size
  const RELEASE_PAD    = 18;   // hysteresis band to avoid flicker
  const LOOKAHEAD_S    = 1.2;  // seconds of look-ahead for prediction
  const LERP_SHRINK    = 1.5;  // exponential speed: shrink smoothly
  const LERP_GROW      = 0.8;  // exponential speed: grow back slowly and smoothly
  const AVOID_SCALE    = 0.82; // target scale when avoiding (shrink both slightly)

  const angles      = ORBITS.map(() => 0);
  const smoothScale = [];
  const wantsSmall  = [];
  const activePairs = new Set();

  let paused   = false;
  let lastTime = null;

  const items = Array.from(stage.querySelectorAll('.orbit-item')).map((el, idx) => {
    const visual   = el.firstElementChild;
    const isBubble = visual.classList.contains('orbit-bubble');
    return {
      el, visual, idx, isBubble,
      orbitIdx: Number(el.dataset.orbit),
      offset:   Number(el.dataset.offset),
      hw: 0,
      hh: 0,
      x: CX,
      y: CY,
    };
  });

  items.forEach((_, i) => { smoothScale[i] = 1; wantsSmall[i] = false; });

  const PILL_SIZES = {
    'spin-pill-sm':          { hw: 158 / 2, hh: 54 / 2 },
    'spin-pill-finance':     { hw: 192 / 2, hh: 64 / 2 },
    'spin-pill-admission':   { hw: 208 / 2, hh: 64 / 2 },
    'spin-pill-training':    { hw: 192 / 2, hh: 64 / 2 },
    'spin-pill-certificate': { hw: 208 / 2, hh: 64 / 2 },
    'spin-pill-exam':        { hw: 158 / 2, hh: 64 / 2 },
    'spin-pill-asset':       { hw: 148 / 2, hh: 64 / 2 },
    'spin-pill-hr':          { hw: 158 / 2, hh: 64 / 2 },
    'spin-pill-learning':    { hw: 158 / 2, hh: 64 / 2 }
  };

  function getItemBaseSize(item) {
    if (item.isBubble) {
      if (item.visual.classList.contains('orbit-icon-sm')) {
        return { hw: 31, hh: 31 };
      }
      return { hw: 42, hh: 42 };
    }
    for (const className of Object.keys(PILL_SIZES)) {
      if (item.visual.classList.contains(className)) {
        return PILL_SIZES[className];
      }
    }
    return { hw: 104, hh: 32 };
  }

  function measureItems() {
    items.forEach(item => {
      const size = getItemBaseSize(item);
      item.hw = size.hw;
      item.hh = size.hh;
    });
  }

  function orbitPos(item, extraDeg) {
    const o   = ORBITS[item.orbitIdx];
    const rad = (angles[item.orbitIdx] + item.offset + extraDeg) * (Math.PI / 180);
    return { x: CX + o.r * Math.cos(rad), y: CY + o.r * Math.sin(rad) };
  }

  function overlap(a, b, pad) {
    const scaleFactor = 1.08;

    if (!a.isBubble && !b.isBubble) {
      const thresholdX = (a.hw + b.hw) * scaleFactor + pad;
      const thresholdY = (a.hh + b.hh) * scaleFactor + pad;
      return Math.abs(a.x - b.x) < thresholdX && Math.abs(a.y - b.y) < thresholdY;
    } else if (!a.isBubble && b.isBubble) {
      const phw = a.hw * scaleFactor;
      const phh = a.hh * scaleFactor;
      const cr  = b.hw * scaleFactor;

      const closestX = Math.max(a.x - phw, Math.min(b.x, a.x + phw));
      const closestY = Math.max(a.y - phh, Math.min(b.y, a.y + phh));

      const dx = b.x - closestX;
      const dy = b.y - closestY;
      const distSq = dx * dx + dy * dy;

      const limit = cr + pad;
      return distSq < limit * limit;
    } else if (a.isBubble && !b.isBubble) {
      const phw = b.hw * scaleFactor;
      const phh = b.hh * scaleFactor;
      const cr  = a.hw * scaleFactor;

      const closestX = Math.max(b.x - phw, Math.min(a.x, b.x + phw));
      const closestY = Math.max(b.y - phh, Math.min(a.y, b.y + phh));

      const dx = a.x - closestX;
      const dy = a.y - closestY;
      const distSq = dx * dx + dy * dy;

      const limit = cr + pad;
      return distSq < limit * limit;
    } else {
      const ra = a.hw * scaleFactor;
      const rb = b.hw * scaleFactor;
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distSq = dx * dx + dy * dy;

      const limit = ra + rb + pad;
      return distSq < limit * limit;
    }
  }

  function predictedOverlap(a, b, pad) {
    const oa = ORBITS[a.orbitIdx], ob = ORBITS[b.orbitIdx];
    const pa = orbitPos(a, oa.dps * LOOKAHEAD_S);
    const pb = orbitPos(b, ob.dps * LOOKAHEAD_S);

    const tempA = { ...a, x: pa.x, y: pa.y };
    const tempB = { ...b, x: pb.x, y: pb.y };

    return overlap(tempA, tempB, pad);
  }

  function resolveCollisions() {
    wantsSmall.fill(false);

    for (let i = 0; i < items.length - 1; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i], b = items[j];
        if (a.orbitIdx === b.orbitIdx) continue;

        const key         = `${i}:${j}`;
        const nowHit      = overlap(a, b, COLLISION_PAD);
        const futureHit   = predictedOverlap(a, b, COLLISION_PAD);
        const stillActive = activePairs.has(key) && overlap(a, b, RELEASE_PAD);

        if (nowHit || futureHit || stillActive) {
          activePairs.add(key);
          wantsSmall[a.idx] = true;
          wantsSmall[b.idx] = true;
        } else {
          activePairs.delete(key);
        }
      }
    }
  }

  /* ── Randomise float animations (stagger for organic feel) ─────────── */
  stage.querySelectorAll('.spin-pill').forEach(el => {
    el.style.animationDuration = (12.0 + Math.random() * 8.0).toFixed(2) + 's';
    el.style.animationDelay   = (-Math.random() * 20).toFixed(2) + 's';
  });
  stage.querySelectorAll('.orbit-bubble').forEach(el => {
    el.style.animationDuration = (12.0 + Math.random() * 8.0).toFixed(2) + 's';
    el.style.animationDelay   = (-Math.random() * 20).toFixed(2) + 's';
  });

  measureItems();

  function tick(now) {
    requestAnimationFrame(tick);

    if (lastTime === null) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    if (!paused) {
      ORBITS.forEach((o, i) => {
        angles[i] += o.dps * dt;
        if (angles[i] >  360) angles[i] -= 360;
        if (angles[i] < -360) angles[i] += 360;
      });
    }

    items.forEach(item => {
      const p  = orbitPos(item, 0);
      item.x   = p.x;
      item.y   = p.y;
      item.el.style.left = p.x + 'px';
      item.el.style.top  = p.y + 'px';
    });

    resolveCollisions();

    items.forEach((item, i) => {
      const target = wantsSmall[i] ? AVOID_SCALE : 1;
      const speed  = wantsSmall[i] ? LERP_SHRINK : LERP_GROW;
      smoothScale[i] += (target - smoothScale[i]) * (1 - Math.exp(-speed * dt));
      smoothScale[i]  = Math.min(1, Math.max(AVOID_SCALE, smoothScale[i]));

      if (Math.abs(smoothScale[i] - 1) < 0.0005) {
        item.el.style.removeProperty('--avoid-scale');
      } else {
        item.el.style.setProperty('--avoid-scale', smoothScale[i].toFixed(4));
      }
    });
  }

  requestAnimationFrame(tick);
}
