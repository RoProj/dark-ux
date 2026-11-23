import gsap from 'gsap';

// Brand: Seaside Hotel, a made-up hotel booking page.

const VIEWS = [14, 12, 15, 13];
// A score with one gold star next to it.
const RATE = function (n) { return '<span class="rt"><i>★</i>' + n + '</span>'; };
const MSGS = ['Mia from Leeds booked this 4 minutes ago', 'Tom from Bristol booked this 9 minutes ago'];

export default {
  brand: '#6d28d9',

  html(mode) {
    const unfair = mode === 'unfair';
    const proof = unfair
      ? '<p class="live"><b class="js-views">14</b> people are looking at this right now</p>'
      : '<p class="live">Rated 4.6 from 318 verified reviews. <button class="nl js-reviews" type="button" data-go="s2">Read reviews</button></p>';
    return '<div class="scr on" data-s="s1"><div class="card wide">' +
        '<h2 class="c-title">Seaside Hotel</h2>' +
        '<p class="c-sub">Sea view double, breakfast included.</p>' +
        '<p class="price" style="margin:10px 0 0"><b>£89</b> a night</p>' + proof +
        '<button class="b-big js-book" type="button" data-go="s3">Book now</button>' +
      '</div>' +
      (unfair ? '<div class="sp js-sp" style="opacity:0;visibility:hidden"></div>' : '') +
      '</div>' +
      '<div class="scr" data-s="s2"><div class="card wide">' +
        '<div class="head"><button class="back" type="button" data-go="s1" aria-label="Back"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><h2 class="c-title" style="margin:0">Reviews</h2></div>' +
        '<div class="line"><span>“Quiet room and a very good breakfast!”</span>' + RATE('4.6') + '</div>' +
        '<div class="line"><span>“Lovely view, though the stairs are steep.”</span>' + RATE('3.9') + '</div>' +
        '<div class="line"><span>“Clean and friendly. Would stay again 😊”</span>' + RATE('4.3') + '</div>' +
        '<p class="note">Verified stays only.</p></div></div>' +
      '<div class="scr" data-s="s3"><div class="card"><h2 class="c-title">Booking confirmed</h2>' +
        '<p class="c-sub">A confirmation is on its way.</p></div></div>';
  },

  build(c, mode) {
    if (mode === 'unfair') {
      const views = c.q('.js-views'), sp = c.q('.js-sp'), book = c.q('.js-book');
      c.wait(0.6);
      const t0 = c.tl.duration();

      // The shopper watches the page, then books.
      c.wait(5.4);
      c.move(book, 0.8, 0.55);
      c.wait(0.3);
      c.click(book, function () { c.go(book); });
      c.wait(2.4);

      // Meanwhile the numbers move and strangers "book".
      VIEWS.forEach(function (v, i) {
        c.tl.call(function () { views.textContent = v; }, null, t0 + i * 1.8);
      });
      [[1, 0], [4.2, 1]].forEach(function (p) {
        c.tl.call(function () { sp.textContent = MSGS[p[1]]; }, null, t0 + p[0]);
        c.tl.fromTo(sp, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, immediateRender: false }, t0 + p[0]);
        c.tl.to(sp, { autoAlpha: 0, duration: 0.3 }, t0 + p[0] + 2.4);
      });
    } else {
      const rev = c.q('.js-reviews');
      c.wait(1.2);
      c.move(rev, 0.5, 0.5, 0.9);
      c.wait(0.3);
      c.click(rev, function () { c.go(rev); });
      // Move the cursor off to the side so it is not covering the reviews.
      c.wait(0.4);
      c.move(c.q('[data-s="s2"] .card'), 1.1, 0.5, 0.7);
      c.wait(2.6);
    }
  },

  interactive(c, mode) {
    c.root.addEventListener('click', function (e) {
      const b = e.target.closest('[data-go]');
      if (b) c.go(b);
    });
    if (mode !== 'unfair') return;
    const views = c.q('.js-views'), sp = c.q('.js-sp');
    const tl = gsap.timeline({ repeat: -1 });
    VIEWS.forEach(function (v, i) { tl.call(function () { views.textContent = v; }, null, i * 1.8); });
    [[1, 0], [4.2, 1]].forEach(function (p) {
      tl.call(function () { sp.textContent = MSGS[p[1]]; }, null, p[0]);
      tl.fromTo(sp, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, p[0]);
      tl.to(sp, { autoAlpha: 0, duration: 0.3 }, p[0] + 2.4);
    });
    tl.to({}, { duration: 0.1 }, 7.2);
    c.dispose.push(function () { tl.kill(); });
  }
};
