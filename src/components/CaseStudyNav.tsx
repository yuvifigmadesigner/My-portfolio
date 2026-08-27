import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface NavSection {
  /** id on the matching <section> element */
  id: string;
  /** short form of the section heading, since the real ones run long */
  label: string;
  /** which background the section sits on, so the rail stays legible over it */
  theme: 'light' | 'dark';
}

/** Collapse the panel again after this long without a touch or click. */
const IDLE_MS = 60_000;

/**
 * A small rounded tab on the right edge. Tapping it reveals the section
 * titles; the panel folds itself away after a minute of no interaction.
 */
const CaseStudyNav: React.FC<{ sections: NavSection[] }> = ({ sections }) => {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');
  // Tracked apart from activeId: the rail sits at the vertical middle, so what
  // it has to stay legible against is whatever is behind THAT point, not the
  // section being read. Above section 01 that is the dark hero, below the last
  // one it is the dark footer.
  const [onDark, setOnDark] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---- scroll spy ------------------------------------------------- */
  useEffect(() => {
    const syncActive = () => {
      // Whichever section has crossed the upper third is the one being read.
      const marker = window.innerHeight * 0.35;
      let current = sections[0]?.id ?? '';

      sections.forEach((section) => {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top <= marker) current = section.id;
      });

      setActiveId(current);

      // Whichever section covers the middle of the screen is behind the rail.
      // Nothing covering it means the hero or the footer, both of which are dark.
      const centre = window.innerHeight / 2;
      let behind: 'light' | 'dark' = 'dark';

      sections.forEach((section) => {
        const el = document.getElementById(section.id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= centre && rect.bottom >= centre) behind = section.theme;
      });

      setOnDark(behind === 'dark');
    };

    syncActive();
    window.addEventListener('scroll', syncActive, { passive: true });
    window.addEventListener('resize', syncActive);
    return () => {
      window.removeEventListener('scroll', syncActive);
      window.removeEventListener('resize', syncActive);
    };
  }, [sections]);

  /* ---- idle collapse ---------------------------------------------- */
  const keepAwake = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIsOpen(false), IDLE_MS);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      return;
    }
    keepAwake();
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [isOpen, keepAwake]);

  // Same surface language as the rest of the page: a translucent panel over a
  // hairline border, no heavy fills.
  const surface = onDark
    ? 'bg-[#1A1622]/85 border-white/[0.09]'
    : 'bg-[#FAF7F2]/85 border-black/[0.07]';

  const goToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    keepAwake();
    // On narrow screens the panel covers what you just navigated to.
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  return (
    <div
      className="fixed right-0 top-1/2 -translate-y-1/2 z-50"
      onMouseMove={isOpen ? keepAwake : undefined}
    >
      {/* The tab, always against the right edge */}
      <button
        type="button"
        onClick={() => {
          setIsOpen((open) => !open);
          keepAwake();
        }}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Hide section list' : 'Show section list'}
        className={`group flex items-center justify-center w-[19px] h-9 sm:h-10 p-0 cursor-pointer rounded-l-full border border-r-0 backdrop-blur-sm transition-colors duration-300 ${surface}`}
      >
        {/* Two parallel strokes that swing together into a cross when open */}
        <span className="relative flex items-center justify-center w-3 h-3">
          {[0, 1].map((i) => (
            <motion.span
              key={i}
              animate={{
                x: isOpen ? 0 : i === 0 ? -2 : 2,
                rotate: isOpen ? (i === 0 ? 45 : -45) : 0,
              }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={`absolute w-px h-2.5 rounded-full transition-colors duration-300 ${
                isOpen
                  ? 'bg-[#F05C6D]'
                  : onDark
                    ? 'bg-white/35 group-hover:bg-white/70'
                    : 'bg-[#221F28]/30 group-hover:bg-[#221F28]/65'
              }`}
            />
          ))}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            aria-label="Case study sections"
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={keepAwake}
            className={`absolute right-[25px] top-1/2 -translate-y-1/2 flex flex-col py-2.5 px-3 rounded-[8px] border backdrop-blur-md shadow-[0_1px_2px_rgba(34,31,40,0.02),0_4px_14px_rgba(34,31,40,0.035),0_14px_44px_rgba(34,31,40,0.045)] ${surface}`}
          >
            {sections.map((section) => {
              const isActive = section.id === activeId;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => goToSection(section.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className="group flex items-center justify-end gap-2 bg-transparent border-0 p-0 py-[5px] cursor-pointer"
                >
                  <span
                    className={`font-ppmori text-[10px] uppercase tracking-[0.13em] whitespace-nowrap transition-colors duration-300 ${
                      isActive
                        ? onDark
                          ? 'text-[#F5F2EC]'
                          : 'text-[#221F28]'
                        : onDark
                          ? 'text-white/35 group-hover:text-white/75'
                          : 'text-[#221F28]/35 group-hover:text-[#221F28]/75'
                    }`}
                  >
                    {section.label}
                  </span>

                  <span
                    className={`h-px rounded-full transition-all duration-300 ${
                      isActive
                        ? 'w-3 bg-[#F05C6D]'
                        : onDark
                          ? 'w-1.5 bg-white/25 group-hover:w-2.5'
                          : 'w-1.5 bg-[#221F28]/20 group-hover:w-2.5'
                    }`}
                  />
                </button>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CaseStudyNav;
