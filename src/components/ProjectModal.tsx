import React from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowUpRight, Calendar, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
    id: string;
    title: string;
    role: string;
    date: string;
    description: string;
    image: string;
    link: string;
    theme: string;
    isIframe?: boolean;
}

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    projects: Project[];
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, projects }) => {
    if (typeof document === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="relative w-full max-w-4xl bg-[#1a1512] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5 shrink-0">
                            <h3 className="text-xl font-stardos font-medium text-white tracking-wide">Other Projects</h3>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-6 md:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {projects.map(project => (
                                    <div key={project.id} className="group flex flex-col bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all h-full">
                                        {/* Image */}
                                        <div className="aspect-video w-full overflow-hidden relative bg-black">
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex flex-col flex-1">
                                            <h4 className="text-xl font-stardos font-bold text-white mb-2 group-hover:text-[#F05C6D] transition-colors tracking-wide">{project.title}</h4>
                                            <p className="text-white/60 text-sm leading-relaxed mb-6 font-ppmori">{project.description}</p>
                                            
                                            <div className="flex items-center flex-wrap gap-4 text-xs text-white/40 mb-6 font-ppmori uppercase tracking-wider mt-auto">
                                                <span className="flex items-center gap-1"><User size={12} /> {project.role}</span>
                                                <span className="flex items-center gap-1"><Calendar size={12} /> {project.date}</span>
                                            </div>

                                            {/* Visit Project CTA */}
                                            <a 
                                                href={project.link} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="w-full py-3 bg-white/5 hover:bg-[#F05C6D] hover:text-[#0f0a06] border border-white/10 hover:border-transparent rounded-xl text-white font-ppmori font-medium transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                                            >
                                                <span>View Project</span>
                                                <ArrowUpRight size={16} className="group-hover/btn:rotate-45 transition-transform duration-300" />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default ProjectModal;
