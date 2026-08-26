================================================================================
           SOUL.MD - LANDING PAGE VISUAL BLUEPRINT & LAYER GUIDE
================================================================================

[ OVERVIEW ]
  Target Section : Hero Landing Page (#home)
  Source File    : src/pages/Home/index.tsx
  Purpose        : Simple layperson reference guide for visual layers and layout 
                   grid divisions. Optimized for Windows Notepad reading.


================================================================================
1. VISUAL LAYER STACK (EXPLAINED IN SIMPLE TERMS)
================================================================================

Imagine looking at your screen as a stack of transparent glass sheets placed on
top of each other. The elements are split into 2 clear categories:

--------------------------------------------------------------------------------
1.1 BACKGROUND ELEMENTS (THE ATMOSPHERE & BASE CANVAS)
--------------------------------------------------------------------------------

  ┌──────────────────────────────────────────────────────────────────────────┐
  │ [LAYER 5 - TOP OVERLAY] GLOBAL PAPER NOISE OVERLAY                       │
  │ Simple terms: A semi-transparent grainy paper texture placed over the    │
  │ whole screen to give the website a tactile, cinematic film feel.         │
  ├──────────────────────────────────────────────────────────────────────────┤
  │ [LAYER 1 - ATMOSPHERE] INTERACTIVE AMBER LIGHT RAYS & BLUEPRINT GRID     │
  │ Simple terms: Glowing amber light beams in the background that follow    │
  │ your mouse movement, sitting on top of subtle engineering grid lines.    │
  ├──────────────────────────────────────────────────────────────────────────┤
  │ [LAYER 0 - BASE] SOLID DARK CANVAS                                       │
  │ Simple terms: The dark base background color (#111827) that sits at the   │
  │ absolute back of the screen.                                             │
  └──────────────────────────────────────────────────────────────────────────┘

--------------------------------------------------------------------------------
1.2 CONTENT-SHOWING ELEMENTS (TEXT, CARDS & NAVIGATION)
--------------------------------------------------------------------------------

  ┌──────────────────────────────────────────────────────────────────────────┐
  │ [LAYER 4 - TOP NAVIGATION] FLOATING HEADER BAR                           │
  │ Simple terms: The menu bar (Logo, Home/Work/About links) floating at the │
  │ top of your window so you can navigate anytime.                          │
  ├──────────────────────────────────────────────────────────────────────────┤
  │ [LAYER 3 - POPUPS & HOVER] ACTIVE POPUP & HOVERED CARDS                  │
  │ Simple terms: When you hover over a card or tap a card on mobile, it     │
  │ jumps to this front content layer so it never gets blocked by other text.│
  ├──────────────────────────────────────────────────────────────────────────┤
  │ [LAYER 2 - MAIN CONTENT] HERO HEADLINE, BIO & CARDS                      │
  │ Simple terms: The main big text ("THE NEXT GENERATION OF UX..."), intro  │
  │ bio paragraph, and non-hovered metadata cards resting on the screen.     │
  └──────────────────────────────────────────────────────────────────────────┘


================================================================================
2. LAYOUT & SECTION DIVISIONS (GRID & ELEMENTS CONTAINED)
================================================================================

The hero page is split into a 2-Column Responsive Layout:

--------------------------------------------------------------------------------
[COLUMN A - LEFT SIDE] MAIN HEADLINE & BIOGRAPHY (Takes 60% Width on Desktop)
--------------------------------------------------------------------------------
  Contains:
  - Big Hero H1 Headline (3 stacked lines of text)
  - Interactive Rotating Word Switcher (Line 3 of H1)
  - Personal Intro Bio Paragraph with clickable link to #about
  - Bottom "Scroll for Work" animated hint with down arrow icon

  Layout Rules:
  - Desktop : Aligned to the left, 8-column span grid layout
  - Mobile  : Stacked vertically at the top, left-aligned

--------------------------------------------------------------------------------
[COLUMN B - RIGHT SIDE] METADATA CARDS DECK (Takes 40% Width on Desktop)
--------------------------------------------------------------------------------
  Contains:
  - Card 1 : "Currently Work" -> Product UX Intern @ VCBay (Europe • Remote)
             [Feature: Live pulsing status dot]
  - Card 2 : "Experience"     -> 2+ Years Crafting Digital Products
  - Card 3 : "Location"       -> India (Available for Global Remote/Relocation)

  Layout Rules:
  - Desktop : Scattered floating layout at slight angles (-4.5 deg, +5.5 deg)
  - Mobile  : 3D overlapping stacked card deck centered under headline text

================================================================================
