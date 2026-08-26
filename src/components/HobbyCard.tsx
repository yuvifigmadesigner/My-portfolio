import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, ArrowUpRight } from 'lucide-react';

interface HobbyCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    onClick?: () => void;
    actionLabel?: string;
    index: number;
}

const HobbyCard: React.FC<HobbyCardProps> = ({ title, description, icon: Icon, onClick, actionLabel, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
      onClick={onClick}
      className={`group relative p-6 rounded-3xl text-left transition-all duration-300 w-full ${
        onClick ? 'cursor-pointer hover:scale-[1.02]' : ''
      }`}
    >
      {/* Background Glass Card Layer (Always Active) */}
      <div 
        className="absolute inset-0 rounded-3xl border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.4)] pointer-events-none"
        style={{
          background: 'linear-gradient(rgba(18, 13, 10, 0.35), rgba(18, 13, 10, 0.35)) padding-box, linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 50%, rgba(255, 255, 255, 0) 100%) border-box',
        }}
      />

      {/* Content Layer (z-10 to stay on top of absolute background) */}
      <div className="relative z-10 border-l-2 border-[#F05C6D] pl-4 transition-colors duration-300">
        
        {/* Icon & Action Row */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-[#F05C6D]">
            <Icon size={24} strokeWidth={1.5} />
          </div>
          {onClick && (
            <div className="w-8 h-8 rounded-full flex items-center justify-center border border-white/20 text-white transition-all duration-300 group-hover:rotate-45">
              <ArrowUpRight size={14} />
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-stardos font-semibold text-white mb-2 group-hover:text-[#F05C6D] transition-colors tracking-wide">
          {title}
        </h3>
        
        {/* Detailed Description (Always Active/Visible) */}
        <div className="opacity-100 mt-2 whitespace-normal">
          <p className="text-sm text-white/60 leading-relaxed font-ppmori">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default HobbyCard;
