import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ProjectVideoOverlay from './ProjectVideoOverlay';

interface ProjectDetails {
  year: string;
  category: string;
  duration: string;
}

interface ProjectItem {
  num: string;
  image: string;
  video: string;
  link: string;
  title: string;
  description: string;
  longDescription: string;
  featured?: boolean;
  details: ProjectDetails;
}

const projectItems: ProjectItem[] = [
  {
    num: '01',
    image: '/proyectosAudiovisuales/neoTrattoriaPortada.JPG',
    video: 'https://res.cloudinary.com/djekqr2ww/video/upload/q_auto,f_auto/v1779807798/Neotrattoria_l9ww3b.mp4',
    link: '#',
    title: 'Neo Trattoria',
    description: 'Estudio de espacio',
    featured: true,
    longDescription: 'Este fashion film traduce la macro tendencia Neo Trattoria en una experiencia audiovisual que explora la dualidad de lo orgánico y lo estructural. A través de la luz, el ritmo y la composición se busca reflejar la tensión entre lo tradicional y lo contemporáneo, lo sobrio y lo vibrante. Se encuentran lo Racing y el lujo, y las formas fluidas, la repetición y la superposición construyen una atmosfera sensorial donde lo íntimo y lo expansivo conviven, evocando una nostalgia vibrante que habita entre pasado y presente.',
    details: { year: '2025', category: 'Spatial Design & Video Art', duration: '02:15' },
  },
  {
    num: '02',
    image: '/proyectosAudiovisuales/PHYGITALPortada.jpg',
    video: 'https://res.cloudinary.com/djekqr2ww/video/upload/q_auto,f_auto/v1779807457/phygital_uteyjf.mp4',
    link: '#',
    title: 'Phygital',
    description: 'Intersección digital',
    longDescription: 'Este proyecto explora la intersección entre lo físico y lo digital, creando un encuentro tangible con la inteligencia artificial. Sin recurrir a recursos digitales en postproducción, la obra traduce la estética digital a elements físicos, generando experiencias que evocan interfaces, algoritmos y mundos virtuales a través de objetos, texturas y composiciones en el espacio real. La propuesta busca que lo tecnológico se sienta cercano y material, transformando conceptos abstractos en sensaciones físicas y visuales concretas.',
    details: { year: '2025', category: 'Interactive Performance', duration: '01:50' },
  },
  {
    num: '03',
    image: '/proyectosAudiovisuales/objetoAntiModaPortada.jpg',
    video: 'https://res.cloudinary.com/djekqr2ww/video/upload/q_auto,f_auto/v1779807465/objetoAntiModa_snve1a.mp4',
    link: '#',
    title: 'Objeto Anti-Moda',
    description: 'Diseño y estructura',
    longDescription: 'En este proyecto se tomó como inspiración un "objeto anti moda" para construir una narrativa y un universo visual. El objeto es una manta de sirena y la inspiración el surrealismo, donde se exploran aspectos profundos e irracionales de la mente, el inconsciente y los sueños como vías para acceder a una realidad mas autentica. Se refleja el anhelo utópico y una identidad onírica.',
    details: { year: '2024', category: 'Fashion & Sculpture', duration: '01:10' },
  },
  {
    num: '04',
    image: '/proyectosAudiovisuales/espejismoDelLujoPortada.jpg',
    video: 'https://res.cloudinary.com/djekqr2ww/video/upload/q_auto,f_auto/v1779807462/espejismoDelLujo_ntudmk.mp4',
    link: '#',
    title: 'Espejismo del Lujo',
    description: 'Performance conceptual',
    longDescription: 'Este fashion film reflexiona sobre la paradoja del lujo contemporáneo: cuando lo aspiracional se convierte en un exceso vacío. Cada escena, situada en espacios domésticos y pulcros, revela la tensión entre lo real y lo ilusorio, entre la abundancia y el vacío. Se propone una mirada crítica e irónica sobre el consumo y el deseo, exponiendo la fragilidad del valor que otorgamos a las apariencias.',
    details: { year: '2025', category: 'Concept & Performance', duration: '01:45' },
  },
];

// ─── Secondary item ───────────────────────────────────────────────────────────

interface SecondaryItemProps {
  item: ProjectItem;
  isHovered: boolean;
  isAnyHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  isLast: boolean;
}

