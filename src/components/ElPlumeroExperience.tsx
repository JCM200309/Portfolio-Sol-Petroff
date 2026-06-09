import { useState, useRef } from 'react'
import { motion, AnimatePresence, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Play, Square, Volume2, BookOpen } from 'lucide-react'

// --- HELPER COMPONENT: 3D Interactive Hover Tilt Container ---
interface TiltContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function TiltContainer({ children, className = "" }: TiltContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const springConfig = { damping: 25, stiffness: 180, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [0, 1], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-8, 8]), springConfig);

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
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
      className={`relative ${className}`}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// --- SOUND SYNTHESIS UTILITIES ---
const playVinylCrackle = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Crackle noise generator
    const bufferSize = ctx.sampleRate * 0.45;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const rand = Math.random();
      if (rand > 0.99) {
        data[i] = (Math.random() * 2 - 1) * 0.35; // crackle pop
      } else {
        data[i] = (Math.random() * 2 - 1) * 0.012; // warm surface hiss
      }
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1100;
    filter.Q.value = 1.2;
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.42);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    noise.start();
  } catch (e) {
    console.warn("AudioContext failed to load: ", e);
  }
};

const playNeedleTone = (frequency = 330) => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Warm triangular waveform for analog vibe
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, now);
    osc.frequency.exponentialRampToValueAtTime(frequency - 35, now + 0.12);
    
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.55);
  } catch (e) {
    console.warn("AudioContext blocked: ", e);
  }
};

