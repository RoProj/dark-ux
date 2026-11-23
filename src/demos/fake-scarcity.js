import shoes from '../assets/derby-shoes.webp';

// Brand: Shoe Shop, a made-up shoe shop.

const REAL = {
  '7': ['In stock', false],
  '8': ['Only 3 left', true],
  '9': ['In stock', false],
  '10': ['Out of stock', false]
};

function pick(c, mode, size) {
  c.qa('.sz').forEach(function (b) { b.classList.toggle('on', b.dataset.size === size); });
  const stat = c.q('.js-stat');
  const s = mode === 'unfair' ? ['Only 2 left!', true] : REAL[size];
  stat.textContent = s[0];
  stat.classList.toggle('hot', s[1]);
}

export default {
  brand: '#2563eb',

  html() {
    const sizes = ['7', '8', '9', '10'].map(function (s) {
      return '<button class="sz" type="button" data-size="' + s + '">' + s + '</button>';
    }).join('');
    return '<div class="scr on" data-s="s1"><div class="card wide"><div class="pshop">' +
      '<div class="crop"><img src="' + shoes + '" alt="Brown leather derby shoes" draggable="false"></div>' +
      '<div><h2 class="c-title">Leather derby</h2>' +
        '<p class="price">£65</p>' +
        '<div class="sizes">' + sizes + '</div>' +
        '<p class="stat js-stat">&nbsp;</p>' +
        '<button class="b-big js-bag" type="button">Add to bag</button>' +
      '</div></div></div></div>';
  },

  build(c, mode) {
    c.wait(1);
    ['8', '9', '10'].forEach(function (size) {
      const btn = c.q('.sz[data-size="' + size + '"]');
      c.move(btn, 0.7, 0.6, 0.7);
      c.wait(0.25);
      c.click(btn, function () { pick(c, mode, size); });
      c.wait(1.1);
    });
    c.wait(1);
  },

  interactive(c, mode) {
    c.qa('.sz').forEach(function (b) {
      b.addEventListener('click', function () { pick(c, mode, b.dataset.size); });
    });
  }
};
