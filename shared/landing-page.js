/* Shared landing page behavior: scroll progress, sticky header, reveals, card hover settle, resource previews,
   Biotium Choice badges, the hero neuron field (pages with #hero-network), section nav, team faces, swatches. */

(function () {
  var root = document.documentElement;
  var reduced = false;
  try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (reduced) root.classList.add('reduced-motion');

  var progress = document.getElementById('scroll-progress');
  var header = document.getElementById('site-header');
  var ticking = false;

  function update() {
    ticking = false;
    var doc = document.documentElement;
    var scrollTop = window.scrollY || doc.scrollTop || 0;
    var max = (doc.scrollHeight - doc.clientHeight) || 1;
    var pct = Math.max(0, Math.min(1, scrollTop / max));
    if (progress) progress.style.width = (pct * 100) + '%';
    if (header) {
      if (scrollTop > 24) header.classList.add('is-scrolled');
      else if (scrollTop < 8) header.classList.remove('is-scrolled');
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();

  // Hero entrance: reveal immediately on load, staggered via transition-delay
  var heroEls = document.querySelectorAll('.hero-in');
  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(function () {
      for (var i = 0; i < heroEls.length; i++) heroEls[i].classList.add('is-visible');
    });
  });

  // Resource preview: the thumbnail follows the pointer while it's over the card's button (mouse and trackpad only)
  if (window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    Array.prototype.forEach.call(document.querySelectorAll('.bt-res-card'), function (card) {
      var peek = card.querySelector('.bt-res-peek');
      if (!peek) return;
      var ready = false, raf = 0, px = 0, py = 0;
      function place() { raf = 0; card.style.setProperty('--px', px + 'px'); card.style.setProperty('--py', py + 'px'); }
      function onReady() { ready = true; }
      if (peek.complete && peek.naturalWidth) onReady(); else peek.addEventListener('load', onReady);
      card.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'mouse' || !ready) return;
        var r = card.getBoundingClientRect();
        /* Thumbnail sits just above and to the right of the pointer, so the pointer stays visible */
        px = e.clientX - r.left + 14; py = e.clientY - r.top - peek.offsetHeight - 10;
        if (!raf) raf = requestAnimationFrame(place);
        card.classList.toggle('is-peeking', !!(e.target.closest && e.target.closest('.bt-btn-outline')));
      });
      card.addEventListener('pointerleave', function () { card.classList.remove('is-peeking'); });
    });
  }

  // Biotium Choice badges link to the program page. They sit inside card links (links can't nest),
  // so the badge opens its own page and keeps the card's link from firing.
  Array.prototype.forEach.call(document.querySelectorAll('.bt-choice-badge[data-href]'), function (badge) {
    function go(e) { e.preventDefault(); e.stopPropagation(); window.open(badge.getAttribute('data-href'), '_blank', 'noopener'); }
    badge.addEventListener('click', go);
    badge.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') go(e); });
  });

  // Scroll-reveal for sections below the fold
  var revealEls = document.querySelectorAll('.reveal');
  function settle(el) {
    var done = function () { el.classList.add('is-settled'); };
    el.addEventListener('transitionend', function (e) { if (e.target === el && e.propertyName === 'opacity') done(); });
    setTimeout(done, 1400);
  }
  if (reduced || !('IntersectionObserver' in window)) {
    for (var j = 0; j < revealEls.length; j++) { revealEls[j].classList.add('is-visible'); revealEls[j].classList.add('is-settled'); }
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
          settle(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    for (var k = 0; k < revealEls.length; k++) io.observe(revealEls[k]);
  }

  /* Hero network — ambient neuron field, quiet on the left (behind the copy),
     thickening into a dense synapse-like tangle on the right. Every few seconds a
     single random neuron pulses blue, lighting its connections as it fades. */
  (function initHeroNetwork() {
    var canvas = document.getElementById('hero-network');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var INK = { r: 0x2d, g: 0x2d, b: 0x2d };
    var BLUE = { r: 0x00, g: 0x84, b: 0xff };
    function lerpColor(a, b, t) {
      t = Math.max(0, Math.min(1, t));
      return 'rgb(' + Math.round(a.r + (b.r - a.r) * t) + ',' + Math.round(a.g + (b.g - a.g) * t) + ',' + Math.round(a.b + (b.b - a.b) * t) + ')';
    }

    var nodes = [], edges = [];
    var pulse = null; // { idx, start }

    function build(cssW, cssH) {
      nodes = []; edges = [];
      var count = Math.max(24, Math.round((cssW * cssH) / 7500));
      for (var i = 0; i < count; i++) {
        var xt = 1 - Math.pow(Math.random(), 1.6);
        nodes.push({
          idx: i,
          x: xt * cssW, y: Math.random() * cssH,
          vx: (Math.random() - 0.5) * 0.06, vy: (Math.random() - 0.5) * 0.06,
          r: 1.2 + Math.random() * 1.3 + xt * 0.28
        });
      }
      /* Link reach stays at the original hero's scale, so a taller field (hero plus MiniMab card) keeps the same sparse web */
      var minDim = Math.min(cssW, cssH, 480);
      var distLeft = minDim * 0.13, distRight = minDim * 0.17;
      for (var a = 0; a < nodes.length; a++) {
        for (var b = a + 1; b < nodes.length; b++) {
          var dx = nodes[a].x - nodes[b].x, dy = nodes[a].y - nodes[b].y;
          var avgXFrac = ((nodes[a].x + nodes[b].x) / 2) / cssW;
          var localMax = distLeft + (distRight - distLeft) * avgXFrac;
          if (Math.sqrt(dx * dx + dy * dy) < localMax) edges.push({ a: a, b: b });
        }
      }
      var adj = {};
      edges.forEach(function (e, i) {
        (adj[e.a] = adj[e.a] || []).push(i);
        (adj[e.b] = adj[e.b] || []).push(i);
      });
      build.adj = adj;
    }

    // Pick a connected neuron that isn't hidden behind the brain overlay
    var brainEl = document.getElementById('hero-brain');
    function pickNode() {
      var cRect = canvas.getBoundingClientRect();
      var bRect = brainEl && brainEl.offsetParent ? brainEl.getBoundingClientRect() : null;
      for (var tries = 0; tries < 20; tries++) {
        var i = Math.floor(Math.random() * nodes.length);
        if (!(build.adj[i] || []).length) continue;
        var px = cRect.left + nodes[i].x, py = cRect.top + nodes[i].y;
        if (bRect && px > bRect.left && px < bRect.right && py > bRect.top && py < bRect.bottom) continue;
        return i;
      }
      return -1;
    }
    var PULSE_MS = 1400;
    var nextPulseAt = performance.now() + 600;
    function scheduleNext(now) { nextPulseAt = now + PULSE_MS + 300 + Math.random() * 1000; }

    var lastSize = { w: 0, h: 0 };
    function frame(now) {
      var rect = canvas.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = Math.max(1, Math.round(rect.width * dpr));
      var h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      if (Math.abs(rect.width - lastSize.w) > 4 || Math.abs(rect.height - lastSize.h) > 4) {
        lastSize = { w: rect.width, h: rect.height };
        build(rect.width, rect.height);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);

      if (!reduced) {
        nodes.forEach(function (n) {
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0 || n.x > rect.width) n.vx *= -1;
          if (n.y < 0 || n.y > rect.height) n.vy *= -1;
        });
      }

      // One pulse at a time: ramp up fast, fade out slowly, then wait a random beat
      if (!reduced && !pulse && now >= nextPulseAt && nodes.length) {
        var pick = pickNode();
        if (pick >= 0) pulse = { idx: pick, start: now };
        scheduleNext(now);
      }
      var pulseG = 0;
      if (pulse) {
        var k = (now - pulse.start) / PULSE_MS;
        if (k >= 1 || !nodes[pulse.idx]) { pulse = null; }
        else pulseG = k < 0.18 ? k / 0.18 : 1 - (k - 0.18) / 0.82;
      }

      edges.forEach(function (e) {
        var g = pulse && (e.a === pulse.idx || e.b === pulse.idx) ? pulseG * 0.75 : 0;
        ctx.strokeStyle = g > 0.03 ? lerpColor(INK, BLUE, g * 0.8) : 'rgba(45,45,45,0.07)';
        ctx.globalAlpha = g > 0.03 ? (0.12 + g * 0.5) : 1;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(nodes[e.a].x, nodes[e.a].y);
        ctx.lineTo(nodes[e.b].x, nodes[e.b].y);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;

      nodes.forEach(function (n) {
        var g = pulse && n.idx === pulse.idx ? pulseG : 0;
        ctx.fillStyle = g > 0.03 ? lerpColor(INK, BLUE, g) : 'rgba(45,45,45,0.32)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + g * 1.6, 0, Math.PI * 2);
        ctx.fill();
      });

      if (onScreen && !document.hidden) requestAnimationFrame(frame); else looping = false;
    }
    // Only draw while the hero is on screen and the tab is visible, so the page stays light everywhere else
    var onScreen = true, looping = true;
    function resume() { if (!looping && onScreen && !document.hidden) { looping = true; requestAnimationFrame(frame); } }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; resume(); }).observe(canvas);
    }
    document.addEventListener('visibilitychange', resume);
    requestAnimationFrame(frame);
  })();
})();

  /* Section nav: highlight the section under the header, keep the active chip in view on phones */
  (function () {
    var nav = document.querySelector('.bt-nav');
    if (!nav) return;
    var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
    var targets = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
    var current = -1, ticking = false;
    function update() {
      ticking = false;
      var line = (parseFloat(getComputedStyle(document.querySelector('.bt-body-scope') || document.body).getPropertyValue('--bt-header-h')) || 58) + window.innerHeight * 0.25;
      var idx = -1;
      for (var i = 0; i < targets.length; i++) { if (targets[i] && targets[i].getBoundingClientRect().top <= line) idx = i; }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) idx = targets.length - 1;
      if (idx === current) return;
      current = idx;
      links.forEach(function (a, i) { a.classList.toggle('is-active', i === idx); if (i === idx) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
      if (idx >= 0 && nav.scrollWidth > nav.clientWidth) {
        var a = links[idx];
        nav.scrollTo({ left: a.offsetLeft - 24, behavior: 'smooth' });
      }
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* Header: reveal the phone chip row once the hero zone has scrolled under the header */
  (function () {
    var header = document.getElementById('site-header'), zone = document.querySelector('.bt-hero-zone');
    if (!header || !zone) return;
    var ticking = false;
    function update() { ticking = false; header.classList.toggle('is-past-hero', zone.getBoundingClientRect().bottom < header.offsetHeight + 40); }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  })();

/* Team faces pop in once Come say hi scrolls into view */
/* Reveal the team faces once the section scrolls into view */
(function () {
  var el = document.querySelector('.bt-team-float');
  if (!el) return;
  if (!('IntersectionObserver' in window)) { el.classList.add('is-in'); return; }
  var io = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) { el.classList.add('is-in'); io.disconnect(); }
  }, { threshold: 0.35 });
  io.observe(el);
})();

/* Color swatches swap the feature image (pages with #cytolinerImg) */
(function(){
  var img = document.getElementById('cytolinerImg');
  var label = document.getElementById('cytolinerPill');
  var nudge = document.getElementById('cytolinerNudge');
  var swatches = document.querySelectorAll('.cytoliner-swatch');
  if (!img || !swatches.length) return;
  var nudged = false;
  function select(btn){
    for (var i = 0; i < swatches.length; i++) { swatches[i].classList.remove('is-active'); }
    btn.classList.add('is-active');
    img.setAttribute('src', btn.getAttribute('data-img'));
    img.setAttribute('alt', btn.getAttribute('data-label'));
    label.textContent = btn.getAttribute('data-label');
    if (!nudged) { nudged = true; nudge.style.opacity = '0'; }
  }
  for (var j = 0; j < swatches.length; j++) {
    (function(btn){
      btn.addEventListener('mouseenter', function(){ select(btn); });
      btn.addEventListener('click', function(){ select(btn); });
      btn.addEventListener('focus', function(){ select(btn); });
    })(swatches[j]);
  }
})();
