/* NOOK case study: scroll reveal + "On this page" highlight */
(function () {
  'use strict';

  const doc = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Scroll reveal (things already on screen stay visible) — same as the home page */
  const reveals = document.querySelectorAll('.reveal');
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

  /* Contents: the highlight follows the section divider lines.
     A section becomes current once its top line has scrolled above the list. While the next
     line is still crossing the list, each item gets --cut = where that line is inside it, so
     the CSS paints it half "current section" (above the line), half "next section" (below). */
  const toc = document.querySelector('.cs-toc');
  const links = toc ? Array.from(toc.querySelectorAll('a')) : [];
  const sections = links.map((a) => document.getElementById(a.hash.slice(1)));
  if (!links.length || sections.some((s) => !s)) return;
  doc.classList.add('js-toc');

  let current = -1;
  let queued = false;
  function flag(el, name, on) {
    if (on !== el.hasAttribute(name)) el.toggleAttribute(name, on);
  }
  function spy() {
    queued = false;
    if (!toc.offsetParent) return; // list hidden (below 1080px)

    // read everything first, then write
    const tocBox = toc.getBoundingClientRect();
    const lines = sections.map((s) => s.getBoundingClientRect().top);
    const items = links.map((a) => a.getBoundingClientRect());

    let cur = 0;
    for (let j = 1; j < lines.length; j++) if (lines[j] <= tocBox.top) cur = j;
    let next = cur + 1 < lines.length ? cur + 1 : -1;
    // on a very tall screen the last line may never reach the list: finish the move at the end
    const atEnd = window.innerHeight + window.scrollY >= doc.scrollHeight - 2;
    if (atEnd && next !== -1 && lines[next] > tocBox.bottom) { cur = next; next = -1; }
    const lineY = next === -1 ? Infinity : lines[next];

    links.forEach((a, k) => {
      const box = items[k];
      const cut = Math.max(-1, Math.min(box.height + 1, lineY - box.top));
      a.style.setProperty('--cut', cut.toFixed(2) + 'px');
      flag(a, 'data-top', k === cur);
      flag(a, 'data-bot', next === -1 ? k === cur : k === next);
    });

    if (cur === current) return;
    current = cur;
    links.forEach((a, k) => {
      if (k === cur) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }
  function queue() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(spy);
  }
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  if (document.fonts) document.fonts.ready.then(queue);
  spy();
})();
