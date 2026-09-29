(() => {
  'use strict';

  const doc = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------------------------------------------------------
     Toast
     --------------------------------------------------------- */
  const toastEl = $('.toast');
  let toastTimer;
  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2200);
  }

  /* ---------------------------------------------------------
     Hero artwork scale + Figma-style rulers.
     Top-left corner is (0,0). Both rulers are pinned and measure the viewport,
     so their numbers only change when the window is resized, never on scroll.
     --------------------------------------------------------- */
  const hero = $('#hero');
  const heroInner = $('.hero-inner', hero);
  const rulerX = $('.ruler-x');
  const rulerY = $('.ruler-y');
  let rulerXKey = '';
  let rulerYKey = '';

  function layoutHero() {
    const vw = doc.clientWidth;
    const box = heroInner.getBoundingClientRect();
    hero.style.setProperty('--s', (box.width / 1200).toFixed(4));
    hero.style.setProperty('--ms', (Math.min(vw, 520) / 390).toFixed(4));

    // Ticks are snapped to whole screen pixels and drawn one screen pixel thick (--hair), so
    // on scaled displays (125%, 150%…) every tick, both ends included, looks the same.
    const dpr = window.devicePixelRatio || 1;
    const snap = (v) => Math.round(v * dpr) / dpr;
    const hair = Math.max(1, Math.round(dpr)) / dpr;
    doc.style.setProperty('--hair', `${hair}px`);

    // Top ruler: runs from 24 (next to the corner) to 24px before the right edge, where it
    // reads the full browser width. The content column is the pink band (on mobile too); on
    // web each stretch (left gap, band, right gap) is split into equal parts.
    const start = Math.round(box.left);
    const end = Math.round(box.right);
    const browserW = Math.round(window.innerWidth);
    const xKey = `${vw}|${browserW}|${start}|${end}|${dpr}`;
    if (xKey !== rulerXKey) {
      rulerXKey = xKey;
      const web = vw >= 768;
      // Mobile (below tablet): start at the line where the content begins when that line
      // lands on a whole pixel; otherwise (and on web) start at 24, next to the corner.
      const contentLeft = box.left;
      const wholeLine = Math.abs(contentLeft - Math.round(contentLeft)) < 0.01;
      const first = !web && wholeLine ? Math.round(contentLeft) : 24;
      const last = vw - (web ? 24 : 16); // mobile ends 16px in, matching the content's right margin
      const marks = [{ x: first, v: first, cls: 'rx-first' }];
      const split = (from, to, step) => {
        const parts = Math.max(1, Math.round((to - from) / step));
        for (let k = 1; k < parts; k++) {
          const p = Math.round(from + ((to - from) * k) / parts);
          marks.push({ x: p, v: p });
        }
      };
      if (web) {
        split(first, start, 120);
        if (start - first >= 40) marks.push({ x: start, v: start, cls: 'rx-edge' });
        split(start, end, 120);
        if (last - end >= 40) marks.push({ x: end, v: end, cls: 'rx-edge' });
        split(end, last, 120);
      } else {
        split(first, last, 60);
      }
      marks.push({ x: last, v: browserW, cls: 'rx-last' });
      // numbers inside the pink band read darker than the ones outside it
      marks.forEach((m) => { if (!m.cls && m.x > start && m.x < end) m.cls = 'rx-in'; });

      let x = `<span class="ruler-band" style="left:${snap(start)}px;width:${snap(end) - snap(start)}px"></span>`;
      marks.forEach((m) => {
        x += `<span class="rx${m.cls ? ` ${m.cls}` : ''}" style="left:${snap(m.x)}px"><b>${m.v}</b></span>`;
      });
      rulerX.innerHTML = x;
    }

    // Side ruler: measures the viewport, not the page, so it never changes on scroll.
    // 100 at the top end, the full viewport height at the bottom end, equal parts between.
    // clientHeight ignores the mobile address bar showing/hiding.
    const viewH = doc.clientHeight;
    const yKey = `${viewH}|${dpr}`;
    if (yKey !== rulerYKey) {
      rulerYKey = yKey;
      const first = 100;
      const parts = Math.max(1, Math.round((viewH - first) / 100));
      let y = '';
      for (let k = 0; k <= parts; k++) {
        const p = Math.round(first + ((viewH - first) * k) / parts);
        const isLast = k === parts;
        y += `<span class="ry${isLast ? ' ry-last' : ''}" style="top:${isLast ? snap(viewH - hair) : snap(p)}px"><b>${p}</b></span>`;
      }
      rulerY.innerHTML = y;
    }
  }

  let layoutFrame = 0;
  const scheduleLayout = () => {
    cancelAnimationFrame(layoutFrame);
    layoutFrame = requestAnimationFrame(layoutHero);
  };
  layoutHero();
  // body size changes on resize and when accordion items open/close
  if ('ResizeObserver' in window) new ResizeObserver(scheduleLayout).observe(document.body);
  window.addEventListener('resize', scheduleLayout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleLayout);

  /* ---------------------------------------------------------
     Hero parallax: earbuds, colour picker and fonts card drift up slightly faster than
     the page while the hero scrolls away. data-parallax = extra speed (0.1 = 10%).
     Uses the `translate` property, so it never fights their rotate/scale transforms.
     --------------------------------------------------------- */
  const parallaxItems = $$('[data-parallax]', hero).map((el) => ({ el, speed: Number(el.dataset.parallax) || 0 }));
  if (parallaxItems.length && !reduceMotion) {
    let parallaxFrame = 0;
    let lastShift = -1;
    const applyParallax = () => {
      parallaxFrame = 0;
      const y = Math.round(Math.min(Math.max(window.scrollY, 0), hero.offsetHeight));
      if (y === lastShift) return;
      lastShift = y;
      parallaxItems.forEach(({ el, speed }) => {
        el.style.translate = `0 ${(-y * speed).toFixed(1)}px`;
      });
    };
    window.addEventListener('scroll', () => {
      if (!parallaxFrame) parallaxFrame = requestAnimationFrame(applyParallax);
    }, { passive: true });
    applyParallax();
  }

  /* ---------------------------------------------------------
     Fonts card: restyle the headline. "Hind" also switches the hero copy to Hindi,
     rendered with the local Hind woff2 (it carries the Devanagari glyphs).
     --------------------------------------------------------- */
  const heroTitle = $('#hero-title');
  const heroCopy = $('.hero-copy', hero);
  const heroSub = $('.hero-sub', hero);
  const [resumeBtn, talkBtn] = $$('.hero-cta .btn', hero);
  const fontsCard = $('.fonts', hero);
  const planeSrc = $('.hero-plane', heroTitle).getAttribute('src');
  const charSrc = $('.hero-char', heroTitle).getAttribute('src');

  const words = (list, from) => list.map((word, i) => `<span class="w" style="--i:${from + i}">${word}</span>`).join(' ');
  const COPY = {
    en: { title: heroTitle.innerHTML, sub: heroSub.innerHTML, resume: resumeBtn.textContent, talk: talkBtn.textContent },
    hi: {
      title: `${words(['वही', 'टूल्स,', 'वही', 'शुरुआत,'], 0)} <img class="w hero-plane" style="--i:4" src="${planeSrc}" alt="" width="190" height="189"> ${words(['पर', 'मेरी', 'पसंद', 'मुझे', 'अलग', 'बनाती', 'है'], 5)} <img class="w hero-char" style="--i:12" src="${charSrc}" alt="" width="171" height="171"> <span class="accent">${words(['मैं', 'युवराज', 'गुप्ता', '“डिज़ाइन', 'मेरी', 'कला', 'है”'], 13)}</span>`,
      sub: 'प्रोडक्ट डिज़ाइनर <span aria-hidden="true">|</span><span class="sr-only">,</span> UX/UI डिज़ाइनर',
      resume: 'रिज़्यूमे देखें',
      talk: 'चलिए बात करें',
    },
  };
  let heroLang = 'en';

  // Redraw the headline in `lang`. The title always gets fresh word spans, so every font
  // pick replays the same word-by-word entrance, not only the ones that change language.
  function renderHero(lang) {
    const copy = COPY[lang];
    heroTitle.innerHTML = copy.title;
    if (lang === heroLang) return;
    heroLang = lang;
    heroSub.innerHTML = copy.sub;
    resumeBtn.textContent = copy.resume;
    talkBtn.textContent = copy.talk;
    if (lang === 'en') heroCopy.removeAttribute('lang');
    else heroCopy.setAttribute('lang', lang);
  }

  fontsCard.addEventListener('click', async (event) => {
    const option = event.target.closest('.font-opt');
    if (!option) return;
    $$('.font-opt', fontsCard).forEach((o) => o.setAttribute('aria-pressed', String(o === option)));
    const nextLang = option.dataset.lang || 'en';
    // Load the picked woff2 first, so the words never animate in a stand-in font
    const family = (option.dataset.font.match(/'([^']+)'/) || [])[1];
    const sample = nextLang === 'hi' ? 'हिंदी' : 'Aa';
    const loads = [];
    if (family && document.fonts) loads.push(document.fonts.load(`600 48px "${family}"`, sample));
    if (nextLang === 'hi' && document.fonts) {
      loads.push(document.fonts.load('500 14px "Hind Mysuru"', sample), document.fonts.load('400 16px "Hind Mysuru"', sample));
    }
    if (loads.length) {
      await Promise.race([Promise.all(loads), new Promise((resolve) => setTimeout(resolve, 1200))]).catch(() => {});
      if (option.getAttribute('aria-pressed') !== 'true') return; // another font was picked meanwhile
    }
    if (option.dataset.font) heroTitle.style.setProperty('--hero-font', option.dataset.font);
    else heroTitle.style.removeProperty('--hero-font');
    renderHero(nextLang);
    scheduleLayout();
  });

  /* ---------------------------------------------------------
     Colour picker: recolours only the pink words of the hero headline (--accent on #hero)
     --------------------------------------------------------- */
  const picker = $('.picker', hero);
  if (picker) initPicker(picker);

  function initPicker(root) {
    const sv = $('.picker-sv', root);
    const hueBar = $('.picker-hue', root);
    const alphaBar = $('.picker-alpha', root);
    const hexInput = $('[data-hex]', root);
    const channelInputs = $$('[data-channel]', root);
    const swatch = $('.picker-swatch', root);
    const clamp01 = (n) => Math.min(1, Math.max(0, n));
    const state = { h: 0, s: 0, v: 0, a: 1 };

    const hsvToRgb = (h, s, v) => {
      const f = (n) => {
        const k = (n + h / 60) % 6;
        return Math.round((v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255);
      };
      return [f(5), f(3), f(1)];
    };
    const rgbToHsv = (r, g, b) => {
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b);
      const d = max - Math.min(r, g, b);
      let h = 0;
      if (d) {
        if (max === r) h = ((g - b) / d) % 6;
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h = (h * 60 + 360) % 360;
      }
      return { h, s: max ? d / max : 0, v: max };
    };
    const toHex = (rgb) => `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
    const parseHex = (value) => {
      let hex = value.trim().replace(/^#/, '');
      if (/^[0-9a-f]{3}$/i.test(hex)) hex = hex.replace(/./g, (c) => c + c);
      if (!/^[0-9a-f]{6}$/i.test(hex)) return null;
      return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
    };

    function render() {
      const rgb = hsvToRgb(state.h, state.s, state.v);
      const hex = toHex(rgb);
      const color = state.a < 1 ? `rgb(${rgb.join(' ')} / ${Math.round(state.a * 100)}%)` : hex;
      root.style.setProperty('--pk-h', (state.h / 360).toFixed(4));
      root.style.setProperty('--pk-s', state.s.toFixed(4));
      root.style.setProperty('--pk-v', state.v.toFixed(4));
      root.style.setProperty('--pk-a', state.a.toFixed(4));
      root.style.setProperty('--pk-hue', `hsl(${Math.round(state.h)} 100% 50%)`);
      root.style.setProperty('--pk-rgb', `rgb(${rgb.join(' ')})`);
      root.style.setProperty('--pk-color', color);
      hero.style.setProperty('--accent', color);
      if (document.activeElement !== hexInput) hexInput.value = hex;
      channelInputs.forEach((input, i) => {
        if (document.activeElement !== input) input.value = rgb[i];
      });
      sv.setAttribute('aria-valuenow', Math.round(state.v * 100));
      sv.setAttribute('aria-valuetext', `${hex}, saturation ${Math.round(state.s * 100)}%, brightness ${Math.round(state.v * 100)}%`);
      hueBar.setAttribute('aria-valuenow', Math.round(state.h));
      alphaBar.setAttribute('aria-valuenow', Math.round(state.a * 100));
      alphaBar.setAttribute('aria-valuetext', `${Math.round(state.a * 100)}%`);
    }

    function setRgb(rgb) {
      const { h, s, v } = rgbToHsv(...rgb);
      // keep the current hue when the colour is grey, so the hue knob doesn't jump
      if (s > 0) state.h = h;
      state.s = s;
      state.v = v;
      render();
    }

    // Map a pointer to the element's own 0–1 space. The card is rotated and scaled,
    // so read three corner markers and solve the affine map instead of using the bounding box.
    function mapper(el) {
      const mark = (left, top) => {
        const m = document.createElement('span');
        m.className = 'pk-mark';
        m.setAttribute('aria-hidden', 'true');
        m.style.left = left;
        m.style.top = top;
        el.appendChild(m);
        return m;
      };
      const o = mark('0', '0');
      const x = mark('100%', '0');
      const y = mark('0', '100%');
      const at = (m) => {
        const r = m.getBoundingClientRect();
        return [r.left, r.top];
      };
      return (clientX, clientY) => {
        const [ox, oy] = at(o);
        const [xx, xy] = at(x);
        const [yx, yy] = at(y);
        const ax = xx - ox; const ay = xy - oy;
        const bx = yx - ox; const by = yy - oy;
        const det = ax * by - ay * bx || 1;
        const qx = clientX - ox; const qy = clientY - oy;
        return [clamp01((qx * by - qy * bx) / det), clamp01((ax * qy - ay * qx) / det)];
      };
    }

    function draggable(el, onMove) {
      const toLocal = mapper(el);
      el.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        el.focus({ preventScroll: true });
        try { el.setPointerCapture(event.pointerId); } catch { /* pointer already gone */ }
        onMove(...toLocal(event.clientX, event.clientY));
        const move = (e) => onMove(...toLocal(e.clientX, e.clientY));
        const end = () => {
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerup', end);
          el.removeEventListener('pointercancel', end);
        };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerup', end);
        el.addEventListener('pointercancel', end);
      });
    }

    draggable(sv, (u, v) => { state.s = u; state.v = 1 - v; render(); });
    draggable(hueBar, (u) => { state.h = u * 360; render(); });
    draggable(alphaBar, (u) => { state.a = u; render(); });

    // Keyboard: arrows nudge, Shift for bigger steps
    const keys = (el, handler) => el.addEventListener('keydown', (event) => {
      const step = event.shiftKey ? 10 : 1;
      const dir = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[event.key];
      if (!dir) return;
      event.preventDefault();
      handler(dir[0] * step, dir[1] * step);
      render();
    });
    keys(sv, (dx, dy) => { state.s = clamp01(state.s + dx / 100); state.v = clamp01(state.v + dy / 100); });
    keys(hueBar, (dx, dy) => { state.h = Math.min(360, Math.max(0, state.h + dx + dy)); });
    keys(alphaBar, (dx, dy) => { state.a = clamp01(state.a + (dx + dy) / 100); });

    hexInput.addEventListener('input', () => {
      const rgb = parseHex(hexInput.value);
      if (rgb) setRgb(rgb);
    });
    channelInputs.forEach((input) => {
      input.addEventListener('input', () => {
        const rgb = channelInputs.map((i) => Math.min(255, Math.max(0, parseInt(i.value, 10) || 0)));
        setRgb(rgb);
      });
    });
    [hexInput, ...channelInputs].forEach((input) => {
      input.addEventListener('focus', () => input.select());
      input.addEventListener('blur', render); // tidy up half-typed values
      input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') input.blur();
      });
    });

    swatch.addEventListener('click', async () => {
      if (!('EyeDropper' in window)) {
        toast('Eyedropper works in Chrome or Edge on desktop');
        return;
      }
      try {
        const { sRGBHex } = await new window.EyeDropper().open();
        const rgb = parseHex(sRGBHex);
        if (rgb) {
          state.a = 1;
          setRgb(rgb);
        }
      } catch {
        /* picking was cancelled */
      }
    });

    setRgb([240, 92, 109]); // design pink
  }

  /* ---------------------------------------------------------
     Journey accordion
     --------------------------------------------------------- */
  $$('.job-head[aria-controls]').forEach((button) => {
    button.addEventListener('click', () => {
      const job = button.closest('.job');
      const open = !job.classList.contains('is-open');
      job.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------------------------------------------------------
     Copy buttons + placeholder links
     --------------------------------------------------------- */
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.body.appendChild(area);
      area.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch { ok = false; }
      area.remove();
      return ok;
    }
  }

  document.addEventListener('click', (event) => {
    const copyButton = event.target.closest('[data-copy]');
    if (copyButton) {
      copyText(copyButton.dataset.copy).then((ok) => {
        toast(ok ? 'Copied to clipboard' : 'Could not copy, please select the text');
        if (!ok) return;
        copyButton.classList.add('is-copied');
        setTimeout(() => copyButton.classList.remove('is-copied'), 1600);
      });
      return;
    }
    const todo = event.target.closest('[data-todo]');
    if (todo) {
      event.preventDefault();
      toast('Coming soon');
    }
  });

  /* ---------------------------------------------------------
     Scroll reveal (things already on screen stay visible)
     --------------------------------------------------------- */
  const reveals = $$('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.04 });
    const fold = window.innerHeight;
    reveals.forEach((el) => {
      if (el.getBoundingClientRect().top < fold) el.classList.add('is-in');
      else observer.observe(el);
    });
    doc.classList.add('js-ready');
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------------------------------------------------------
     Booking: Cal.com inline embed (book-with-yuvi/15min, month view), same settings as
     the React snippet. Cal's loader only runs when the section gets near the screen.
     --------------------------------------------------------- */
  const calBox = $('#cal-inline-15min');
  if (calBox) {
    // The embed resizes itself to fit; scrolling="no" stops a scrollbar flashing inside it
    // while a resize is on its way
    new MutationObserver((records, observer) => {
      const frame = calBox.querySelector('iframe');
      if (!frame) return;
      frame.setAttribute('scrolling', 'no');
      observer.disconnect();
    }).observe(calBox, { childList: true, subtree: true });

    const startCal = () => {
      const namespace = calBox.dataset.calNamespace;
      // Cal.com's standard embed loader
      (function (C, A, L) {
        const p = function (a, ar) { a.q.push(ar); };
        const d = C.document;
        C.Cal = C.Cal || function () {
          const cal = C.Cal;
          const ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement('script')).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api = function () { p(api, arguments); };
            const ns = ar[1];
            api.q = api.q || [];
            if (typeof ns === 'string') {
              cal.ns[ns] = cal.ns[ns] || api;
              p(cal.ns[ns], ar);
              p(cal, ['initNamespace', ns]);
            } else p(cal, ar);
            return;
          }
          p(cal, ar);
        };
      })(window, 'https://app.cal.com/embed/embed.js', 'init');

      window.Cal('init', namespace, { origin: 'https://app.cal.com' });
      const cal = window.Cal.ns[namespace];
      cal('inline', {
        elementOrSelector: `#${calBox.id}`,
        config: { layout: 'month_view', useSlotsViewOnSmallScreen: 'true' },
        calLink: calBox.dataset.calLink,
      });
      // light theme so the booker sits naturally on the white field and white bottom blur
      cal('ui', { theme: 'light', hideEventTypeDetails: false, layout: 'month_view' });
      cal('on', { action: 'linkReady', callback: () => calBox.classList.add('is-ready') });
      cal('on', {
        action: 'linkFailed',
        callback: () => {
          calBox.classList.add('is-ready');
          calBox.insertAdjacentHTML('beforeend', `<p class="cal-fallback">Book a 15 min call: <a href="https://cal.com/${calBox.dataset.calLink}">cal.com/${calBox.dataset.calLink}</a></p>`);
        },
      });
    };

    if ('IntersectionObserver' in window) {
      // start Cal's (heavy) loader in an idle moment, so it doesn't land in the middle of a scroll
      const whenIdle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
      const calObserver = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        calObserver.disconnect();
        whenIdle(startCal, { timeout: 1000 });
      }, { rootMargin: '600px 0px' });
      calObserver.observe(calBox);
    } else {
      startCal();
    }
  }

  /* ---------------------------------------------------------
     Footer crowd: plays the baked Lottie file (Assets/footer/crowd.json).
     That file only uses image layers with keyframed position, scale and opacity, so this
     small player replaces lottie-web: no library, nothing extra to download.
     - Loads in the background once the page is idle (or as soon as the card gets near).
     - Fills the card like "xMidYMid slice": the 342 × 360 file fits the 342px mobile card
       and trims the sides on the 300px web card.
     - Pauses off screen or in a hidden tab; with reduced motion it shows one still frame.
     - The crowd is drawn black & white so the hero in the middle is the only one in colour.
     --------------------------------------------------------- */
  const crowdCard = $('.crowd');
  if (crowdCard) initCrowd(crowdCard, 'Assets/footer/crowd.json');

  function initCrowd(card, src) {
    const canvas = $('.crowd-canvas', card);
    const ctx = canvas && canvas.getContext('2d');
    if (!ctx) return;

    let anim = null; // { w, h, fr, ip, op, layers, images }
    let loading = false;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let near = false;
    let running = false;
    let frameId = 0;
    let frame = 0; // current composition frame
    let lastTime = 0;

    // cubic-bezier(x1, y1, x2, y2) easing, same maths as CSS
    const easings = new Map();
    function bezier(x1, y1, x2, y2) {
      const key = `${x1},${y1},${x2},${y2}`;
      if (easings.has(key)) return easings.get(key);
      const cx = 3 * x1; const bx = 3 * (x2 - x1) - cx; const ax = 1 - cx - bx;
      const cy = 3 * y1; const by = 3 * (y2 - y1) - cy; const ay = 1 - cy - by;
      const sampleX = (t) => ((ax * t + bx) * t + cx) * t;
      const sampleY = (t) => ((ay * t + by) * t + cy) * t;
      const slopeX = (t) => (3 * ax * t + 2 * bx) * t + cx;
      const fn = (x) => {
        if (x <= 0 || x >= 1) return x;
        let t = x;
        for (let i = 0; i < 8; i++) {
          const err = sampleX(t) - x;
          if (Math.abs(err) < 1e-5) return sampleY(t);
          const d = slopeX(t);
          if (Math.abs(d) < 1e-6) break;
          t -= err / d;
        }
        let lo = 0; let hi = 1; t = x;
        while (hi - lo > 1e-5) {
          if (sampleX(t) < x) lo = t; else hi = t;
          t = (lo + hi) / 2;
        }
        return sampleY(t);
      };
      easings.set(key, fn);
      return fn;
    }
    const pick = (v, d) => (Array.isArray(v) ? v[Math.min(d, v.length - 1)] : v);

    // A keyframe's easing curve for one dimension, built the first time it's needed
    function easeOf(key, d) {
      if (!key.o || !key.i) return null;
      if (!key.ease) key.ease = [];
      if (!key.ease[d]) key.ease[d] = bezier(pick(key.o.x, d), pick(key.o.y, d), pick(key.i.x, d), pick(key.i.y, d));
      return key.ease[d];
    }

    // One number of a (possibly keyframed) Lottie property at composition frame t.
    // Returns plain numbers (no arrays), so playing at 60fps creates no garbage for the
    // phone's memory cleaner to stutter on, and resumes from the last keyframe it used.
    function num(prop, t, d = 0) {
      const k = prop.k;
      if (!prop.a) return Array.isArray(k) ? k[d] : k;
      if (t <= k[0].t) return k[0].s[d];
      const last = k.length - 1;
      if (t >= k[last].t) return (k[last].s || k[last - 1].e)[d];
      let n = prop.at || 0;
      if (n >= last || t < k[n].t) n = 0; // the loop started over
      while (t >= k[n + 1].t) n++;
      prop.at = n;
      const a = k[n];
      const from = a.s[d];
      if (a.h) return from;
      const to = (k[n + 1].s || a.e)[d];
      const p = (t - a.t) / (k[n + 1].t - a.t);
      const ease = easeOf(a, d);
      return from + (to - from) * (ease ? ease(p) : p);
    }

    function draw() {
      if (!anim || !W || !H) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const fit = Math.max(W / anim.w, H / anim.h);
      const offX = (W - anim.w * fit) / 2;
      const offY = (H - anim.h * fit) / 2;
      // Lottie lists the top layer first, so paint from the end
      for (let i = anim.layers.length - 1; i >= 0; i--) {
        const layer = anim.layers[i];
        if (frame < layer.ip || frame >= layer.op) continue;
        const asset = anim.images[layer.refId];
        if (!asset) continue;
        const t = (frame - (layer.st || 0)) / (layer.sr || 1);
        const ks = layer.ks;
        const opacity = ks.o ? num(ks.o, t) / 100 : 1;
        if (opacity <= 0) continue;
        const x = ks.p.s ? num(ks.p.x, t) : num(ks.p, t, 0);
        const y = ks.p.s ? num(ks.p.y, t) : num(ks.p, t, 1);
        const rotation = ks.r ? num(ks.r, t) : 0;
        ctx.setTransform(dpr * fit, 0, 0, dpr * fit, dpr * offX, dpr * offY);
        ctx.translate(x, y);
        if (rotation) ctx.rotate((rotation * Math.PI) / 180);
        if (ks.s) ctx.scale(num(ks.s, t, 0) / 100, num(ks.s, t, 1) / 100);
        if (ks.a) ctx.translate(-num(ks.a, t, 0), -num(ks.a, t, 1));
        ctx.globalAlpha = Math.min(1, opacity);
        ctx.drawImage(asset.img, 0, 0, asset.w, asset.h);
      }
      ctx.globalAlpha = 1;
      // first real frame: fade the crowd in instead of popping it onto the pink card
      if (!canvas.classList.contains('is-live')) canvas.classList.add('is-live');
    }

    function tick(time) {
      frameId = requestAnimationFrame(tick);
      const dt = Math.min(0.1, Math.max(0, (time - lastTime) / 1000));
      lastTime = time;
      const length = anim.op - anim.ip;
      frame = anim.ip + ((frame - anim.ip + dt * anim.fr) % length);
      draw();
    }

    function sync() {
      const shouldRun = anim && near && !reduceMotion && !document.hidden;
      if (shouldRun && !running) {
        running = true;
        lastTime = performance.now();
        frameId = requestAnimationFrame(tick);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(frameId);
      }
    }

    function resize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      W = w;
      H = h;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      draw();
    }

    const HERO_LAYERS = ['me', 'glow', 'light'];

    // Black & white copy of an image, made once at load (works in every browser,
    // unlike canvas filters, and costs nothing per frame)
    function greyscale(img) {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const g = c.getContext('2d', { willReadFrequently: true });
      g.drawImage(img, 0, 0);
      const pixels = g.getImageData(0, 0, c.width, c.height);
      const px = pixels.data;
      for (let i = 0; i < px.length; i += 4) {
        const y = px[i] * 0.2126 + px[i + 1] * 0.7152 + px[i + 2] * 0.0722;
        px[i] = y;
        px[i + 1] = y;
        px[i + 2] = y;
      }
      g.putImageData(pixels, 0, 0);
      return c;
    }

    async function load() {
      loading = true;
      try {
        const data = await (await fetch(src)).json();
        // The hero ("me"), his glow and the spotlight stay in colour; the crowd goes black & white
        const colour = new Set(data.layers.filter((l) => HERO_LAYERS.includes(l.nm)).map((l) => l.refId));
        const images = {};
        await Promise.all(data.assets.filter((a) => a.p).map(async (a) => {
          const img = new Image();
          img.src = a.e ? a.p : `${a.u || ''}${a.p}`;
          await img.decode();
          images[a.id] = { img: colour.has(a.id) ? img : greyscale(img), w: a.w, h: a.h };
        }));
        anim = { w: data.w, h: data.h, fr: data.fr, ip: data.ip, op: data.op, layers: data.layers, images };
        frame = anim.ip;
        resize();
        sync();
      } catch {
        loading = false; // keep the pink card; try again next time it comes near
      }
    }

    new IntersectionObserver(([entry]) => {
      near = entry.isIntersecting;
      if (near && !anim && !loading) load();
      sync();
    }, { rootMargin: '300px' }).observe(card);
    // Get it ready early, once the page has settled (not only when the footer is 300px
    // away), so even a fast scroll to the bottom finds the crowd already walking.
    // It still only plays while the card is near the screen.
    const whenIdle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1500));
    const preload = () => whenIdle(() => { if (!anim && !loading) load(); }, { timeout: 4000 });
    if (document.readyState === 'complete') preload();
    else window.addEventListener('load', preload, { once: true });
    new ResizeObserver(resize).observe(canvas);
    document.addEventListener('visibilitychange', sync);
  }
})();
