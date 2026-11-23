// Brand: Recipe Club, a made-up recipe blog.

function decide(c, choice) {
  const cb = c.q('.js-cb'), toast = c.q('.js-toast');
  toast.textContent = choice === 'accept' ? 'Cookies accepted.' : 'Cookies rejected.';
  c.add(cb, { autoAlpha: 0, duration: 0.3 });
  c.add(toast, { autoAlpha: 1, duration: 0.3 });
}

export default {
  brand: '#1d4ed8',

  html(mode) {
    // Unfair: a solid Accept next to tiny, pale Reject text. Fair: the same Accept, with Reject as plain readable text. Fair: two matching buttons.
    const btns = mode === 'unfair'
      ? '<button class="cb-btn fill js-accept" type="button">Accept all</button>' +
        '<button class="cb-faint js-reject" type="button">Reject all</button>'
      : '<button class="cb-btn fill js-accept" type="button">Accept all</button>' +
        '<button class="cb-faint clear js-reject" type="button">Reject all</button>';
    return '<div class="scr on" data-s="s1"><div class="card wide">' +
        '<h2 class="c-title">Autumn recipes</h2>' +
        '<div class="ln" style="width:92%"></div><div class="ln" style="width:76%"></div>' +
        '<div class="ln" style="width:84%"></div>' +
      '</div>' +
      '<div class="cb js-cb"><p>We use cookies to personalise content and ads.</p>' +
        '<div class="cb-btns">' + btns + '</div></div>' +
      '<p class="toast js-toast" style="opacity:0;visibility:hidden"></p>' +
      '</div>';
  },

  build(c, mode) {
    const accept = c.q('.js-accept'), reject = c.q('.js-reject');
    c.wait(1);
    if (mode === 'unfair') {
      // The eye lands on Accept first. Reject takes a hunt.
      c.move(accept, 0.8, 0.55, 0.9);
      c.wait(0.6);
      c.move(reject, 0.5, 0.5, 0.8);
      c.wait(0.5);
    } else {
      c.move(reject, 0.8, 0.55, 0.9);
      c.wait(0.4);
    }
    c.click(reject, function () { decide(c, 'reject'); });
    c.wait(2.2);
  },

  interactive(c) {
    c.q('.js-accept').addEventListener('click', function () { decide(c, 'accept'); });
    c.q('.js-reject').addEventListener('click', function () { decide(c, 'reject'); });
  }
};
