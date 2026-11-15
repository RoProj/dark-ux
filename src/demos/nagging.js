import gsap from 'gsap';

// Brand: Kettle, a made-up recipe site.

const ASKS = [
  ['Get new recipes in your notifications?', ''],
  ['Are you sure? You will miss new recipes.', 'You can still turn alerts on.'],
  ['Okay, one more try. Alerts?', 'It only takes a tap.'],
  ['Still no? We will ask again soon.', 'Turn on alerts and we will stop.']
];

function ask(c, i) {
  c.q('.pop .c-title').textContent = ASKS[i][0];
  c.q('.pop .c-sub').textContent = ASKS[i][1];
}

export default {
  brand: '#a21caf',

  html(mode) {
    const btns = mode === 'unfair'
      ? '<button class="b-big js-allow" type="button">Allow</button><button class="b-link js-no" type="button">Not now</button>'
      : '<div class="b-row"><button class="b-btn b-fill js-allow" type="button">Allow</button><button class="b-btn b-line js-no" type="button">Not now</button></div>';
    return '<div class="scr on" data-s="s1"><div class="card wide">' +
      '<h2 class="c-title">Weeknight pasta recipe</h2>' +
      '<div class="ln" style="width:94%"></div><div class="ln" style="width:80%"></div>' +
      '<div class="ln" style="width:88%"></div><div class="ln" style="width:52%"></div>' +
      '</div></div>' +
      '<div class="pop js-pop"><div class="scrim"></div><div class="card">' +
      '<h2 class="c-title">' + ASKS[0][0] + '</h2><p class="c-sub">' + ASKS[0][1] + '</p>' + btns +
      '</div></div>' +
      '<p class="toast js-toast" style="opacity:0;visibility:hidden"></p>';
  },

  build(c, mode) {
    const pop = c.q('.js-pop'), no = c.q('.js-no'), toast = c.q('.js-toast');
    const hide = function () { c.add(pop, { autoAlpha: 0, duration: 0.25 }); };
    const show = function (i) {
      ask(c, i);
      c.add(pop, { autoAlpha: 1, duration: 0.3 }, { autoAlpha: 0 });
    };
    c.wait(0.8);
    if (mode === 'unfair') {
      // Say no, and it comes back. Three times.
      // The first round is unhurried. After that it comes back faster each time, as nagging does.
      [1, 2, 3].forEach(function (i) {
        const first = i === 1;
        c.move(no, 0.6, 0.5, first ? 0.5 : 0.35);
        c.wait(first ? 0.2 : 0.15);
        c.click(no, hide);
        c.wait(first ? 1.2 : 0.8);
        c.call(function () { show(i); });
        c.wait(first ? 0.9 : 0.6);
      });
      c.wait(0.8);
    } else {
      c.move(no, 0.6, 0.5, 0.9);
      c.wait(0.35);
      c.click(no, function () {
        hide();
        toast.textContent = 'You can turn on alerts any time in Settings.';
        c.add(toast, { autoAlpha: 1, duration: 0.3 });
      });
      c.wait(3);
    }
  },

  interactive(c, mode) {
    const pop = c.q('.js-pop'), toast = c.q('.js-toast');
    let n = 0, pending = null;
    const say = function (t) { toast.textContent = t; gsap.to(toast, { autoAlpha: 1, duration: 0.3 }); };
    c.q('.js-allow').addEventListener('click', function () {
      if (pending) pending.kill();
      gsap.to(pop, { autoAlpha: 0, duration: 0.25 });
      say('Alerts are on.');
    });
    c.q('.js-no').addEventListener('click', function () {
      gsap.to(pop, { autoAlpha: 0, duration: 0.25 });
      if (mode === 'unfair') {
        // It does not take no for an answer.
        pending = gsap.delayedCall(1.3, function () {
          n = Math.min(n + 1, ASKS.length - 1);
          ask(c, n);
          gsap.fromTo(pop, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
        });
      } else {
        say('You can turn on alerts any time in Settings.');
      }
    });
    c.dispose.push(function () { if (pending) pending.kill(); gsap.killTweensOf([pop, toast]); });
  }
};
