import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, MapPin, Layers, Sparkles, Music, Volume2, VolumeX, Folder, ArrowRight, Play, Pause } from 'lucide-react';

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
}

interface ProjectVideoOverlayProps {
  project: ProjectItem | null;
  onClose: () => void;
}

// --- HELPER CLASS: Web Audio API Backstage Ambient Synth ---
class BackstageAudioSynth {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private gainNode: GainNode | null = null;
  private audio: HTMLAudioElement | null = null;
  private audioSource: MediaElementAudioSourceNode | null = null;

  constructor() {}

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.1, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
  }

  setVolume(vol: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(vol * 0.15, this.ctx.currentTime);
    }
    if (this.audio) {
      this.audio.volume = vol;
    }
  }

  play(channel?: string) {
    this.stop();
    this.init();
    
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = true;

    if (!this.audio) {
      this.audio = new Audio('/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/Sonido Musica y clima sonoro/Auxiliary Tha Masterfader - Disco Dictator [Luke Million Remix].mp3');
      this.audio.loop = true;
      if (this.ctx && this.gainNode) {
        try {
          this.audioSource = this.ctx.createMediaElementSource(this.audio);
          this.audioSource.connect(this.gainNode);
        } catch (e) {
          console.warn("Failed to create media source, connecting directly to speakers:", e);
        }
      }
    }
    
    this.audio.play().catch(err => {
      console.warn("Audio play prevented:", err);
    });
  }

  stop() {
    this.isPlaying = false;
    if (this.audio) {
      this.audio.pause();
    }
  }
}

const backstageAudio = new BackstageAudioSynth();

