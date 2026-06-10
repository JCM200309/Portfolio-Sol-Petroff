import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

interface PhygitalAudiovisualProps {
  onSelectPhoto: (src: string) => void;
}

const phygitalCategories = [
  {
    id: 'concepto-ia',
    title: 'Lenguaje Digital e IA',
    icon: Terminal,
    badge: '01 / CONCEPTO',
    tag: 'Humanidad digitalizada',
    summary: 'Exploramos cómo la inteligencia artificial procesa y replica la existencia humana. La IA actúa como un espejo imperfecto: imita nuestras acciones físicas basándose en patrones matemáticos, pero sufre un cortocircuito absoluto al enfrentarse a la subjetividad, la conciencia y la genuina liberación emocional humana.',
    bullets: [
      'IA como espejo imperfecto de lo orgánico',
      'Conversión de estímulos humanos en matrices de datos',
      'El límite insuperable: la experiencia emocional'
    ],
    images: [
      { src: '/proyectosAudiovisuales/PHYGITAL/Backstage/lenguajeIA/1.jpg', caption: "Perfil de la modelo con superposición de malla digital (wireframe) tridimensional." },
      { src: '/proyectosAudiovisuales/PHYGITAL/Backstage/lenguajeIA/2.jpg', caption: "Macro de ojo con análisis de iris digital y mapeo de malla tridimensional." },
      { src: '/proyectosAudiovisuales/PHYGITAL/Backstage/lenguajeIA/3.jpg', caption: "Estructuras de ADN de vidrio y flores silvestres creciendo sobre el rostro y cuello." },
      { src: '/proyectosAudiovisuales/PHYGITAL/Backstage/lenguajeIA/4.jpg', caption: "Estructuras geométricas de vidrio dicroico envolviendo el rostro como visor holográfico." }
    ]
  },
  {
    id: 'locacion',
    title: 'El Bosque Misterioso',
    icon: Eye,
    badge: '02 / ESCENARIO',
    tag: 'El espejo natural',
    summary: 'La locación representa el contraste máximo: un bosque denso y silvestre que sirve como lienzo para la irrupción tecnológica. Este entorno orgánico actúa como receptor de la presencia digital, acentuando el cortorciduto del personaje replicante en medio de la naturaleza.',
    bullets: [
      'Bosque nativo como interfaz física del duelo',
      'Interacción orgánica entre hojas, ramas y lentes sensores',
      'Simbolismo del bosque como espacio de respuestas internas'
    ],
    images: [
      { src: '/proyectosAudiovisuales/PHYGITAL/Backstage/bosqueMisterioso/2.jpg', caption: "Vista desde una ruina de piedra hacia el bosque, con una huella de mano blanca en la columna y un búnker grafiteado al fondo." },
      { src: '/proyectosAudiovisuales/PHYGITAL/Backstage/bosqueMisterioso/1.jpg', caption: "Estructura de hormigón abandonada con grafitis y vegetación densa en los alrededores." },
      { src: '/proyectosAudiovisuales/PHYGITAL/Backstage/bosqueMisterioso/3.jpg', caption: "Una casa solitaria de dos pisos en un campo de pastizales bajo una densa niebla." }
    ]
  },
  {
    id: 'vestuario',
    title: 'Estilismo & Armadura',
    icon: Shield,
    badge: '03 / VESTUARIO',
    tag: 'Futuro Apocalíptico',
    summary: 'El estilismo contrasta la vulnerabilidad del explorador con la rigidez de la IA. La vestimenta de la réplica evoca un porvenir distópico y frío, repleto de patrones de código, mientras que el explorador se vale de lentes de tracking que deconstruyen la mirada tradicional.',
    bullets: [
      'Goggles especiales de rastreo digital',
      'Réplica envuelta en patrones de código vivo',
      'Texturas pesadas, capas asimétricas y funcionalidad urbana'
    ],
    images: [
      { src: '/proyectosAudiovisuales/PHYGITAL/Backstage/estilismo/1.jpg', caption: "Modelo vestida de negro con visor futurista, rodeada de cables negros enredados ante un fondo plástico." },
      { src: '/proyectosAudiovisuales/PHYGITAL/Backstage/estilismo/3.jpg', caption: "Cables negros enrollados y auriculares de diadema sobre el suelo de hormigón agrietado en el set." },
      { src: '/proyectosAudiovisuales/PHYGITAL/Backstage/estilismo/2.jpg', caption: "Modelo vistiendo un vestido de textura de metal líquido o cromo con reflejos fluidos." },
      { src: '/proyectosAudiovisuales/PHYGITAL/Backstage/estilismo/4.jpg', caption: "Modelo sentada en una silla cromada de diseño, con botas altas de tacón y paneles estriados transparentes de fondo." }
    ]
  }
];

