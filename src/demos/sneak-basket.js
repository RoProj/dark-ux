// Brand: Stagedoor, a made-up ticket seller. The venue is made up too.

const money = function (n) { return '£' + n.toFixed(2); };
const BASE = 60, PROTECT = 7.99, QUEUE = 4.5;

const ticketRow = '<div class="line"><span>2 × Stalls ticket</span><span>' + money(BASE) + '</span></div>';
const sub = '<p class="c-sub" style="margin-bottom:8px">The Brindlemoor Playhouse, Sat 22 Nov</p>';

function extra(cls, name, price) {
  return '<div class="line ' + cls + '"><span>' + name + ' <button class="tiny js-rm" type="button">Remove</button></span><span>' + money(price) + '</span></div>';
}

export default {
  brand: '#15803d',

  html(mode) {
    const unfair = mode === 'unfair';
    // Fair: both extras are optional boxes, unticked. Unfair: nothing is offered, then they turn up.
    const opts = unfair ? '' :
      '<label class="opt"><input type="checkbox" class="js-protect"><span>Ticket protection</span><em>+' + money(PROTECT) + '</em></label>' +
      '<label class="opt"><input type="checkbox" class="js-queue"><span>Priority queue</span><em>+' + money(QUEUE) + '</em></label>';
    const sneak = '<div class="js-sneak"' + (unfair ? '' : ' style="display:none"') + '>' +
      extra('js-l-protect', 'Ticket protection', PROTECT) + extra('js-l-queue', 'Priority queue', QUEUE) + '</div>';
    return '<div class="scr on" data-s="s1"><div class="card wide">' +
        '<h2 class="c-title">Your tickets</h2>' + sub + ticketRow + opts +
        '<div class="line total"><span>Total</span><span>' + money(BASE) + '</span></div>' +
        '<button class="b-big js-checkout" type="button" data-go="s2">Checkout</button>' +
      '</div></div>' +
      '<div class="scr" data-s="s2"><div class="card wide">' +
        '<h2 class="c-title">Review order</h2>' + sub + ticketRow + sneak +
        '<div class="line total"><span>Total</span><span class="js-total">' + money(unfair ? BASE + PROTECT + QUEUE : BASE) + '</span></div>' +
        '<button class="b-big js-pay" type="button" data-go="s3">Pay</button>' +
      '</div></div>' +
      '<div class="scr" data-s="s3"><div class="card"><h2 class="c-title">Tickets booked</h2>' +
        '<p class="c-sub">You paid <b class="js-paid"></b>.</p></div></div>';
  },

  build(c, mode) {
    const pay = c.q('.js-pay'), checkout = c.q('.js-checkout'), total = c.q('.js-total');

    c.wait(1);
    c.move(checkout, 0.8, 0.55);
    c.wait(0.3);
    c.click(checkout, function () { c.go(checkout); });
    // The review page loads with the extras already in it. Give the viewer time to see the total.
    c.wait(mode === 'unfair' ? 2.6 : 1.2);

    c.move(pay, 0.8, 0.55);
    c.wait(0.3);
    c.click(pay, function () {
      c.q('.js-paid').textContent = total.textContent;
      c.go(pay);
    });
    c.wait(2.2);
  },

  interactive(c, mode) {
    const total = c.q('.js-total'), sneak = c.q('.js-sneak');
    const protect = c.q('.js-protect'), queue = c.q('.js-queue');
    const lp = c.q('.js-l-protect'), lq = c.q('.js-l-queue');
    const sum = function () {
      const on = function (el) { return el.style.display !== 'none'; };
      total.textContent = money(BASE + (on(lp) ? PROTECT : 0) + (on(lq) ? QUEUE : 0));
    };
    c.root.addEventListener('click', function (e) {
      const rm = e.target.closest('.js-rm');
      if (rm) { rm.closest('.line').style.display = 'none'; sum(); return; }
      const b = e.target.closest('[data-go]');
      if (!b) return;
      if (b.classList.contains('js-checkout') && mode === 'fair') {
        lp.style.display = protect.checked ? '' : 'none';
        lq.style.display = queue.checked ? '' : 'none';
        sneak.style.display = '';
        sum();
      }
      if (b.classList.contains('js-pay')) c.q('.js-paid').textContent = total.textContent;
      c.go(b);
    });
  }
};
