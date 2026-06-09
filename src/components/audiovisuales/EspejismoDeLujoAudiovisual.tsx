import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, MapPin, Layers, Sparkles, Volume2, VolumeX, Sparkle, Play, Pause } from 'lucide-react';

interface EspejismoDeLujoProps {
  onSelectPhoto: (src: string) => void;
}

// --- HELPER CLASS: Web Audio API Golden Glissando & Ambient Synth ---
class EspejismoAudioSynth {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private lfo: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private isPlaying = false;

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(1, this.ctx.currentTime);

      this.filter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  playSparkle() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    
    // Golden harp/sparkle: Arpeggio of notes sliding up
    const frequencies = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    
    frequencies.forEach((freq, idx) => {
      const triggerTime = now + idx * 0.08;
      
      const osc = this.ctx!.createOscillator();
      const oscGain = this.ctx!.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, triggerTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, triggerTime + 0.35);

      oscGain.gain.setValueAtTime(0, triggerTime);
      oscGain.gain.linearRampToValueAtTime(0.12, triggerTime + 0.02);
      oscGain.gain.exponentialRampToValueAtTime(0.001, triggerTime + 0.4);

      osc.connect(oscGain);
      oscGain.connect(this.filter!);
      
      osc.start(triggerTime);
      osc.stop(triggerTime + 0.45);
    });
  }

  startAmbientPad() {
    this.init();
    if (!this.ctx || this.isPlaying) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = true;
    const now = this.ctx.currentTime;

    // Create a luxurious warm chord (C major 9th / golden feel)
    const notes = [130.81, 196.00, 261.63, 329.63, 440.00]; // C2, G3, C4, E4, A4
    this.oscillators = notes.map((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      
      // Gentle pitch drift
      osc.frequency.linearRampToValueAtTime(freq + (Math.random() - 0.5) * 2, now + 1);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.04 - i * 0.005, now + 1.5);

      osc.connect(gain);
      gain.connect(this.filter!);
      osc.start(now);

      return osc;
    });

    // LFO to sweep the lowpass filter frequency (breathing effect)
    this.lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    
    this.lfo.type = 'sine';
    this.lfo.frequency.setValueAtTime(0.18, now); // Very slow breathing
    lfoGain.gain.setValueAtTime(400, now); // Sweep filter up/down by 400Hz

    this.lfo.connect(lfoGain);
    lfoGain.connect(this.filter!.frequency);
    this.lfo.start(now);
  }

  stopAmbientPad() {
    if (!this.isPlaying) return;
    const now = this.ctx ? this.ctx.currentTime : 0;

    this.oscillators.forEach(osc => {
      try {
        osc.stop(now + 0.5);
      } catch (e) {}
    });
    this.oscillators = [];

    if (this.lfo) {
      try {
        this.lfo.stop(now + 0.5);
      } catch (e) {}
      this.lfo = null;
    }

    this.isPlaying = false;
  }

  setVolume(vol: number) {
    this.init();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(vol * 0.12, this.ctx.currentTime);
    }
  }
}

const espejismoAudio = new EspejismoAudioSynth();

const listOfCansInfo = {
  exito: {
    src: "/proyectosAudiovisuales/EspejismoDelLujo/Cocina desgastada/cocinaDesgastada4.png",
    caption: "Lata Éxito - Presentada en la cocina desgastada."
  },
  belleza: {
    src: "/proyectosAudiovisuales/EspejismoDelLujo/Styling y utileria/barrio1 (1).jpg",
    caption: "Lata Belleza - Presentada en las calles del barrio."
  },
  estatus: {
    src: "/proyectosAudiovisuales/EspejismoDelLujo/Styling y utileria/jardinRoto4.jpg",
    caption: "Lata Estatus - Presentada en el jardín seco."
  }
};

