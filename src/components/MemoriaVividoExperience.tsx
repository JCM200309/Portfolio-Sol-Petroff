import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { ArrowLeft, X } from 'lucide-react'
import ScrollReveal from './ScrollReveal'

// --- HELPER COMPONENT: 3D Interactive Hover Tilt Image (Original Colors) ---
interface TiltImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  parallaxY?: any; // Framer motion transform value
}

export function TiltImage({ src, alt, className = "", onClick, onHoverStart, onHoverEnd, parallaxY }: TiltImageProps) {
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
        {/* Subtle inner gold/border flare on hover */}
        <div className="absolute inset-0 border border-white/10 pointer-events-none group-hover:border-white/20 transition-colors" />
      </motion.div>
    </motion.div>
  );
}

// --- MAIN PORTAL: Memoria Vívido Experience Page ---
interface MemoriaVividoExperienceProps {
  onBack: () => void;
}

export default function MemoriaVividoExperience({ onBack }: MemoriaVividoExperienceProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  
  const pageRef = useRef<HTMLDivElement>(null);

  // Scroll Progress trackers for parallax sections
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

  const sec4Ref = useRef<HTMLDivElement>(null);

  // Track cursor position inside page container for follow mouse custom badge
  const handleMouseMove = (e: React.MouseEvent) => {
    if (pageRef.current) {
      const rect = pageRef.current.getBoundingClientRect();
      // Account for scrolled coordinates since container is scrollable
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top + pageRef.current.scrollTop;
      setCursorPos({ x, y });
    }
  };

  // Close lightbox with ESC key
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
      className="w-full h-full min-h-screen relative bg-[var(--color-brand-crema)] text-[var(--color-brand-marron-oscuro)] overflow-y-auto overflow-x-hidden select-none pointer-events-auto pb-32 memoria-scroll-container"
    >
      {/* Noise texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />

      {/* Floating Sticky Return Button */}
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
            scrollContainer=".memoria-scroll-container"
            textClassName="text-[10px] md:text-xs font-sans tracking-[0.35em] text-[var(--color-brand-marron-claro)] uppercase font-semibold text-center w-full justify-center"
          >
            01 / Producción Escénica & Moda
          </ScrollReveal>
          
          <ScrollReveal
            scrollContainer=".memoria-scroll-container"
            textClassName="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-brand uppercase tracking-wide text-[var(--color-brand-marron-oscuro)] mt-4 leading-none text-center w-full justify-center"
          >
            Memoria Vívido
          </ScrollReveal>
          
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-16 h-[1.5px] bg-[var(--color-brand-marron-claro)]/30 mx-auto mt-6"
          />
        </div>

        {/* Hero Photo (1.png) - Asymmetric container */}
        <div className="w-full max-w-5xl aspect-[16/10] overflow-hidden rounded-xs border border-[var(--color-brand-marron-claro)]/15 shadow-sm relative group">
          <TiltImage
            src="/producciones/memoriaVivido/1.png"
            alt="Memoria Vívido Imagen 1"
            onClick={() => setSelectedPhoto('/producciones/memoriaVivido/1.png')}
            onHoverStart={() => setIsHoveringImage(true)}
            onHoverEnd={() => setIsHoveringImage(false)}
            className="w-full h-full"
          />
        </div>

        {/* Narrative Paragraph 1: Intro */}
        <div className="max-w-3xl w-full mt-16 text-center px-4">
          <ScrollReveal
            scrollContainer=".memoria-scroll-container"
            textClassName="text-xl md:text-2xl lg:text-3xl font-brand italic text-[var(--color-brand-marron-oscuro)] leading-relaxed text-center justify-center font-light"
          >
            Editorial basada en un reporte de tendencias que desarrolla el concepto de “memoria vivido”, representando un universo estético desde la nostalgia y el recuerdo como un peso. Se plasma la naturaleza expansiva y a veces caótica de la memoria, y como se convive con ese peso, desde las poses elegidas, las luces y la escenografía.
          </ScrollReveal>
        </div>
      </div>

      {/* SECTION 1: THE PHYSICAL WEIGHT OF MEMORY (Split Layout) */}
      <div 
        ref={sec1Ref}
        className="max-w-6xl mx-auto px-6 py-24 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center"
      >
        {/* Left Side: Story Text */}
        <div className="order-2 md:order-1 flex flex-col justify-center">
          <ScrollReveal
            scrollContainer=".memoria-scroll-container"
            textClassName="text-[10px] md:text-xs font-sans tracking-[0.3em] text-[var(--color-brand-marron-claro)] uppercase font-semibold text-left mb-4"
          >
            El Cuerpo Bajo la Carga
          </ScrollReveal>
          <ScrollReveal
            scrollContainer=".memoria-scroll-container"
            textClassName="text-base md:text-lg lg:text-xl font-sans text-[var(--color-brand-marron-oscuro)]/80 leading-relaxed tracking-wide text-left"
          >
            La elección de representar el universo estético desde la nostalgia y el recuerdo responde a la intención de evocar emociones profundas y personales. La nostalgia se presenta como una carga emocional que cada persona lleva consigo, simbolizando el impacto duradero de los recuerdos en la vida cotidiana. Este peso emocional se refleja físicamente, manifestándose en la postura del cuerpo humano, que tiende a encorvarse bajo la carga de estos recuerdos, adoptando una tipología "deprimida".
          </ScrollReveal>
        </div>

        {/* Right Side: Large Vertical Image */}
        <div className="order-1 md:order-2 aspect-[3/4] w-full max-w-md mx-auto overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-sm rounded-xs group">
          <TiltImage
            src="/producciones/memoriaVivido/foto principal.jpg"
            alt="Memoria Vívido Poses"
            onClick={() => setSelectedPhoto('/producciones/memoriaVivido/foto principal.jpg')}
            onHoverStart={() => setIsHoveringImage(true)}
            onHoverEnd={() => setIsHoveringImage(false)}
            parallaxY={sec1Parallax}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* SECTION 2: THE ACCUMULATED LOAD (Centered Wide Frame) */}
      <div className="w-full py-20 bg-[var(--color-brand-marron-claro)]/5 border-t border-b border-[var(--color-brand-marron-claro)]/10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center">
          {/* Centered Large Image */}
          <div className="w-full aspect-[16/9] overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-md rounded-xs group">
            <TiltImage
              src="/producciones/memoriaVivido/471988EA-FB4A-409D-9469-30F36DD5F0A8_L0_001-4_7_2024, 4_46_10 p.m..jpg"
              alt="Memoria Vívido Acumulación"
              onClick={() => setSelectedPhoto('/producciones/memoriaVivido/471988EA-FB4A-409D-9469-30F36DD5F0A8_L0_001-4_7_2024, 4_46_10 p.m..jpg')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              className="w-full h-full"
            />
          </div>

          {/* Text Block underneath */}
          <div className="max-w-2xl text-center mt-12 px-4 flex flex-col items-center">
            <ScrollReveal
              scrollContainer=".memoria-scroll-container"
              textClassName="text-[10px] md:text-xs font-sans tracking-[0.3em] text-[var(--color-brand-marron-claro)] uppercase font-semibold text-center w-full justify-center mb-4"
            >
              Tipologías Acumuladas
            </ScrollReveal>
            <ScrollReveal
              scrollContainer=".memoria-scroll-container"
              textClassName="text-lg md:text-xl lg:text-2xl font-brand italic text-[var(--color-brand-marron-oscuro)] leading-relaxed text-center justify-center font-light"
            >
              Representamos el tema desde la nostalgia y el recuerdo como un peso. Los recuerdos desbordados representados por las tipologías acumuladas son la carga emocional que perdura en el presente.
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* SECTION 3: FRAGMENTATION (Sliding Sheets Parallax Layout) */}
      <div 
        ref={sec3Ref}
        className="max-w-6xl mx-auto px-6 py-28 md:py-40 flex flex-col md:flex-row gap-16 md:gap-24 relative"
      >
        {/* Left sliding photo */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="aspect-[3/4] w-full max-w-sm overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-sm rounded-xs group">
            <TiltImage
              src="/producciones/memoriaVivido/4BB58F99-F85C-42E3-ABAF-BFDC83DACAA5_L0_001-4_7_2024, 4_46_12 p.m..jpg"
              alt="Fragmento Lineal A"
              onClick={() => setSelectedPhoto('/producciones/memoriaVivido/4BB58F99-F85C-42E3-ABAF-BFDC83DACAA5_L0_001-4_7_2024, 4_46_12 p.m..jpg')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              parallaxY={sec3ParallaxLeft}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Right sliding photo with text */}
        <div className="w-full md:w-1/2 flex flex-col justify-start pt-12 md:pt-24">
          <div className="aspect-[3/4] w-full max-w-sm overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-sm rounded-xs mb-12 group">
            <TiltImage
              src="/producciones/memoriaVivido/57459F9E-70BA-4ABE-B28B-48C88CE86B11_L0_001-4_7_2024, 4_46_11 p.m..jpg"
              alt="Fragmento Lineal B"
              onClick={() => setSelectedPhoto('/producciones/memoriaVivido/57459F9E-70BA-4ABE-B28B-48C88CE86B11_L0_001-4_7_2024, 4_46_11 p.m..jpg')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              parallaxY={sec3ParallaxRight}
              className="w-full h-full"
            />
          </div>

          <div className="max-w-md">
            <ScrollReveal
              scrollContainer=".memoria-scroll-container"
              textClassName="text-[10px] md:text-xs font-sans tracking-[0.3em] text-[var(--color-brand-marron-claro)] uppercase font-semibold text-left mb-4"
            >
              Estructura Proliferada
            </ScrollReveal>
            <ScrollReveal
              scrollContainer=".memoria-scroll-container"
              textClassName="text-base md:text-lg font-sans text-[var(--color-brand-marron-oscuro)]/80 leading-relaxed tracking-wide text-left"
            >
              Se simboliza la fragmentación de los recuerdos al desbordar la composición en múltiples fragmentos lineales y expandir las distintas piezas en una estructura proliferada para profundizar en la complejidad y riqueza de la memoria y la experiencia humana.
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* SECTION 4: NARRATIVE CLUSTER (Staggered Grid Experience) */}
      <div 
        ref={sec4Ref}
        className="max-w-6xl mx-auto px-6 py-20 relative flex flex-col items-center"
      >
        <div className="mb-16 select-none flex flex-col items-center">
          <ScrollReveal
            scrollContainer=".memoria-scroll-container"
            textClassName="text-[10px] md:text-xs font-sans tracking-[0.35em] text-[var(--color-brand-marron-claro)] uppercase block text-center w-full justify-center mb-2"
          >
            Ecos & Cotidianidad
          </ScrollReveal>
          
          <ScrollReveal
            scrollContainer=".memoria-scroll-container"
            textClassName="text-3xl md:text-5xl font-brand uppercase tracking-wider text-[var(--color-brand-marron-oscuro)] text-center mt-2 w-full justify-center"
          >
            La Huella del Ayer
          </ScrollReveal>
        </div>

        {/* Staggered Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16 w-full">
          <div className="aspect-[4/5] w-full max-w-sm mx-auto overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-sm rounded-xs group">
            <TiltImage
              src="/producciones/memoriaVivido/BAEE5B7E-3A79-4FB2-9CE5-9709AE4A0256_L0_001-4_7_2024, 4_46_10 p.m..jpg"
              alt="Eco de Memoria"
              onClick={() => setSelectedPhoto('/producciones/memoriaVivido/BAEE5B7E-3A79-4FB2-9CE5-9709AE4A0256_L0_001-4_7_2024, 4_46_10 p.m..jpg')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              className="w-full h-full"
            />
          </div>

          <div className="flex flex-col justify-center">
            <ScrollReveal
              scrollContainer=".memoria-scroll-container"
              textClassName="text-lg md:text-xl lg:text-2xl font-brand italic text-[var(--color-brand-marron-oscuro)] leading-relaxed text-left font-light mb-6"
            >
              La narrativa de la producción es evidenciar el peso de los recuerdos en la cotidianidad, la esencia de lo simple y la liberación de la rigidez.
            </ScrollReveal>
            <ScrollReveal
              scrollContainer=".memoria-scroll-container"
              textClassName="text-sm md:text-base font-sans tracking-wide leading-relaxed text-[var(--color-brand-marron-oscuro)]/75"
            >
              Los ecos del pasado permanecen latentes y cada fragmento es una reminiscencia de experiencias vividas en tiempos lejanos.
            </ScrollReveal>
          </div>
        </div>

        {/* Staggered Row 2: Staggered horizontal layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-12 w-full">
          <div className="aspect-square overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-xs rounded-xs group">
            <TiltImage
              src="/producciones/memoriaVivido/7.JPG"
              alt="Reminiscencia 7"
              onClick={() => setSelectedPhoto('/producciones/memoriaVivido/7.JPG')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              className="w-full h-full"
            />
          </div>

          <div className="aspect-square overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-xs rounded-xs group sm:translate-y-8 md:translate-y-12">
            <TiltImage
              src="/producciones/memoriaVivido/8.JPG"
              alt="Reminiscencia 8"
              onClick={() => setSelectedPhoto('/producciones/memoriaVivido/8.JPG')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              className="w-full h-full"
            />
          </div>

          <div className="aspect-square overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-xs rounded-xs group sm:col-span-2 md:col-span-1">
            <TiltImage
              src="/producciones/memoriaVivido/D9742183-A5A7-46D6-AB10-7A5753506F1D_L0_001-4_7_2024, 4_46_12 p.m..jpg"
              alt="Reminiscencia 9"
              onClick={() => setSelectedPhoto('/producciones/memoriaVivido/D9742183-A5A7-46D6-AB10-7A5753506F1D_L0_001-4_7_2024, 4_46_12 p.m..jpg')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* SECTION 5: CONCLUDING HERO */}
      <div className="w-full pt-32 pb-16 flex flex-col items-center">
        <div className="w-full max-w-5xl aspect-[16/10] overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-md rounded-xs group">
          <TiltImage
            src="/producciones/memoriaVivido/portada.JPG"
            alt="Memoria Vívido Conclusión"
            onClick={() => setSelectedPhoto('/producciones/memoriaVivido/portada.JPG')}
            onHoverStart={() => setIsHoveringImage(true)}
            onHoverEnd={() => setIsHoveringImage(false)}
            className="w-full h-full"
          />
        </div>

        {/* Concluding elegant narrative block */}
        <div className="max-w-3xl text-center mt-16 px-6 flex flex-col items-center">
          <ScrollReveal
            scrollContainer=".memoria-scroll-container"
            textClassName="text-[10px] md:text-xs font-sans tracking-[0.4em] text-[var(--color-brand-marron-claro)] uppercase mb-6 block text-center w-full justify-center"
          >
            Reminiscencia Final
          </ScrollReveal>
          <ScrollReveal
            scrollContainer=".memoria-scroll-container"
            textClassName="text-3xl sm:text-4xl md:text-5xl font-brand text-[var(--color-brand-marron-oscuro)] leading-relaxed text-center justify-center font-light tracking-wide"
          >
            El peso de la memoria resguardado en el presente, se manifiesta en el recorrido de la vida, el cual es testigo de la huella que deja el tiempo.
          </ScrollReveal>
        </div>
      </div>

      {/* Floating Custom Follow Cursor Badge ("VER FOTO" / "ZOOM" - spring coordinates follow) */}
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
