import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SIDE_PROJECTS } from '../../constants';
import { ArrowUpRight, Quote, Calendar, User, Mail, Plus, Heart, Sparkles, FolderDot, FlaskConical, X } from 'lucide-react';
import StarBorder from '../../components/StarBorder';
import MindsetShiftsSection from '../../components/MindsetShiftsSection';
const ProjectModal = React.lazy(() => import('../../components/ProjectModal'));
// Testimonials Data
const TESTIMONIALS: {
  name: string;
  role: string;
  text: string;
  image?: string;
  video?: string;
}[] = [
  {
    name: "Siddharth Manjrekar",
    role: "Startup Founder of Frover",
    text: "Yuvraj is the ultimate 'get-it-done' person. He’s incredibly adaptable, brings a warm, friendly energy to every conversation, and tackles every task with genuine passion. You can always count on him to deliver.",
    image: "/Siddharth.jpg"
  },
  {
    name: "Venkat Grandhi",
    role: "Techinal Staff, NITGOA",
    text: "A fantastic leader and the kind of senior every team wants. Yuvraj leads with a solution-first mindset, a friendly approach, and a constant eagerness to learn and grow alongside everyone else.",
    image: "/Venkat.jpg"
  },
  {
    name: "Zaid Shaik",
    role: "VCBay Design Head",
    text: "Yuvraj’s passion and dedication are truly contagious. He has an incredible natural taste for visual design, learns shockingly fast, and speaks dev language so fluently that collaborating with engineering was seamless. Having him on the team was a total worth it.",
    image: "/zaid.png"
  },
  {
    name: "You?",
    role: "Future Collaborator",
    text: "I would be truly grateful to work with you. Let's build something extraordinary together, and this space will be waiting to feature your success story.",
    video: "/you profile.webm"
  }
];
const RepelWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}> = ({ children, className = '', onClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 640 || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // Triggers repel when cursor gets within 60px of the icon's current screen position
      if (dist < 60 && dist > 0) {
        const angle = Math.atan2(dy, dx);
        const pushStep = 60;
        setPosition((prev) => {
          let pushX = -Math.cos(angle) * pushStep;
          let pushY = -Math.sin(angle) * pushStep;
          // If mouse approaches from top (pushing downwards), deflect push horizontally
          if (pushY > 0) {
            pushY = 0;
            pushX = dx >= 0 ? -pushStep : pushStep;
          }
          const nextX = prev.x + pushX;
          const nextY = prev.y + pushY;
          // Strict section canvas bounds (X: ±260px, Y: -160px top limit to 0px bottom baseline)
          const clampedX = Math.max(-260, Math.min(260, nextX));
          const clampedY = Math.max(-160, Math.min(0, nextY));
          return { x: clampedX, y: clampedY };
        });
        // Clear and restart the 1-second reset timer on every interaction
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
        resetTimerRef.current = setTimeout(() => {
          setPosition({ x: 0, y: 0 });
        }, 1000);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);
  return (
    <motion.div
      ref={containerRef}
      className={className}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
    >
      {children}
    </motion.div>
  );
};
const Work: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  const [activeTestimonial, setActiveTestimonial] = React.useState(0);
  const [isTestimonialHovered, setIsTestimonialHovered] = React.useState(false);

  React.useEffect(() => {
    if (isTestimonialHovered) return;
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isTestimonialHovered]);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalProjects, setModalProjects] = React.useState<any[]>([]);
  const [isSwapped, setIsSwapped] = React.useState(false);
  const FOLDER_PAGES = [
    { id: 'cap', title: 'College Access Program (CAP)', image: '/CAP/cap.webp', alt: 'CAP UX' },
    { id: 'cargo', title: 'Fleet Logistics by VCBAY (Cargo)', image: '/cargo/cargo_4x.webp', alt: 'Cargo UX' },
    { id: 'sqm', title: 'Supplier Query Management (SQM)', image: '/SQM/sqm.webp', alt: 'SQM UX' },
  ] as const;
  type FolderPageType = typeof FOLDER_PAGES[number]['id'];

  const [isFolderOpen, setIsFolderOpen] = React.useState(false);
  const [folderPage, setFolderPage] = React.useState<FolderPageType>('cap');
  const [slidingOutPage, setSlidingOutPage] = React.useState<FolderPageType | null>(null);
  const handleFolderPageClick = () => {
    if (slidingOutPage !== null) return;
    const currentIndex = FOLDER_PAGES.findIndex((p) => p.id === folderPage);
    const nextIndex = (currentIndex + 1) % FOLDER_PAGES.length;
    const outgoing = folderPage;
    const incoming = FOLDER_PAGES[nextIndex].id;

    setSlidingOutPage(outgoing);
    // Phase 1: Top page slides out to left edge for 700ms
    setTimeout(() => {
      // Phase 2: At left edge, swap top page state (incoming top page stays at x: 0)
      setFolderPage(incoming);
      // Phase 3: Outgoing page slides back underneath incoming top page (700ms)
      setTimeout(() => {
        setSlidingOutPage(null);
      }, 700);
    }, 700);
  };

  const [isVcbayFolderOpen, setIsVcbayFolderOpen] = React.useState(false);

  React.useEffect(() => {
    if (isFolderOpen || isVcbayFolderOpen) {
      document.body.classList.add('folder-modal-active');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('folder-modal-active');
      document.body.style.overflow = '';
    }
    return () => {
      document.body.classList.remove('folder-modal-active');
      document.body.style.overflow = '';
    };
  }, [isFolderOpen, isVcbayFolderOpen]);
  const handleOpenPopup = (projects: any[]) => {
    if (!projects || projects.length === 0) return;
    setModalProjects(projects);
    setIsModalOpen(true);
  };
  const project1 = SIDE_PROJECTS[0]; // Award winning
  const project2 = SIDE_PROJECTS[1]; // Zef UX
  const project3 = SIDE_PROJECTS[2]; // Assignment
  const project4 = SIDE_PROJECTS[3]; // Practice
  return (
    <>
      <section id="work-light-section" className="w-full bg-[#F8F6F0] h-[850px] sm:h-[780px] lg:h-[620px] xl:h-[780px] relative overflow-hidden flex justify-center items-center select-none">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 inline-block select-none z-10">
          <div className="absolute -top-3.5 left-0 bottom-0 w-[2px] bg-[#F05C6D] z-10">
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#F05C6D] shadow-sm" />
          </div>
          <h2 className="px-5 py-2.5 lg:px-3.5 lg:py-1.5 xl:px-5 xl:py-2.5 min-[2000px]:px-8 min-[2000px]:py-4 bg-[#F05C6D]/20 backdrop-blur-md text-[#0f0a06] font-stardos text-[24px] lg:text-[17px] xl:text-[24px] min-[2000px]:text-[32px] font-bold tracking-[0.1em] uppercase whitespace-nowrap leading-none relative z-0">
            SELECTED WORKS
          </h2>
          <div className="absolute top-0 right-0 -bottom-3.5 w-[2px] bg-[#F05C6D] z-10">
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#F05C6D] shadow-sm" />
          </div>
        </div>
        <div 
          className="absolute top-0 left-0 w-[25vw] h-[25vh] max-w-[320px] max-h-[320px] pointer-events-none z-0 overflow-hidden"
          style={{
            maskImage: 'radial-gradient(circle at 0% 0%, black 60%, transparent 95%)',
            WebkitMaskImage: 'radial-gradient(circle at 0% 0%, black 60%, transparent 95%)',
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
              maskPosition: 'top left',
              WebkitMaskPosition: 'top left',
              filter: 'brightness(1.2) saturate(1.3)',
            }}
          />
        </div>
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
        <div 
          className="absolute top-0 right-0 w-[25vw] h-[25vh] max-w-[320px] max-h-[320px] pointer-events-none z-0 overflow-hidden"
          style={{
            maskImage: 'radial-gradient(circle at 100% 0%, black 60%, transparent 95%)',
            WebkitMaskImage: 'radial-gradient(circle at 100% 0%, black 60%, transparent 95%)',
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
              maskPosition: 'top right',
              WebkitMaskPosition: 'top right',
              transform: 'scaleX(-1)',
              filter: 'brightness(1.2) saturate(1.3)',
            }}
          />
        </div>
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
        <div className="sm:hidden relative w-full max-w-[480px] min-w-[340px] h-[780px] mx-auto overflow-hidden select-none">
          <motion.div 
            className="absolute pointer-events-auto cursor-pointer"
            animate={isSwapped ? {
              top: 150, left: '50%', x: [-65, -117, 30, -123], width: [130, 185, 232, 280], height: [184, 260, 277.8, 295.62], rotate: [-15, 0, 0, 0], zIndex: 20
            } : {
              top: 475, left: '100%', x: -65, width: 130, height: 184, rotate: -15, zIndex: 5
            }}
            transition={{ 
              duration: isSwapped ? 1.8 : 0.4, ease: [0.16, 1, 0.3, 1],
              x: { times: isSwapped ? [0, 0.5, 0.75, 1] : undefined, ease: "easeInOut", duration: isSwapped ? 1.8 : 0.4 },
              rotate: { times: isSwapped ? [0, 0.5, 0.75, 1] : undefined, ease: "easeInOut", duration: isSwapped ? 1.8 : 0.4 },
              width: { times: isSwapped ? [0, 0.5, 0.75, 1] : undefined, ease: "easeInOut", duration: isSwapped ? 1.8 : 0.4 },
              height: { times: isSwapped ? [0, 0.5, 0.75, 1] : undefined, ease: "easeInOut", duration: isSwapped ? 1.8 : 0.4 },
              zIndex: { delay: isSwapped ? 1.35 : 0 }
            }}
            onClick={(e) => {
              if (isSwapped) {
                e.stopPropagation();
                setIsVcbayFolderOpen(true);
              } else {
                setIsSwapped(!isSwapped);
              }
            }}
          >
            <img loading="lazy" decoding="async" src="/vcbay/vacbay_4x.webp" alt="VCBay Page" className="w-full h-full object-contain" />
          </motion.div>
          <motion.div 
            className="absolute pointer-events-auto cursor-pointer"
            animate={!isSwapped ? {
              top: 150, left: '50%', x: [-65, -117, 30, -123], width: [130, 185, 232, 280], height: [184, 260, 277.8, 295.62], rotate: [-15, 0, 0, 0], zIndex: 20
            } : {
              top: 475, left: '100%', x: -65, width: 130, height: 184, rotate: -15, zIndex: 5
            }}
            transition={{ 
              duration: !isSwapped ? 1.8 : 0.4, ease: [0.16, 1, 0.3, 1],
              x: { times: !isSwapped ? [0, 0.5, 0.75, 1] : undefined, ease: "easeInOut", duration: !isSwapped ? 1.8 : 0.4 },
              rotate: { times: !isSwapped ? [0, 0.5, 0.75, 1] : undefined, ease: "easeInOut", duration: !isSwapped ? 1.8 : 0.4 },
              width: { times: !isSwapped ? [0, 0.5, 0.75, 1] : undefined, ease: "easeInOut", duration: !isSwapped ? 1.8 : 0.4 },
              height: { times: !isSwapped ? [0, 0.5, 0.75, 1] : undefined, ease: "easeInOut", duration: !isSwapped ? 1.8 : 0.4 },
              zIndex: { delay: !isSwapped ? 1.35 : 0 }
            }}
            onClick={(e) => {
              if (!isSwapped) {
                e.stopPropagation();
                project1.isIframe ? window.open(project1.link, '_blank') : handleOpenPopup(project1.subProjects || []);
              } else {
                setIsSwapped(!isSwapped);
              }
            }}
          >
            <img loading="lazy" decoding="async" src="/uxhack/uxhack_4x.webp" alt="UXHack Page" className="w-full h-full object-contain" />
          </motion.div>
          <motion.div 
            className="absolute pointer-events-auto cursor-pointer"
            animate={isSwapped ? {
              top: 165, left: 58, x: [-65, 20, 20, 0], width: [130, 185, 185, 185], height: [184, 260, 260, 260], rotate: [-15, 0, 0, -14.9], zIndex: 10
            } : {
              top: 475, left: '100%', x: -65, width: 130, height: 184, rotate: -15, zIndex: 10
            }}
            transition={{ 
              duration: isSwapped ? 1.8 : 1.0, ease: [0.16, 1, 0.3, 1],
              x: { times: isSwapped ? [0, 0.5, 0.75, 1] : undefined, ease: "easeInOut", duration: isSwapped ? 1.8 : 1.0 },
              rotate: { times: isSwapped ? [0, 0.5, 0.75, 1] : undefined, ease: "easeInOut", duration: isSwapped ? 1.8 : 1.0 },
              width: { times: isSwapped ? [0, 0.5, 0.75, 1] : undefined, ease: "easeInOut", duration: isSwapped ? 1.8 : 1.0 },
              height: { times: isSwapped ? [0, 0.5, 0.75, 1] : undefined, ease: "easeInOut", duration: isSwapped ? 1.8 : 1.0 }
            }}
            onClick={() => setIsSwapped(!isSwapped)}
          >
            <img loading="lazy" decoding="async" src="/vcbay/vcbay_cover_4x.webp" alt="VCBay Cover" className="w-full h-full object-contain" />
          </motion.div>
          <motion.div 
            className="absolute pointer-events-auto cursor-pointer"
            animate={!isSwapped ? {
              top: 165, left: 58, x: [-65, 20, 20, 0], width: [130, 185, 185, 185], height: [184, 260, 260, 260], rotate: [-15, 0, 0, -14.9], zIndex: 10
            } : {
              top: 475, left: '100%', x: -65, width: 130, height: 184, rotate: -15, zIndex: 10
            }}
            transition={{ 
              duration: !isSwapped ? 1.8 : 1.0, ease: [0.16, 1, 0.3, 1],
              x: { times: !isSwapped ? [0, 0.5, 0.75, 1] : undefined, ease: "easeInOut", duration: !isSwapped ? 1.8 : 1.0 },
              rotate: { times: !isSwapped ? [0, 0.5, 0.75, 1] : undefined, ease: "easeInOut", duration: !isSwapped ? 1.8 : 1.0 },
              width: { times: !isSwapped ? [0, 0.5, 0.75, 1] : undefined, ease: "easeInOut", duration: !isSwapped ? 1.8 : 1.0 },
              height: { times: !isSwapped ? [0, 0.5, 0.75, 1] : undefined, ease: "easeInOut", duration: !isSwapped ? 1.8 : 1.0 }
            }}
            onClick={() => setIsSwapped(!isSwapped)}
          >
            <img loading="lazy" decoding="async" src="/uxhack/uxhack_cover_4x.webp" alt="UXHack Cover" className="w-full h-full object-contain" />
          </motion.div>
          <motion.div 
            className="absolute bottom-8 -left-2 w-[155px] h-[200px] z-30 pointer-events-auto cursor-pointer origin-bottom-left"
            style={{ rotate: 15 }}
            onClick={() => setIsFolderOpen(true)}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <img loading="lazy" decoding="async" 
              src="/file_folder/file-folder.png" 
              alt="Assignments Projects" 
              className="w-full h-full object-contain drop-shadow-xl" 
            />
          </motion.div>
        </div>
        <div className="hidden sm:block relative w-full max-w-[1440px] min-[2000px]:max-w-[2000px] h-full pointer-events-none">
          <motion.div 
            className="absolute pointer-events-auto cursor-pointer group z-20"
            animate={isSwapped ? {
              left: '50%',
              x: '-50%',
              top: '20%',
              bottom: 'auto',
            } : {
              left: 'calc(100% - 72px)',
              x: '-100%',
              top: 'auto',
              bottom: '65px',
            }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={`relative transition-all duration-500 ${isSwapped ? 'w-[225px] h-[318px] lg:w-[175px] lg:h-[248px] xl:w-[225px] xl:h-[318px]' : 'w-[200px] h-[283px] lg:w-[150px] lg:h-[212px] xl:w-[200px] xl:h-[283px]'}`}>
              <motion.img 
                src="/award-back/award-back_4x.webp" 
                alt="Award Background" 
                className={`object-contain absolute top-0 left-0 drop-shadow-lg z-0 origin-bottom-left transition-all duration-500 ${isSwapped ? 'w-[225px] h-[318px] lg:w-[175px] lg:h-[248px] xl:w-[225px] xl:h-[318px]' : 'w-[200px] h-[283px] lg:w-[150px] lg:h-[212px] xl:w-[200px] xl:h-[283px]'} ${!isSwapped ? 'group-hover:-rotate-[5deg] group-hover:-translate-x-3.5 group-hover:-translate-y-3.5' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSwapped(!isSwapped);
                }}
              />
              <motion.img 
                src={isSwapped ? "/ux-award/ux-award_4x.webp" : "/ux-award/frame_714_4x.webp"} 
                alt="UX Award" 
                className={`object-contain absolute z-10 drop-shadow-2xl origin-bottom-left transition-all duration-500 ${isSwapped ? 'w-[225px] h-[318px] lg:w-[175px] lg:h-[248px] xl:w-[225px] xl:h-[318px]' : 'w-[200px] h-[283px] lg:w-[150px] lg:h-[212px] xl:w-[200px] xl:h-[283px]'} ${!isSwapped ? 'group-hover:rotate-[17deg] group-hover:translate-x-2' : ''}`}
                animate={isSwapped ? {
                  rotate: 0,
                  left: 10,
                  top: 10
                } : {
                  rotate: 10,
                  left: 20,
                  top: -3
                }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isSwapped) {
                    // Card 1 is at Right position -> NEXT animation
                    setIsSwapped(true);
                  } else {
                    // Card 1 is at Center position
                    // Check if click was on the left half ("View") vs right half ("Back")
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    if (clickX < rect.width / 2) {
                      // Clicked "View" side -> Open site / redirect if link exists
                      if (project1.link) {
                        project1.isIframe ? window.open(project1.link, '_blank') : handleOpenPopup(project1.subProjects || []);
                      }
                    } else {
                      // Clicked "Back" side -> BACK animation
                      setIsSwapped(false);
                    }
                  }
                }}
              />
            </div>
          </motion.div>
          <motion.div 
            className="absolute pointer-events-auto cursor-pointer group z-30"
            animate={isSwapped ? {
              left: 'calc(100% - 72px)',
              x: '-100%',
              top: 'auto',
              bottom: '65px',
            } : {
              left: '50%',
              x: '-50%',
              top: '20%',
              bottom: 'auto',
            }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={`relative transition-all duration-500 ${!isSwapped ? 'w-[225px] h-[318px] lg:w-[175px] lg:h-[248px] xl:w-[225px] xl:h-[318px]' : 'w-[200px] h-[283px] lg:w-[150px] lg:h-[212px] xl:w-[200px] xl:h-[283px]'}`}>
              <motion.img 
                src="/zef-cover/frame_713_4x.webp" 
                alt="Zef Back" 
                className={`object-contain absolute top-0 left-0 drop-shadow-lg z-0 origin-bottom-left transition-all duration-500 ${!isSwapped ? 'w-[225px] h-[318px] lg:w-[175px] lg:h-[248px] xl:w-[225px] xl:h-[318px]' : 'w-[200px] h-[283px] lg:w-[150px] lg:h-[212px] xl:w-[200px] xl:h-[283px]'} ${isSwapped ? 'group-hover:-rotate-[5deg] group-hover:-translate-x-3.5 group-hover:-translate-y-3.5' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSwapped(!isSwapped);
                }}
              />
              <motion.img 
                src={isSwapped ? "/zef/frame_719_4x.webp" : "/zef/frame_714_4x.webp"} 
                alt="Zef UX" 
                className={`object-contain absolute z-10 drop-shadow-2xl origin-bottom-left transition-all duration-500 ${!isSwapped ? 'w-[225px] h-[318px] lg:w-[175px] lg:h-[248px] xl:w-[225px] xl:h-[318px]' : 'w-[200px] h-[283px] lg:w-[150px] lg:h-[212px] xl:w-[200px] xl:h-[283px]'} ${isSwapped ? 'group-hover:rotate-[17deg] group-hover:translate-x-2' : ''}`}
                animate={isSwapped ? {
                  rotate: 10,
                  left: 20,
                  top: -3
                } : {
                  rotate: 0,
                  left: 10,
                  top: 10
                }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isSwapped) {
                    // Card 2 is at Right position -> NEXT animation
                    setIsSwapped(false);
                  } else {
                    // Card 2 is at Center position
                    // Check if click was on the left half ("View") vs right half ("Back")
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    if (clickX < rect.width / 2) {
                      // Clicked "View" side -> Trigger VCBay open folder modal
                      setIsVcbayFolderOpen(true);
                    } else {
                      // Clicked "Back" side -> BACK animation
                      setIsSwapped(true);
                    }
                  }
                }}
              />
            </div>
          </motion.div>
          <RepelWrapper 
            className="hidden sm:block absolute left-[calc(50%-5px)] -translate-x-1/2 bottom-[7%] md:bottom-[8%] pointer-events-auto cursor-pointer group z-40"
            onClick={() => project4.isIframe ? window.open(project4.link, '_blank') : handleOpenPopup(project4.subProjects || [])}
          >
            <img loading="lazy" decoding="async" src="/folder/folder_4x.webp" alt="Practice Folder" className="w-[55px] sm:w-[65px] md:w-[72px] lg:w-[50px] xl:w-[72px] transition-transform duration-500 ease-out group-hover:scale-110 drop-shadow-lg" />
          </RepelWrapper>
          <motion.div 
            className="absolute -left-2 sm:left-0 md:left-2 lg:left-0 xl:left-2 right-auto bottom-12 sm:bottom-16 md:bottom-20 lg:bottom-12 xl:bottom-16 pointer-events-auto cursor-pointer group z-50 origin-bottom-left"
            style={{ rotate: 15 }}
            onClick={() => setIsFolderOpen(true)}
            whileHover={{ y: -10 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          >
            <img loading="lazy" decoding="async" src="/file_folder/file-folder.png" alt="Assignments" className="w-[210px] sm:w-[230px] md:w-[245px] lg:w-[175px] xl:w-[245px] drop-shadow-2xl" />
          </motion.div>
        </div>
      </section>
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isFolderOpen && (
            <motion.div 
              key="folder-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-6 md:p-12 overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                onClick={() => setIsFolderOpen(false)}
                className="absolute inset-0 bg-black/15 backdrop-blur-sm cursor-pointer"
              />
              <button 
                onClick={() => setIsFolderOpen(false)}
                className="absolute bottom-16 left-1/2 -translate-x-1/2 z-[210] w-10 h-10 rounded-full bg-white text-black flex sm:hidden items-center justify-center hover:rotate-90 active:scale-95 transition-all duration-300 ease-out border border-black/10 cursor-pointer shadow-lg"
                title="Close Folder"
              >
                <X size={20} />
              </button>
              <motion.div
                className="relative z-10 flex items-center justify-center pointer-events-auto select-none w-full"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, y: 90, scale: 0.9, filter: 'blur(16px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 60, scale: 0.94, filter: 'blur(12px)' }}
                transition={{
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                  filter: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.35, ease: 'easeOut' },
                }}
              >
                <div 
                  className="relative w-[92vw] sm:w-[88vw] max-w-[940px] transition-transform duration-500 mx-auto drop-shadow-[0_25px_60px_rgba(0,0,0,0.6)]"
                >
                  <img loading="lazy" decoding="async" 
                    src="/file-folderopen.svg" 
                    alt="Folder Open" 
                    className="w-full h-auto object-contain pointer-events-none drop-shadow-2xl" 
                  />
                  <button 
                    onClick={() => setIsFolderOpen(false)}
                    className="hidden sm:flex absolute top-[calc(45%+2px)] right-[0.5%] md:top-[calc(46%+2px)] md:right-[1%] z-50 w-9 h-9 rounded-full bg-white text-black items-center justify-center hover:rotate-90 active:scale-95 transition-all duration-300 ease-out border border-black/10 cursor-pointer shadow-md"
                    title="Close Folder"
                  >
                    <X size={18} />
                  </button>
                  <div className="absolute left-[43.5%] top-[5.2%] w-[43.5%] h-[89.5%] z-20">
                    {FOLDER_PAGES.map((page, index) => {
                      const isOutgoing = slidingOutPage === page.id;
                      const isSlidingPhase1 = slidingOutPage !== null && slidingOutPage === folderPage;
                      const currentIndex = FOLDER_PAGES.findIndex((p) => p.id === folderPage);
                      const stackPosition = (index - currentIndex + FOLDER_PAGES.length) % FOLDER_PAGES.length;

                      let zIndex = 10;
                      let x = '0%';
                      let rotate = 0;

                      if (isOutgoing) {
                        if (isSlidingPhase1) {
                          // Phase 1: On top, sliding out to left
                          zIndex = 30;
                          x = '-98%';
                          rotate = -4;
                        } else {
                          // Phase 2: Underneath, sliding back in to center
                          zIndex = 10;
                          x = '0%';
                          rotate = 0;
                        }
                      } else if (page.id === folderPage) {
                        // Current active top page
                        zIndex = 20;
                        x = '0%';
                        rotate = 0;
                      } else {
                        // Background pages
                        zIndex = stackPosition === 1 ? 15 : 10;
                        x = '0%';
                        rotate = 0;
                      }

                      return (
                        <motion.div
                          key={page.id}
                          className="absolute inset-0 w-full h-full flex flex-col justify-between origin-top-left"
                          initial={false}
                          animate={{ zIndex, x, rotate, opacity: 1 }}
                          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <div 
                            className="w-full h-full overflow-hidden rounded-[6px] shadow-md border border-black/10 relative cursor-pointer bg-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect = e.currentTarget.getBoundingClientRect();
                              const clickX = e.clientX - rect.left;
                              if (page.id === 'cap' && clickX < rect.width * 0.45) {
                                setIsFolderOpen(false);
                                if (onNavigate) {
                                  onNavigate('cap');
                                } else {
                                  window.location.hash = '#cap';
                                }
                              } else {
                                handleFolderPageClick();
                              }
                            }}
                          >
                            <img loading="lazy" decoding="async" 
                              src={page.image} 
                              alt={page.alt} 
                              className="w-full h-full object-fill bg-white" 
                            />
                            {page.id === 'cap' && page.id === folderPage && (
                              <>
                                <div
                                  className="absolute bottom-0 left-0 w-[45%] h-[25%] z-30 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsFolderOpen(false);
                                    if (onNavigate) {
                                      onNavigate('cap');
                                    } else {
                                      window.location.hash = '#cap';
                                    }
                                  }}
                                  title="View College Access Program Case Study"
                                />
                                <div
                                  className="absolute bottom-0 right-0 w-[55%] h-[25%] z-30 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFolderPageClick();
                                  }}
                                  title="Next Project in Folder"
                                />
                              </>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>,
        document.body
      )}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isVcbayFolderOpen && (
            <motion.div 
              key="vcbay-folder-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-6 md:p-12 overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                onClick={() => setIsVcbayFolderOpen(false)}
                className="absolute inset-0 bg-black/15 backdrop-blur-sm cursor-pointer"
              />
              <button 
                onClick={() => setIsVcbayFolderOpen(false)}
                className="absolute bottom-16 left-1/2 -translate-x-1/2 z-[210] w-10 h-10 rounded-full bg-white text-black flex sm:hidden items-center justify-center hover:rotate-90 active:scale-95 transition-all duration-300 ease-out border border-black/10 cursor-pointer shadow-lg"
                title="Close Folder"
              >
                <X size={20} />
              </button>
              <motion.div
                className="relative z-10 flex items-center justify-center pointer-events-auto select-none w-full"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, y: 90, scale: 0.9, filter: 'blur(16px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 60, scale: 0.94, filter: 'blur(12px)' }}
                transition={{
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                  filter: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.35, ease: 'easeOut' },
                }}
              >
                <div 
                  className="relative w-[92vw] sm:w-[88vw] max-w-[940px] transition-transform duration-500 mx-auto drop-shadow-lg"
                >
                  <img loading="lazy" decoding="async" 
                    src="/file-folderopen.svg" 
                    alt="Folder Open" 
                    className="w-full h-auto object-contain pointer-events-none drop-shadow-md" 
                  />
                  <button 
                    onClick={() => setIsVcbayFolderOpen(false)}
                    className="hidden sm:flex absolute top-[calc(45%+2px)] right-[0.5%] md:top-[calc(46%+2px)] md:right-[1%] z-50 w-9 h-9 rounded-full bg-white text-black items-center justify-center hover:rotate-90 active:scale-95 transition-transform duration-200 ease-out border border-black/10 cursor-pointer shadow-sm"
                    title="Close Folder"
                  >
                    <X size={18} />
                  </button>
                  <div className="absolute inset-0 pointer-events-none z-20">
                    {/* Upper Document: Project Highlights (Subtle Softness at Rest -> Crisp HD on Hover) */}
                    <motion.div
                      className="absolute left-[34%] sm:left-[36%] top-[5%] sm:top-[4%] w-[56%] sm:w-[52%] aspect-[5760/4096] origin-center pointer-events-auto cursor-zoom-in z-20"
                      initial={{ rotate: 3, y: 30, opacity: 0, filter: 'blur(1.5px)' }}
                      animate={{ rotate: 3, y: 0, opacity: 0.96, filter: 'blur(0.5px)' }}
                      whileHover={{ scale: 1.44, rotate: 0, x: '-12%', y: '10%', zIndex: 70, opacity: 1, filter: 'blur(0px)' }}
                      transition={{ type: 'spring', stiffness: 240, damping: 26 }}
                      title="Hover to zoom project highlights"
                    >
                      <div className="w-full h-full bg-white rounded-[6px] sm:rounded-[8px] shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.22)] border border-black/10 overflow-hidden flex items-center justify-center">
                        <img 
                          loading="eager" 
                          decoding="sync" 
                          src="/project highlights.webp" 
                          alt="Zefyron Project Highlights" 
                          className="w-full h-full object-contain block pointer-events-none [image-rendering:-webkit-optimize-contrast] [image-rendering:high-quality]" 
                        />
                      </div>
                    </motion.div>

                    {/* Lower Layered Document: Certificate (Subtle Softness at Rest -> Crisp HD on Hover) */}
                    <motion.div
                      className="absolute left-[8%] sm:left-[10%] top-[45%] sm:top-[43%] w-[56%] sm:w-[52%] aspect-[6000/3376] origin-center pointer-events-auto cursor-zoom-in z-25"
                      initial={{ rotate: -4.5, y: 30, opacity: 0, filter: 'blur(1.5px)' }}
                      animate={{ rotate: -4.5, y: 0, opacity: 0.96, filter: 'blur(0.5px)' }}
                      whileHover={{ scale: 1.44, rotate: 0, x: '8%', y: -35, zIndex: 70, opacity: 1, filter: 'blur(0px)' }}
                      transition={{ type: 'spring', stiffness: 240, damping: 26 }}
                      title="Hover to zoom certificate"
                    >
                      <div className="w-full h-full bg-white rounded-[6px] sm:rounded-[8px] shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.22)] border border-black/10 overflow-hidden flex items-center justify-center">
                        <img 
                          loading="eager" 
                          decoding="sync" 
                          src="/certificate.webp" 
                          alt="VCBay Internship Certificate" 
                          className="w-full h-full object-contain block pointer-events-none [image-rendering:-webkit-optimize-contrast] [image-rendering:high-quality]" 
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
      {/* Mindset Shifts Scroll Reveal Section */}
      <MindsetShiftsSection />

      <main 
        className="flex-1 flex flex-col justify-center px-6 md:px-12 relative z-10 text-white w-full max-w-screen-lg mx-auto py-6 sm:py-8 md:py-10"
        onMouseEnter={() => setIsTestimonialHovered(true)}
        onMouseLeave={() => setIsTestimonialHovered(false)}
      >
        <div className="w-full flex flex-col items-center select-none">
          {/* Quote Container (Tightened spacing on mobile) */}
          <div className="relative w-full min-h-[130px] sm:h-[220px] md:h-[180px] lg:h-[160px] flex flex-col items-center justify-center text-center mb-1 sm:mb-8 px-2 sm:px-8 md:px-12">
            {/* Quotation Mark Icon */}
            <div className="text-[#F05C6D] select-none mb-1 sm:mb-2.5">
              <Quote size={24} className="rotate-180 sm:w-8 sm:h-8" fill="currentColor" fillOpacity={0.2} />
            </div>

            {/* Quote Text & Optional CTA Button */}
            <div className="w-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center text-center justify-center w-full"
                >
                  <p className="text-[13px] sm:text-[15px] md:text-[17px] lg:text-[21px] font-editorial text-white/95 leading-relaxed font-light mb-1.5 sm:mb-4 text-center max-w-3xl">
                    {TESTIMONIALS[activeTestimonial].text}
                  </p>

                  {TESTIMONIALS[activeTestimonial].role === 'Future Collaborator' && (
                    <button
                      onClick={() => {
                        if (onNavigate) {
                          onNavigate('contact');
                        } else {
                          window.location.hash = '#contact';
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#F05C6D] text-[#F05C6D] hover:bg-[#F05C6D] hover:text-[#120F17] font-ppmori text-[11px] sm:text-[12px] uppercase tracking-wider font-bold transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer group"
                    >
                      <Sparkles size={13} className="text-[#F05C6D] group-hover:text-[#120F17] transition-colors" />
                      <span>Let's Create Magic</span>
                    </button>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Avatar Selector Pill Bar (Centered, Multi-stage Closing/Opening Pill Animations) */}
          <div className="w-full flex justify-center">
            <div className="flex items-center gap-2 sm:gap-3 bg-[#120F17]/90 backdrop-blur-2xl p-1.5 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
              {TESTIMONIALS.map((t, index) => {
                const isActive = activeTestimonial === index;

                return (
                  <motion.button
                    key={index}
                    layout
                    onClick={() => setActiveTestimonial(index)}
                    transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                    className={`relative flex items-center rounded-full overflow-hidden transition-colors duration-500 focus:outline-none cursor-pointer h-[42px] ${
                      isActive
                        ? 'bg-[#1e1927] border border-[#F05C6D]/50 pl-1 pr-3.5 shadow-lg opacity-100'
                        : 'w-[42px] bg-transparent border border-white/20 hover:border-[#F05C6D]/80 opacity-60 hover:opacity-100 hover:scale-105'
                    }`}
                    title={`${t.name} - ${t.role}`}
                  >
                    {/* Active Accent Ring */}
                    {isActive && (
                      <motion.div
                        layoutId="activeAccentRing"
                        className="absolute inset-0 rounded-full border border-[#F05C6D]/40 pointer-events-none"
                        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                      />
                    )}

                    {/* Avatar: Video if present, minimal frame for users without image/video, else normal image */}
                    <motion.div
                      layout
                      className="shrink-0 flex items-center justify-center relative z-10 overflow-hidden rounded-full"
                      animate={{
                        width: isActive ? 34 : 42,
                        height: isActive ? 34 : 42,
                      }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {t.video ? (
                        <video
                          src={t.video}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className={`w-full h-full rounded-full object-cover transition-all duration-300 ${
                            isActive ? 'border-2 border-[#F05C6D]' : 'border-none'
                          }`}
                        />
                      ) : (!t.image || (t.role === 'Future Collaborator' && !t.image)) ? (
                        <div
                          className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-300 ${
                            isActive ? 'border-2 border-[#F05C6D] bg-[#F05C6D]/10' : 'border border-dashed border-white/30 bg-white/5'
                          }`}
                        >
                          <User size={14} className={isActive ? 'text-[#F05C6D]' : 'text-white/50'} />
                        </div>
                      ) : (
                        <img
                          src={t.image}
                          alt={t.name}
                          className={`w-full h-full rounded-full object-cover transition-all duration-300 ${
                            isActive ? 'border-2 border-[#F05C6D]' : 'border-none'
                          }`}
                        />
                      )}
                    </motion.div>

                    {/* Text Container: Appears from left to right, collapses on closing */}
                    <AnimatePresence mode="popLayout" initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, width: 0, x: -12 }}
                          animate={{ opacity: 1, width: 'auto', x: 0 }}
                          exit={{ opacity: 0, width: 0, x: -12 }}
                          transition={{
                            duration: 0.48,
                            ease: [0.16, 1, 0.3, 1],
                            opacity: { duration: 0.35, delay: 0.08 },
                          }}
                          className="flex flex-col text-left leading-tight whitespace-nowrap overflow-hidden pl-2 relative z-10"
                        >
                          <span className="text-[11px] sm:text-xs font-bold font-ppmori text-white tracking-wide">
                            {t.name}
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-ppmori text-white/60 tracking-normal">
                            {t.role}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* End of Content */}
      {isModalOpen && (
        <React.Suspense fallback={null}>
          <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projects={modalProjects}
          />
        </React.Suspense>
      )}
    </>
  );
};
export default Work;
