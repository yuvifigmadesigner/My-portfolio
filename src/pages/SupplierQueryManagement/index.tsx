import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { requestFolderReturn, scrollToWorkFolder } from '../../utils/exitPoint';
import CaseStudyNav, { NavSection } from '../../components/CaseStudyNav';

interface SqmPageProps {
  onNavigate?: (page: string) => void;
}

/* ------------------------------------------------------------------ */
/* ASSETS — TODO                                                       */
/* Drop exports into /public/for SQM page/ and fill the paths below.    */
/* Anything left empty renders a labelled placeholder instead of an     */
/* <img>, so nothing 404s while the assets are still missing.           */
/* ------------------------------------------------------------------ */

/* Section 03 — frames the single canvas morphs through every 2.8s.
   All four export at 5760x4096, so the canvas is locked to that ratio. */
const KEY_SCREENS = '/sqm%20page/export_2026-08-26T17_30_09-410Z';

const keyScreenAssets: { src: string; label: string }[] = [
  { src: `${KEY_SCREENS}/dashboard_split_view_4x.webp`, label: 'Supplier Dashboard, split view' },
  { src: `${KEY_SCREENS}/dashboard_table_view_4x.webp`, label: 'Supplier Dashboard, table view' },
  { src: `${KEY_SCREENS}/new_query_4x.webp`, label: 'Raise New Query' },
  { src: `${KEY_SCREENS}/track_query_4x.webp`, label: 'Track Query' },
];

/* Section 04 — the working parts inside each screen.
   `span: 'full'` gives a part the whole row, for the wide or tall exports. */
const ASSETS = '/sqm%20page/SQM';

const screenComponents: {
  id: string;
  title: string;
  parts: { label: string; body: string; src: string; span?: 'half' | 'full' }[];
}[] = [
  {
    id: 'dashboard',
    title: 'Supplier Dashboard',
    parts: [
      {
        label: 'Supplier list',
        body: 'Search, filters and the view toggle sit above a scrollable list, each row carrying the supplier ID, category, last contact time and a red, orange or green risk badge.',
        src: `${ASSETS}/side_view_with_card_view_4x.webp`,
      },
      {
        label: 'Card view',
        body: 'The selected supplier opens into a profile card with a Raise Query CTA, live query updates, a compliance heatmap across months, a certificate ledger flagging what has expired, and an activity log.',
        src: `${ASSETS}/card_view_4x.webp`,
      },
      {
        label: 'Table view',
        body: 'The same suppliers as a row-per-supplier matrix: name and ID, category, risk rating, active queries and last audit date, each row carrying its own View action.',
        src: `${ASSETS}/table_view_4x.webp`,
        span: 'full',
      },
    ],
  },
  {
    id: 'new-query',
    title: 'Raise New Query',
    parts: [
      {
        label: 'Query create area',
        body: 'Supplier, contact and the reference standard being cited, urgency as a three-chip selector, a description with a Clear shortcut, one drag-and-drop zone taking files up to 150MB, and an inline deadline calendar.',
        src: `${ASSETS}/new_query_4x.webp`,
      },
      {
        label: 'Saved templates',
        body: 'The queries that recur, like an FSSAI renewal or a traceability mock audit, applied into the form in one click. Placeholders fill the batch number from whichever supplier is selected.',
        src: `${ASSETS}/template_4x.webp`,
      },
    ],
  },
  {
    id: 'track-query',
    title: 'Track Query',
    parts: [
      {
        label: 'Chat window with live timeline',
        body: 'The conversation on the left, and on the right a timeline record stamping Query Raised, Pending Review, Query Resolved and Follow-Up Required, with a documents vault underneath linking each file back into the thread.',
        src: `${ASSETS}/timeline_chat_4x.webp`,
        span: 'full',
      },
    ],
  },
];