interface ImageCarouselProps {
  images: { src: string; caption: string }[];
  onSelectPhoto: (src: string) => void;
}

function ImageCarousel({ images, onSelectPhoto }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVertical, setIsVertical] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  if (!images || images.length === 0) return null;

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setIsVertical(naturalWidth < naturalHeight);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div 
        className="relative w-full overflow-hidden border border-[var(--color-brand-marron-claro)]/25 shadow-md rounded-xs bg-black/[0.02] group select-none transition-all duration-500 ease-in-out mx-auto"
        style={{
          aspectRatio: isVertical ? '3/4' : '16/10',
          maxWidth: isVertical ? '450px' : '100%',
        }}
      >
        
        {/* Slides */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="w-full h-full flex items-center justify-center cursor-zoom-in pointer-events-auto"
            onClick={() => onSelectPhoto(images[currentIndex].src)}
          >
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].caption}
              onLoad={handleImageLoad}
              className="w-full h-full object-contain p-2 select-none pointer-events-none"
              draggable="false"
              loading="lazy"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white border border-[var(--color-brand-marron-claro)]/20 text-[var(--color-brand-marron-oscuro)] hover:text-[var(--color-brand-bordo)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md z-20 cursor-pointer pointer-events-auto"
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white border border-[var(--color-brand-marron-claro)]/20 text-[var(--color-brand-marron-oscuro)] hover:text-[var(--color-brand-bordo)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md z-20 cursor-pointer pointer-events-auto"
              aria-label="Siguiente imagen"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Counter Badge */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono tracking-widest px-2.5 py-1 rounded-full border border-white/10 z-20">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Caption & Zoom indicator */}
      <div className="flex justify-between items-center px-1 font-mono text-[9px] text-[var(--color-brand-marron-oscuro)]/70 text-left">
        <span className="font-sans text-[11px] font-medium italic text-[var(--color-brand-marron-oscuro)]/90 truncate max-w-[75%]">
          {images[currentIndex].caption}
        </span>
        <span className="uppercase tracking-widest font-semibold shrink-0">
          [ CLIC PARA AMPLIAR ]
        </span>
      </div>
    </div>
  );
}

