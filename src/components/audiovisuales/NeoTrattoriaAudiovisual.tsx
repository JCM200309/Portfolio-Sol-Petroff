import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, MapPin, Layers, Sparkles, Music, Volume2, VolumeX, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';

interface NeoTrattoriaAudiovisualProps {
  onSelectPhoto: (src: string) => void;
}

// --- HELPER CLASS: Web Audio API Backstage Ambient Synth ---
class BackstageAudioSynth {
  private ctx: AudioContext | null = null;
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

  play() {
    this.stop();
    this.init();
    
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (!this.audio) {
      this.audio = new HTMLAudioElement();
      this.audio.src = '/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/Sonido Musica y clima sonoro/Auxiliary Tha Masterfader - Disco Dictator [Luke Million Remix].mp3';
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
      { src: '/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/Desglose conceptual/4.jpg', caption: 'Desglose conceptual de la puesta en escena.' }
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

interface ImageCarouselProps {
  images: { src: string; caption: string }[];
  onSelectPhoto: (src: string) => void;
}

function ImageCarousel({ images, onSelectPhoto }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index when images list changes (e.g. styling tab changes)
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

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[50vh] overflow-hidden border border-[var(--color-brand-marron-claro)]/25 shadow-md rounded-xs bg-black/[0.02] group select-none">
        
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

export default function NeoTrattoriaAudiovisual({ onSelectPhoto }: NeoTrattoriaAudiovisualProps) {
  const [isPlayingSynth, setIsPlayingSynth] = useState(false);
  const [synthVolume, setSynthVolume] = useState(0.5);
  const [selectedStylingTab, setSelectedStylingTab] = useState<'makeup' | 'hair'>('makeup');
  const [inlinePreviews, setInlinePreviews] = useState<Record<string, string | null>>({});

  // Setup synth volume listener
  useEffect(() => {
    backstageAudio.setVolume(synthVolume);
  }, [synthVolume]);

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
      backstageAudio.play();
      setIsPlayingSynth(true);
    }
  };

  return (
    <div className="w-full py-24 bg-black/[0.01] border-t border-[var(--color-brand-marron-claro)]/25 relative pointer-events-auto select-none">
      
      <div className="mb-20 text-center md:text-left select-none">
        <span className="text-[10px] md:text-[11px] font-mono tracking-[0.35em] text-[var(--color-brand-bordo)] uppercase font-semibold">
          PROCESO CREATIVO Y REGISTRO DE RODAJE
        </span>
        <h3 className="font-brand text-4xl sm:text-5xl uppercase tracking-wider text-[var(--color-brand-marron-oscuro)] mt-2 mb-4">
          Diario de Producción
        </h3>
        <p className="text-sm font-sans tracking-wide leading-relaxed text-[var(--color-brand-marron-oscuro)]/80 max-w-2xl text-left">
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
                  
                  <h4 className="font-brand text-3xl sm:text-4xl uppercase tracking-wide text-[var(--color-brand-marron-oscuro)] mb-4 flex items-center gap-3 text-left">
                    {cat.title}
                    <IconComp size={22} className="text-[var(--color-brand-bordo)]" />
                  </h4>
                  
                  <span className="text-[10px] font-sans tracking-widest uppercase font-bold text-[var(--color-brand-bordo)] block mb-3 text-left">
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
                  <span>{cat.id === 'sonido' ? 'AUDIO INTERACTIVO' : `[ ${cat.images.length} ${cat.images.length === 1 ? 'FOTOGRAFÍA' : 'FOTOGRAFÍAS'} ]`}</span>
                </div>
              </div>

              {/* Alternate Column: Interactive Content or Images */}
              <div className={`col-span-12 lg:col-span-8 min-h-[300px] flex flex-col justify-center w-full ${
                isEven ? 'lg:order-2' : 'lg:order-1'
              }`}>
                
                {/* SECTION 1: DESGLOSE CONCEPTUAL */}
                {cat.id === 'desglose' && (
                  <ImageCarousel images={cat.images} onSelectPhoto={onSelectPhoto} />
                )}

                {/* SECTION 2: SET / LOCACIÓN INTERACTIVO */}
                {cat.id === 'locacion' && (
                  <ImageCarousel images={cat.images} onSelectPhoto={onSelectPhoto} />
                )}

                {/* SECTION 3: ALTAR DE OBJETOS */}
                {cat.id === 'elementos' && (
                  <ImageCarousel images={cat.images} onSelectPhoto={onSelectPhoto} />
                )}

                {/* SECTION 4: ESTILISMO */}
                {cat.id === 'estilismo' && (
                  <div className="w-full flex flex-col gap-6">
                    <div className="flex gap-2 justify-center border-b border-[var(--color-brand-marron-claro)]/25 pb-4">
                      <button
                        onClick={() => setSelectedStylingTab('makeup')}
                        className={`px-4 py-2 text-[9px] font-sans tracking-widest uppercase rounded-xs transition-colors cursor-pointer ${
                          selectedStylingTab === 'makeup' 
                            ? 'bg-[var(--color-brand-bordo)] text-white font-bold' 
                            : 'bg-white/30 text-[var(--color-brand-marron-oscuro)] hover:bg-white/50'
                        }`}
                      >
                        Maquillaje
                      </button>
                      <button
                        onClick={() => setSelectedStylingTab('hair')}
                        className={`px-4 py-2 text-[9px] font-sans tracking-widest uppercase rounded-xs transition-colors cursor-pointer ${
                          selectedStylingTab === 'hair' 
                            ? 'bg-[var(--color-brand-bordo)] text-white font-bold' 
                            : 'bg-white/30 text-[var(--color-brand-marron-oscuro)] hover:bg-white/50'
                        }`}
                      >
                        Peinados
                      </button>
                    </div>

                    <ImageCarousel 
                      images={cat.images.filter(img => selectedStylingTab === 'makeup' ? img.src.includes('Maquillaje') : img.src.includes('Peinados'))} 
                      onSelectPhoto={onSelectPhoto} 
                    />
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
                          className="w-8 h-8 rounded-full bg-[var(--color-brand-bordo)] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer shrink-0"
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
            [ HAZ CLIC EN LAS FOTOS PARA AMPLIARLAS ]
          </p>
        </div>

        {inlinePreviews['capturas'] ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full flex flex-col gap-4 relative max-w-4xl mx-auto"
          >
            <div className="w-full overflow-hidden border border-[var(--color-brand-marron-claro)]/25 shadow-md rounded-xs bg-black/[0.02] relative group">
              <img 
                src={inlinePreviews['capturas']!} 
                alt="Preview" 
                className="w-full h-auto max-h-[70vh] object-contain mx-auto block cursor-zoom-out"
                onClick={() => setInlinePreviews(prev => ({ ...prev, capturas: null }))}
              />
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-[11px] font-sans text-[var(--color-brand-marron-oscuro)]/90 font-medium italic">
                {[
                  { src: "/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/IMG_6653.jpg", caption: "Prueba de vestuario en terminal" },
                  { src: "/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/IMG_6656.jpg", caption: "Luces y cámara en set" },
                  { src: "/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/IMG_6662.jpg", caption: "Vestuario retro y detalles" },
                  { src: "/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/IMG_6675.jpg", caption: "Set al atardecer en Zárate" },
                  { src: "/proyectosAudiovisuales/neoTrattoria/BACKSTAGE/IMG_6681.jpg", caption: "Instrucciones de dirección" }
                ].find(img => img.src === inlinePreviews['capturas'])?.caption || ''}
              </span>
              <button
                onClick={() => setInlinePreviews(prev => ({ ...prev, capturas: null }))}
                className="text-[10px] font-mono tracking-wider uppercase text-[var(--color-brand-bordo)] hover:underline cursor-pointer flex items-center gap-1.5"
              >
                <span>&larr;</span> Volver al registro
              </button>
            </div>
          </motion.div>
        ) : (
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
                onClick={() => setInlinePreviews(prev => ({ ...prev, capturas: item.src }))}
                className={`bg-white/40 backdrop-blur-xs p-4 rounded-xs border border-[var(--color-brand-marron-claro)]/25 shadow-xs cursor-pointer group flex flex-col gap-3 relative pointer-events-auto ${idx === 4 ? 'sm:col-span-2' : ''}`}
              >
                <div className={`w-full aspect-[4/3] ${idx === 4 ? 'sm:aspect-[2.1/1]' : ''} bg-black/5 overflow-hidden rounded-xs relative`}>
                  <img 
                    src={item.src} 
                    alt={item.caption} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" 
                    draggable="false"
                    loading="lazy"
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
        )}
      </div>

    </div>
  );
}
