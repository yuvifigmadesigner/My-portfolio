/* The Art of Better Decisions: the before/after sliders, same behaviour as
   redesigngallery.vercel.app. Scroll reveal and the contents list come from
   js/case-study.js, like the NOOK case study. */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Idle hint once a picture is on screen: the divider peeks in twice, then settles back
  const PEEK = 16;
  const PEEK_STEPS = [[PEEK, 400], [0, 1100], [PEEK, 1500], [0, 2200]];
  // Arrow keys move the divider this far (Shift for bigger steps)
  const KEY_STEP = 5;
  const KEY_STEP_BIG = 25;

  /* ---------- Teaser video ---------- */
  // Plays only while on screen; with reduced motion it stays on its first frame
  const teaser = document.querySelector('.bd-cover video');
  if (teaser) {
    if (reduceMotion) {
      teaser.removeAttribute('autoplay');
      teaser.pause();
    } else if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) teaser.play().catch(() => {});
        else teaser.pause();
      }).observe(teaser);
    }
  }

  document.querySelectorAll('.cmp').forEach((cmp) => {
    let percent = 0;
    let interacted = false; // the visitor drove it: the idle demo must never move it again
    let hovering = false;
    let peekTimers = [];

    function setPercent(p) {
      percent = p;
      cmp.style.setProperty('--p', p.toFixed(2));
      const shown = Math.round(p);
      cmp.setAttribute('aria-valuenow', String(shown));
      cmp.setAttribute('aria-valuetext', shown === 0 ? 'Redesign' : shown === 100 ? 'Original' : `${shown}% original`);
    }
    function cancelPeek() {
      peekTimers.forEach(clearTimeout);
      peekTimers = [];
    }

    function follow(clientX) {
      const box = cmp.getBoundingClientRect();
      setPercent(Math.max(0, Math.min(100, ((clientX - box.left) / box.width) * 100)));
    }
    // The pointer takes over from the idle demo the moment it arrives
    function start() {
      cancelPeek();
      interacted = true;
      hovering = true;
      cmp.classList.add('is-live');
    }
    // The divider stays where they left it
    function end() {
      hovering = false;
      cmp.classList.remove('is-live');
    }

    cmp.addEventListener('mouseenter', start);
    cmp.addEventListener('mousemove', (event) => follow(event.clientX));
    cmp.addEventListener('mouseleave', end);
    cmp.addEventListener('touchstart', start, { passive: true });
    cmp.addEventListener('touchmove', (event) => follow(event.touches[0].clientX), { passive: true });
    cmp.addEventListener('touchend', end);
    cmp.addEventListener('touchcancel', end);

    // Keyboard: arrows nudge the divider, Home shows the redesign, End the original
    cmp.addEventListener('keydown', (event) => {
      const step = event.shiftKey ? KEY_STEP_BIG : KEY_STEP;
      const moves = {
        ArrowLeft: percent - step, ArrowDown: percent - step,
        ArrowRight: percent + step, ArrowUp: percent + step,
        PageDown: percent - KEY_STEP_BIG, PageUp: percent + KEY_STEP_BIG,
        Home: 0, End: 100,
      };
      if (!(event.key in moves)) return;
      event.preventDefault();
      cancelPeek();
      interacted = true;
      setPercent(Math.max(0, Math.min(100, moves[event.key])));
    });

    if (!('IntersectionObserver' in window)) return;
    // Once on screen, the divider peeks in twice: two pictures here, and the handle moves
    if (!reduceMotion) {
      const peek = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        peek.disconnect();
        if (interacted) return;
        PEEK_STEPS.forEach(([p, at]) => {
          peekTimers.push(setTimeout(() => {
            if (!hovering && !interacted) setPercent(p);
          }, at));
        });
      }, { threshold: 0.35 });
      peek.observe(cmp);
    }
    // Fully off screen: back to the redesign, fresh for the next visit
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting || cmp.contains(document.activeElement)) return;
      cancelPeek();
      hovering = false;
      interacted = false;
      cmp.classList.remove('is-live');
      setPercent(0);
    }, { threshold: 0 }).observe(cmp);
  });
})();
