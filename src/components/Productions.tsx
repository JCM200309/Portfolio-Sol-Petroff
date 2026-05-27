import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import MemoriaVividoExperience from './MemoriaVividoExperience'
import NoFuturoExperience from './NoFuturoExperience'
import NeoTrattoriaExperience from './NeoTrattoriaExperience'
import Anos20Experience from './Anos20Experience'



export default function Productions() {
  const [activeProject, setActiveProject] = useState<string | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  
  const containerRef = useRef<HTMLDivElement>(null)

  // Track mouse coordinates for parallax and custom cursor
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    setCursorPos({ x: clientX, y: clientY })

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const x = clientX - rect.left
      const normX = (x / rect.width) * 2 - 1
      const normY = ((clientY - rect.top) / rect.height) * 2 - 1
      setMousePos({ x: normX, y: normY })
    }
  };

  return (
    <section
      id="escena"
      ref={containerRef}
      className="relative w-full h-full min-h-screen bg-black"
    >
      {/* Dynamic Back Button */}
      {activeProject !== null ? (
        <button
          onClick={() => setActiveProject(null)}
          className="fixed top-24 left-6 md:left-12 z-50 flex items-center gap-2 text-[10px] font-sans tracking-[0.2em] uppercase text-[var(--color-brand-crema)] bg-[var(--color-brand-bordo)] hover:bg-[var(--color-brand-bordo)]/90 hover:scale-[1.03] active:scale-97 px-5 py-2.5 rounded-full transition-all duration-300 shadow-md cursor-pointer pointer-events-auto z-50"
        >
          ← Volver
        </button>
      ) : (
        <a 
          href="#proyectos"
          className="fixed top-24 left-6 md:left-12 z-50 flex items-center gap-2 text-[10px] font-sans tracking-[0.2em] uppercase text-[var(--color-brand-crema)] bg-[var(--color-brand-bordo)] hover:bg-[var(--color-brand-bordo)]/90 hover:scale-[1.03] active:scale-97 px-5 py-2.5 rounded-full transition-all duration-300 shadow-md cursor-pointer z-50"
        >
          ← Volver
        </a>
      )}

      <AnimatePresence mode="wait">
        {activeProject === null ? (
          /* STATE 1: Landing Category Scroll View (Landing + Grid) */
          <motion.div
            key="landing-scroll"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full h-full min-h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth bg-black pointer-events-auto"
            onMouseMove={(e) => {
              handleMouseMove(e);
              setIsHovering(false);
            }}
          >
            {/* Slide 1: Hero Landing (Memoria Vívido) */}
            <div
              onClick={() => setActiveProject('memoria-vivido')}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onMouseMove={(e) => {
                e.stopPropagation();
                handleMouseMove(e);
                if (!isHovering) setIsHovering(true);
              }}
              className="snap-start w-full h-screen relative flex items-center justify-start cursor-none select-none overflow-hidden bg-black"
            >
              {/* Parallax & Ken Burns Background Image */}
              <motion.div
                animate={{
                  x: mousePos.x * 6,
                  y: mousePos.y * 6,
                  scale: isHovering ? 1.015 : 1.0
                }}
                transition={{ type: 'tween', ease: 'easeOut', duration: 0.5 }}
                className="absolute inset-0 z-0 w-full h-full overflow-hidden bg-black"
              >
                <img
                  src="/producciones/memoriaVivido/portada.JPG"
                  alt="Memoria Vívido Portada"
                  className="w-full h-full object-cover object-[center_28%] opacity-85 pointer-events-none select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />
              </motion.div>

              {/* Left aligned Editorial Typography Block */}
              <div className="relative z-10 max-w-3xl pl-8 md:pl-20 pr-6 flex flex-col pointer-events-none">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="text-6xl sm:text-8xl md:text-9xl font-brand tracking-[0.02em] leading-[0.9] text-[var(--color-brand-crema)] font-light uppercase"
                >
                  Memoria<br />Vivido
                </motion.h1>

                {/* Separator Divider Line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.0, ease: 'easeInOut', delay: 0.4 }}
                  className="w-20 h-[1.5px] bg-[var(--color-brand-crema)]/45 my-8 origin-left"
                />

                {/* Subtext description (narrow width to match mock 4-line wrap) */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.0, ease: 'easeOut', delay: 0.6 }}
                  className="text-xs sm:text-sm font-sans font-light tracking-widest leading-relaxed text-[var(--color-brand-crema)]/80 max-w-[290px]"
                >
                  la memoria vivido es inherentemente subjetiva y está coloreada por la perspectiva y las interpretaciones personales de quien la recuerda.
                </motion.p>
              </div>
            </div>

            {/* Slide 2: Grid of other productions */}
            <div className="snap-start w-full min-h-screen relative bg-[var(--color-brand-bordo)] text-[var(--color-brand-crema)] flex flex-col justify-center pt-32 pb-16 md:pt-36 md:pb-20 px-4 md:px-12 overflow-hidden">
              {/* Noise texture overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />

              <div className="max-w-7xl mx-auto w-full z-10">
                
                {/* Minimalist Section Header */}
                <div className="mb-12 flex items-center justify-between select-none">
                  <h3 className="font-brand text-2xl md:text-3xl uppercase tracking-wider text-[var(--color-brand-crema)]">
                    Otras Producciones
                  </h3>
                  <a 
                    href="#proyectos" 
                    className="inline-flex items-center gap-2 bg-[var(--color-brand-crema)] text-[var(--color-brand-bordo)] font-sans text-[10px] tracking-[0.2em] font-semibold uppercase px-4 py-2 hover:bg-[var(--color-brand-crema)]/90 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 pointer-events-auto rounded-xs"
                  >
                    Portafolio <span className="text-xs">→</span>
                  </a>
                </div>

                {/* DESKTOP EDITORIAL GRID (Pyramid Layout) */}
                <div className="hidden md:grid grid-cols-4">
                  
                  {/* ROW 1: NEO TRATTORIA (Center of the top row) */}
                  {/* Col 1: Empty Left Wing */}
                  <div className="h-[380px]" />
                  
                 

                  {/* Col 2: Neo Trattoria Description */}
                  <div className="border-t border-l border-r border-b border-[var(--color-brand-crema)]/15 p-8 flex flex-col justify-end h-[380px] bg-black/5 select-none">
                    <div>
                      <span className="text-[9px] tracking-[0.25em] font-sans text-[var(--color-brand-crema)]/40 uppercase mb-2 block">
                        01 / Neo Trattoria
                      </span>
                      <h4 className="font-brand text-2xl uppercase tracking-wider mb-3 text-[var(--color-brand-crema)]">
                        Nostalgia
                      </h4>
                      <p className="text-[11px] lg:text-xs font-sans tracking-wide leading-relaxed text-[var(--color-brand-crema)]/70 max-w-xs">
                        Neo Trattoria nace del encuentro entre lo orgánico y lo estructural, construyendo una estética donde el exceso y la armonía conviven constantemente.
                      </p>
                    </div>
                  </div>

                   {/* Col 3: Neo Trattoria Image */}
                  <div 
                    onClick={() => setActiveProject('neo-trattoria')}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    onMouseMove={(e) => {
                      e.stopPropagation();
                      handleMouseMove(e);
                      if (!isHovering) setIsHovering(true);
                    }}
                    className="border-t border-l border-b border-[var(--color-brand-crema)]/15 relative overflow-hidden cursor-none group h-[380px] bg-black pointer-events-auto"
                  >
                    <img 
                      src="/producciones/neoTrattoria/fotoPortada.JPG" 
                      alt="Neo Trattoria Cover" 
                      className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-[1.03] opacity-85 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                  </div>

                  {/* Col 4: Empty Right Wing */}
                  <div className="h-[380px]" />

                  {/* ROW 2: NO FUTURO & AÑOS 20 (Full row at the bottom) */}
                  {/* Col 1: No Futuro Description */}
                  <div className="border-t border-l border-b border-[var(--color-brand-crema)]/15 p-8 flex flex-col justify-end h-[380px] bg-black/5 select-none">
                    <div>
                      <span className="text-[9px] tracking-[0.25em] font-sans text-[var(--color-brand-crema)]/40 uppercase mb-2 block">
                        02 / No Futuro
                      </span>
                      <h4 className="font-brand text-2xl uppercase tracking-wider mb-3 text-[var(--color-brand-crema)]">
                        Subcultura Punk
                      </h4>
                      <p className="text-[11px] lg:text-xs font-sans tracking-wide leading-relaxed text-[var(--color-brand-crema)]/70 max-w-xs">
                        En esta editorial busqué trabajar dentro de la subcultura Punk, el concepto de No – Futuro. Mediante las luces, poses y expresiones faciales reflejamos la personalidad de protesta y rebeldía.
                      </p>
                    </div>
                  </div>

                  {/* Col 2: No Futuro Image */}
                  <div 
                    onClick={() => setActiveProject('no-futuro')}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    onMouseMove={(e) => {
                      e.stopPropagation();
                      handleMouseMove(e);
                      if (!isHovering) setIsHovering(true);
                    }}
                    className="border-t border-l border-b border-[var(--color-brand-crema)]/15 relative overflow-hidden cursor-none group h-[380px] bg-black pointer-events-auto"
                  >
                    <img 
                      src="/producciones/noFuturo/fotoPortada.JPG" 
                      alt="No Futuro Cover" 
                      className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-[1.03] opacity-85 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                  </div>

                  {/* Col 3: Años 20 Description */}
                  <div className="border-t border-l border-b border-[var(--color-brand-crema)]/15 p-8 flex flex-col justify-end h-[380px] bg-black/5 select-none">
                    <div>
                      <span className="text-[9px] tracking-[0.25em] font-sans text-[var(--color-brand-crema)]/40 uppercase mb-2 block">
                        03 / Años 20
                      </span>
                      <h4 className="font-brand text-2xl uppercase tracking-wider mb-3 text-[var(--color-brand-crema)]">
                        Elegancia
                      </h4>
                      <p className="text-[11px] lg:text-xs font-sans tracking-wide leading-relaxed text-[var(--color-brand-crema)]/70 max-w-xs">
                        Una editorial inspirada en la estética de los años 20 que retoma el espíritu de una década marcada por la elegancia, la transformación y la modernidad emergente.
                      </p>
                    </div>
                  </div>

                  {/* Col 4: Años 20 Image */}
                  <div 
                    onClick={() => setActiveProject('anos-20')}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    onMouseMove={(e) => {
                      e.stopPropagation();
                      handleMouseMove(e);
                      if (!isHovering) setIsHovering(true);
                    }}
                    className="border-t border-l border-r border-b border-[var(--color-brand-crema)]/15 relative overflow-hidden cursor-none group h-[380px] bg-black pointer-events-auto"
                  >
                    <img 
                      src="/producciones/años20/fotoPortada.webp" 
                      alt="Años 20 Cover" 
                      className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-[1.03] opacity-85 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                  </div>

                </div>

                {/* MOBILE EDITORIAL VIEW (Sleek stacked list for optimal readability and touch targets) */}
                <div className="md:hidden space-y-10">
                  {/* Project Cards List */}
                  <div className="space-y-10">
                    {/* Neo Trattoria */}
                    <div 
                      onClick={() => setActiveProject('neo-trattoria')}
                      className="group space-y-4 cursor-pointer pointer-events-auto"
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden border border-[var(--color-brand-crema)]/10 relative">
                        <img 
                          src="/producciones/neoTrattoria/fotoPortada.JPG" 
                          alt="Neo Trattoria Cover" 
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-102"
                        />
                        <div className="absolute top-3 left-4 text-[9px] tracking-[0.2em] font-sans text-white bg-black/40 px-2.5 py-1 uppercase rounded-xs">
                          01 / Neo Trattoria
                        </div>
                      </div>
                      <div className="px-1">
                        <h4 className="font-brand text-lg uppercase tracking-wider text-[var(--color-brand-crema)] mb-2">
                          Neo Trattoria
                        </h4>
                        <p className="text-xs font-sans tracking-wide leading-relaxed text-[var(--color-brand-crema)]/70">
                          Neo Trattoria nace del encuentro entre lo orgánico y lo estructural, construyendo una estética donde el exceso y la armonía conviven constantemente.
                        </p>
                      </div>
                    </div>

                    {/* No Futuro */}
                    <div 
                      onClick={() => setActiveProject('no-futuro')}
                      className="group space-y-4 cursor-pointer pointer-events-auto"
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden border border-[var(--color-brand-crema)]/10 relative">
                        <img 
                          src="/producciones/noFuturo/fotoPortada.JPG" 
                          alt="No Futuro Cover" 
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-102"
                        />
                        <div className="absolute top-3 left-4 text-[9px] tracking-[0.2em] font-sans text-white bg-black/40 px-2.5 py-1 uppercase rounded-xs">
                          02 / No Futuro
                        </div>
                      </div>
                      <div className="px-1">
                        <h4 className="font-brand text-lg uppercase tracking-wider text-[var(--color-brand-crema)] mb-2">
                          No Futuro
                        </h4>
                        <p className="text-xs font-sans tracking-wide leading-relaxed text-[var(--color-brand-crema)]/70">
                          En esta editorial busqué trabajar dentro de la subcultura Punk, el concepto de No – Futuro mediante luces, poses y expresiones faciales de protesta y rebeldía.
                        </p>
                      </div>
                    </div>

                    {/* Años 20 */}
                    <div 
                      onClick={() => setActiveProject('anos-20')}
                      className="group space-y-4 cursor-pointer pointer-events-auto"
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden border border-[var(--color-brand-crema)]/10 relative">
                        <img 
                          src="/producciones/años20/fotoPortada.webp" 
                          alt="Años 20 Cover" 
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-102"
                        />
                        <div className="absolute top-3 left-4 text-[9px] tracking-[0.2em] font-sans text-white bg-black/40 px-2.5 py-1 uppercase rounded-xs">
                          03 / Años 20
                        </div>
                      </div>
                      <div className="px-1">
                        <h4 className="font-brand text-lg uppercase tracking-wider text-[var(--color-brand-crema)] mb-2">
                          Años 20
                        </h4>
                        <p className="text-xs font-sans tracking-wide leading-relaxed text-[var(--color-brand-crema)]/70">
                          Una editorial inspirada en la estética de los años 20 que retoma el espíritu de una década marcada por la elegancia, la transformación y la modernidad emergente.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Floating Custom Follow Cursor ("VER CASO" - aligned instantly to relative mouse position) */}
            {isHovering && (
              <motion.div
                style={{
                  position: 'fixed',
                  left: 0,
                  top: 0,
                  x: cursorPos.x - 48,
                  y: cursorPos.y - 48
                }}
                className="hidden md:flex fixed w-24 h-24 rounded-full bg-[var(--color-brand-bordo)] text-[var(--color-brand-crema)] items-center justify-center text-[10px] font-sans tracking-[0.25em] uppercase font-semibold pointer-events-none z-50 shadow-[0_10px_35px_rgba(132,6,36,0.3)] border border-white/10"
              >
                Ver Caso
              </motion.div>
            )}
          </motion.div>
        ) : activeProject === 'memoria-vivido' ? (
          <MemoriaVividoExperience key="memoria-experience" />
        ) : activeProject === 'no-futuro' ? (
          <NoFuturoExperience key="nofuturo-experience" />
        ) : activeProject === 'neo-trattoria' ? (
          <NeoTrattoriaExperience key="neotrattoria-experience" />
        ) : (
          <Anos20Experience key="anos20-experience" />
        )}
      </AnimatePresence>

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
    </section>
  )
}
