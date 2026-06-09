import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Layers, Image as ImageIcon, Sparkle, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface ObjetoAntiModaProps {
  onSelectPhoto: (src: string) => void;
}

// --- HELPER CLASS: Web Audio API Siren's Song & Ambient Ocean Waves ---
class SirenSongAudioSynth {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private activeGains: GainNode[] = [];
  private delayNode: DelayNode | null = null;
  private delayFeedback: GainNode | null = null;
  private isPlayingAmbient = false;

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      // Lowpass filter for underwater sound
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(450, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      // Delay feedback loop for dream echoing effect
      this.delayNode = this.ctx.createDelay(2.0);
      this.delayNode.delayTime.setValueAtTime(0.65, this.ctx.currentTime);
      this.delayFeedback = this.ctx.createGain();
      this.delayFeedback.gain.setValueAtTime(0.48, this.ctx.currentTime);

      // Connect delay feedback loop
      this.delayNode.connect(this.delayFeedback);
      this.delayFeedback.connect(this.delayNode);

      // Master connections
      this.filter.connect(this.masterGain);
      this.delayNode.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  // Synthesize and play a single etheareal singing chime
  playSirenNote(freq: number) {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    
    // Vocal twin oscillators
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    // Subtle pitch vibrato
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    vibrato.frequency.value = 5.2; // 5.2 Hz
    vibratoGain.gain.value = freq * 0.008; // vibrato depth
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc1.frequency);
    vibratoGain.connect(osc2.frequency);
    vibrato.start(now);

    osc2.type = 'triangle'; // Adds warm breathy harmonics
    osc2.frequency.setValueAtTime(freq + 2.0, now); // Detuned

    oscGain.gain.setValueAtTime(0, now);
    oscGain.gain.linearRampToValueAtTime(0.18, now + 0.35); // Gentle attack
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 2.8); // Long release

    osc1.connect(oscGain);
    osc2.connect(oscGain);
    oscGain.connect(this.filter!);
    oscGain.connect(this.delayNode!);

    osc1.start(now);
    osc2.start(now);
    
    osc1.stop(now + 3.0);
    osc2.stop(now + 3.0);
    vibrato.stop(now + 3.0);
  }

  // Starts the sea waves ambient background generator
  startAmbient() {
    this.init();
    if (!this.ctx || this.isPlayingAmbient) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlayingAmbient = true;
    const now = this.ctx.currentTime;

    // 1. Noise wave generator
    const bufferSize = this.ctx.sampleRate * 2.0;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2.0 - 1.0;
    }

    this.noiseSource = this.ctx.createBufferSource();
    this.noiseSource.buffer = noiseBuffer;
    this.noiseSource.loop = true;

    this.noiseGain = this.ctx.createGain();
    this.noiseGain.gain.setValueAtTime(0.009, now);

    const waveFilter = this.ctx.createBiquadFilter();
    waveFilter.type = 'lowpass';
    waveFilter.frequency.setValueAtTime(320, now);

    // LFO swell for ocean waves
    this.lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    this.lfo.type = 'sine';
    this.lfo.frequency.setValueAtTime(0.09, now); // slow breath
    lfoGain.gain.setValueAtTime(140, now);

    this.lfo.connect(lfoGain);
    lfoGain.connect(waveFilter.frequency);

    this.noiseSource.connect(waveFilter);
    waveFilter.connect(this.noiseGain);
    this.noiseGain.connect(this.masterGain!);

    this.lfo.start(now);
    this.noiseSource.start(now);

    // 2. Add sub-aquatic sine drone chord (D minor 7th)
    const chords = [73.42, 110.00, 130.81, 146.83]; // D2, A2, C3, D3
    chords.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const oscGain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      
      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.linearRampToValueAtTime(0.035 - idx * 0.008, now + 2.5);

      osc.connect(oscGain);
      oscGain.connect(this.filter!);

      osc.start(now);
      this.activeOscillators.push(osc);
      this.activeGains.push(oscGain);
    });
  }

  stopAmbient() {
    if (!this.isPlayingAmbient) return;
    const now = this.ctx ? this.ctx.currentTime : 0;

    if (this.noiseSource) {
      try {
        this.noiseSource.stop(now + 1.2);
      } catch (e) {}
      this.noiseSource = null;
    }
    if (this.lfo) {
      try {
        this.lfo.stop(now + 1.2);
      } catch (e) {}
      this.lfo = null;
    }

    this.activeGains.forEach(gain => {
      if (this.ctx) {
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
      }
    });

    this.activeOscillators.forEach(osc => {
      try {
        osc.stop(now + 1.2);
      } catch (e) {}
    });

    this.activeOscillators = [];
    this.activeGains = [];
    this.isPlayingAmbient = false;
  }

  setVolume(vol: number) {
    this.init();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(vol * 0.12, this.ctx.currentTime);
    }
  }
}

