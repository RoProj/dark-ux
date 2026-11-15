// Brand: Lumen, a made-up music app. Buttons carry data attributes so the
// autoplay and the user's own clicks run the same code (ctx.go).

// A strip across the top of each screen: which phase this is, and how far in.
function bar(phase, label, kind) {
  return '<div class="stepbar ' + kind + '"><span>' + phase + '</span><b>' + label + '</b></div>';
}
const reg = function (label) { return bar('Registration', label, 'reg'); };
const cxUnfair = function (n) { return bar('Cancellation', 'Step ' + n, 'cx'); };
const cxFair = function (n) { return bar('Cancellation', 'Step ' + n, 'cx fair'); };

function scr(id, inner, on) {
  return '<div class="scr' + (on ? ' on' : '') + '" data-s="' + id + '"><div class="card">' + inner + '</div></div>';
}

const JOIN =
  scr('s1', reg('Step 1') + '<h2 class="c-title">Lumen Premium</h2><p class="c-sub">No ads. Offline listening. £12 a month.</p>' +
    '<button class="b-big" type="button" data-path data-go="s2" data-count="0">Subscribe</button>', true) +
  scr('s2', reg('Step 2') + '<h2 class="c-title">Confirm payment</h2><p class="c-sub">Card ending 4242. £12.00 a month.</p>' +
    '<button class="b-big" type="button" data-path data-go="s3" data-count="0">Confirm</button>');

const UNFAIR =
  JOIN +
  scr('s3', reg('Complete') + '<div class="top-right"><button class="tiny" type="button" data-path data-go="s4" data-count="1">Account</button></div>' +
    '<h2 class="c-title">Welcome to Premium</h2><p class="c-sub">Your music, with no ads.</p>') +
  scr('s4', cxUnfair(1) + '<h2 class="c-title">Your account</h2><p class="c-sub">Profile, devices, privacy.</p>' +
    '<p class="note"><button class="tiny" type="button" data-path data-go="s5" data-count="1">Billing</button></p>') +
  scr('s5', cxUnfair(2) + '<h2 class="c-title">Billing</h2><p class="c-sub">Next payment: £12.00 on 11 Dec.</p>' +
    '<p class="note"><button class="tiny" type="button" data-path data-go="s6" data-count="1">Manage plan</button></p>') +
  scr('s6', cxUnfair(3) + '<h2 class="c-title">Wait, stay for 50% off?</h2><p class="c-sub">Three months at £6 a month.</p>' +
    '<button class="b-big" type="button" data-go="s3">Keep my plan</button>' +
    '<button class="b-link" type="button" data-path data-go="s7" data-count="1">Continue to cancel</button>') +
  scr('s7', cxUnfair(4) + '<h2 class="c-title">Why are you leaving?</h2><p class="c-sub">Required before you continue.</p>' +
    '<div class="reasons"><button class="reason" type="button" data-go="s8" data-count="1">Too expensive</button>' +
    '<button class="reason" type="button" data-path data-go="s8" data-count="1">I do not use it enough</button>' +
    '<button class="reason" type="button" data-go="s8" data-count="1">Other</button></div>') +
  scr('s8', cxUnfair(5) + '<h2 class="c-title">Are you sure?</h2><p class="c-sub">You will lose your 214 saved songs.</p>' +
    '<button class="b-big" type="button" data-go="s3">Keep my plan</button>' +
    '<button class="b-link" type="button" data-path data-go="s9" data-count="1">Cancel anyway</button>') +
  scr('s9', cxUnfair(6) + '<h2 class="c-title">Call us to cancel</h2><p class="c-sub">Mon to Fri, 9am to 5pm.<br>1-800-555-0142</p>' +
    '<p class="note">You are still subscribed.</p>');

const FAIR =
  JOIN +
  // Same welcome screen as the unfair version, with the Account link easy to read.
  scr('s3', reg('Complete') + '<div class="top-right"><button class="nl" type="button" data-path data-go="s4" data-count="1">Account</button></div>' +
    '<h2 class="c-title">Welcome to Premium</h2><p class="c-sub">Your music, with no ads.</p>') +
  scr('s4', cxFair(1) + '<h2 class="c-title">Your account</h2><p class="c-sub">Profile, devices, privacy.</p>' +
    '<button class="b-btn b-danger-line" type="button" style="width:100%;margin-top:14px" data-path data-go="s5" data-count="1">Cancel plan</button>') +
  scr('s5', cxFair(2) + '<h2 class="c-title">Cancel Premium?</h2><p class="c-sub">You keep access until 11 Dec.</p>' +
    '<div class="b-row"><button class="b-btn b-line" type="button" data-go="s3">Keep plan</button>' +
    '<button class="b-btn b-danger" type="button" data-path data-go="s6" data-count="1">Cancel plan</button></div>') +
  scr('s6', cxFair(3) + '<h2 class="c-title">Plan cancelled</h2><p class="c-sub">No more payments. Listening works until 11 Dec.</p>');

const STEPS = {
  unfair: [
    ['s1', 'Joining is easy: two clicks.'],
    ['s2'],
    ['s3', 'Now leaving. The link is tiny and tucked in a corner.'],
    ['s4'],
    ['s5', 'Cancel is buried under “Manage plan”.'],
    ['s6', 'A discount offer, and a very small link to continue.'],
    ['s7', 'A required survey comes next.'],
    ['s8', 'Another warning, and another small link.']
  ],
  fair: [
    ['s1', 'Joining is two clicks.'],
    ['s2'],
    ['s3', 'Leaving starts from the Account link, which is easy to read.'],
    ['s4', 'The cancel button is right there.'],
    ['s5', 'One confirmation, with the facts spelled out.']
  ]
};

export default {
  brand: '#6246ea',

  html(mode) { return mode === 'unfair' ? UNFAIR : FAIR; },

  meters() {
    return [
      { label: 'Clicks to join', start: '0' },
      { label: 'Clicks to leave', start: '0' }
    ];
  },


  build(c, mode) {
    STEPS[mode].forEach(function (st) {
      if (st[1]) c.cap(st[1]);
      c.wait(0.4);
      const btn = c.q('[data-s="' + st[0] + '"] [data-path]');
      c.move(btn);
      c.call(function () { btn.classList.add('hov'); });
      c.wait(0.25);
      c.click(btn, function () { c.go(btn); });
    });
    c.wait(0.6);
    if (mode === 'unfair') {
      c.cap('Six clicks later you still have to phone someone. You are still subscribed.');
    } else {
      c.cap('Cancelled in two clicks. The way out is as easy as the way in.');
    }
  },

  interactive(c) {
    c.root.addEventListener('click', function (e) {
      const b = e.target.closest('[data-go]');
      if (b) c.go(b);
    });
  }
};
