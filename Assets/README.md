# Assets

Every file the site uses, grouped by where it appears. Names are lowercase with dashes.

| Folder | What's inside | Where it shows |
|---|---|---|
| `hero/` | `mousepad.webp`, `earbuds-case.png`, `earbud-a.png`, `earbud-b.png`, `plane-icon.png` | Home, top section |
| `mascots/` | `mascot-designer` (hero line + Selected Projects), `mascot-travel` (My Design Journey), `mascot-plain` (A Bit About Me), `mascot-fire` (Let's Build Together), `mascot-peek`, `mascot-sleep`, `mascot-reading`, `mascot-chat` (NOOK case study) | Home titles, case study cards |
| `work/` | `nook.webp`, `better-decisions.webp`, `zefyron.webp` | Home, Selected Projects |
| `about/` | `photo.webp` | Home, A Bit About Me |
| `icons/` | `nook-app-icon.svg`, `tasker-app-icon.svg` (Currently Building: if you re-export it, put its new size and where the 44px tile starts in index.html, on its img: width/height and --tile-x/--tile-y), `currently-building.svg`, `outside-of-design.svg`, `bored-to-door.svg` | Home + case studies |
| `icons/tools/` | toolkit logos (`figma.webp`, `claude-code.webp`, …) | My Toolkit on both pages |
| `icons/companies/` | `zefyron.webp`, `frover.webp`, `nit-goa.webp` | Home, My Design Journey |
| `footer/` | `crowd.json` (the crowd animation), `grid-pattern.svg` (Quick Navigation card). `crowd-lottie.tsx` and `crowd-people/` are source files, not loaded by the site | Home footer |
| `nook/` | `cover.webp`, `research.webp`, `park.webp` (bottom scene), `post-card.webp`, `card-pattern.webp` (dark card lines) | NOOK case study |
| `nook/screens/` | app screens, named by flow: `onboarding-…`, `discovery-…`, `chat-…`, `iteration-…` (`-old` = the earlier version) | NOOK case study |
| `nook/design/` | Figma exports of the case study (not loaded by the site) | – |
| `decisions/` | The Art of Better Decisions: `<project>-before.webp` (original screen) and `<project>-after.webp` (redesign) for `screener`, `music`, `ulaa`, `payzapp`, `urban-company`, `html-to-design` | better-decisions.html |
| `decisions/teaser/` | the cover video (`teaser-1428.mp4` for big screens, `teaser-952.mp4` for phones) and its `poster.webp`. Made from the screens above: `node tools/teaser/make-teaser.mjs` | better-decisions.html |
| `decisions/design/` | the gallery's original PNG and SVG files (not loaded by the site) | – |
| `tasker/` | `tasker.apk`, the Android app the Download Tasker button gives (it saves as Tasker.apk). Replace it keeping the same name | Home, Currently Building |
| `fonts/` | one folder per typeface, `.woff2` only | Everywhere |
| `unused/` | duplicates and older files the site doesn't load | – |

## Changing an image

1. Replace the file, keeping the same name (for example `about/photo.webp`).
2. If that folder has a `sizes/` subfolder, run this from the project folder:

   ```
   python tools/resize-images.py
   ```

   The site loads the small copies in `sizes/` (phones get the small ones, big screens the sharp ones), so this step rebuilds them from your new file. Folders without `sizes/` need nothing else.