const sirenSynth = new SirenSongAudioSynth();

const antiModaCategories = [
  {
    id: 'concepto',
    title: 'Surrealismo & Sirenas',
    icon: BookOpen,
    badge: '01 / CONCEPTO',
    tag: 'Identidad Onírica y Anhelo Utópico',
    summary: 'Exploración de los aspectos más profundos de la mente. Una chica obsesionada con ser sirena vive en la frontera de la fantasía y la realidad terrenal. Su deseo de transformarse habita en sus pensamientos diarios, encontrando en una manta de cola de sirena su objeto más valioso.',
    bullets: [
      'Identidad Onírica: la dualidad entre la tierra y el mar',
      'Anhelo Utópico: el deseo constante de escape de la realidad',
      'La manta de sirena como símbolo tangible de su obsesión'
    ],
    images: [
      { src: '/proyectosAudiovisuales/ObjetoAntiModa/sirenas.webp', caption: 'Sirenas - La dualidad del mar y la fantasía.' }
    ]
  },
  {
    id: 'moda',
    title: 'Universo de la Moda',
    icon: Layers,
    badge: '02 / EXPRESIÓN',
    tag: 'La moda como canal identitario',
    summary: 'La moda tiene la capacidad de reconfigurar las identidades y jugar con las fronteras de lo fantástico. Se convierte en una manifestación física del conflicto interno del personaje, funcionando como un puente material hacia su sueño marino.',
    bullets: [
      'Reconfiguración de fronteras entre lo normal y lo fantástico',
      'El vestuario como manifestación del conflicto interno del personaje',
      'La moda como medio de escape e identidad híbrida'
    ],
    images: [
      { src: '/proyectosAudiovisuales/ObjetoAntiModa/Cercania al universo de la moda/moda.webp', caption: 'Cercanía al universo de la moda - Textura y presencia.' }
    ]
  },
  {
    id: 'escenografia',
    title: 'Escenografía',
    icon: ImageIcon,
    badge: '03 / DIRECCIÓN DE ARTE',
    tag: 'Atmósfera Onírica y Contrastes',
    summary: 'Los espacios combinan elementos domésticos cotidianos con intervenciones marinas sutiles. Se compone una espacialidad que transmite el encierro terrenal y los atisbos del océano soñado por el personaje.',
    bullets: [
      'Espacios cotidianos distorsionados por la fantasía marina',
      'Efectos de iluminación y reflejos que sugieren agua',
      'Dirección de arte que convive entre la tierra y el océano'
    ],
    images: [
      { src: '/proyectosAudiovisuales/ObjetoAntiModa/Escenografia/escenografia1.webp', caption: 'Escenografía - Detalle del set y sombras.' },
      { src: '/proyectosAudiovisuales/ObjetoAntiModa/Escenografia/escenografia2.webp', caption: 'Escenografía - Composición espacial.' },
      { src: '/proyectosAudiovisuales/ObjetoAntiModa/Escenografia/escenografia3.webp', caption: 'Escenografía - Iluminación y reflejos.' },
      { src: '/proyectosAudiovisuales/ObjetoAntiModa/Escenografia/escenografia4.webp', caption: 'Escenografía - Texturas del set.' }
    ]
  },
  {
    id: 'estilismo',
    title: 'Estilismo & Texturas',
    icon: Sparkles,
    badge: '04 / ESTILISMO',
    tag: 'Escamas e Hilos de Fantasía',
    summary: 'El estilismo deconstruye las siluetas humanas para emular la morfología marina. Se utilizan tejidos brillantes, pliegues y asimetrías que evocan las aletas y el fluir constante del agua.',
    bullets: [
      'Prendas y texturas tejidas que simulan escamas',
      'Siluetas asimétricas y pliegues ondulados',
      'Materiales brillantes que reflejan la luz como la superficie del mar'
    ],
    images: [
      { src: '/proyectosAudiovisuales/ObjetoAntiModa/Estilismo/estilismo1.webp', caption: 'Estilismo - Silueta y caída marina.' },
      { src: '/proyectosAudiovisuales/ObjetoAntiModa/Estilismo/estilismo2.png', caption: 'Estilismo - Texturas tejidas de escamas.' },
      { src: '/proyectosAudiovisuales/ObjetoAntiModa/Estilismo/estilismo3.webp', caption: 'Estilismo - Brillo y detalles metálicos.' }
    ]
  },
  {
    id: 'maquillaje',
    title: 'Maquillaje / Make Up',
    icon: Sparkle,
    badge: '05 / CARACTERIZACIÓN',
    tag: 'Brillo húmedo y rasgos marinos',
    summary: 'La caracterización del rostro enfatiza la belleza sobrenatural y el aire húmedo. Se priorizan pieles extremadamente glowy, delineados dramáticos y tonos que sugieren el fondo del mar.',
    bullets: [
      'Piel extremadamente glowy y efecto mojado',
      'Delineado y realce de ojos con matices oscuros',
      'Labios de brillo perlado que remiten a las conchas marinas'
    ],
    images: [
      { src: '/proyectosAudiovisuales/ObjetoAntiModa/Maquillaje/maquillaje1.jpg', caption: 'Maquillaje - Delineado y efecto húmedo.' },
      { src: '/proyectosAudiovisuales/ObjetoAntiModa/Maquillaje/maquillaje2.webp', caption: 'Maquillaje - Brillos y acabado perlado.' }
    ]
  }
];

