// Brand: Plateful, a made-up food delivery app.

const money = function (n) { return '£' + n.toFixed(2); };

const ITEMS = {
  food: ['2 × Katsu curry', 24],
  service: ['Service fee', 4.5],
  peak: ['Peak surcharge', 3],
  delivery: ['Delivery fee', 5.5]
};
const ALL = ['food', 'service', 'peak', 'delivery'];

function table(keys) {
  let sum = 0;
  const rows = keys.map(function (k) {
    sum += ITEMS[k][1];
    return '<div class="line"><span>' + ITEMS[k][0] + '</span><span>' + money(ITEMS[k][1]) + '</span></div>';
  }).join('');
  return rows + '<div class="line total"><span>Total</span><span>' + money(sum) + '</span></div>';
}

function page(id, tag, title, keys, button, go, on) {
  return '<div class="scr' + (on ? ' on' : '') + '" data-s="' + id + '"><div class="card wide">' +
    '<h2 class="c-title">' + (tag ? tag + ': ' : '') + title + '</h2>' + table(keys) +
    '<button class="b-big" type="button" data-path data-go="' + go + '">' + button + '</button>' +
    '</div></div>';
}

function done(total) {
  return '<div class="scr" data-s="s4"><div class="card"><h2 class="c-title">Order placed</h2>' +
    '<p class="c-sub">You paid ' + money(total) + '.</p></div></div>';
}

export default {
  brand: '#2563eb',

  html(mode) {
    if (mode === 'unfair') {
      return page('s1', 'Step 1', 'Your order', ['food'], 'Continue', 's2', true) +
        page('s2', 'Step 2', 'Delivery details', ['food', 'service'], 'Continue', 's3') +
        page('s3', 'Step 3', 'Review and pay', ALL, 'Pay', 's4') +
        done(37);
    }
    // Fair: one screen, every cost visible from the start.
    return page('s1', '', 'Subtotal', ALL, 'Pay', 's4', true) +
      done(37);
  },

  build(c, mode) {
    (mode === 'unfair' ? ['s1', 's2', 's3'] : ['s1']).forEach(function (id) {
      c.wait(1.2);
      const btn = c.q('[data-s="' + id + '"] [data-path]');
      c.move(btn);
      c.call(function () { btn.classList.add('hov'); });
      c.wait(0.25);
      c.click(btn, function () { c.go(btn); });
      c.wait(0.4);
    });
    c.wait(1.9);     // let the booked screen be seen
  },

  interactive(c) {
    c.root.addEventListener('click', function (e) {
      const b = e.target.closest('[data-go]');
      if (b) c.go(b);
    });
  }
};
