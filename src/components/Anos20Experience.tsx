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
  loading?: "lazy" | "eager";
  fetchpriority?: "high" | "low" | "auto";
}

function TiltImage({ 
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
        <div className="absolute inset-0 border border-white/10 pointer-events-none group-hover:border-white/20 transition-colors" />
      </motion.div>
    </motion.div>
  );
}

const anos20Images = [
  "/producciones/años20/fotoPortada.webp",
  "/producciones/años20/image-4d1736d6-2031-4813-930b-f0376060cbb9.webp",
  "/producciones/años20/image-58472fae-a344-43b9-b0d2-00cf3b4593ba.webp",
  "/producciones/años20/image-98d2f1ab-b1d4-48aa-8234-2bccb0e2928d.webp",
  "/producciones/años20/image-ab55dd13-2ec1-435c-b54b-c6ed1f6ab46e.webp"
];

export default function Anos20Experience() {
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
      className="w-full h-full min-h-screen relative bg-[var(--color-brand-crema)] text-[var(--color-brand-marron-oscuro)] overflow-y-auto overflow-x-hidden select-none pointer-events-auto pb-32 anos20-scroll-container"
    >
      {/* Noise overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />

      {/* SECTION 0: HERO SPLASH & TITLE */}
      <div className="w-full min-h-screen flex flex-col justify-center items-center px-6 pt-28 pb-16 relative">
        <div className="max-w-6xl w-full text-center mb-16 select-none flex flex-col items-center">
          <ScrollReveal
            scrollContainer=".anos20-scroll-container"
            textClassName="text-[10px] md:text-xs font-sans tracking-[0.35em] text-[var(--color-brand-marron-claro)] uppercase font-semibold text-center w-full justify-center"
          >
            04 / Editorial Retro & Elegancia
          </ScrollReveal>
          
          <ScrollReveal
            scrollContainer=".anos20-scroll-container"
            textClassName="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-brand uppercase tracking-wide text-[var(--color-brand-marron-oscuro)] mt-4 leading-none text-center w-full justify-center"
          >
            Años 20
          </ScrollReveal>
          
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-16 h-[1.5px] bg-[var(--color-brand-marron-claro)]/30 mx-auto mt-6"
          />
        </div>

        {/* Hero Photo */}
        <div className="w-full max-w-5xl overflow-hidden rounded-sm border border-[var(--color-brand-marron-claro)]/15 shadow-sm relative group bg-black/[0.02]">
          <TiltImage
            src="/producciones/años20/fotoPortada.webp"
            alt="Años 20 Hero"
            onClick={() => setSelectedPhoto('/producciones/años20/fotoPortada.webp')}
            onHoverStart={() => setIsHoveringImage(true)}
            onHoverEnd={() => setIsHoveringImage(false)}
            className="w-full h-auto"
            loading="eager"
            fetchpriority="high"
          />
        </div>

        {/* Intro Text */}
        <div className="max-w-3xl w-full mt-16 text-center px-4">
          <ScrollReveal
            scrollContainer=".anos20-scroll-container"
            textClassName="text-xl md:text-2xl lg:text-3xl font-brand italic text-[var(--color-brand-marron-oscuro)] leading-relaxed text-center justify-center font-light"
          >
            Una editorial inspirada en la estética de los años 20 que retoma el espíritu de una década marcada por la elegancia, la transformación y la modernidad emergente. La producción toma como punto de partida algunos de los códigos visuales más representativos de la época para reinterpretarlos desde una mirada contemporánea, construyendo un universo donde lo clásico y lo actual conviven constantemente.
          </ScrollReveal>
        </div>
      </div>

      {/* SECTION 1: SOPHISTICATION (Split Layout) */}
      <div 
        ref={sec1Ref}
        className="max-w-6xl mx-auto px-6 py-24 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center"
      >
        {/* Left: Text */}
        <div className="order-2 md:order-1 flex flex-col justify-center">
          <ScrollReveal
            scrollContainer=".anos20-scroll-container"
            textClassName="text-[10px] md:text-xs font-sans tracking-[0.3em] text-[var(--color-brand-marron-claro)] uppercase font-semibold text-left mb-4"
          >
            Brillo & Emancipación
          </ScrollReveal>
          <ScrollReveal
            scrollContainer=".anos20-scroll-container"
            textClassName="text-base md:text-lg lg:text-xl font-sans text-[var(--color-brand-marron-oscuro)]/80 leading-relaxed tracking-wide text-left"
          >
            A través del estilismo, el maquillaje y la puesta en escena, se busca recuperar la sofisticación característica de la década, trabajando con siluetas refinadas, detalles ornamentales, accesorios protagonistas y una estética atravesada por el dramatismo visual. El maquillaje toma un rol central dentro de la narrativa de la producción: líneas geométricas, miradas intensas y expresiones teatrales construyen personajes que transmiten fuerza, sensualidad y presencia.
          </ScrollReveal>
        </div>

        {/* Right: Vertical Image */}
        <div className="order-1 md:order-2 w-full max-w-md mx-auto overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-sm rounded-sm group bg-black/[0.02]">
          <TiltImage
            src="/producciones/años20/image-4d1736d6-2031-4813-930b-f0376060cbb9.webp"
            alt="Años 20 Brillo"
            onClick={() => setSelectedPhoto('/producciones/años20/image-4d1736d6-2031-4813-930b-f0376060cbb9.webp')}
            onHoverStart={() => setIsHoveringImage(true)}
            onHoverEnd={() => setIsHoveringImage(false)}
            parallaxY={sec1Parallax}
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* SECTION 2: SUSPENDED DETAILS (Centered Frame) */}
      <div className="w-full py-20 bg-[var(--color-brand-marron-claro)]/5 border-t border-b border-[var(--color-brand-marron-claro)]/10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center">
          <div className="w-full max-w-4xl overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-md rounded-sm group bg-black/[0.02]">
            <TiltImage
              src="/producciones/años20/image-58472fae-a344-43b9-b0d2-00cf3b4593ba.webp"
              alt="Años 20 Retrato"
              onClick={() => setSelectedPhoto('/producciones/años20/image-58472fae-a344-43b9-b0d2-00cf3b4593ba.webp')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              className="w-full h-auto"
            />
          </div>

          <div className="max-w-2xl text-center mt-12 px-4 flex flex-col items-center">
            <ScrollReveal
              scrollContainer=".anos20-scroll-container"
              textClassName="text-[10px] md:text-xs font-sans tracking-[0.3em] text-[var(--color-brand-marron-claro)] uppercase font-semibold text-center w-full justify-center mb-4"
            >
              Fragmentos de Decadencia
            </ScrollReveal>
            <ScrollReveal
              scrollContainer=".anos20-scroll-container"
              textClassName="text-lg md:text-xl lg:text-2xl font-brand italic text-[var(--color-brand-marron-oscuro)] leading-relaxed text-center justify-center font-light"
            >
              La propuesta visual explora también el contraste entre delicadeza y estructura. Las transparencias, los brillos y las texturas suaves dialogan con formas más rígidas y composiciones cuidadosamente construidas, generando imágenes donde la elegancia aparece desde el equilibrio entre lo sutil y lo excesivo. Cada elemento dentro de la escena busca reforzar una atmósfera sofisticada, inspirada en el glamour característico de la época pero llevada hacia una sensibilidad más actual.
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* SECTION 3: FLUIDITY (Sliding Sheets Parallax) */}
      <div 
        ref={sec3Ref}
        className="max-w-6xl mx-auto px-6 py-28 md:py-40 flex flex-col md:flex-row gap-16 md:gap-24 relative"
      >
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="w-full max-w-sm overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-sm rounded-sm group bg-black/[0.02]">
            <TiltImage
              src="/producciones/años20/image-98d2f1ab-b1d4-48aa-8234-2bccb0e2928d.webp"
              alt="Años 20 Silueta"
              onClick={() => setSelectedPhoto('/producciones/años20/image-98d2f1ab-b1d4-48aa-8234-2bccb0e2928d.webp')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              parallaxY={sec3ParallaxLeft}
              className="w-full h-auto"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-start pt-12 md:pt-24">
          <div className="w-full max-w-sm overflow-hidden border border-[var(--color-brand-marron-claro)]/15 shadow-sm rounded-sm mb-12 group bg-black/[0.02]">
            <TiltImage
              src="/producciones/años20/image-ab55dd13-2ec1-435c-b54b-c6ed1f6ab46e.webp"
              alt="Años 20 Movimiento"
              onClick={() => setSelectedPhoto('/producciones/años20/image-ab55dd13-2ec1-435c-b54b-c6ed1f6ab46e.webp')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              parallaxY={sec3ParallaxRight}
              className="w-full h-auto"
            />
          </div>

          <div className="max-w-md">
            <ScrollReveal
              scrollContainer=".anos20-scroll-container"
              textClassName="text-[10px] md:text-xs font-sans tracking-[0.3em] text-[var(--color-brand-marron-claro)] uppercase font-semibold text-left mb-4"
            >
              Charlestón & Libertad
            </ScrollReveal>
            <ScrollReveal
              scrollContainer=".anos20-scroll-container"
              textClassName="text-base md:text-lg font-sans text-[var(--color-brand-marron-oscuro)]/80 leading-relaxed tracking-wide text-left"
            >
              La iluminación y la dirección de arte acompañan esta construcción estética trabajando desde el contraste y la teatralidad. Las sombras marcadas, las poses y la expresividad de los personajes remiten al imaginario visual de los años 20, una década atravesada por el deseo de cambio, la liberación femenina y la aparición de nuevas formas de expresión ligadas a la moda, la belleza y la identidad.
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* SECTION 4: CONCLUDING QUOTE */}
      <div className="w-full pt-16 pb-16 flex flex-col items-center">
        <div className="max-w-3xl text-center px-6 flex flex-col items-center">
          <ScrollReveal
            scrollContainer=".anos20-scroll-container"
            textClassName="text-[10px] md:text-xs font-sans tracking-[0.4em] text-[var(--color-brand-marron-claro)] uppercase mb-6 block text-center w-full justify-center"
          >
            Reminiscencia de los Años Locos
          </ScrollReveal>
          <ScrollReveal
            scrollContainer=".anos20-scroll-container"
            textClassName="text-3xl sm:text-4xl md:text-5xl font-brand text-[var(--color-brand-marron-oscuro)] leading-relaxed text-center justify-center font-light tracking-wide"
          >
            Más que recrear la época de manera literal, la editorial busca reinterpretar su esencia visual y emocional. La producción toma elementos característicos de los años 20 para transformarlos en una propuesta contemporánea donde la elegancia, el dramatismo y la modernidad conviven, construyendo imágenes que oscilan entre lo clásico y lo actual sin perder la identidad propia de la propuesta.
          </ScrollReveal>
        </div>
      </div>

      {/* GALLERY SECTION */}
      <div className="max-w-6xl mx-auto px-6 py-20 border-t border-[var(--color-brand-marron-claro)]/10">
        <div className="mb-12 select-none">
          <ScrollReveal
            scrollContainer=".anos20-scroll-container"
            textClassName="text-[10px] md:text-xs font-sans tracking-[0.35em] text-[var(--color-brand-marron-claro)] uppercase font-semibold mb-2"
          >
            Galería Completa
          </ScrollReveal>
          <ScrollReveal
            scrollContainer=".anos20-scroll-container"
            textClassName="text-3xl md:text-5xl font-brand uppercase tracking-wider text-[var(--color-brand-marron-oscuro)] mt-2"
          >
            Registro Editorial
          </ScrollReveal>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 [column-fill:_balance]">
          {anos20Images.map((imgSrc, index) => (
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
                alt={`Años 20 Gallery ${index}`}
                className="w-full h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/[0.02] group-hover:bg-transparent transition-colors duration-300 pointer-events-none" />
            </motion.div>
          ))}
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
