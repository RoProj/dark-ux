import gsap from 'gsap';
import shirt from '../assets/linen-overshirt.webp';

// Brand: Linen Store, a made-up clothing shop.

const fmt = function (s) {
  s = Math.max(0, Math.ceil(s));
  return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
};

const COUNT = 4;   // seconds the fake countdown shows before it "runs out"

function added(bag) {
  bag.textContent = '✓ Added to bag';
  bag.classList.add('added');
}

export default {
  brand: '#047857',

  html(mode) {
    const banner = mode === 'unfair'
      ? '<div class="banner"><span>Flash sale ends in</span><b class="js-timer">' + fmt(COUNT) + '</b></div>'
      : '<div class="banner"><span>Sale ends</span><b>Sunday 15 November</b></div>';
    return '<div class="scr on" data-s="s1"><div class="card wide">' + banner +
      '<div class="shop"><img class="pic" src="' + shirt + '" alt="Linen overshirt in olive green" width="120" height="150" draggable="false"><div>' +
      '<h2 class="c-title">Linen overshirt</h2>' +
      '<p class="price"><b>£48</b><s>£96</s></p>' +
      '<button class="b-big js-bag" type="button">Add to bag</button>' +
      '</div></div></div></div>';
  },

  meters() {
    return [{ label: 'Times the deadline moved', start: '0' }];
  },

  build(c, mode) {
    const bag = c.q('.js-bag');
    c.wait(0.7);

    const unfair = mode === 'unfair';
    const timer = c.q('.js-timer');
    const o = { s: COUNT };
    const t0 = c.tl.duration();

    // Same cursor path in both versions: rest beside the deadline in the banner
    // (never on top of it), then go to the button and click.
    c.move(unfair ? timer : c.q('.banner b'), unfair ? 1.15 : 1.05, 0.5, 0.9);
    c.wait(0.9);
    c.move(bag, 0.8, 0.55, 0.95);
    c.wait(0.25);
    c.click(bag, function () { added(bag); });   // lands with about a second left on the clock
    if (unfair) {
      // Back to the clock, beside it, to watch it run out and start again.
      c.wait(0.3);
      c.move(timer, 1.15, 0.5, 0.7);
    }

    if (unfair) {
      // The clock runs the whole time. When it hits zero it simply starts again.
      c.tl.to(o, { s: 0, duration: COUNT, ease: 'none', onUpdate: function () { timer.textContent = fmt(o.s); } }, t0);
      const tReset = t0 + COUNT + 0.7;
      const o2 = { s: 599 };
      c.tl.call(function () {
        timer.textContent = '09:59';
        c.meter(0, '1');
      }, null, tReset);
      // After the reset it carries on counting from ten minutes: 09:59 down to 09:56.
      c.tl.to(o2, { s: 596, duration: 3, ease: 'none', onUpdate: function () { timer.textContent = fmt(o2.s); } }, tReset);
      c.tl.to({}, { duration: 0.8 }, tReset + 3);   // short hold before it loops
    } else {
      c.wait(2.4);
    }
  },

  interactive(c, mode) {
    const bag = c.q('.js-bag');
    bag.addEventListener('click', function () { added(bag); });
    if (mode !== 'unfair') return;
    const timer = c.q('.js-timer');
    const o = { s: COUNT };
    const tw = gsap.to(o, {
      s: 0, duration: COUNT, ease: 'none',
      onUpdate: function () { timer.textContent = fmt(o.s); },
      onComplete: function () {
        // Out of time? It starts again from ten minutes.
        c.meter(0, '1');
        o.s = 599;
        gsap.to(o, { s: 0, duration: 599, ease: 'none', onUpdate: function () { timer.textContent = fmt(o.s); } });
      }
    });
    c.dispose.push(function () { tw.kill(); gsap.killTweensOf(o); });
  }
};
