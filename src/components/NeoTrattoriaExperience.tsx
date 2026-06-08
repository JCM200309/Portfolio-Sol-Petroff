import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { X } from 'lucide-react'

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
  fetchpriority?: "high" | "low" | "auto";
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
  loading = "lazy",
  fetchpriority = "auto"
}: TiltImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  
  const springConfig = { damping: 25, stiffness: 180, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [0, 1], [7, -7]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-7, 7]), springConfig);
  
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
          {...(fetchpriority !== "auto" ? { fetchpriority } : {})}
        />
        <div className="absolute inset-0 border border-white/10 pointer-events-none group-hover:border-white/20 transition-colors" />
      </motion.div>
    </motion.div>
  );
}

const neoTrattoriaImages = [
  "/producciones/neoTrattoria/primerFoto.JPG",
  "/producciones/neoTrattoria/fotoPortada.JPG",
  "/producciones/neoTrattoria/IMG_1355.jpg",
  "/producciones/neoTrattoria/IMG_6798.JPG",
  "/producciones/neoTrattoria/IMG_6800.JPG",
  "/producciones/neoTrattoria/IMG_6802.JPG",
  "/producciones/neoTrattoria/IMG_6805.JPG",
  "/producciones/neoTrattoria/IMG_6806.JPG",
  "/producciones/neoTrattoria/IMG_6807.JPG",
  "/producciones/neoTrattoria/IMG_6809.JPG",
  "/producciones/neoTrattoria/IMG_6811.JPG",
  "/producciones/neoTrattoria/IMG_6815.JPG",
  "/producciones/neoTrattoria/IMG_6816.JPG",
  "/producciones/neoTrattoria/IMG_6817.JPG",
  "/producciones/neoTrattoria/IMG_6818.JPG",
  "/producciones/neoTrattoria/image-6c536fd8-f84b-4020-b323-5951d0483c10.webp",
  "/producciones/neoTrattoria/image-f56d6f9a-82f6-42b8-808e-5a0f755f5a10.webp"
];

// --- HELPER FUNCTION: Web Audio API Shutter Sound Synthesizer ---
const playShutterSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
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
    
    const now = ctx.currentTime;
    playClick(now, 0.25, 1200, 0.06);     // Shutter curtains open
    playClick(now + 0.06, 0.2, 800, 0.08); // Shutter curtains close
  } catch (e) {
    console.warn('AudioContext blocked or failed: ', e);
  }
};



