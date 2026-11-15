import '@fontsource-variable/inter';
import gsap from 'gsap';
import './style.css';
import { entries } from './entries.js';
import { mountDemo } from './engine.js';
import { initHero, holdHero } from './hero.js';

holdHero();

// Entries were renamed to the names used in the papers. Old addresses still land on the right entry.
const OLD_IDS = {
  'hard-to-compare-prices': 'intermediate-currency',
  'misleading-buttons': 'bait-and-switch',
  'trick-wording': 'trick-questions',
  'fake-urgency': 'countdown-timer',
  'forced-registration': 'forced-enrollment',
  'forced-data-sharing': 'privacy-zuckering',
  'pay-to-skip': 'gamification',
  'fake-scarcity': 'low-stock-message',
  'fake-social-proof': 'activity-notifications'
};
let landedOn = null;   // set when an old address was redirected, so the page can scroll to the entry once it exists
(function () {
  const old = location.hash.slice(1);
  if (OLD_IDS[old]) {
    landedOn = OLD_IDS[old];
    history.replaceState(null, '', location.pathname + location.search + '#' + landedOn);
  }
})();

// Sidebar groups in the order they first appear in the entries.
const groups = [];
entries.forEach(function (e) { if (groups.indexOf(e.group) < 0) groups.push(e.group); });

const navHtml = groups.map(function (g) {
  const items = entries.filter(function (e) { return e.group === g; }).map(function (e) {
    return '<li><a href="#' + e.id + '" data-id="' + e.id + '">' + e.title + '</a></li>';
  }).join('');
  return '<li class="group" role="presentation">' + g + '</li>' + items;
}).join('');

// Phone menu only: a way back to the top. On desktop the title in the sidebar already does this.
const topItem = '<li class="top-item"><a href="#top" data-top>Deceptive UX Index (top)</a></li>';

const entryHtml = entries.map(function (e) {
  const facts = e.facts.map(function (f) {
    return '<div class="row"><dt>' + f[0] + '</dt><dd>' + f[1] + '</dd></div>';
  }).join('');
  return '<article class="entry" id="' + e.id + '">' +
    '<h2 class="title">' + e.title + '</h2>' +
    '<p class="lead">' + e.lead + '</p>' +
    '<p class="text">' + e.text + '</p>' +
    '<div class="demo" data-demo="' + e.id + '"></div>' +
    '<h3>Why it works</h3>' +
    '<dl class="facts">' + facts + '</dl>' +
    '<p class="src">' + e.sources + '</p>' +
  '</article>';
}).join('');

// Light / dark switch. One in the sidebar footer, one in the phone top bar; both stay in sync.
const THEME_TOGGLE =
  '<button class="theme-toggle" type="button" role="switch" aria-checked="false" aria-label="Dark mode">' +
    '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg>' +
    '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M20 14.5A8 8 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"/></svg>' +
    '<span class="thumb"></span>' +
  '</button>';

// About: the first paragraph shows and fades out; the rest sits behind "Read more".
const ABOUT =
  '<section class="about" id="about">' +
    '<div class="about-clip" id="about-clip">' +
      '<p>Dark patterns are interface tricks that steer you into things you didn’t mean to do: a subscription you can’t cancel, a fee that turns up on the last page, a button that makes you feel bad for saying no. This site rebuilds each one as a small working screen, so you can watch it happen instead of reading about it. They’re also called deceptive patterns or <a href="https://www.deceptive.design/" target="_blank" rel="noopener">deceptive design</a>.</p>' +
      '<div class="about-rest" inert>' +
        '<p>The patterns come from two research papers: <a href="https://doi.org/10.1145/3173574.3174108" target="_blank" rel="noopener">Gray et al., The Dark (Patterns) Side of UX Design</a> (CHI 2018) and <a href="https://doi.org/10.1145/3359183" target="_blank" rel="noopener">Mathur et al., Dark Patterns at Scale</a> (CSCW 2019). The five main groups are Gray\u2019s. A few patterns only Mathur\u2019s study of shopping sites covers sit under Misc. Several of the names are Harry Brignull\u2019s, who coined the term in 2010 and keeps a collection at <a href="https://www.deceptive.design/" target="_blank" rel="noopener">deceptive.design</a>. The rest are the papers\u2019 own. I checked every \u201cWhy it works\u201d line against the papers it cites. The demos, the wording and the shops are my own.</p>' +
        '<p>Every entry has two versions of the same screen: Unfair is the dark pattern and Fair is how it should have been done. A fake cursor plays each one through on its own once you scroll to it, and pauses when you scroll away. You can pause or replay it, switch between Unfair and Fair, or take over by clicking or tapping a control inside it. It all runs in your browser and nothing you type or click goes anywhere.</p>' +
        '<p>I made it because they’re everywhere and most people don’t notice them. <a href="https://doi.org/10.1145/3313831.3376600" target="_blank" rel="noopener">A CHI 2020 study</a> (Di Geronimo et al.) went through 240 popular free Android apps. 95% had at least one dark pattern, and the average app had 7.4. In the same study, 589 people watched short clips of apps. For the apps with dark patterns, 55% of answers said nothing was wrong and 20% were unsure. People did better once they knew what to look for. So each pattern here comes with a fair version of the same screen to compare it against. There are ' + entries.length + ' patterns so far, with more on the way.</p>' +
      '</div>' +
    '</div>' +
    '<button class="more-link" id="about-toggle" type="button" aria-expanded="false" aria-controls="about-clip">Read more</button>' +
  '</section>';