const colorSwatches = [
  { id: 'c1', file: '/proyectosAudiovisuales/ObjetoAntiModa/Colores/color1.png', freq: 329.63, note: 'E4' },
  { id: 'c2', file: '/proyectosAudiovisuales/ObjetoAntiModa/Colores/color2.png', freq: 392.00, note: 'G4' },
  { id: 'c3', file: '/proyectosAudiovisuales/ObjetoAntiModa/Colores/color3.png', freq: 440.00, note: 'A4' },
  { id: 'c4', file: '/proyectosAudiovisuales/ObjetoAntiModa/Colores/color4.webp', freq: 493.88, note: 'B4' },
  { id: 'c5', file: '/proyectosAudiovisuales/ObjetoAntiModa/Colores/color5.png', freq: 587.33, note: 'D5' },
  { id: 'c6', file: '/proyectosAudiovisuales/ObjetoAntiModa/Colores/color6.webp', freq: 659.25, note: 'E5' },
  { id: 'c7', file: '/proyectosAudiovisuales/ObjetoAntiModa/Colores/color7.png', freq: 783.99, note: 'G5' }
];

const WaveVisualizer = ({ active }: { active: boolean }) => {
  return (
    <div className="flex gap-[4px] items-end h-8 w-20 justify-center">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 bg-[var(--color-brand-bordo)] rounded-t-sm"
          animate={active ? {
            height: [6, 24, 10, 28, 14, 20, 8, 16][(i + Math.floor(Math.random() * 4)) % 8]
          } : {
            height: 3
          }}
          transition={active ? {
            repeat: Infinity,
            duration: 0.8 + i * 0.09,
            ease: 'easeInOut'
          } : {
            duration: 0.4
          }}
        />
      ))}
    </div>
  );
};

