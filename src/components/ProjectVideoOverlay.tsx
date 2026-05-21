import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectDetails {
  year: string;
  category: string;
  duration: string;
}

interface ProjectItem {
  image: string;
  video: string;
  title: string;
  description: string;
  num?: string;
  longDescription?: string;
  details?: ProjectDetails;
}

interface ProjectVideoOverlayProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export default function ProjectVideoOverlay({ project, onClose }: ProjectVideoOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-focus and lock background scroll
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-brand-crema)] backdrop-blur-xl text-black select-none pointer-events-auto"
      >
        {/* Floating Back Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ delay: 0.2 }}
          onClick={onClose}
          className="absolute top-6 left-6 z-50 flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-black/15 bg-white/60 text-[var(--color-brand-marron-oscuro)] hover:bg-[var(--color-brand-bordo)] hover:text-[var(--color-brand-crema)] hover:border-[var(--color-brand-bordo)] hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-sm cursor-pointer shadow-sm"
          aria-label="Volver a los proyectos"
        >
          <span className="text-xl leading-none">&larr;</span>
          <span className="text-xs uppercase tracking-widest font-semibold font-sans">Volver</span>
        </motion.button>

        <div className="w-full h-full max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 overflow-y-auto md:overflow-visible">
          {/* Left Side: Video Player Container */}
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="w-full md:w-3/5 aspect-video md:aspect-auto md:h-[60vh] rounded-2xl overflow-hidden border border-black/10 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.12)] bg-black/5 relative group flex items-center justify-center"
          >
            <video
              ref={videoRef}
              src={project.video}
              poster={project.image}
              autoPlay
              controls
              playsInline
              className="w-full h-full object-contain md:object-cover"
            />
          </motion.div>

          {/* Right Side: Text details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            className="w-full md:w-2/5 flex flex-col items-start text-left pointer-events-auto"
          >
            {/* Title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-brand font-black text-[var(--color-brand-marron-oscuro)] mb-6 tracking-tight leading-tight">
              {project.num && (
                <span className="text-2xl md:text-3xl font-light align-super mr-4 text-[var(--color-brand-bordo)]">
                  {project.num}
                </span>
              )}
              {project.title}
            </h2>

            {/* Divider */}
            <div className="w-16 h-[2px] bg-[var(--color-brand-bordo)] mb-6" />

            {/* Description */}
            <p className="text-black/80 font-light leading-relaxed text-sm md:text-base mb-8 max-w-prose">
              {project.longDescription || 'Exploración artística e interdisciplinaria que fusiona narrativa visual, movimiento y experimentación matérica.'}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