const espejismoCategories = [
  {
    id: 'concepto',
    title: 'Anhelo de Pertenencia',
    icon: BookOpen,
    badge: '01 / CONCEPTO',
    tag: 'El lujo absurdo',
    summary: 'El lujo excesivo se torna absurdo cuando deja de ser una expresión de disfrute o calidad para convertirse en una demostración desproporcionada de estatus. Es una exploración de cómo las carencias se disfrazan de opulencia con recursos improvisados.',
    bullets: [
      'Contraste entre carencia real y opulencia soñada',
      'Las tres latas mágicas: éxito, belleza y estatus',
      'Ironía crítica sobre el consumo y la imitación material'
    ],
    images: [
      { src: '/proyectosAudiovisuales/EspejismoDelLujo/Concepto/concepto1.webp', caption: 'Retrato de la modelo y contraste de texturas.' },
      { src: '/proyectosAudiovisuales/EspejismoDelLujo/Concepto/concepto2.jpg', caption: 'Estilo recargado bajo luz cinematográfica.' }
    ]
  },
  {
    id: 'locaciones',
    title: 'Espacios Cotidianos',
    icon: MapPin,
    badge: '02 / LOCACIONES',
    tag: 'Tension de Espacios',
    summary: 'Contrapone ambientes cotidianos y rústicos con la ostentación del personaje. El film transita entre una cocina desgastada de paredes descascaradas, las calles de un barrio con portones oxidados y un jardín seco y descuidado.',
    bullets: [
      'Cocina con azulejos retro y paredes descascaradas',
      'Portón metálico en el barrio para el juego de espejos',
      'Jardín descuidado con malezas y macetas secas'
    ],
    images: [
      { src: '/proyectosAudiovisuales/EspejismoDelLujo/Locaciones/locaciones1.webp', caption: 'Mapeo de la cocina desgastada.' },
      { src: '/proyectosAudiovisuales/EspejismoDelLujo/Locaciones/locaciones2.webp', caption: 'Planificación de la escena del portón del barrio.' },
      { src: '/proyectosAudiovisuales/EspejismoDelLujo/Locaciones/locaciones3.jpg', caption: 'Luz natural sobre el jardín seco.' }
    ]
  },
  {
    id: 'partido',
    title: 'Partido Morfológico',
    icon: Layers,
    badge: '03 / DISEÑO DE ARTE',
    tag: 'Elementos Grotescos',
    summary: 'El partido morfológico se estructura en base a la repetición y los materiales irreales. Huevos con brillantina, harinas violetas y latas doradas irrumpen en la rutina del personaje para quebrar la realidad y generar efectos mágicos.',
    bullets: [
      'Morfología de empaques de conserva tradicionales y etiquetas',
      'Polvos dorados y texturas brillantes y purpurinas',
      'Joyas de fantasía brotando orgánicamente del suelo'
    ],
    images: [
      { src: '/proyectosAudiovisuales/EspejismoDelLujo/Partido Morfologico/partido1.png', caption: 'Esquema morfológico de las latas de conserva.' },
      { src: '/proyectosAudiovisuales/EspejismoDelLujo/Partido Morfologico/partido2.png', caption: 'Paleta cromática y diseño de etiquetas.' },
      { src: '/proyectosAudiovisuales/EspejismoDelLujo/Partido Morfologico/partido3.webp', caption: 'Contraste de ingredientes: huevo y purpurina.' },
      { src: '/proyectosAudiovisuales/EspejismoDelLujo/Partido Morfologico/partido4.webp', caption: 'Diseño de la caja contenedora de latas.' }
    ]
  },
  {
    id: 'styling',
    title: 'Styling y Utilería',
    icon: Sparkles,
    badge: '04 / ESTILISMO',
    tag: 'Opulencia Improvisada',
    summary: 'La vestimenta de la modelo –blazer de sastrería, faldas de piel y accesorios recargados– genera un contraste radical con la decadencia de la cocina y el jardín descuidado. Las carencias del entorno se disfrazan con recursos exagerados e improvisados.',
    bullets: [
      'Blazer estructurado y falda de piel texturada',
      'Gafas oscuras de gran tamaño y colgantes de pedrería',
      'Cajas de ropa y valijas desbordantes de accesorios dorados'
    ],
    images: [
      { src: '/proyectosAudiovisuales/EspejismoDelLujo/Styling y utileria/barrio1 (1).webp', caption: 'Prueba de outfit y accesorios de la modelo.' },
      { src: '/proyectosAudiovisuales/EspejismoDelLujo/Styling y utileria/barrio1 (2).webp', caption: 'Modelo posando frente al espejo del portón.' },
      { src: '/proyectosAudiovisuales/EspejismoDelLujo/Styling y utileria/jardinRoto3.webp', caption: 'Collares brotando de la maceta del patio.' }
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
            height: [8, 26, 10, 30, 14, 22, 8][(i + Math.floor(Math.random() * 3)) % 7]
          } : {
            height: 4
          }}
          transition={active ? {
            repeat: Infinity,
            duration: 0.7 + i * 0.08,
            ease: 'easeInOut'
          } : {
            duration: 0.3
          }}
        />
      ))}
    </div>
  );
};