function SecondaryProjectItem({
  item,
  isHovered,
  isAnyHovered,
  onHover,
  onLeave,
  onClick,
  isLast,
}: SecondaryItemProps) {
  return (
    <div
      className={`flex-1 relative cursor-pointer overflow-hidden${!isLast ? ' border-b border-r md:border-r-0 md:border-b border-[#be9e89]/25' : ''}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`Ver proyecto ${item.title}`}
    >
      {/* Always-present full-image background */}
      <img
        src={item.image}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out will-change-transform"
        style={{ transform: isHovered ? 'scale(1.07)' : 'scale(1.02)' }}
      />

      {/* Dark overlay — lighter on hover, slightly darker if another item is hovered */}
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{
          backgroundColor: isHovered
            ? 'rgba(0,0,0,0.32)'
            : isAnyHovered
            ? 'rgba(0,0,0,0.68)'
            : 'rgba(0,0,0,0.52)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-4 md:p-5">
        <span className="text-[10px] font-sans tracking-[0.22em] uppercase text-white/35 transition-colors duration-300">
          {item.num}
        </span>

        <div>
          <h3
            className="font-brand leading-[1] text-white transition-all duration-300"
            style={{
              fontSize: 'clamp(1rem, 2.2vw, 1.5rem)',
              opacity: isAnyHovered && !isHovered ? 0.55 : 1,
            }}
          >
            {item.title}
          </h3>
          <p
            className="text-white/58 text-[11px] font-sans mt-1.5 transition-all duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateY(0)' : 'translateY(4px)',
            }}
          >
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const featured = projectItems[0];
  const secondary = projectItems.slice(1);
  const isFeaturedHovered = hoveredId === 'featured';
  const isAnySecondaryHovered = secondary.some((item) => hoveredId === item.num);

  return (
    <section
      id="movimiento"
      className="h-full w-full relative overflow-hidden bg-[var(--color-brand-crema)]"
    >
      {/* Back Button */}
      <a 
        href="#proyectos"
        className="fixed top-24 left-6 md:left-12 z-50 flex items-center gap-2 text-[10px] font-sans tracking-[0.2em] uppercase text-[var(--color-brand-crema)] bg-[var(--color-brand-bordo)] hover:bg-[var(--color-brand-bordo)]/90 hover:scale-[1.03] active:scale-97 px-5 py-2.5 rounded-full transition-all duration-300 shadow-md cursor-pointer z-50"
      >
        ← Volver
      </a>

      {/* Section label */}
      <span className="absolute top-32 left-6 md:left-12 z-20 text-[9px] tracking-[0.32em] uppercase text-[var(--color-brand-marron-claro)] font-sans pointer-events-none select-none">
        Proyectos Audiovisuales
      </span>

      <div className="h-full w-full pt-[80px] md:pt-[114px] flex flex-col md:flex-row">
        {/* ── Featured project — left 62% ── */}
        <div
          className="relative h-[58%] md:h-full cursor-pointer overflow-hidden"
          style={{ flex: '62' }}
          onMouseEnter={() => setHoveredId('featured')}
          onMouseLeave={() => setHoveredId(null)}
          onClick={() => setSelectedProject(featured)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setSelectedProject(featured)}
          aria-label={`Ver proyecto destacado ${featured.title}`}
        >
          {/* Background image */}
          <img
            src={featured.image}
            alt={featured.title}
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[1100ms] ease-out will-change-transform"
            style={{ transform: isFeaturedHovered ? 'scale(1.05)' : 'scale(1.01)' }}
          />

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/18 to-black/8" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/15 to-transparent" />

          {/* Giant watermark number */}
          <span
            className="absolute top-4 right-5 font-brand leading-none text-white select-none pointer-events-none transition-opacity duration-700"
            style={{
              fontSize: 'clamp(6rem, 18vw, 16rem)',
              opacity: isFeaturedHovered ? 0.04 : 0.07,
            }}
          >
            01
          </span>

          {/* Dim overlay when secondary is hovered */}
          <div
            className="absolute inset-0 bg-black/0 transition-colors duration-500 pointer-events-none"
            style={{ backgroundColor: isAnySecondaryHovered ? 'rgba(0,0,0,0.25)' : 'transparent' }}
          />

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-7 md:p-10 lg:p-14">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[9px] uppercase tracking-[0.28em] text-white/50 font-sans">
                {featured.details.year}
              </span>
              <div className="w-8 h-px bg-white/22" />
              <span className="text-[9px] uppercase tracking-[0.14em] text-white/38 font-sans">
                {featured.details.category}
              </span>
            </div>

            <h2
              className="font-brand text-white leading-[0.88] tracking-tight mb-3"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 6.5rem)' }}
            >
              {featured.title}
            </h2>

            <p className="text-white/55 text-sm font-sans tracking-wide max-w-sm">
              {featured.description}
            </p>
          </div>

          {/* Play button — appears on hover */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border border-white/45 backdrop-blur-sm bg-white/10 transition-all duration-400"
            style={{
              width: '72px',
              height: '72px',
              opacity: isFeaturedHovered ? 1 : 0,
              transform: `translate(-50%, -50%) scale(${isFeaturedHovered ? 1 : 0.72})`,
            }}
          >
            <svg
              className="w-6 h-6 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* ── Secondary projects — right 38% ── */}
        <div
          className="flex-[38] h-[42%] md:h-full flex flex-row md:flex-col border-t md:border-t-0 md:border-l border-[#be9e89]/22"
        >
          {secondary.map((item, i) => (
            <SecondaryProjectItem
              key={item.num}
              item={item}
              isHovered={hoveredId === item.num}
              isAnyHovered={hoveredId !== null}
              onHover={() => setHoveredId(item.num)}
              onLeave={() => setHoveredId(null)}
              onClick={() => setSelectedProject(item)}
              isLast={i === secondary.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Video overlay */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectVideoOverlay
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