/* Section rail. Labels are shortened; the headings themselves run long. */
const navSections: NavSection[] = [
  { id: 'sqm-01', label: 'Brief', theme: 'light' },
  { id: 'sqm-02', label: 'What I Found', theme: 'light' },
  { id: 'sqm-03', label: 'Key Screens', theme: 'light' },
  { id: 'sqm-04', label: 'Key Components', theme: 'dark' },
  { id: 'sqm-05', label: 'Why It Works', theme: 'light' },
  { id: 'sqm-06', label: 'Learnings', theme: 'light' },
];

/* What the brief's words turned out to mean. */
const domainNotes = [
  {
    label: 'Standards a supplier is held to',
    items: ['GFSI-recognised schemes', 'FSSAI licence (India)', 'HACCP', 'ISO 22000'],
  },
  {
    label: 'What a food safety query actually contains',
    items: [
      'Pesticide & chemical residue checks',
      'Pathogen & corrective action follow-ups',
      'Audit non-conformance',
      'Allergen cross-contamination',
    ],
  },
];

/* The three channels named in the brief, read as three features. */
const reframe = [
  { from: 'Email', to: 'Threaded messaging' },
  { from: 'Spreadsheet', to: 'Workspace & tracking' },
  { from: 'Phone call', to: 'Quick dial' },
];

const howMightWe = [
  'Raise supplier queries faster while keeping the data accurate and complete?',
  'Visualise query progress so status and urgency read instantly?',
  'Make tracking transparent even across multiple suppliers at once?',
  'Reduce communication friction between QA managers and suppliers?',
];

/* The five Nielsen heuristics that did the most work here, each stated as
   what it means for this module rather than by its textbook name. */
const principles = [
  {
    tag: '(system status)',
    principle: 'A QA manager can always see where a query stands',
    body: 'Every query carries a vertical audit timeline that runs from Query Raised through Pending Review to Query Resolved or Follow-Up Required, each one stamped with a date and time. Risk sits on the supplier as a red, orange or green badge, and the certificate ledger surfaces what is about to lapse without being asked.',
  },
  {
    tag: '(real-world match)',
    principle: 'The module uses the words a food safety team already uses',
    body: 'The query form cites reference standards by name rather than an internal code, urgency is a chip that reads at a glance, and supplier communication is a chat thread, which is the same shape as the email it replaces.',
  },
  {
    tag: '(recognition over recall)',
    principle: 'Nothing has to be remembered between screens',
    body: 'Saved templates fill a recurring query like an FSSAI renewal or a traceability mock audit in one click, instead of from memory. The documents vault keeps shared lab reports and certificates beside the thread, so no evidence is findable only by scrolling back through chat.',
  },
  {
    tag: '(flexibility)',
    principle: 'The same job can be done two ways',
    body: 'Card view for the daily scan of which supplier needs attention, table view for the full row-per-supplier matrix when the whole picture is needed. One toggle, same data, no second page to learn.',
  },
  {
    tag: '(minimalist design)',
    principle: 'Each view carries only what that task needs',
    body: 'The supplier record is split into five panels, so the profile, compliance heatmap, query updates, certificate ledger and activity log each get their own space rather than sitting in one dense wall. Colour is reserved for risk and status, so it still means something when it appears.',
  },
];

/* Shared placeholder frame for assets that are not in yet. */
const AssetPlaceholder: React.FC<{ label: string; aspect?: string }> = ({
  label,
  aspect = 'aspect-[16/9]',
}) => (
  <div
    className={`w-full ${aspect} rounded-[6px] border border-dashed border-[#221F28]/20 flex items-center justify-center`}
  >
    <span className="font-ppmori text-[11px] uppercase tracking-[0.18em] text-[#221F28]/35 px-4 text-center">
      {label}
    </span>
  </div>
);

/* Light-blue canvas every screenshot sits on.
   `boxed` squares the frame from md up so two cards sharing a row line up,
   since the exports run from 3:1 landscape to portrait. Below md they stack,
   so the image is left at its natural height. */
