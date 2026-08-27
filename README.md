# Yuvraj Gupta — Portfolio

Personal portfolio of **Yuvraj Gupta**, Product / UX Designer. Built as a
single-page React app with hash routing, a warm-paper-on-near-black palette,
and motion used to explain rather than decorate.

**Live sections:** Home · Experience · Selected Works · Case studies · About

---

## Case studies

Two long-form case studies live inside the app, reachable from the Assignments
folder in Selected Works or directly by hash:

| Route | Project |
|---|---|
| `#cap` | **College Access Program** — restructuring a content-heavy education site so students can find what they need |
| `#sqm` | **Supplier Query Management** — a food-safety query module for QA managers, replacing email, spreadsheets and phone calls |

Both follow the same arc: the brief, what the research turned up, the finished
screens, the components inside them, the reasoning behind them, and what came
out of it.

---

## Running locally

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev
```

The dev server runs at **http://localhost:3000** (set in `vite.config.ts`, not
Vite's default 5173).

| Script | Does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the built output |

### Environment

Only needed if you are working on the AI feedback box:

```bash
# .env.local  (git-ignored)
GEMINI_API_KEY=your_key_here
```

The site builds and runs without it; that one feature simply stays inert.

---

## Stack

- **React 19** + **TypeScript**, bundled with **Vite 6**
- **Tailwind** (CDN build, configured inline in `index.html`)
- **Framer Motion** for all animation and scroll-linked motion
- **three / @react-three/fiber**, **ogl**, **gsap** for background and effects
- **lucide-react** for icons

Type fonts are PP Editorial New and PP Mori, with Stardos Stencil for display
headings.

---

## Layout

```
src/
  App.tsx                  hash routing + page switching
  components/              header, footer, timeline, background, modals
    CaseStudyNav.tsx       section rail shared by both case studies
  pages/
    Home/                  hero
    Work/                  Selected Works, testimonials, folder modals
    About/                 contact
    CollegeAccessProgram/  #cap case study
    SupplierQueryManagement/  #sqm case study
  utils/
    exitPoint.ts           returns "Back to home" to the card you opened
public/                    images, fonts, case-study exports
```

Heavy sections are lazy-loaded behind `React.Suspense`, so the first paint only
carries the hero.

---

## Notes on the build

- Section backgrounds alternate between `#120F17` and `#FAF7F2`; anything
  fixed on screen (the menu pill, the case-study rail) reads which one sits
  behind it and re-colours itself.
- The mobile timeline spine is drawn by scroll position rather than a one-shot
  reveal.
- Case-study screenshots are exported at 4x and downscaled by the browser, so
  avoid `image-rendering` overrides on them.
