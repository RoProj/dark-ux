// Brand: Ember Roasters, a made-up coffee shop.

const BASE = 18;
const OPTS = [
  ['Shipping protection', 4.99],
  ['Gift wrap', 3.5],
  ['Round up for charity', 1]
];
const money = function (n) { return '£' + n.toFixed(2); };

function total(c) {
  let sum = BASE;
  c.qa('.opt input').forEach(function (i) { if (i.checked) sum += Number(i.dataset.price); });
  c.q('.js-total').textContent = money(sum);
  return sum;
}

function pay(c) {
  const sum = total(c);
  c.q('.js-paid').textContent = money(sum);
  c.screen('done');
}

export default {
  brand: '#0369a1',

  html(mode) {
    const checked = mode === 'unfair' ? ' checked' : '';
    const opts = OPTS.map(function (o) {
      return '<label class="opt"><input type="checkbox" data-price="' + o[1] + '"' + checked + '><span>' + o[0] + '</span><em>+' + money(o[1]) + '</em></label>';
    }).join('');
    const start = mode === 'unfair' ? BASE + 9.49 : BASE;
    // Page one is the basket: just the beans, no extras. The extras only appear on page two.
    // Both cards are the same height with the button at the bottom, so "Checkout" and "Pay"
    // sit in exactly the same spot on screen.
    return '<div class="scr on" data-s="s0"><div class="card wide pre">' +
      '<h2 class="c-title">Your basket</h2>' +
      '<div class="line"><span>Single-origin beans, 500g</span><span>' + money(BASE) + '</span></div>' +
      '<div class="line"><span>Grind</span><span>Whole beans</span></div>' +
      '<div class="line"><span>Delivery</span><span>Free</span></div>' +
      '<div class="line total"><span>Total</span><b>' + money(BASE) + '</b></div>' +
      '<div class="gap"></div>' +
      '<button class="b-big js-checkout" type="button">Checkout</button>' +
      '</div></div>' +
      '<div class="scr" data-s="s1"><div class="card wide pre">' +
      '<h2 class="c-title">Checkout</h2>' +
      '<div class="line"><span>Single-origin beans, 500g</span><span>' + money(BASE) + '</span></div>' + opts +
      '<div class="line total"><span>Total</span><b class="js-total">' + money(start) + '</b></div>' +
      '<div class="gap"></div>' +
      '<button class="b-big js-pay" type="button">Pay</button>' +
      '</div></div>' +
      '<div class="scr" data-s="done"><div class="card"><h2 class="c-title">Order placed</h2>' +
      '<p class="c-sub">You paid <b class="js-paid"></b>.</p></div></div>';
  },

  meters(mode) {
    return [{ label: 'Extras added without asking you', start: mode === 'unfair' ? '£9.49' : '£0.00' }];
  },


  build(c, mode) {
    const pay$ = c.q('.js-pay'), checkout = c.q('.js-checkout');

    // Page one: only the beans are in the basket. It is just context, so it goes by quickly.
    c.wait(0.35);
    c.move(checkout, 0.8, 0.55, 0.6);
    c.wait(0.2);
    c.click(checkout, function () { c.screen('s1'); });

    if (mode === 'unfair') {
      // The cursor does not move. Pay lands in the same spot as Checkout did, and the shopper
      // is just pressing, not reading, so the second click goes straight through.
      c.call(function () { c.qa('.opt').forEach(function (o) { o.classList.add('mark'); }); });
      c.wait(1.5);
      c.click(pay$, function () { pay(c); });
      c.wait(2);
    } else {
      c.wait(0.45);
      const gift = c.qa('.opt')[1];
      c.cap('Same page, same extras. All of them start unticked.');
      c.wait(0.5);
      c.move(gift, 0.1, 0.5, 0.72);
      c.wait(0.13);
      c.click(gift, function () { gift.querySelector('input').checked = true; total(c); });
      c.cap('You opt in to what you want, and the total shows exactly that.');
      c.wait(0.6);
      c.move(pay$);
      c.wait(0.4);
      c.click(pay$, function () { pay(c); });
      c.wait(2);
      c.cap('Paid £21.50: the beans and the gift wrap you picked.');
    }
  },

  interactive(c) {
    c.q('.js-checkout').addEventListener('click', function () { c.screen('s1'); });
    c.qa('.opt input').forEach(function (i) { i.addEventListener('change', function () { total(c); }); });
    c.q('.js-pay').addEventListener('click', function () { pay(c); });
  }
};
