import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { ArrowLeft, X } from 'lucide-react'
import ScrollReveal from './ScrollReveal'

// --- HELPER COMPONENT: 3D Interactive Hover Tilt Image ---
interface TiltImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  parallaxY?: any;
}

function TiltImage({ src, alt, className = "", onClick, onHoverStart, onHoverEnd, parallaxY }: TiltImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  
  const springConfig = { damping: 25, stiffness: 180, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [0, 1], [7, -7]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-7, 7]), springConfig);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width;
    const relativeY = (e.clientY - rect.top) / rect.height;
    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
    if (onHoverEnd) onHoverEnd();
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={onHoverStart}
      onClick={onClick}
      style={{ 
        perspective: 1000,
        y: parallaxY || 0 
      }}
      className={`relative overflow-hidden ${onClick ? 'cursor-none' : ''} ${className}`}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="w-full h-full relative"
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-700 ease-out select-none pointer-events-none"
          loading="lazy"
        />
        <div className="absolute inset-0 border border-white/10 pointer-events-none group-hover:border-white/20 transition-colors" />
      </motion.div>
    </motion.div>
  );
}

interface NeoTrattoriaExperienceProps {
  onBack: () => void;
}

export default function NeoTrattoriaExperience({ onBack }: NeoTrattoriaExperienceProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  
  const pageRef = useRef<HTMLDivElement>(null);

  // Parallax calculations
  const sec1Ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: sec1Progress } = useScroll({
    container: pageRef,
    target: sec1Ref,
    offset: ["start end", "end start"]
  });
  const sec1Parallax = useTransform(sec1Progress, [0, 1], [45, -45]);

  const sec3Ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: sec3Progress } = useScroll({
    container: pageRef,
    target: sec3Ref,
    offset: ["start end", "end start"]
  });
  const sec3ParallaxLeft = useTransform(sec3Progress, [0, 1], [30, -50]);
  const sec3ParallaxRight = useTransform(sec3Progress, [0, 1], [-20, 60]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (pageRef.current) {
      const rect = pageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top + pageRef.current.scrollTop;
      setCursorPos({ x, y });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPhoto(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <motion.div
      ref={pageRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full h-full min-h-screen relative bg-[var(--color-brand-crema)] text-[var(--color-brand-marron-oscuro)] overflow-y-auto overflow-x-hidden select-none pointer-events-auto pb-32 neotrattoria-scroll-container"
    >
      {/* Noise overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />

      {/* Floating Return Button */}
      <div className="fixed top-8 left-6 md:left-12 z-40">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-sans tracking-[0.25em] uppercase text-[var(--color-brand-crema)] bg-[var(--color-brand-bordo)] hover:bg-[var(--color-brand-bordo)]/90 hover:scale-[1.03] active:scale-97 px-5 py-2.5 rounded-full transition-all duration-300 shadow-md cursor-pointer pointer-events-auto"
        >
          <ArrowLeft size={12} /> Volver a Portada
        </button>
      </div>

      {/* SECTION 0: HERO SPLASH & TITLE */}
      <div className="w-full min-h-screen flex flex-col justify-center items-center px-6 pt-28 pb-16 relative">
        <div className="max-w-6xl w-full text-center mb-16 select-none flex flex-col items-center">
          <ScrollReveal
            scrollContainer=".neotrattoria-scroll-container"
            textClassName="text-[10px] md:text-xs font-sans tracking-[0.35em] text-[var(--color-brand-marron-claro)] uppercase font-semibold text-center w-full justify-center"
          >
            03 / Editorial de Tendencias & Nostalgia
          </ScrollReveal>
          
          <ScrollReveal
            scrollContainer=".neotrattoria-scroll-container"
            textClassName="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-brand uppercase tracking-wide text-[var(--color-brand-marron-oscuro)] mt-4 leading-none text-center w-full justify-center"
          >
            Neo Trattoria
          </ScrollReveal>
          
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-16 h-[1.5px] bg-[var(--color-brand-marron-claro)]/30 mx-auto mt-6"
          />
        </div>

        {/* Hero Photo */}
        <div className="w-full max-w-5xl aspect-[16/10] overflow-hidden rounded-xs border border-[var(--color-brand-marron-claro)]/15 shadow-sm relative group">
          <TiltImage
            src="/producciones/neoTrattoria/fotoPortada.JPG"
            alt="Neo Trattoria Hero"
            onClick={() => setSelectedPhoto('/producciones/neoTrattoria/fotoPortada.JPG')}
            onHoverStart={() => setIsHoveringImage(true)}
            onHoverEnd={() => setIsHoveringImage(false)}
            className="w-full h-full"
          />
        </div>

        {/* Intro Text */}
        <div className="max-w-3xl w-full mt-16 text-center px-4">
          <ScrollReveal
            scrollContainer=".neotrattoria-scroll-container"
            textClassName="text-xl md:text-2xl lg:text-3xl font-brand italic text-[var(--color-brand-marron-oscuro)] leading-relaxed text-center justify-center font-light"
          >
            “Neo Trattoria” explora la convivencia entre lo orgánico y lo estructural, articulando formas curvas, repeticiones y superposiciones que generan un equilibrio entre exceso y armonía. Esta editorial de moda y tendencias rediseña los espacios de la mesa tradicional bajo un lente contemporáneo y escultural, donde cada elemento dialoga con el cuerpo.
          </ScrollReveal>
        </div>
      </div>

      {/* SECTION 1: RETRO-FUTURISM (Split Layout) */}
      <div 
        ref={sec1Ref}
        className="max-w-6xl mx-auto px-6 py-24 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center"
      >
        {/* Left: Text */}
        <div className="order-2 md:order-1 flex flex-col justify-center">
          <ScrollReveal
            scrollContainer=".neotrattoria-scroll-container"
            textClassName="text-[10px] md:text-xs font-sans tracking-[0.3em] text-[var(--color-brand-marron-claro)] uppercase font-semibold text-left mb-4"
          >
            Materialidad & Contraste
          </ScrollReveal>
          <ScrollReveal
            scrollContainer=".neotrattoria-scroll-container"
            textClassName="text-base md:text-lg lg:text-xl font-sans text-[var(--color-brand-marron-oscuro)]/80 leading-relaxed tracking-wide text-left"
          >
            La dirección creativa de la producción destaca la materialidad y la elegancia retro-futurista. Los contrastes cromáticos y las texturas de la vajilla, los tejidos y el vestuario interactúan para construir un ambiente que oscila entre la nostalgia de la trattoria italiana clásica y una visión moderna de la gastronomía.
          </ScrollReveal>
        </div>

        {/* Right: Vertical Image */}
        <div className="order-1 md:order-2 aspect-[3/4] w-full max-w-md mx-auto overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-sm rounded-xs group">
          <TiltImage
            src="/producciones/neoTrattoria/image-1ece3b78-ba85-4ade-834d-db38a1d2334a.webp"
            alt="Neo Trattoria Materialidad"
            onClick={() => setSelectedPhoto('/producciones/neoTrattoria/image-1ece3b78-ba85-4ade-834d-db38a1d2334a.webp')}
            onHoverStart={() => setIsHoveringImage(true)}
            onHoverEnd={() => setIsHoveringImage(false)}
            parallaxY={sec1Parallax}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* SECTION 2: NATURE MORTE (Centered Frame) */}
      <div className="w-full py-20 bg-[var(--color-brand-marron-claro)]/5 border-t border-b border-[var(--color-brand-marron-claro)]/10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center">
          <div className="w-full aspect-[16/9] overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-md rounded-xs group">
            <TiltImage
              src="/producciones/neoTrattoria/image-2dbdc33d-cb5e-4f4f-b608-58cab0a92803.webp"
              alt="Neo Trattoria Bodegón"
              onClick={() => setSelectedPhoto('/producciones/neoTrattoria/image-2dbdc33d-cb5e-4f4f-b608-58cab0a92803.webp')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              className="w-full h-full"
            />
          </div>

          <div className="max-w-2xl text-center mt-12 px-4 flex flex-col items-center">
            <ScrollReveal
              scrollContainer=".neotrattoria-scroll-container"
              textClassName="text-[10px] md:text-xs font-sans tracking-[0.3em] text-[var(--color-brand-marron-claro)] uppercase font-semibold text-center w-full justify-center mb-4"
            >
              Naturaleza Muerta Contemporánea
            </ScrollReveal>
            <ScrollReveal
              scrollContainer=".neotrattoria-scroll-container"
              textClassName="text-lg md:text-xl lg:text-2xl font-brand italic text-[var(--color-brand-marron-oscuro)] leading-relaxed text-center justify-center font-light"
            >
              En esta puesta en escena, las poses reflejan la quietud de una naturaleza muerta. Los objetos cotidianos se transforman en piezas de arte y el espacio se convierte en un lienzo tridimensional donde la geometría del diseño de interiores y la indumentaria se encuentran.
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* SECTION 3: COMPOSITIONAL BALANCING (Sliding Sheets Parallax) */}
      <div 
        ref={sec3Ref}
        className="max-w-6xl mx-auto px-6 py-28 md:py-40 flex flex-col md:flex-row gap-16 md:gap-24 relative"
      >
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="aspect-[3/4] w-full max-w-sm overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-sm rounded-xs group">
            <TiltImage
              src="/producciones/neoTrattoria/image-6c536fd8-f84b-4020-b323-5951d0483c10.webp"
              alt="Neo Trattoria Estructura"
              onClick={() => setSelectedPhoto('/producciones/neoTrattoria/image-6c536fd8-f84b-4020-b323-5951d0483c10.webp')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              parallaxY={sec3ParallaxLeft}
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-start pt-12 md:pt-24">
          <div className="aspect-[3/4] w-full max-w-sm overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-sm rounded-xs mb-12 group">
            <TiltImage
              src="/producciones/neoTrattoria/image-f56d6f9a-82f6-42b8-808e-5a0f755f5a10.webp"
              alt="Neo Trattoria Geometría"
              onClick={() => setSelectedPhoto('/producciones/neoTrattoria/image-f56d6f9a-82f6-42b8-808e-5a0f755f5a10.webp')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              parallaxY={sec3ParallaxRight}
              className="w-full h-full"
            />
          </div>

          <div className="max-w-md">
            <ScrollReveal
              scrollContainer=".neotrattoria-scroll-container"
              textClassName="text-[10px] md:text-xs font-sans tracking-[0.3em] text-[var(--color-brand-marron-claro)] uppercase font-semibold text-left mb-4"
            >
              Diálogos de Siluetas
            </ScrollReveal>
            <ScrollReveal
              scrollContainer=".neotrattoria-scroll-container"
              textClassName="text-base md:text-lg font-sans text-[var(--color-brand-marron-oscuro)]/80 leading-relaxed tracking-wide text-left"
            >
              El diálogo entre el cuerpo y el bodegón contemporáneo se acentúa mediante el uso de fragmentos lineales y composiciones asimétricas. La luz suave pero direccionada dibuja siluetas que acentúan la sofisticación de las formas y la sobriedad cromática.
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* SECTION 4: CONCLUDING QUOTE */}
      <div className="w-full pt-16 pb-16 flex flex-col items-center">
        <div className="max-w-3xl text-center px-6 flex flex-col items-center">
          <ScrollReveal
            scrollContainer=".neotrattoria-scroll-container"
            textClassName="text-[10px] md:text-xs font-sans tracking-[0.4em] text-[var(--color-brand-marron-claro)] uppercase mb-6 block text-center w-full justify-center"
          >
            Reminiscencia de la Mesa
          </ScrollReveal>
          <ScrollReveal
            scrollContainer=".neotrattoria-scroll-container"
            textClassName="text-3xl sm:text-4xl md:text-5xl font-brand text-[var(--color-brand-marron-oscuro)] leading-relaxed text-center justify-center font-light tracking-wide"
          >
            La mesa dispuesta como una instalación artística: un tributo a las raíces culinarias reinterpretado bajo un lenguaje visual minimalista y de vanguardia.
          </ScrollReveal>
        </div>
      </div>

      {/* Custom Follow Cursor Badge */}
      {isHoveringImage && (
        <motion.div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            x: cursorPos.x - 36,
            y: cursorPos.y - 36
          }}
          className="hidden md:flex absolute w-18 h-18 rounded-full bg-[var(--color-brand-bordo)] text-[var(--color-brand-crema)] items-center justify-center text-[9px] font-sans tracking-[0.25em] uppercase font-semibold pointer-events-none z-50 shadow-[0_8px_25px_rgba(132,6,36,0.25)] border border-white/10"
        >
          Zoom
        </motion.div>
      )}

      {/* Lightbox / Zoom Dialog overlay */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="max-w-full max-h-full flex items-center justify-center"
            >
              <img
                src={selectedPhoto}
                alt="Zoomed Editorial"
                className="max-w-[95vw] max-h-[90vh] object-contain rounded-sm select-none"
                draggable={false}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
