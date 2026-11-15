import gsap from 'gsap';

// The headline's last words: "fall for" and "see through". The page opens on "fall for", and after a
// beat that rolls up and out of a hard-edged mask while "see through" rises in from below, then it
// goes round once more (fall for, see through, fall for, see through) and rests. The whole
// second line is a button: click it and "see through" drops back down and out while "fall for"
// comes in from above, and so on. With reduced motion the headline simply opens on "see through"
// and each click swaps the words with no movement. Without the script it is plain text that says
// "see through".

const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const DUR = 0.6;
const EASE = 'power3.inOut';
const TRAVEL = 130;   // percent of the mask height: far enough that a word is fully out of sight

// Hides the line until the script has set it up, so the final text never flashes first.
export function holdHero() {
  document.documentElement.classList.add('hero-wait');
}

export function initHero() {
  const release = function () { document.documentElement.classList.remove('hero-wait'); };
  const flip = document.getElementById('hero-flip');
  const swap = flip && flip.querySelector('.swap');
  const A = swap && swap.querySelector('.sw-a');   // fall for
  const B = swap && swap.querySelector('.sw-b');   // see through
  if (!flip || !swap || !A || !B) { release(); return; }

  let wA = 0, wB = 0;
  let state = RM ? 'B' : 'A';
  let busy = false;
  let auto = null;

  const label = function () {
    flip.setAttribute('aria-label', state === 'B'
      ? 'can see through. Press to switch to “fall for”.'
      : 'can fall for. Press to switch to “see through”.');
  };

  const measure = function () {
    wA = A.scrollWidth;
    wB = B.scrollWidth;
  };
  const rest = function () {
    gsap.set(swap, { width: state === 'B' ? wB : wA });
    gsap.set(A, { yPercent: state === 'A' ? 0 : -TRAVEL });
    gsap.set(B, { yPercent: state === 'B' ? 0 : TRAVEL });
  };

  // Going to "see through" always moves up (it rises from below); going back to "fall for" always
  // moves down (it drops in from above).
  const go = function (target) {
    if (target === state) return;
    const toB = target === 'B';
    const inn = toB ? B : A, out = toB ? A : B;
    state = target;
    label();
    if (RM) { rest(); return; }
    busy = true;
    gsap.fromTo(inn, { yPercent: toB ? TRAVEL : -TRAVEL }, { yPercent: 0, duration: DUR, ease: EASE });
    gsap.fromTo(out, { yPercent: 0 }, { yPercent: toB ? -TRAVEL : TRAVEL, duration: DUR, ease: EASE });
    gsap.to(swap, { width: toB ? wB : wA, duration: DUR, ease: EASE, onComplete: function () { busy = false; } });
  };

  const toggle = function () {
    if (busy) return;
    if (auto) { auto.kill(); auto = null; }   // someone got there first
    go(state === 'A' ? 'B' : 'A');
  };
  flip.addEventListener('click', toggle);
  flip.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });

  const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  const failsafe = setTimeout(release, 2000);
  ready.then(function () {
    clearTimeout(failsafe);
    swap.classList.add('anim');
    measure();
    label();
    rest();
    release();
    let w = flip.offsetWidth;
    window.addEventListener('resize', function () {
      if (Math.abs(flip.offsetWidth - w) < 2 || busy) return;
      measure();
      rest();
      w = flip.offsetWidth;
    });
    if (RM) return;
    // The opening, once, after the headline has been on screen for a moment: two full cycles,
    // fall for -> see through -> fall for -> see through, and it rests on "see through". A click at
    // any point takes over and cancels the rest.
    const io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      auto = gsap.timeline({ delay: 1.0, onComplete: function () { auto = null; } });
      auto.call(function () { go('B'); });                 // fall for -> see through
      auto.call(function () { go('A'); }, null, DUR + 0.8); // see through -> fall for
      auto.call(function () { go('B'); }, null, 2 * (DUR + 0.8)); // fall for -> see through, and it stays
    }, { threshold: 0.6 });
    io.observe(flip);
  });
}
