import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const timelineData = [
  {
    name: 'NIT Goa',
    subtitle: 'Institutional Website (CCC Project)',
    year: 'June 2023 – Feb 2024',
    bullets: [
      'I co-led a design & dev team to build the official website v2.0.',
      'I modernized the UI system & visual architecture for high scalability.',
      'I collaborated with engineering on QA to ensure 100% design fidelity.',
    ],
  },
  {
    name: 'Frover Agency',
    subtitle: 'Digital Product Studio',
    year: 'Nov 2024 – Feb 2025',
    bullets: [
      'I crafted tailored layouts & information architecture for client brands.',
      'I optimized high-converting landing pages to boost engagement & CTAs.',
    ],
  },
  {
    name: 'Zefyron',
    subtitle: 'Venture Investment & Startup Platform',
    year: 'Feb 2026 – July 2026',
    bullets: [
      'I revamped 5 core web pages and partnered with devs for clean execution.',
      'I streamlined web & mobile user journeys to eliminate friction.',
      'I integrated AI-driven tools to simplify workflow for investors & startups.',
    ],
  },
];

const viewportConfig = { once: true, margin: '0px 0px -20% 0px', amount: 0.1 };

const Timeline: React.FC = () => {
  // The mobile timeline's spine is drawn by scroll position rather than a
  // one-shot reveal, so it fills in as you move down the entries.
  const mobileRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: mobileRef,
    offset: ['start 0.85', 'end 0.7'],
  });
  const spineScale = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  return (
    <section className="relative w-full min-h-[750px] bg-[#F8F6F0] flex items-center justify-center select-none overflow-hidden py-12 md:py-0">
      {/* DESKTOP PATTERNS (Bottom Left & Bottom Right) */}
      <div className="hidden md:block">
        {/* Bottom Left Pattern */}
        <div 
          className="absolute bottom-0 left-0 w-[25vw] h-[25vh] max-w-[320px] max-h-[320px] pointer-events-none z-0 overflow-hidden"
          style={{
            maskImage: 'radial-gradient(circle at 0% 100%, black 60%, transparent 95%)',
            WebkitMaskImage: 'radial-gradient(circle at 0% 100%, black 60%, transparent 95%)',
          }}
        >
          <div 
            className="w-full h-full bg-[#FF3355] opacity-100"
            style={{
              maskImage: 'url(/pattern.png)',
              WebkitMaskImage: 'url(/pattern.png)',
              maskSize: '100% 100%',
              WebkitMaskSize: '100% 100%',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskPosition: 'bottom left',
              WebkitMaskPosition: 'bottom left',
              transform: 'scaleY(-1)',
              filter: 'brightness(1.2) saturate(1.3)',
            }}
          />
        </div>

        {/* Bottom Right Pattern */}
        <div 
          className="absolute bottom-0 right-0 w-[25vw] h-[25vh] max-w-[320px] max-h-[320px] pointer-events-none z-0 overflow-hidden"
          style={{
            maskImage: 'radial-gradient(circle at 100% 100%, black 60%, transparent 95%)',
            WebkitMaskImage: 'radial-gradient(circle at 100% 100%, black 60%, transparent 95%)',
          }}
        >
          <div 
            className="w-full h-full bg-[#FF3355] opacity-100"
            style={{
              maskImage: 'url(/pattern.png)',
              WebkitMaskImage: 'url(/pattern.png)',
              maskSize: '100% 100%',
              WebkitMaskSize: '100% 100%',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskPosition: 'bottom right',
              WebkitMaskPosition: 'bottom right',
              transform: 'scale(-1)',
              filter: 'brightness(1.2) saturate(1.3)',
            }}
          />
        </div>
      </div>
      {/* DESKTOP VIEW (md: flex, horizontal timeline) */}
      <div className="hidden md:block relative w-full max-w-[1440px] min-[2000px]:max-w-[2000px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24">
        <div className="relative w-full h-[2px]">
          {/* Main horizontal line with right fade-out - Animates left to right */}
          <motion.div
            className="absolute inset-0 w-full h-full"
            style={{
              background: 'linear-gradient(to right, #F05C6D 0%, #F05C6D 80%, transparent 100%)',
              originX: 0,
            }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={viewportConfig}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Start circle (left end) - Perfectly centered on main line */}
          <motion.div
            className="absolute -left-[6px] -top-[5px] w-3 h-3 rounded-full bg-[#F05C6D] z-10"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={viewportConfig}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          />

          {/* Timeline markers */}
          {timelineData.map((item, i) => {
            const positions = [10, 36, 62];
            const position = positions[i];
            const isTop = i % 2 === 0;

            const lineDelay = 0.9 + i * 1.1;
            const circleDelay = lineDelay + 0.45;
            const textDelay = lineDelay + 0.6;

            return (
              <div
                key={item.name}
                className="absolute flex flex-col items-center"
                style={{ left: `${position}%` }}
              >
                {isTop ? (
                  /* Top marker */
                  <div className="absolute bottom-0 flex flex-col items-center">
                    <div className="relative">
                      {/* Circle dot - pops in at tip of line */}
                      <motion.div
                        className="w-[10px] h-[10px] rounded-full bg-[#F05C6D]"
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={viewportConfig}
                        transition={{ duration: 0.45, delay: circleDelay, ease: [0.175, 0.885, 0.32, 1.275] }}
                      />

                      {/* Text content - slides out from left to right */}
                      <motion.div
                        className="absolute left-[18px] top-0 text-left"
                        initial={{ opacity: 0, x: -24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={viewportConfig}
                        transition={{ duration: 0.8, delay: textDelay, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="font-ppmori text-[16px] sm:text-[17px] min-[2000px]:text-[22px] text-[#0f0a06] tracking-wider whitespace-nowrap font-bold">
                            {item.name}
                          </span>
                          <span className="text-[#0f0a06]/25 font-light">|</span>
                          <span className="font-ppmori text-[12px] sm:text-[13px] min-[2000px]:text-[16px] text-[#0f0a06]/40 tracking-wide whitespace-nowrap">
                            {item.subtitle}
                          </span>
                        </div>
                        <div
                          className="inline-flex items-center pl-4 pr-5 py-1 mt-[5px] rounded-l-[100px] rounded-r-[3px] select-none"
                          style={{
                            background: 'linear-gradient(to right, rgba(240, 92, 109, 0.32) 0%, rgba(240, 92, 109, 0.12) 60%, #F8F6F0 100%)',
                          }}
                        >
                          <span className="font-editorial text-[11px] sm:text-[12px] min-[2000px]:text-[14px] text-[#F05C6D] tracking-wider whitespace-nowrap font-medium">
                            {item.year}
                          </span>
                        </div>
                        <ul className="mt-[16px] space-y-[6px] pl-4 w-[260px] sm:w-[320px] md:w-[370px] lg:w-[420px] xl:w-[450px] min-[2000px]:w-[540px]">
                          {item.bullets.map((b, j) => (
                            <li key={j} className="flex items-start gap-1.5 font-ppmori text-[12px] sm:text-[13px] min-[2000px]:text-[15px] text-[#0f0a06]/50 leading-[1.55] whitespace-normal">
                              <span className="text-[#F05C6D] font-bold shrink-0 select-none">–</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>

                    {/* Vertical line - grows UPWARDS from main line (originY: 1) */}
                    <motion.div
                      className="w-[1.5px] h-[250px]"
                      style={{
                        background: 'linear-gradient(to bottom, #F05C6D 0%, rgba(240,92,109,0.15) 100%)',
                        originY: 1,
                      }}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={viewportConfig}
                      transition={{ duration: 0.8, delay: lineDelay, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                ) : (
                  /* Bottom marker */
                  <div className="absolute top-0 flex flex-col items-center">
                    {/* Vertical line - grows DOWNWARDS from main line (originY: 0) */}
                    <motion.div
                      className="w-[1.5px] h-[90px]"
                      style={{
                        background: 'linear-gradient(to bottom, rgba(240,92,109,0.15) 0%, #F05C6D 100%)',
                        originY: 0,
                      }}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={viewportConfig}
                      transition={{ duration: 0.8, delay: lineDelay, ease: [0.16, 1, 0.3, 1] }}
                    />

                    <div className="relative">
                      {/* Circle dot - pops in at tip of line */}
                      <motion.div
                        className="w-[10px] h-[10px] rounded-full bg-[#F05C6D]"
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={viewportConfig}
                        transition={{ duration: 0.45, delay: circleDelay, ease: [0.175, 0.885, 0.32, 1.275] }}
                      />

                      {/* Text content - slides out from left to right */}
                      <motion.div
                        className="absolute left-[18px] top-0 text-left"
                        initial={{ opacity: 0, x: -24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={viewportConfig}
                        transition={{ duration: 0.8, delay: textDelay, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="font-ppmori text-[16px] sm:text-[17px] min-[2000px]:text-[22px] text-[#0f0a06] tracking-wider whitespace-nowrap font-bold">
                            {item.name}
                          </span>
                          <span className="text-[#0f0a06]/25 font-light">|</span>
                          <span className="font-ppmori text-[12px] sm:text-[13px] min-[2000px]:text-[16px] text-[#0f0a06]/40 tracking-wide whitespace-nowrap">
                            {item.subtitle}
                          </span>
                        </div>
                        <div
                          className="inline-flex items-center pl-4 pr-5 py-1 mt-[5px] rounded-l-[100px] rounded-r-[3px] select-none"
                          style={{
                            background: 'linear-gradient(to right, rgba(240, 92, 109, 0.32) 0%, rgba(240, 92, 109, 0.12) 60%, #F8F6F0 100%)',
                          }}
                        >
                          <span className="font-editorial text-[11px] sm:text-[12px] min-[2000px]:text-[14px] text-[#F05C6D] tracking-wider whitespace-nowrap font-medium">
                            {item.year}
                          </span>
                        </div>
                        <ul className="mt-[16px] space-y-[6px] pl-4 w-[260px] sm:w-[320px] md:w-[380px] lg:w-[440px] xl:w-[480px] min-[2000px]:w-[580px]">
                          {item.bullets.map((b, j) => (
                            <li key={j} className="flex items-start gap-1.5 font-ppmori text-[12px] sm:text-[13px] min-[2000px]:text-[15px] text-[#0f0a06]/50 leading-[1.55] whitespace-normal">
                              <span className="text-[#F05C6D] font-bold shrink-0 select-none">–</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* MOBILE VIEW (< md breakpoint, vertical timeline with left/right alternating elements) */}
      <div ref={mobileRef} className="block md:hidden relative w-full px-3 pt-6 pb-16">
        <div className="relative w-full flex flex-col items-center">
          {/* Section Header Badge: EXPERIENCE (Mobile View Only, styled same as SELECTED WORKS)
              Revealed on scroll, matching the rest of the mobile timeline. */}
          <motion.div
            className="relative inline-block select-none mb-24 z-20"
            initial={{ opacity: 0, y: -16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="absolute -top-3.5 left-0 bottom-0 w-[2px] bg-[#F05C6D] z-10">
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#F05C6D] shadow-sm" />
            </div>
            <h2 className="px-5 py-2.5 bg-[#F05C6D]/20 backdrop-blur-md text-[#0f0a06] font-stardos text-[20px] sm:text-[24px] font-bold tracking-[0.1em] uppercase whitespace-nowrap leading-none relative z-0">
              EXPERIENCE
            </h2>
            <div className="absolute top-0 right-0 -bottom-3.5 w-[2px] bg-[#F05C6D] z-10">
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#F05C6D] shadow-sm" />
            </div>
          </motion.div>

          {/* Main vertical line running top to bottom */}
          <motion.div
            className="absolute top-[112px] bottom-0 left-[calc(50%-1px)] w-[2px]"
            style={{
              background: 'linear-gradient(to bottom, #F05C6D 0%, #F05C6D 85%, transparent 100%)',
              originY: 0,
              scaleY: spineScale,
            }}
          />

          {/* Start circle (top end) */}
          <motion.div
            className="absolute top-[106px] left-[calc(50%-6px)] w-3 h-3 rounded-full bg-[#F05C6D] z-10"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={viewportConfig}
            transition={{ duration: 0.3, delay: 0.05, ease: 'easeOut' }}
          />

          {/* Timeline markers alternating left & right (Flipped bottom-to-top order for mobile) */}
          <div className="w-full flex flex-col space-y-24 pt-16 pb-16">
            {[...timelineData].reverse().map((item, i) => {
              const isLeft = i % 2 === 0;
              const lineDelay = 0.2 + i * 0.25;
              const circleDelay = lineDelay + 0.15;
              const textDelay = lineDelay + 0.25;

              return (
                <div key={item.name} className="relative w-full flex flex-col">
                  {/* Horizontal stem line extending from outer content edge to center line */}
                  <motion.div
                    className={`absolute top-0 h-[1.5px] w-[calc(50%-16px)] ${
                      isLeft ? 'right-1/2' : 'left-1/2'
                    }`}
                    style={{
                      background: isLeft
                        ? 'linear-gradient(to left, rgba(240,92,109,0.15) 0%, #F05C6D 100%)'
                        : 'linear-gradient(to right, rgba(240,92,109,0.15) 0%, #F05C6D 100%)',
                      originX: isLeft ? 1 : 0,
                    }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={viewportConfig}
                    transition={{ duration: 0.3, delay: lineDelay, ease: 'easeOut' }}
                  >
                    {/* Circle dot at outer tip of stem line - 100% centered on tip without translate conflicts */}
                    <motion.div
                      className="absolute -top-[4.25px] w-2.5 h-2.5 rounded-full bg-[#F05C6D] z-10"
                      style={{
                        left: isLeft ? '-5px' : 'auto',
                        right: isLeft ? 'auto' : '-5px',
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={viewportConfig}
                      transition={{ duration: 0.25, delay: circleDelay, ease: 'easeOut' }}
                    />
                  </motion.div>

                  {/* Text content placed BELOW the element line */}
                  {isLeft ? (
                    /* Left side content */
                    <div className="w-[calc(50%-16px)] pl-[11px] pr-2 text-left flex flex-col items-start ml-0 mr-auto pt-4">
                      <motion.div
                        className="w-full flex flex-col items-start"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={viewportConfig}
                        transition={{ duration: 0.45, delay: textDelay, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <span className="font-ppmori text-[15px] sm:text-[16px] text-[#0f0a06] font-bold">
                          {item.name}
                        </span>
                        <span className="font-ppmori text-[12px] sm:text-[13px] text-[#0f0a06]/40 mt-0.5">
                          {item.subtitle}
                        </span>
                        <div
                          className="inline-flex items-center pl-4 pr-3 py-1.5 sm:py-0.5 mt-1.5 rounded-l-[100px] rounded-r-[3px] select-none"
                          style={{
                            background: 'linear-gradient(to right, rgba(240, 92, 109, 0.32) 0%, rgba(240, 92, 109, 0.12) 60%, #F8F6F0 100%)',
                          }}
                        >
                          <span className="font-editorial text-[10px] sm:text-[11px] text-[#F05C6D] tracking-wider font-medium">
                            {item.year}
                          </span>
                        </div>
                        <ul className="mt-2.5 space-y-1.5 text-left pl-4">
                          {item.bullets.map((b, j) => (
                            <li key={j} className="flex items-start gap-1 font-ppmori text-[11px] sm:text-[12px] text-[#0f0a06]/50 leading-relaxed">
                              <span className="text-[#F05C6D] font-bold shrink-0">–</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>
                  ) : (
                    /* Right side content */
                    <div className="w-[calc(50%-16px)] pl-2 text-left flex flex-col items-start ml-auto mr-0 pt-4">
                      <motion.div
                        className="w-full flex flex-col items-start"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={viewportConfig}
                        transition={{ duration: 0.45, delay: textDelay, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <span className="font-ppmori text-[15px] sm:text-[16px] text-[#0f0a06] font-bold">
                          {item.name}
                        </span>
                        <span className="font-ppmori text-[12px] sm:text-[13px] text-[#0f0a06]/40 mt-0.5">
                          {item.subtitle}
                        </span>
                        <div
                          className="inline-flex items-center pl-4 pr-3 py-1.5 sm:py-0.5 mt-1.5 rounded-l-[100px] rounded-r-[3px] select-none"
                          style={{
                            background: 'linear-gradient(to right, rgba(240, 92, 109, 0.32) 0%, rgba(240, 92, 109, 0.12) 60%, #F8F6F0 100%)',
                          }}
                        >
                          <span className="font-editorial text-[10px] sm:text-[11px] text-[#F05C6D] tracking-wider font-medium">
                            {item.year}
                          </span>
                        </div>
                        <ul className="mt-2.5 space-y-1.5 text-left pl-4">
                          {item.bullets.map((b, j) => (
                            <li key={j} className="flex items-start gap-1 font-ppmori text-[11px] sm:text-[12px] text-[#0f0a06]/50 leading-relaxed">
                              <span className="text-[#F05C6D] font-bold shrink-0">–</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
