const HEAD =
  '<h2 class="c-title">Get 10% off your first order</h2>' +
  '<p class="c-sub">Join the Coffee Roasters list for deals and new beans.</p>' +
  '<input class="c-input js-email" type="email" placeholder="Email address" aria-label="Email address" autocomplete="off">';

const END = {
  unfair: {
    yes: 'Joined. The bold button and the guilt wording nudged the choice.',
    no: 'Closed. You still had to click the guilt wording.'
  },
  fair: {
    yes: 'Joined by choice. Both options were easy to find.',
    no: 'Declined in one click. Nothing else happens.'
  }
};

function finish(c, mode, choice) {
  c.unmark();
  if (choice === 'yes') {
    c.q('.card').innerHTML = '<h2 class="c-title">You are on the list</h2><p class="c-sub">Your 10% code is on its way.</p>';
  } else {
    c.q('.overlay').classList.add('off');
  }
  c.setCap(END[mode][choice]);
}

export default {
  brand: '#9d174d',

  html(mode) {
    const body = mode === 'unfair'
      ? '<button class="b-big js-yes" type="button">Yes, send me 10% off</button>' +
        '<button class="b-link js-no" type="button">No thanks, I like paying full price</button>'
      : '<div class="b-row"><button class="b-btn b-fill js-yes" type="button">Join</button>' +
        '<button class="b-btn b-line js-no" type="button">No thanks</button></div>';
    return '<div class="overlay"><div class="card">' + HEAD + body + '</div></div><p class="empty">Pop-up closed</p>';
  },


  build(c, mode) {
    const email = c.q('.js-email'), yes = c.q('.js-yes'), no = c.q('.js-no');
    c.wait(0.8);

    // The shopper only wants to say no. The cursor drifts to the email box and stops there,
    // typing nothing, then heads for the decline, wavering on the way.
    c.move(email, 0.35, 0.5, 0.9);
    c.wait(0.7);

    if (mode === 'unfair') {
      c.move(no, 0.4, 0.5, 0.85);
      c.call(function () { no.classList.add('hov'); c.mark(no); });
      c.wait(0.7);                              // reading the guilt-trip wording
      c.move(yes, 0.6, 0.5, 0.5);               // a flicker towards the big button
      c.call(function () { no.classList.remove('hov'); });
      c.wait(0.35);
      c.move(no, 0.4, 0.5, 0.55);               // and back to the small link
      c.call(function () { no.classList.add('hov'); });
      c.wait(0.45);
      c.click(no, function () { finish(c, mode, 'no'); });
    } else {
      c.move(no, 0.5, 0.5, 0.85);
      c.call(function () { no.classList.add('hov'); });
      c.wait(0.5);
      c.click(no, function () { finish(c, mode, 'no'); });
    }
    c.wait(1.2);
    c.call(function () { c.setCap(END[mode].no); });
  },

  interactive(c, mode) {
    c.q('.js-yes').addEventListener('click', function () { finish(c, mode, 'yes'); });
    c.q('.js-no').addEventListener('click', function () { finish(c, mode, 'no'); });
  }
};
