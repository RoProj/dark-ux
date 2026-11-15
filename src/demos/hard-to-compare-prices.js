// Brand: Arcade, a made-up mobile game shop. Based on Gray et al.'s "intermediate currency".

const PACKS = [
  { gems: 60, price: '£0.99' },
  { gems: 250, price: '£3.99' },
  { gems: 700, price: '£9.99' }
];

function bought(c, gems, price) {
  c.q('.js-res').textContent = 'Bought ' + gems + ' gems for ' + price + '.';
  c.q('.js-gems').textContent = String(60 + gems);
}

export default {
  brand: '#be185d',

  html(mode) {
    if (mode === 'unfair') {
      const packs = PACKS.map(function (p, i) {
        return '<button class="pack" type="button" data-i="' + i + '"><b>' + p.gems + ' gems</b>' + p.price + '</button>';
      }).join('');
      return '<div class="scr on" data-s="s1"><div class="card wide">' +
        '<h2 class="c-title">Arcade shop</h2>' +
        '<div class="line"><span>Speed boost</span><b class="js-item">180 gems</b></div>' +
        '<div class="line"><span>Extra life</span><b>240 gems</b></div>' +
        '<p class="note">Your gems: <b class="js-gems">60</b></p>' +
        '<div class="packs">' + packs + '</div>' +
        '<p class="stat js-res" style="margin-top:10px">&nbsp;</p>' +
        '</div></div>';
    }
    return '<div class="scr on" data-s="s1"><div class="card wide">' +
      '<h2 class="c-title">Arcade shop</h2>' +
      '<div class="line"><span>Speed boost</span><b>£2.99</b></div>' +
      '<div class="line"><span>Extra life</span><b>£3.99</b></div>' +
      '<button class="b-big js-buy" type="button">Buy speed boost</button>' +
      '<p class="stat js-res" style="margin-top:10px">&nbsp;</p>' +
      '</div></div>';
  },

  build(c, mode) {
    c.wait(0.8);
    if (mode === 'unfair') {
      const item = c.q('.js-item'), packs = c.qa('.pack');
      // Working out what the boost really costs: look at the price, then every pack, then back.
      c.move(item, 1.12, 0.5, 0.8);
      c.wait(0.9);
      packs.forEach(function (p) {
        c.move(p, 0.5, 0.5, 0.55);
        c.call(function () { p.classList.add('hov'); });
        c.wait(0.4);
        c.call(function () { p.classList.remove('hov'); });
      });
      c.move(item, 1.12, 0.5, 0.6);
      c.wait(0.6);
      c.move(packs[1], 0.5, 0.5, 0.7);
      c.wait(0.3);
      c.click(packs[1], function () { bought(c, 250, '£3.99'); });
      c.wait(2.2);
    } else {
      const buy = c.q('.js-buy');
      c.move(buy, 0.8, 0.55, 0.9);
      c.wait(0.3);
      c.click(buy, function () { c.q('.js-res').textContent = 'Bought: speed boost, £2.99.'; });
      c.wait(2.2);
    }
  },

  interactive(c, mode) {
    if (mode === 'unfair') {
      c.qa('.pack').forEach(function (b) {
        b.addEventListener('click', function () {
          const p = PACKS[Number(b.dataset.i)];
          bought(c, p.gems, p.price);
        });
      });
    } else {
      c.q('.js-buy').addEventListener('click', function () {
        c.q('.js-res').textContent = 'Bought: speed boost, £2.99.';
      });
    }
  }
};
