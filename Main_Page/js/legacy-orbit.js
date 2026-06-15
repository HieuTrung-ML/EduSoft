/**
 * legacy-orbit.js
 * ----------------
 * Dynamic Orbit Engine for the Main Page hero.
 *
 * Items stay on their orbit path. When a pair enters the warning zone, the
 * engine scales the visuals down smoothly; once clear, they grow back.
 */

export function initOrbit() {
  'use strict';

  const stage = document.querySelector('.ellipse-parent .frame-div');
  if (!stage) return;

  const CX = 525.5;
  const CY = 525.5;

  const ORBITS = [
    { r: 250, dps:  6.0 },
    { r: 420, dps: -4.5 },
  ];

  const BREATH_MAX = 1.08;
  const CONTACT_PAD = 6;
  const WARNING_PAD = 118;
  const RELEASE_PAD = 156;
  const LOOKAHEAD_S = 2.4;
  const MIN_SCALE = 0.46;
  const SCALE_MARGIN = 0.12;
  const SCALE_IN_SPEED = 8.0;
  const SCALE_OUT_SPEED = 1.7;
  const RECOMPUTE_SIZE_MS = 250;

  const angles = ORBITS.map(() => 0);
  const activePairs = new Set();

  let paused = false;
  let lastTime = null;
  let lastMeasure = 0;

  const items = Array.from(stage.querySelectorAll('.orbit-item')).map((el, idx) => {
    const visual = el.firstElementChild;
    const isBubble = visual?.classList.contains('orbit-bubble') || false;

    return {
      el,
      visual,
      idx,
      isBubble,
      orbitIdx: Number(el.dataset.orbit),
      offset: Number(el.dataset.offset),
      baseHw: 0,
      baseHh: 0,
      x: CX,
      y: CY,
      avoidScale: 1,
      targetAvoidScale: 1,
    };
  }).filter(item => item.visual && Number.isFinite(item.orbitIdx) && ORBITS[item.orbitIdx]);

  function clamp(min, value, max) {
    return Math.max(min, Math.min(value, max));
  }

  function lerpExp(current, target, speed, dt) {
    return current + (target - current) * (1 - Math.exp(-speed * dt));
  }

  function getItemBoost() {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--item-boost');
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) && value > 0 ? value : 1;
  }

  function measureItems() {
    const itemBoost = getItemBoost();

    items.forEach(item => {
      const rect = item.visual.getBoundingClientRect();
      const width = item.visual.offsetWidth || rect.width || 1;
      const height = item.visual.offsetHeight || rect.height || 1;
      const visualScale = itemBoost * BREATH_MAX;

      item.baseHw = (width / 2) * visualScale;
      item.baseHh = (height / 2) * visualScale;
    });
  }

  function getHalfWidth(item, scale = item.avoidScale) {
    return item.baseHw * scale;
  }

  function getHalfHeight(item, scale = item.avoidScale) {
    return item.baseHh * scale;
  }

  function orbitPos(item, extraDeg = 0) {
    const orbit = ORBITS[item.orbitIdx];
    const rad = (angles[item.orbitIdx] + item.offset + extraDeg) * (Math.PI / 180);

    return {
      x: CX + orbit.r * Math.cos(rad),
      y: CY + orbit.r * Math.sin(rad),
    };
  }

  function projectedItem(item, extraDeg = 0) {
    const position = orbitPos(item, extraDeg);
    return {
      ...item,
      x: position.x,
      y: position.y,
    };
  }

  function circleRadius(item, scale = item.avoidScale) {
    return getHalfWidth(item, scale);
  }

  function rectRadius(item, scale = item.avoidScale) {
    return Math.hypot(getHalfWidth(item, scale), getHalfHeight(item, scale));
  }

  function overlapsAtScale(a, b, pad, scaleA = a.avoidScale, scaleB = b.avoidScale) {
    const ahw = getHalfWidth(a, scaleA);
    const ahh = getHalfHeight(a, scaleA);
    const bhw = getHalfWidth(b, scaleB);
    const bhh = getHalfHeight(b, scaleB);

    if (!a.isBubble && !b.isBubble) {
      return (
        Math.abs(a.x - b.x) < ahw + bhw + pad &&
        Math.abs(a.y - b.y) < ahh + bhh + pad
      );
    }

    if (a.isBubble && b.isBubble) {
      const limit = circleRadius(a, scaleA) + circleRadius(b, scaleB) + pad;
      return Math.hypot(a.x - b.x, a.y - b.y) < limit;
    }

    const rect = a.isBubble ? b : a;
    const circle = a.isBubble ? a : b;
    const rectScale = a.isBubble ? scaleB : scaleA;
    const circleScale = a.isBubble ? scaleA : scaleB;
    const rhw = getHalfWidth(rect, rectScale);
    const rhh = getHalfHeight(rect, rectScale);
    const cr = circleRadius(circle, circleScale);
    const closestX = Math.max(rect.x - rhw, Math.min(circle.x, rect.x + rhw));
    const closestY = Math.max(rect.y - rhh, Math.min(circle.y, rect.y + rhh));
    const dx = circle.x - closestX;
    const dy = circle.y - closestY;

    return dx * dx + dy * dy < (cr + pad) * (cr + pad);
  }

  function proximityScale(a, b) {
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);

    if (!a.isBubble && !b.isBubble) {
      const reqX = (dx - CONTACT_PAD) / Math.max(a.baseHw + b.baseHw, 1);
      const reqY = (dy - CONTACT_PAD) / Math.max(a.baseHh + b.baseHh, 1);
      return clamp(MIN_SCALE, Math.max(reqX, reqY) - SCALE_MARGIN, 1);
    }

    const dist = Math.hypot(a.x - b.x, a.y - b.y);
    const radiusA = a.isBubble ? circleRadius(a, 1) : rectRadius(a, 1);
    const radiusB = b.isBubble ? circleRadius(b, 1) : rectRadius(b, 1);
    const req = (dist - CONTACT_PAD) / Math.max(radiusA + radiusB, 1);

    return clamp(MIN_SCALE, req - SCALE_MARGIN, 1);
  }

  function pairNeedsScale(a, b, key) {
    const nowWarning = overlapsAtScale(a, b, WARNING_PAD, 1, 1);
    const stillActive = activePairs.has(key) && overlapsAtScale(a, b, RELEASE_PAD, 1, 1);

    if (nowWarning || stillActive) {
      return true;
    }

    const futureA = projectedItem(a, ORBITS[a.orbitIdx].dps * LOOKAHEAD_S);
    const futureB = projectedItem(b, ORBITS[b.orbitIdx].dps * LOOKAHEAD_S);
    return overlapsAtScale(futureA, futureB, WARNING_PAD, 1, 1);
  }

  function resolveScaleTargets() {
    items.forEach(item => {
      item.targetAvoidScale = 1;
    });

    for (let i = 0; i < items.length - 1; i += 1) {
      for (let j = i + 1; j < items.length; j += 1) {
        const a = items[i];
        const b = items[j];
        const key = `${i}:${j}`;

        if (!pairNeedsScale(a, b, key)) {
          activePairs.delete(key);
          continue;
        }

        activePairs.add(key);
        const futureA = projectedItem(a, ORBITS[a.orbitIdx].dps * LOOKAHEAD_S);
        const futureB = projectedItem(b, ORBITS[b.orbitIdx].dps * LOOKAHEAD_S);
        const targetScale = Math.min(proximityScale(a, b), proximityScale(futureA, futureB));
        a.targetAvoidScale = Math.min(a.targetAvoidScale, targetScale);
        b.targetAvoidScale = Math.min(b.targetAvoidScale, targetScale);
      }
    }
  }

  stage.querySelectorAll('.spin-pill').forEach(el => {
    el.style.animationDuration = (12.0 + Math.random() * 8.0).toFixed(2) + 's';
    el.style.animationDelay = (-Math.random() * 20).toFixed(2) + 's';
  });

  stage.querySelectorAll('.orbit-bubble').forEach(el => {
    el.style.animationDuration = (12.0 + Math.random() * 8.0).toFixed(2) + 's';
    el.style.animationDelay = (-Math.random() * 20).toFixed(2) + 's';
  });

  measureItems();

  function tick(now) {
    requestAnimationFrame(tick);

    if (lastTime === null) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    if (now - lastMeasure > RECOMPUTE_SIZE_MS) {
      measureItems();
      lastMeasure = now;
    }

    if (!paused) {
      ORBITS.forEach((orbit, i) => {
        angles[i] += orbit.dps * dt;
        if (angles[i] > 360) angles[i] -= 360;
        if (angles[i] < -360) angles[i] += 360;
      });
    }

    items.forEach(item => {
      const position = orbitPos(item);
      item.x = position.x;
      item.y = position.y;
      item.el.style.left = `${position.x}px`;
      item.el.style.top = `${position.y}px`;
    });

    resolveScaleTargets();

    items.forEach(item => {
      const speed = item.targetAvoidScale < item.avoidScale ? SCALE_IN_SPEED : SCALE_OUT_SPEED;
      item.avoidScale = lerpExp(item.avoidScale, item.targetAvoidScale, speed, dt);
      item.avoidScale = clamp(MIN_SCALE, item.avoidScale, 1);

      if (Math.abs(item.avoidScale - 1) < 0.0005) {
        item.avoidScale = 1;
        item.el.style.removeProperty('--avoid-scale');
      } else {
        item.el.style.setProperty('--avoid-scale', item.avoidScale.toFixed(4));
      }
    });
  }

  requestAnimationFrame(tick);
}
