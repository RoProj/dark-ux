import gsap from 'gsap';

const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ICON_X = '<svg class="ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
const ICON_OK = '<svg class="ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const ICON_REPLAY = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>';
const ICON_PAUSE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
const ICON_PLAY = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10-6.5a1 1 0 0 0 0-1.72l-10-6.5A1 1 0 0 0 8 5.5z"/></svg>';
const CURSOR ='<svg width="22" height="24" viewBox="0 0 22 24"><path d="M4 2 L4 20 L9 15.5 L12.5 22 L15 21 L11.6 14.6 L18 14 Z" fill="#111312" stroke="#f8f9f7" stroke-width="1.5" stroke-linejoin="round"/></svg>';

/**
 * Mounts one demo (frame, toggle, replay, caption, meters) into `host`.
 *
 * A demo object provides:
 *   html(mode)          -> markup for the stage
 *   meters(mode)        -> [{label, start, num?}] (optional)
 *   build(ctx, mode)    -> adds steps to ctx.tl for the self-playing run
 *   interactive(ctx, mode) -> binds real handlers once the user takes over
 */
const HOLD = 1;         // seconds on the final screen before the restart delay starts
const LOOP_DELAY = 3;   // restart delay. HOLD + LOOP_DELAY = 4s on the final screen

export function mountDemo(host, demo) {
  host.innerHTML =
    '<section class="frame" aria-label="Demo">' +
      '<div class="bar">' +
        '<div class="seg" role="group" aria-label="Version">' +
          '<button type="button" data-mode="unfair" aria-pressed="true">' + ICON_X + 'Unfair</button>' +
          '<button type="button" data-mode="fair" aria-pressed="false">' + ICON_OK + 'Fair</button>' +
        '</div>' +
        '<div class="bar-r">' +
          '<span class="clock" aria-hidden="true" style="visibility:hidden">0:00 / 0:00</span>' +
          '<button type="button" class="replay pp" aria-label="Pause" title="Pause">' + ICON_PAUSE + '</button>' +
          '<button type="button" class="replay rp" aria-label="Replay" title="Replay">' + ICON_REPLAY + '</button>' +
        '</div>' +
        '<i class="progress" aria-hidden="true"></i>' +
      '</div>' +
      '<div class="stage"><div class="surface"></div>' +
        '<div class="cursor" aria-hidden="true">' + CURSOR + '<span class="ring"></span></div>' +
      '</div>' +
    '</section>';

  const frame = host.querySelector('.frame');
  const stage = host.querySelector('.stage');
  const surface = host.querySelector('.surface');
  if (demo.brand) stage.style.setProperty('--brand', demo.brand);
  const cursor = host.querySelector('.cursor');
  const ring = host.querySelector('.ring');
  const meters = host.querySelector('.meters');
  const capEl = host.querySelector('.cap');
  const toggles = host.querySelectorAll('[data-mode]');
  const clock = host.querySelector('.clock');
  const prog = host.querySelector('.progress');   // thin progress line on the control bar. Shown on phones and tablets, where it replaces the timer (see style.css)
  if (prog) host.querySelector('.frame').classList.add('has-progress');

  let mode = 'unfair';
  let tl = null;
  let ctx = null;
  let loop = null;
  let visible = false;
  let started = false;
  let interacting = false;
  let userPaused = false;
  const pp = host.querySelector('.pp');

  // One button: pause while playing, play when paused, finished or taken over.
  function syncPP() {
    // Reads the real state of the timeline, so the icon cannot disagree with what you see.
    const playing = !!tl && !tl.paused() && !interacting && tl.progress() < 1;
    pp.innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
    pp.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    pp.title = playing ? 'Pause' : 'Play';
    // Outlined while you have paused it or taken it over (not while it simply waits off-screen or between loops).
    pp.classList.toggle('is-paused', userPaused || interacting);
  }

  function syncUI() {
    toggles.forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.mode === mode ? 'true' : 'false');
    });
  }

  function setMeters(defs) {
    if (!meters) return;
    meters.hidden = !defs.length;
    meters.style.gridTemplateColumns = 'repeat(' + Math.max(defs.length, 1) + ',1fr)';
    meters.innerHTML = defs.map(function (d) {
      return '<div class="m"><span class="m-l">' + d.label + '</span><span class="m-v">' + d.start + '</span></div>';
    }).join('');
  }

  function dispose() {
    if (tl) tl.kill();
    tl = null;
    if (loop) loop.kill();
    loop = null;
    if (ctx) ctx.dispose.forEach(function (f) { f(); });
    ctx = null;
    gsap.killTweensOf(cursor);
    gsap.killTweensOf(ring);
  }

  function makeCtx(defs) {
    const c = { root: surface, state: {}, dispose: [], vals: defs.map(function (d) { return d.num || 0; }), tl: null };
    const meterEls = function () { return meters ? meters.querySelectorAll('.m-v') : []; };

    c.q = function (s) { return surface.querySelector(s); };
    c.qa = function (s) { return Array.prototype.slice.call(surface.querySelectorAll(s)); };
    c.setCap = function (t) { if (capEl) capEl.textContent = t; };
    c.meter = function (i, t) { const e = meterEls()[i]; if (e) e.textContent = t; };

    // Any tween started while the autoplay runs is added to the autoplay timeline,
    // so pause, resume and replay control it too. In interactive mode it runs on its own.
    c.add = function (target, to, from) {
      if (c.tl) {
        if (from) c.tl.fromTo(target, from, to, c.tl.time());
        else c.tl.to(target, to, c.tl.time());
      } else {
        const tw = from ? gsap.fromTo(target, from, to) : gsap.to(target, to);
        c.dispose.push(function () { tw.kill(); });
      }
    };

    // Animates a numeric meter to a new value.
    c.roll = function (i, to, f) {
      f = f || function (v) { return '£' + v.toFixed(2); };
      const o = { v: c.vals[i] };
      c.add(o, { v: to, duration: 0.5, ease: 'power2.out', onUpdate: function () { c.meter(i, f(o.v)); } });
      c.vals[i] = to;
    };

    c.screen = function (id) {
      surface.querySelectorAll('.scr').forEach(function (s) {
        const on = s.dataset.s === id;
        if (on === s.classList.contains('on')) return;
        s.classList.toggle('on', on);
        if (on) c.add(s, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', overwrite: true }, { opacity: 0, y: 8 });
        else gsap.set(s, { opacity: 0 });
      });
    };

    // One handler for a button that counts a click, rolls a meter and/or changes screen.
    c.go = function (btn) {
      const d = btn.dataset;
      if (d.count !== undefined) {
        const i = Number(d.count);
        c.state.n = c.state.n || [];
        c.state.n[i] = (c.state.n[i] || 0) + 1;
        c.meter(i, String(c.state.n[i]));
      }
      if (d.roll) {
        const p = d.roll.split(':');
        c.roll(Number(p[0]), Number(p[1]));
      }
      if (d.go) c.screen(d.go);
    };

    c.mark = function (el, good) { c.unmark(); el.classList.add('mark'); if (good) el.classList.add('good'); };
    c.unmark = function () { surface.querySelectorAll('.mark').forEach(function (m) { m.classList.remove('mark', 'good'); }); };

    // ---- Timeline steps (only valid when c.tl exists) ----
    c.cap = function (t) { if (capEl) c.tl.call(function () { c.setCap(t); }); };
    c.call = function (fn) { c.tl.call(fn); };
    c.wait = function (d) { c.tl.to({}, { duration: d }); };

    c.move = function (el, ox, oy, d) {
      ox = ox === undefined ? 0.5 : ox;
      oy = oy === undefined ? 0.5 : oy;
      d = d || 0.85;
      const pos = function () {
        const r = el.getBoundingClientRect();
        const s = stage.getBoundingClientRect();
        return { x: r.left - s.left + r.width * ox, y: r.top - s.top + r.height * oy };
      };
      const t = c.tl.duration();
      c.tl.to(cursor, { autoAlpha: 1, duration: 0.15 }, t);
      // Different easing on x and y makes the path a slight arc.
      c.tl.to(cursor, { x: function () { return pos().x; }, duration: d, ease: 'power2.inOut' }, t);
      c.tl.to(cursor, { y: function () { return pos().y; }, duration: d, ease: 'power3.out' }, t);
    };

    c.click = function (el, fn) {
      const t = c.tl.duration();
      c.tl.to(cursor, { scale: 0.85, duration: 0.09, ease: 'power1.out' }, t);
      c.tl.fromTo(ring, { scale: 0.4, autoAlpha: 0.7 }, { scale: 1.4, autoAlpha: 0, duration: 0.45, ease: 'power2.out', immediateRender: false }, t);
      c.tl.call(function () { el.classList.add('press'); if (fn) fn(); }, null, t + 0.09);
      c.tl.to(cursor, { scale: 1, duration: 0.2, ease: 'power2.out' }, t + 0.09);
      c.tl.call(function () { el.classList.remove('press'); }, null, t + 0.3);
    };

    c.type = function (el, text, speed) {
      speed = speed || 0.055;
      const o = { n: 0 };
      c.tl.call(function () { el.value = ''; el.classList.add('hov'); });
      c.tl.to(o, { n: text.length, duration: text.length * speed, ease: 'none', onUpdate: function () { el.value = text.slice(0, Math.round(o.n)); } });
      c.tl.call(function () { el.classList.remove('hov'); });
    };

    return c;
  }

  function prepare() {
    dispose();
    const defs = demo.meters ? demo.meters(mode) : [];
    setMeters(defs);
    surface.innerHTML = demo.html(mode);
    syncUI();
    ctx = makeCtx(defs);
    ctx.setCap('');
    gsap.set(cursor, { x: stage.clientWidth * 0.9, y: stage.clientHeight * 0.92, autoAlpha: 0, scale: 1 });
  }

  function play() {
    interacting = false;
    userPaused = false;
    prepare();
    ctx.tl = gsap.timeline({ paused: true });
    demo.build(ctx, mode);

    // When the action is over the cursor fades away, so it never sits on top of the result.
    // It always stays until the last thing on screen has happened (the final click, screen change
    // or counter tick), then lingers a moment before it goes.
    const IGN = ['duration', 'ease', 'overwrite', 'immediateRender', 'paused', 'parent', 'delay', 'lazy', 'startAt',
      'onComplete', 'onReverseComplete', 'onCompleteParams', 'onReverseCompleteParams', 'callbackScope'];
    const kids = ctx.tl.getChildren(false, true, false);
    const clicks = kids.filter(function (k) { const t = k.targets()[0]; return t === cursor && k.vars.scale === 0.85; })
      .map(function (k) { return k.startTime(); });
    let lastVisible = 0;
    kids.forEach(function (k) {
      const t = k.targets()[0], st = k.startTime(), en = st + k.duration();
      if (t === cursor || t === ring) {
        if (k.vars.scale === 0.85) lastVisible = Math.max(lastVisible, st + 0.09);                  // a click
        if (k.vars.x !== undefined || k.vars.y !== undefined) lastVisible = Math.max(lastVisible, en);   // the cursor still moving
        return;
      }
      if (t && t.classList && t.classList.contains('ln')) return;
      if (typeof t === 'function') {
        if (clicks.some(function (c0) { return Math.abs(st - (c0 + 0.3)) < 0.02; })) return;   // the click's "un-press"
        if (String(k.vars.onComplete || '').indexOf('setCap') > -1) return;                      // caption text is not on screen
        lastVisible = Math.max(lastVisible, st);
        return;
      }
      if (Object.keys(k.vars).some(function (x) { return IGN.indexOf(x) < 0; })) lastVisible = Math.max(lastVisible, en);
    });
    // Every demo sits on its final screen for the same time before it loops: HOLD here, then the
    // restart delay below (LOOP_DELAY). Trailing pauses are trimmed or padded to match.
    const target = lastVisible + HOLD;
    kids.forEach(function (k) {
      const t = k.targets()[0];
      const isWait = t && !t.nodeType && typeof t !== 'function' && Object.keys(t).every(function (x) { return x === '_gsap'; }) &&
        Object.keys(k.vars).every(function (x) { return IGN.indexOf(x) > -1; });
      const isCaption = typeof t === 'function' && String(k.vars.onComplete || '').indexOf('setCap') > -1;
      if ((isWait || isCaption) && k.startTime() + k.duration() > target + 0.001) ctx.tl.remove(k);
    });
    if (ctx.tl.duration() < target) ctx.tl.to({}, { duration: target - ctx.tl.duration() });
    ctx.tl.to(cursor, { autoAlpha: 0, duration: 0.4, ease: 'power1.out' }, lastVisible + 0.4);

    // Grey placeholder lines (.ln) pulse like a page that is still loading. They live on the
    // demo's own timeline, so pause, resume and loop all control them too.
    const lines = ctx.qa('.ln');
    if (lines.length && !RM) {
      const d = 0.8, gap = 0.16;
      // With a stagger, each cycle lasts one fade plus the delay across all the lines.
      const cycleLen = d + gap * (lines.length - 1);
      let cycles = Math.floor(ctx.tl.duration() / cycleLen);
      if (cycles % 2) cycles--;                 // an even count ends back at full opacity
      cycles = Math.max(2, cycles);
      ctx.tl.fromTo(lines, { opacity: 1 },
        { opacity: 0.35, duration: d, ease: 'sine.inOut', yoyo: true, repeat: cycles - 1, stagger: gap }, 0);
    }
    tl = ctx.tl;
    if (RM) tl.timeScale(3);
    // Elapsed / total counter next to the pause button.
    if (clock) {
      const total = tl.duration();
      const fmt = function (s) { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
      const show = function () {
        clock.innerHTML = fmt(tl.time()) + '<span class="ck-tot"> / ' + fmt(total) + '</span>';
        if (prog) prog.style.transform = 'scaleX(' + Math.min(1, tl.time() / total) + ')';
      };
      clock.style.visibility = 'visible';
      show();
      tl.eventCallback('onUpdate', show);
    }
    tl.eventCallback('onComplete', function () {
      syncPP();
      if (RM) return;
      loop = gsap.delayedCall(LOOP_DELAY, function () { if (visible && !interacting && !userPaused) play(); });
    });
    if (visible) tl.play(0);
    syncPP();
  }

  function takeover(msg) {
    interacting = true;
    if (clock) clock.style.visibility = 'hidden';
    if (prog) prog.style.transform = 'scaleX(0)';
    prepare();
    ctx.setCap(msg || 'Autoplay stopped. It is yours now, so click through it.');
    demo.interactive(ctx, mode);
    const lines = ctx.qa('.ln');
    if (lines.length && !RM) {
      const pulse = gsap.fromTo(lines, { opacity: 1 },
        { opacity: 0.35, duration: 0.8, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.16 });
      ctx.dispose.push(function () { pulse.kill(); });
    }
    syncPP();
  }

  pp.addEventListener('click', function () {
    started = true;
    // Nothing running, finished, or the user took over: start the autoplay again.
    if (!tl || interacting || tl.progress() === 1) { play(); return; }
    if (tl.paused()) {
      userPaused = false;
      tl.play();            // an explicit press always wins over the on-screen check
    } else {
      userPaused = true;
      tl.pause();
    }
    syncPP();
  });

  function showStill() {
    takeover('Reduced motion is on. Press replay to watch it, or click the demo yourself.');
  }

  // With a mouse, pressing anywhere on the demo takes it over. With a finger it has to be a real tap on
  // one of the demo's controls: a swipe that starts on the grey background is a scroll, so it must never
  // stop the animation. A scrolling touch ends in pointercancel, never pointerup, so only taps get through.
  const CONTROLS = 'button,a,input,select,textarea,label,[role="button"],[data-go]';
  const isControl = function (el) {
    for (; el && el !== surface; el = el.parentElement) {
      if (el.matches && el.matches(CONTROLS)) return true;
      if (getComputedStyle(el).cursor === 'pointer') return true;
    }
    return false;
  };
  surface.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'touch') return;
    if (!interacting) takeover();
  });
  surface.addEventListener('pointerup', function (e) {
    if (e.pointerType !== 'touch' || interacting) return;
    if (isControl(e.target)) takeover();
  });

  toggles.forEach(function (b) {
    b.addEventListener('click', function () {
      mode = b.dataset.mode;
      started = true;
      if (RM) showStill(); else play();
    });
  });

  host.querySelector('.rp').addEventListener('click', function () {
    // A quick wind-back and return on the icon, so the click visibly registers.
    const icon = host.querySelector('.rp svg');
    if (icon && !RM) {
      gsap.killTweensOf(icon);
      gsap.timeline()
        .to(icon, { rotation: -80, duration: 0.14, ease: 'power2.out', transformOrigin: '50% 50%' })
        .to(icon, { rotation: 0, duration: 0.45, ease: 'back.out(2.2)' });
    }
    started = true;
    play();
  });

  syncUI();

  // Show the opening screen straight away, so the stage is never an empty grey box before it plays.
  prepare();

  // Only play while enough of the demo is on screen, and pause when scrolled away.
  // How much counts as "enough" depends on the viewport: phones are short, so ask for less there.
  const need = window.matchMedia('(max-width: 640px)').matches ? 0.5
    : window.matchMedia('(max-width: 1024px)').matches ? 0.6 : 0.65;
  new IntersectionObserver(function (entries) {
    // isIntersecting is true from the first visible pixel, so test the ratio ourselves.
    visible = entries[0].intersectionRatio >= need - 0.02;
    if (!started) {
      if (visible) { started = true; if (RM) showStill(); else play(); }
      return;
    }
    if (!tl || interacting) return;
    if (visible) {
      if (userPaused) return;
      if (tl.progress() === 1 && !RM) play();
      else tl.play();
    } else {
      tl.pause();
    }
    syncPP();
  }, { threshold: [0, need - 0.02, need, 1] }).observe(stage);
}