document.getElementById('app').innerHTML =
  '<div class="shell">' +
    '<aside class="side" id="side">' +
      '<a class="brand" href="#top">Deceptive UX Index</a>' +
      '<p class="brand-sub">Interactive animations of UX traps</p>' +
      '<div class="m-top">' +
        '<button class="m-bar" id="mbar" type="button" aria-expanded="false" aria-controls="nav"><span id="mcur">Menu</span></button>' +
        THEME_TOGGLE +
        '<button class="m-menu" id="mmenu" type="button" aria-expanded="false" aria-controls="nav">Menu</button>' +
      '</div>' +
      '<nav class="nav" id="nav" aria-label="Patterns"><div class="nav-inner"><ul>' + topItem + navHtml + '</ul></div></nav>' +
      '<div class="side-foot">' + THEME_TOGGLE + '</div>' +
    '</aside>' +
    '<main class="main"><div class="col">' +
      '<header class="intro" id="top">' +
        '<h1>Dark patterns you<br><span id="hero-flip" class="flip" role="button" tabindex="0" aria-label="can see through. Press to switch to “fall for”.">can <span class="swap"><span class="sw sw-a">fall for</span><span class="sw sw-b">see through</span></span>.</span></h1>' +
        '<p class="lead">Each one is a small working screen. It plays on its own, or you can click in and try it.</p>' +
        '<p class="text">Unfair is the dark pattern. Fair is the same screen done properly.</p>' +
        ABOUT +
      '</header>' +
      entryHtml +
      '<footer class="foot"><div>&copy; 2026 Rohan Projects <span class="sep" aria-hidden="true">|</span> <a class="ig" href="https://www.instagram.com/ro1projects/" target="_blank" rel="noopener noreferrer" aria-label="Rohan Projects on Instagram"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg></a></div><div class="rights">All rights reserved. Work in progress.</div></footer>' +
    '</div></main>' +
  '</div>' +
  '<button class="to-top" id="to-top" type="button" aria-label="Back to top" tabindex="-1">' +
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>' +
  '</button>';

entries.forEach(function (e) {
  mountDemo(document.querySelector('[data-demo="' + e.id + '"]'), e.demo);
});

initHero();

// An old address lands on the right entry. The browser looked for the old id before the page was built, so it
// could not scroll there itself.
if (landedOn) {
  const target = document.getElementById(landedOn);
  if (target) window.requestAnimationFrame(function () { target.scrollIntoView({ behavior: 'instant', block: 'start' }); });
}

// ---------- Scrollspy ----------
const side = document.getElementById('side');
const nav = document.getElementById('nav');
const mbar = document.getElementById('mbar');
const mcur = document.getElementById('mcur');
const links = Array.prototype.slice.call(nav.querySelectorAll('a[data-id]'));
let current = null;
let spied = false;

const wide = window.matchMedia('(min-width: 901px)');
let activeLink = null;

// The phone top bar names the site until an entry actually reaches the bar,
// then names whichever entry is under it.
let barId = null;
function syncBar() {
  const a = barId && links.filter(function (l) { return l.dataset.id === barId; })[0];
  mcur.textContent = a ? a.textContent : 'Deceptive UX Index';
}
// Works from positions, not intersection events, so it stays right when the layout shifts
// under it (for example when the About section opens or closes).
function updateBar() {
  const line = window.innerHeight * 0.12;         // just under the sticky bar
  let id = null;
  for (let i = 0; i < entries.length; i++) {
    if (document.getElementById(entries[i].id).getBoundingClientRect().top <= line) id = entries[i].id;
    else break;
  }
  if (id !== barId) { barId = id; syncBar(); }
}
window.addEventListener('scroll', updateBar, { passive: true });
window.addEventListener('resize', updateBar);
if (window.ResizeObserver) new ResizeObserver(updateBar).observe(document.querySelector('.main'));
updateBar();
syncBar();