export default function EspejismoDeLujoAudiovisual({ onSelectPhoto }: EspejismoDeLujoProps) {
  const [activeAmbient, setActiveAmbient] = useState(false);
  const [ambientVolume, setAmbientVolume] = useState(0.5);
  const [selectedCan, setSelectedCan] = useState<'exito' | 'belleza' | 'estatus'>('exito');
  const [inlinePreviews, setInlinePreviews] = useState<Record<string, string | null>>({});

  useEffect(() => {
    espejismoAudio.setVolume(ambientVolume);
  }, [ambientVolume]);

  useEffect(() => {
    return () => {
      espejismoAudio.stopAmbientPad();
    };
  }, []);

  const handleToggleAmbient = () => {
    if (activeAmbient) {
      espejismoAudio.stopAmbientPad();
      setActiveAmbient(false);
    } else {
      espejismoAudio.startAmbientPad();
      setActiveAmbient(true);
    }
  };

  const selectCanAndSparkle = (can: 'exito' | 'belleza' | 'estatus') => {
    setSelectedCan(can);
    espejismoAudio.playSparkle();
  };

  return (
    <div className="w-full py-24 bg-black/[0.01] border-t border-[var(--color-brand-marron-claro)]/25 relative pointer-events-auto select-none font-sans text-[var(--color-brand-marron-oscuro)]">
      
      {/* Narrative Intro Header */}
      <div className="mb-20 text-center md:text-left select-none">
        <span className="text-[10px] md:text-[11px] font-mono tracking-[0.35em] text-[var(--color-brand-bordo)] uppercase font-semibold">
          ANHELO DE PERTENENCIA Y CRÍTICA ESTÉTICA
        </span>
        <h3 className="font-brand text-4xl sm:text-5xl uppercase tracking-wider text-[var(--color-brand-marron-oscuro)] mt-2 mb-4">
          Bitácora del Espejismo
        </h3>
        <p className="text-sm font-sans tracking-wide leading-relaxed text-[var(--color-brand-marron-oscuro)]/80 max-w-2xl text-left">
          Tres latas de conserva doradas irrumpen en la monotonía y la carencia de entornos cotidianos. Éxito, Belleza y Estatus se convierten en objetos mágicos y absurdos que deconstruyen la búsqueda del estatus aspiracional.
        </p> 
      </div>

      {/* Narrative category stack */}
      <div className="space-y-32">
        {espejismoCategories.map((cat, idx) => {
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
              {/* Left Column Narrative text */}
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
                        <span className="text-[var(--color-brand-bordo)] mt-1 font-bold font-mono">▸</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-[var(--color-brand-marron-claro)]/15 flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-[var(--color-brand-marron-oscuro)]/50">
                  <span>№03 // ESPEJISMO</span>
                  <span>{`[ ${cat.images.length} REGISTROS ]`}</span>
                </div>
              </div>

              {/* Alternate Column: Image layouts */}
              <div className={`col-span-12 lg:col-span-8 min-h-[300px] flex flex-col justify-center w-full ${
                isEven ? 'lg:order-2' : 'lg:order-1'
              }`}>
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
                    <div className={`grid gap-4 ${cat.images.length === 2 ? 'grid-cols-2' : cat.images.length === 3 ? 'grid-cols-3' : 'grid-cols-2 md:grid-cols-4'}`}>
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
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" 
                              draggable="false"
                              loading="lazy"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* INTERACTIVE COMPONENT: LAS TRES LATAS DE CONSERVA */}
      <motion.div 
        initial={{ opacity: 0, y: 55 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-32 w-full border border-[var(--color-brand-marron-claro)]/25 rounded-sm p-6 md:p-10 bg-white/40 backdrop-blur-md shadow-lg"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Block: Can Selector & Guion display */}
          <div className="lg:col-span-7 flex flex-col justify-between text-left">
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-[var(--color-brand-bordo)] uppercase font-semibold">
                SITUACIÓN & NARRATIVA MÁGICA
              </span>
              <h3 className="font-brand text-3xl uppercase tracking-wider text-[var(--color-brand-marron-oscuro)] mt-1 mb-6">
                El Ritual de las Latas
              </h3>
              
              {/* Can tabs buttons */}
              <div className="flex gap-2.5 mb-8 border-b border-[var(--color-brand-marron-claro)]/20 pb-4">
                {[
                  { id: 'exito', label: 'Lata ÉXITO', location: 'Cocina' },
                  { id: 'belleza', label: 'Lata BELLEZA', location: 'Barrio' },
                  { id: 'estatus', label: 'Lata ESTATUS', location: 'Patio' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => selectCanAndSparkle(tab.id as any)}
                    className={`px-4 py-2 text-[10px] font-sans tracking-widest uppercase rounded-xs transition-all cursor-pointer flex flex-col items-start gap-0.5 ${
                      selectedCan === tab.id 
                        ? 'bg-[var(--color-brand-bordo)] text-[var(--color-brand-crema)] shadow-md hover:brightness-110' 
                        : 'bg-white/50 text-[var(--color-brand-marron-oscuro)] hover:bg-white/80'
                    }`}
                  >
                    <span className="font-bold flex items-center gap-1">
                      {tab.id === 'exito' && <Sparkle size={10} className="animate-pulse" />}
                      {tab.label}
                    </span>
                    <span className={`text-[8px] opacity-70 ${selectedCan === tab.id ? 'text-[var(--color-brand-crema)]/80' : 'text-gray-500'}`}>
                      {tab.location}
                    </span>
                  </button>
                ))}
              </div>

              {/* Active description */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCan}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-4"
                >
                  {selectedCan === 'exito' && (
                    <>
                      <h4 className="font-brand text-xl italic text-[var(--color-brand-bordo)]">
                        Escena 1: Cocina Desgastada
                      </h4>
                      <p className="text-sm font-sans tracking-wide leading-relaxed text-[var(--color-brand-marron-oscuro)]/90">
                        En una cocina con paredes descascaradas, la modelo viste un sastre formal exagerado. Con gestos teatrales mezcla ingredientes imposibles: harina violeta, huevos con brillantina y polvo dorado de la lata "Éxito". Al comerla, un cambio tenso transforma su identidad.
                      </p>
                      <div className="bg-white/35 border border-[var(--color-brand-marron-claro)]/20 rounded-xs p-3 text-[10px] font-mono space-y-1">
                        <span className="text-[var(--color-brand-bordo)] font-bold block">[ CLIMA SONORO ]</span>
                        <span className="block">Inicio: "Multi-family Garage Sale" - Yacht</span>
                        <span className="block">Desarrollo: "You are the one that I want" - Grease</span>
                        <span className="block font-bold">Desenlace: Fuerte transición a música tensa de cortocircuito emocional al degustar.</span>
                      </div>
                    </>
                  )}
                  {selectedCan === 'belleza' && (
                    <>
                      <h4 className="font-brand text-xl italic text-[var(--color-brand-bordo)]">
                        Escena 2: Calles y Grietas
                      </h4>
                      <p className="text-sm font-sans tracking-wide leading-relaxed text-[var(--color-brand-marron-oscuro)]/90">
                        La modelo inicia frustrada cargando una maleta desordenada buscando el outfit perfecto. Recuerda la lata de "Belleza", y automáticamente su rostro cambia a una felicidad radiante. Sale a la calle modelando desafiante con seguridad absoluta, encontrando un espejo roto sobre un portón metálico.
                      </p>
                      <div className="bg-white/35 border border-[var(--color-brand-marron-claro)]/20 rounded-xs p-3 text-[10px] font-mono space-y-1">
                        <span className="text-[var(--color-brand-bordo)] font-bold block">[ CLIMA SONORO ]</span>
                        <span className="block">Inicio: Sonido ambiental de desgano y tensión.</span>
                        <span className="block">Al abrir lata: "Multi-family Garage Sale" - Yacht</span>
                        <span className="block font-bold">Strut/Caminata: "Vogue" - Madonna (Seguridad total ante la crítica).</span>
                      </div>
                    </>
                  )}
                  {selectedCan === 'estatus' && (
                    <>
                      <h4 className="font-brand text-xl italic text-[var(--color-brand-bordo)]">
                        Escena 3: Patio Roto y Plantas
                      </h4>
                      <p className="text-sm font-sans tracking-wide leading-relaxed text-[var(--color-brand-marron-oscuro)]/90">
                        Haciendo jardinería en un patio descuidado, la modelo descubre que su planta preferida se encuentra seca por descuido. Vierte el líquido de la lata de "Estatus" sobre la tierra. Sorprendentemente, joyas y collares brotan de las macetas. Se las cuelga excesivamente hasta quedar cubierta de brillo.
                      </p>
                      <div className="bg-white/35 border border-[var(--color-brand-marron-claro)]/20 rounded-xs p-3 text-[10px] font-mono space-y-1">
                        <span className="text-[var(--color-brand-bordo)] font-bold block">[ CLIMA SONORO ]</span>
                        <span className="block">Inicio: "Murder on the dancefloor" - Sophie Ellis-Bextor</span>
                        <span className="block">Al regar: Nota de tensión suspensiva &rarr; Retorno a ritmo bailable.</span>
                        <span className="block font-bold">Techo: Silencio brusco y zumbido denso de incomodidad y confusión final.</span>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Block: Soundtrack Player (Luxury Golden Console) */}
          <div className="lg:col-span-5 border border-[var(--color-brand-marron-claro)]/20 rounded-xs p-5 bg-white/50 backdrop-blur-md flex flex-col justify-between shadow-sm">
            <div className="flex flex-col items-center">
              
              {/* Can Graphic box & Preview */}
              <div className="relative w-36 h-36 flex items-center justify-center mb-6 cursor-pointer" onClick={() => onSelectPhoto(listOfCansInfo[selectedCan].src)}>
                <motion.div
                  key={selectedCan}
                  initial={{ scale: 0.9, rotate: -5 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="w-24 h-32 bg-gradient-to-b from-amber-100 via-amber-200 to-amber-400 rounded-lg shadow-lg border-2 border-amber-300 relative flex flex-col justify-between p-2 select-none"
                >
                  <div className="border border-amber-100/40 rounded-xs flex-1 flex flex-col justify-between p-1 font-mono text-[7px] text-amber-950/80 uppercase font-bold text-center leading-none">
                    <span>LATA MÁGICA</span>
                    
                    <div className="my-auto py-2 flex flex-col items-center gap-1">
                      <Sparkle size={12} className="text-amber-800 animate-pulse" />
                      <span className="text-[9px] tracking-widest text-amber-900 border-y border-amber-800/20 py-1 block w-full truncate">
                        {selectedCan === 'exito' ? 'ÉXITO' : selectedCan === 'belleza' ? 'BELLEZA' : 'ESTATUS'}
                      </span>
                    </div>

                    <span>№03 // CONSERVA</span>
                  </div>

                  {/* Shiny sweep effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                </motion.div>
              </div>

              <span className="text-[9px] font-mono tracking-widest text-[var(--color-brand-bordo)] font-bold mb-1 uppercase">
                EMISIÓN DE AMBIENTE LUX
              </span>
              <span className="text-[11px] font-sans text-gray-600 block text-center mb-4">
                Sintetizador analógico de acordes dorados
              </span>
            </div>

            <div className="w-full flex flex-col gap-4 border-t border-[var(--color-brand-marron-claro)]/15 pt-4">
              <div className="flex justify-between items-center w-full">
                <span className="text-[10px] font-mono tracking-wider font-bold">ESTADO SINTETIZADOR:</span>
                <EqualizerBar active={activeAmbient} />
              </div>

              <div className="flex justify-between items-center gap-4">
                <button
                  onClick={handleToggleAmbient}
                  aria-label={activeAmbient ? "Pausar ambiente" : "Reproducir ambiente"}
                  className="w-10 h-10 rounded-full bg-[var(--color-brand-bordo)] text-[var(--color-brand-crema)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer shrink-0"
                >
                  {activeAmbient ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="translate-x-[1px]" />}
                </button>

                <div className="flex items-center gap-2 w-full">
                  {ambientVolume === 0 ? <VolumeX size={14} className="text-gray-500" /> : <Volume2 size={14} className="text-gray-500" />}
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={ambientVolume}
                    onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                    aria-label="Volumen del ambiente"
                    className="w-full accent-[var(--color-brand-bordo)] h-1 rounded-lg cursor-pointer bg-[var(--color-brand-marron-claro)]/20"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </motion.div>

      {/* RODAJE / INSTANTÁNEAS DE RODAJE */}
      <div className="mt-24 select-none border-t border-[var(--color-brand-marron-claro)]/20 pt-20">
        <div className="mb-10 text-center select-none">
          <span className="text-[10px] md:text-[11px] font-mono tracking-[0.25em] text-[var(--color-brand-marron-oscuro)]/60 uppercase">
            [ REGISTRO ANALÓGICO // FOTOGRAFÍAS DE SET ]
          </span>
          <h4 className="font-brand text-2xl uppercase tracking-wider text-[var(--color-brand-marron-oscuro)] mt-1">
            Instantáneas de Producción
          </h4>
          <p className="text-[10px] font-mono tracking-widest text-[var(--color-brand-marron-oscuro)]/50 uppercase mt-1">
            [ HAZ CLIC PARA PREVISUALIZAR IMAGEN INLINE ]
          </p>
        </div>

        {inlinePreviews['capturas'] ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full flex flex-col gap-4 relative max-w-4xl mx-auto text-left"
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
                  { src: "/proyectosAudiovisuales/EspejismoDelLujo/Cocina desgastada/cocinaDesgastada1.png", caption: "Preparando la receta del éxito" },
                  { src: "/proyectosAudiovisuales/EspejismoDelLujo/Cocina desgastada/cocinaDesgastada2.webp", caption: "Brillo en la cocina agrietada" },
                  { src: "/proyectosAudiovisuales/EspejismoDelLujo/Cocina desgastada/cocinaDesgastada3.webp", caption: "El horno y los ingredientes surrealistas" },
                  { src: "/proyectosAudiovisuales/EspejismoDelLujo/Styling y utileria/jardinRoto.webp", caption: "Las joyas que brotan de la tierra" },
                  { src: "/proyectosAudiovisuales/EspejismoDelLujo/Styling y utileria/jardinRoto2.jpg", caption: "Jardinería de estatus y fantasía" }
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full mt-4">
            {[
              { src: "/proyectosAudiovisuales/EspejismoDelLujo/Cocina desgastada/cocinaDesgastada1.png", caption: "Preparando la receta del éxito" },
              { src: "/proyectosAudiovisuales/EspejismoDelLujo/Cocina desgastada/cocinaDesgastada2.webp", caption: "Brillo en la cocina agrietada" },
              { src: "/proyectosAudiovisuales/EspejismoDelLujo/Cocina desgastada/cocinaDesgastada3.webp", caption: "El horno y los ingredientes surrealistas" },
              { src: "/proyectosAudiovisuales/EspejismoDelLujo/Styling y utileria/jardinRoto.webp", caption: "Las joyas que brotan de la tierra" },
              { src: "/proyectosAudiovisuales/EspejismoDelLujo/Styling y utileria/jardinRoto2.jpg", caption: "Jardinería de estatus y fantasía" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                onClick={() => setInlinePreviews(prev => ({ ...prev, capturas: item.src }))}
                className={`bg-white/40 backdrop-blur-xs p-4 rounded-xs border border-[var(--color-brand-marron-claro)]/25 shadow-xs cursor-pointer group flex flex-col gap-3 relative pointer-events-auto ${idx === 3 || idx === 4 ? 'sm:col-span-1 lg:col-span-1' : ''}`}
              >
                <div className="w-full aspect-[4/3] bg-black/5 overflow-hidden rounded-xs relative">
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