const ScreenCanvas: React.FC<{
  src: string;
  alt: string;
  placeholderLabel: string;
  aspect?: string;
  boxed?: boolean;
}> = ({ src, alt, placeholderLabel, aspect, boxed }) => (
  <div className="w-full bg-[#DDE8F8] rounded-[8px] p-2 sm:p-3.5 md:p-5 flex items-center justify-center overflow-hidden">
    {src ? (
      <div
        className={`w-full flex items-center justify-center ${boxed ? 'md:aspect-square' : ''}`}
      >
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain rounded-[6px] select-none"
          loading="lazy"
        />
      </div>
    ) : (
      <AssetPlaceholder label={placeholderLabel} aspect={aspect} />
    )}
  </div>
);

const SupplierQueryManagement: React.FC<SqmPageProps> = ({ onNavigate }) => {
  const [activeAssetIndex, setActiveAssetIndex] = useState(0);
  const [prevAssetIndex, setPrevAssetIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (keyScreenAssets.length === 0) return;

    // Preload every frame so the morph never catches a blank
    keyScreenAssets.forEach(({ src }) => {
      const img = new Image();
      img.src = src;
    });

    const timer = setInterval(() => {
      setActiveAssetIndex((current) => {
        setPrevAssetIndex(current);
        return (current + 1) % keyScreenAssets.length;
      });
    }, 2800);

    return () => clearInterval(timer);
  }, []);

  const handleBackToHome = () => {
    // When there is a folder card to restore, Work handles the scroll itself
    // after reopening the modal.
    const willRestoreFolder = requestFolderReturn();

    if (onNavigate) {
      onNavigate('home');
    } else {
      window.location.hash = '#work';
    }

    if (!willRestoreFolder) scrollToWorkFolder();
  };

  const handleNextProject = () => {
    if (onNavigate) {
      onNavigate('cap');
    } else {
      window.location.hash = '#cap';
    }
  };

  return (
    <div className="w-full flex flex-col items-center bg-[#120F17] text-white selection:bg-[#F05C6D]/30 min-h-screen">
      <CaseStudyNav sections={navSections} />

      {/* ---------------------------------------------------- */}
      {/* HERO SECTION (Dark Background #120F17)                */}
      {/* ---------------------------------------------------- */}
      <section className="w-full pt-28 sm:pt-36 pb-16 sm:pb-24 px-6 sm:px-10 lg:px-16 max-w-4xl mx-auto flex flex-col items-start z-10">
        <span className="text-[#F05C6D] font-ppmori text-xs font-semibold tracking-[0.2em] uppercase mb-6">
          SUPPLIER QUERY MANAGEMENT
        </span>

        <h1 className="font-stardos text-4xl sm:text-6xl md:text-[68px] font-normal leading-[1.12] text-[#F5F2EC] tracking-tight mb-8">
          Three broken channels, read as three features
        </h1>

        <p className="font-ppmori text-sm sm:text-base text-[#ADA8B6] leading-relaxed max-w-2xl font-light mb-14">
          Supplier food safety queries run through email, spreadsheets and phone calls, so nothing is traceable. A module for raising a query, tracking it to resolution, and seeing supplier compliance in one place.
        </p>

        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pt-6 border-t border-white/10 text-xs font-ppmori">
          <div>
            <span className="text-[#F05C6D] font-ppmori text-[11px] font-semibold tracking-wider uppercase block mb-1">
              ROLE
            </span>
            <span className="text-[#D6D1DE] font-light">Product Designer, solo</span>
          </div>

          <div>
            <span className="text-[#F05C6D] font-ppmori text-[11px] font-semibold tracking-wider uppercase block mb-1">
              TYPE
            </span>
            <span className="text-[#D6D1DE] font-light">Design assignment</span>
          </div>

          <div>
            <span className="text-[#F05C6D] font-ppmori text-[11px] font-semibold tracking-wider uppercase block mb-1">
              WHAT I DID
            </span>
            <span className="text-[#D6D1DE] font-light">Domain research, key screens, UX rationale</span>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 01 / THE BRIEF (Warm Paper Cream)                     */}
      {/* ---------------------------------------------------- */}
      <section id="sqm-01" className="w-full bg-[#FAF7F2] light-bg-section text-[#221F28] py-16 sm:py-24 px-6 sm:px-10 lg:px-16 border-t border-black/5">
        <div className="max-w-4xl mx-auto flex flex-col">
          <span className="text-[#F05C6D] font-ppmori text-xs font-semibold tracking-[0.2em] uppercase mb-10">
            01 / THE BRIEF
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            <div className="flex flex-col">
              <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#221F28] mb-4">
                Problem
              </h3>
              <p className="font-ppmori text-xs sm:text-sm text-[#524E5C] leading-relaxed font-light">
                Supplier queries are spread across email, spreadsheets and calls. Follow-ups get missed, certificate expiry is noticed late, and past resolutions are unrecoverable when an auditor asks.
              </p>
            </div>

            <div className="flex flex-col">
              <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#221F28] mb-4">
                Goal
              </h3>
              <p className="font-ppmori text-xs sm:text-sm text-[#524E5C] leading-relaxed font-light">
                Let a QA manager raise a supplier query, follow it to resolution, and check that supplier's compliance standing without leaving the screen.
              </p>
            </div>

            <div className="flex flex-col">
              <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#221F28] mb-4">
                Constraints
              </h3>
              <p className="font-ppmori text-xs sm:text-sm text-[#524E5C] leading-relaxed font-light">
                No access to real QA managers, and no prior knowledge of food safety compliance. Web only, no design system to inherit, and no engineering input on what the data layer could support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 02 / WHAT I FOUND (Warm Paper Cream)                  */}
      {/* ---------------------------------------------------- */}
      <section id="sqm-02" className="w-full bg-[#FAF7F2] light-bg-section text-[#221F28] pb-20 sm:pb-28 px-6 sm:px-10 lg:px-16 border-t border-black/5">
        <div className="max-w-4xl mx-auto flex flex-col pt-12">
          <span className="text-[#F05C6D] font-ppmori text-xs font-semibold tracking-[0.2em] uppercase mb-8">
            02 / WHAT I FOUND
          </span>

          <p className="font-ppmori text-sm sm:text-base text-[#524E5C] leading-relaxed font-light max-w-2xl mb-10">
            I had never designed for food safety compliance, so I went through the brief line by line and looked up the words I could not have defined. Two recalls made the stakes concrete: a missed query here is not an unanswered email, it is a product on a shelf.
          </p>

          {/* What the words turned out to mean, and why they matter */}
          <div className="w-full rounded-[8px] border border-black/[0.07] bg-white p-6 sm:p-8 md:p-10 mb-6 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {domainNotes.map((group) => (
                <div key={group.label} className="flex flex-col">
                  <span className="font-ppmori text-[10px] uppercase tracking-widest text-[#948F9E] font-medium mb-4">
                    {group.label}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="font-ppmori text-xs text-[#221F28] font-light bg-[#FAF7F2] border border-black/[0.07] rounded-full px-3 py-1.5"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full h-[1px] bg-black/[0.06] my-8" />

            <span className="font-ppmori text-[10px] uppercase tracking-widest text-[#948F9E] font-medium block mb-5">
              Why a missed query matters
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <div className="flex flex-col">
                <p className="font-editorial text-lg text-[#221F28] font-normal mb-1.5">
                  MDH &amp; Everest, 2024
                </p>
                <p className="font-ppmori text-xs text-[#6B6577] leading-relaxed font-light">
                  Ethylene oxide found in exported spice blends. India's regulator ran a national inspection drive and cancelled the licences of 111 manufacturers.
                </p>
              </div>
              <div className="flex flex-col">
                <p className="font-editorial text-lg text-[#221F28] font-normal mb-1.5">
                  Peanut Corporation of America, 2008
                </p>
                <p className="font-ppmori text-xs text-[#6B6577] leading-relaxed font-light">
                  Positive salmonella tests were known internally and shipped anyway. Nine people died and over 3,900 products were recalled.
                </p>
              </div>
            </div>
          </div>

          {/* How Might We — the questions the screens had to answer */}
          <div className="w-full rounded-[8px] border border-black/[0.07] bg-white p-6 sm:p-8 md:p-10 mb-6 shadow-xs">
            <div className="flex items-center justify-between pb-6 border-b border-black/[0.06] mb-8">
              <span className="font-ppmori text-xs uppercase tracking-[0.18em] text-[#F05C6D] font-semibold">
                HOW MIGHT WE
              </span>
              <span className="font-ppmori text-xs text-[#8A8594] font-light hidden sm:inline-block">
                From the QA manager's side
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {howMightWe.map((question, index) => (
                <div key={question} className="flex gap-4">
                  <span className="font-ppmori text-[11px] font-semibold text-[#F05C6D] pt-1 shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="font-editorial text-lg sm:text-xl text-[#221F28] font-normal leading-snug">
                    {question}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* THE REFRAME — the pivot the whole design rests on */}
          <div className="w-full rounded-[8px] bg-[#221F28] p-6 sm:p-8 md:p-10">
            <span className="font-ppmori text-[10px] uppercase tracking-widest text-[#F05C6D] font-semibold block mb-4">
              The reframe
            </span>
            <p className="font-editorial text-2xl sm:text-3xl text-[#F5F2EC] font-normal leading-snug mb-8 max-w-2xl">
              The brief named three broken channels. I read them as three features.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
              {reframe.map((pair) => (
                <div key={pair.from} className="flex flex-col gap-2">
                  <span className="font-ppmori text-xs text-[#8A8594] font-light line-through decoration-[#F05C6D]/60">
                    {pair.from}
                  </span>
                  <span className="font-ppmori text-sm text-[#F5F2EC] font-medium">
                    {pair.to}
                  </span>
                </div>
              ))}
            </div>

            <p className="font-ppmori text-xs sm:text-sm text-[#ADA8B6] leading-relaxed font-light mt-8 max-w-2xl">
              Every screen after this came out of that mapping. It is also why tracking and conversation ended up on one screen rather than two.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 03 / THE KEY SCREENS (Warm Paper Cream, auto-morph)   */}
      {/* ---------------------------------------------------- */}
      <section id="sqm-03" className="w-full bg-[#FAF7F2] light-bg-section text-[#221F28] pb-20 sm:pb-28 px-6 sm:px-10 lg:px-16 border-t border-black/5">
        <div className="max-w-4xl mx-auto flex flex-col pt-12">
          <span className="text-[#F05C6D] font-ppmori text-xs font-semibold tracking-[0.2em] uppercase mb-6">
            03 / THE KEY SCREENS
          </span>

          <p className="font-ppmori text-xs sm:text-sm text-[#524E5C] leading-relaxed font-light max-w-2xl mb-10">
            Three screens carry the whole module, with the dashboard offering two ways to read the same data. Everything a QA manager does, from spotting a risk to closing a query, happens inside one of them.
          </p>

          {/* Single canvas the frames morph through in 3D.
              Perspective sits on the wrapper so `z` and rotation read as depth. */}
          <div
            className="w-full rounded-[8px] bg-[#DDE8F8] py-2 sm:py-3 md:py-4 px-3 sm:px-6 flex items-center justify-center"
            style={{ perspective: 1400 }}
          >
            <div className="w-full relative rounded-[6px] aspect-[45/32] [transform-style:preserve-3d]">
              {/* Outgoing frame receding and blurring away */}
              {prevAssetIndex !== null && prevAssetIndex !== activeAssetIndex && (
                <motion.img
                  key={`prev-${prevAssetIndex}`}
                  src={keyScreenAssets[prevAssetIndex].src}
                  alt=""
                  aria-hidden="true"
                  initial={{ opacity: 1, rotateY: 0, rotateX: 0, scale: 1, z: 0, filter: 'blur(0px)' }}
                  animate={{
                    opacity: 0,
                    rotateY: -20,
                    rotateX: 6,
                    scale: 0.9,
                    z: -180,
                    filter: 'blur(18px)',
                  }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none rounded-[6px] will-change-transform"
                />
              )}

              {/* Active frame swinging in from the other side */}
              <motion.img
                key={`curr-${activeAssetIndex}`}
                src={keyScreenAssets[activeAssetIndex].src}
                alt={keyScreenAssets[activeAssetIndex].label}
                initial={{ opacity: 0, rotateY: 20, rotateX: -6, scale: 0.9, z: -180, filter: 'blur(18px)' }}
                animate={{ opacity: 1, rotateY: 0, rotateX: 0, scale: 1, z: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none rounded-[6px] will-change-transform"
              />
            </div>
          </div>

          {/* Which frame is showing */}
          <motion.span
            key={`label-${activeAssetIndex}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="font-ppmori text-[11px] uppercase tracking-[0.16em] text-[#948F9E] font-medium mt-4"
          >
            {keyScreenAssets[activeAssetIndex].label}
          </motion.span>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 04 / THE KEY COMPONENTS (Dark #120F17)                */}
      {/* ---------------------------------------------------- */}
      <section id="sqm-04" className="w-full bg-[#120F17] py-20 sm:py-28 px-6 sm:px-10 lg:px-16 border-t border-white/10">
        <div className="max-w-4xl mx-auto flex flex-col">
          <span className="text-[#F05C6D] font-ppmori text-xs font-semibold tracking-[0.2em] uppercase mb-6">
            04 / THE KEY COMPONENTS
          </span>

          <p className="font-ppmori text-xs sm:text-sm text-[#ADA8B6] leading-relaxed font-light max-w-2xl mb-14">
            The parts each screen is actually made of, and what each one is there to do.
          </p>

          <div className="flex flex-col gap-16 sm:gap-20">
            {screenComponents.map((group) => (
              <div key={group.id} className="flex flex-col">
                <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#F5F2EC] pb-4 mb-8 border-b border-white/10">
                  {group.title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6">
                  {group.parts.map((part) => (
                    <div
                      key={part.label}
                      className={`flex flex-col gap-3 ${part.span === 'full' ? 'md:col-span-2' : ''}`}
                    >
                      <ScreenCanvas
                        src={part.src}
                        alt={`${group.title}, ${part.label}`}
                        /* the caption below already names the part */
                        placeholderLabel={group.title}
                        aspect={part.span === 'full' ? 'aspect-[16/9]' : 'aspect-[4/3]'}
                        boxed={part.span !== 'full'}
                      />
                      <span className="font-ppmori text-[11px] uppercase tracking-[0.16em] text-[#8A8594] font-medium mt-1">
                        {part.label}
                      </span>
                      <p className="font-ppmori text-xs sm:text-sm text-[#ADA8B6] leading-relaxed font-light">
                        {part.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 05 / WHY THE SCREENS WORK THIS WAY (Paper Cream)      */}
      {/* ---------------------------------------------------- */}
      <section id="sqm-05" className="w-full bg-[#FAF7F2] light-bg-section text-[#221F28] py-16 sm:py-24 px-6 sm:px-10 lg:px-16 border-t border-black/5">
        <div className="max-w-4xl mx-auto flex flex-col">
          <span className="text-[#F05C6D] font-ppmori text-xs font-semibold tracking-[0.2em] uppercase mb-8">
            05 / WHY THE SCREENS WORK THIS WAY
          </span>

          <div className="w-full rounded-[8px] border border-black/[0.08] bg-white overflow-hidden shadow-sm">
            <div className="w-full bg-[#FCE6EC] px-6 sm:px-8 py-2.5 sm:py-3.5 flex items-center border-b border-black/[0.06]">
              {/* Rows stack on mobile, so a single label is the only one that lines up */}
              <span className="sm:hidden text-[#2D2936] font-ppmori text-[11px] uppercase tracking-widest font-semibold">
                NIELSEN&rsquo;S HEURISTICS
              </span>
              <span className="hidden sm:block sm:w-[32%] text-[#2D2936] font-ppmori text-xs uppercase tracking-widest font-semibold">
                NIELSEN&rsquo;S HEURISTICS
              </span>
              <span className="hidden sm:block sm:w-[68%] text-[#2D2936] font-ppmori text-xs uppercase tracking-widest font-semibold">
                HOW I APPLIED IT
              </span>
            </div>

            <div className="divide-y divide-black/[0.06]">
              {principles.map((item) => (
                <div
                  key={item.principle}
                  className="px-6 sm:px-8 py-6 sm:py-7 flex flex-col sm:flex-row items-start gap-2 sm:gap-0 hover:bg-[#FAF7F2]/60 transition-colors"
                >
                  <div className="w-full sm:w-[32%] pr-4">
                    <span className="font-ppmori text-xs text-[#6B6577] italic block mb-1">
                      {item.tag}
                    </span>
                    <h4 className="font-editorial text-lg sm:text-xl font-normal text-[#221F28] leading-snug">
                      {item.principle}
                    </h4>
                  </div>
                  <div className="w-full sm:w-[68%]">
                    <p className="font-ppmori text-xs sm:text-sm text-[#555160] leading-relaxed font-light">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 06 / WHAT I LEARNED AND WHAT COMES NEXT (Paper Cream) */}
      {/* ---------------------------------------------------- */}
      <section id="sqm-06" className="w-full bg-[#FAF7F2] light-bg-section text-[#221F28] pb-24 px-6 sm:px-10 lg:px-16 border-t border-black/5">
        <div className="max-w-4xl mx-auto flex flex-col pt-12">
          <span className="text-[#F05C6D] font-ppmori text-xs font-semibold tracking-[0.2em] uppercase mb-8">
            06 / WHAT I LEARNED AND WHAT COMES NEXT
          </span>

          <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#221F28] mb-5">
            What I learned
          </h3>
          <div className="flex flex-col gap-5 text-sm sm:text-base font-ppmori text-[#524E5C] font-light leading-relaxed max-w-3xl mb-14">
            <p>
              The reframe did most of the work. Once the three broken channels were read as three features, the module had a shape, and the decision to merge tracking with conversation followed from it rather than being argued for separately.
            </p>
            <p>
              Learning the domain had to come before any layout. I could not have grouped a certificate ledger sensibly without first knowing what GFSI, HACCP and a non-conformance actually are. That reading was not preparation for the design work, it was part of it.
            </p>
            <p>
              What I would push back on: every claim here about how QA managers work came from a brief, not from a QA manager. For a workflow this specific, two conversations with people who chase suppliers for a living would have changed what I could honestly assert.
            </p>
          </div>

          <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#221F28] mb-5">
            What comes next
          </h3>
          <div className="flex flex-col gap-5 text-sm sm:text-base font-ppmori text-[#524E5C] font-light leading-relaxed max-w-3xl mb-16">
            <p>
              The first thing I would add is auto-reminders for pending queries. Chasing is the part of this job with no judgement in it and the part most likely to be dropped, so it should not depend on anyone remembering.
            </p>
            <p>
              After that, a supplier-side view. This is designed entirely from the QA end of the thread, so a role-based view would put both ends on the same record instead of the same email. Then a reference library of FSSAI and BIS standards so a citation is selected rather than typed, and export to PDF or Excel, since an audit trail nobody can hand over is only half useful.
            </p>
          </div>

          {/* Bottom Action Navigation Bar (PP Mori) */}
          <div className="flex items-center justify-between pt-12 border-t border-black/10">
            <button
              onClick={handleBackToHome}
              className="text-[#F05C6D] font-ppmori text-xs uppercase tracking-wider font-semibold hover:underline transition-colors cursor-pointer flex items-center gap-1.5"
            >
              ← BACK TO HOME
            </button>

            <button
              onClick={handleNextProject}
              className="px-6 py-2.5 rounded-[4px] bg-[#FCE6EC] text-[#E04556] font-ppmori text-xs uppercase tracking-wider font-semibold hover:bg-[#fbd3dc] transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              {/* Abbreviated on mobile so the button stays on one line */}
              <span className="sm:hidden">CAP</span>
              <span className="hidden sm:inline">COLLEGE ACCESS PROGRAM</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupplierQueryManagement;