export default function ObjetoAntiModaAudiovisual({ onSelectPhoto: _onSelectPhoto }: ObjetoAntiModaProps) {
  const [isPlayingAmbient, setIsPlayingAmbient] = useState(false);
  const [synthVolume, setSynthVolume] = useState(0.5);
  const [inlinePreviews, setInlinePreviews] = useState<Record<string, string | null>>({});

  // Setup synth volume listener
  useEffect(() => {
    sirenSynth.setVolume(synthVolume);
  }, [synthVolume]);

  // Cleanup synth on unmount
  useEffect(() => {
    return () => {
      sirenSynth.stopAmbient();
    };
  }, []);

  const handleToggleAmbient = () => {
    if (isPlayingAmbient) {
      sirenSynth.stopAmbient();
      setIsPlayingAmbient(false);
    } else {
      sirenSynth.startAmbient();
      setIsPlayingAmbient(true);
    }
  };

  const playChimeNote = (freq: number) => {
    sirenSynth.playSirenNote(freq);
  };

  return (
    <div className="w-full py-24 bg-black/[0.01] border-t border-[var(--color-brand-marron-claro)]/25 relative pointer-events-auto select-none">
      
      {/* Intro Header */}
      <div className="mb-20 text-center md:text-left select-none">
        <span className="text-[10px] md:text-[11px] font-mono tracking-[0.35em] text-[var(--color-brand-bordo)] uppercase font-semibold">
          PROCESO DE DISEÑO & BITÁCORA SURREALISTA
        </span>
        <h3 className="font-brand text-4xl sm:text-5xl uppercase tracking-wider text-[var(--color-brand-marron-oscuro)] mt-2 mb-4">
          Bitácora Onírica
        </h3>
        <p className="text-sm font-sans tracking-wide leading-relaxed text-[var(--color-brand-marron-oscuro)]/80 max-w-2xl text-left">
          Objeto Anti-Moda deconstruye los límites entre la fantasía y la realidad terrenal a través de la dirección de arte y el surrealismo. Explora la bitácora para descubrir cómo se materializó el anhelo del océano.
        </p> 
      </div>

      {/* Narrative Stack */}
      <div className="space-y-32">
        {antiModaCategories.map((cat, idx) => {
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
              {/* Narrative Column */}
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
                  <span>№03 // ANTI-MODA</span>
                  <span>{`[ ${cat.images.length} ARCHIVOS ]`}</span>
                </div>
              </div>

              {/* Media Display Column */}
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
                    <div className={`grid gap-4 ${
                      cat.images.length === 1 
                        ? 'grid-cols-1 max-w-xl mx-auto' 
                        : cat.images.length === 2 
                        ? 'grid-cols-2' 
                        : cat.images.length === 3 
                        ? 'grid-cols-3' 
                        : 'grid-cols-2 md:grid-cols-4'
                    }`}>
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

      {/* INTERACTIVE COLOR NOTE PLAYER & SOUND EFFECTS */}
      <motion.div 
        initial={{ opacity: 0, y: 55 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-32 w-full border border-[var(--color-brand-marron-claro)]/25 rounded-sm p-6 md:p-10 bg-white/40 backdrop-blur-md shadow-lg"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Block: The Interactive Swatches */}
          <div className="lg:col-span-7 flex flex-col justify-between text-left">
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-[var(--color-brand-bordo)] uppercase font-semibold">
                MELODÍA CROMÁTICA & INTERACTIVIDAD
              </span>
              <h3 className="font-brand text-3xl uppercase tracking-wider text-[var(--color-brand-marron-oscuro)] mt-1 mb-6">
                Frecuencias de Color
              </h3>
              
              <p className="text-sm font-sans tracking-wide leading-relaxed text-[var(--color-brand-marron-oscuro)]/90 mb-8">
                Cada color en la paleta de la obra resuena con una vibración emocional. Pasa el cursor u oprime las tarjetas de color a continuación para desencadenar el canto de sirena correspondiente a su frecuencia sonora.
              </p>

              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
                {colorSwatches.map((color, idx) => (
                  <motion.div
                    key={color.id}
                    onMouseEnter={() => playChimeNote(color.freq)}
                    onClick={() => playChimeNote(color.freq)}
                    whileHover={{ y: -4, scale: 1.05 }}
                    className="group cursor-pointer border border-[var(--color-brand-marron-claro)]/20 shadow-xs rounded-xs overflow-hidden bg-black/[0.02] flex flex-col justify-between p-2 h-[120px] pointer-events-auto"
                  >
                    <div className="w-full h-[65px] bg-black/5 overflow-hidden rounded-xs relative">
                      <img 
                        src={color.file} 
                        alt={`Color ${idx + 1}`} 
                        className="w-full h-full object-cover select-none pointer-events-none" 
                        draggable="false"
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] font-mono font-bold block text-[var(--color-brand-marron-oscuro)]/60">
                        {color.note}
                      </span>
                      <span className="text-[7px] font-mono text-[var(--color-brand-marron-claro)] block">
                        {color.freq} Hz
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center lg:text-left text-[9px] font-mono tracking-widest text-[var(--color-brand-marron-oscuro)]/40 uppercase">
                [ HAZ HOVER O CLICK EN LOS COLORES PARA REVELAR LA NOTA ]
              </div>
            </div>
          </div>

          {/* Right Block: Ambient Controller Console */}
          <div className="lg:col-span-5 border border-[var(--color-brand-marron-claro)]/20 rounded-xs p-5 bg-white/50 backdrop-blur-md flex flex-col justify-between shadow-sm">
            <div className="flex flex-col items-center">
              
              {/* Aquatic Shell Wave Visualizer */}
              <div className="relative w-36 h-36 flex items-center justify-center mb-6 bg-[var(--color-brand-crema)] border border-[var(--color-brand-marron-claro)]/20 rounded-full shadow-inner">
                <div className="absolute inset-4 rounded-full border border-[var(--color-brand-marron-claro)]/10 flex items-center justify-center">
                  <div className="absolute inset-4 rounded-full border border-[var(--color-brand-marron-claro)]/10" />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                  <Sparkle size={24} className={`text-[var(--color-brand-bordo)] ${isPlayingAmbient ? 'animate-spin' : 'opacity-30'}`} style={{ animationDuration: '6s' }} />
                </div>
              </div>

              <span className="text-[9px] font-mono tracking-widest text-[var(--color-brand-bordo)] font-bold mb-1 uppercase">
                AMBIFÓNICO SUB-ACUÁTICO
              </span>
              <span className="text-[11px] font-sans text-gray-600 block text-center mb-4">
                Generador de oleaje y resonancia abisal
              </span>
            </div>

            <div className="w-full flex flex-col gap-4 border-t border-[var(--color-brand-marron-claro)]/15 pt-4">
              <div className="flex justify-between items-center w-full">
                <span className="text-[10px] font-mono tracking-wider font-bold">RESONANCIA:</span>
                <WaveVisualizer active={isPlayingAmbient} />
              </div>

              <div className="flex justify-between items-center gap-4">
                <button
                  onClick={handleToggleAmbient}
                  aria-label={isPlayingAmbient ? "Pausar ambiente" : "Reproducir ambiente"}
                  className="w-10 h-10 rounded-full bg-[var(--color-brand-bordo)] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer shrink-0"
                >
                  {isPlayingAmbient ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="translate-x-[1px]" />}
                </button>

                <div className="flex items-center gap-2 w-full">
                  {synthVolume === 0 ? <VolumeX size={14} className="text-gray-500" /> : <Volume2 size={14} className="text-gray-500" />}
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={synthVolume}
                    onChange={(e) => setSynthVolume(parseFloat(e.target.value))}
                    aria-label="Volumen del ambiente"
                    className="w-full accent-[var(--color-brand-bordo)] h-1 rounded-lg cursor-pointer bg-[var(--color-brand-marron-claro)]/20"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </motion.div>

    </div>
  );
}
