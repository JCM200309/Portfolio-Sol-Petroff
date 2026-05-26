import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { X } from 'lucide-react'
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

export default function NoFuturoExperience() {
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
  const sec1Parallax = useTransform(sec1Progress, [0, 1], [40, -40]);

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
      className="w-full h-full min-h-screen relative bg-[var(--color-brand-crema)] text-[var(--color-brand-marron-oscuro)] overflow-y-auto overflow-x-hidden select-none pointer-events-auto pb-32 nofuturo-scroll-container"
    >
      {/* Noise overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />



      {/* SECTION 0: HERO SPLASH & TITLE */}
      <div className="w-full min-h-screen flex flex-col justify-center items-center px-6 pt-28 pb-16 relative">
        <div className="max-w-6xl w-full text-center mb-16 select-none flex flex-col items-center">
          <ScrollReveal
            scrollContainer=".nofuturo-scroll-container"
            textClassName="text-[10px] md:text-xs font-sans tracking-[0.35em] text-[var(--color-brand-marron-claro)] uppercase font-semibold text-center w-full justify-center"
          >
            02 / Editorial Punk & Rebelión
          </ScrollReveal>
          
          <ScrollReveal
            scrollContainer=".nofuturo-scroll-container"
            textClassName="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-brand uppercase tracking-wide text-[var(--color-brand-marron-oscuro)] mt-4 leading-none text-center w-full justify-center"
          >
            No Futuro
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
            src="/producciones/noFuturo/PRIMER FOTO.JPG"
            alt="No Futuro Imagen 1"
            onClick={() => setSelectedPhoto('/producciones/noFuturo/PRIMER FOTO.JPG')}
            onHoverStart={() => setIsHoveringImage(true)}
            onHoverEnd={() => setIsHoveringImage(false)}
            className="w-full h-full"
          />
        </div>

        {/* Intro Text */}
        <div className="max-w-3xl w-full mt-16 text-center px-4">
          <ScrollReveal
            scrollContainer=".nofuturo-scroll-container"
            textClassName="text-xl md:text-2xl lg:text-3xl font-brand italic text-[var(--color-brand-marron-oscuro)] leading-relaxed text-center justify-center font-light"
          >
            “No Futuro” toma como punto de partida la subcultura punk y su rechazo hacia las estructuras sociales establecidas, entendiendo el cuerpo como un espacio de resistencia, descarga y protesta. La producción se construye desde una estética cruda e incómoda, donde las expresiones, las poses y la iluminación buscan transmitir tensión, individualismo y una actitud desafiante frente al entorno.
          </ScrollReveal>
        </div>
      </div>

      {/* SECTION 1: RESISTANCE (Split Layout) */}
      <div 
        ref={sec1Ref}
        className="max-w-6xl mx-auto px-6 py-24 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center"
      >
        {/* Left: Text */}
        <div className="order-2 md:order-1 flex flex-col justify-center">
          <ScrollReveal
            scrollContainer=".nofuturo-scroll-container"
            textClassName="text-[10px] md:text-xs font-sans tracking-[0.3em] text-[var(--color-brand-marron-claro)] uppercase font-semibold text-left mb-4"
          >
            El Presente Despojado
          </ScrollReveal>
          <ScrollReveal
            scrollContainer=".nofuturo-scroll-container"
            textClassName="text-base md:text-lg lg:text-xl font-sans text-[var(--color-brand-marron-oscuro)]/80 leading-relaxed tracking-wide text-left"
          >
            A través de una dirección visual agresiva y despojada, trabajamos la idea de una generación atravesada por el desencanto y la ausencia de proyección. No existe una visión idealizada del mañana: el presente aparece como único territorio posible. La identidad se construye desde la autogestión, la rebeldía y la necesidad de diferenciarse del otro, incluso mediante el exceso, la provocación y la confrontación.
          </ScrollReveal>
        </div>

        {/* Right: Vertical Image */}
        <div className="order-1 md:order-2 aspect-[3/4] w-full max-w-md mx-auto overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-sm rounded-xs group">
          <TiltImage
            src="/producciones/noFuturo/2.JPG"
            alt="No Futuro Actitud"
            onClick={() => setSelectedPhoto('/producciones/noFuturo/2.JPG')}
            onHoverStart={() => setIsHoveringImage(true)}
            onHoverEnd={() => setIsHoveringImage(false)}
            parallaxY={sec1Parallax}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* SECTION 2: SHOCK & HARD LIGHT (Centered Frame) */}
      <div className="w-full py-20 bg-[var(--color-brand-marron-claro)]/5 border-t border-b border-[var(--color-brand-marron-claro)]/10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center">
          <div className="w-full aspect-[16/9] overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-md rounded-xs group">
            <TiltImage
              src="/producciones/noFuturo/3.JPG"
              alt="No Futuro Detalle"
              onClick={() => setSelectedPhoto('/producciones/noFuturo/3.JPG')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              className="w-full h-full"
            />
          </div>

          <div className="max-w-2xl text-center mt-12 px-4 flex flex-col items-center">
            <ScrollReveal
              scrollContainer=".nofuturo-scroll-container"
              textClassName="text-[10px] md:text-xs font-sans tracking-[0.3em] text-[var(--color-brand-marron-claro)] uppercase font-semibold text-center w-full justify-center mb-4"
            >
              Iluminación & Expresión
            </ScrollReveal>
            <ScrollReveal
              scrollContainer=".nofuturo-scroll-container"
              textClassName="text-lg md:text-xl lg:text-2xl font-brand italic text-[var(--color-brand-marron-oscuro)] leading-relaxed text-center justify-center font-light"
            >
              La iluminación dura, los contrastes marcados y las expresiones corporales exageradas funcionan como recursos para reforzar una personalidad revolucionaria, impulsiva y contestataria. El maquillaje, el vestuario y los accesorios toman elementos propios de la estética punk para reinterpretarlos desde un lenguaje contemporáneo y editorial.
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* SECTION 3: CHAOS & RHYTHM (Sliding Sheets Parallax) */}
      <div 
        ref={sec3Ref}
        className="max-w-6xl mx-auto px-6 py-28 md:py-40 flex flex-col md:flex-row gap-16 md:gap-24 relative"
      >
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="aspect-[3/4] w-full max-w-sm overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-sm rounded-xs group">
            <TiltImage
              src="/producciones/noFuturo/4.JPG"
              alt="No Futuro Fragmento A"
              onClick={() => setSelectedPhoto('/producciones/noFuturo/4.JPG')}
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
              src="/producciones/noFuturo/5.JPG"
              alt="No Futuro Fragmento B"
              onClick={() => setSelectedPhoto('/producciones/noFuturo/5.JPG')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              parallaxY={sec3ParallaxRight}
              className="w-full h-full"
            />
          </div>

          <div className="max-w-md">
            <ScrollReveal
              scrollContainer=".nofuturo-scroll-container"
              textClassName="text-[10px] md:text-xs font-sans tracking-[0.3em] text-[var(--color-brand-marron-claro)] uppercase font-semibold text-left mb-4"
            >
              Identidad Estética
            </ScrollReveal>
            <ScrollReveal
              scrollContainer=".nofuturo-scroll-container"
              textClassName="text-base md:text-lg font-sans text-[var(--color-brand-marron-oscuro)]/80 leading-relaxed tracking-wide text-left"
            >
              Cada encuadre desafía la rigidez formal. Los materiales ásperos, las tachas y la superposición de texturas conviven con las miradas directas y las poses que proyectan la tensión corporal hacia el espectador.
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* SECTION 4: NARRATIVE CLUSTER (Staggered Grid) */}
      <div className="max-w-6xl mx-auto px-6 py-20 relative flex flex-col items-center">
        <div className="mb-16 select-none flex flex-col items-center">
          <ScrollReveal
            scrollContainer=".nofuturo-scroll-container"
            textClassName="text-[10px] md:text-xs font-sans tracking-[0.35em] text-[var(--color-brand-marron-claro)] uppercase block text-center w-full justify-center mb-2"
          >
            Estado Emocional Colectivo
          </ScrollReveal>
          
          <ScrollReveal
            scrollContainer=".nofuturo-scroll-container"
            textClassName="text-3xl md:text-5xl font-brand uppercase tracking-wider text-[var(--color-brand-marron-oscuro)] text-center mt-2 w-full justify-center"
          >
            Grito Corporal
          </ScrollReveal>
        </div>

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16 w-full">
          <div className="aspect-[4/5] w-full max-w-sm mx-auto overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-sm rounded-xs group">
            <TiltImage
              src="/producciones/noFuturo/6.JPG"
              alt="No Futuro Caos"
              onClick={() => setSelectedPhoto('/producciones/noFuturo/6.JPG')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              className="w-full h-full"
            />
          </div>

          <div className="flex flex-col justify-center">
            <ScrollReveal
              scrollContainer=".nofuturo-scroll-container"
              textClassName="text-lg md:text-xl lg:text-2xl font-brand italic text-[var(--color-brand-marron-oscuro)] leading-relaxed text-left font-light mb-6"
            >
              La producción no busca romantizar el caos, sino representar visualmente un estado emocional colectivo: apatía, enojo, ironía y supervivencia.
            </ScrollReveal>
            <ScrollReveal
              scrollContainer=".nofuturo-scroll-container"
              textClassName="text-sm md:text-base font-sans tracking-wide leading-relaxed text-[var(--color-brand-marron-oscuro)]/75"
            >
              “No Futuro” se convierte así en una puesta en escena donde el cuerpo expresa las palabras que quieren ser gritadas, sirviendo de válvula de escape creativa.
            </ScrollReveal>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-12 w-full">
          <div className="aspect-square overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-xs rounded-xs group">
            <TiltImage
              src="/producciones/noFuturo/7.JPG"
              alt="No Futuro Detalle 7"
              onClick={() => setSelectedPhoto('/producciones/noFuturo/7.JPG')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              className="w-full h-full"
            />
          </div>

          <div className="aspect-square overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-xs rounded-xs group sm:translate-y-8 md:translate-y-12">
            <TiltImage
              src="/producciones/noFuturo/8.JPG"
              alt="No Futuro Detalle 8"
              onClick={() => setSelectedPhoto('/producciones/noFuturo/8.JPG')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              className="w-full h-full"
            />
          </div>

          <div className="aspect-square overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-xs rounded-xs group sm:col-span-2 md:col-span-1 flex items-center justify-center bg-[var(--color-brand-marron-claro)]/10 text-[var(--color-brand-marron-oscuro)]/40 font-brand italic text-lg px-6 text-center select-none">
            "El cuerpo es el espacio donde se plasma la resistencia punk."
          </div>
        </div>
      </div>

      {/* SECTION 5: CONCLUDING HERO */}
      <div className="w-full pt-32 pb-16 flex flex-col items-center">
        <div className="w-full max-w-5xl aspect-[16/10] overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-md rounded-xs group">
          <TiltImage
            src="/producciones/noFuturo/fotoPortada.JPG"
            alt="No Futuro Conclusion"
            onClick={() => setSelectedPhoto('/producciones/noFuturo/fotoPortada.JPG')}
            onHoverStart={() => setIsHoveringImage(true)}
            onHoverEnd={() => setIsHoveringImage(false)}
            className="w-full h-full"
          />
        </div>

        <div className="max-w-3xl text-center mt-16 px-6 flex flex-col items-center">
          <ScrollReveal
            scrollContainer=".nofuturo-scroll-container"
            textClassName="text-[10px] md:text-xs font-sans tracking-[0.4em] text-[var(--color-brand-marron-claro)] uppercase mb-6 block text-center w-full justify-center"
          >
            Conclusión
          </ScrollReveal>
          <ScrollReveal
            scrollContainer=".nofuturo-scroll-container"
            textClassName="text-3xl sm:text-4xl md:text-5xl font-brand text-[var(--color-brand-marron-oscuro)] leading-relaxed text-center justify-center font-light tracking-wide"
          >
            La insurrección del vestuario y la crudeza del instante se funden en el retrato de una juventud que encuentra en la protesta su propio lenguaje vital.
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
