// Brand: Postbox, a made-up email app.

function finish(c) {
  const on = c.q('.js-box').checked;
  c.q('.js-res').textContent = on
    ? 'You will get offers from our partners.'
    : 'We will not send you partner offers.';
  c.screen('s2');
}

export default {
  brand: '#3730a3',

  html(mode) {
    const label = mode === 'unfair'
      ? 'Tick this box if you do not want to not receive offers from our partners.'
      : 'Send me offers from our partners.';
    return '<div class="scr on" data-s="s1"><div class="card">' +
        '<h2 class="c-title">Almost done</h2><p class="c-sub">Finish creating your Postbox account.</p>' +
        '<input class="c-input" value="you@example.com" readonly aria-label="Email address">' +
        '<label class="tq js-row"><input type="checkbox" class="js-box"><span>' + label + '</span></label>' +
        '<button class="b-big js-finish" type="button">Finish</button>' +
      '</div></div>' +
      '<div class="scr" data-s="s2"><div class="card"><h2 class="c-title">Account created</h2>' +
        '<p class="c-sub js-res"></p></div></div>';
  },

  build(c, mode) {
    const row = c.q('.js-row'), box = c.q('.js-box'), fin = c.q('.js-finish');
    c.wait(1.2);
    if (mode === 'unfair') {
      // Someone who wants no emails ticks the box, because that is how the sentence reads.
      c.move(row, 0.03, 0.5);
      c.wait(0.35);
      c.click(row, function () { box.checked = true; });
      c.wait(1.5);
    } else {
      c.wait(0.8);
    }
    c.move(fin, 0.8, 0.55);
    c.wait(0.3);
    c.click(fin, function () { finish(c); });
    c.wait(2.6);
  },

  interactive(c) {
    c.q('.js-finish').addEventListener('click', function () { finish(c); });
  }
};
