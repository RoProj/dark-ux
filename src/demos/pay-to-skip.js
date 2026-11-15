import gsap from 'gsap';

// Brand: Crossy, a made-up noughts and crosses game. Based on Gray et al.'s "gamification":
// progress that is meant to be earned by playing, or bought. You lose a game while on a streak, and
// the unfair version sells the streak back to you. The fair one just lets you play again.

const STREAK = 7, BEST = 8;
const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
// The scripted game: you take the middle, the computer takes a corner, and so on. You miss the block.
const SCRIPT = [[4, 0], [2, 6], [8, 3]];   // [your move, the computer's reply]

const MARK_X = '<svg class="mk mx" viewBox="0 0 40 40" aria-hidden="true"><path d="M8 8 32 32M32 8 8 32"/></svg>';
const MARK_O = '<svg class="mk mo" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="13"/></svg>';

function winner(b) {
  for (let i = 0; i < LINES.length; i++) {
    const l = LINES[i];
    if (b[l[0]] && b[l[0]] === b[l[1]] && b[l[0]] === b[l[2]]) return { who: b[l[0]], line: l };
  }
  return null;
}
// The computer plays a perfect game, so you can draw it or lose to it, but you can never win. It takes a win
// when it has one, and otherwise picks the move that scores best if both sides play as well as they can.
function score(b, turn, depth) {
  const w = winner(b);
  if (w) return w.who === 'o' ? 10 - depth : depth - 10;
  if (b.indexOf(null) < 0) return 0;
  let best = turn === 'o' ? -Infinity : Infinity;
  for (let i = 0; i < 9; i++) {
    if (b[i]) continue;
    b[i] = turn;
    const v = score(b, turn === 'o' ? 'x' : 'o', depth + 1);
    b[i] = null;
    best = turn === 'o' ? Math.max(best, v) : Math.min(best, v);
  }
  return best;
}
export function reply(b) {
  let move = -1, top = -Infinity;
  [4, 0, 2, 6, 8, 1, 3, 5, 7].forEach(function (i) {
    if (b[i]) return;
    b[i] = 'o';
    const v = score(b, 'x', 1);
    b[i] = null;
    if (v > top) { top = v; move = i; }
  });
  return move;
}
export { winner };

