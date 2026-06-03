import { useEffect, useRef, useState } from 'react';
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
  const isNeoTrattoria = project?.title === 'Neo Trattoria';

  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveredVideo, setIsHoveredVideo] = useState(false);

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

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!isNeoTrattoria || !videoRef.current) return;
    const scrollTop = e.currentTarget.scrollTop;
    const threshold = window.innerHeight * 0.5;

    if (scrollTop > threshold) {
      if (!videoRef.current.paused) {
        videoRef.current.pause();
      }
    } else {
      if (videoRef.current.paused) {
        videoRef.current.play().catch((err) => console.log("Play interrupted:", err));
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch((err) => console.log("Play interrupted:", err));
    } else {
      videoRef.current.pause();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        onScroll={handleScroll}
        className={`fixed inset-0 z-45 bg-[var(--color-brand-crema)] backdrop-blur-xl text-black select-none pointer-events-auto ${
          isNeoTrattoria ? 'overflow-y-auto block' : 'flex items-center justify-center'
        }`}
      >
        {/* Floating Back Button (only shown for other projects; Neo Trattoria uses the global Navbar) */}
        {!isNeoTrattoria && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.2 }}
            onClick={onClose}
            className="absolute top-6 left-6 z-50 flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-black/15 bg-white/80 text-[var(--color-brand-marron-oscuro)] hover:bg-[var(--color-brand-bordo)] hover:text-[var(--color-brand-crema)] hover:border-[var(--color-brand-bordo)] hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-md cursor-pointer shadow-sm"
            aria-label="Volver a los proyectos"
          >
            <span className="text-xl leading-none">&larr;</span>
            <span className="text-xs uppercase tracking-widest font-semibold font-sans">Volver</span>
          </motion.button>
        )}

        {isNeoTrattoria ? (
          /* Fullscreen Video + Backstage Layout (Neo Trattoria) */
          <div className="w-full min-h-screen flex flex-col">
            {/* Fullscreen Video Fold */}
            <div 
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHoveredVideo(true)}
              onMouseLeave={() => setIsHoveredVideo(false)}
              className="relative w-full h-[100dvh] bg-black flex items-center justify-center overflow-hidden cursor-none"
            >
              <video
                ref={videoRef}
                src={project.video}
                poster={project.image}
                autoPlay
                loop
                playsInline
                onClick={togglePlay}
                onPlay={() => setIsVideoPaused(false)}
                onPause={() => setIsVideoPaused(true)}
                className="w-full h-full object-cover cursor-none"
              />

              {/* Custom Play/Pause Cursor */}
              {isHoveredVideo && (
                <div
                  className="fixed pointer-events-none z-50 w-16 h-16 rounded-full bg-white/15 border border-white/20 backdrop-blur-[2px] flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out select-none shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                  style={{
                    left: mousePos.x,
                    top: mousePos.y,
                  }}
                >
                  {isVideoPaused ? (
                    <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  )}
                </div>
              )}

              {/* Animated Scroll Down indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[var(--color-brand-crema)]/70 text-[10px] tracking-widest font-sans font-semibold uppercase pointer-events-none select-none">
                <span>Ver Backstage</span>
                <svg
                  className="w-5 h-5 mt-1 text-[var(--color-brand-crema)]/70 animate-bounce"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Backstage Photo Gallery Fold */}
            <div className="w-full bg-[var(--color-brand-crema)] py-24 px-6 md:px-12 flex flex-col items-center">
              <div className="w-full max-w-6xl">
                {/* Editorial Intro Header */}
                <div className="text-center mb-20 space-y-6">
                  <span className="text-xs uppercase tracking-widest font-sans font-semibold text-[var(--color-brand-bordo)]">
                    Proceso Audiovisual
                  </span>
                  <h2 className="text-5xl md:text-7xl font-brand font-black text-[var(--color-brand-marron-oscuro)] tracking-tight leading-tight">
                    {project.title}
                  </h2>
                  <div className="w-20 h-[2px] bg-[var(--color-brand-bordo)] mx-auto" />
                  <p className="text-black/75 font-light leading-relaxed text-sm md:text-base max-w-2xl mx-auto">
                    {project.longDescription || project.description}
                  </p>
                  <p className="text-black/45 font-sans text-[10px] tracking-[0.2em] uppercase pt-4 font-semibold">
                    Detrás de Escena
                  </p>
                </div>

                {/* Editorial Masonry Grid */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-8 auto-rows-[250px] md:auto-rows-[350px]">
                  {/* Image 1: Large Main Highlight */}
                  <div className="md:col-span-4 md:row-span-2 overflow-hidden rounded-2xl border border-black/10 shadow-md hover:shadow-2xl transition-all duration-500 group relative cursor-pointer">
                    <img
                      src="/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/IMG_6653.jpg"
                      alt="Backstage Neo Trattoria - Composición"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <span className="text-[var(--color-brand-crema)] text-xs uppercase tracking-wider font-semibold font-sans">
                        Dirección de Arte & Composición
                      </span>
                    </div>
                  </div>

                  {/* Image 2: Small upper right */}
                  <div className="md:col-span-2 md:row-span-1 overflow-hidden rounded-2xl border border-black/10 shadow-md hover:shadow-2xl transition-all duration-500 group relative cursor-pointer">
                    <img
                      src="/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/IMG_6656.jpg"
                      alt="Backstage Neo Trattoria - Iluminación"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-[var(--color-brand-crema)] text-[10px] uppercase tracking-wider font-semibold font-sans">
                        Luz & Texturas
                      </span>
                    </div>
                  </div>

                  {/* Image 3: Small lower right */}
                  <div className="md:col-span-2 md:row-span-1 overflow-hidden rounded-2xl border border-black/10 shadow-md hover:shadow-2xl transition-all duration-500 group relative cursor-pointer">
                    <img
                      src="/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/IMG_6662.jpg"
                      alt="Backstage Neo Trattoria - Perspectiva"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-[var(--color-brand-crema)] text-[10px] uppercase tracking-wider font-semibold font-sans">
                        Enfoque & Perspectiva
                      </span>
                    </div>
                  </div>

                  {/* Image 4: Medium left bottom */}
                  <div className="md:col-span-3 md:row-span-2 overflow-hidden rounded-2xl border border-black/10 shadow-md hover:shadow-2xl transition-all duration-500 group relative cursor-pointer">
                    <img
                      src="/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/IMG_6675.jpg"
                      alt="Backstage Neo Trattoria - Detrás de escena"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <span className="text-[var(--color-brand-crema)] text-xs uppercase tracking-wider font-semibold font-sans">
                        Detrás de Cámara
                      </span>
                    </div>
                  </div>

                  {/* Image 5: Medium right bottom */}
                  <div className="md:col-span-3 md:row-span-2 overflow-hidden rounded-2xl border border-black/10 shadow-md hover:shadow-2xl transition-all duration-500 group relative cursor-pointer">
                    <img
                      src="/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/IMG_6681.jpg"
                      alt="Backstage Neo Trattoria - Set"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <span className="text-[var(--color-brand-crema)] text-xs uppercase tracking-wider font-semibold font-sans">
                        Atmósfera & Iluminación
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Standard Video Overlay (Default for other projects) */
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
                {project.longDescription ||
                  'Exploración artística e interdisciplinaria que fusiona narrativa visual, movimiento y experimentación matérica.'}
              </p>
            </motion.div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
