import gsap from 'gsap';

// Brand: Tunebox, a made-up music app. Bait and switch: you set out to cancel, and something else happens.
// A popup asks whether to cancel the subscription and both buttons say "Cancel". The big red one cancels the cancelling.

const KEPT = 'Subscription not cancelled. Thanks for staying with us!';
const GONE = 'Subscription cancelled. You can use Plus until 1 December.';

function setStatus(c, kept) {
  const lab = c.q('.js-lab'), val = c.q('.js-val');
  if (kept === true) { lab.textContent = 'Payment completed'; val.textContent = '£9.99 paid'; val.className = 'js-val ok'; }
  else if (kept === false) { lab.textContent = 'Plan ends'; val.textContent = '1 December'; val.className = 'js-val'; }
}

export default {
  brand: '#4338ca',

  html(mode) {
    const unfair = mode === 'unfair';
    // Unfair: two buttons with the same word. The loud red one is the one that backs out.
    const btns = unfair
      ? '<button class="cx-quiet js-yes" type="button">Cancel</button>' +
        '<button class="b-btn b-danger js-keep" type="button">Cancel</button>'
      : '<button class="b-btn b-blue js-keep" type="button">Keep plan</button>' +
        '<button class="cx-quiet js-yes" type="button">Cancel plan</button>';
    const ask = unfair ? 'Are you sure you want to cancel your subscription?' : 'Cancel your subscription?';
    return '<div class="scr on" data-s="s1"><div class="card wide">' +
        '<h2 class="c-title">Billing</h2>' +
        '<div class="brow"><span>Plus plan</span><b>£9.99 / month</b></div>' +
        '<div class="brow"><span class="js-lab">Next payment</span><b class="js-val">1 December</b></div>' +
        '<button class="b-btn b-line js-cancel" type="button" style="margin-top:14px;padding:0 16px">Cancel subscription</button>' +
      '</div></div>' +
      '<div class="pop js-pop" style="opacity:0;visibility:hidden"><div class="scrim"></div><div class="card">' +
        '<h2 class="c-title">' + ask + '</h2>' +
        '<div class="b-row cx-row">' + btns + '</div>' +
      '</div></div>' +
      '<p class="toast js-toast" style="opacity:0;visibility:hidden"></p>';
  },

  build(c, mode) {
    const unfair = mode === 'unfair';
    const cancel = c.q('.js-cancel'), pop = c.q('.js-pop'), toast = c.q('.js-toast');
    const yes = c.q('.js-yes'), keep = c.q('.js-keep');
    c.wait(1.0);
    c.move(cancel, 0.5, 0.5, 0.85);
    c.wait(0.25);
    c.click(cancel, function () { c.add(pop, { autoAlpha: 1, duration: 0.3 }, { autoAlpha: 0 }); });
    c.wait(1.5);
    if (unfair) {
      // They want out, so they go for the red button. It cancels the cancelling.
      c.move(keep, 0.5, 0.5, 0.7);
      c.wait(0.3);
      c.click(keep, function () {
        c.add(pop, { autoAlpha: 0, duration: 0.25 });
        setStatus(c, true);
        toast.textContent = KEPT;
        c.add(toast, { autoAlpha: 1, duration: 0.3 });
      });
    } else {
      c.move(yes, 0.5, 0.5, 0.7);
      c.wait(0.3);
      c.click(yes, function () {
        c.add(pop, { autoAlpha: 0, duration: 0.25 });
        setStatus(c, false);
        toast.textContent = GONE;
        c.add(toast, { autoAlpha: 1, duration: 0.3 });
      });
    }
    c.wait(2.4);
  },

  interactive(c, mode) {
    const unfair = mode === 'unfair';
    const pop = c.q('.js-pop'), toast = c.q('.js-toast');
    const yes = c.q('.js-yes'), keep = c.q('.js-keep');
    const say = function (t) { toast.textContent = t; gsap.fromTo(toast, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }); };
    const close = function () { gsap.to(pop, { autoAlpha: 0, duration: 0.25 }); };
    c.q('.js-cancel').addEventListener('click', function () {
      gsap.set(toast, { autoAlpha: 0 });
      gsap.fromTo(pop, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
    });
    keep.addEventListener('click', function () {
      close(); setStatus(c, true);
      say(unfair ? KEPT : 'Your plan stays as it is.');
    });
    yes.addEventListener('click', function () { close(); setStatus(c, false); say(GONE); });
    c.dispose.push(function () { gsap.killTweensOf([pop, toast]); });
  }
};