// --- MAIN PORTAL: Neo Trattoria Experience Page ---
export default function NeoTrattoriaExperience() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [showFlash, setShowFlash] = useState(false);
  const [carreteOpen, setCarreteOpen] = useState(false);
  const [cursorMode, setCursorMode] = useState<'idle' | 'focus' | 'shutter'>('idle');
  

  
  const pageRef = useRef<HTMLDivElement>(null);

  // Smooth custom cursor tracking using fixed viewport space
  const rawMouseX = useMotionValue(-100);
  const rawMouseY = useMotionValue(-100);
  const springX = useSpring(rawMouseX, { damping: 25, stiffness: 220, mass: 0.6 });
  const springY = useSpring(rawMouseY, { damping: 25, stiffness: 220, mass: 0.6 });

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      rawMouseX.set(e.clientX);
      rawMouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  // Update cursor mode based on image hover states
  useEffect(() => {
    if (cursorMode !== 'shutter') {
      setCursorMode(isHoveringImage ? 'focus' : 'idle');
    }
  }, [isHoveringImage]);

  // Main interactive capture callback
  const capturePhoto = (src: string, openLightbox = true) => {
    playShutterSound();
    
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

  // Close lightbox with ESC key
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
      className="w-full h-full min-h-screen relative bg-[var(--color-brand-crema)] text-[var(--color-brand-marron-oscuro)] overflow-y-auto overflow-x-hidden select-none pointer-events-auto pb-32 neotrattoria-scroll-container md:cursor-none"
    >
      {/* Noise texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />
      
      {/* BLOCK 1: EDITORIAL HERO & CONCEPT */}
      <div className="w-full lg:h-screen grid grid-cols-12 border-b border-[var(--color-brand-marron-oscuro)]/25 bg-[var(--color-brand-crema)] relative overflow-hidden">
        {/* Left Column: Maroon Story Block */}
        <div className="col-span-12 lg:col-span-6 bg-[var(--color-brand-bordo)] text-[var(--color-brand-crema)] pt-28 md:pt-36 pb-8 md:pb-16 px-8 md:px-16 flex flex-col justify-between relative min-h-[600px] lg:min-h-0 lg:h-full border-b lg:border-b-0 lg:border-r border-[var(--color-brand-marron-oscuro)]/25">
          {/* Decorative Corner plus markers */}
          <span className="absolute top-4 left-4 text-xs font-light opacity-30 select-none pointer-events-none">+</span>
          <span className="absolute top-4 right-4 text-xs font-light opacity-30 select-none pointer-events-none">+</span>
          <span className="absolute bottom-4 left-4 text-xs font-light opacity-30 select-none pointer-events-none">+</span>
          <span className="absolute bottom-4 right-4 text-xs font-light opacity-30 select-none pointer-events-none">+</span>

          <div className="flex justify-between items-center text-[10px] md:text-[11px] font-mono tracking-[0.3em] uppercase opacity-75">
            <span>03 / EDITORIAL CONCEPT</span>
            <span>[ TENDENCIAS & NOSTALGIA ]</span>
          </div>
          
          <div className="my-auto pt-16 pb-12">
            <h1 className="text-6xl sm:text-8xl lg:text-[7vw] xl:text-[7.5vw] font-brand uppercase tracking-wider text-[var(--color-brand-crema)] mt-2 leading-[0.85] select-none">
              Neo Trattoria
            </h1>
            <div className="w-20 h-[1px] bg-[var(--color-brand-crema)]/35 my-8" />
          </div>

          <div className="max-w-xl pb-8">
            <p className="text-sm md:text-base lg:text-[16px] xl:text-[17px] font-sans tracking-wide leading-relaxed text-[var(--color-brand-crema)]/90 text-left">
              Neo Trattoria nace del encuentro entre lo orgánico y lo estructural, construyendo una estética donde el exceso y la armonía conviven constantemente. La producción toma elementos clásicos y contemporáneos para crear un universo visual cargado de contraste, textura y sensibilidad. A través de la luz, la composición y la puesta en escena, se busca transmitir una nostalgia reinterpretada desde una mirada actual.
            </p>
          </div>
          
          <div className="flex justify-between items-center text-[10px] md:text-[11px] font-mono tracking-[0.3em] uppercase opacity-75">
            <span>[ SENSORY RECORD ]</span>
            <span>[ DEPTH // 03 ]</span>
          </div>
        </div>

        {/* Right Column: Editorial Photo Composition */}
        <div className="col-span-12 lg:col-span-6 flex flex-col justify-between p-6 md:p-8 pt-28 md:pt-32 gap-6 lg:h-full lg:overflow-hidden relative bg-black/[0.01]">
          {/* Horizontal divider line separating top and bottom rows */}
          <div className="absolute top-[52%] left-6 right-6 h-[1px] bg-[var(--color-brand-marron-claro)]/20 pointer-events-none hidden lg:block" />

          {/* Top row: Wide cinematic landscape photo (Frame 1) */}
          <div className="w-full flex-grow flex flex-col justify-center min-h-0">
            <div className="w-full max-w-2xl mx-auto flex flex-col gap-2">
              <div className="w-full text-[10px] md:text-[11px] font-mono tracking-[0.2em] text-[var(--color-brand-marron-oscuro)]/70 uppercase flex justify-between items-center px-1">
                <span>[ FRAME // 01 ]</span>
                <span>[ SHUTTER 1/125 ]</span>
              </div>
              <div className="overflow-hidden border border-[var(--color-brand-marron-claro)]/25 shadow-xs rounded-xs group bg-black/[0.02]">
                <TiltImage
                  src="/producciones/neoTrattoria/primerFoto.JPG"
                  alt="Neo Trattoria - Retrato Principal"
                  onClick={() => capturePhoto('/producciones/neoTrattoria/primerFoto.JPG')}
                  onHoverStart={() => setIsHoveringImage(true)}
                  onHoverEnd={() => setIsHoveringImage(false)}
                  className="aspect-[16/10] max-h-[32vh] lg:h-[32vh] w-full flex items-center justify-center"
                  imgClassName="w-full h-full object-cover block"
                />
              </div>
              <div className="w-full text-[10px] md:text-[11px] font-mono tracking-[0.2em] text-[var(--color-brand-marron-oscuro)] uppercase flex justify-between items-center px-1">
                <span>№112 // PHOTO 01</span>
                <span>[ FOCUS // AF-LOK ]</span>
              </div>
            </div>
          </div>

          {/* Bottom row: Diptych of two vertical photos (Frame 2 & 3) side-by-side */}
          <div className="grid grid-cols-2 gap-6 md:gap-8 flex-grow min-h-0">
            {/* Left Column: Frame 2 (Vertical) */}
            <div className="flex flex-col justify-center min-h-0">
              <div className="w-full flex flex-col gap-2">
                <div className="w-full text-[10px] md:text-[11px] font-mono tracking-[0.2em] text-[var(--color-brand-marron-oscuro)]/70 uppercase flex justify-between items-center px-1">
                  <span>[ FRAME // 02 ]</span>
                  <span>[ MOTORSPORT ]</span>
                </div>
                <div className="overflow-hidden border border-[var(--color-brand-marron-claro)]/25 shadow-xs rounded-xs group bg-black/[0.02]">
                  <TiltImage
                    src="/producciones/neoTrattoria/IMG_6798.JPG"
                    alt="Neo Trattoria - Automóvil Clásico"
                    onClick={() => capturePhoto('/producciones/neoTrattoria/IMG_6798.JPG')}
                    onHoverStart={() => setIsHoveringImage(true)}
                    onHoverEnd={() => setIsHoveringImage(false)}
                    className="aspect-[2/3] max-h-[34vh] lg:h-[34vh] w-full flex items-center justify-center"
                    imgClassName="w-full h-full object-cover block"
                  />
                </div>
                <div className="w-full text-[10px] md:text-[11px] font-mono tracking-[0.2em] text-[var(--color-brand-marron-oscuro)] uppercase flex justify-between px-1">
                  <span>№112 // index.01</span>
                  <span>[ RACING ]</span>
                </div>
              </div>
            </div>

            {/* Right Column: Frame 3 (Vertical) */}
            <div className="flex flex-col justify-center min-h-0">
              <div className="w-full flex flex-col gap-2">
                <div className="w-full text-[10px] md:text-[11px] font-mono tracking-[0.2em] text-[var(--color-brand-marron-oscuro)]/70 uppercase flex justify-between items-center px-1">
                  <span>[ FRAME // 03 ]</span>
                  <span>[ STILL LIFE ]</span>
                </div>
                <div className="overflow-hidden border border-[var(--color-brand-marron-claro)]/25 shadow-xs rounded-xs group bg-black/[0.02]">
                  <TiltImage
                    src="/producciones/neoTrattoria/IMG_6800.JPG"
                    alt="Neo Trattoria - Bodegón"
                    onClick={() => capturePhoto('/producciones/neoTrattoria/IMG_6800.JPG')}
                    onHoverStart={() => setIsHoveringImage(true)}
                    onHoverEnd={() => setIsHoveringImage(false)}
                    className="aspect-[2/3] max-h-[34vh] lg:h-[34vh] w-full flex items-center justify-center"
                    imgClassName="w-full h-full object-cover block"
                  />
                </div>
                <div className="w-full text-[10px] md:text-[11px] font-mono tracking-[0.2em] text-[var(--color-brand-marron-oscuro)] uppercase flex justify-between px-1">
                  <span>[ FOCUS // LOAD.03 ]</span>
                  <span>[ CAPTURE ]</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BLOCK 2: PHYSICAL WEIGHT & FRAGMENTS */}
      <div className="w-full grid grid-cols-12 border-b border-[var(--color-brand-marron-oscuro)]/25 bg-[var(--color-brand-crema)] relative">
        {/* Left Column: Full vertical photo */}
        <div className="col-span-12 md:col-span-4 p-6 md:p-8 border-b md:border-b-0 md:border-r border-[var(--color-brand-marron-claro)]/30 flex flex-col justify-between gap-4">
          <div className="w-full flex flex-col gap-3">
            <div className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] text-[var(--color-brand-marron-oscuro)]/70 uppercase flex justify-between items-center px-1">
              <span>[ SCAN // 09 ]</span>
              <span>[ F/2.8 ]</span>
            </div>
            <div className="w-full overflow-hidden border border-[var(--color-brand-marron-claro)]/20 shadow-xs rounded-xs group bg-black/[0.02]">
              <TiltImage
                src="/producciones/neoTrattoria/IMG_6802.JPG"
                alt="Neo Trattoria - Fragmento Lineal"
                onClick={() => capturePhoto('/producciones/neoTrattoria/IMG_6802.JPG')}
                onHoverStart={() => setIsHoveringImage(true)}
                onHoverEnd={() => setIsHoveringImage(false)}
                className="w-full h-auto object-contain block"
              />
            </div>
            <div className="w-full h-[1px] bg-[var(--color-brand-marron-claro)]/20 my-1" />
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] md:text-[11px] font-mono tracking-widest text-[var(--color-brand-marron-oscuro)] uppercase">
                №112 season // fragment
              </span>
              <span className="text-[10px] md:text-[11px] font-mono tracking-widest text-[var(--color-brand-marron-oscuro)]/60 uppercase">
                [ PORTRAIT ]
              </span>
            </div>
          </div>
        </div>

        {/* Middle Column: Two photos, mixed landscape & portrait */}
        <div className="col-span-12 md:col-span-4 p-6 md:p-8 border-b md:border-b-0 md:border-r border-[var(--color-brand-marron-claro)]/30 flex flex-col justify-between gap-8">
          {/* Top Landscape Photo */}
          <div className="w-full flex flex-col gap-3">
            <div className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] text-[var(--color-brand-marron-oscuro)]/70 uppercase flex justify-between items-center px-1">
              <span>[ HORIZONTAL SCAN ]</span>
              <span>[ REF // 05 ]</span>
            </div>
            <div className="w-full overflow-hidden border border-[var(--color-brand-marron-claro)]/20 shadow-xs rounded-xs group bg-black/[0.02]">
              <TiltImage
                src="/producciones/neoTrattoria/image-6c536fd8-f84b-4020-b323-5951d0483c10.webp"
                alt="Neo Trattoria - Composición Espacial"
                onClick={() => capturePhoto('/producciones/neoTrattoria/image-6c536fd8-f84b-4020-b323-5951d0483c10.webp')}
                onHoverStart={() => setIsHoveringImage(true)}
                onHoverEnd={() => setIsHoveringImage(false)}
                className="w-full h-auto object-contain block"
              />
            </div>
            <div className="w-full h-[1px] bg-[var(--color-brand-marron-claro)]/20 my-1" />
            <div className="text-[10px] md:text-[11px] font-mono tracking-widest text-[var(--color-brand-marron-oscuro)] uppercase flex justify-between px-1">
              <span>[ NO. 05 // MULTIPLE ]</span>
              <span>[ LANDSCAPE ]</span>
            </div>
          </div>

          {/* Bottom Portrait Photo */}
          <div className="w-full flex flex-col gap-3">
            <div className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] text-[var(--color-brand-marron-oscuro)]/70 uppercase flex justify-between items-center px-1">
              <span>[ VERTICAL SCAN ]</span>
              <span>[ REF // 06 ]</span>
            </div>
            <div className="w-full overflow-hidden border border-[var(--color-brand-marron-claro)]/20 shadow-xs rounded-xs group bg-black/[0.02]">
              <TiltImage
                src="/producciones/neoTrattoria/image-f56d6f9a-82f6-42b8-808e-5a0f755f5a10.webp"
                alt="Neo Trattoria - Eco del Pasado"
                onClick={() => capturePhoto('/producciones/neoTrattoria/image-f56d6f9a-82f6-42b8-808e-5a0f755f5a10.webp')}
                onHoverStart={() => setIsHoveringImage(true)}
                onHoverEnd={() => setIsHoveringImage(false)}
                className="w-full h-auto object-contain block"
              />
            </div>
            <div className="w-full h-[1px] bg-[var(--color-brand-marron-claro)]/20 my-1" />
            <div className="text-[10px] md:text-[11px] font-mono tracking-widest text-[var(--color-brand-marron-oscuro)] uppercase flex justify-between px-1">
              <span>[ NO. 06 // SILENCE ]</span>
              <span>[ PORTRAIT ]</span>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Text & Supporting Image */}
        <div className="col-span-12 md:col-span-4 p-6 md:p-8 flex flex-col justify-between min-h-[550px] bg-black/[0.01] relative">
          <div className="text-[10px] md:text-[11px] font-mono tracking-[0.3em] uppercase opacity-75 flex justify-between items-center">
            <span>[ NARRATIVE SECTION // 03 ]</span>
            <span>[ SECTION B ]</span>
          </div>

          <div className="my-auto py-8">
            <h2 className="text-5xl font-brand uppercase tracking-wider text-[var(--color-brand-marron-oscuro)] mb-6 font-bold leading-none">
              Materialidad
            </h2>
            
            <div className="space-y-6 mb-8">
              <p className="text-sm md:text-base leading-relaxed text-[var(--color-brand-marron-oscuro)]/85 text-left">
                La propuesta mezcla referencias del mundo racing, el lujo vintage y cierta teatralidad italiana, combinando materiales rígidos con telas suaves, transparencias, cuero, metal y objetos cotidianos transformados en elementos visuales.
              </p>
              <p className="text-sm md:text-base leading-relaxed text-[var(--color-brand-marron-oscuro)]/85 text-left">
                Las curvas, las repeticiones y las superposiciones aparecen tanto en la dirección de arte como en los cuerpos y las poses, generando imágenes donde lo sofisticado y lo espontáneo se encuentran.
              </p>
            </div>

            {/* Supporting Image (IMG_6805.JPG) */}
            <div className="w-full flex flex-col gap-3">
              <div className="w-full overflow-hidden border border-[var(--color-brand-marron-claro)]/20 shadow-xs rounded-xs group bg-black/[0.02]">
                <TiltImage
                  src="/producciones/neoTrattoria/IMG_6805.JPG"
                  alt="Neo Trattoria - Poses y Geometría"
                  onClick={() => capturePhoto('/producciones/neoTrattoria/IMG_6805.JPG')}
                  onHoverStart={() => setIsHoveringImage(true)}
                  onHoverEnd={() => setIsHoveringImage(false)}
                  className="w-full h-auto object-contain block"
                />
              </div>
              <div className="text-[10px] md:text-[11px] font-mono tracking-widest text-[var(--color-brand-marron-oscuro)]/60 uppercase flex justify-between px-1">
                <span>[ SUPPORTING PHOTO // IMG_6805 ]</span>
                <span>[ DUALITY VIEW ]</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] md:text-[11px] font-mono tracking-[0.3em] uppercase opacity-75 border-t border-[var(--color-brand-marron-claro)]/15 pt-4">
            <span>[ MOVEMENT ]</span>
            <span>[ COMPOSITION ]</span>
          </div>
        </div>
      </div>

      {/* BLOCK 3: FEATURED PHOTO SLIDER ROW */}
      <div className="w-full py-24 px-6 md:px-12 bg-black/[0.01] border-b border-[var(--color-brand-marron-oscuro)]/25 relative overflow-visible">
        {/* Decorative corner marks */}
        <span className="absolute top-6 left-6 text-xs font-light opacity-30 select-none pointer-events-none">+</span>
        <span className="absolute top-6 right-6 text-xs font-light opacity-30 select-none pointer-events-none">+</span>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-16 select-none">
          <div>
            <span className="text-[10px] md:text-[11px] font-mono tracking-[0.35em] text-[var(--color-brand-marron-oscuro)]/70 uppercase font-semibold">
              EXPOSICIÓN DESTACADA
            </span>
            <h3 className="font-brand text-4xl sm:text-5xl uppercase tracking-wider text-[var(--color-brand-marron-oscuro)] mt-1.5 leading-none">
              Featured Photos
            </h3>
          </div>
          <div className="max-w-xs md:text-right border-l md:border-l-0 md:border-r border-[var(--color-brand-marron-claro)]/25 pl-4 md:pl-0 md:pr-4 py-1">
            <p className="text-[12px] md:text-[13px] font-sans tracking-widest leading-relaxed text-[var(--color-brand-marron-oscuro)]/75 uppercase italic">
              "THE CONVERGENCE OF TRADITIONAL GLAMOUR AND MODERN RACING SENSIBILITY."
            </p>
          </div>
        </div>

        {/* Asymmetric Staggered Grid Row */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 border-t border-[var(--color-brand-marron-claro)]/25 pt-12 relative">
          
          {/* Thin Vertical Column Borders */}
          <div className="absolute inset-y-0 left-1/4 w-[1px] bg-[var(--color-brand-marron-claro)]/15 pointer-events-none hidden lg:block" />
          <div className="absolute inset-y-0 left-2/4 w-[1px] bg-[var(--color-brand-marron-claro)]/15 pointer-events-none hidden lg:block" />
          <div className="absolute inset-y-0 left-3/4 w-[1px] bg-[var(--color-brand-marron-claro)]/15 pointer-events-none hidden lg:block" />

          {/* Item 1: IMG_6806.JPG (No offset) */}
          <div className="w-full flex flex-col gap-3 lg:pr-6 justify-start">
            <div className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] text-[var(--color-brand-marron-oscuro)]/70 uppercase flex justify-between items-center px-1">
              <span>[ INDEX // 6806 ]</span>
              <span>[ RACING DETAIL ]</span>
            </div>
            <div className="w-full overflow-hidden border border-[var(--color-brand-marron-claro)]/20 shadow-xs rounded-xs group bg-black/[0.02] transition-transform duration-500 hover:-translate-y-1">
              <TiltImage
                src="/producciones/neoTrattoria/IMG_6806.JPG"
                alt="Neo Trattoria - Reminiscencia 6806"
                onClick={() => capturePhoto('/producciones/neoTrattoria/IMG_6806.JPG')}
                onHoverStart={() => setIsHoveringImage(true)}
                onHoverEnd={() => setIsHoveringImage(false)}
                className="w-full h-auto object-contain block"
              />
            </div>
            <div className="w-full h-[1px] bg-[var(--color-brand-marron-claro)]/25 my-1" />
            <div className="text-[10px] md:text-[11px] font-mono tracking-widest text-[var(--color-brand-marron-oscuro)] uppercase pl-1">
              №112 season // No. 6806
            </div>
          </div>

          {/* Item 2: IMG_6807.JPG (Shifted down) */}
          <div className="w-full flex flex-col gap-3 lg:px-6 lg:translate-y-12 justify-start mt-6 lg:mt-0">
            <div className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] text-[var(--color-brand-marron-oscuro)]/70 uppercase flex justify-between items-center px-1">
              <span>[ INDEX // 6807 ]</span>
              <span>[ LUXURY RETRO ]</span>
            </div>
            <div className="w-full overflow-hidden border border-[var(--color-brand-marron-claro)]/20 shadow-xs rounded-xs group bg-black/[0.02] transition-transform duration-500 hover:-translate-y-1">
              <TiltImage
                src="/producciones/neoTrattoria/IMG_6807.JPG"
                alt="Neo Trattoria - Reminiscencia 6807"
                onClick={() => capturePhoto('/producciones/neoTrattoria/IMG_6807.JPG')}
                onHoverStart={() => setIsHoveringImage(true)}
                onHoverEnd={() => setIsHoveringImage(false)}
                className="w-full h-auto object-contain block"
              />
            </div>
            <div className="w-full h-[1px] bg-[var(--color-brand-marron-claro)]/25 my-1" />
            <div className="text-[10px] md:text-[11px] font-mono tracking-widest text-[var(--color-brand-marron-oscuro)] uppercase pl-1">
              №112 season // No. 6807
            </div>
          </div>

          {/* Item 3: IMG_6809.JPG (Shifted up) */}
          <div className="w-full flex flex-col gap-3 lg:px-6 lg:-translate-y-8 justify-start mt-6 lg:mt-0">
            <div className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] text-[var(--color-brand-marron-oscuro)]/70 uppercase flex justify-between items-center px-1">
              <span>[ INDEX // 6809 ]</span>
              <span>[ SILUETA FOCUS ]</span>
            </div>
            <div className="w-full overflow-hidden border border-[var(--color-brand-marron-claro)]/20 shadow-xs rounded-xs group bg-black/[0.02] transition-transform duration-500 hover:-translate-y-1">
              <TiltImage
                src="/producciones/neoTrattoria/IMG_6809.JPG"
                alt="Neo Trattoria - Reminiscencia 6809"
                onClick={() => capturePhoto('/producciones/neoTrattoria/IMG_6809.JPG')}
                onHoverStart={() => setIsHoveringImage(true)}
                onHoverEnd={() => setIsHoveringImage(false)}
                className="w-full h-auto object-contain block"
              />
            </div>
            <div className="w-full h-[1px] bg-[var(--color-brand-marron-claro)]/25 my-1" />
            <div className="text-[10px] md:text-[11px] font-mono tracking-widest text-[var(--color-brand-marron-oscuro)] uppercase pl-1">
              №112 season // No. 6809
            </div>
          </div>

          {/* Item 4: IMG_6811.JPG (Shifted slightly down) */}
          <div className="w-full flex flex-col gap-3 lg:pl-6 lg:translate-y-4 justify-start mt-6 lg:mt-0">
            <div className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] text-[var(--color-brand-marron-oscuro)]/70 uppercase flex justify-between items-center px-1">
              <span>[ INDEX // 6811 ]</span>
              <span>[ DETAIL SCENE ]</span>
            </div>
            <div className="w-full overflow-hidden border border-[var(--color-brand-marron-claro)]/20 shadow-xs rounded-xs group bg-black/[0.02] transition-transform duration-500 hover:-translate-y-1">
              <TiltImage
                src="/producciones/neoTrattoria/IMG_6811.JPG"
                alt="Neo Trattoria - Reminiscencia 6811"
                onClick={() => capturePhoto('/producciones/neoTrattoria/IMG_6811.JPG')}
                onHoverStart={() => setIsHoveringImage(true)}
                onHoverEnd={() => setIsHoveringImage(false)}
                className="w-full h-auto object-contain block"
              />
            </div>
            <div className="w-full h-[1px] bg-[var(--color-brand-marron-claro)]/25 my-1" />
            <div className="text-[10px] md:text-[11px] font-mono tracking-widest text-[var(--color-brand-marron-oscuro)] uppercase pl-1">
              №112 season // No. 6811
            </div>
          </div>
        </div>
      </div>

      {/* BLOCK 4: CONCLUDING TYPOGRAPHIC QUOTE & FOCAL COVER */}
      <div className="w-full py-28 bg-[var(--color-brand-crema)] border-b border-[var(--color-brand-marron-oscuro)]/25 relative">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center gap-12">
          {/* Focal landscape photo (fotoPortada.JPG) in natural ratio */}
          <div className="w-full max-w-3xl overflow-hidden border border-[var(--color-brand-marron-claro)]/20 shadow-md rounded-xs group bg-black/[0.02] p-2 relative">
            {/* Camera Crop / Focus Corners inside frame */}
            <span className="absolute top-4 left-4 text-xs font-light text-[var(--color-brand-marron-oscuro)] opacity-40 select-none pointer-events-none">+</span>
            <span className="absolute top-4 right-4 text-xs font-light text-[var(--color-brand-marron-oscuro)] opacity-40 select-none pointer-events-none">+</span>
            <span className="absolute bottom-4 left-4 text-xs font-light text-[var(--color-brand-marron-oscuro)] opacity-40 select-none pointer-events-none">+</span>
            <span className="absolute bottom-4 right-4 text-xs font-light text-[var(--color-brand-marron-oscuro)] opacity-40 select-none pointer-events-none">+</span>
            
            <TiltImage
              src="/producciones/neoTrattoria/fotoPortada.JPG"
              alt="Neo Trattoria Conclusión"
              onClick={() => capturePhoto('/producciones/neoTrattoria/fotoPortada.JPG')}
              onHoverStart={() => setIsHoveringImage(true)}
              onHoverEnd={() => setIsHoveringImage(false)}
              className="w-full h-auto object-contain block"
            />
          </div>

          <div className="max-w-3xl text-center flex flex-col items-center">
            <div className="w-16 h-[1px] bg-[var(--color-brand-marron-claro)]/40 mb-8" />
            <blockquote className="text-2xl sm:text-3xl lg:text-[2.2rem] font-brand italic text-[var(--color-brand-marron-oscuro)] leading-relaxed text-center justify-center font-light tracking-wide">
              Neo Trattoria no busca recrear el pasado de forma literal, sino tomar su imaginario para transformarlo en algo actual, vibrante y sensorial. La producción habita ese espacio intermedio donde lo tradicional y lo contemporáneo se mezclan, generando una atmósfera que se siente nostálgica, pero al mismo tiempo viva y expansiva.
            </blockquote>
          </div>
        </div>
      </div>

      {/* GALLERY SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-20 border-t border-[var(--color-brand-marron-claro)]/10">
        <div className="mb-12 select-none">
          <h3 className="text-3xl md:text-5xl font-brand uppercase tracking-wider text-[var(--color-brand-marron-oscuro)] mt-2">
            Registro Editorial
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {neoTrattoriaImages.map((imgSrc, index) => (
            <motion.div
              key={imgSrc}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden rounded-sm border border-[var(--color-brand-marron-claro)]/15 shadow-sm bg-black/[0.01] hover:shadow-md transition-shadow group cursor-none relative"
              onClick={() => capturePhoto(imgSrc)}
              onMouseEnter={() => setIsHoveringImage(true)}
              onMouseLeave={() => setIsHoveringImage(false)}
            >
              <img
                src={imgSrc}
                alt={`Neo Trattoria Gallery ${index}`}
                className="w-full h-auto object-cover aspect-[4/5] md:aspect-[3/4] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/[0.02] group-hover:bg-transparent transition-colors duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Viewfinder Custom Cursor (Vibe: DSLR Camera Focusing Reticle - Minimalist) */}
      <motion.div
        className="hidden md:block fixed pointer-events-none z-50 mix-blend-difference"
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
            scale: cursorMode === 'shutter' ? 0.8 : 1,
          }}
          transition={{ type: 'spring', stiffness: 450, damping: 28 }}
        >
          {/* Viewfinder Brackets */}
          <motion.div 
            className="absolute border-white"
            animate={{
              width: cursorMode === 'focus' ? 52 : 36,
              height: cursorMode === 'focus' ? 52 : 36,
              opacity: cursorMode === 'idle' ? 0.35 : 0.9,
            }}
            transition={{ duration: 0.25 }}
          >
            {/* Top Left Bracket */}
            <span className="absolute top-0 left-0 border-t border-l border-white w-2 h-2" />
            {/* Top Right Bracket */}
            <span className="absolute top-0 right-0 border-t border-r border-white w-2 h-2" />
            {/* Bottom Left Bracket */}
            <span className="absolute bottom-0 left-0 border-b border-l border-white w-2 h-2" />
            {/* Bottom Right Bracket */}
            <span className="absolute bottom-0 right-0 border-b border-r border-white w-2 h-2" />
          </motion.div>

          {/* Inner Ring (Lens guideline) */}
          <motion.div 
            className="absolute border border-white/30 rounded-full"
            animate={{
              width: cursorMode === 'focus' ? 24 : 12,
              height: cursorMode === 'focus' ? 24 : 12,
              opacity: cursorMode === 'idle' ? 0.2 : 0.6,
            }}
            transition={{ duration: 0.25 }}
          />

          {/* Center Crosshair Dot */}
          <div className="w-1.5 h-1.5 bg-white rounded-full" />

          {/* Action indicator - clean, no boxes, spaced out */}
          <AnimatePresence>
            {cursorMode === 'focus' && (
              <motion.span 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2 }}
                className="absolute top-8 text-[9px] tracking-[0.25em] font-sans font-semibold text-white/95 uppercase whitespace-nowrap"
              >
                CAPTURAR
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Camera Shutter Flash Effect */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, times: [0, 0.15, 1] }}
            className="fixed inset-0 bg-white z-[9999] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Camera Roll (Album Roll) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 font-sans">
        {/* Captured Badge / Status Indicator */}
        <motion.div 
          onClick={() => setCarreteOpen(!carreteOpen)}
          className="bg-black/90 text-[var(--color-brand-crema)] rounded-full px-5 py-3 shadow-[0_10px_35px_rgba(0,0,0,0.5)] cursor-pointer select-none flex items-center gap-3 backdrop-blur-md pointer-events-auto hover:bg-black/95 transition-all active:scale-95 border border-[var(--color-brand-marron-claro)]/25"
        >
          <div className={`w-2.5 h-2.5 rounded-full ${capturedPhotos.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500 animate-pulse'}`} />
          <span className="text-[10px] tracking-[0.2em] uppercase font-semibold">
            CARRETE: {capturedPhotos.length} / {neoTrattoriaImages.length}
          </span>
        </motion.div>
        
        {/* Expanded Camera Roll Thumbnails */}
        <AnimatePresence>
          {carreteOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="w-[300px] md:w-[360px] bg-black/95 backdrop-blur-lg p-4 rounded-sm shadow-[0_25px_60px_rgba(0,0,0,0.75)] flex flex-col gap-3 pointer-events-auto select-none border border-[var(--color-brand-marron-claro)]/20 text-[var(--color-brand-crema)]"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-[9px] tracking-[0.2em] uppercase text-white/50 font-mono">
                  Fotos Reveladas
                </span>
                {capturedPhotos.length > 0 && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setCapturedPhotos([]);
                    }}
                    className="text-[8px] tracking-widest uppercase text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    Borrar Todo
                  </button>
                )}
              </div>
              
              {capturedPhotos.length === 0 ? (
                <div className="py-8 text-center text-[10px] tracking-widest text-white/30 uppercase leading-relaxed">
                  No has sacado fotos aún.<br />Haz clic sobre las fotos para capturarlas.
                </div>
              ) : (
                <div className="flex gap-3 overflow-x-auto py-2 scrollbar-thin max-w-full">
                  <AnimatePresence>
                    {capturedPhotos.map((src, idx) => (
                      <motion.div
                        key={src}
                        initial={{ opacity: 0, scale: 0.7, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: (idx % 2 === 0 ? 2 : -2) }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        className="w-16 h-20 bg-[var(--color-brand-crema)] p-1 pb-4 rounded-xs shadow-md shrink-0 flex flex-col justify-between border border-black/10 hover:scale-105 transition-transform"
                      >
                        <div className="w-full h-[78%] overflow-hidden bg-black/5 rounded-xs">
                          <img src={src} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="text-[5px] text-black/60 font-mono text-center truncate tracking-wider font-bold">
                          #{idx + 1} CAPTURED
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
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
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
                alt="Zoomed Editorial"
                className="max-w-[95vw] max-h-[90vh] object-contain rounded-sm select-none"
                draggable={false}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
