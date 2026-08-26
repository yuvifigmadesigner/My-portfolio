import React from 'react';
import { ArrowUpRight, Fingerprint, Sparkles } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants';
import LightTunnel from './LightTunnel';

import FeedbackBox from './FeedbackBox';

const Footer: React.FC = () => {
  const resumeLink = SOCIAL_LINKS.find(link => link.label.toLowerCase() === 'resume')?.href || '/Resume.pdf';

  return (
    <footer className="w-full bg-[#120F17] pt-10 pb-12 px-6 md:px-12 z-20 relative select-none mt-12 sm:mt-16 overflow-hidden min-h-[350px] sm:min-h-[370px]">
      {/* Background LightTunnel Effect with Progressive Radial Blur (Edges to Center) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Base LightTunnel Layer */}
        <div className="absolute inset-0 w-full h-full opacity-45">
          <LightTunnel
            cableColor="#c73f6f"
            pulseColor="#642338"
            tunnelColor="#ffffff"
            tunnelOpacity={0}
            speed={0.08}
            flowDirection="outward"
            pulseSpeed={1.2}
            pulseLength={0.2}
            pulseBlend={1}
            pulseWidth={1}
            cableCount={20}
            thickness={0.25}
            rimWidth={0.06}
            waviness={0.3}
            sway={0.5}
            size={1.0}
            centerX={0.0}
            centerY={0.0}
            glow={0.6}
            fadeNear={0.5}
            fadeFar={2}
            brightness={0.8}
            colorVariance={true}
            grain={true}
            grainIntensity={0.03}
            opacity={0.85}
            mouseInteraction={true}
            mouseStrength={0.08}
          />
        </div>

        {/* Progressive Blur Layer: Heavy Blur at Outer Edges -> Clear at Center */}
        <div 
          className="absolute inset-0 w-full h-full backdrop-blur-[14px] pointer-events-none scale-105"
          style={{
            maskImage: 'radial-gradient(ellipse at center, transparent 15%, rgba(0,0,0,0.4) 50%, black 90%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 15%, rgba(0,0,0,0.4) 50%, black 90%)'
          }}
        />

        {/* Harsh Top-Edge Blur & Gradient Fade for Ultra-Smooth Animation Dissolve (Compact Height) */}
        <div className="absolute top-0 left-0 right-0 h-12 backdrop-blur-[20px] pointer-events-none z-10 scale-105 [mask-image:linear-gradient(to_bottom,black_0%,rgba(0,0,0,0.6)_50%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,rgba(0,0,0,0.6)_50%,transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#120F17] via-[#120F17]/70 to-transparent pointer-events-none z-10" />
      </div>

      {/* Hidden SVG Gradient for Hard Seed Color Icon Shine Effect */}
      <svg width="0" height="0" className="absolute w-0 h-0 pointer-events-none opacity-0 overflow-hidden">
        <defs>
          <linearGradient id="iconHardSeedShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F05C6D">
              <animate attributeName="stop-color" values="#F05C6D; #FF8595; #F05C6D" dur="2.5s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#FF6B7D">
              <animate attributeName="stop-color" values="#FF6B7D; #F05C6D; #FF6B7D" dur="2.5s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#F05C6D">
              <animate attributeName="stop-color" values="#F05C6D; #FF8595; #F05C6D" dur="2.5s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>
      </svg>

      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-5 text-center relative z-10">
        
        {/* Centered Statement */}
        <div className="flex items-center justify-center text-center">
          <div className="font-ppmori text-xs flex items-center justify-center gap-1.5 flex-wrap text-center">
            <span className="bg-gradient-to-r from-white/40 via-white to-white/40 bg-[length:200%_100%] bg-clip-text text-transparent animate-[pulse_3s_ease-in-out_infinite]">
              The vision of engineering is
            </span>
            <Fingerprint 
              size={14} 
              style={{ stroke: 'url(#iconHardSeedShine)' }}
              className="inline-block shrink-0 stroke-[2.2] transition-all duration-300" 
            />
            <span className="bg-gradient-to-r from-white via-white/80 to-white bg-[length:200%_100%] bg-clip-text text-transparent font-medium animate-[pulse_3s_ease-in-out_infinite]">
              Human
            </span>
            <span className="text-white/40">
              +
            </span>
            <Sparkles 
              size={14} 
              style={{ stroke: 'url(#iconHardSeedShine)' }}
              className="inline-block shrink-0 stroke-[2.2] transition-all duration-300" 
            />
            <span className="bg-gradient-to-r from-white via-white/80 to-white bg-[length:200%_100%] bg-clip-text text-transparent font-medium animate-[pulse_3s_ease-in-out_infinite]">
              AI
            </span>
          </div>
        </div>

        {/* Centered Download Resume CTA */}
        <div className="flex items-center justify-center">
          <a
            href={resumeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group h-10 px-6 hover:px-4 rounded-full bg-[#F05C6D] text-[#120F17] font-ppmori text-xs uppercase tracking-wider font-bold cursor-pointer inline-flex items-center justify-center text-center leading-none overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            <div className="flex items-center relative overflow-hidden -mt-[1px]">
              {/* "DOWNLOAD " collapsing on hover */}
              <span className="inline-block max-w-[80px] opacity-100 group-hover:max-w-0 group-hover:opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden whitespace-nowrap">
                DOWNLOAD&nbsp;
              </span>

              {/* "RESUME" text */}
              <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                RESUME
              </span>

              {/* Arrow entering from bottom right */}
              <div className="relative w-0 group-hover:w-4 group-hover:ml-1 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden flex items-center justify-center">
                <ArrowUpRight 
                  size={14} 
                  className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0 stroke-[2.5]" 
                />
              </div>
            </div>
          </a>
        </div>

        {/* Feedback Box below CTA */}
        <FeedbackBox />

      </div>
    </footer>
  );
};

export default Footer;