export default function ElPlumeroExperience() {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeTrack, setActiveTrack] = useState<number>(0);
  const [activeAlbum, setActiveAlbum] = useState<number | null>(null);

  const handleGoBack = () => {
    window.location.hash = '#narrativa';
  };

  const tracks = [
    {
      id: 0,
      title: "El Rey del Vinilo",
      sub: "Jonathan Fribank y Musicomio",
      text: "Jonathan Fribank nos abre las puertas de Musicomio, un templo analógico. Descrito como el 'Rey del Vinilo', su figura encarna el coleccionismo apasionado en Buenos Aires, una trinchera frente a la digitalización masiva.",
      frequency: 293.66 // D4
    },
    {
      id: 1,
      title: "La Religión del Vinilo",
      sub: "El ritual de la escucha física",
      text: "'El vinilo es otra cosa. Es como una religión: hay gente que lo va a comprar, lo abre, lo huele. Es un ritual'. La relación física con el soporte, la textura de la carátula y el aroma del plástico definen una devoción.",
      frequency: 329.63 // E4
    },
    {
      id: 2,
      title: "Melómano y Comerciante",
      sub: "El arte de rodearse de expertos",
      text: "'Soy mejor comerciante que melómano. Por eso me rodeo de gente que sabe mucho de música, mientras yo me ocupo del resto'. Una confesión sincera sobre el liderazgo de una disquería exitosa, gestionando la pasión ajena.",
      frequency: 392.00 // G4
    },
    {
      id: 3,
      title: "Coleccionistas & Fetiche",
      sub: "El negocio del disco colgado",
      text: "'Hoy en día algunos clientes gastan hasta un millón de pesos. Hay gente que compra discos y ni los escucha, los cuelga o los colecciona'. El vinilo trasciende el audio para convertirse en un fetiche estético de estantería.",
      frequency: 440.00 // A4
    },
    {
      id: 4,
      title: "La Búsqueda de Radiohead",
      sub: "La fuerza del sonido de cabecera",
      text: "'Mi banda de cabecera es Radiohead. Sé que para muchos es música depresiva pero a mí me levanta'. Un anclaje afectivo a través de Kid A. La paradoja de encontrar consuelo y vitalidad en la melancolía electrónica.",
      frequency: 523.25 // C5
    }
  ];

  const albumsCurated = [
    {
      id: 0,
      title: "Ella and Louis",
      artist: "Ella Fitzgerald & Louis Armstrong",
      desc: "La calidez del jazz vocal clásico. La combinación perfecta de texturas vocales que se sienten vivas en la aguja de vinilo.",
      color: "from-amber-800/10 to-amber-950/20",
      cover: "/narrativa/elPlumero/fotos discos/ellaAndLouis.png"
    },
    {
      id: 1,
      title: "Harlequin",
      artist: "Lady Gaga",
      desc: "Una producción pop contemporánea adaptada al formato de colección, demostrando la vigencia del vinilo en la música de hoy.",
      color: "from-emerald-800/10 to-emerald-950/20",
      cover: "/narrativa/elPlumero/fotos discos/harlequin.jpg"
    },
    {
      id: 2,
      title: "Welcome to Wherever You Are",
      artist: "INXS",
      desc: "Rock alternativo con arreglos expansivos. La mezcla analógica original del disco brilla en equipos de alta fidelidad.",
      color: "from-blue-800/10 to-blue-950/20",
      cover: "/narrativa/elPlumero/fotos discos/welcomeToWhereverYouAre.jpg"
    },
    {
      id: 3,
      title: "Clube de Esquina",
      artist: "Lô Borges y Milton Nascimento",
      desc: "Un clásico indiscutido de la música brasileña. Armonías ricas y folk psicodélico que transportan de inmediato al oyente.",
      color: "from-yellow-800/10 to-yellow-950/20",
      cover: "/narrativa/elPlumero/fotos discos/clubeDeEsquina.jpg"
    },
    {
      id: 4,
      title: "Lifted Trombone Shorty",
      artist: "Trombone Shorty",
      desc: "Funk y jazz de Nueva Orleans. Un sonido enérgico cargado de bronces que saturan de forma placentera los amplificadores valvulares.",
      color: "from-red-800/10 to-red-950/20",
      cover: "/narrativa/elPlumero/fotos discos/liftedTromboneShorty.png"
    },
    {
      id: 5,
      title: "Lionheart",
      artist: "Kate Bush",
      desc: "Pop artístico y teatral. La voz cristalina y mística de Kate Bush grabada con la calidez orgánica del vinilo clásico.",
      color: "from-purple-800/10 to-purple-950/20",
      cover: "/narrativa/elPlumero/fotos discos/lionHeart.png"
    },
    {
      id: 6,
      title: "C'mon You Know",
      artist: "Liam Gallagher",
      desc: "Actitud britpop directa. Guitarras distorsionadas y percusión sólida que golpea con fuerza física en el cartón y el surco.",
      color: "from-slate-800/10 to-slate-950/20",
      cover: "/narrativa/elPlumero/fotos discos/cmonYouKnow.png"
    },
    {
      id: 7,
      title: "Fever Dreams Pts. 1-4",
      artist: "Johnny Marr",
      desc: "Paisajes de guitarras en capas y delays rítmicos. La maestría del ex-guitarrista de The Smiths plasmada en una edición de lujo.",
      color: "from-rose-800/10 to-rose-950/20",
      cover: "/narrativa/elPlumero/fotos discos/feverDreams.png"
    }
  ];

  const selectTrack = (index: number) => {
    setActiveTrack(index);
    if (isPlaying) {
      playVinylCrackle();
      playNeedleTone(tracks[index].frequency);
    }
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      playVinylCrackle();
      playNeedleTone(tracks[activeTrack].frequency);
    }
  };

  // Calculate tonearm rotation based on active track
  const tonearmRotation = 14 + activeTrack * 7;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full min-h-screen relative bg-[var(--color-brand-crema)] text-[var(--color-brand-marron-oscuro)] overflow-y-auto overflow-x-hidden selection:bg-[var(--color-brand-bordo)] selection:text-[var(--color-brand-crema)] pb-32 pt-24 pointer-events-auto"
    >
      {/* Noise overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />

      {/* Navigation and sub-badge */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 flex justify-between items-center relative z-10 select-none">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-[var(--color-brand-marron-oscuro)]/70 hover:text-[var(--color-brand-bordo)] transition-colors duration-300 group cursor-pointer"
        >
          <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Volver a Narrativas</span>
        </button>
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase opacity-55">
          VISTA PREVIA DEL REPORTE // 03
        </span>
      </div>

      {/* BLOCK 1: EDITORIAL HERO */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-12 gap-8 lg:gap-16 items-center mb-32 relative z-10">
        
        {/* Left Column: Title */}
        <div className="col-span-12 lg:col-span-6 flex flex-col justify-center select-none">
          <span className="text-xs font-mono tracking-[0.35em] text-[var(--color-brand-bordo)] uppercase font-semibold mb-4">
            Investigación Narrativa
          </span>
          <h1 className="text-5xl sm:text-7xl xl:text-[5.2vw] font-brand tracking-tight text-[var(--color-brand-marron-oscuro)] leading-[0.9] mb-8 uppercase">
            El <br />
            <span className="text-[var(--color-brand-bordo)]">Plumero</span>
          </h1>
          <div className="w-16 h-[1px] bg-[var(--color-brand-bordo)]/30 mb-8" />
          <p className="text-2xl sm:text-3xl font-brand italic text-[var(--color-brand-marron-oscuro)]/90 leading-tight mb-8">
            “La religión del vinilo y el ritual analógico.”
          </p>
          <p className="text-base leading-relaxed text-[var(--color-brand-marron-oscuro)]/80 max-w-xl text-left">
            Una inmersión documental en Musicomio, disquería icónica de Buenos Aires capitaneada por Jonathan Fribank. Una mirada sobre el renacimiento del vinilo, la sacralización del ritual físico de la música y el mercado del fetiche coleccionable.
          </p>
        </div>

        {/* Right Column: Hero Cover Sleeve */}
        <div className="col-span-12 lg:col-span-6 flex justify-center">
          <TiltContainer className="w-full max-w-[460px] p-5 bg-white/45 backdrop-blur-md border border-[var(--color-brand-marron-claro)]/25 shadow-[0_25px_60px_rgba(146,94,61,0.06)] rounded-sm">
            <div className="relative aspect-square overflow-hidden rounded-xs bg-[var(--color-brand-crema)] group">
              <img
                src="/narrativa/elPlumero/portada.jpg"
                alt="El Plumero - Portada de disquería"
                className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out select-none pointer-events-none"
              />
              <div className="absolute inset-0 bg-neutral-900/5 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700" />
              
              {/* Overlay record sleeve ring aesthetic */}
              <div className="absolute inset-4 rounded-full border border-white/5 pointer-events-none" />
              <div className="absolute inset-[30%] rounded-full border border-white/5 pointer-events-none" />
              
              {/* Focus crop marks */}
              <span className="absolute top-4 left-4 text-xs font-light text-white/45 select-none pointer-events-none">+</span>
              <span className="absolute top-4 right-4 text-xs font-light text-white/45 select-none pointer-events-none">+</span>
              <span className="absolute bottom-4 left-4 text-xs font-light text-white/45 select-none pointer-events-none">+</span>
              <span className="absolute bottom-4 right-4 text-xs font-light text-white/45 select-none pointer-events-none">+</span>
            </div>
            <div className="mt-4 flex justify-between items-center text-[10px] font-mono tracking-[0.2em] text-[var(--color-brand-marron-oscuro)]/60 uppercase px-1 select-none">
              <span>ARCHIVO DE DISCOMANÍA</span>
              <span>№ 43 // EL PLUMERO</span>
            </div>
          </TiltContainer>
        </div>
      </div>

      {/* BLOCK 2: INTERACTIVE TURNTABLE VISUALIZER */}
      <div className="w-full py-24 bg-white/30 border-y border-[var(--color-brand-marron-claro)]/20 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Left Column: Turntable Deck */}
          <div className="col-span-12 lg:col-span-6 flex flex-col items-center justify-center min-h-[460px]">
            <span className="text-[10px] font-mono tracking-[0.3em] text-[var(--color-brand-marron-claro)] uppercase mb-6 select-none flex items-center gap-2">
              <Volume2 size={12} className="animate-pulse" />
              [ BANDEJA DE TOCADISCOS INTERACTIVA ]
            </span>
            
            {/* The Turntable Player Base Box */}
            <div className="relative w-[340px] h-[340px] md:w-[380px] md:h-[380px] bg-white/50 border border-[var(--color-brand-marron-claro)]/25 rounded-md shadow-2xl p-6 flex items-center justify-center">
              
              {/* Metallic Platter Ring */}
              <div className="relative w-[280px] h-[280px] md:w-[310px] md:h-[310px] rounded-full border-2 border-neutral-300 bg-neutral-100 flex items-center justify-center shadow-inner">
                
                {/* Vinyl Disc Body */}
                <motion.div
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ ease: "linear", duration: 3.5, repeat: Infinity }}
                  className="relative w-[260px] h-[260px] md:w-[290px] md:h-[290px] rounded-full bg-neutral-900 flex items-center justify-center shadow-lg border border-neutral-950"
                  style={{
                    backgroundImage: "repeating-radial-gradient(circle, #262626, #171717 2px, #262626 4px)"
                  }}
                >
                  {/* Central Record Label Sticker */}
                  <div className="w-[90px] h-[90px] rounded-full bg-[var(--color-brand-crema)] border border-[var(--color-brand-marron-claro)]/40 flex flex-col items-center justify-center relative select-none">
                    <span className="text-[5px] font-mono tracking-widest text-[var(--color-brand-marron-oscuro)]/70 uppercase">
                      MUSICOMIO
                    </span>
                    <span className="text-[9px] font-brand font-bold text-[var(--color-brand-bordo)] uppercase mt-0.5 tracking-wider">
                      Plumero
                    </span>
                    <span className="text-[5px] font-mono text-[var(--color-brand-marron-oscuro)]/50 mt-1">
                      PISTA 0{activeTrack + 1}
                    </span>
                    
                    {/* Spindle hole */}
                    <div className="w-3.5 h-3.5 rounded-full bg-neutral-400 border border-neutral-600 absolute shadow-inner" />
                  </div>
                </motion.div>
              </div>

              {/* Tonearm Base Assembly */}
              <div className="absolute top-6 right-6 flex flex-col items-center select-none pointer-events-auto z-20">
                <div className="w-12 h-12 rounded-full bg-neutral-300 border-2 border-neutral-400 shadow-md flex items-center justify-center relative">
                  <div className="w-6 h-6 rounded-full bg-neutral-600 border border-neutral-700" />
                  
                  {/* Rotating Tonearm Stick */}
                  <motion.div
                    className="absolute w-2 bg-gradient-to-b from-neutral-400 via-neutral-300 to-neutral-500 rounded-full origin-top pointer-events-none"
                    style={{
                      height: "140px",
                      top: "20px",
                      left: "calc(50% - 4px)",
                      transformOrigin: "center 0px"
                    }}
                    animate={{ rotate: isPlaying ? tonearmRotation : 0 }}
                    transition={{ type: "spring", stiffness: 80, damping: 14 }}
                  >
                    {/* Cartridge needle head */}
                    <div className="absolute bottom-0 left-[-4px] w-4 h-8 bg-neutral-700 rounded-xs border border-neutral-800 flex flex-col items-center justify-start">
                      {/* Stylus line */}
                      <div className="w-[1px] h-3 bg-amber-500 mt-2" />
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Turntable Control Controls: Power & Speed Button */}
              <button
                onClick={togglePlayback}
                className="absolute bottom-6 left-6 w-10 h-10 rounded-sm bg-neutral-800 hover:bg-neutral-900 border border-neutral-950 flex items-center justify-center text-[var(--color-brand-crema)] shadow-md cursor-pointer transition-colors active:scale-95 z-20"
                title={isPlaying ? "Detener" : "Reproducir"}
              >
                {isPlaying ? <Square size={14} fill="currentColor" /> : <Play size={14} className="ml-0.5" fill="currentColor" />}
              </button>

              <div className="absolute bottom-6 right-6 text-[8px] font-mono tracking-widest text-[var(--color-brand-marron-claro)] uppercase select-none">
                33 RPM // ALTA FIDELIDAD
              </div>
            </div>
          </div>

          {/* Right Column: Turntable Track Selection & Story */}
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-center">
            <span className="text-xs font-mono tracking-[0.25em] text-[var(--color-brand-marron-claro)] uppercase mb-3 block select-none">
              Sintonía y Registro
            </span>
            
            {/* Horizontal Grooves Track Selector Links */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none select-none">
              {tracks.map((track) => (
                <button
                  key={track.id}
                  onClick={() => selectTrack(track.id)}
                  className={`px-4 py-2 border rounded-sm text-xs font-mono tracking-wider whitespace-nowrap cursor-pointer transition-all duration-300 ${
                    activeTrack === track.id
                      ? "bg-[var(--color-brand-bordo)] border-[var(--color-brand-bordo)] text-[var(--color-brand-crema)] font-bold"
                      : "bg-white/40 border-[var(--color-brand-marron-claro)]/20 text-[var(--color-brand-marron-oscuro)] hover:border-[var(--color-brand-bordo)]/40"
                  }`}
                >
                  PISTA 0{track.id + 1}
                </button>
              ))}
            </div>

            {/* Track Info Display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTrack}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="min-h-[200px] text-left select-none"
              >
                <span className="text-[10px] font-mono tracking-[0.2em] text-[var(--color-brand-bordo)] font-bold block mb-1">
                  SURCO 0{activeTrack + 1} // {tracks[activeTrack].sub}
                </span>
                <h3 className="text-3xl font-brand uppercase text-[var(--color-brand-marron-oscuro)] mb-4">
                  {tracks[activeTrack].title}
                </h3>
                <div className="w-12 h-[1px] bg-[var(--color-brand-marron-claro)]/30 mb-6" />
                <p className="text-base leading-relaxed text-[var(--color-brand-marron-oscuro)]/80">
                  {tracks[activeTrack].text}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* BLOCK 3: DISQUERÍA NARRATIVE & COLLECTING */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-32 relative z-10 select-none">
        <div className="grid grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Left Column: Quotes and Rituality */}
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-center">
            <span className="text-xs font-mono tracking-[0.3em] text-[var(--color-brand-marron-claro)] uppercase mb-3 block">
              La Liturgia Analógica
            </span>
            <h3 className="text-3xl font-brand uppercase text-[var(--color-brand-marron-oscuro)] mb-6">
              El fetiche de la disquería
            </h3>
            
            <div className="space-y-6 text-sm md:text-base leading-relaxed text-[var(--color-brand-marron-oscuro)]/80 text-left">
              <p>
                La disquería se define como un espacio donde conviven historias y ausencias. Fribank reflexiona sobre la desaparición o fallecimiento de clientes habituales que encargaban discos, dotando al lugar de un halo de nostalgia silenciosa.
              </p>
              <p>
                Para el coleccionista, el disco físico adquiere propiedades de <strong>fetiche estético y religioso</strong>. El ritual de ir a la tienda, desprecintar el cartón, oler el vinilo nuevo y sentir el peso físico del objeto constituye una liturgia irreemplazable.
              </p>
              <p>
                A la vez, surge la contradicción del coleccionista moderno: clientes que adquieren ediciones costosas y de colección no para reproducirlas ni escucharlas, sino simplemente para colgarlas en sus paredes o guardarlas herméticamente en estantes.
              </p>
            </div>
          </div>

          {/* Right Column: Custom vinyl disc graphic display */}
          <div className="col-span-12 lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[360px] aspect-square flex items-center justify-center">
              {/* Sleeve jacket frame background */}
              <div className="absolute inset-0 bg-neutral-800 rounded-sm shadow-xl border border-neutral-700 overflow-hidden">
                {/* Abstract texture representation representing record crates */}
                <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-black via-transparent to-neutral-900" />
                <div className="absolute bottom-6 left-6 text-left">
                  <span className="text-[8px] font-mono tracking-[0.2em] text-white/50 block">CURADURÍA DE MUSICOMIO</span>
                  <span className="text-lg font-brand font-bold text-white uppercase tracking-wider">EL PLUMERO</span>
                </div>
              </div>

              {/* Record disc sliding out of sleeve */}
              <motion.div
                initial={{ x: 0 }}
                whileInView={{ x: 80 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 50, damping: 12, delay: 0.3 }}
                className="absolute w-[280px] h-[280px] rounded-full bg-neutral-900 flex items-center justify-center border border-neutral-950 shadow-lg z-[-1]"
                style={{
                  backgroundImage: "repeating-radial-gradient(circle, #222, #111 2px, #222 4px)"
                }}
              >
                {/* Sticker */}
                <div className="w-20 h-20 rounded-full bg-[var(--color-brand-crema)] border border-[var(--color-brand-marron-claro)]/30 flex flex-col items-center justify-center">
                  <span className="text-[4px] font-mono text-[var(--color-brand-marron-oscuro)]/60 uppercase">INSOMNIO DISCOS</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 shadow-inner" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* BLOCK 4: CURADURÍA DE VINILOS (INTERACTIVE VINYL ALBUM FLIPS) */}
      <div className="w-full py-24 bg-white/30 border-y border-[var(--color-brand-marron-claro)]/20 relative z-10 select-none">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-xs font-mono tracking-[0.3em] text-[var(--color-brand-marron-claro)] uppercase mb-2">
              Selección de Musicomio
            </span>
            <h3 className="text-3xl md:text-5xl font-brand uppercase text-[var(--color-brand-marron-oscuro)]">
              Curaduría de Vinilos
            </h3>
            <div className="w-12 h-[1px] bg-[var(--color-brand-bordo)]/35 my-6" />
            <p className="text-sm md:text-base text-[var(--color-brand-marron-oscuro)]/70 max-w-xl">
              Los 8 álbumes destacados en la curaduría de la disquería. Haz clic sobre cada manga de disco para revelar la reseña y detalles de la mezcla analógica.
            </p>
          </div>

          {/* Grid of Albums */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {albumsCurated.map((album) => {
              const isSelected = activeAlbum === album.id;
              return (
                <div
                  key={album.id}
                  onClick={() => setActiveAlbum(isSelected ? null : album.id)}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  {/* Virtual sleeve container */}
                  <div className="relative w-full aspect-square mb-4 flex items-center justify-center">
                    
                    {/* Record sliding out (Visible when clicked) */}
                    <motion.div
                      animate={{ y: isSelected ? -24 : 0, scale: isSelected ? 0.98 : 0.95 }}
                      transition={{ type: "spring", stiffness: 80, damping: 14 }}
                      className="absolute inset-0 rounded-full bg-neutral-900 border border-neutral-950 flex items-center justify-center shadow-md z-0"
                      style={{
                        backgroundImage: "repeating-radial-gradient(circle, #262626, #171717 2px, #262626 4px)"
                      }}
                    >
                      {/* Central label */}
                      <div className="w-16 h-16 rounded-full bg-[var(--color-brand-crema)] border border-neutral-300 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                      </div>
                    </motion.div>
                    
                    {/* Album Jacket Sleeve */}
                    <div className="absolute inset-0 rounded-sm border border-[var(--color-brand-marron-claro)]/25 shadow-md overflow-hidden z-10 transition-transform duration-300 group-hover:-translate-y-1">
                      {/* Album Cover Image */}
                      <img 
                        src={album.cover} 
                        alt={album.title} 
                        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none group-hover:scale-105 transition-transform duration-500 ease-out" 
                        draggable="false"
                      />
                      {/* Dark/Warm gradient overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20 z-1" />
                      
                      {/* Content Overlay */}
                      <div className="absolute inset-0 flex flex-col justify-between p-5 z-2">
                        <span className="text-[8px] font-mono tracking-widest text-white/70 uppercase">
                          № 0{album.id + 1} // CURADO
                        </span>
                        
                        <div>
                          <h4 className="text-base font-brand font-bold text-[var(--color-brand-crema)] uppercase leading-tight tracking-wider mb-1 drop-shadow-sm">
                            {album.title}
                          </h4>
                          <span className="text-[10px] font-mono text-white/80 block">
                            {album.artist}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description Drawer under sleeve (AnimatePresence) */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="w-full text-left overflow-hidden bg-white/40 border border-[var(--color-brand-marron-claro)]/20 p-4 rounded-sm"
                      >
                        <p className="text-xs leading-relaxed text-[var(--color-brand-marron-oscuro)]/90">
                          {album.desc}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* BLOCK 5: OUTRO QUOTE & BUTTON CTA */}
      <div className="max-w-4xl mx-auto px-6 py-24 text-center relative z-10 flex flex-col items-center gap-12 select-none">
        <div className="w-16 h-[1px] bg-[var(--color-brand-marron-claro)]/40" />
        
        <blockquote className="text-2xl sm:text-4xl font-brand italic text-[var(--color-brand-marron-oscuro)] leading-relaxed">
          “La música no es solo sonido, es un puente material hacia la memoria de quienes fuimos.”
        </blockquote>
        
        <cite className="text-xs font-mono tracking-[0.25em] uppercase text-[var(--color-brand-bordo)] block not-italic -mt-4 font-bold">
          — CURADURÍA MUSICOMIO
        </cite>

        {/* Read Full Report Button */}
        <motion.a
          href="/narrativa/elPlumero/reporte.pdf"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-8 px-10 py-5 bg-[var(--color-brand-bordo)] text-[var(--color-brand-crema)] text-xs font-mono tracking-[0.3em] uppercase rounded-sm shadow-[0_15px_40px_rgba(132,6,36,0.25)] hover:shadow-[0_20px_50px_rgba(132,6,36,0.35)] transition-all duration-300 flex items-center gap-4 cursor-pointer border border-white/10"
        >
          <BookOpen size={16} />
          <span>Leer reporte completo</span>
          <ArrowUpRight size={16} />
        </motion.a>
      </div>
    </motion.div>
  );
}
