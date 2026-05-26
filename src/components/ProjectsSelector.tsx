import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface CategoryItem {
  id: 'escena' | 'movimiento' | 'narrativa';
  num: string;
  title: string;
  subtitle: string;
  videoSrc: string;
  link: string;
  bgHex: string; // The color to morph the section background to on hover
  filterClass?: string; // Optional custom video filter
}

interface CategoryCardProps {
  cat: CategoryItem;
  isHovered: boolean;
  isAnyHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  cardVariants: any;
}

function CategoryCard({
  cat,
  isHovered,
  isAnyHovered,
  onMouseEnter,
  onMouseLeave,
  cardVariants
}: CategoryCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMovimiento = cat.id === 'movimiento';

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isHovered) {
      video.play().catch((err) => {
        console.warn("Autoplay prevented or video load failed:", err);
      });
    } else {
      video.pause();
      if (video.readyState >= 1) {
        video.currentTime = 0;
      }
    }
  }, [isHovered]);

  return (
    <motion.a
      href={cat.link}
      variants={cardVariants}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`relative w-full aspect-[16/10] bg-transparent border border-[var(--color-brand-marron-oscuro)]/30 rounded-sm overflow-hidden cursor-pointer shadow-[0_12px_40px_rgba(0,0,0,0.01)] transition-all duration-500 ease-out flex flex-col justify-between p-6 md:p-8 pointer-events-auto ${
        isMovimiento ? 'md:col-span-2 md:aspect-[24/10] md:max-w-2xl justify-self-center' : ''
      }`}
      style={{
        borderColor: isHovered ? 'var(--color-brand-bordo)' : undefined,
        boxShadow: isHovered ? '0 25px 60px rgba(132, 6, 36, 0.12)' : undefined,
        transform: isHovered ? 'scale(1.03)' : undefined,
        opacity: isAnyHovered && !isHovered ? 0.45 : 1
      }}
      role="button"
      aria-label={`Explorar categoría ${cat.title}`}
    >
      {/* Background Video (plays/unveils on hover) */}
      <div className="absolute inset-0 z-0 transition-opacity duration-700 overflow-hidden">
        <video
          ref={videoRef}
          src={cat.videoSrc}
          muted
          loop
          playsInline
          preload="metadata"
          className={`w-full h-full object-cover transition-all duration-700 scale-105 ${
            isHovered ? 'opacity-85 scale-100' : 'opacity-10 scale-105'
          } ${cat.filterClass || ''}`}
        />
        {/* Subtle dark overlay on hover to ensure text legibility */}
        <div
          className={`absolute inset-0 bg-black/20 transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Card Top Section: Category Number */}
      <span
        className={`text-xs font-sans tracking-[0.25em] font-medium transition-colors duration-500 z-10 ${
          isHovered ? 'text-[var(--color-brand-crema)]' : 'text-[var(--color-brand-marron-claro)]'
        }`}
      >
        {cat.num}
      </span>

      {/* Card Bottom Section: Title & Subtitle */}
      <div className="z-10 select-none flex flex-col justify-end">
        <h3
          className={`font-brand leading-none tracking-tight uppercase transition-all duration-500 ${
            isHovered 
              ? 'text-[var(--color-brand-crema)] text-3xl md:text-5xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]' 
              : 'text-[var(--color-brand-marron-oscuro)] text-2xl md:text-4xl'
          }`}
        >
          {cat.title}
        </h3>

        {/* Subtitle / Description - morphs height on hover */}
        <motion.div
          initial={false}
          animate={isHovered ? { height: 'auto', opacity: 0.85, marginTop: 12 } : { height: 0, opacity: 0, marginTop: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <p className="text-xs md:text-sm font-sans tracking-wide text-[var(--color-brand-crema)] font-light leading-relaxed max-w-md drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            {cat.subtitle}
          </p>
        </motion.div>
      </div>

      {/* Subtle border shine effect */}
      <div className="absolute inset-0 pointer-events-none rounded-sm border border-white/5 z-20" />
    </motion.a>
  );
}

export default function ProjectsSelector() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const categories: CategoryItem[] = [
    {
      id: 'escena',
      num: '01',
      title: 'Producciones',
      subtitle: 'Dirección de arte, fotografía y escenografía editorial',
      videoSrc: 'https://res.cloudinary.com/djekqr2ww/video/upload/q_auto,f_auto/v1779807431/videoHero_otcgjv.mp4',
      link: '#escena',
      bgHex: 'rgba(132, 6, 36, 0.06)' // Soft bordo tint
    },
    {
      id: 'narrativa',
      num: '02',
      title: 'Narrativa',
      subtitle: 'Espacios interactivos de experimentación conceptual',
      videoSrc: 'https://res.cloudinary.com/djekqr2ww/video/upload/q_auto,f_auto/v1779807431/videoHero_otcgjv.mp4',
      link: '#narrativa',
      bgHex: 'rgba(146, 94, 61, 0.12)', // Soft marron-oscuro tint
      
    },
    {
      id: 'movimiento',
      num: '03',
      title: 'Audiovisuales',
      subtitle: 'Fashion films y dirección de arte en movimiento',
      videoSrc: 'https://res.cloudinary.com/djekqr2ww/video/upload/q_auto,f_auto/v1779807431/videoHero_otcgjv.mp4',
      link: '#movimiento',
      bgHex: 'rgba(190, 158, 137, 0.2)', // Soft marron-claro tint
      filterClass: 'grayscale contrast-[1.1] brightness-[0.9]' // Grayscale filter to differentiate
    }
  ];

  // Map active background color
  const activeCategory = categories.find(c => c.id === hoveredId);
  const currentBgColor = activeCategory ? activeCategory.bgHex : 'var(--color-brand-crema)';

  // Staggered card parent transition variants
  const parentVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as any
      }
    }
  };

  return (
    <section
      id="proyectos"
      ref={containerRef}
      className="relative w-full h-full min-h-screen pt-28 pb-12 md:pt-32 md:pb-16 px-6 md:px-16 flex flex-col justify-center items-center overflow-hidden transition-colors duration-[800ms] ease-out"
      style={{ backgroundColor: currentBgColor }}
    >
      {/* Noise background overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Top Section Header */}
      <span className="absolute top-28 left-6 md:left-12 text-[9px] tracking-[0.32em] uppercase text-[var(--color-brand-marron-claro)] font-sans pointer-events-none select-none">
        Categorías
      </span>

      {/* Main Container */}
      <div className="w-full max-w-5xl flex-grow flex flex-col justify-center z-10">
        {/* Section Header Text */}
        <div className="w-full text-center md:text-left mb-8 md:mb-12 select-none">
          <h2 className="text-4xl md:text-6xl font-brand text-[var(--color-brand-marron-oscuro)] tracking-tight uppercase leading-none">
            Proyectos
          </h2>
          <p className="text-[10px] font-sans tracking-[0.25em] text-[var(--color-brand-marron-claro)] uppercase mt-3">
            Selecciona una categoría para explorar la obra en detalle
          </p>
        </div>

        {/* Asymmetrical Grid of Cards */}
        <motion.div
          variants={parentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 w-full"
        >
          {categories.map((cat) => {
            const isHovered = hoveredId === cat.id;
            const isAnyHovered = hoveredId !== null;

            return (
              <CategoryCard
                key={cat.id}
                cat={cat}
                isHovered={isHovered}
                isAnyHovered={isAnyHovered}
                onMouseEnter={() => setHoveredId(cat.id)}
                onMouseLeave={() => setHoveredId(null)}
                cardVariants={cardVariants}
              />
            );
          })}
        </motion.div>
      </div>

      {/* Floating Section Marker Dots */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-none z-10">
        <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${hoveredId === 'escena' ? 'bg-[var(--color-brand-bordo)] scale-150' : 'bg-[var(--color-brand-marron-claro)]/40'}`} />
        <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${hoveredId === 'movimiento' ? 'bg-[var(--color-brand-bordo)] scale-150' : 'bg-[var(--color-brand-marron-claro)]/40'}`} />
        <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${hoveredId === 'narrativa' ? 'bg-[var(--color-brand-bordo)] scale-150' : 'bg-[var(--color-brand-marron-claro)]/40'}`} />
      </div>
    </section>
  )
}
