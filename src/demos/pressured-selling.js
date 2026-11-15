import bouquet from '../assets/spring-bouquet.webp';

// Brand: Petal & Co, a made-up flower shop. Based on Mathur et al.'s "pressured selling":
// the largest, most expensive bouquet is selected by default.

const SIZES = [
  { id: 's', name: 'Small', price: 25 },
  { id: 'm', name: 'Medium', price: 35 },
  { id: 'l', name: 'Large', price: 50 }
];
const money = function (n) { return '£' + n.toFixed(2); };

function add(c) {
  const on = c.q('.opt input:checked');
  if (!on) { c.q('.js-hint').textContent = 'Choose a size first.'; return; }
  const s = SIZES.filter(function (z) { return z.id === on.value; })[0];
  c.q('.js-added').textContent = s.name + ' bouquet, ' + money(s.price);
  c.screen('s2');
}

export default {
  brand: '#166534',

  html(mode) {
    const rows = SIZES.map(function (s) {
      const checked = mode === 'unfair' && s.id === 'l' ? ' checked' : '';
      return '<label class="opt"><input type="radio" name="bouquet-size" value="' + s.id + '"' + checked + '>' +
        '<span>' + s.name + '</span><em>' + money(s.price) + '</em></label>';
    }).join('');
    // Screen one is the product page, so the size list on screen two is not something the shopper set up.
    return '<div class="scr on" data-s="s0"><div class="card wide"><div class="pshop">' +
        '<div class="pimg"><img src="' + bouquet + '" alt="White roses and hydrangea in kraft paper" draggable="false"></div>' +
        '<div><h2 class="c-title">Spring bouquet</h2><p class="price">From £25</p>' +
        '<button class="b-big js-choose" type="button">Choose size</button></div>' +
      '</div></div></div>' +
      '<div class="scr" data-s="s1"><div class="card wide">' +
        '<h2 class="c-title">Choose a size</h2>' + rows +
        '<p class="stat js-hint" style="margin:8px 0 0">&nbsp;</p>' +
        '<button class="b-big js-add" type="button" style="margin-top:6px">Add to cart</button>' +
      '</div></div>' +
      '<div class="scr" data-s="s2"><div class="card"><h2 class="c-title">Added to cart</h2>' +
        '<p class="c-sub js-added"></p></div></div>';
  },

  build(c, mode) {
    const add$ = c.q('.js-add'), choose = c.q('.js-choose');
    // The product page is only context, so it goes by quickly.
    c.wait(0.35);
    c.move(choose, 0.8, 0.55, 0.6);
    c.wait(0.2);
    c.click(choose, function () { c.screen('s1'); });
    c.wait(mode === 'fair' ? 1.1 : 0.9);
    if (mode === 'fair') {
      // Nothing is selected, so the shopper looks at the sizes and picks the smallest.
      const small = c.qa('.opt')[0];
      c.move(small, 0.08, 0.5, 0.9);
      c.wait(0.3);
      c.click(small, function () { small.querySelector('input').checked = true; });
      c.wait(0.7);
    }
    // In the unfair version they go straight for the button; the big one is already picked.
    // Quick on purpose: the shopper isn't reading the selection. Large stays on screen long enough to see.
    const hurry = mode === 'unfair';
    c.move(add$, 0.8, 0.55, hurry ? 0.4 : 0.85);
    c.wait(hurry ? 0.08 : 0.3);
    c.click(add$, function () { add(c); });
    c.wait(2.4);
  },

  interactive(c) {
    c.q('.js-choose').addEventListener('click', function () { c.screen('s1'); });
    c.q('.js-add').addEventListener('click', function () { add(c); });
  }
};