export default {
  brand: '#22a559',

  html(mode) {
    const unfair = mode === 'unfair';
    const cells = Array.from({ length: 9 }, function (_, i) {
      return '<button class="gm-cell" type="button" data-i="' + i + '" aria-label="Square ' + (i + 1) + '">' + MARK_X + MARK_O + '</button>';
    }).join('');
    const offer = unfair
      ? '<h2 class="js-mt">So close!</h2>' +
        '<p class="gm-wait js-mp">You were 1 win away from your top score of <b>' + BEST + '</b>.</p>' +
        '<button class="gm-btn gm-green js-buy" type="button">Save streak <span>£0.99</span></button>' +
        '<button class="gm-link js-skip" type="button">No thanks</button>'
      : '<h2 class="js-mt">You lost</h2>' +
        '<p class="gm-wait js-mp">Streak ' + STREAK + '. Top score ' + BEST + '. Good game.</p>' +
        '<button class="gm-btn gm-amber js-go" type="button">Play again</button>';
    return '<div class="scr on" data-s="s1"><div class="gm">' +
        '<div class="gm-top"><b>Streak <span class="js-streak">' + STREAK + '</span></b><em>Top score <b>' + BEST + '</b></em></div>' +
        '<div class="gm-board js-board">' + cells + '<i class="gm-line js-line"></i></div>' +
        '<p class="gm-status js-status">Your turn</p>' +
        '<div class="gm-modal js-modal"><div class="gm-panel">' + offer + '</div></div>' +
      '</div></div>';
  },

  build(c, mode) {
    const unfair = mode === 'unfair';
    const tl = c.tl;
    const cells = c.qa('.gm-cell'), modal = c.q('.js-modal'), panel = c.q('.gm-panel');
    const status = c.q('.js-status'), line = c.q('.js-line'), board = c.q('.js-board');
    gsap.set(c.qa('.mk'), { transformOrigin: '50% 50%' });
    gsap.set(modal, { autoAlpha: 0 });
    gsap.set(panel, { y: 10, scale: 0.96 });

    const place = function (i, who) {
      const mk = cells[i].querySelector(who === 'x' ? '.mk.mx' : '.mk.mo');
      tl.fromTo(mk, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.28, ease: 'back.out(2.5)' });
    };
    const setStatus = function (t) { tl.call(function () { status.textContent = t; }); };

    // The demo opens mid-game: the earlier moves are already on the board and only your last cross is played.
    SCRIPT.slice(0, -1).forEach(function (mv) {
      gsap.set(cells[mv[0]].querySelector('.mk.mx'), { autoAlpha: 1, scale: 1 });
      gsap.set(cells[mv[1]].querySelector('.mk.mo'), { autoAlpha: 1, scale: 1 });
    });
    c.wait(0.9);
    SCRIPT.slice(-1).forEach(function (mv, n) {
      c.move(cells[mv[0]], 0.5, 0.5, 0.8);
      c.wait(0.1);
      c.click(cells[mv[0]]);
      place(mv[0], 'x');
      setStatus('Computer’s turn');
      c.wait(0.3);
      place(mv[1], 'o');
      setStatus('You lost');
      c.wait(0.2);
    });

    // The computer's line is drawn through its three noughts.
    tl.call(function () {
      const a = cells[0].getBoundingClientRect(), b = cells[6].getBoundingClientRect(), r = board.getBoundingClientRect();
      const x1 = a.left - r.left + a.width / 2, y1 = a.top - r.top + a.height / 2;
      const x2 = b.left - r.left + b.width / 2, y2 = b.top - r.top + b.height / 2;
      const d = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / d, uy = (y2 - y1) / d;
      gsap.set(line, { left: x1 - ux * 10, top: y1 - uy * 10 - 3, width: d + 20, rotation: Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI, scaleX: 0, opacity: 1 });
    });
    tl.to(line, { scaleX: 1, duration: 0.45, ease: 'power2.out' });
    c.wait(0.7);
    tl.to(modal, { autoAlpha: 1, duration: 0.25 });
    tl.to(panel, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out' }, '<');
    c.wait(0.9);

    if (unfair) {
      // The streak is for sale. The way out is a small grey link.
      const buy = c.q('.js-buy');
      c.move(buy, 0.5, 0.5, 0.7);
      c.wait(0.2);
      c.click(buy, function () {
        c.q('.js-mt').textContent = 'Streak saved';
        c.q('.js-mp').innerHTML = '£0.99 charged to your card';
        buy.style.display = 'none';
        c.q('.js-skip').style.display = 'none';
      });
      c.wait(1.0);
    } else {
      const go = c.q('.js-go');
      c.move(go, 0.5, 0.5, 0.7);
      c.wait(0.2);
      c.click(go);
      tl.to(modal, { autoAlpha: 0, duration: 0.2 });
      tl.call(function () {
        c.q('.js-streak').textContent = '0';
        status.textContent = 'Your turn';
        gsap.set(c.qa('.mk'), { autoAlpha: 0 });
        gsap.set(line, { opacity: 0 });
      });
      c.wait(1.0);
    }
  },

  interactive(c, mode) {
    const unfair = mode === 'unfair';
    const cells = c.qa('.gm-cell'), modal = c.q('.js-modal'), panel = c.q('.gm-panel');
    const status = c.q('.js-status'), line = c.q('.js-line'), board = c.q('.js-board');
    const streak = c.q('.js-streak'), title = c.q('.js-mt'), text = c.q('.js-mp');
    gsap.set(c.qa('.mk'), { transformOrigin: '50% 50%' });
    gsap.set(modal, { autoAlpha: 0 });
    gsap.set(panel, { y: 10, scale: 0.96 });
    let b = Array(9).fill(null), over = false, busy = false, n = STREAK, tl = null;

    const run = function (fn) { if (tl) tl.kill(); tl = gsap.timeline(); fn(tl); };
    const mark = function (t, i, who) {
      const mk = cells[i].querySelector(who === 'x' ? '.mk.mx' : '.mk.mo');
      t.fromTo(mk, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.28, ease: 'back.out(2.5)' });
    };
    const showModal = function (t) {
      t.to(modal, { autoAlpha: 1, duration: 0.25 });
      t.to(panel, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out' }, '<');
    };
    const clear = function () {
      b = Array(9).fill(null); over = false; busy = false;
      gsap.set(c.qa('.mk'), { autoAlpha: 0 });
      gsap.set(line, { opacity: 0 });
      status.textContent = 'Your turn';
    };
    const drawLine = function (l) {
      const a = cells[l[0]].getBoundingClientRect(), z = cells[l[2]].getBoundingClientRect(), r = board.getBoundingClientRect();
      const x1 = a.left - r.left + a.width / 2, y1 = a.top - r.top + a.height / 2;
      const x2 = z.left - r.left + z.width / 2, y2 = z.top - r.top + z.height / 2;
      const d = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / d, uy = (y2 - y1) / d;
      gsap.set(line, { left: x1 - ux * 10, top: y1 - uy * 10 - 3, width: d + 20, rotation: Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI, scaleX: 0, opacity: 1 });
    };
    const finish = function (t, result) {
      over = true;
      if (result === 'x') {
        n++; streak.textContent = String(n);
        t.call(function () { status.textContent = 'You won'; });
        t.to({}, { duration: 1.1 });
        t.call(clear);
        return;
      }
      t.call(function () { status.textContent = result === 'o' ? 'You lost' : 'A draw'; });
      t.to({}, { duration: 0.6 });
      t.call(function () {
        if (unfair) { c.q('.js-buy').style.display = ''; c.q('.js-skip').style.display = ''; }
        title.textContent = unfair ? 'So close!' : (result === 'o' ? 'You lost' : 'A draw');
        text.innerHTML = unfair ? 'You were 1 win away from your top score of <b>' + BEST + '</b>.' : 'Streak ' + n + '. Top score ' + BEST + '. Good game.';
      });
      showModal(t);
    };

    cells.forEach(function (cell, i) {
      cell.addEventListener('click', function () {
        if (busy || over || b[i]) return;
        busy = true;
        b[i] = 'x';
        run(function (t) {
          mark(t, i, 'x');
          let w = winner(b);
          if (w) { finish(t, 'x'); return; }
          if (b.indexOf(null) < 0) { finish(t, 'draw'); return; }
          t.call(function () { status.textContent = 'Computer’s turn'; });
          t.to({}, { duration: 0.3 });
          const m = reply(b);
          b[m] = 'o';
          mark(t, m, 'o');
          w = winner(b);
          if (w) {
            t.call(function () { drawLine(w.line); });
            t.to(line, { scaleX: 1, duration: 0.45, ease: 'power2.out' });
            finish(t, 'o');
            return;
          }
          if (b.indexOf(null) < 0) { finish(t, 'draw'); return; }
          t.call(function () { status.textContent = 'Your turn'; busy = false; });
        });
      });
    });

    const close = function () {
      run(function (t) { t.to(modal, { autoAlpha: 0, duration: 0.2 }); t.call(clear); });
    };
    if (unfair) {
      c.q('.js-buy').addEventListener('click', function () {
        const buy = c.q('.js-buy');
        title.textContent = 'Streak saved';
        text.innerHTML = '£0.99 charged to your card';
        buy.style.display = 'none';
        c.q('.js-skip').style.display = 'none';
        run(function (t) { t.to({}, { duration: 1.0 }); t.to(modal, { autoAlpha: 0, duration: 0.2 }); t.call(clear); });
      });
      c.q('.js-skip').addEventListener('click', function () { n = 0; streak.textContent = '0'; close(); });
    } else {
      c.q('.js-go').addEventListener('click', function () { n = 0; streak.textContent = '0'; close(); });
    }
    c.dispose.push(function () { if (tl) tl.kill(); });
  }
};
