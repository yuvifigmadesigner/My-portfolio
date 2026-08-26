import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
const SideRays = React.lazy(() => import('../../components/SideRays'));
const OptionWheel = React.lazy(() => import('../../components/OptionWheel'));
import ShinyText from '../../components/ShinyText';
const roles = [
  'Product Designer',
  'UX/UI Designer',
  'Interactive Designer',
  'UX Researcher',
  'Agentic AI',
  'System Thinker'
];
const quotes = [
  "“I care deeply about how products are built, how teams work, and how thoughtful design creates momentum”",
  "“I solve problems by exploring every path, iterating relentlessly, and keeping only what works.”"
];
const toolIcons = [
  { name: 'Figma', src: '/figma/frame_2x.webp' },
  { name: 'Miro', src: '/miro/miro_2x.webp' },
  { name: 'Gemini', src: '/gemini/frame_2x.webp' },
  { name: 'Claude', src: '/claude/claude_2x.webp' },
  { name: 'Antigravity', src: '/antigravity/antigravity_2x.webp' },
  { name: 'Paper.design', src: '/paper/paper_2x.webp' },
  { name: 'Linear', src: '/linear/linear_2x.webp' },
  { name: 'Pinterest', src: '/pinterest/pinterest_2x.webp' },
];
const MainContent: React.FC = () => {
  const [is4K, setIs4K] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileQuoteIndex, setMobileQuoteIndex] = useState(0);
  const [toolIconIndex, setToolIconIndex] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      setIs4K(window.innerWidth >= 2000);
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      setMobileQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const iconTimer = setInterval(() => {
      setToolIconIndex((prev) => (prev + 1) % toolIcons.length);
    }, 3800);
    return () => clearInterval(iconTimer);
  }, []);
  const [isSoundOn, setIsSoundOn] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('isSoundOn');
      return saved !== null ? JSON.parse(saved) : false;
    }
    return false;
  });
  const [isAvatarTapped, setIsAvatarTapped] = useState(false);
  useEffect(() => {
    localStorage.setItem('isSoundOn', JSON.stringify(isSoundOn));
  }, [isSoundOn]);
  return (
    <main className="relative w-full h-[100dvh] overflow-hidden bg-[#120F17]">
      <motion.div 
        className="absolute inset-0 pointer-events-none z-50 mix-blend-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3.5, ease: 'easeOut' }}
      >
        <SideRays
          speed={2.5}
          rayColor1="#F4EFE6"
          rayColor2="#F05C6D"
          intensity={1.3}
          spread={1.2}
          origin="top-right"
          tilt={0}
          saturation={1.5}
          blend={0.75}
          falloff={2.3}
          opacity={1.0}
        />
      </motion.div>
      <div 
        className="absolute top-0 left-0 w-[55vw] h-[55vh] max-w-[900px] max-h-[900px] pointer-events-none z-10 overflow-hidden"
        style={{
          maskImage: 'radial-gradient(circle at 0% 0%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at 0% 0%, black 20%, transparent 80%)',
        }}
      >
        <div 
          className="w-full h-full bg-[#F05C6D] opacity-70 sm:opacity-35"
          style={{
            maskImage: 'url(/pattern.png)',
            WebkitMaskImage: 'url(/pattern.png)',
            maskSize: 'cover',
            WebkitMaskSize: 'cover',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'top left',
            WebkitMaskPosition: 'top left',
            transform: 'scaleX(-1)',
          }}
        />
      </div>
      <div 
        className="absolute -bottom-[12vh] sm:bottom-0 right-0 w-[55vw] h-[55vh] max-w-[900px] max-h-[900px] pointer-events-none z-10 overflow-hidden"
        style={{
          maskImage: 'radial-gradient(circle at 100% 100%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at 100% 100%, black 20%, transparent 80%)',
        }}
      >
        <div 
          className="w-full h-full bg-[#F05C6D] opacity-70 sm:opacity-35"
          style={{
            maskImage: 'url(/pattern.png)',
            WebkitMaskImage: 'url(/pattern.png)',
            maskSize: 'cover',
            WebkitMaskSize: 'cover',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'bottom right',
            WebkitMaskPosition: 'bottom right',
            transform: 'scaleY(-1)',
          }}
        />
      </div>
      <div className="absolute inset-0 w-full max-w-[1440px] min-[2000px]:max-w-[2000px] mx-auto pointer-events-none">
      {/* Mobile Quote moved to center block */}
      <motion.div 
        className="absolute top-4 sm:top-6 left-[56px] sm:left-[72px] md:left-[88px] max-w-[320px] sm:max-w-[360px] md:max-w-[400px] lg:max-w-[285px] xl:max-w-[400px] min-[2000px]:max-w-[500px] z-20 pointer-events-auto hidden sm:block"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative flex flex-col items-stretch">
          <img
            src="/quote-top.webp"
            alt="Quote Frame Top"
            className="w-full h-auto object-contain select-none pointer-events-none -mb-6 sm:-mb-7 md:-mb-8"
          />
          <div className="px-12 py-0 text-center">
            <ShinyText
              text="“I care deeply about how products are built, how teams work, and how thoughtful design creates momentum”"
              speed={3.0}
              color="rgba(255, 255, 255, 0.75)"
              shineColor="#FFFFFF"
              spread={100}
              className="font-editorial text-[16px] lg:text-[13px] xl:text-[16px] min-[2000px]:text-[22px] leading-[1.5] tracking-wide drop-shadow-[0_2px_10px_rgba(255,255,255,0.25)] text-center"
            />
          </div>
          <img
            src="/quote-bottom.webp"
            alt="Quote Frame Bottom"
            className="w-full h-auto object-contain select-none pointer-events-none -mt-6 sm:-mt-7 md:-mt-8"
          />
        </div>
      </motion.div>
      <motion.div 
        className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 md:right-12 max-w-[320px] sm:max-w-[360px] md:max-w-[400px] lg:max-w-[285px] xl:max-w-[400px] min-[2000px]:max-w-[500px] z-20 pointer-events-auto hidden sm:block"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative flex flex-col items-stretch">
          <img
            src="/quote-top.webp"
            alt="Quote Frame Top"
            className="w-full h-auto object-contain select-none pointer-events-none -mb-6 sm:-mb-7 md:-mb-8"
          />
          <div className="px-12 py-0 text-center">
            <ShinyText
              text="“I solve problems by exploring every path, iterating relentlessly, and keeping only what works.”"
              speed={3.3}
              color="rgba(255, 255, 255, 0.75)"
              shineColor="#FFFFFF"
              spread={100}
              className="font-editorial text-[16px] lg:text-[13px] xl:text-[16px] min-[2000px]:text-[22px] leading-[1.5] tracking-wide drop-shadow-[0_2px_10px_rgba(255,255,255,0.25)] text-center"
            />
          </div>
          <img
            src="/quote-bottom.webp"
            alt="Quote Frame Bottom"
            className="w-full h-auto object-contain select-none pointer-events-none -mt-6 sm:-mt-7 md:-mt-8"
          />
        </div>
      </motion.div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-[32px] sm:gap-0 pointer-events-auto w-full">
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 2.0, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <div 
            onClick={() => {
              if (isMobile) {
                setIsAvatarTapped(!isAvatarTapped);
              }
            }}
            className="group relative w-[112px] h-[112px] lg:w-[85px] lg:h-[85px] xl:w-[112px] xl:h-[112px] min-[2000px]:w-[150px] min-[2000px]:h-[150px] flex items-end justify-center cursor-pointer select-none"
          >
          <div 
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full overflow-hidden transition-all duration-300 ease-out shadow-md ${
              isMobile && isAvatarTapped
                ? 'w-[128px] h-[128px]'
                : 'w-[112px] h-[112px] lg:w-[85px] lg:h-[85px] xl:w-[112px] xl:h-[112px]'
            } group-hover:w-[128px] group-hover:h-[128px] lg:group-hover:w-[98px] lg:group-hover:h-[98px] xl:group-hover:w-[128px] xl:group-hover:h-[128px] min-[2000px]:w-[150px] min-[2000px]:h-[150px] min-[2000px]:group-hover:w-[170px] min-[2000px]:group-hover:h-[170px]`}
            style={{ background: 'linear-gradient(180deg, #F05C6D 0%, #8A353F 100%)' }}
          >
            <img
              src="/dp.webp"
              alt="Yuvraj Gupta"
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 max-w-none object-cover object-top transition-all duration-300 ease-out ${
                isMobile && isAvatarTapped
                  ? 'w-[150px] h-[150px]'
                  : 'w-[112px] h-[112px] lg:w-[85px] lg:h-[85px] xl:w-[112px] xl:h-[112px]'
              } group-hover:w-[150px] group-hover:h-[150px] lg:group-hover:w-[115px] lg:group-hover:h-[115px] xl:group-hover:w-[150px] xl:group-hover:h-[150px] min-[2000px]:w-[150px] min-[2000px]:h-[150px] min-[2000px]:group-hover:w-[210px] min-[2000px]:group-hover:h-[210px]`}
            />
          </div>
          <img
            src="/dp.webp"
            alt="Yuvraj Gupta Popout"
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 max-w-none object-cover object-top transition-all duration-300 ease-out pointer-events-none ${
              isMobile && isAvatarTapped
                ? 'w-[150px] h-[150px]'
                : 'w-[112px] h-[112px] lg:w-[85px] lg:h-[85px] xl:w-[112px] xl:h-[112px]'
            } group-hover:w-[150px] group-hover:h-[150px] lg:group-hover:w-[115px] lg:group-hover:h-[115px] xl:group-hover:w-[150px] xl:group-hover:h-[150px] min-[2000px]:w-[150px] min-[2000px]:h-[150px] min-[2000px]:group-hover:w-[210px] min-[2000px]:group-hover:h-[210px]`}
            style={{
              clipPath: 'inset(0% 0% 35% 0%)',
            }}
          />
        </div>
        <div 
          onClick={() => {
            if (isMobile) {
              setIsAvatarTapped(!isAvatarTapped);
            }
          }}
          className="mt-[11px] relative inline-block select-none cursor-pointer"
        >
          <div className="absolute -top-3.5 left-0 bottom-0 w-[2px] bg-[#F05C6D] z-10">
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#F05C6D] shadow-sm" />
          </div>
          <div className="px-5 py-2.5 lg:px-3.5 lg:py-1.5 xl:px-5 xl:py-2.5 min-[2000px]:px-8 min-[2000px]:py-4 bg-[#F05C6D]/20 backdrop-blur-md text-white font-ppmori font-extrabold text-[24px] lg:text-[17px] xl:text-[24px] min-[2000px]:text-[32px] tracking-wide whitespace-nowrap leading-none relative z-0">
            Yuvraj Gupta
          </div>
          <div className="absolute top-0 right-0 -bottom-3.5 w-[2px] bg-[#F05C6D] z-10">
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#F05C6D] shadow-sm" />
          </div>
        </div>
        <div className="sm:hidden mt-[32px] w-fit max-w-[92vw] px-4 py-1 font-ppmori font-semibold text-[18px] text-[#F05C6D] tracking-wide flex items-center justify-center gap-4 select-none whitespace-nowrap bg-transparent border-none shadow-none">
          <span className="whitespace-nowrap">Product Designer</span>
          <span className="w-[1px] h-5 bg-[#F05C6D]/35 inline-block shrink-0" />
          <span className="whitespace-nowrap">UX/UI Designer</span>
        </div>
        </motion.div>
        
        {/* Mobile Quote */}
        <div className="sm:hidden w-full min-w-[360px] max-w-[480px] px-4 z-20 pointer-events-none text-center flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div 
              key={mobileQuoteIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="px-[36px]"
            >
              <ShinyText
                text={quotes[mobileQuoteIndex]}
                speed={3.0}
                color="rgba(255, 255, 255, 0.75)"
                shineColor="#FFFFFF"
                spread={100}
                className="font-editorial text-[14px] leading-[1.55] tracking-wide text-center drop-shadow-sm"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Icons */}
        <motion.div 
          className="sm:hidden mt-[28px] w-[150px] z-20 pointer-events-none flex flex-col items-center select-none relative"
          initial={{ opacity: 0, scale: 0.85, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 h-8 flex items-center justify-center pointer-events-none whitespace-nowrap">
            <AnimatePresence mode="wait">
              <motion.div
                key={toolIconIndex}
                initial={{ opacity: 0, y: 18, scale: 0.6 }}
                animate={{
                  opacity: [0, 1, 1, 1, 1, 0],
                  y: [18, 0, 0, 0, 0, 18],
                  scale: [0.6, 1, 1, 1, 1, 0.6],
                }}
                transition={{
                  duration: 3.5,
                  times: [0, 0.18, 0.35, 0.78, 0.88, 1],
                  ease: "easeInOut",
                }}
                className="flex items-center justify-center bg-transparent select-none relative"
              >
                <motion.img
                  src={toolIcons[toolIconIndex].src}
                  alt={toolIcons[toolIconIndex].name}
                  animate={{
                    x: [0, 0, -8, -8, 0, 0],
                  }}
                  transition={{
                    duration: 3.5,
                    times: [0, 0.18, 0.35, 0.78, 0.88, 1],
                    ease: "easeInOut",
                  }}
                  className="w-5 h-5 object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] select-none pointer-events-none shrink-0"
                />
                <motion.span
                  animate={{
                    opacity: [0, 0, 1, 1, 0, 0],
                    x: [-4, -4, 0, 0, -4, -4],
                  }}
                  transition={{
                    duration: 3.5,
                    times: [0, 0.28, 0.42, 0.72, 0.82, 1],
                    ease: "easeInOut",
                  }}
                  className="font-stardos font-bold text-[14px] text-white tracking-wide whitespace-nowrap inline-block drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] ml-0.5"
                >
                  {toolIcons[toolIconIndex].name}
                </motion.span>
              </motion.div>
            </AnimatePresence>
          </div>
          <div 
            className="w-[130px] h-[20px] opacity-85 blur-md rounded-t-full pointer-events-none -mb-2.5"
            style={{
              background: 'radial-gradient(ellipse at bottom, rgba(240, 92, 109, 0.95) 0%, rgba(240, 92, 109, 0.25) 60%, transparent 100%)',
            }}
          />
          <div 
            className="w-[130px] h-[1.5px] rounded-full relative z-10"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(240,92,109,0.5) 20%, #FFFFFF 50%, rgba(240,92,109,0.5) 80%, transparent 100%)',
            }}
          />
          <div 
            className="w-[130px] h-[30px] opacity-100 blur-md rounded-b-full pointer-events-none -mt-1"
            style={{
              background: 'radial-gradient(ellipse at top, rgba(0, 0, 0, 0.98) 0%, rgba(10, 8, 14, 0.88) 55%, rgba(18, 15, 23, 0.4) 85%, transparent 100%)',
            }}
          />
        </motion.div>
      </div>
      {/* Mobile Icons moved to center block */}
      <motion.div 
        className="absolute bottom-2 left-4 sm:bottom-4 sm:left-8 md:left-12 z-20 hidden sm:flex items-center gap-3 sm:gap-4 pointer-events-auto"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          onClick={() => {
            const nextState = !isSoundOn;
            setIsSoundOn(nextState);
          }}
          className="w-10 h-10 min-[2000px]:w-14 min-[2000px]:h-14 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-white/70 hover:text-white transition-all flex items-center justify-center shadow-lg backdrop-blur-md shrink-0"
          title={isSoundOn ? "Mute tick sound" : "Enable tick sound"}
          aria-label="Toggle audio"
        >
          {isSoundOn ? (
            <Volume2 size={is4K ? 32 : 24} className="text-[#F05C6D]" />
          ) : (
            <VolumeX size={is4K ? 32 : 24} className="text-white/40" />
          )}
        </button>
        <div className="w-[220px] sm:w-[260px] lg:w-[190px] xl:w-[260px] min-[2000px]:w-[360px] h-[240px] sm:h-[280px] lg:h-[200px] xl:h-[280px] min-[2000px]:h-[380px]">
          <OptionWheel
            items={roles}
            defaultSelected={0}
            textColor="rgba(255, 255, 255, 0.7)"
            activeColor="#F05C6D"
            side="left"
            fontSize={is4K ? 1.6 : 1.2}
            spacing={is4K ? 2.2 : 1.6}
            curve={1}
            tilt={6}
            blur={1.5}
            fade={0.25}
            smoothing={200}
            inset={24}
            loop={true}
            draggable={true}
            soundEnabled={isSoundOn && !isMobile}
            autoPlayInterval={1000}
            className="font-editorial"
          />
        </div>
      </motion.div>
      <motion.div 
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 hidden sm:flex flex-col items-center pointer-events-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.0, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <style>{`
          @keyframes mouseScrollLine {
            0% {
              transform: translateY(0);
              opacity: 0.9;
            }
            60% {
              transform: translateY(10px);
              opacity: 1;
            }
            100% {
              transform: translateY(16px);
              opacity: 0;
            }
          }
        `}</style>
        <div className="w-5 h-8 sm:w-6 sm:h-10 rounded-full border-[1.5px] border-white/40 flex justify-center pt-2 relative overflow-hidden backdrop-blur-xs shadow-sm">
          <div className="w-[2px] h-2 rounded-full bg-[#F05C6D] animate-[mouseScrollLine_1.8s_ease-in-out_infinite]" />
        </div>
      </motion.div>
      </div>
    </main>
  );
};
export default MainContent;