export default function PhygitalAudiovisual({ onSelectPhoto }: PhygitalAudiovisualProps) {
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'SYSTEM INITIALIZED',
    'SCANNING ENVIRONMENT...',
    'READY TO DETECT DIGITAL SIGNALS'
  ]);
  const [hoveredData, setHoveredData] = useState<string>('SYS: STANDBY');

  const updateTelemetry = (section: string) => {
    let logMsg = '';
    let dataMsg = '';
    switch (section) {
      case 'concepto-ia':
        logMsg = 'AI_COGNITIVE_CHECK: DETECTING REPLICANT LOGIC... STATUS: CRITICAL ERROR IN EMOTIONAL BUFFER';
        dataMsg = 'AI_STABILITY: 34.2% [REPLICATION FAILED]';
        break;
      case 'locacion':
        logMsg = 'GEO_SCAN: LOC ZÁRATE FOREST // LAT 34.1202 S // LON 59.0125 W // BIOME: ORGANIC';
        dataMsg = 'SIGNAL_DECAY: 12% [ORGANIC INTERFERENCE]';
        break;
      case 'vestuario':
        logMsg = 'HARDWARE_DETECT: OPTICAL SENSORS INITIATED // PATTERN RECOGNITION: DISTOPIAN CLOTHING';
        dataMsg = 'GLASSES_TRACKING: active [120fps]';
        break;
      default:
        logMsg = 'SCANNER_IDLE: STANDBY';
        dataMsg = 'SYS: STANDBY';
    }

    setTerminalLogs(prev => [...prev.slice(-3), logMsg]);
    setHoveredData(dataMsg);
  };

  return (
    <div className="w-full py-24 bg-black/[0.01] border-t border-[var(--color-brand-marron-claro)]/25 relative pointer-events-auto select-none font-sans text-[var(--color-brand-marron-oscuro)]">
      
      {/* Editorial Header */}
      <div className="mb-20 grid grid-cols-1 md:grid-cols-12 gap-8 items-end border-b border-[var(--color-brand-marron-claro)]/10 pb-12">
        <div className="md:col-span-8 text-left">
          <span className="text-[10px] md:text-[11px] font-mono tracking-[0.35em] text-[var(--color-brand-bordo)] uppercase font-bold">
            PROCESO CREATIVO & INTERSECCIÓN DIGITAL
          </span>
          <h3 className="font-brand text-4xl sm:text-5xl uppercase tracking-wider text-[var(--color-brand-marron-oscuro)] mt-2 mb-4">
            Bitácora de Datos
          </h3>
          <p className="text-sm font-sans tracking-wide leading-relaxed text-[var(--color-brand-marron-oscuro)]/80 max-w-2xl text-left">
            Phygital materializa la inmaterialidad de la inteligencia artificial. A través de la dirección de arte real en un bosque analógico, se crea una confrontación simbólica entre la simulación algorítmica y la liberación humana.
          </p>
        </div>

        {/* INTERACTIVE TELEMETRY SCREEN */}
        <div className="md:col-span-4 w-full bg-white/40 border border-[var(--color-brand-marron-claro)]/25 rounded-xs p-4 font-mono text-[9px] text-[var(--color-brand-marron-oscuro)] shadow-sm flex flex-col justify-between min-h-[120px] text-left">
          <div className="flex justify-between items-center border-b border-[var(--color-brand-marron-claro)]/20 pb-1.5 mb-2">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-bordo)] animate-pulse" />
              DATALOGGER.SYS
            </span>
            <span className="text-[8px] opacity-70">COORD: 34-S / 59-W</span>
          </div>
          <div className="flex-1 space-y-1 opacity-90 overflow-hidden font-mono">
            {terminalLogs.map((log, i) => (
              <div key={i} className="truncate select-none">
                <span className="text-[var(--color-brand-bordo)]/50 mr-1">&gt;</span> {log}
              </div>
            ))}
          </div>
          <div className="border-t border-[var(--color-brand-marron-claro)]/20 pt-1.5 mt-2 flex justify-between text-[8px] font-bold">
            <span>TELEMETRY: ACTIVE</span>
            <span className="animate-pulse">{hoveredData}</span>
          </div>
        </div>
      </div>

      {/* Vertical Stack of Editorial Sections */}
      <div className="space-y-32">
        {phygitalCategories.map((cat, idx) => {
          const IconComp = cat.icon;
          const isEven = idx % 2 === 0;

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 55 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              onViewportEnter={() => updateTelemetry(cat.id)}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start py-4"
            >
              {/* Left/Right Narrative Text */}
              <div className={`col-span-12 lg:col-span-4 flex flex-col justify-between ${
                isEven ? 'lg:order-1' : 'lg:order-2'
              }`}>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[32px] sm:text-[40px] font-brand font-light text-[var(--color-brand-bordo)]/30 leading-none">
                      {cat.badge.split(' / ')[0]}
                    </span>
                    <div className="w-8 h-[1px] bg-[var(--color-brand-bordo)]/20" />
                    <span className="text-[9px] font-mono tracking-[0.25em] text-[var(--color-brand-marron-oscuro)]/60 uppercase">
                      {cat.badge.split(' / ')[1]}
                    </span>
                  </div>
                  
                  <h4 className="font-brand text-3xl sm:text-4xl uppercase tracking-wide text-[var(--color-brand-marron-oscuro)] mb-4 flex items-center gap-3 text-left">
                    {cat.title}
                    <IconComp size={22} className="text-[var(--color-brand-bordo)]" />
                  </h4>
                  
                  <span className="text-[10px] font-sans tracking-widest uppercase font-bold text-[var(--color-brand-bordo)] block mb-3 text-left">
                    [ {cat.tag} ]
                  </span>

                  <div className="w-12 h-[1.5px] bg-[var(--color-brand-bordo)]/30 my-4" />
                  
                  <p className="text-base md:text-lg leading-relaxed text-[var(--color-brand-marron-oscuro)]/90 mb-6 font-sans text-left">
                    {cat.summary}
                  </p>

                  <ul className="space-y-4 mt-4 text-left">
                    {cat.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm md:text-base text-[var(--color-brand-marron-oscuro)]/85">
                        <span className="text-[var(--color-brand-bordo)] mt-1.5 font-bold font-mono">■</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-[var(--color-brand-marron-claro)]/15 flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-[var(--color-brand-marron-oscuro)]/50">
                  <span>№02 // PHYGITAL</span>
                  <span>{`[ ${cat.images.length} ARCHIVOS ]`}</span>
                </div>
              </div>

              {/* Alternate Column: Inline Interactive Images */}
              <div className={`col-span-12 lg:col-span-8 min-h-[300px] flex flex-col justify-center w-full ${
                isEven ? 'lg:order-2' : 'lg:order-1'
              }`}>
                <ImageCarousel images={cat.images} onSelectPhoto={onSelectPhoto} />
              </div>
            </motion.div>
          );
        })}
      </div>

      

    </div>
  );
}
