import gsap from 'gsap';

// Brand: Weekly Digest, a made-up newsletter. Based on the example in Gray et al.: a site that
// made people agree to let it sell their information before it would let them go ahead.
// Here the thing you are trying to do is sign up.

function done(c) {
  c.q('.js-result').textContent = c.q('.js-box').checked
    ? 'Your details have been shared with our partners.'
    : 'You’ve chosen not to share your data with us.';
  c.screen('s2');
}

function shake(reg, req) {
  gsap.fromTo(reg, { x: -4 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
  if (req) req.style.display = '';
}

export default {
  brand: '#1d4ed8',

  html(mode) {
    const unfair = mode === 'unfair';
    // Unfair: the box is compulsory, and says so only after you try to carry on without it.
    // Fair: the same box is optional and starts unticked.
    const agree = unfair
      ? '<label class="tq js-row"><input type="checkbox" class="js-box"><span>I agree to Weekly Digest sharing my details with its partners.<b class="req">*</b><b class="req js-req" style="display:none"> (required)</b></span></label>'
      : '<label class="tq js-row"><input type="checkbox" class="js-box"><span>I agree to Weekly Digest sharing my details with its partners. <span class="optn">(optional)</span></span></label>';
    return '<div class="scr on" data-s="s1"><div class="card">' +
        '<h2 class="c-title">Create your account</h2>' +
        '<input class="c-input js-email" type="email" placeholder="Email address" aria-label="Email address" autocomplete="off">' + agree +
        '<div class="regwrap js-regwrap"><button class="b-big js-reg" type="button"' + (unfair ? ' disabled' : '') + '>Create account</button></div>' +
      '</div></div>' +
      '<div class="scr" data-s="s2"><div class="card"><h2 class="c-title">Account created</h2>' +
        '<p class="c-sub js-result"></p></div></div>';
  },

  build(c, mode) {
    const reg = c.q('.js-reg'), email = c.q('.js-email'), req = c.q('.js-req');
    c.wait(1);
    c.move(email, 0.3, 0.5, 0.8);
    c.type(email, 'you@example.com');
    c.wait(0.3);
    if (mode === 'unfair') {
      const row = c.q('.js-row'), box = c.q('.js-box');
      // First try: the button is greyed out and does nothing, except show what is missing.
      c.move(reg, 0.8, 0.55, 0.85);
      c.wait(0.3);
      c.click(reg, function () { shake(reg, req); });
      c.wait(0.9);
      // The only way forward is the box.
      c.move(row, 0.03, 0.5, 0.8);
      c.wait(0.4);
      c.click(row, function () { box.checked = true; reg.disabled = false; });
      c.wait(0.7);
      c.move(reg, 0.8, 0.55, 0.7);
      c.wait(0.3);
    } else {
      // The box is optional, so it is left alone.
      c.move(reg, 0.8, 0.55, 0.85);
      c.wait(0.3);
    }
    c.click(reg, function () { done(c); });
    c.wait(2.4);
  },

  interactive(c, mode) {
    const reg = c.q('.js-reg'), box = c.q('.js-box'), req = c.q('.js-req');
    if (mode === 'unfair') box.addEventListener('change', function () { reg.disabled = !box.checked; });
    // A greyed-out button swallows clicks, so the wrapper listens for them instead.
    c.q('.js-regwrap').addEventListener('click', function () {
      if (reg.disabled) shake(reg, req); else done(c);
    });
  }
};
