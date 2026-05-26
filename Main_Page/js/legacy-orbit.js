/**
 * legacy-orbit.js
 * ----------------
 * Orbit animation logic được bảo toàn từ hệ thống gốc (Main_Page/index.legacy.js.bak).
 *
 * TRẠNG THÁI: Bảo toàn — KHÔNG import vào main.js.
 * Giao diện mới trong Test/MainPage2 không có .orbit-card và .spiral-scale-wrapper,
 * nên animation này không chạy nhưng được giữ nguyên để tái sử dụng khi cần.
 *
 * Để kích hoạt lại: import { initOrbit } from './legacy-orbit.js'; trong main.js
 * rồi gọi initOrbit() sau DOMContentLoaded.
 */

export function initOrbit() {
  const orbitStage = document.querySelector('.spiral-scale-wrapper > div');
  const orbitCards = [...document.querySelectorAll('.orbit-card')];

  if (!orbitStage || orbitCards.length === 0) return;

  const layerConfig = {
    main:   { radius: 230, speed:  0.25, currentAngle: -Math.PI / 2 },
    inner:  { radius: 200, speed:  0.35, currentAngle: -Math.PI / 2 },
    middle: { radius: 320, speed:  0.25, currentAngle: 0 },
    outer:  { radius: 455, speed: -0.15, currentAngle: -Math.PI / 2 }
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
      return { el, layer, angleOffset: 0, angularSize: 0 };
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
      const x = centerX + Math.cos(angle) * layer.radius - el.offsetWidth / 2;
      const y = centerY + Math.sin(angle) * layer.radius - el.offsetHeight / 2;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  };

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
    cards.forEach(({ el }) => { el.style.opacity = '1'; });
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
}
