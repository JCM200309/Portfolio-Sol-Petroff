import { useEffect, useRef } from 'react'
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.fromTo(titleRef.current, 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 1.5, ease: 'power4.out', delay: 0.5 }
      )
      
      gsap.fromTo(subtextRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 1 }
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
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video 
          ref={videoRef}
          src="/videoHero.mp4" 
          autoPlay muted loop playsInline 
          className="w-full h-full object-cover opacity-60 scale-105"
        />
        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20" />
      </div>



      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl">
        <div ref={titleRef} className="mb-8">
          <img 
            src="/logo.png" 
            alt="Femmora Logo" 
            className="w-full max-w-[400px] md:max-w-[600px] object-contain drop-shadow-2xl brightness-110"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const h1 = document.createElement('h1');
              h1.className = 'text-7xl md:text-9xl font-brand tracking-tighter text-[var(--color-brand-crema)] drop-shadow-xl';
              h1.innerText = 'FEMMORA';
              (e.target as HTMLImageElement).parentElement?.appendChild(h1);
            }}
          />
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--color-brand-crema)]/60"
      >
        <span className="text-[10px] tracking-[0.3em] font-sans">SCROLL</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  )
}