const backstageCategories = [
  {
    id: 'desglose',
    title: 'Desglose Conceptual',
    icon: BookOpen,
    badge: '01 / CONCEPTO',
    tag: 'Hibridación y memoria',
    summary: 'Releemos la tradición de la italianidad para habitarla desde lo sensible, lo plural y lo presente. En el contexto argentino contemporáneo, la memoria de los inmigrantes se resignifica no como copia, sino como un eco afectivo en tensión.',
    bullets: [
      'Eco de la italianidad tradicional en Argentina',
      'Hibridación Estética: mezcla de lo popular y lo clásico',
      'Resignificación de espacios afectivos comunes'
    ],
    images: [
      { src: '/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/Desglose conceptual/1.png', caption: 'Esquema de morfología e identidad de marca.' },
      { src: '/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/Desglose conceptual/2.png', caption: 'Definición cromática y contraste de texturas.' },
      { src: '/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/Desglose conceptual/3.webp', caption: 'Boceto espacial e inspiración de encuadre.' }
    ]
  },
  {
    id: 'locacion',
    title: 'Escenario y Locación',
    icon: MapPin,
    badge: '02 / SET DE RODAJE',
    tag: 'Terminal de Zárate',
    summary: 'Buscamos una espacialidad que transmitiera amplitud y tradición urbana. La arquitectura brutalista de la terminal, combinada con elementos de estética racing y el dinamismo cotidiano de la terminal, crea una atmósfera puramente cinematográfica.',
    bullets: [
      'Locación: Terminal de Ómnibus de Zárate',
      'Contraste brutalista de hormigón con elementos íntimos',
      'Sensación de tránsito, espera y nostalgia en el encuadre'
    ],
    images: [
      { src: '/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/Locacion/locacion.png', caption: 'Reconocimiento de luces y ángulos en terminal.' },
      { src: '/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/Locacion/locacion2.webp', caption: 'Configuración espacial de la locación.' }
    ]
  },
  {
    id: 'elementos',
    title: 'Morfología y Objetos',
    icon: Layers,
    badge: '03 / DIRECCIÓN DE ARTE',
    tag: 'El ritual cotidiano',
    summary: 'Los objetos cargan con una dimensión ornamental y metafórica del vínculo. La pasta evoca la reunión dominical y los lazos familiares; la vajilla y la mesa con mantel a cuadros apelan a una memoria colectiva compartida.',
    bullets: [
      'La pasta como metáfora del lazo familiar y ritual dominical',
      'Objetos cotidianos con carga afectiva y ornamental',
      'Morfología de curvas fluidas y repetición simétrica'
    ],
    images: [
      { src: '/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/Elementos/mesaMantel.png', caption: 'Mesa puesta con mantel clásico a cuadros.' },
      { src: '/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/Elementos/pasta.webp', caption: 'Pasta fresca como elemento central del ritual.' },
      { src: '/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/Elementos/vajilla.png', caption: 'Detalle de vajilla retro ornamentada.' }
    ]
  },
  {
    id: 'estilismo',
    title: 'Maquillaje y Peinados',
    icon: Sparkles,
    badge: '04 / ESTILISMO',
    tag: 'Retratos y estilismo del rostro',
    summary: 'La propuesta visual se completa con un estilismo de gran teatralidad italiana. En maquillaje predomina la piel glowy, ojos y cejas fuertemente definidos y labios delineados en tonos encendidos. En peinado se fusionan pañuelos de seda con recogidos y ondas retro elegantes.',
    bullets: [
      'Makeup: Rubor cálido, cejas y ojos marcados, piel glowy',
      'Hair: Pañuelos de seda, peinados recogidos clásicos y ondas marcadas',
      'Tensión estética entre el glamour clásico y la dureza urbana'
    ],
    images: [
      { src: '/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/Maquillaje/maquillaje1.jpg', caption: 'Pruebas de makeup.' },
      { src: '/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/Maquillaje/maquillaje2.webp', caption: 'Labios delineados en contraste.' },
      { src: '/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/Maquillaje/maquillaje3.jpg', caption: 'Sesión de retoques en set.' },
      { src: '/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/Peinados/ondas.webp', caption: 'Detalle de peinado con ondas pulidas.' },
      { src: '/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/Peinados/pañuelo.jpg', caption: 'Pañuelo de seda retro.' },
      { src: '/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/Peinados/recogidos.jpg', caption: 'Recogido clásico para el shoot.' }
    ]
  },
  {
    id: 'sonido',
    title: 'Clima Sonoro y Música',
    icon: Music,
    badge: '05 / ATMÓSFERA',
    tag: 'Italo-Disco',
    summary: 'El universo sensorial de Neo Trattoria se sostiene en su pulso electrónico repetitivo. La música conecta la herencia de la italianidad con fantasías de un futuro cercano mediante el remix de Disco Dictator.',
    bullets: [
      'Ritmo bailable y sintetizado del Italo-Disco de los 80',
      'Auxiliary Tha Masterfader - Disco Dictator [Luke Million Remix]',
      'El sonido como puente emocional con el espectador'
    ],
    images: [
      { src: '/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/Sonido Musica y clima sonoro/disco.webp', caption: 'Portada oficial de Disco Dictator [Luke Million Remix]' }
    ]
  }
];

const EqualizerBar = ({ active }: { active: boolean }) => {
  return (
    <div className="flex gap-[3px] items-end h-8 w-16 justify-center">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 bg-[var(--color-brand-bordo)] rounded-t-sm"
          animate={active ? {
            height: [8, 28, 12, 32, 16, 24, 8][(i + Math.floor(Math.random() * 4)) % 7]
          } : {
            height: 4
          }}
          transition={active ? {
            repeat: Infinity,
            duration: 0.6 + i * 0.1,
            ease: 'easeInOut'
          } : {
            duration: 0.3
          }}
        />
      ))}
    </div>
  );
};



