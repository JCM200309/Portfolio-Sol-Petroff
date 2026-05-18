import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'

const productions = [
  {
    id: 1,
    title: 'BOOMTOWN UNBOXED',
    category: 'Content Production',
    image: '/Fotos/Memoria Vivido/memoriaVivido1.jpg',
    color: '#f6e0e3' // Soft pink hover background
  },
  {
    id: 2,
    title: 'OFF-SEASON, ON STRATEGY',
    category: 'Creative Direction',
    image: '/Fotos/Memoria Vivido/memoriaVivido2.jpg',
    color: '#e8def1' // Soft purple hover background
  },
  {
    id: 3,
    title: 'TURNING CULTURAL CONVERSATIONS',
    category: 'Visual Research',
    image: '/Fotos/Memoria Vivido/memoriaVivido3.jpg',
    color: '#dee8f1' // Soft blue hover background
  },
  {
    id: 4,
    title: 'THE DOVE CODE',
    category: 'Branding',
    image: '/Fotos/Memoria Vivido/43D3B602-263E-41E2-9A83-5628F33A7DB8_L0_001-4_7_2024, 5_18_22 p.m..jpg',
    color: '#f1f1de' // Soft cream hover background
  }
]

export default function Productions() {
  const [activeId, setActiveId] = useState<number | null>(null)
  const [targetY, setTargetY] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  // Track height calculation when mouse enters a project row
  const handleMouseEnter = (id: number, e: React.MouseEvent<HTMLDivElement>) => {
    setActiveId(id)
    const rowElement = e.currentTarget
    const rowRect = rowElement.getBoundingClientRect()
    const containerElement = containerRef.current
    if (containerElement) {
      const containerRect = containerElement.getBoundingClientRect()
      // Calculate row vertical center relative to section top
      const relativeY = (rowRect.top - containerRect.top) + (rowRect.height / 3)
      setTargetY(relativeY)
    }
  }

  const handleMouseLeave = () => {
    setActiveId(null)
  }

  // Smoothly slide image container Y coordinate and animate transform effects
  useEffect(() => {
    if (imageRef.current) {
      if (activeId !== null) {
        gsap.to(imageRef.current, {
          y: targetY,
          opacity: 1,
          scale: 1,
          rotate: 6,
          duration: 0.65,
          ease: 'power3.out',
          overwrite: 'auto'
        })
      } else {
        gsap.to(imageRef.current, {
          opacity: 0,
          scale: 0.85,
          duration: 0.45,
          ease: 'power3.inOut',
          overwrite: 'auto'
        })
      }
    }
  }, [targetY, activeId])

  const activeItem = productions.find(p => p.id === activeId)

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-full flex flex-col justify-center px-8 md:px-24 overflow-hidden transition-colors duration-700 ease-in-out"
      style={{ backgroundColor: activeItem ? activeItem.color : 'var(--color-brand-crema)' }}
    >
      {/* Noise Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left column: Typography project list */}
        <div className="col-span-12 md:col-span-7 flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 md:mb-12"
          >
            <span className="text-[10px] tracking-[0.4em] font-sans text-[var(--color-brand-marron-claro)] uppercase block mb-4">
              CLIENT STORIES
            </span>
          </motion.div>

          <div className="flex flex-col border-t border-[var(--color-brand-marron-claro)]/30">
            {productions.map((item) => (
              <div
                key={item.id}
                onMouseEnter={(e) => handleMouseEnter(item.id, e)}
                onMouseLeave={handleMouseLeave}
                className="group relative flex flex-col py-10 md:py-12 border-b border-[var(--color-brand-marron-claro)]/30 cursor-pointer"
              >
                <div className="relative z-10">
                  <span className="text-[10px] tracking-[0.2em] font-sans text-[var(--color-brand-marron-claro)]/60 block mb-2 uppercase">
                    {item.category}
                  </span>
                  <h3 className={`text-3xl md:text-5xl lg:text-6xl font-brand leading-tight transition-all duration-500 ease-out ${activeId === item.id ? 'text-[var(--color-brand-bordo)] translate-x-4' : 'text-[var(--color-brand-marron-oscuro)] opacity-40 group-hover:opacity-100'}`}>
                    {item.title}
                  </h3>
                </div>

                {/* Mobile Touch Inline Collapsible Card */}
                <AnimatePresence>
                  {activeId === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="block md:hidden overflow-hidden w-full aspect-[4/3] rounded-sm shadow-md"
                    >
                      <img 
                        src={item.image} 
                        className="w-full h-full object-cover" 
                        alt={item.title} 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Editorial Bottom Call-To-Action matching reference video */}
          <div className="mt-12 flex items-center gap-4">
            <button className="px-6 py-3 rounded-full border border-[var(--color-brand-marron-oscuro)]/30 hover:border-[var(--color-brand-marron-oscuro)] hover:bg-[var(--color-brand-marron-oscuro)] hover:text-[var(--color-brand-crema)] font-sans text-xs tracking-widest uppercase transition-all duration-300 cursor-pointer">
              View all work
            </button>
            <div className="w-10 h-10 rounded-full border border-[var(--color-brand-marron-oscuro)]/30 flex items-center justify-center text-[var(--color-brand-marron-oscuro)] hover:border-[var(--color-brand-marron-oscuro)] hover:bg-[var(--color-brand-marron-oscuro)] hover:text-[var(--color-brand-crema)] transition-all duration-300 cursor-pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right column: Clear negative space for layout balance, absolute sliding image floats over this area */}
        <div className="hidden md:block col-span-5 pointer-events-none" />
      </div>

      {/* Dynamic Vertical Sliding Image Card - Desktop only */}
      <div 
        ref={imageRef}
        className="hidden md:block absolute right-12 lg:right-24 pointer-events-none z-20 w-[30vw] h-[38vh] max-w-[420px] min-h-[300px] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.25)] rounded-sm bg-[var(--color-brand-crema)]"
        style={{ 
          top: 0,
          transform: 'translateY(-50%)',
          opacity: 0,
          scale: 0.85
        }}
      >
        <AnimatePresence>
          {activeId && (
            <motion.div
              key={activeId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={activeItem?.image}
                className="w-full h-full object-cover"
                alt=""
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom Background Color Layer for smoother transitions */}
      <div 
        className="absolute inset-0 z-0 transition-opacity duration-1000"
        style={{ 
          backgroundColor: activeItem?.color, 
          opacity: activeId ? 1 : 0 
        }} 
      />
    </section>
  )
}
