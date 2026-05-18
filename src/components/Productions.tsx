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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Animate image card to follow mouse but with a strong "magnetic" pull to the center
  useEffect(() => {
    if (activeId && imageRef.current) {
      gsap.to(imageRef.current, {
        x: mousePos.x * 0.1 + (window.innerWidth * 0.5), // Center + slight mouse follow
        y: mousePos.y * 0.1 + (window.innerHeight * 0.5), // Center + slight mouse follow
        duration: 0.8,
        ease: 'power3.out'
      })
    }
  }, [mousePos, activeId])

  const activeItem = productions.find(p => p.id === activeId)

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-full flex flex-col justify-center px-8 md:px-24 overflow-hidden transition-colors duration-700 ease-in-out"
      style={{ backgroundColor: activeItem ? activeItem.color : 'var(--color-brand-crema)' }}
    >
      {/* Noise Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-20"
        >
          <span className="text-[10px] tracking-[0.4em] font-sans text-[var(--color-brand-marron-claro)] uppercase block mb-4">
            CLIENT STORIES
          </span>
        </motion.div>

        <div className="flex flex-col border-t border-[var(--color-brand-marron-claro)]/30">
          {productions.map((item) => (
            <div
              key={item.id}
              onMouseEnter={() => setActiveId(item.id)}
              onMouseLeave={() => setActiveId(null)}
              className="group relative flex flex-col md:flex-row md:items-center justify-between py-14 border-b border-[var(--color-brand-marron-claro)]/30 cursor-pointer"
            >
              <div className="relative z-10">
                <h3 className={`text-4xl md:text-7xl font-brand transition-all duration-500 ease-out ${activeId === item.id ? 'text-[var(--color-brand-bordo)] translate-x-4' : 'text-[var(--color-brand-marron-oscuro)] opacity-40 group-hover:opacity-100'}`}>
                  {item.title}
                </h3>
              </div>
              
              <div className="hidden md:block relative z-10">
                <motion.div 
                  animate={{ 
                    opacity: activeId === item.id ? 1 : 0,
                    x: activeId === item.id ? 0 : -20
                  }}
                  className="w-12 h-12 rounded-full bg-[var(--color-brand-bordo)] flex items-center justify-center text-white"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Large Central Image Card */}
      <div 
        ref={imageRef}
        className="fixed top-0 left-0 pointer-events-none z-5 w-[40vw] h-[50vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.2)]"
        style={{ 
          display: activeId ? 'block' : 'none',
          rotate: '-8deg' // Angled like the screenshot
        }}
      >
        <AnimatePresence mode="wait">
          {activeId && (
            <motion.div
              key={activeId}
              initial={{ opacity: 0, scale: 0.8, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -100 }}
              transition={{ 
                type: 'spring',
                stiffness: 100,
                damping: 20
              }}
              className="w-full h-full"
            >
              <img
                src={activeItem?.image}
                className="w-full h-full object-cover"
                alt=""
              />
              {/* Subtle gradient overlay on the image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
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
