import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SplitText = ({ children, className = '', showLine = false }: { children: string, className?: string, showLine?: boolean }) => {
  return (
    <div className={`relative ${className}`}>
      {showLine && (
        <div 
          className="animated-line absolute left-0 top-0 bottom-0 w-1 bg-[#F05C6D]/30 origin-top" 
          style={{ transform: 'scaleY(0)' }} 
        />
      )}
      {children.split(/(\s+)/).map((word, index) => {
        if (word.match(/^\s+$/)) return <span key={index}>{word}</span>;
        return (
          <span key={index} className="word inline-block opacity-10" style={{ filter: 'blur(8px)', willChange: 'opacity, filter' }}>
            {word}
          </span>
        );
      })}
    </div>
  );
};

const MindsetShiftsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const words = sectionRef.current.querySelectorAll('.word');

    // Create the pinned timeline with tight scroll duration
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,
        scrub: 1, // Smooth scrubbing
        start: 'top top',
        end: '+=160%', // Reduced scroll duration to eliminate empty space
      }
    });

    // Build sequential timeline
    const mainHeaderWords = sectionRef.current.querySelectorAll('.main-header .word');
    tl.to(mainHeaderWords, { opacity: 1, filter: 'blur(0px)', stagger: 0.08, ease: 'none' });

    const blocks = sectionRef.current.querySelectorAll('.point-block');
    blocks.forEach((block) => {
      const titleWords = block.querySelectorAll('.title-text .word');
      const line = block.querySelector('.animated-line');
      const descWords = block.querySelectorAll('.desc-text .word');

      tl.to(titleWords, { opacity: 1, filter: 'blur(0px)', stagger: 0.08, ease: 'none' });
      
      if (line) {
        // Line grows down concurrently with the description words revealing
        tl.to(line, { scaleY: 1, duration: descWords.length * 0.08, ease: 'none' }, ">-0.1");
      }
      
      tl.to(descWords, { opacity: 1, filter: 'blur(0px)', stagger: 0.08, ease: 'none' }, "<");
    });

    // Subtle container parallax keeping items balanced on screen
    gsap.fromTo(containerRef.current,
      { y: "5vh" },
      {
        y: "-15vh",
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=160%',
          scrub: true
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-[#120F17] text-white flex flex-col items-center justify-center min-h-[80vh] py-12">
      <div ref={containerRef} className="max-w-4xl w-full px-6 md:px-12 lg:px-24 flex flex-col gap-10 md:gap-16">
        <SplitText className="main-header text-center text-2xl md:text-4xl lg:text-5xl font-bold text-[#F05C6D] mb-4 md:mb-6 font-stardos leading-tight">
          How AI Changed & How I Think as a Designer
        </SplitText>

        <div className="flex flex-col gap-10 md:gap-16">
          <div className="point-block flex flex-col gap-2 md:gap-3">
            <SplitText className="title-text font-ppmori text-lg md:text-2xl text-white/90 font-medium">
              1. Designing for Probabilistic UI
            </SplitText>
            <SplitText showLine={true} className="desc-text font-ppmori text-xs sm:text-sm md:text-base text-white/60 font-normal pl-4 md:pl-5 ml-[10px] md:ml-[14px]">
              Users express what they want to achieve, and the interface adapts layout or actions on the fly.
            </SplitText>
          </div>

          <div className="point-block flex flex-col gap-2 md:gap-3">
            <SplitText className="title-text font-ppmori text-lg md:text-2xl text-white/90 font-medium">
              2. Trust Architecture Over Visual Polish
            </SplitText>
            <SplitText showLine={true} className="desc-text font-ppmori text-xs sm:text-sm md:text-base text-white/60 font-normal pl-4 md:pl-5 ml-[10px] md:ml-[14px]">
              Providing clear provenance determining when an app acts autonomously vs. when it asks for user confirmation.
            </SplitText>
          </div>

          <div className="point-block flex flex-col gap-2 md:gap-3">
            <SplitText className="title-text font-ppmori text-lg md:text-2xl text-white/90 font-medium">
              3. Curation and "Taste" as Primary Skills
            </SplitText>
            <SplitText showLine={true} className="desc-text font-ppmori text-xs sm:text-sm md:text-base text-white/60 font-normal pl-4 md:pl-5 ml-[10px] md:ml-[14px]">
              The ability to evaluate micro-interactions, visual hierarchy, domain context, and subtle cognitive friction that evaluating which interface drives conversion, retention, and actual user metrics
            </SplitText>
          </div>

          <div className="point-block flex flex-col gap-2 md:gap-3">
            <SplitText className="title-text font-ppmori text-lg md:text-2xl text-white/90 font-medium">
              4. Directing Full-Stack Prototyping
            </SplitText>
            <SplitText showLine={true} className="desc-text font-ppmori text-xs sm:text-sm md:text-base text-white/60 font-normal pl-4 md:pl-5 ml-[10px] md:ml-[14px]">
              When anyone can ship software quickly, the most valuable skill isn't making screens, it's knowing which screens deserve to exist.
            </SplitText>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MindsetShiftsSection;
