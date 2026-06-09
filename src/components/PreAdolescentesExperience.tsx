import { useState, useRef } from 'react'
import { motion, AnimatePresence, useTransform, useMotionValue, useSpring, useScroll } from 'framer-motion'
import { ArrowUpRight, BookOpen, X, ChevronLeft, ChevronRight } from 'lucide-react'

// --- HELPER: 3D Tilt Container ---
interface TiltContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function TiltContainer({ children, className = "" }: TiltContainerProps) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const springConfig = { damping: 25, stiffness: 180, mass: 0.6 };
  const rotateX = useSpring(useTransform(my, [0, 1], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-8, 8]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };
  const handleMouseLeave = () => { mx.set(0.5); my.set(0.5); };

  return (
    <div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }} className={`relative ${className}`}>
      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }} className="w-full h-full">
        {children}
      </motion.div>
    </div>
  );
}

// ─── PANTONE COLOR CARD ──────────────────────────────────────────────────────
interface ColorCardProps {
  name: string;
  hex: string;
  pantoneCode: string;
  description?: string;
}

function ColorCard({ name, hex, pantoneCode, description, trendType }: ColorCardProps & { trendType: 'compas' | 'salus' | 'croma' }) {
  const [hovered, setHovered] = useState(false);

  const cardCorner = {
    compas: 'rounded-none',
    salus: 'rounded-2xl',
    croma: 'rounded-xl',
  }[trendType];

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -8, scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`shrink-0 w-[150px] cursor-default select-none bg-white/90 backdrop-blur-sm
        border border-[var(--color-brand-marron-claro)]/20 shadow-md hover:shadow-xl
        transition-shadow overflow-hidden ${cardCorner}`}
    >
      {/* Color swatch — top 55% of card */}
      <div className="h-[160px] w-full relative overflow-hidden" style={{ backgroundColor: hex }}>
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/15"
            >
              <span className="text-white text-[11px] font-mono tracking-widest font-bold">{hex}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pantone label strip */}
      <div className="px-3 pt-3 pb-4">
        <span className="block text-[8px] font-mono tracking-[0.15em] text-[var(--color-brand-marron-claro)] mb-0.5 uppercase">
          PANTONE®
        </span>
        <span className="block text-[11px] font-mono font-bold tracking-wider text-[var(--color-brand-marron-oscuro)] uppercase leading-tight">
          {pantoneCode}
        </span>
        <span className="block text-[10px] font-sans text-[var(--color-brand-marron-oscuro)]/70 mt-1.5 leading-tight">
          {name}
        </span>
        {description && (
          <span className="block text-[8px] font-sans text-[var(--color-brand-marron-oscuro)]/45 mt-0.5 leading-tight">
            {description}
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ─── PANTONE PALETTE ROW ──────────────────────────────────────────────────────
interface PaletteRowProps {
  title: string;
  trendType: 'compas' | 'salus' | 'croma';
  colors: ColorCardProps[];
}

function PaletteRow({ title, trendType, colors }: PaletteRowProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-[var(--color-brand-marron-claro)] font-semibold">
          MELODÍA CROMÁTICA
        </span>
        <div className="flex-1 h-[1px] bg-[var(--color-brand-marron-claro)]/20" />
      </div>
      <h3 className="text-2xl md:text-3xl font-brand uppercase text-[var(--color-brand-marron-oscuro)] tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-xs text-[var(--color-brand-marron-oscuro)]/60 mb-6 max-w-sm">
        Cada tono representa una emoción y una decisión visual de la microtendencia. Pasa el cursor sobre las tarjetas para ver el valor HEX.
      </p>

      {/* Palette grid — wraps automatically, no horizontal scroll needed */}
      <div className="flex flex-wrap justify-center gap-4 pb-2">
        {colors.map((c, i) => (
          <ColorCard key={i} {...c} trendType={trendType} />
        ))}
      </div>
      <p className="text-[8px] font-mono tracking-widest text-[var(--color-brand-marron-oscuro)]/40 mt-4 text-center uppercase">
        [ Pasa el cursor sobre los colores para revelar el código ]
      </p>
    </div>
  );
}



// ─── PHOTO CAROUSEL ────────────────────────────────────────────────────────────
interface PhotoCarouselProps {
  images: string[];
  title: string;
  trendType: 'compas' | 'salus' | 'croma';
  onImageClick: (src: string) => void;
}

function PhotoCarousel({ images, title, trendType, onImageClick }: PhotoCarouselProps) {
  const [current, setCurrent] = useState(0);
  const dragX = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const prev = () => setCurrent(c => (c - 1 + images.length) % images.length);
  const next = () => setCurrent(c => (c + 1) % images.length);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x < -50) next();
    else if (info.offset.x > 50) prev();
  };

  const cardCorner = {
    compas: 'rounded-none',
    salus: 'rounded-2xl',
    croma: 'rounded-xl',
  }[trendType];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-[var(--color-brand-marron-claro)] font-semibold">
            FOTOGRAFÍA DE INSPIRACIÓN
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="w-8 h-8 rounded-full border border-[var(--color-brand-marron-claro)]/30 bg-white/50 backdrop-blur-sm flex items-center justify-center hover:bg-[var(--color-brand-bordo)] hover:text-[var(--color-brand-crema)] hover:border-[var(--color-brand-bordo)] transition-all duration-200 cursor-pointer"
            aria-label="Anterior"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-[9px] font-mono text-[var(--color-brand-marron-claro)]">
            {current + 1} / {images.length}
          </span>
          <button
            onClick={next}
            className="w-8 h-8 rounded-full border border-[var(--color-brand-marron-claro)]/30 bg-white/50 backdrop-blur-sm flex items-center justify-center hover:bg-[var(--color-brand-bordo)] hover:text-[var(--color-brand-crema)] hover:border-[var(--color-brand-bordo)] transition-all duration-200 cursor-pointer"
            aria-label="Siguiente"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Main Carousel Stage */}
      <div ref={containerRef} className={`relative w-full overflow-hidden bg-[var(--color-brand-crema)]/50 border border-[var(--color-brand-marron-claro)]/15 ${cardCorner}`} style={{ aspectRatio: '16/9' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            drag="x"
            dragConstraints={containerRef}
            onDragEnd={handleDragEnd}
            style={{ x: dragX }}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            onClick={() => onImageClick(images[current])}
          >
            <img
              src={images[current]}
              alt={`${title} — Inspiración ${current + 1}`}
              className="w-full h-full object-cover select-none pointer-events-none"
              draggable="false"
            />
            {/* Subtle gradient overlay for bottom caption */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 text-white/70 text-[8px] font-mono tracking-widest uppercase pointer-events-none">
              {title} — {current + 1} / {images.length} — Arrastrar para navegar
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-3">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              i === current
                ? 'bg-[var(--color-brand-bordo)] w-4 h-1.5'
                : 'bg-[var(--color-brand-marron-claro)]/40 w-1.5 h-1.5 hover:bg-[var(--color-brand-marron-claro)]'
            }`}
            aria-label={`Ir a imagen ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── DATA ───────────────────────────────────────────────────────────────────
interface SectionData {
  id: 'compas' | 'salus' | 'croma';
  title: string;
  subtitle: string;
  theme: string;
  premise: string;
  description: string;
  morphology: string;
  badge: string;
  badgeStyle: string;
  gradient: string;
  colors: ColorCardProps[];
  gallery: string[];
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function PreAdolescentesExperience() {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const sections: SectionData[] = [
    {
      id: 'compas',
      title: "Compás Estético",
      subtitle: "Microtendencia 01",
      theme: "Hedonismo visual",
      premise: "Intensidad estimulante",
      badge: "MICROTENDENCIA // ESTÉTICA DIGITAL",
      badgeStyle: "bg-pink-100 text-pink-700 border-pink-200",
      gradient: "from-[#e8c7cd] via-[#be9e89] to-[#d0e1f9]",
      description: "Los preadolescentes consumen productos no solo por su funcionalidad, sino por su valor visual en redes sociales como Instagram, TikTok y Snapchat. La estética se entrelaza con la identidad personal, creando un ritmo social que guía sus decisiones de compra. El deseo de pertenencia ejerce una influencia clave en su autoestima cotidiana.",
      morphology: "Formas positivas, geométricas, rectilíneas y tridimensionales que generan gravedad estable y pesada. Módulos fragmentados y asimétricos que aportan distribución tenue. Texturas lisas, paletas en tonos pasteles.",
      colors: [
        { name: "Rosa Pastel", hex: "#e8c7cd", pantoneCode: "P 1040", description: "Feminidad suave" },
        { name: "Celeste Digital", hex: "#d0e1f9", pantoneCode: "P 2185", description: "Frescura digital" },
        { name: "Arena Suave", hex: "#ebd3c5", pantoneCode: "P 0740", description: "Naturalidad" },
        { name: "Margarina", hex: "#f8ecd4", pantoneCode: "P 0530", description: "Calidez tenue" },
        { name: "Lila Bruma", hex: "#ebdcf9", pantoneCode: "P 3325", description: "Sueño estético" },
        { name: "Blanco Nube", hex: "#faf8f5", pantoneCode: "P 0000", description: "Base limpia" },
      ],
      gallery: [
        "/narrativa/preAdolescentes/Compas Estetico/compas1.jpg",
        "/narrativa/preAdolescentes/Compas Estetico/compas2.webp",
        "/narrativa/preAdolescentes/Compas Estetico/compas3.jpg",
        "/narrativa/preAdolescentes/Compas Estetico/compas4.jpg",
        "/narrativa/preAdolescentes/Compas Estetico/compas5.webp",
      ],
    },
    {
      id: 'salus',
      title: "SalusVital",
      subtitle: "Microtendencia 02",
      theme: "Energía Fortificante",
      premise: "Dinamismo saludable",
      badge: "MICROTENDENCIA // BIENESTAR NATURAL",
      badgeStyle: "bg-emerald-100 text-emerald-800 border-emerald-200",
      gradient: "from-[#4c6b4c] via-[#be9e89] to-[#cbdccb]",
      description: "Invita a descubrir el poder transformador de la vida saludable mediante el contacto directo con la naturaleza. Reconectar con el aire libre fomenta la vitalidad, la claridad mental y reduce el estrés, promoviendo hábitos conscientes de descanso, hidratación y alimentación vinculada al origen natural.",
      morphology: "Formas orgánicas, irregulares y amorfas que sugieren fluidez. Asimetría rítmica con módulos aglomerados y gravedad inestable. Texturas rugosas y táctiles, colores neutros, tierra y verdes.",
      colors: [
        { name: "Sage Green", hex: "#cbdccb", pantoneCode: "P 3740", description: "Naturaleza viva" },
        { name: "Verde Forestal", hex: "#4c6b4c", pantoneCode: "P 3770", description: "Profundidad natural" },
        { name: "Arcilla", hex: "#be9e89", pantoneCode: "P 0740", description: "Tierra mineral" },
        { name: "Heno Seco", hex: "#e4e0d8", pantoneCode: "P 0240", description: "Aridez orgánica" },
        { name: "Tierra Oscura", hex: "#8a6c55", pantoneCode: "P 0750", description: "Raíces y suelo" },
        { name: "Musgo", hex: "#7a9e7e", pantoneCode: "P 3745", description: "Humedad silvestre" },
      ],
      gallery: [
        "/narrativa/preAdolescentes/SalusVItal/salus1.webp",
        "/narrativa/preAdolescentes/SalusVItal/salus2.jpg",
        "/narrativa/preAdolescentes/SalusVItal/salus3.webp",
        "/narrativa/preAdolescentes/SalusVItal/salus4.jpeg",
      ],
    },
    {
      id: 'croma',
      title: "Croma Vibrante",
      subtitle: "Microtendencia 03",
      theme: "Autoexpresión Juvenil",
      premise: "Empoderamiento creativo",
      badge: "MICROTENDENCIA // EXPRESIÓN Y COLOR",
      badgeStyle: "bg-amber-100 text-amber-800 border-amber-200",
      gradient: "from-[#ff2a5f] via-[#be9e89] to-[#ffdf00]",
      description: "Croma Vibrante encapsula la esencia preadolescente como un periodo de vitalidad y autoexpresión. Evoca una explosión de color donde cada matiz simboliza una emoción y experiencia única. La frescura y la renovación constante impulsan la libertad creativa y el empoderamiento.",
      morphology: "Formas expansivas y dinámicas de gran escala con volumen. Fusión entre elementos geométricos y orgánicos maleables. Estructuras superpuestas, acumulación de capas, paleta vibrante, saturada y brillante.",
      colors: [
        { name: "Magenta Fluo", hex: "#ff2a5f", pantoneCode: "P 0310", description: "Energía radical" },
        { name: "Amarillo Volt", hex: "#ffdf00", pantoneCode: "P 0700", description: "Luz y alegría" },
        { name: "Celeste Eléc.", hex: "#00f0ff", pantoneCode: "P 2260", description: "Digital puro" },
        { name: "Violeta Intenso", hex: "#7a2aff", pantoneCode: "P 3400", description: "Creatividad" },
        { name: "Verde Neon", hex: "#39ff14", pantoneCode: "P 3640", description: "Vitalidad joven" },
        { name: "Naranja Pop", hex: "#ff6b2b", pantoneCode: "P 0490", description: "Dinamismo" },
      ],
      gallery: [
        "/narrativa/preAdolescentes/Croma Vibrante/croma.webp",
        "/narrativa/preAdolescentes/Croma Vibrante/croma2.jpg",
        "/narrativa/preAdolescentes/Croma Vibrante/croma3.jpg",
        "/narrativa/preAdolescentes/Croma Vibrante/croma4.jpg",
      ],
    },
  ];


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full min-h-screen relative bg-[var(--color-brand-crema)] text-[var(--color-brand-marron-oscuro)] overflow-y-auto overflow-x-clip selection:bg-[var(--color-brand-bordo)] selection:text-[var(--color-brand-crema)] pb-32 pointer-events-auto"
    >
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-[var(--color-brand-bordo)] origin-left z-50"
        style={{ scaleX }}
      />

      {/* Static Brand Backdrop — fondo fijo con colores de marca */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.06, 0.98, 1.04, 1], borderRadius: ["40% 60% 70% 30% / 45% 45% 55% 55%", "65% 35% 50% 50% / 55% 45% 55% 45%", "40% 60% 70% 30% / 45% 45% 55% 55%"] }}
          transition={{ duration: 14, ease: "easeInOut", repeat: Infinity }}
          className="absolute -top-[15%] -left-[10%] w-[70vw] h-[70vw] bg-gradient-to-tr from-[var(--color-brand-bordo)]/15 to-[var(--color-brand-marron-claro)]/10 blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 0.94, 1.08, 0.97, 1], borderRadius: ["50% 50% 30% 70% / 50% 60% 40% 50%", "30% 70% 70% 30% / 50% 30% 70% 50%", "50% 50% 30% 70% / 50% 60% 40% 50%"] }}
          transition={{ duration: 16, ease: "easeInOut", repeat: Infinity, delay: 1 }}
          className="absolute -bottom-[15%] -right-[10%] w-[65vw] h-[65vw] bg-gradient-to-bl from-[var(--color-brand-marron-claro)]/12 to-[var(--color-brand-bordo)]/8 blur-[130px]"
        />
      </div>

      {/* Navigation Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24 mb-12 flex justify-between items-center relative z-10 select-none">
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase opacity-55">REPORTE INTERACTIVO // № 01</span>
      </div>

      {/* ── HERO: MACROTREND ───────────────────────────────────────────────────── */}
      <motion.div
        onViewportEnter={() => setActiveTrendId('aura')}
        viewport={{ amount: 0.3 }}
        className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-12 gap-8 lg:gap-16 items-center mb-40 relative z-10 min-h-[70vh]"
      >
        <div className="col-span-12 lg:col-span-6 flex flex-col justify-center select-none text-left">
          <span className="text-xs font-mono tracking-[0.35em] text-[var(--color-brand-bordo)] uppercase font-semibold mb-4">
            Macrotendencia Rectora
          </span>
          <h1 className="text-5xl sm:text-7xl xl:text-[4.5vw] font-brand tracking-tight text-[var(--color-brand-marron-oscuro)] leading-[0.88] mb-8 uppercase">
            Pre<br /><span className="text-[var(--color-brand-bordo)]">Adolescentes</span>
          </h1>
          <div className="w-16 h-[1px] bg-[var(--color-brand-bordo)]/30 mb-8" />
          <p className="text-2xl sm:text-3xl font-brand italic text-[var(--color-brand-marron-oscuro)]/90 leading-tight mb-8">
            "El ritmo de la conexión y autoexpresión preadolescente."
          </p>
          <p className="text-base leading-relaxed text-[var(--color-brand-marron-oscuro)]/80 max-w-xl">
            Una fuerza en constante movimiento que refleja el cambio, el bienestar y la autoexpresión. Esta investigación recorre tres microtendencias esenciales: Compás Estético, SalusVital y Croma Vibrante.
          </p>
        </div>

        <div className="col-span-12 lg:col-span-6 flex justify-center">
          <TiltContainer className="w-full max-w-[460px] p-4 bg-white/40 backdrop-blur-md border border-[var(--color-brand-marron-claro)]/25 shadow-[0_30px_70px_rgba(146,94,61,0.06)] rounded-sm">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xs bg-[var(--color-brand-crema)] group">
              <img
                src="/narrativa/preAdolescentes/portada.jpg"
                alt="Aura Dinámica - Portada"
                className="w-full h-full object-contain grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out select-none pointer-events-none"
              />
              <div className="absolute inset-0 bg-[var(--color-brand-bordo)]/5 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700" />
            </div>
            <div className="mt-4 flex justify-between items-center text-[10px] font-mono tracking-[0.2em] text-[var(--color-brand-marron-oscuro)]/60 uppercase px-1 select-none">
              <span>ARCHIVO GENERAL</span>
              <span>№ 01 // AURA DINÁMICA</span>
            </div>
          </TiltContainer>
        </div>
      </motion.div>

      {/* ── MICROTREND SECTIONS ────────────────────────────────────────────────── */}
      <div className="w-full relative z-10 space-y-40">
        {sections.map((section, sIdx) => {
          const isAlternate = sIdx % 2 !== 0;

          return (
            <motion.section
              key={section.id}
              id={section.id}
              onViewportEnter={() => setActiveTrendId(section.id)}
              viewport={{ amount: 0.2 }}
              className="w-full border-t border-[var(--color-brand-marron-claro)]/15 pt-24"
            >
              <div className="max-w-7xl mx-auto px-6 md:px-12">

                {/* Section Header (full width) */}
                <div className="mb-16 text-left">
                  <div className="flex items-baseline gap-6 flex-wrap">
                    <span className="text-[10px] font-mono tracking-[0.3em] text-[var(--color-brand-marron-claro)] uppercase">
                      0{sIdx + 1} // {section.subtitle}
                    </span>
                    <span className={`px-2 py-0.5 text-[9px] font-mono tracking-widest font-bold border rounded-sm ${section.badgeStyle}`}>
                      {section.badge}
                    </span>
                  </div>
                  <h2 className="text-5xl md:text-6xl font-brand uppercase text-[var(--color-brand-marron-oscuro)] tracking-tight leading-none mt-3">
                    {section.title}
                  </h2>
                </div>

                {/* Content Row — alternating text / carousel */}
                <div className={`grid grid-cols-12 gap-8 lg:gap-16 items-start mb-20`}>

                  {/* Text Block */}
                  <div className={`col-span-12 lg:col-span-5 text-left ${isAlternate ? 'lg:order-2' : 'lg:order-1'}`}>
                    <p className="text-sm md:text-base leading-relaxed text-[var(--color-brand-marron-oscuro)]/90 mb-8">
                      {section.description}
                    </p>
                    <div className="space-y-3 border-l-2 border-[var(--color-brand-bordo)]/35 pl-4 py-2 mb-6 bg-white/20 rounded-r-xs">
                      <div className="text-[9px] font-mono text-[var(--color-brand-marron-oscuro)]/50 uppercase tracking-widest">Partido Conceptual</div>
                      <div className="text-xs"><strong>Tema:</strong> {section.theme}</div>
                      <div className="text-xs"><strong>Premisa:</strong> {section.premise}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono tracking-wider font-bold uppercase text-[var(--color-brand-bordo)] mb-2">
                        Partido Morfológico:
                      </div>
                      <p className="text-xs md:text-sm leading-relaxed text-[var(--color-brand-marron-oscuro)]/80 italic">
                        {section.morphology}
                      </p>
                    </div>
                  </div>

                  {/* Carousel Block */}
                  <div className={`col-span-12 lg:col-span-7 ${isAlternate ? 'lg:order-1' : 'lg:order-2'}`}>
                    <PhotoCarousel
                      images={section.gallery}
                      title={section.title}
                      trendType={section.id}
                      onImageClick={setLightboxImage}
                    />
                  </div>
                </div>

                {/* Palette — centered, full width */}
                <div className="flex justify-center">
                  <div className="w-full max-w-3xl">
                    <PaletteRow
                      title="Paleta Cromática"
                      trendType={section.id}
                      colors={section.colors}
                    />
                  </div>
                </div>

              </div>
            </motion.section>
          );
        })}
      </div>

      {/* ── CLOSING CTA ────────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 pt-40 pb-20 text-center relative z-10 flex flex-col items-center gap-10 select-none">
        <div className="w-16 h-[1px] bg-[var(--color-brand-marron-claro)]/40" />
        <blockquote className="text-2xl sm:text-4xl font-brand italic text-[var(--color-brand-marron-oscuro)] leading-relaxed max-w-2xl">
          "La estética y el bienestar ya no son elementos aislados; son el lenguaje con el que la juventud dibuja su autenticidad."
        </blockquote>
        <cite className="text-xs font-mono tracking-[0.25em] uppercase text-[var(--color-brand-bordo)] block not-italic -mt-2 font-bold">
          — ARCHIVOS DE TENDENCIAS PREADOLESCENTES
        </cite>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <motion.a
            href="/narrativa/preAdolescentes/reporte.pdf" target="_blank" rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="px-8 py-5 bg-[var(--color-brand-bordo)] text-[var(--color-brand-crema)] text-xs font-mono tracking-[0.3em] uppercase rounded-sm shadow-[0_15px_40px_rgba(132,6,36,0.25)] hover:shadow-[0_20px_50px_rgba(132,6,36,0.35)] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer border border-white/10"
          >
            <BookOpen size={16} /><span>Ver Reporte Completo</span><ArrowUpRight size={16} />
          </motion.a>
          <motion.a
            href="/narrativa/preAdolescentes/resumen.pdf" target="_blank" rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="px-8 py-5 bg-white/60 backdrop-blur-sm text-[var(--color-brand-marron-oscuro)] text-xs font-mono tracking-[0.3em] uppercase rounded-sm border border-[var(--color-brand-marron-claro)]/30 hover:bg-white/80 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
          >
            <BookOpen size={16} /><span>Ver Resumen Ejecutivo</span><ArrowUpRight size={16} />
          </motion.a>
        </div>
      </div>

      {/* ── LIGHTBOX ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-6 cursor-zoom-out"
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 cursor-pointer z-10"
              aria-label="Cerrar"
            >
              <X size={28} />
            </button>
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="relative max-w-full max-h-full flex items-center justify-center"
            >
              <img
                src={lightboxImage} alt="Vista detallada"
                className="max-w-full max-h-[90vh] object-contain rounded-xs border border-white/10 shadow-2xl select-none"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
