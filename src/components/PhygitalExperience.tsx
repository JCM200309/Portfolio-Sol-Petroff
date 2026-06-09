import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { X } from 'lucide-react';

// --- HELPER COMPONENT: 3D Interactive Hover Tilt Image ---
interface TiltImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  onClick?: () => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  parallaxY?: any;
  loading?: "lazy" | "eager";
}

export function TiltImage({ 
  src, 
  alt, 
  className = "", 
  imgClassName = "w-full h-auto",
  onClick, 
  onHoverStart, 
  onHoverEnd, 
  parallaxY,
  loading = "lazy"
}: TiltImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  
  const springConfig = { damping: 25, stiffness: 180, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [0, 1], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-6, 6]), springConfig);
  
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
        className="w-full h-full relative"
      >
        <img
          src={src}
          alt={alt}
          className={`${imgClassName} object-contain transition-transform duration-700 ease-out select-none pointer-events-none block`}
          loading={loading}
          decoding="async"
        />
        <div className="absolute inset-0 border border-emerald-500/10 pointer-events-none group-hover:border-emerald-400/20 transition-colors" />
        {/* Scanning scanline effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,255,102,0.015)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-40" />
      </motion.div>
    </motion.div>
  );
}

const phygitalImages = [
  "/proyectosAudiovisuales/PHYGITAL/Backstage/Inspo Explorador e IA/inspoExplorador.webp",
  "/proyectosAudiovisuales/PHYGITAL/Backstage/Inspo Explorador e IA/inspoExplorador2.jpg",
  "/proyectosAudiovisuales/PHYGITAL/Backstage/Inspo Explorador e IA/inspoIA.png",
  "/proyectosAudiovisuales/PHYGITAL/Backstage/Inspo Explorador e IA/inspoIA2.webp",
  "/proyectosAudiovisuales/PHYGITAL/Backstage/Locacion/locacion1.webp",
  "/proyectosAudiovisuales/PHYGITAL/Backstage/Locacion/locacion2.webp",
  "/proyectosAudiovisuales/PHYGITAL/Backstage/Locacion/locacion3.webp",
  "/proyectosAudiovisuales/PHYGITAL/Backstage/Vestuario/vestuario1.webp",
  "/proyectosAudiovisuales/PHYGITAL/Backstage/Vestuario/vestuario2.webp",
  "/proyectosAudiovisuales/PHYGITAL/Backstage/Vestuario/vestuario3.webp",
  "/proyectosAudiovisuales/PHYGITAL/Backstage/Vestuario/vestuario4.webp"
];

// --- HELPER FUNCTION: Web Audio API Cyber Shutter Shutter Synthesizer ---
const playCyberShutter = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    
    // Shutter Click noise
    const playClick = (time: number, volume: number, highpassFreq: number, decay: number) => {
      const bufferSize = ctx.sampleRate * decay;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(highpassFreq, time);
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + decay - 0.01);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      noise.start(time);
      noise.stop(time + decay);
    };

    // Cyber synth beep
    const playBeep = (time: number, freq: number, duration: number, volume: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      
      gain.gain.setValueAtTime(volume, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration - 0.01);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(time);
      osc.stop(time + duration);
    };

    playClick(now, 0.25, 1400, 0.07);
    playClick(now + 0.06, 0.2, 900, 0.09);
    playBeep(now, 880, 0.05, 0.08); // High cyber tick beep
  } catch (e) {
    console.warn('AudioContext failed: ', e);
  }
};

export default function PhygitalExperience() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [showFlash, setShowFlash] = useState(false);
  const [carreteOpen, setCarreteOpen] = useState(false);
  const [cursorMode, setCursorMode] = useState<'idle' | 'focus' | 'shutter'>('idle');
  const [cursorTelemetry, setCursorTelemetry] = useState({ xVal: '00.0', yVal: '00.0' });

  const pageRef = useRef<HTMLDivElement>(null);

  // Smooth custom cursor tracking
  const rawMouseX = useMotionValue(-100);
  const rawMouseY = useMotionValue(-100);
  const springX = useSpring(rawMouseX, { damping: 25, stiffness: 220, mass: 0.6 });
  const springY = useSpring(rawMouseY, { damping: 25, stiffness: 220, mass: 0.6 });

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      rawMouseX.set(e.clientX);
      rawMouseY.set(e.clientY);
      
      // Calculate normalized telemetry values
      const xPercent = ((e.clientX / window.innerWidth) * 100).toFixed(1);
      const yPercent = ((e.clientY / window.innerHeight) * 100).toFixed(1);
      setCursorTelemetry({ xVal: xPercent, yVal: yPercent });
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  useEffect(() => {
    if (cursorMode !== 'shutter') {
      setCursorMode(isHoveringImage ? 'focus' : 'idle');
    }
  }, [isHoveringImage]);

  const capturePhoto = (src: string, openLightbox = true) => {
    playCyberShutter();
    
    setCursorMode('shutter');
    setTimeout(() => {
      setCursorMode(isHoveringImage ? 'focus' : 'idle');
    }, 180);

    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 200);

    setCapturedPhotos(prev => {
      if (prev.includes(src)) return prev;
      return [...prev, src];
    });

    if (openLightbox) {
      setSelectedPhoto(src);
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full h-full min-h-screen relative bg-[#030604] text-emerald-100 overflow-y-auto overflow-x-hidden select-none pointer-events-auto pb-32 md:cursor-none"
    >
      {/* Laser line background noise */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay bg-[linear-gradient(rgba(18,24,20,0.85)_1px,transparent_1px)] bg-[size:100%_8px] z-0" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />

      {/* BLOCK 1: EDITORIAL HERO & CONCEPT */}
      <div className="w-full lg:h-screen grid grid-cols-12 border-b border-[#00ff66]/20 bg-[#030604] relative overflow-hidden">
        {/* Left Column: Cyber-Naturalist Story Block */}
        <div className="col-span-12 lg:col-span-6 bg-[#040c07] text-white pt-28 md:pt-36 pb-8 md:pb-16 px-8 md:px-16 flex flex-col justify-between relative min-h-[600px] lg:min-h-0 lg:h-full border-b lg:border-b-0 lg:border-r border-[#00ff66]/20">
          {/* Tech Corner markers */}
          <span className="absolute top-4 left-4 text-[9px] font-mono text-[#00ff66]/40 select-none pointer-events-none">[SYS.02]</span>
          <span className="absolute top-4 right-4 text-[9px] font-mono text-[#00ff66]/40 select-none pointer-events-none">[GPS.LOCK]</span>
          <span className="absolute bottom-4 left-4 text-[9px] font-mono text-[#00ff66]/40 select-none pointer-events-none">[ENV.ACTIVE]</span>
          <span className="absolute bottom-4 right-4 text-[9px] font-mono text-[#00ff66]/40 select-none pointer-events-none">[REPL.0% ]</span>

          <div className="flex justify-between items-center text-[10px] font-mono tracking-[0.3em] uppercase text-[#00ff66]">
            <span>02 // PORTFOLIO CATEGORY</span>
            <span>[ HUMANIDAD DIGITALIZADA ]</span>
          </div>
          
          <div className="my-auto pt-16 pb-12">
            <h1 className="text-6xl sm:text-8xl lg:text-[7vw] xl:text-[8vw] font-brand uppercase tracking-wider text-white mt-2 leading-[0.85] select-none">
              Phygital
            </h1>
            <div className="w-20 h-[1.5px] bg-[#00ff66]/40 my-8" />
          </div>

          <div className="max-w-xl pb-8 text-left">
            <p className="text-sm md:text-base lg:text-[16px] xl:text-[17px] font-sans tracking-wide leading-relaxed text-emerald-200/90">
              En un mundo cada vez más definido por la tecnología, la inteligencia artificial se ha convertido en una presencia omnipresente. Observa, aprende e intenta replicar a los seres humanos en una búsqueda constante de perfección. En esta coexistencia, la IA actúa como un espejo imperfecto, capaz de reflejar partes de nosotros, pero incapaz de comprender la esencia de lo que significa ser humano: las emociones.
            </p>
          </div>
          
          <div className="flex justify-between items-center text-[10px] font-mono tracking-[0.3em] uppercase text-[#00ff66]">
            <span>[ SYSTEM ENGINE: ACTIVE ]</span>
            <span>[ DATA DEPTH: 100% ]</span>
          </div>
        </div>

        {/* Right Column: Editorial Photo Composition */}
        <div className="col-span-12 lg:col-span-6 flex flex-col justify-between p-6 md:p-8 pt-28 md:pt-32 gap-6 lg:h-full lg:overflow-hidden relative bg-[#030604]">
          {/* Top row: Wide cinematic landscape photo (Frame 1) */}
          <div className="w-full flex-grow flex flex-col justify-center min-h-0">
            <div className="w-full max-w-2xl mx-auto flex flex-col gap-2">
              <div className="w-full text-[10px] font-mono tracking-[0.2em] text-[#00ff66]/70 uppercase flex justify-between items-center px-1">
                <span>[ CAMERA FEED // 01 ]</span>
                <span>[ RASTREO: 99.8% ]</span>
              </div>
              <div className="overflow-hidden border border-[#00ff66]/20 shadow-md rounded-xs group bg-[#040c07]">
                <TiltImage
                  src="/proyectosAudiovisuales/PHYGITAL/Backstage/Locacion/locacion1.webp"
                  alt="Phygital - Locación de rodaje"
                  onClick={() => capturePhoto('/proyectosAudiovisuales/PHYGITAL/Backstage/Locacion/locacion1.webp')}
                  onHoverStart={() => setIsHoveringImage(true)}
                  onHoverEnd={() => setIsHoveringImage(false)}
                  className="aspect-[16/10] max-h-[32vh] lg:h-[32vh] w-full flex items-center justify-center"
                  imgClassName="w-full h-full object-cover block"
                />
              </div>
              <div className="w-full text-[10px] font-mono tracking-[0.2em] text-[#00ff66] uppercase flex justify-between items-center px-1">
                <span>№02 // PHOTO 01</span>
                <span>[ CONTEXT: WOODS ]</span>
              </div>
            </div>
          </div>

          {/* Bottom row: Diptych of two vertical photos (Frame 2 & 3) side-by-side */}
          <div className="grid grid-cols-2 gap-6 md:gap-8 flex-grow min-h-0">
            {/* Left Column: Frame 2 (Vertical) */}
            <div className="flex flex-col justify-center min-h-0">
              <div className="w-full flex flex-col gap-2">
                <div className="w-full text-[10px] font-mono tracking-[0.2em] text-[#00ff66]/70 uppercase flex justify-between items-center px-1">
                  <span>[ OPTICAL SENSOR ]</span>
                  <span>[ LATENCY: 22ms ]</span>
                </div>
                <div className="overflow-hidden border border-[#00ff66]/20 shadow-md rounded-xs group bg-[#040c07]">
                  <TiltImage
                    src="/proyectosAudiovisuales/PHYGITAL/Backstage/Vestuario/vestuario1.webp"
                    alt="Phygital - Explorador"
                    onClick={() => capturePhoto('/proyectosAudiovisuales/PHYGITAL/Backstage/Vestuario/vestuario1.webp')}
                    onHoverStart={() => setIsHoveringImage(true)}
                    onHoverEnd={() => setIsHoveringImage(false)}
                    className="aspect-[2/3] max-h-[34vh] lg:h-[34vh] w-full flex items-center justify-center"
                    imgClassName="w-full h-full object-cover block"
                  />
                </div>
                <div className="w-full text-[10px] font-mono tracking-[0.2em] text-[#00ff66] uppercase flex justify-between px-1">
                  <span>№02 // EXPLORADOR</span>
                  <span>[ SHIELD: YES ]</span>
                </div>
              </div>
            </div>

            {/* Right Column: Frame 3 (Vertical) */}
            <div className="flex flex-col justify-center min-h-0">
              <div className="w-full flex flex-col gap-2">
                <div className="w-full text-[10px] font-mono tracking-[0.2em] text-[#00ff66]/70 uppercase flex justify-between items-center px-1">
                  <span>[ DIGITAL INSP ]</span>
                  <span>[ MATRIX: ON ]</span>
                </div>
                <div className="overflow-hidden border border-[#00ff66]/20 shadow-md rounded-xs group bg-[#040c07]">
                  <TiltImage
                    src="/proyectosAudiovisuales/PHYGITAL/Backstage/Inspo Explorador e IA/inspoIA.png"
                    alt="Phygital - Estética de la IA"
                    onClick={() => capturePhoto('/proyectosAudiovisuales/PHYGITAL/Backstage/Inspo Explorador e IA/inspoIA.png')}
                    onHoverStart={() => setIsHoveringImage(true)}
                    onHoverEnd={() => setIsHoveringImage(false)}
                    className="aspect-[2/3] max-h-[34vh] lg:h-[34vh] w-full flex items-center justify-center"
                    imgClassName="w-full h-full object-cover block"
                  />
                </div>
                <div className="w-full text-[10px] font-mono tracking-[0.2em] text-[#00ff66] uppercase flex justify-between px-1">
                  <span>№02 // ALGORITMO</span>
                  <span>[ RENDERING... ]</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BLOCK 2: CONFRONTATION & INTELLECTUAL MATRIX */}
      <div className="w-full grid grid-cols-12 border-b border-[#00ff66]/20 bg-[#030604] relative">
        {/* Left Column: Full vertical photo */}
        <div className="col-span-12 md:col-span-4 p-6 md:p-8 border-b md:border-b-0 md:border-r border-[#00ff66]/15 flex flex-col justify-between gap-4">
          <div className="w-full flex flex-col gap-3">
            <div className="text-[10px] font-mono tracking-[0.2em] text-[#00ff66]/70 uppercase flex justify-between items-center px-1">
              <span>[ GLOW RESOLVER ]</span>
              <span>[ F/1.8 ]</span>
            </div>
            <div className="w-full overflow-hidden border border-[#00ff66]/15 shadow-md rounded-xs group bg-[#040c07]">
              <TiltImage
                src="/proyectosAudiovisuales/PHYGITAL/Backstage/Vestuario/vestuario4.webp"
                alt="Phygital - Silhouette"
                onClick={() => capturePhoto('/proyectosAudiovisuales/PHYGITAL/Backstage/Vestuario/vestuario4.webp')}
                onHoverStart={() => setIsHoveringImage(true)}
                onHoverEnd={() => setIsHoveringImage(false)}
                className="w-full h-auto object-contain block"
              />
            </div>
            <div className="w-full h-[1px] bg-[#00ff66]/20 my-1" />
            <div className="flex justify-between items-center px-1 font-mono">
              <span className="text-[10px] tracking-widest text-[#00ff66] uppercase">
                №02 // FULL_ARMOR
              </span>
              <span className="text-[10px] tracking-widest text-emerald-400/50 uppercase">
                [ APOCALYPSE ]
              </span>
            </div>
          </div>
        </div>

        {/* Middle Column: Two photos, mixed landscape & portrait */}
        <div className="col-span-12 md:col-span-4 p-6 md:p-8 border-b md:border-b-0 md:border-r border-[#00ff66]/15 flex flex-col justify-between gap-8">
          {/* Top Landscape Photo */}
          <div className="w-full flex flex-col gap-3">
            <div className="text-[10px] font-mono tracking-[0.2em] text-[#00ff66]/70 uppercase flex justify-between items-center px-1">
              <span>[ GLITCH MAPPER ]</span>
              <span>[ RESOLUTION: 4K ]</span>
            </div>
            <div className="w-full overflow-hidden border border-[#00ff66]/15 shadow-md rounded-xs group bg-[#040c07]">
              <TiltImage
                src="/proyectosAudiovisuales/PHYGITAL/Backstage/Locacion/locacion2.webp"
                alt="Phygital - Escenario del duelo"
                onClick={() => capturePhoto('/proyectosAudiovisuales/PHYGITAL/Backstage/Locacion/locacion2.webp')}
                onHoverStart={() => setIsHoveringImage(true)}
                onHoverEnd={() => setIsHoveringImage(false)}
                className="w-full h-auto object-contain block"
              />
            </div>
            <div className="w-full h-[1px] bg-[#00ff66]/20 my-1" />
            <div className="text-[10px] font-mono tracking-widest text-[#00ff66] uppercase flex justify-between px-1">
              <span>[ DATA ID // LOC-02 ]</span>
              <span>[ NAT_MATRIX ]</span>
            </div>
          </div>

          {/* Bottom Portrait Photo */}
          <div className="w-full flex flex-col gap-3">
            <div className="text-[10px] font-mono tracking-[0.2em] text-[#00ff66]/70 uppercase flex justify-between items-center px-1">
              <span>[ HUMAN EXPLORER ]</span>
              <span>[ TARGET: TRACKED ]</span>
            </div>
            <div className="w-full overflow-hidden border border-[#00ff66]/15 shadow-md rounded-xs group bg-[#040c07]">
              <TiltImage
                src="/proyectosAudiovisuales/PHYGITAL/Backstage/Inspo Explorador e IA/inspoExplorador2.jpg"
                alt="Phygital - Explorador detalle"
                onClick={() => capturePhoto('/proyectosAudiovisuales/PHYGITAL/Backstage/Inspo Explorador e IA/inspoExplorador2.jpg')}
                onHoverStart={() => setIsHoveringImage(true)}
                onHoverEnd={() => setIsHoveringImage(false)}
                className="w-full h-auto object-contain block"
              />
            </div>
            <div className="w-full h-[1px] bg-[#00ff66]/20 my-1" />
            <div className="text-[10px] font-mono tracking-widest text-[#00ff66] uppercase flex justify-between px-1">
              <span>[ DATA ID // EXP-02 ]</span>
              <span>[ SENSOR_ON ]</span>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Text & Supporting Image */}
        <div className="col-span-12 md:col-span-4 p-6 md:p-8 flex flex-col justify-between min-h-[550px] bg-[#040c07]/50 relative text-left">
          <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#00ff66]/60 flex justify-between items-center">
            <span>[ SYSTEM LOG // 02 ]</span>
            <span>[ SHUTTER DATA ]</span>
          </div>

          <div className="my-auto py-8">
            <h2 className="text-5xl font-brand uppercase tracking-wider text-white mb-6 font-bold leading-none">
              El Espejismo
            </h2>
            
            <div className="space-y-6 mb-8 text-emerald-200/80 font-sans text-sm md:text-base">
              <p>
                La IA aparece como un reflejo inquietante, duplicando mecánicamente cada ademán y pose física en una coreografía perfecta de código y texturas. Pero al final de esta danza virtual, el humano libera su rasgo indivisible: sus emociones, provocando un cortocircuito irreplicable en el alma digital.
              </p>
              <p>
                Esta confrontación resalta la creatividad original y la autoconciencia humana, demostrando que detrás de la matemática y los algoritmos, la IA es un espejo imperfecto incapaz de imitar la profundidad de estar realmente vivo.
              </p>
            </div>

            {/* Supporting Image */}
            <div className="w-full flex flex-col gap-3">
              <div className="w-full overflow-hidden border border-[#00ff66]/15 shadow-md rounded-xs group bg-[#040c07]">
                <TiltImage
                  src="/proyectosAudiovisuales/PHYGITAL/Backstage/Inspo Explorador e IA/inspoIA2.webp"
                  alt="Phygital - Digital replica"
                  onClick={() => capturePhoto('/proyectosAudiovisuales/PHYGITAL/Backstage/Inspo Explorador e IA/inspoIA2.webp')}
                  onHoverStart={() => setIsHoveringImage(true)}
                  onHoverEnd={() => setIsHoveringImage(false)}
                  className="w-full h-auto object-contain block"
                />
              </div>
              <div className="text-[10px] font-mono tracking-widest text-[#00ff66]/60 uppercase flex justify-between px-1">
                <span>[ SUPPORTING DATA // INSPO_IA_2 ]</span>
                <span>[ CODE FLOW ]</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono tracking-[0.3em] uppercase text-[#00ff66]/60 border-t border-[#00ff66]/10 pt-4">
            <span>[ PROCESSOR: ONLINE ]</span>
            <span>[ ERROR_BUFF: CLEAR ]</span>
          </div>
        </div>
      </div>

      {/* BLOCK 3: FEATURED EXPOSURE STAGGERED GRID */}
      <div className="w-full py-24 px-6 md:px-12 bg-[#040a06]/20 border-b border-[#00ff66]/20 relative overflow-visible">
        <span className="absolute top-6 left-6 text-xs font-mono text-[#00ff66]/30 select-none pointer-events-none">+ SYSTEM STATUS // RUNNING</span>
        <span className="absolute top-6 right-6 text-xs font-mono text-[#00ff66]/30 select-none pointer-events-none">+ MEMORY STATUS // OK</span>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-16 select-none text-left">
          <div>
            <span className="text-[10px] font-mono tracking-[0.35em] text-[#00ff66] uppercase font-bold">
              ESPECTRO COMPLETO
            </span>
            <h3 className="font-brand text-4xl sm:text-5xl uppercase tracking-wider text-white mt-1.5 leading-none">
              Imágenes Destacadas
            </h3>
          </div>
          <div className="max-w-xs md:text-right border-l md:border-l-0 md:border-r border-[#00ff66]/20 pl-4 md:pl-0 md:pr-4 py-1 text-left md:text-right">
            <p className="text-[11px] font-mono tracking-widest leading-relaxed text-emerald-400 uppercase italic">
              "LA INTELIGENCIA ARTIFICIAL ENTIENDE PREDICTIVAMENTE LO QUE HACE, PERO NUNCA EXPERIMENTARÁ EL AQUÍ Y EL AHORA."
            </p>
          </div>
        </div>

        {/* Asymmetric Staggered Grid Row */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-[#00ff66]/10 pt-12 relative text-left">
          
          {/* Item 1 */}
          <div className="w-full flex flex-col gap-3 justify-start">
            <div className="text-[10px] font-mono tracking-[0.2em] text-[#00ff66]/60 uppercase flex justify-between items-center px-1">
              <span>[ SNAP_SHOT // 09 ]</span>
              <span>[ VESTUARIO ]</span>
            </div>
            <div className="w-full overflow-hidden border border-[#00ff66]/15 shadow-sm rounded-xs bg-[#040c07] transition-transform duration-500 hover:-translate-y-1">
              <TiltImage
                src="/proyectosAudiovisuales/PHYGITAL/Backstage/Vestuario/vestuario2.webp"
                alt="Phygital - Vestuario 2"
                onClick={() => capturePhoto('/proyectosAudiovisuales/PHYGITAL/Backstage/Vestuario/vestuario2.webp')}
                onHoverStart={() => setIsHoveringImage(true)}
                onHoverEnd={() => setIsHoveringImage(false)}
                className="w-full h-auto object-contain block"
              />
            </div>
            <div className="w-full h-[1px] bg-[#00ff66]/15 my-1" />
            <div className="text-[10px] font-mono tracking-widest text-[#00ff66] uppercase pl-1">
              DAT_ID // FILE.VES2
            </div>
          </div>

          {/* Item 2 */}
          <div className="w-full flex flex-col gap-3 justify-start translate-y-6 mt-6 sm:mt-0">
            <div className="text-[10px] font-mono tracking-[0.2em] text-[#00ff66]/60 uppercase flex justify-between items-center px-1">
              <span>[ SNAP_SHOT // 10 ]</span>
              <span>[ DETALLE ]</span>
            </div>
            <div className="w-full overflow-hidden border border-[#00ff66]/15 shadow-sm rounded-xs bg-[#040c07] transition-transform duration-500 hover:-translate-y-1">
              <TiltImage
                src="/proyectosAudiovisuales/PHYGITAL/Backstage/Vestuario/vestuario3.webp"
                alt="Phygital - Vestuario 3"
                onClick={() => capturePhoto('/proyectosAudiovisuales/PHYGITAL/Backstage/Vestuario/vestuario3.webp')}
                onHoverStart={() => setIsHoveringImage(true)}
                onHoverEnd={() => setIsHoveringImage(false)}
                className="w-full h-auto object-contain block"
              />
            </div>
            <div className="w-full h-[1px] bg-[#00ff66]/15 my-1" />
            <div className="text-[10px] font-mono tracking-widest text-[#00ff66] uppercase pl-1">
              DAT_ID // FILE.VES3
            </div>
          </div>

          {/* Item 3 */}
          <div className="w-full flex flex-col gap-3 justify-start -translate-y-4 mt-6 sm:mt-0">
            <div className="text-[10px] font-mono tracking-[0.2em] text-[#00ff66]/60 uppercase flex justify-between items-center px-1">
              <span>[ SNAP_SHOT // 11 ]</span>
              <span>[ ENTORNO ]</span>
            </div>
            <div className="w-full overflow-hidden border border-[#00ff66]/15 shadow-sm rounded-xs bg-[#040c07] transition-transform duration-500 hover:-translate-y-1">
              <TiltImage
                src="/proyectosAudiovisuales/PHYGITAL/Backstage/Locacion/locacion3.webp"
                alt="Phygital - Locacion 3"
                onClick={() => capturePhoto('/proyectosAudiovisuales/PHYGITAL/Backstage/Locacion/locacion3.webp')}
                onHoverStart={() => setIsHoveringImage(true)}
                onHoverEnd={() => setIsHoveringImage(false)}
                className="w-full h-auto object-contain block"
              />
            </div>
            <div className="w-full h-[1px] bg-[#00ff66]/15 my-1" />
            <div className="text-[10px] font-mono tracking-widest text-[#00ff66] uppercase pl-1">
              DAT_ID // FILE.LOC3
            </div>
          </div>
        </div>
      </div>

      {/* BLOCK 4: CONCLUDING QUOTE & COVER */}
      <div className="w-full py-28 bg-[#030604] border-b border-[#00ff66]/20 relative">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center gap-12">
          {/* Focal cover image */}
          <div className="w-full max-w-3xl overflow-hidden border border-[#00ff66]/20 shadow-lg rounded-xs bg-[#040c07] p-2 relative">
            <span className="absolute top-4 left-4 text-[9px] font-mono text-[#00ff66]/60 select-none pointer-events-none">[CROP.1]</span>
            <span className="absolute top-4 right-4 text-[9px] font-mono text-[#00ff66]/60 select-none pointer-events-none">[CROP.2]</span>
            <span className="absolute bottom-4 left-4 text-[9px] font-mono text-[#00ff66]/60 select-none pointer-events-none">[CROP.3]</span>
            <span className="absolute bottom-4 right-4 text-[9px] font-mono text-[#00ff66]/60 select-none pointer-events-none">[CROP.4]</span>
            
            <TiltImage
              src="/proyectosAudiovisuales/PHYGITAL/Backstage/Inspo Explorador e IA/inspoExplorador.webp"
              alt="Phygital Conclusión"
              onClick={() => capturePhoto('/proyectosAudiovisuales/PHYGITAL/Backstage/Inspo Explorador e IA/inspoExplorador.webp')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              className="w-full h-auto object-contain block"
            />
          </div>

          <div className="max-w-3xl text-center flex flex-col items-center">
            <div className="w-16 h-[1px] bg-[#00ff66]/30 mb-8" />
            <blockquote className="text-2xl sm:text-3xl lg:text-[2.2rem] font-brand italic text-emerald-100 leading-relaxed text-center font-light tracking-wide">
              La confrontación llega a su punto culminante cuando el humano comprende que sus movimientos físicos no bastan. Decide usar lo que lo hace único: sus emociones. Con un grito que resuena, la IA lucha por imitar estos gestos genuinos, pero sus patrones de código titilan de forma errática y su alma digital sufre un cortocircuito.
            </blockquote>
          </div>
        </div>
      </div>

      {/* GALLERY SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-20 border-t border-[#00ff66]/10 text-left">
        <div className="mb-12 select-none">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#00ff66]/60 uppercase block">ARCHIVE DATABASE</span>
          <h3 className="text-3xl md:text-5xl font-brand uppercase tracking-wider text-white mt-2">
            Registro Completo
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {phygitalImages.map((imgSrc, index) => (
            <motion.div
              key={imgSrc}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden rounded-sm border border-[#00ff66]/15 shadow-sm bg-[#040c07]/30 hover:border-[#00ff66]/30 hover:shadow-lg hover:shadow-emerald-950/10 transition-all duration-300 group cursor-none relative"
              onClick={() => capturePhoto(imgSrc)}
              onMouseEnter={() => setIsHoveringImage(true)}
              onMouseLeave={() => setIsHoveringImage(false)}
            >
              <img
                src={imgSrc}
                alt={`Phygital Gallery ${index}`}
                className="w-full h-auto object-cover aspect-[4/5] md:aspect-[3/4] transition-transform duration-700 ease-out group-hover:scale-[1.02] opacity-80 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#00ff66]/[0.01] group-hover:bg-transparent transition-colors duration-300 pointer-events-none" />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,255,102,0.015)_1px,transparent_1px)] bg-[size:100%_5px] pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cyber Viewfinder Custom Cursor */}
      <motion.div
        className="hidden md:block fixed pointer-events-none z-50 mix-blend-screen"
        style={{
          left: 0,
          top: 0,
          x: springX,
          y: springY,
        }}
      >
        <motion.div 
          className="relative flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: cursorMode === 'shutter' ? 0.82 : 1,
          }}
          transition={{ type: 'spring', stiffness: 450, damping: 28 }}
        >
          {/* Viewfinder Brackets */}
          <motion.div 
            className="absolute border-[#00ff66]"
            animate={{
              width: cursorMode === 'focus' ? 56 : 40,
              height: cursorMode === 'focus' ? 56 : 40,
              opacity: cursorMode === 'idle' ? 0.4 : 0.95,
            }}
            transition={{ duration: 0.25 }}
          >
            {/* Top Left Bracket */}
            <span className="absolute top-0 left-0 border-t-2 border-l-2 border-[#00ff66] w-2.5 h-2.5" />
            {/* Top Right Bracket */}
            <span className="absolute top-0 right-0 border-t-2 border-r-2 border-[#00ff66] w-2.5 h-2.5" />
            {/* Bottom Left Bracket */}
            <span className="absolute bottom-0 left-0 border-b-2 border-l-2 border-[#00ff66] w-2.5 h-2.5" />
            {/* Bottom Right Bracket */}
            <span className="absolute bottom-0 right-0 border-b-2 border-r-2 border-[#00ff66] w-2.5 h-2.5" />
          </motion.div>

          {/* Inner Ring (Data telemetry) */}
          <motion.div 
            className="absolute border border-[#00ff66]/30 rounded-full"
            animate={{
              width: cursorMode === 'focus' ? 28 : 14,
              height: cursorMode === 'focus' ? 28 : 14,
              opacity: cursorMode === 'idle' ? 0.25 : 0.6,
            }}
            transition={{ duration: 0.25 }}
          />

          {/* Center Crosshair Dot */}
          <div className="w-1.5 h-1.5 bg-[#00ff66] rounded-full shadow-[0_0_5px_#00ff66]" />

          {/* Cyber metrics on focus */}
          <AnimatePresence>
            {cursorMode === 'focus' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute top-9 flex flex-col items-center gap-0.5 font-mono text-[8px] text-[#00ff66] tracking-widest uppercase font-bold whitespace-nowrap bg-black/80 px-2 py-0.5 border border-[#00ff66]/20 backdrop-blur-xs rounded-xs"
              >
                <span>SCAN // REPL</span>
                <span className="text-[7px] text-[#00ff66]/60">X:{cursorTelemetry.xVal}% Y:{cursorTelemetry.yVal}%</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Camera Shutter Flash Effect */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.95, 0.95, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, times: [0, 0.15, 1] }}
            className="fixed inset-0 bg-emerald-100 z-[9999] pointer-events-none mix-blend-screen"
          />
        )}
      </AnimatePresence>

      {/* Cyber Carrete Container (Album Roll) */}
      <div className="fixed bottom-6 right-6 z-45 flex flex-col items-end gap-3 font-mono">
        <motion.div 
          onClick={() => setCarreteOpen(!carreteOpen)}
          className="bg-[#040c07]/95 text-[#00ff66] rounded-full px-5 py-3 shadow-[0_10px_35px_rgba(0,255,102,0.15)] cursor-pointer select-none flex items-center gap-3 backdrop-blur-md pointer-events-auto hover:bg-[#050f09] hover:shadow-[0_10px_35px_rgba(0,255,102,0.25)] transition-all active:scale-95 border border-[#00ff66]/30 font-bold"
        >
          <div className={`w-2.5 h-2.5 rounded-full ${capturedPhotos.length > 0 ? 'bg-[#00ff66] animate-pulse shadow-[0_0_8px_#00ff66]' : 'bg-red-500 animate-pulse'}`} />
          <span className="text-[10px] tracking-[0.2em] uppercase">
            REPL_CAP: {capturedPhotos.length} / {phygitalImages.length}
          </span>
        </motion.div>
        
        {/* Expanded Drawer */}
        <AnimatePresence>
          {carreteOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="w-[300px] md:w-[360px] bg-[#030604]/95 backdrop-blur-lg p-4 rounded-sm shadow-2xl flex flex-col gap-3 pointer-events-auto select-none border border-[#00ff66]/20 text-[#00ff66] text-left"
            >
              <div className="flex justify-between items-center border-b border-[#00ff66]/20 pb-2">
                <span className="text-[9px] tracking-[0.2em] uppercase text-[#00ff66]/50">
                  IMÁGENES ESCANEADAS
                </span>
                {capturedPhotos.length > 0 && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setCapturedPhotos([]);
                    }}
                    className="text-[8px] tracking-widest uppercase text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    RESET_REPL
                  </button>
                )}
              </div>
              
              {capturedPhotos.length === 0 ? (
                <div className="py-8 text-center text-[10px] tracking-widest text-[#00ff66]/40 uppercase leading-relaxed font-sans">
                  Sin escaneos activos.<br />Haz clic sobre las fotos del registro para capturarlas.
                </div>
              ) : (
                <div className="flex gap-3 overflow-x-auto py-2 scrollbar-thin max-w-full">
                  <AnimatePresence>
                    {capturedPhotos.map((src, idx) => (
                      <motion.div
                        key={src}
                        initial={{ opacity: 0, scale: 0.7, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        className="w-16 h-20 bg-[#050c07] p-1 pb-4 rounded-xs shadow-md shrink-0 flex flex-col justify-between border border-[#00ff66]/20 hover:scale-105 transition-transform"
                      >
                        <div className="w-full h-[78%] overflow-hidden bg-black/20 rounded-xs border border-[#00ff66]/10">
                          <img src={src} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="text-[5px] text-[#00ff66] font-mono text-center truncate tracking-wider font-bold">
                          REPL_{idx + 1} // SECURE
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox / Zoom Dialog overlay */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#020403]/98 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setSelectedPhoto(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-[#00ff66]/5 hover:bg-[#00ff66]/10 border border-[#00ff66]/20 text-[#00ff66] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Photo frame */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="max-w-full max-h-full flex items-center justify-center relative"
            >
              <img
                src={selectedPhoto}
                alt="Zoomed Editorial"
                className="max-w-[95vw] max-h-[90vh] object-contain rounded-sm select-none border border-[#00ff66]/20"
                draggable={false}
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,255,102,0.015)_1px,transparent_1px)] bg-[size:100%_5px] pointer-events-none" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
