import jeans from '../assets/black-jeans.webp';

// Brand: Poster Shop, a made-up poster shop.

export default {
  brand: '#7c3aed',

  html(mode) {
    const unfair = mode === 'unfair';
    const second = unfair
      ? '<h2 class="c-title">Create an account to continue</h2>' +
        '<input class="c-input js-email" type="email" placeholder="Email address" aria-label="Email address" autocomplete="off">' +
        '<button class="b-big js-go" type="button" data-go="s3">Create account</button>'
      : '<h2 class="c-title">Checkout</h2><p class="c-sub">No account needed.</p>' +
        '<input class="c-input js-email" type="email" placeholder="Email address" aria-label="Email address" autocomplete="off">' +
        '<button class="b-big is-blue js-create" type="button" data-go="s4">Create account</button>' +
        '<p class="hurry">In a hurry? <button class="tl js-go" type="button" data-go="s3">Continue as guest</button></p>';
    const third = unfair
      ? '<h2 class="c-title">Check your inbox</h2><p class="c-sub">Verify your email, then come back to finish your order.</p>'
      : '<h2 class="c-title">Order placed</h2><p class="c-sub">Your receipt is on its way.</p>' +
        '<p class="c-sub" style="margin-top:16px">Want an account for next time? It saves your details, so the next order is quicker.</p>' +
        '<div class="b-row"><button class="b-btn b-fill" type="button">Create account</button><button class="b-btn b-line" type="button">No thanks</button></div>';
    return '<div class="scr on" data-s="s1"><div class="card wide"><div class="pshop sqrow">' +
        '<div class="pimg sq"><img src="' + jeans + '" alt="Folded black jeans on a wooden floor" draggable="false"></div>' +
        '<div class="pinfo"><div><h2 class="c-title">Jeans</h2><p class="price">£24</p></div>' +
        '<button class="b-big js-buy" type="button" data-go="s2">Buy now</button></div>' +
      '</div></div></div>' +
      '<div class="scr" data-s="s2"><div class="card">' + second + '</div></div>' +
      '<div class="scr" data-s="s3"><div class="card">' + third + '</div></div>' +
      '<div class="scr" data-s="s4"><div class="card"><h2 class="c-title">Account created</h2><p class="c-sub">Your order is placed, and your receipt is on its way.</p></div></div>';
  },

  build(c, mode) {
    const buy = c.q('.js-buy'), email = c.q('.js-email'), go = c.q('.js-go');
    c.wait(1.1);
    c.move(buy, 0.8, 0.55);
    c.wait(0.3);
    c.click(buy, function () { c.go(buy); });
    c.wait(0.8);
    c.move(email, 0.3, 0.5);
    c.type(email, 'you@example.com');
    c.wait(0.4);
    c.move(go, 0.8, 0.55);
    c.wait(0.3);
    c.click(go, function () { c.go(go); });
    if (mode === 'unfair') {
      c.wait(2.6);
    } else {
      // Slide the cursor off to the side so it is not sitting on the account offer.
      c.wait(0.4);
      c.move(c.q('[data-s="s3"] .card'), 1.2, 0.5, 0.7);
      c.wait(2.9);
    }
  },

  interactive(c) {
    c.root.addEventListener('click', function (e) {
      const b = e.target.closest('[data-go]');
      if (b) c.go(b);
    });
  }
};
