import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { X } from 'lucide-react'
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
  loading?: "lazy" | "eager";
  fetchpriority?: "high" | "low" | "auto";
}

export function TiltImage({ 
  src, 
  alt, 
  className = "", 
  onClick, 
  onHoverStart, 
  onHoverEnd, 
  parallaxY,
  loading = "lazy",
  fetchpriority = "auto"
}: TiltImageProps) {
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
        className="w-full h-auto relative"
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-contain transition-transform duration-700 ease-out select-none pointer-events-none block"
          loading={loading}
          decoding="async"
          {...(fetchpriority !== "auto" ? { fetchpriority } : {})}
        />
        {/* Subtle inner gold/border flare on hover */}
        <div className="absolute inset-0 border border-white/10 pointer-events-none group-hover:border-white/20 transition-colors" />
      </motion.div>
    </motion.div>
  );
}

const memoriaVividoImages = [
  "/producciones/memoriaVivido/primerFoto.jpg",
  "/producciones/memoriaVivido/portada.JPG",
  "/producciones/memoriaVivido/foto principal.jpg",
  "/producciones/memoriaVivido/3.jpg",
  "/producciones/memoriaVivido/4.JPG",
  "/producciones/memoriaVivido/5.JPG",
  "/producciones/memoriaVivido/6.jpg",
  "/producciones/memoriaVivido/7.JPG",
  "/producciones/memoriaVivido/8.JPG",
  "/producciones/memoriaVivido/9.JPG",
  "/producciones/memoriaVivido/10.JPG",
  "/producciones/memoriaVivido/11.JPG",
  "/producciones/memoriaVivido/12.jpg",
  "/producciones/memoriaVivido/13.jpg",
  "/producciones/memoriaVivido/14.JPG",
  "/producciones/memoriaVivido/15.JPG",
  "/producciones/memoriaVivido/16.jpg",
  "/producciones/memoriaVivido/17.jpg",
  "/producciones/memoriaVivido/4BB58F99-F85C-42E3-ABAF-BFDC83DACAA5_L0_001-4_7_2024, 4_46_12 p.m..jpg"
];

