import nagging from './demos/nagging.js';
import roach from './demos/roach-motel.js';
import hidden from './demos/hidden-costs.js';
import sneak from './demos/sneak-basket.js';
import subscription from './demos/hidden-subscription.js';
import confirm from './demos/confirmshaming.js';
import trick from './demos/trick-questions.js';
import pre from './demos/preselection.js';
import visual from './demos/visual-interference.js';
import urgency from './demos/fake-urgency.js';
import scarcity from './demos/fake-scarcity.js';
import social from './demos/fake-social-proof.js';
import forced from './demos/forced-registration.js';
import compare from './demos/hard-to-compare-prices.js';
import baitSwitch from './demos/bait-and-switch.js';
import pressured from './demos/pressured-selling.js';
import dataShare from './demos/forced-data-sharing.js';
import payToSkip from './demos/pay-to-skip.js';

// Every title is a pattern name used by Gray et al. or Mathur et al.; the "Why it works" rows were
// checked line by line against both papers (audited on 2026-11-13). Where a paper names no bias, the row says so.
// Where a paper names no bias for a pattern, the row says so instead of inventing one.
// Sources are named, not linked.
const SRC_GRAY = 'Gray et al., The Dark (Patterns) Side of UX Design, CHI 2018.';
const SRC_MATHUR = 'Mathur et al., Dark Patterns at Scale, CSCW 2019.';
const SRC_BRIGNULL = 'Pattern names from Harry Brignull, as cited in both papers.';

