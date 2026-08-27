import React, { useState, useEffect } from 'react';
import { X, FileText, ArrowUpRight, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SOCIAL_LINKS } from '../constants';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isFolderActive, setIsFolderActive] = useState(false);
  const [isLightSection, setIsLightSection] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Detect if header/menu is scrolled over light background sections
      const timelineEl = document.getElementById('timeline');
      const workLightEl = document.getElementById('work-light-section');

      let inLight = false;

      const checkLight = (el: HTMLElement | null) => {
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom > 120) {
            inLight = true;
          }
        }
      };

      checkLight(timelineEl);
      checkLight(workLightEl);

      const customLightEls = document.querySelectorAll('.light-bg-section');
      customLightEls.forEach((el) => checkLight(el as HTMLElement));

      setIsLightSection(inLight);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkFolderModal = () => {
      setIsFolderActive(document.body.classList.contains('folder-modal-active'));
    };

    checkFolderModal();

    const observer = new MutationObserver(checkFolderModal);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText('yuvrajkumar0221@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const getLink = (label: string) => SOCIAL_LINKS.find(l => l.label === label)?.href || '#';

  const renderMenuContent = (showCloseButton: boolean = false) => (
    <motion.div
      initial="closed"
      animate="open"
      exit="closed"
      variants={{
        open: {
          transition: { staggerChildren: 0.08, delayChildren: 0.08 }
        },
        closed: {
          transition: { staggerChildren: 0.04, staggerDirection: -1 }
        }
      }}
      className="w-full flex flex-col"
    >
      {showCloseButton && (
        <div className="flex items-center justify-end pb-3">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="w-8 h-8 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white/80 hover:bg-white/15 hover:text-white transition-all"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Navigation Options (Home & Contact) */}
      <motion.nav
        variants={{
          open: { opacity: 1, y: 0 },
          closed: { opacity: 0, y: -12 }
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-start gap-4 py-1 font-stardos"
      >
        <button
          onClick={() => handleNavClick('home')}
          className={`text-3xl sm:text-4xl font-stardos tracking-wide transition-all duration-300 w-full text-left flex items-center justify-between group py-1 ${
            currentPage === 'home'
              ? isLightSection ? 'text-[#3d1c27] font-medium' : 'text-[#F05C6D] font-medium'
              : 'text-white/85 hover:text-white hover:translate-x-1.5'
          }`}
        >
          <span>Home</span>
        </button>

        <button
          onClick={() => handleNavClick('contact')}
          className={`text-3xl sm:text-4xl font-stardos tracking-wide transition-all duration-300 w-full text-left flex items-center justify-between group py-1 ${
            currentPage === 'contact' || currentPage === 'about'
              ? isLightSection ? 'text-[#3d1c27] font-medium' : 'text-[#F05C6D] font-medium'
              : 'text-white/85 hover:text-white hover:translate-x-1.5'
          }`}
        >
          <span>Contact</span>
        </button>
      </motion.nav>

      {/* Divider Line */}
      <motion.div
        variants={{
          open: { opacity: 1, scaleX: 1 },
          closed: { opacity: 0, scaleX: 0 }
        }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full h-px bg-white/15 my-4 origin-left"
      />

      {/* Connect Section */}
      <motion.div
        variants={{
          open: { opacity: 1, y: 0 },
          closed: { opacity: 0, y: -12 }
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-3 py-1 font-stardos"
      >
        <span className="text-white/50 font-ppmori text-[10px] uppercase tracking-widest">
          / Connect
        </span>

        <div className="flex flex-col gap-3">
          {/* Email Row with Copy Button */}
          <div className="flex items-center justify-between gap-3">
            <a
              href="mailto:yuvrajkumar0221@gmail.com"
              className="flex flex-col gap-0.5 text-left min-w-0 flex-1"
            >
              <span className="text-[10px] font-stardos uppercase tracking-widest text-white/60">
                Email
              </span>
              <span className="text-[13px] sm:text-[14px] font-stardos tracking-wider text-white/90 truncate">
                yuvrajkumar0221@gmail.com
              </span>
            </a>

            <button
              onClick={handleCopyEmail}
              className="px-2.5 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-[#F05C6D]/20 hover:border-[#F05C6D]/40 text-white/80 hover:text-[#F05C6D] transition-all shrink-0 flex items-center gap-1.5 text-[11px] font-stardos tracking-wider"
              title="Copy Gmail address"
            >
              {copiedEmail ? (
                <>
                  <Check size={12} className="text-[#F05C6D]" />
                  <span className="text-[#F05C6D] font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* LinkedIn */}
          <a
            href={getLink('LinkedIn')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-0.5 text-left"
          >
            <span className="text-[10px] font-stardos uppercase tracking-widest text-white/60 flex items-center gap-1">
              LinkedIn <ArrowUpRight size={11} className="opacity-60" />
            </span>
            <span className="text-[13px] sm:text-[14px] font-stardos tracking-wider text-white/90 truncate hover:underline hover:underline-offset-4 hover:decoration-white/60">
              linkedin.com/in/yuvrajgupta-ux
            </span>
          </a>

          {/* Phone */}
          <a
            href="tel:+917698893369"
            className="flex flex-col gap-0.5 text-left"
          >
            <span className="text-[10px] font-stardos uppercase tracking-widest text-white/60">
              Phone
            </span>
            <span className="text-[13px] sm:text-[14px] font-stardos tracking-wider text-white/90 hover:underline hover:underline-offset-4 hover:decoration-white/60">
              +91 76988 93369
            </span>
          </a>
        </div>
      </motion.div>

      {/* Divider Line */}
      <motion.div
        variants={{
          open: { opacity: 1, scaleX: 1 },
          closed: { opacity: 0, scaleX: 0 }
        }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full h-px bg-white/15 my-4 origin-left"
      />

      {/* Bottom Action Pill Button - Full Width Resume */}
      <motion.div
        variants={{
          open: { opacity: 1, y: 0 },
          closed: { opacity: 0, y: -12 }
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="pt-1"
      >
        <a
          href={getLink('Resume')}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-11 px-4 rounded-full bg-[#F05C6D] text-[#120F17] font-ppmori text-[12px] uppercase tracking-wider font-bold text-center flex items-center justify-center leading-none"
        >
          <span className="-mt-[1px]">Resume</span>
        </a>
      </motion.div>
    </motion.div>
  );

  return (
    <div className={`fixed inset-0 z-50 pointer-events-none flex justify-center transition-opacity duration-300 ${isFolderActive ? 'opacity-0 !pointer-events-none hidden' : ''}`}>
      <div className="w-full max-w-[1440px] min-[2000px]:max-w-[2000px] relative pointer-events-none">
        
        {/* DESKTOP HEADER (Top Right Menu Button & Top Dropdown Card) */}
        <header className="hidden sm:flex absolute top-6 right-6 md:right-12 items-center gap-3 pointer-events-auto z-50">
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`group flex items-center justify-center px-5 py-2.5 rounded-full backdrop-blur-xl border cursor-pointer select-none transition-all duration-500 ${
                isLightSection
                  ? 'bg-[#120F17] border-[#F05C6D]/40 shadow-[0_2px_6px_rgba(34,31,40,0.04),0_8px_24px_rgba(34,31,40,0.07)]'
                  : scrolled
                    ? 'bg-[#120F17]/90 border-[#F05C6D]/20 shadow-[0_8px_32px_rgba(240,92,109,0.08)]'
                    : 'bg-[#120F17]/60 border-white/10 shadow-2xl'
              } ${isMenuOpen ? 'border-[#F05C6D]/50 bg-[#120F17]/95' : 'hover:border-[#F05C6D] hover:bg-[#F05C6D]'}`}
            >
              <span className="text-xs font-ppmori [font-variant-caps:small-caps] lowercase tracking-widest text-white group-hover:text-[#120F17] font-bold min-w-[30px] text-center overflow-hidden inline-flex items-center justify-center h-4 relative transition-colors duration-300">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isMenuOpen ? 'close' : 'menu'}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.86, 0, 0.07, 1] }}
                    className="block"
                  >
                    {isMenuOpen ? 'close' : 'menu'}
                  </motion.span>
                </AnimatePresence>
              </span>
            </button>

            {/* Desktop Menu Overlay Card */}
            <AnimatePresence>
              {isMenuOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed inset-0 z-40 bg-black/15 backdrop-blur-sm cursor-default"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, clipPath: 'inset(0% 0% 100% 0% round 1rem)', y: -8 }}
                    animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 1rem)', y: 0 }}
                    exit={{ opacity: 0, clipPath: 'inset(0% 0% 100% 0% round 1rem)', y: -8 }}
                    transition={{ type: "spring", stiffness: 220, damping: 22, mass: 1.0 }}
                    style={{
                      transformOrigin: 'top center',
                      background: isLightSection
                        ? 'linear-gradient(165deg, rgba(240, 92, 109, 0.92) 0%, rgba(160, 45, 65, 0.95) 42%, rgba(18, 15, 23, 0.99) 100%)'
                        : 'linear-gradient(165deg, rgba(240, 92, 109, 0.44) 0%, rgba(160, 45, 65, 0.62) 42%, rgba(18, 15, 23, 0.96) 100%)',
                    }}
                    className="absolute top-full right-0 mt-3 w-[360px] md:w-[380px] border-none backdrop-blur-3xl rounded-2xl p-6 sm:p-8 z-50 flex flex-col text-left shadow-[0_25px_60px_rgba(0,0,0,0.5)] max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-none"
                  >
                    {renderMenuContent(true)}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* MOBILE HEADER (Bottom Center Fixed Button & Bottom-to-Top Pop-Up Card) */}
        <div className="sm:hidden pointer-events-auto">
          {/* Mobile Backdrop */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="fixed inset-0 z-40 bg-black/15 backdrop-blur-sm cursor-default"
                onClick={() => setIsMenuOpen(false)}
              />
            )}
          </AnimatePresence>

          {/* Mobile Menu Card (Smooth clipPath unfold & staggered content) */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, clipPath: 'inset(100% 0% 0% 0% round 1rem)', y: 8 }}
                animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 1rem)', y: 0 }}
                exit={{ opacity: 0, clipPath: 'inset(100% 0% 0% 0% round 1rem)', y: 8 }}
                transition={{ type: "spring", stiffness: 220, damping: 22, mass: 1.0 }}
                style={{
                  transformOrigin: 'bottom center',
                  background: isLightSection
                    ? 'linear-gradient(165deg, rgba(240, 92, 109, 0.94) 0%, rgba(160, 45, 65, 0.96) 42%, rgba(18, 15, 23, 0.99) 100%)'
                    : 'linear-gradient(165deg, rgba(240, 92, 109, 0.48) 0%, rgba(160, 45, 65, 0.68) 42%, rgba(18, 15, 23, 0.96) 100%)',
                }}
                className="fixed bottom-24 left-4 right-4 max-w-[480px] min-w-[340px] mx-auto border-none backdrop-blur-2xl rounded-2xl p-6 z-50 flex flex-col text-left shadow-[0_20px_50px_rgba(0,0,0,0.6)] max-h-[72vh] overflow-y-auto scrollbar-none"
              >
                {renderMenuContent(false)}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Bottom Fixed Menu Button (acting as Close button on the button itself when open) */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`group flex items-center justify-center px-6 py-3 rounded-full backdrop-blur-2xl border cursor-pointer select-none transition-all duration-500 ${
                isMenuOpen
                  ? 'bg-[#120F17] border-[#F05C6D]/40 text-[#F05C6D] shadow-none'
                  : isLightSection
                    ? 'bg-[#120F17] border-[#F05C6D]/40 text-white shadow-[0_2px_6px_rgba(34,31,40,0.04),0_8px_24px_rgba(34,31,40,0.07)] hover:border-[#F05C6D] hover:bg-[#F05C6D]'
                    : 'bg-[#120F17]/85 border-white/20 text-white shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:border-[#F05C6D] hover:bg-[#F05C6D]'
              }`}
            >
              <span className="text-sm font-ppmori [font-variant-caps:small-caps] lowercase tracking-widest font-bold min-w-[40px] text-center overflow-hidden inline-flex items-center justify-center h-4 relative">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isMenuOpen ? 'close' : 'menu'}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.86, 0, 0.07, 1] }}
                    className="block"
                  >
                    {isMenuOpen ? 'close' : 'menu'}
                  </motion.span>
                </AnimatePresence>
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Header;
