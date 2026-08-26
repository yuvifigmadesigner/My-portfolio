import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, ArrowUpRight, Copy, Check } from 'lucide-react';

interface ContactCardProps {
  label: string;
  value: string;
  href: string;
  icon: LucideIcon;
  color?: string;
  index: number;
}

const ContactCard: React.FC<ContactCardProps> = ({ label, value, href, icon: Icon, color = '#F05C6D', index }) => {
  const [copied, setCopied] = React.useState(false);

  const fallbackCopy = () => {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
    document.body.removeChild(textarea);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.warn('Clipboard API failed, trying fallback:', err);
          fallbackCopy();
        });
    } else {
      fallbackCopy();
    }
  };

  const isCopyable = label === 'Email' || label === 'Phone';

  const cardContent = (
    <div className="flex flex-col gap-1 text-left group py-3.5 cursor-pointer select-none border-b border-white/10 last:border-b-0 hover:border-[#F05C6D]/50 transition-colors duration-300 w-full">
      {/* Editorial Label Row */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-stardos uppercase tracking-widest text-white/40 group-hover:text-[#F05C6D] transition-colors duration-300">
          / {label}
        </span>
      </div>

      {/* Value & Action Row */}
      <div className="flex items-center justify-between gap-3 pt-0.5">
        <span className="text-sm sm:text-base md:text-lg font-ppmori font-medium text-white/90 group-hover:text-white transition-colors truncate">
          {value}
        </span>
        <span className="text-white/40 group-hover:text-[#F05C6D] transition-all duration-300 shrink-0 flex items-center">
          {isCopyable ? (
            copied ? (
              <motion.span
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.2 }}
                className="text-[12px] font-ppmori tracking-wider text-[#F05C6D] font-bold flex items-center gap-1"
              >
                <Check size={12} className="text-[#F05C6D]" />
                <span>Copied</span>
              </motion.span>
            ) : (
              <Copy size={13} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            )
          ) : (
            <ArrowUpRight size={15} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          )}
        </span>
      </div>
    </div>
  );

  const sharedProps = {
    initial: { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 },
    className: "w-full block"
  };

  if (isCopyable) {
    return (
      <motion.div
        {...sharedProps}
        onClick={handleCopy}
      >
        {cardContent}
      </motion.div>
    );
  }

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...sharedProps}
    >
      {cardContent}
    </motion.a>
  );
};

export default ContactCard;

