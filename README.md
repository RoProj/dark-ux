# Deceptive UX Index

Interactive animations of dark UX patterns, each with a fair version of the same screen.

**Live site:** https://roproj.github.io/dark-ux/

## What it is

Eighteen deceptive design patterns, rebuilt as small working screens. Every one has two versions: **Unfair** is the dark pattern, and **Fair** is how the same screen should have been done.

A fake cursor plays each demo on its own once you scroll to it, and it pauses when you scroll away. You can pause or replay it, switch between Unfair and Fair, or take over by clicking or tapping a control.

Every shop, brand and product in the demos is made up. The site runs entirely in your browser, includes no analytics or tracking, and sends nothing anywhere.

## The patterns

Grouped the way Gray et al. group them. Patterns that only Mathur et al. cover sit under Misc.

| Group | Patterns |
| --- | --- |
| Nagging | Nagging |
| Obstruction | Roach motel, Intermediate currency |
| Sneaking | Hidden costs, Sneak into basket, Hidden subscription, Bait and switch |
| Interface interference | Confirmshaming, Trick questions, Preselection, Visual interference, Countdown timer |
| Forced action | Forced enrollment, Privacy zuckering, Gamification |
| Misc | Low-stock message, Activity notifications, Pressured selling |

Each entry has a short description and a "Why it works" panel with the bias involved, how the pattern acts, and its sources. Where a paper names no bias for a pattern, the panel says so instead of guessing.

## Where it comes from

- Gray, C. M., Kou, Y., Battles, B., Hoggatt, J., and Toombs, A. L. (2018). *The Dark (Patterns) Side of UX Design.* CHI 2018. https://doi.org/10.1145/3173574.3174108
- Mathur, A., Acar, G., Friedman, M. J., Lucherini, E., Mayer, J., Chetty, M., and Narayanan, A. (2019). *Dark Patterns at Scale: Findings from a Crawl of 11K Shopping Websites.* CSCW 2019, Article 81. https://doi.org/10.1145/3359183
- Di Geronimo, L., Braz, L., Fregnan, E., Palomba, F., and Bacchelli, A. (2020). *UI Dark Patterns and Where to Find Them: A Study on Mobile Applications and User Perception.* CHI 2020. https://doi.org/10.1145/3313831.3376600
- Harry Brignull's collection of examples and pattern names: https://www.deceptive.design/

The "Why it works" lines were checked against the papers each entry cites. The demos, the wording and the fictional shops are original.

## Built with

- [Vite](https://vite.dev/) and plain JavaScript, with no framework
- [GSAP](https://gsap.com/) for the animation
- [Inter](https://rsms.me/inter/) (variable), self-hosted through Fontsource

## Images

The product photos in some demos were generated with an AI image tool.

## Licence

Copyright (c) 2026 Rohan Projects. All rights reserved.

The source is public so it can be read. It is not licensed for reuse, copying or redistribution. See `LICENSE`.