// The blue dot is drawn by CSS on whichever link is current, so it is part of the link and
// moves with it, however hard the list is scrolled. At the very top it sits beside the title.
const brandEl = document.querySelector('.brand');
current = '__init__';

// Keep the active entry in view if the list is longer than the window.
function keepInView(a) {
  const top = a.offsetTop, h = a.offsetHeight;
  if (top < nav.scrollTop + 40) nav.scrollTo({ top: Math.max(top - 40, 0), behavior: 'smooth' });
  else if (top + h > nav.scrollTop + nav.clientHeight - 40) nav.scrollTo({ top: top + h - nav.clientHeight + 40, behavior: 'smooth' });
}

function setActive(id) {
  if (id === current) return;
  current = id;
  let active = null;
  links.forEach(function (a) {
    const on = !!id && a.dataset.id === id;
    if (on) { a.setAttribute('aria-current', 'true'); active = a; }
    else a.removeAttribute('aria-current');
  });
  activeLink = active;
  if (id) brandEl.removeAttribute('aria-current'); else brandEl.setAttribute('aria-current', 'true');
  const topLink = nav.querySelector('[data-top]');
  if (topLink) { if (id) topLink.removeAttribute('aria-current'); else topLink.setAttribute('aria-current', 'true'); }
  if (active) keepInView(active);
  else nav.scrollTo({ top: 0, behavior: 'smooth' });
  if (spied) {
    if (id && location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
    else if (!id && location.hash) history.replaceState(null, '', location.pathname + location.search);
  }
}

// Works from positions, so it stays right when the layout shifts (for example when About opens).
function updateSide() {
  const line = window.innerHeight * 0.35;
  let id = null;
  for (let i = 0; i < entries.length; i++) {
    if (document.getElementById(entries[i].id).getBoundingClientRect().top <= line) id = entries[i].id;
    else break;
  }
  setActive(id);
}
window.addEventListener('scroll', updateSide, { passive: true });
window.addEventListener('resize', updateSide);
if (window.ResizeObserver) new ResizeObserver(updateSide).observe(document.querySelector('.main'));

// Mark the first interaction so we do not rewrite the URL on page load.
window.addEventListener('scroll', function () { spied = true; }, { once: true, passive: true });

updateSide();


// ---------- Light / dark ----------
const root = document.documentElement;
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
const toggles = Array.prototype.slice.call(document.querySelectorAll('.theme-toggle'));

function isDark() {
  return root.dataset.theme ? root.dataset.theme === 'dark' : systemDark.matches;
}
function syncToggles() {
  toggles.forEach(function (b) { b.setAttribute('aria-checked', isDark() ? 'true' : 'false'); });
}
function setTheme(t) {
  root.classList.add('theming');
  root.dataset.theme = t;
  try { localStorage.setItem('theme', t); } catch (e) { /* private mode: the choice just will not stick */ }
  syncToggles();
  window.setTimeout(function () { root.classList.remove('theming'); }, 450);
}
toggles.forEach(function (b) {
  b.addEventListener('click', function () { setTheme(isDark() ? 'light' : 'dark'); });
});
systemDark.addEventListener('change', syncToggles);   // follows the system until a choice is made
syncToggles();

// ---------- About: read more / read less ----------
(function () {
  const about = document.getElementById('about');
  const clip = document.getElementById('about-clip');
  const rest = clip.querySelector('.about-rest');
  const btn = document.getElementById('about-toggle');
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FADE = '56px';          // how tall the fade is while it is closed
  let busy = false;

  function expand() {
    busy = true;
    rest.inert = false;
    btn.setAttribute('aria-expanded', 'true');
    btn.textContent = 'Read less';
    const from = clip.offsetHeight;
    clip.style.height = from + 'px';
    // The text opens downward, the fade melts away, and everything below is pushed down with it.
    gsap.to(clip, {
      height: clip.scrollHeight, '--f': '0px', duration: still ? 0 : 0.6, ease: 'power2.out',
      onComplete: function () {
        about.classList.add('open');
        clip.style.height = '';
        clip.style.removeProperty('--f');
        busy = false;
      }
    });
  }

  function collapse() {
    busy = true;
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = 'Read more';
    // Measure the open height, then the closed height, and animate between them.
    const full = clip.offsetHeight;
    about.classList.remove('open');
    clip.style.height = '';
    const closed = clip.offsetHeight;
    clip.style.height = full + 'px';
    gsap.set(clip, { '--f': '0px' });
    // If the top of the section has scrolled away, bring it back so you are not left mid-page. The scroll and
    // the shrinking run in one timeline, so they move together. A separate smooth scroll fought the changing
    // page height and came out jagged, and the browser's own scroll anchoring made it worse, so that is off here.
    const bar = window.matchMedia('(max-width:900px)').matches ? document.querySelector('.side').getBoundingClientRect().bottom : 0;
    const offset = bar + 16;
    const top = about.getBoundingClientRect().top;
    const tl = gsap.timeline({
      defaults: { duration: still ? 0 : 0.5, ease: 'power2.inOut' },
      onComplete: function () {
        clip.style.height = '';
        clip.style.removeProperty('--f');
        document.documentElement.style.overflowAnchor = '';
        rest.inert = true;
        busy = false;
      }
    });
    tl.to(clip, { height: closed, '--f': FADE }, 0);
    if (top < offset) {
      const pos = { y: window.scrollY };
      const to = Math.max(0, window.scrollY + top - offset);
      document.documentElement.style.overflowAnchor = 'none';
      tl.to(pos, { y: to, onUpdate: function () { window.scrollTo({ top: pos.y, left: 0, behavior: 'instant' }); } }, 0);
    }
  }

  btn.addEventListener('click', function () {
    if (busy) return;
    if (about.classList.contains('open')) collapse(); else expand();
  });
})();

// ---------- Back to top ----------
(function () {
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const btn = document.getElementById('to-top');
  function goTop(e) {
    if (e) e.preventDefault();
    window.scrollTo({ top: 0, behavior: still ? 'auto' : 'smooth' });
  }
  // The sidebar title and the phone menu's "(top)" item both go to the very top.
  document.querySelectorAll('[data-top], .brand').forEach(function (a) { a.addEventListener('click', goTop); });
  btn.addEventListener('click', goTop);

  // The circle fades in while you scroll up, and fades out when you scroll down or reach the top.
  let last = window.scrollY, shown = false;
  function show(on) {
    if (on === shown) return;
    shown = on;
    btn.classList.toggle('show', on);
    btn.tabIndex = on ? 0 : -1;
  }
  window.addEventListener('scroll', function () {
    const y = window.scrollY, dy = y - last;
    if (y < 240) show(false);
    else if (dy < -6) show(true);
    else if (dy > 6) show(false);
    if (Math.abs(dy) > 6) last = y;
  }, { passive: true });
})();

// ---------- Mobile menu ----------
// Both the title and the "Menu" word open the list.
const menuButtons = [mbar, document.getElementById('mmenu')];
function setMenu(open) {
  side.classList.toggle('open', open);
  root.classList.toggle('menu-open', open);     // freezes the page behind the open menu
  menuButtons.forEach(function (b) { b.setAttribute('aria-expanded', open ? 'true' : 'false'); });
}
menuButtons.forEach(function (b) {
  b.addEventListener('click', function () { setMenu(!side.classList.contains('open')); });
});
nav.addEventListener('click', function (e) {
  if (e.target.closest('a')) setMenu(false);
});
// If the window grows past phone width while the menu is open, let go of the page again.
wide.addEventListener('change', function () { if (wide.matches) setMenu(false); });

// ---------- Light taps on iPhone ----------
// iPhone Safari sometimes treats a quick, light tap as a hover and drops the click, most often while something on
// the page is animating. The touch events always arrive, so a tap on a button is handled from touchend: the click is
// made here, once, and the browser's own click is cancelled so it can never fire a second time. A touch that moved
// more than a few pixels is a scroll or swipe, and a second finger makes it a pinch; both are left alone.
(function () {
  const SLOP = 10;
  let start = null;
  const active = { capture: true, passive: true };
  document.addEventListener('touchstart', function (e) {
    start = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY, el: e.target } : null;
  }, active);
  document.addEventListener('touchmove', function (e) {
    if (start && Math.hypot(e.touches[0].clientX - start.x, e.touches[0].clientY - start.y) > SLOP) start = null;
  }, active);
  document.addEventListener('touchend', function (e) {
    const s = start;
    start = null;
    if (!s || e.touches.length || e.changedTouches.length !== 1) return;
    const t = e.changedTouches[0];
    if (Math.hypot(t.clientX - s.x, t.clientY - s.y) > SLOP) return;
    const ctl = s.el.closest && s.el.closest('button, label, [role="button"]');
    if (!ctl || ctl.disabled || !ctl.isConnected) return;
    const under = document.elementFromPoint(t.clientX, t.clientY);
    if (!under || !ctl.contains(under)) return;      // the finger ended somewhere else
    e.preventDefault();                               // no second, browser-made click
    ctl.click();
  }, { capture: true, passive: false });
})();
