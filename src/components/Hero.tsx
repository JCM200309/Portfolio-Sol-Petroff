import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'


gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const subtextRef = useRef<HTMLParagraphElement>(null)
  const headerRef = useRef<HTMLElement>(null)

  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation for title
      gsap.fromTo(titleRef.current, 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 1.5, ease: 'power4.out', delay: 0.5 }
      )
      
      gsap.fromTo(subtextRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 1 }
      )

      // Entrance animation for floating header
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.2 }
      )

      // Simple parallax on scroll
      gsap.to(titleRef.current, {
        y: -100,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      id="universo"
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-black text-[var(--color-brand-crema)]"
    >
      {/* Clickable Case Study Link wrapping the hero content */}
      <a 
        href="#movimiento-neo-trattoria"
        onMouseMove={(e) => {
          setCursorPos({ x: e.clientX, y: e.clientY });
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="absolute inset-0 z-10 w-full h-full flex flex-col items-center justify-center overflow-hidden cursor-none pointer-events-auto"
      >
        {/* Background Video */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video 
            ref={videoRef}
            src="https://res.cloudinary.com/djekqr2ww/video/upload/q_auto,f_auto/v1780425782/videoHero_noxmom.mov"
            poster="/proyectosAudiovisuales/neoTrattoria/neoTrattoriaPortada.JPG"
            preload="auto"
            autoPlay muted loop playsInline 
            className="w-full h-full object-cover opacity-85 scale-105"
          />
          {/* Subtle overlay for better text readability */}
          <div className="absolute inset-0 bg-black/25" />
        </div>

        {/* Main Content: Title bottom-right */}
        <div 
          ref={titleRef} 
          className="absolute bottom-24 right-8 md:right-16 z-10 text-right max-w-xl select-none"
        >
          <h1 className="text-5xl md:text-8xl font-brand text-[var(--color-brand-crema)] tracking-tight mb-3 uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            Neo Trattoria
          </h1>
          <p 
            ref={subtextRef} 
            className="text-xs md:text-sm font-sans tracking-[0.25em] uppercase text-[var(--color-brand-crema)]/85 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] font-light mb-6"
          >
            Macrotendencia
          </p>
          <div className="flex justify-end md:hidden">
            <span
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--color-brand-crema)]/30 text-[var(--color-brand-crema)] text-[10px] font-sans tracking-[0.2em] uppercase rounded-full"
            >
              Ver Caso <span className="text-xs">→</span>
            </span>
          </div>
        </div>
      </a>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--color-brand-crema)]/60 z-20 pointer-events-none"
      >
        <span className="text-[10px] tracking-[0.3em] font-sans">SCROLL</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>

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
          className="hidden md:flex fixed w-24 h-24 rounded-full bg-[var(--color-brand-bordo)] text-[var(--color-brand-crema)] items-center justify-center text-[10px] font-sans tracking-[0.25em] uppercase font-semibold pointer-events-none z-30 shadow-[0_10px_35px_rgba(132,6,36,0.3)] border border-white/10"
        >
          Ver Caso
        </motion.div>
      )}
    </section>
  )
}
