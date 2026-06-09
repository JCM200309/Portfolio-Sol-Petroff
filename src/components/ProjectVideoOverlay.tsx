import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import NeoTrattoriaAudiovisual from './audiovisuales/NeoTrattoriaAudiovisual';
import PhygitalAudiovisual from './audiovisuales/PhygitalAudiovisual';
import EspejismoDeLujoAudiovisual from './audiovisuales/EspejismoDeLujoAudiovisual';
import ObjetoAntiModaAudiovisual from './audiovisuales/ObjetoAntiModaAudiovisual';

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
  objectPosition?: string;
}

interface ProjectVideoOverlayProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export default function ProjectVideoOverlay({ project, onClose }: ProjectVideoOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isNeoTrattoria = project?.title === 'Neo Trattoria';
  const isPhygital = project?.title === 'Phygital';
  const isEspejismoDeLujo = project?.title === 'Espejismo del Lujo';
  const isObjetoAntiModa = project?.title === 'Objeto Anti-Moda';
  const isCustomBackstage = isNeoTrattoria || isPhygital || isEspejismoDeLujo || isObjetoAntiModa;

  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveredVideo, setIsHoveredVideo] = useState(false);

  // Backstage UI States
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

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
    if (!isCustomBackstage || !videoRef.current) return;
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
        className={`fixed inset-0 z-45 backdrop-blur-xl select-none pointer-events-auto bg-[var(--color-brand-crema)] text-black ${
          isCustomBackstage ? 'overflow-y-auto block' : 'flex items-center justify-center'
        }`}
      > 
        {isCustomBackstage ? (
          /* Fullscreen Video + Backstage Layout */
          <div className="w-full min-h-screen flex flex-col">
            {/* Fullscreen Video Fold */}
            <div 
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHoveringVideo(true)}
              onMouseLeave={() => setIsHoveringVideo(false)}
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
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[10px] tracking-widest font-sans font-semibold uppercase pointer-events-none select-none text-[var(--color-brand-marron-oscuro)]/70">
                <span>Ver Backstage</span>
                <svg
                  className="w-5 h-5 mt-1 animate-bounce text-[var(--color-brand-marron-oscuro)]/70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Backstage Photo Gallery Fold */}
            <div className="w-full py-24 px-6 md:px-12 flex flex-col items-center bg-[var(--color-brand-crema)]">
              <div className="w-full max-w-7xl">
                {/* Editorial Intro Header */}
                <div className="text-center mb-20 space-y-6">
                  <span className="text-xs uppercase tracking-widest font-sans font-semibold text-[var(--color-brand-bordo)]">
                    Proceso Audiovisual
                  </span>
                  <h2 className={`text-5xl md:text-7xl font-brand font-black tracking-tight leading-tight text-[var(--color-brand-marron-oscuro)]`}>
                    {project.title}
                  </h2>
                  <div className={`w-20 h-[2px] mx-auto bg-[var(--color-brand-bordo)]`} />
                  <p className="font-light leading-relaxed text-sm md:text-base max-w-2xl mx-auto text-black/75">
                    {project.longDescription || project.description}
                  </p>
                  <p className="font-sans text-[10px] tracking-[0.2em] uppercase pt-4 font-semibold text-black/45">
                    Detrás de Escena
                  </p>
                </div>

                {/* Dynamically Loaded Project Backstage Component */}
                {isNeoTrattoria && <NeoTrattoriaAudiovisual onSelectPhoto={setSelectedPhoto} />}
                {isPhygital && <PhygitalAudiovisual onSelectPhoto={setSelectedPhoto} />}
                {isEspejismoDeLujo && <EspejismoDeLujoAudiovisual onSelectPhoto={setSelectedPhoto} />}
                {isObjetoAntiModa && <ObjetoAntiModaAudiovisual onSelectPhoto={setSelectedPhoto} />}
              </div>
            </div>
          </div>
        ) : (
          /* Standard Video Overlay (Default for other projects) */
          <div className="w-full h-full max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 overflow-y-auto md:overflow-visible bg-[var(--color-brand-crema)] text-black">
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

        {/* Lightbox / Zoom Dialog overlay */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out pointer-events-auto"
              onClick={() => setSelectedPhoto(null)}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Photo frame */}
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="max-w-full max-h-full flex items-center justify-center"
              >
                <img
                  src={selectedPhoto}
                  alt="Zoomed Backstage"
                  className="max-w-[95vw] max-h-[90vh] object-contain rounded-sm select-none"
                  draggable={false}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
