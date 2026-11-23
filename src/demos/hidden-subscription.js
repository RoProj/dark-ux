import gsap from 'gsap';

// Brand: Food Delivery, a made-up food delivery app. The Plus offer is the trap.

const money = function (n) { return '£' + n.toFixed(2); };
const FOOD = 16.75, SERVICE = 1.99, DELIVERY = 2.49;
const NO_PLUS = FOOD + SERVICE + DELIVERY;   // 18.88
const PLUS = FOOD + SERVICE;                 // 16.39, delivery is free

// Fair version only: the sheet that slides up when Plus is picked and says what it really is.
const SHEET =
  '<div class="sheet-scrim js-scrim" style="opacity:0;visibility:hidden"></div>' +
  '<div class="sheet js-sheet" style="visibility:hidden">' +
    '<div class="sheet-top"><b>Plus Membership</b><button class="sheet-x js-no" type="button" aria-label="Close">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div>' +
    '<div class="sheet-body">' +
      '<p class="sheet-lead">Your first 30 days are free, then £5.99 a month.</p>' +
      '<ul class="sheet-list"><li>Free delivery on orders over £15</li><li>Renews every month until you cancel</li></ul>' +
      '<div class="sheet-card"><span>Card ending 4242</span><u>Change</u></div>' +
      '<button class="b-big js-start" type="button">Start free 30-day trial</button>' +
      '<p class="sheet-fine">You pay nothing today. We take the first £5.99 on 22 Dec and email you on 19 Dec. Cancel any time in Settings.</p>' +
    '</div>' +
  '</div>';

export default {
  brand: '#1d4ed8',

  html(mode) {
    const unfair = mode === 'unfair';
    return '<div class="scr on" data-s="s1"><div class="card wide compact">' +
        '<h2 class="c-title">Checkout</h2>' +
        '<div class="line"><span>2 × Egg fried rice</span><span>' + money(FOOD) + '</span></div>' +
        '<div class="line"><span>Service fee</span><span>' + money(SERVICE) + '</span></div>' +
        '<div class="line"><span>Delivery fee</span><span class="js-del">' + money(DELIVERY) + '</span></div>' +
        '<label class="rad js-base"><input type="radio" name="plus" checked><span>without Plus</span><em>' + money(NO_PLUS) + '</em></label>' +
        '<label class="rad js-plus"><input type="radio" name="plus"><span><b class="plus">with Plus</b><small>Get 30 days free and save ' + money(DELIVERY) + '</small>' + (unfair ? '' : '<span class="note" style="display:block;margin:4px 0 0">Then £5.99/month. Cancel any time.</span>') + '</span><em>' + money(PLUS) + '</em></label>' +
        '<button class="b-big js-pay" type="button" data-go="s2">Pay now <span class="js-amt">' + money(NO_PLUS) + '</span></button>' +
      '</div></div>' +
      '<div class="scr" data-s="s2"><div class="card"><h2 class="c-title">Order on its way</h2>' +
        '<p class="c-sub js-done">' + (unfair ? 'Plus is on. Free delivery for 30 days.' : 'Plus is free until 21 Dec. The first £5.99 is taken on 22 Dec, and we email you on 19 Dec.') + '</p></div></div>' +
      (unfair
        ? '<div class="scr" data-s="s3"><div class="card">' +
            '<div class="stepbar cx"><span>30 days later</span><b>Your bank</b></div>' +
            '<div class="line total"><span>Plus Membership</span><span>-£5.99</span></div>' +
            '<p class="note">Monthly subscription. Card ending 4242.</p></div></div>'
        : SHEET);
  },

  build(c, mode) {
    const unfair = mode === 'unfair';
    const plus = c.q('.js-plus'), pay = c.q('.js-pay');
    const apply = function () {
      c.q('.js-plus input').checked = true;
      c.q('.js-del').textContent = 'Free';
      c.q('.js-amt').textContent = money(PLUS);
    };
    c.wait(1.2);
    // Aim for the middle of the radio circle itself.
    const radio = c.q('.js-plus input');
    c.move(radio, 0.5, 0.5);
    c.wait(0.3);

    if (unfair) {
      c.click(radio, apply);
      c.wait(1);
    } else {
      // Picking Plus opens a sheet that spells out what it is. Starting the trial applies it.
      const sheet = c.q('.js-sheet'), scrim = c.q('.js-scrim'), start = c.q('.js-start');
      c.click(radio, function () {
        c.q('.js-plus input').checked = true;
        c.add(scrim, { autoAlpha: 1, duration: 0.3 }, { autoAlpha: 0 });
        c.add(sheet, { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: 'power3.out' }, { yPercent: 100, autoAlpha: 1 });
      });
      c.wait(1.3);   // time to read it
      c.move(start, 0.8, 0.5, 0.8);
      c.wait(0.25);
      c.click(start, function () {
        apply();
        c.add(scrim, { autoAlpha: 0, duration: 0.3 });
        c.add(sheet, { yPercent: 100, duration: 0.35, ease: 'power2.in' });
      });
      c.wait(0.9);
    }

    c.move(pay, 0.8, 0.55);
    c.wait(0.3);
    c.click(pay, function () { c.go(pay); });
    if (unfair) {
      c.wait(1.7);
      c.call(function () { c.screen('s3'); });   // the charge lands
      c.wait(2.8);
    } else {
      c.wait(3.6);
    }
  },

  interactive(c, mode) {
    let pending = null;
    const unfair = mode === 'unfair';
    const del = c.q('.js-del'), amt = c.q('.js-amt');
    const plusInput = c.q('.js-plus input'), baseInput = c.q('.js-base input');
    const sheet = c.q('.js-sheet'), scrim = c.q('.js-scrim');
    const set = function (on) {
      del.textContent = on ? 'Free' : money(DELIVERY);
      amt.textContent = money(on ? PLUS : NO_PLUS);
    };
    const open = function () {
      gsap.to(scrim, { autoAlpha: 1, duration: 0.3 });
      gsap.fromTo(sheet, { yPercent: 100, autoAlpha: 1 }, { yPercent: 0, duration: 0.45, ease: 'power3.out' });
    };
    const close = function () {
      gsap.to(scrim, { autoAlpha: 0, duration: 0.3 });
      gsap.to(sheet, { yPercent: 100, duration: 0.35, ease: 'power2.in' });
    };
    c.root.addEventListener('change', function (e) {
      if (e.target.name !== 'plus') return;
      if (unfair) { set(plusInput.checked); return; }
      if (plusInput.checked) open(); else set(false);
    });
    c.root.addEventListener('click', function (e) {
      if (!unfair) {
        if (e.target.closest('.js-start')) { set(true); close(); return; }
        if (e.target.closest('.js-no')) { baseInput.checked = true; set(false); close(); return; }
      }
      const b = e.target.closest('[data-go]');
      if (!b) return;
      const withPlus = plusInput.checked && (unfair || del.textContent === 'Free');
      if (!withPlus) c.q('.js-done').textContent = 'Enjoy your food.';
      c.go(b);
      if (unfair && withPlus) {
        pending = gsap.delayedCall(1.8, function () { c.screen('s3'); });
      }
    });
    c.dispose.push(function () { if (pending) pending.kill(); gsap.killTweensOf([sheet, scrim]); });
  }
};