// --- MAIN PORTAL: Memoria Vívido Experience Page ---
export default function MemoriaVividoExperience() {
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

        {/* Hero Photo (primerFoto.jpg) */}
        <div className="w-full max-w-5xl overflow-hidden rounded-sm border border-[var(--color-brand-marron-claro)]/15 shadow-sm relative group bg-black/[0.02]">
          <TiltImage
            src="/producciones/memoriaVivido/primerFoto.jpg"
            alt="Memoria Vívido Imagen 1"
            onClick={() => setSelectedPhoto('/producciones/memoriaVivido/primerFoto.jpg')}
            onHoverStart={() => setIsHoveringImage(true)}
            onHoverEnd={() => setIsHoveringImage(false)}
            className="w-full h-auto"
            loading="eager"
            fetchpriority="high"
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
            textClassName="text-base md:text-lg lg:text-xl font-sans text-[var(--color-brand-marron-oscuro)]/80 leading-relaxed tracking-wide text-left"
          >
            La elección de representar el universo estético desde la nostalgia y el recuerdo responde a la intención de evocar emociones profundas y personales. La nostalgia se presenta como una carga emocional que cada persona lleva consigo, simbolizando el impacto duradero de los recuerdos en la vida cotidiana. Este peso emocional se refleja físicamente, manifestándose en la postura del cuerpo humano, que tiende a encorvarse bajo la carga de estos recuerdos, adoptando una tipología "deprimida".
          </ScrollReveal>
        </div>

        {/* Right Side: Large Vertical Image */}
        <div className="order-1 md:order-2 w-full max-w-md mx-auto overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-sm rounded-sm group bg-black/[0.02]">
          <TiltImage
            src="/producciones/memoriaVivido/foto principal.jpg"
            alt="Memoria Vívido Poses"
            onClick={() => setSelectedPhoto('/producciones/memoriaVivido/foto principal.jpg')}
            onHoverStart={() => setIsHoveringImage(true)}
            onHoverEnd={() => setIsHoveringImage(false)}
            parallaxY={sec1Parallax}
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* SECTION 2: THE ACCUMULATED LOAD (Centered Wide Frame) */}
      <div className="w-full py-20 bg-[var(--color-brand-marron-claro)]/5 border-t border-b border-[var(--color-brand-marron-claro)]/10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center">
          {/* Centered Large Image */}
          <div className="w-full max-w-md overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-md rounded-sm group bg-black/[0.02]">
            <TiltImage
              src="/producciones/memoriaVivido/3.jpg"
              alt="Memoria Vívido Acumulación"
              onClick={() => setSelectedPhoto('/producciones/memoriaVivido/3.jpg')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              className="w-full h-auto"
            />
          </div>

          {/* Text Block underneath */}
          <div className="max-w-2xl text-center mt-12 px-4 flex flex-col items-center">

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
          <div className="w-full max-w-sm overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-sm rounded-sm group bg-black/[0.02]">
            <TiltImage
              src="/producciones/memoriaVivido/4BB58F99-F85C-42E3-ABAF-BFDC83DACAA5_L0_001-4_7_2024, 4_46_12 p.m..jpg"
              alt="Fragmento Lineal A"
              onClick={() => setSelectedPhoto('/producciones/memoriaVivido/4BB58F99-F85C-42E3-ABAF-BFDC83DACAA5_L0_001-4_7_2024, 4_46_12 p.m..jpg')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              parallaxY={sec3ParallaxLeft}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Right sliding photo with text */}
        <div className="w-full md:w-1/2 flex flex-col justify-start pt-12 md:pt-24">
          <div className="w-full max-w-sm overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-sm rounded-sm mb-12 group bg-black/[0.02]">
            <TiltImage
              src="/producciones/memoriaVivido/5.JPG"
              alt="Fragmento Lineal B"
              onClick={() => setSelectedPhoto('/producciones/memoriaVivido/5.JPG')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              parallaxY={sec3ParallaxRight}
              className="w-full h-auto"
            />
          </div>

          <div className="max-w-md">

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
            textClassName="text-3xl md:text-5xl font-brand uppercase tracking-wider text-[var(--color-brand-marron-oscuro)] text-center mt-2 w-full justify-center"
          >
            La Huella del Ayer
          </ScrollReveal>
        </div>

        {/* Staggered Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16 w-full">
          <div className="w-full max-w-sm mx-auto overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-sm rounded-sm group bg-black/[0.02]">
            <TiltImage
              src="/producciones/memoriaVivido/6.jpg"
              alt="Eco de Memoria"
              onClick={() => setSelectedPhoto('/producciones/memoriaVivido/6.jpg')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              className="w-full h-auto"
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
              Los ecos del pasado permanecen latentes y cada fragmento es una reminiscencia de experiencias
            </ScrollReveal>
          </div>
        </div>

        {/* Staggered Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-12 w-full">
          <div className="w-full max-w-xs mx-auto overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-xs rounded-sm group bg-black/[0.02]">
            <TiltImage
              src="/producciones/memoriaVivido/7.JPG"
              alt="Reminiscencia 7"
              onClick={() => setSelectedPhoto('/producciones/memoriaVivido/7.JPG')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              className="w-full h-auto"
            />
          </div>

          <div className="w-full max-w-xs mx-auto overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-xs rounded-sm group sm:translate-y-8 md:translate-y-12 bg-black/[0.02]">
            <TiltImage
              src="/producciones/memoriaVivido/8.JPG"
              alt="Reminiscencia 8"
              onClick={() => setSelectedPhoto('/producciones/memoriaVivido/8.JPG')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              className="w-full h-auto"
            />
          </div>

          <div className="w-full max-w-xs mx-auto overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-xs rounded-sm group bg-black/[0.02]">
            <TiltImage
              src="/producciones/memoriaVivido/9.JPG"
              alt="Reminiscencia 9"
              onClick={() => setSelectedPhoto('/producciones/memoriaVivido/9.JPG')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* SECTION 5: CONCLUDING HERO */}
      <div className="w-full pt-32 pb-16 flex flex-col items-center">
        <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 px-6 mb-24">
          {/* Vertical Card - Left */}
          <div className="w-full md:w-1/2 max-w-sm overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-md rounded-sm group bg-black/[0.02]">
            <TiltImage
              src="/producciones/memoriaVivido/10.JPG"
              alt="Memoria Vívido Detalle"
              onClick={() => setSelectedPhoto('/producciones/memoriaVivido/10.JPG')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              className="w-full h-auto"
            />
          </div>

          {/* Vertical Card - Right */}
          <div className="w-full md:w-1/2 max-w-sm overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-md rounded-sm group md:translate-y-12 bg-black/[0.02]">
            <TiltImage
              src="/producciones/memoriaVivido/portada.JPG"
              alt="Memoria Vívido Conclusión"
              onClick={() => setSelectedPhoto('/producciones/memoriaVivido/portada.JPG')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Concluding elegant narrative block */}
        <div className="max-w-3xl text-center mt-12 px-6 flex flex-col items-center">

          <ScrollReveal
            scrollContainer=".memoria-scroll-container"
            textClassName="text-3xl sm:text-4xl md:text-5xl font-brand text-[var(--color-brand-marron-oscuro)] leading-relaxed text-center justify-center font-light tracking-wide"
          >
            El peso de la memoria resguardado en el presente, se manifiesta en el recorrido de la vida, el cual es testigo de la huella que deja el tiempo.
          </ScrollReveal>
        </div>
      </div>

      {/* GALLERY SECTION */}
      <div className="max-w-6xl mx-auto px-6 py-20 border-t border-[var(--color-brand-marron-claro)]/10">
        <div className="mb-12 select-none">

          <ScrollReveal
            scrollContainer=".memoria-scroll-container"
            textClassName="text-3xl md:text-5xl font-brand uppercase tracking-wider text-[var(--color-brand-marron-oscuro)] mt-2"
          >
            Registro Editorial
          </ScrollReveal>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 [column-fill:_balance]">
          {memoriaVividoImages.map((imgSrc, index) => (
            <motion.div
              key={imgSrc}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (index % 5) * 0.05 }}
              className="break-inside-avoid overflow-hidden rounded-sm border border-[var(--color-brand-marron-claro)]/15 shadow-sm bg-black/[0.01] hover:shadow-md transition-shadow group cursor-none relative"
              onClick={() => setSelectedPhoto(imgSrc)}
              onMouseEnter={() => setIsHoveringImage(true)}
              onMouseLeave={() => setIsHoveringImage(false)}
            >
              <img
                src={imgSrc}
                alt={`Memoria Vívido Gallery ${index}`}
                className="w-full h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/[0.02] group-hover:bg-transparent transition-colors duration-300 pointer-events-none" />
            </motion.div>
          ))}
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