// Grouped exactly as Gray et al. sort them. Anything Gray does not cover goes under Misc.
// The sidebar follows this order.
export const entries = [
  {
    id: 'nagging',
    group: 'Nagging',
    title: 'Nagging',
    lead: 'You said no. It asks again.',
    text: 'Say no and it comes back with a nudge or a guilt trip. Gray’s example is Instagram’s notifications prompt, which only offers Not Now and OK. The fair version asks once and takes your answer.',
    demo: nagging,
    facts: [
      ['Bias used', 'The paper doesn’t name one.'],
      ['How it acts', 'A repeated interruption of what you were doing. Gray calls it a minor redirection of expected functionality.']
    ],
    sources: SRC_GRAY
  },
  {
    id: 'roach-motel',
    group: 'Obstruction',
    title: 'Roach motel',
    lead: 'Cancelling takes a lot more clicks than signing up did.',
    text: 'Joining takes two taps. Here, all the friction is on the way out: six screens of account and billing menus, an offer to stay, a required survey, a warning and finally a phone number. The fair version has a cancel button you can see and one confirmation.',
    demo: roach,
    facts: [
      ['Bias used', 'The research names none.'],
      ['How it acts', 'Restrictive: it limits how you can cancel. Information hiding: how hard it is to leave often isn’t mentioned up front.'],
      ['Also called', 'Hard to cancel.']
    ],
    sources: SRC_GRAY + ' ' + SRC_MATHUR + ' ' + SRC_BRIGNULL
  },
  {
    id: 'intermediate-currency',
    group: 'Obstruction',
    title: 'Intermediate currency',
    lead: 'What does 180 gems actually cost?',
    text: 'Everything in the app is priced in a virtual currency, which is bought with real money through in-app purchases. That breaks the link between price and pounds, so people spend differently. Here, a speed boost costs 180 gems, and gems only come in packs of 60, 250 and 700. The fair version prices it in pounds.',
    demo: compare,
    facts: [
      ['Bias used', 'None named in the paper. Gray says the aim is to cut the link between a price and real money, so people spend differently.'],
      ['How it acts', 'Obstruction: working out the real price is made harder than it needs to be.']
    ],
    sources: SRC_GRAY
  },
  {
    id: 'hidden-costs',
    group: 'Sneaking',
    title: 'Hidden costs',
    lead: 'The first price you see isn’t what you end up paying.',
    text: 'Fees show up late in checkout, after you’ve decided to buy. Here, a £24.00 meal ends up at £37.00, which is 54% more, with fees added on pages two and three. The fair version puts every fee in the total from the start.',
    demo: hidden,
    facts: [
      ['Bias used', 'Sunk cost fallacy. By the last step you’ve put in so much effort that you pay rather than waste it.'],
      ['How it acts', 'Deceptive and information hiding: the full price is held back until the end. It isn’t covert, you can see the charge when it appears.']
    ],
    sources: SRC_GRAY + ' ' + SRC_MATHUR + ' ' + SRC_BRIGNULL
  },
  {
    id: 'sneak-into-basket',
    group: 'Sneaking',
    title: 'Sneak into basket',
    lead: 'There’s something in your order you didn’t pick.',
    text: 'Something extra lands in your order, usually on the last page. Mathur found a flower shop adding a greeting card, a laptop shop adding insurance, and another site adding a charger with a pre-ticked checkbox. Here, £60.00 of theatre tickets becomes £72.49 once ticket protection and a priority queue pass appear. The fair version offers both as unticked boxes.',
    demo: sneak,
    facts: [
      ['Bias used', 'Default effect. Whatever is already in your basket tends to stay there.'],
      ['How it acts', 'Partly deceptive and information hiding: it disguises how the item got there, sometimes calling it a bonus or a necessity. It isn’t covert, you can see the extra item.']
    ],
    sources: SRC_GRAY + ' ' + SRC_MATHUR + ' ' + SRC_BRIGNULL
  },
  {
    id: 'hidden-subscription',
    group: 'Sneaking',
    title: 'Hidden subscription',
    lead: 'A free trial that turns into a monthly charge.',
    text: 'The checkout shows a cheaper total and a free month, but not what you pay after that. Here, picking Plus saves £2.49 and starts a £5.99 monthly subscription. The fair version shows the monthly price and first payment date before you start, and emails you three days ahead.',
    demo: subscription,
    facts: [
      ['Bias used', 'None named in the research. People usually find out only when they’re charged, days or months later.'],
      ['How it acts', 'Deceptive and information hiding: a recurring fee is presented as a free trial or a one-off, and the real terms are hard to find.'],
      ['Also called', 'Forced continuity.']
    ],
    sources: SRC_GRAY + ' ' + SRC_MATHUR + ' ' + SRC_BRIGNULL
  },
  {
    id: 'bait-and-switch',
    group: 'Sneaking',
    title: 'Bait and switch',
    lead: 'You press Cancel and the subscription stays.',
    text: 'You set out to do one thing and get another. Here, a pop-up asks if you want to cancel your subscription and uses ambiguous button labels: both say Cancel. The red one cancels the cancelling, so you stay subscribed. Gray’s example is a red X that doesn’t close the pop-up. The fair version labels the buttons for what they do.',
    demo: baitSwitch,
    facts: [
      ['Bias used', 'The paper names none.'],
      ['How it acts', 'Sneaking: what the click really does stays hidden until after you’ve made it.']
    ],
    sources: SRC_GRAY + ' ' + SRC_BRIGNULL
  },
  {
    id: 'confirmshaming',
    group: 'Interface interference',
    title: 'Confirmshaming',
    lead: 'Say no to this pop-up and it tells you off for it.',
    text: 'The decline option makes you feel bad for choosing it, using emotionally loaded wording that shames you for saying no. Mathur found lines like “No thanks, I like paying full price”. The fair version has two equal buttons with plain labels.',
    demo: confirm,
    facts: [
      ['Bias used', 'Framing effect, plus shame. The same choice feels different depending on how it’s worded.'],
      ['How it acts', 'Asymmetric: the two options aren’t treated equally.'],
      ['Also called', 'Toying with emotion.']
    ],
    sources: SRC_GRAY + ' ' + SRC_MATHUR + ' The name comes from Harry Brignull.'
  },
  {
    id: 'trick-questions',
    group: 'Interface interference',
    title: 'Trick questions',
    lead: 'You tick the box thinking you’re opting out.',
    text: 'A double negative turns a simple choice into a puzzle. Gray’s example is an opt-out checkbox, often with confusing double negatives, and Mathur counts the ones where the wording misleads, like “Uncheck the box if you prefer not to receive email updates”. Here, ticking the box means yes to partner offers. The fair version asks one plain question with the box unticked.',
    demo: trick,
    facts: [
      ['Bias used', 'Default and framing effects. People fall for a choice they wrongly believe matches what they want.'],
      ['How it acts', 'Asymmetric: opting out is harder than opting in. Covert: the confusing wording hides what your choice does.']
    ],
    sources: SRC_GRAY + ' ' + SRC_MATHUR + ' ' + SRC_BRIGNULL
  },
  {
    id: 'preselection',
    group: 'Interface interference',
    title: 'Preselection',
    lead: 'The extras are already ticked, so doing nothing means yes.',
    text: 'Selections that cost money or share your data come pre-ticked, and people tend to accept what’s selected, or don’t realise it’s there. Here, checkout has three paid extras pre-ticked, so the total jumps from £18.00 to £27.49. The fair version starts with everything unticked.',
    demo: pre,
    facts: [
      ['Bias used', 'Default effect. People are more likely to accept what’s already selected, especially if they trust the product.'],
      ['How it acts', 'The choice is made for you before you touch anything, usually the one that suits the company.']
    ],
    sources: SRC_GRAY
  },
  {
    id: 'visual-interference',
    group: 'Interface interference',
    title: 'Visual interference',
    lead: 'One option is hard to miss and the other is hard to find.',
    text: 'Both options are there, but one is a bright button and the other is tiny pale text. Gray and Mathur both found options greyed out so they look disabled when they can still be clicked. The fair version makes Reject plain, readable text next to Accept.',
    demo: visual,
    facts: [
      ['Bias used', 'Anchoring and framing effect. The most prominent option becomes the one you measure everything against.'],
      ['How it acts', 'Covert: you may not notice how the layout steered you. Sometimes asymmetric, when the options aren’t made equal.'],
      ['Also called', 'Aesthetic manipulation, False hierarchy, Misdirection.']
    ],
    sources: SRC_GRAY + ' ' + SRC_MATHUR + ' ' + SRC_BRIGNULL
  },
  {
    id: 'countdown-timer',
    group: 'Interface interference',
    title: 'Countdown timer',
    lead: 'The countdown says hurry, but it isn’t a real deadline.',
    text: 'A timer is a scarcity cue: it pushes you to buy now. This one is an evergreen timer, so it starts over when it hits zero. In Mathur’s crawl of about 11,000 shopping sites, 157 of 393 countdown timers were deceptive: they reset, or the offer stayed on after they ran out. The fair version shows a real end date and nothing counts down.',
    demo: urgency,
    facts: [
      ['Bias used', 'Scarcity bias. A deadline makes an offer feel more valuable.'],
      ['How it acts', 'Partly covert: it speeds you up without you noticing. Sometimes deceptive, as when the timer resets or the offer carries on after it ends.']
    ],
    sources: SRC_GRAY + ' ' + SRC_MATHUR
  },
  {
    id: 'forced-enrollment',
    group: 'Forced action',
    title: 'Forced enrollment',
    lead: 'You can’t buy anything until you sign up.',
    text: 'An account wall makes you create an account before you can check out, then verify your email. Mathur found sites that wouldn’t even let you browse without one. The fair version offers an account but lets you continue as a guest.',
    demo: forced,
    facts: [
      ['Bias used', 'None named in the research. It’s an all-or-nothing deal: your details or no purchase.'],
      ['How it acts', 'Asymmetric and restrictive: it makes you do extra tasks, like making an account, and the option to just buy is gone.']
    ],
    sources: SRC_GRAY + ' ' + SRC_MATHUR
  },
  {
    id: 'privacy-zuckering',
    group: 'Forced action',
    title: 'Privacy zuckering',
    lead: 'To sign up you have to agree to share your data.',
    text: 'You end up sharing more data than you meant to. Gray’s example is a site that wouldn’t let people unsubscribe until they agreed to let it sell their information. Here, Create account stays greyed out until you tick a box agreeing to share your details with partners. That’s bundled consent: sharing is tied to signing up. In the fair version the same box is optional, and the account is created either way.',
    demo: dataShare,
    facts: [
      ['Bias used', 'No bias is named in the paper. The thing you want is held back until you agree to something else.'],
      ['How it acts', 'Forced action: you have to take a specific step, here agreeing to share your data, before you can use the feature you came for.']
    ],
    sources: SRC_GRAY + ' ' + SRC_MATHUR + ' ' + SRC_BRIGNULL
  },
  {
    id: 'gamification',
    group: 'Forced action',
    title: 'Gamification',
    lead: 'Beat your top score, for just £0.99.',
    text: 'Games reward repeated play with streaks and scores, then sell you a way to keep them when you lose. Gray’s example is Candy Crush levels that are impossible to complete, with extra lives and power-ups on sale. Here, you lose a game on a 7-game streak, and a big green £0.99 button saves it, with a small grey No thanks underneath. The fair version just lets you play again.',
    demo: payToSkip,
    facts: [
      ['Bias used', 'Gray names none.'],
      ['How it acts', 'Forced action: part of the game can only be earned by repeated play, or by paying.']
    ],
    sources: SRC_GRAY
  },
  {
    id: 'low-stock-message',
    group: 'Misc',
    title: 'Low-stock message',
    lead: 'Every size says only 2 left.',
    text: 'A low-stock message makes you feel you have to buy now. Here, every size says the same thing, so it likely isn’t real stock, and Mathur found shops showing low-stock warnings on nearly every product. The fair version shows what’s actually left for each size, including sold out.',
    demo: scarcity,
    facts: [
      ['Bias used', 'Scarcity bias. Things feel more desirable when they might run out.'],
      ['How it acts', 'Partly covert and sometimes deceptive: some shops show the warning on nearly everything, or make the number up.']
    ],
    sources: SRC_MATHUR
  },
  {
    id: 'activity-notifications',
    group: 'Misc',
    title: 'Activity notifications',
    lead: 'Strangers are looking, and booking, right now.',
    text: 'Live viewer counts and pop-ups like “Mia from Leeds booked this 4 minutes ago” make a choice feel popular and urgent. Mathur found shops generating the names and counts at random. The fair version shows a review score from verified stays and lets you read the reviews.',
    demo: social,
    facts: [
      ['Bias used', 'Bandwagon effect. We copy what other people seem to be doing.'],
      ['How it acts', 'Partly covert and sometimes deceptive: the names and numbers can be made up.']
    ],
    sources: SRC_MATHUR
  },
  {
    id: 'pressured-selling',
    group: 'Misc',
    title: 'Pressured selling',
    lead: 'The most expensive option is already picked.',
    text: 'You’re pushed towards the pricier option, or towards extras. Mathur’s example is a flower shop with the largest bouquet already selected. Here, that means pressing Add to cart spends £50 instead of £25. The fair version starts with nothing selected and shows the sizes side by side.',
    demo: pressured,
    facts: [
      ['Bias used', 'Default effect and anchoring, and sometimes scarcity bias. The priciest option becomes the one everything else is measured against.'],
      ['How it acts', 'Sometimes asymmetric: it pushes you toward the more expensive option. At least partly covert: you may not notice you got the pricier version.']
    ],
    sources: SRC_MATHUR
  }
];