export default function ProjectVideoOverlay({ project, onClose }: ProjectVideoOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isNeoTrattoria = project?.title === 'Neo Trattoria';

  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveredVideo, setIsHoveredVideo] = useState(false);

  // Backstage UI States
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isPlayingSynth, setIsPlayingSynth] = useState(false);
  const [synthChannel, setSynthChannel] = useState<'disco' | 'cafe' | 'motor'>('disco');
  const [synthVolume, setSynthVolume] = useState(0.5);
  const [selectedStylingTab, setSelectedStylingTab] = useState<'makeup' | 'hair'>('makeup');
  const [inlinePreviews, setInlinePreviews] = useState<Record<string, string | null>>({});

  // Setup synth volume listener
  useEffect(() => {
    if (isNeoTrattoria) {
      backstageAudio.setVolume(synthVolume);
    }
  }, [synthVolume, isNeoTrattoria]);

  // Cleanup synth on unmount
  useEffect(() => {
    return () => {
      backstageAudio.stop();
    };
  }, []);

  const handleTogglePlaySynth = () => {
    if (isPlayingSynth) {
      backstageAudio.stop();
      setIsPlayingSynth(false);
    } else {
      backstageAudio.play(synthChannel);
      setIsPlayingSynth(true);
    }
  };

  const handleChangeChannel = (channel: 'disco' | 'cafe' | 'motor') => {
    setSynthChannel(channel);
    if (isPlayingSynth) {
      backstageAudio.play(channel);
    }
  };

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
    if (!isNeoTrattoria || !videoRef.current) return;
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
        className={`fixed inset-0 z-45 bg-[var(--color-brand-crema)] backdrop-blur-xl text-black select-none pointer-events-auto ${
          isNeoTrattoria ? 'overflow-y-auto block' : 'flex items-center justify-center'
        }`}
      >
        {/* Floating Back Button (only shown for other projects; Neo Trattoria uses the global Navbar) */}
        {!isNeoTrattoria && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.2 }}
            onClick={onClose}
            className="absolute top-6 left-6 z-50 flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-black/15 bg-white/80 text-[var(--color-brand-marron-oscuro)] hover:bg-[var(--color-brand-bordo)] hover:text-[var(--color-brand-crema)] hover:border-[var(--color-brand-bordo)] hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-md cursor-pointer shadow-sm"
            aria-label="Volver a los proyectos"
          >
            <span className="text-xl leading-none">&larr;</span>
            <span className="text-xs uppercase tracking-widest font-semibold font-sans">Volver</span>
          </motion.button>
        )}

        {isNeoTrattoria ? (
          /* Fullscreen Video + Backstage Layout (Neo Trattoria) */
          <div className="w-full min-h-screen flex flex-col">
            {/* Fullscreen Video Fold */}
            <div 
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHoveredVideo(true)}
              onMouseLeave={() => setIsHoveredVideo(false)}
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
                onPlay={() => {
                  setIsVideoPaused(false);
                  if (isPlayingSynth) {
                    backstageAudio.stop();
                    setIsPlayingSynth(false);
                  }
                }}
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
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[var(--color-brand-crema)]/70 text-[10px] tracking-widest font-sans font-semibold uppercase pointer-events-none select-none">
                <span>Ver Backstage</span>
                <svg
                  className="w-5 h-5 mt-1 text-[var(--color-brand-crema)]/70 animate-bounce"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Backstage Photo Gallery Fold */}
            <div className="w-full bg-[var(--color-brand-crema)] py-24 px-6 md:px-12 flex flex-col items-center">
              <div className="w-full max-w-7xl">
                {/* Editorial Intro Header */}
                <div className="text-center mb-20 space-y-6">
                  <span className="text-xs uppercase tracking-widest font-sans font-semibold text-[var(--color-brand-bordo)]">
                    Proceso Audiovisual
                  </span>
                  <h2 className="text-5xl md:text-7xl font-brand font-black text-[var(--color-brand-marron-oscuro)] tracking-tight leading-tight">
                    {project.title}
                  </h2>
                  <div className="w-20 h-[2px] bg-[var(--color-brand-bordo)] mx-auto" />
                  <p className="text-black/75 font-light leading-relaxed text-sm md:text-base max-w-2xl mx-auto">
                    {project.longDescription || project.description}
                  </p>
                  <p className="text-black/45 font-sans text-[10px] tracking-[0.2em] uppercase pt-4 font-semibold">
                    Detrás de Escena
                  </p>
                </div>

                {/* DETRÁS DE ESCENA / BACKSTAGE Tablero de Trabajo (Rediseñado como bitácora vertical) */}
                <div className="w-full py-24 bg-black/[0.01] border-t border-[var(--color-brand-marron-claro)]/25 relative pointer-events-auto select-none">
                  
                  <div className="mb-20 text-center md:text-left select-none">
                    <span className="text-[10px] md:text-[11px] font-mono tracking-[0.35em] text-[var(--color-brand-bordo)] uppercase font-semibold">
                      PROCESO CREATIVO Y REGISTRO DE RODAJE
                    </span>
                    <h3 className="font-brand text-4xl sm:text-5xl uppercase tracking-wider text-[var(--color-brand-marron-oscuro)] mt-2 mb-4">
                      Diario de Producción
                    </h3>
                    <p className="text-sm font-sans tracking-wide leading-relaxed text-[var(--color-brand-marron-oscuro)]/80 max-w-2xl">
                      Cada toma de Neo Trattoria es el resultado de un meticuloso proceso de diseño, dirección de arte e investigación cultural. Recorre la bitácora vertical para adentrarte en el universo estético del proyecto.
                    </p>
                    
                  </div>

                  {/* Vertical Stack of Editorial Sections */}
                  <div className="space-y-32">
                    {backstageCategories.map((cat, idx) => {
                      const IconComp = cat.icon;
                      const isEven = idx % 2 === 0;

                      return (
                        <motion.div
                          key={cat.id}
                          initial={{ opacity: 0, y: 55 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-120px" }}
                          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
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
                              
                              <h4 className="font-brand text-3xl sm:text-4xl uppercase tracking-wide text-[var(--color-brand-marron-oscuro)] mb-4 flex items-center gap-3">
                                {cat.title}
                                <IconComp size={22} className="text-[var(--color-brand-bordo)]" />
                              </h4>
                              
                              <span className="text-[10px] font-sans tracking-widest uppercase font-bold text-[var(--color-brand-bordo)] block mb-3">
                                {cat.tag}
                              </span>

                              <div className="w-12 h-[1.5px] bg-[var(--color-brand-bordo)]/30 my-4" />
                              
                              <p className="text-base md:text-lg leading-relaxed text-[var(--color-brand-marron-oscuro)]/90 mb-6 font-sans text-left">
                                {cat.summary}
                              </p>

                              <ul className="space-y-4 mt-4 text-left">
                                {cat.bullets.map((b, i) => (
                                  <li key={i} className="flex items-start gap-3 text-sm md:text-base text-[var(--color-brand-marron-oscuro)]/85">
                                    <span className="text-[var(--color-brand-bordo)] mt-1 font-bold font-mono">▸</span>
                                    <span>{b}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="mt-8 pt-4 border-t border-[var(--color-brand-marron-claro)]/15 flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-[var(--color-brand-marron-oscuro)]/50">
                              <span>№112 // BACKSTAGE</span>
                              <span>{cat.id === 'sonido' ? 'AUDIO INTERACTIVO' : `[ ${cat.images.length} FOTOGRAFÍAS ]`}</span>
                            </div>
                          </div>

                          {/* Alternate Column: Interactive Content or Images */}
                          <div className={`col-span-12 lg:col-span-8 min-h-[300px] flex flex-col justify-center w-full ${
                            isEven ? 'lg:order-2' : 'lg:order-1'
                          }`}>
                            
                            {/* SECTION 1: DESGLOSE CONCEPTUAL */}
                            {cat.id === 'desglose' && (
                              <div className="w-full flex flex-col gap-4">
                                {inlinePreviews[cat.id] ? (
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-full flex flex-col gap-4 relative"
                                  >
                                    <div className="w-full overflow-hidden border border-[var(--color-brand-marron-claro)]/25 shadow-md rounded-xs bg-black/[0.02] relative group">
                                      <img 
                                        src={inlinePreviews[cat.id]!} 
                                        alt="Preview" 
                                        className="w-full h-auto max-h-[60vh] object-contain mx-auto block cursor-zoom-out"
                                        onClick={() => setInlinePreviews(prev => ({ ...prev, [cat.id]: null }))}
                                      />
                                    </div>
                                    <div className="flex justify-between items-center px-1">
                                      <span className="text-[11px] font-sans text-[var(--color-brand-marron-oscuro)]/90 font-medium italic">
                                        {cat.images.find(img => img.src === inlinePreviews[cat.id])?.caption || ''}
                                      </span>
                                      <button
                                        onClick={() => setInlinePreviews(prev => ({ ...prev, [cat.id]: null }))}
                                        className="text-[10px] font-mono tracking-wider uppercase text-[var(--color-brand-bordo)] hover:underline cursor-pointer flex items-center gap-1.5"
                                      >
                                        <span>&larr;</span> Volver al registro
                                      </button>
                                    </div>
                                  </motion.div>
                                ) : (
                                  <div className="grid grid-cols-3 gap-4">
                                    {cat.images.map((img, idx) => (
                                      <motion.div 
                                        key={idx} 
                                        onClick={() => setInlinePreviews(prev => ({ ...prev, [cat.id]: img.src }))}
                                        whileHover={{ scale: 1.02 }}
                                        className="group cursor-pointer border border-[var(--color-brand-marron-claro)]/20 shadow-xs rounded-xs overflow-hidden bg-black/[0.02]"
                                      >
                                        <div className="aspect-[3/4] w-full overflow-hidden">
                                          <img 
                                            src={img.src} 
                                            alt={img.caption} 
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]" 
                                            draggable="false"
                                            loading="lazy"
                                          />
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* SECTION 2: SET / LOCACIÓN INTERACTIVO */}
                            {cat.id === 'locacion' && (
                              <div className="w-full flex flex-col gap-4">
                                {inlinePreviews[cat.id] ? (
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-full flex flex-col gap-4 relative"
                                  >
                                    <div className="w-full overflow-hidden border border-[var(--color-brand-marron-claro)]/25 shadow-md rounded-xs bg-black/[0.02] relative group">
                                      <img 
                                        src={inlinePreviews[cat.id]!} 
                                        alt="Preview" 
                                        className="w-full h-auto max-h-[60vh] object-contain mx-auto block cursor-zoom-out"
                                        onClick={() => setInlinePreviews(prev => ({ ...prev, [cat.id]: null }))}
                                      />
                                    </div>
                                    <div className="flex justify-between items-center px-1">
                                      <span className="text-[11px] font-sans text-[var(--color-brand-marron-oscuro)]/90 font-medium italic">
                                        {cat.images.find(img => img.src === inlinePreviews[cat.id])?.caption || ''}
                                      </span>
                                      <button
                                        onClick={() => setInlinePreviews(prev => ({ ...prev, [cat.id]: null }))}
                                        className="text-[10px] font-mono tracking-wider uppercase text-[var(--color-brand-bordo)] hover:underline cursor-pointer flex items-center gap-1.5"
                                      >
                                        <span>&larr;</span> Volver al registro
                                      </button>
                                    </div>
                                  </motion.div>
                                ) : (
                                  <div className="grid grid-cols-2 gap-4">
                                    {cat.images.map((img, idx) => (
                                      <motion.div 
                                        key={idx} 
                                        onClick={() => setInlinePreviews(prev => ({ ...prev, [cat.id]: img.src }))}
                                        whileHover={{ scale: 1.02 }}
                                        className="group cursor-pointer border border-[var(--color-brand-marron-claro)]/20 shadow-xs rounded-xs overflow-hidden bg-black/[0.02]"
                                      >
                                        <div className="aspect-[4/3] w-full overflow-hidden">
                                          <img 
                                            src={img.src} 
                                            alt={img.caption} 
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]" 
                                            draggable="false"
                                            loading="lazy"
                                          />
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* SECTION 3: ALTAR DE OBJETOS */}
                            {cat.id === 'elementos' && (
                              <div className="w-full flex flex-col gap-4">
                                {inlinePreviews[cat.id] ? (
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-full flex flex-col gap-4 relative"
                                  >
                                    <div className="w-full overflow-hidden border border-[var(--color-brand-marron-claro)]/25 shadow-md rounded-xs bg-black/[0.02] relative group">
                                      <img 
                                        src={inlinePreviews[cat.id]!} 
                                        alt="Preview" 
                                        className="w-full h-auto max-h-[60vh] object-contain mx-auto block cursor-zoom-out"
                                        onClick={() => setInlinePreviews(prev => ({ ...prev, [cat.id]: null }))}
                                      />
                                    </div>
                                    <div className="flex justify-between items-center px-1">
                                      <span className="text-[11px] font-sans text-[var(--color-brand-marron-oscuro)]/90 font-medium italic">
                                        {cat.images.find(img => img.src === inlinePreviews[cat.id])?.caption || ''}
                                      </span>
                                      <button
                                        onClick={() => setInlinePreviews(prev => ({ ...prev, [cat.id]: null }))}
                                        className="text-[10px] font-mono tracking-wider uppercase text-[var(--color-brand-bordo)] hover:underline cursor-pointer flex items-center gap-1.5"
                                      >
                                        <span>&larr;</span> Volver al registro
                                      </button>
                                    </div>
                                  </motion.div>
                                ) : (
                                  <>
                                    <div className="grid grid-cols-3 gap-3">
                                      {cat.images.map((img, idx) => (
                                        <motion.div 
                                          key={idx} 
                                          onClick={() => setInlinePreviews(prev => ({ ...prev, [cat.id]: img.src }))}
                                          whileHover={{ scale: 1.04 }}
                                          className="group cursor-pointer border border-[var(--color-brand-marron-claro)]/20 shadow-xs rounded-xs overflow-hidden bg-black/[0.02] flex flex-col justify-between p-2 h-[130px]"
                                        >
                                          <div className="w-full h-[80px] bg-black/5 overflow-hidden rounded-xs relative">
                                            <img 
                                              src={img.src} 
                                              alt={img.caption} 
                                              className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.02]" 
                                              draggable="false"
                                              loading="lazy"
                                            />
                                          </div>
                                          <span className="text-[10px] font-brand font-semibold block mt-1 leading-tight text-center">
                                            {img.src.includes('mesaMantel') ? 'Mesa y Mantel' : img.src.includes('pasta') ? 'Pasta Fresca' : 'Vajilla Retro'}
                                          </span>
                                        </motion.div>
                                      ))}
                                    </div>
                                    <div className="text-center text-[9px] font-mono tracking-widest text-[var(--color-brand-marron-oscuro)]/40 uppercase mt-2">
                                      [ HAZ CLIC PARA PREVISUALIZAR ]
                                    </div>
                                  </>
                                )}
                              </div>
                            )}

                            {/* SECTION 4: ESTILISMO */}
                            {cat.id === 'estilismo' && (
                              <div className="w-full flex flex-col gap-4">
                                {inlinePreviews[cat.id] ? (
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-full flex flex-col gap-4 relative"
                                  >
                                    <div className="w-full overflow-hidden border border-[var(--color-brand-marron-claro)]/25 shadow-md rounded-xs bg-black/[0.02] relative group">
                                      <img 
                                        src={inlinePreviews[cat.id]!} 
                                        alt="Preview" 
                                        className="w-full h-auto max-h-[60vh] object-contain mx-auto block cursor-zoom-out"
                                        onClick={() => setInlinePreviews(prev => ({ ...prev, [cat.id]: null }))}
                                      />
                                    </div>
                                    <div className="flex justify-between items-center px-1">
                                      <span className="text-[11px] font-sans text-[var(--color-brand-marron-oscuro)]/90 font-medium italic">
                                        {cat.images.find(img => img.src === inlinePreviews[cat.id])?.caption || ''}
                                      </span>
                                      <button
                                        onClick={() => setInlinePreviews(prev => ({ ...prev, [cat.id]: null }))}
                                        className="text-[10px] font-mono tracking-wider uppercase text-[var(--color-brand-bordo)] hover:underline cursor-pointer flex items-center gap-1.5"
                                      >
                                        <span>&larr;</span> Volver al registro
                                      </button>
                                    </div>
                                  </motion.div>
                                ) : (
                                  <>
                                    <div className="flex gap-2 justify-center border-b border-[var(--color-brand-marron-claro)]/25 pb-2">
                                      <button
                                        onClick={() => setSelectedStylingTab('makeup')}
                                        className={`px-3 py-1.5 text-[9px] font-sans tracking-widest uppercase rounded-xs transition-colors cursor-pointer ${
                                          selectedStylingTab === 'makeup' 
                                            ? 'bg-[var(--color-brand-bordo)] text-white' 
                                            : 'bg-white/30 text-[var(--color-brand-marron-oscuro)] hover:bg-white/50'
                                        }`}
                                      >
                                        Maquillaje
                                      </button>
                                      <button
                                        onClick={() => setSelectedStylingTab('hair')}
                                        className={`px-3 py-1.5 text-[9px] font-sans tracking-widest uppercase rounded-xs transition-colors cursor-pointer ${
                                          selectedStylingTab === 'hair' 
                                            ? 'bg-[var(--color-brand-bordo)] text-white' 
                                            : 'bg-white/30 text-[var(--color-brand-marron-oscuro)] hover:bg-white/50'
                                        }`}
                                      >
                                        Peinados
                                      </button>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3 min-h-[140px]">
                                      {cat.images
                                        .filter(img => selectedStylingTab === 'makeup' ? img.src.includes('Maquillaje') : img.src.includes('Peinados'))
                                        .map((img, idx) => (
                                          <motion.div 
                                            key={idx} 
                                            onClick={() => setInlinePreviews(prev => ({ ...prev, [cat.id]: img.src }))}
                                            whileHover={{ scale: 1.04 }}
                                            className="group cursor-pointer border border-[var(--color-brand-marron-claro)]/20 shadow-xs rounded-xs overflow-hidden bg-black/[0.02]"
                                          >
                                            <div className="aspect-[3/4] w-full overflow-hidden">
                                              <img 
                                                src={img.src} 
                                                alt={img.caption} 
                                                className="w-full h-full object-cover" 
                                                draggable="false"
                                                loading="lazy"
                                              />
                                            </div>
                                          </motion.div>
                                        ))}
                                    </div>
                                  </>
                                )}
                              </div>
                            )}

                            {/* SECTION 5: CLIMA SONORO */}
                            {cat.id === 'sonido' && (
                              <div className="w-full flex flex-col gap-4">
                                <div className="border border-[var(--color-brand-marron-claro)]/25 bg-white/40 backdrop-blur-md rounded-xs p-5 flex flex-col gap-4 shadow-sm select-none items-center">
                                  
                                  {/* VINYL ROTATOR PLATTER */}
                                  <div className="relative w-[180px] h-[180px] flex items-center justify-center mb-2">
                                    <motion.div 
                                      animate={isPlayingSynth ? { rotate: 360 } : {}}
                                      transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                                      className={`absolute inset-0 rounded-full bg-black shadow-xl border-4 border-gray-900 flex items-center justify-center ${
                                        isPlayingSynth ? 'scale-100 shadow-2xl' : 'scale-95'
                                      } transition-transform duration-500`}
                                    >
                                      {/* Grooves on vinyl */}
                                      <div className="absolute inset-2 rounded-full border border-white/5" />
                                      <div className="absolute inset-4 rounded-full border border-white/5" />
                                      <div className="absolute inset-6 rounded-full border border-white/5" />
                                      <div className="absolute inset-8 rounded-full border border-white/5" />
                                      
                                      {/* Center label displaying disco.webp */}
                                      <div className="w-[80px] h-[80px] rounded-full overflow-hidden border-2 border-black relative bg-gray-200">
                                        <img 
                                          src="/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/Sonido Musica y clima sonoro/disco.webp" 
                                          alt="Disco Dictator [Luke Million Remix]" 
                                          className="w-full h-full object-cover select-none pointer-events-none" 
                                          draggable="false"
                                        />
                                        <div className="absolute inset-0 bg-black/10" />
                                        {/* Spindle hole */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[var(--color-brand-crema)] rounded-full border border-black" />
                                      </div>
                                    </motion.div>
                                  </div>

                                  <div className="w-full flex justify-between items-center border-t border-[var(--color-brand-marron-claro)]/15 pt-3">
                                    <div className="text-left font-mono">
                                      <span className="text-[10px] font-bold block text-[var(--color-brand-marron-oscuro)] leading-none mb-1">
                                        DISCO DICTATOR
                                      </span>
                                      <span className="text-[7px] text-[var(--color-brand-marron-claro)] block leading-none">
                                        Luke Million Remix
                                      </span>
                                    </div>
                                    
                                    <EqualizerBar active={isPlayingSynth} />
                                  </div>

                                  <div className="w-full flex justify-between items-center pt-2 gap-4 border-t border-[var(--color-brand-marron-claro)]/10">
                                    <button
                                      onClick={handleTogglePlaySynth}
                                      aria-label={isPlayingSynth ? "Pausar música" : "Reproducir música"}
                                      className="w-10 h-10 rounded-full bg-[var(--color-brand-bordo)] hover:bg-[var(--color-brand-bordo)]/90 text-white flex items-center justify-center transition-colors cursor-pointer select-none shadow-xs shrink-0"
                                    >
                                      {isPlayingSynth ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="translate-x-[1px]" />}
                                    </button>

                                    <div className="flex items-center gap-2 w-full">
                                      {synthVolume === 0 ? <VolumeX size={12} className="text-[var(--color-brand-marron-oscuro)]/60" /> : <Volume2 size={12} className="text-[var(--color-brand-marron-oscuro)]/60" />}
                                      <input
                                          type="range"
                                          min="0"
                                          max="1"
                                          step="0.05"
                                          value={synthVolume}
                                          onChange={(e) => setSynthVolume(parseFloat(e.target.value))}
                                          aria-label="Volumen del reproductor"
                                          className="w-full accent-[var(--color-brand-bordo)] h-1 rounded-lg cursor-pointer bg-[var(--color-brand-marron-claro)]/30"
                                      />
                                    </div>
                                  </div>
                                  
                                </div>
                              </div>
                            )}

                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* INSTANTÁNEAS DE RODAJE */}
                  <div className="mt-24 select-none">
                    <div className="mb-10 text-center select-none">
                      <span className="text-[10px] md:text-[11px] font-mono tracking-[0.25em] text-[var(--color-brand-marron-oscuro)]/60 uppercase">
                        [ SCAN // RODAJE // DETRÁS DE CÁMARA ]
                      </span>
                      <h4 className="font-brand text-2xl uppercase tracking-wider text-[var(--color-brand-marron-oscuro)] mt-1">
                        Instantáneas de Producción
                      </h4>
                      <p className="text-[10px] font-mono tracking-widest text-[var(--color-brand-marron-oscuro)]/50 uppercase mt-1">
                        [ PUEDES ARRASTRAR LAS FOTOS PARA ACOMODARLAS ]
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 w-full mt-4">
                      {[
                        { src: "/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/IMG_6653.jpg", caption: "Prueba de vestuario en terminal" },
                        { src: "/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/IMG_6656.jpg", caption: "Luces y cámara en set" },
                        { src: "/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/IMG_6662.jpg", caption: "Vestuario retro y detalles" },
                        { src: "/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/IMG_6675.jpg", caption: "Set al atardecer en Zárate" },
                        { src: "/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/IMG_6681.jpg", caption: "Instrucciones de dirección" }
                      ].map((item, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ y: -6, transition: { duration: 0.3 } }}
                          onClick={() => setSelectedPhoto(item.src)}
                          className={`bg-white/40 backdrop-blur-xs p-4 rounded-xs border border-[var(--color-brand-marron-claro)]/25 shadow-xs cursor-pointer group flex flex-col gap-3 relative pointer-events-auto ${idx === 4 ? 'sm:col-span-2' : ''}`}
                        >
                          <div className={`w-full aspect-[4/3] ${idx === 4 ? 'sm:aspect-[2.1/1]' : ''} bg-black/5 overflow-hidden rounded-xs relative`}>
                            <img 
                              src={item.src} 
                              alt={item.caption} 
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" 
                              draggable="false"
                            />
                            <div className="absolute inset-0 bg-black/[0.02] group-hover:bg-transparent transition-colors pointer-events-none" />
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="text-[8px] font-mono tracking-widest text-[var(--color-brand-bordo)] uppercase font-semibold">
                              SNAP №0{idx + 1} // RODAJE
                            </span>
                            <span className="text-[11px] font-brand italic text-[var(--color-brand-marron-oscuro)]/90 mt-1 font-light leading-snug">
                              {item.caption}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Standard Video Overlay (Default for other projects) */
          <div className="w-full h-full max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 overflow-y-auto md:overflow-visible">
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
