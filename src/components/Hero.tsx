import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import StaggeredMenu from './ui/StaggeredMenu'

export default function Hero() {
  return (
    <section className="relative w-full h-full flex flex-col overflow-hidden bg-[var(--color-brand-crema)]">
      
      {/* Background SVG for accurate curves and masked video */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
          <defs>
            <clipPath id="photoMask">
              {/* Photo Shape: Straight on right, arched top, curve falls smoothly to x=700 */}
              <path d="M 1440,1000 L 0,1000 C 300,750 500,650 700,450 C 900,250 1200,150 1440,150 Z" />
            </clipPath>
          </defs>
          
          {/* Top left decorative cream shape */}
          <path d="M 0,0 L 500,0 C 350,150 150,250 0,350 Z" fill="#f2ebe1" />

          {/* Masked Video */}
          <foreignObject x="0" y="0" width="1440" height="1000" clipPath="url(#photoMask)">
            <video 
              src="/neoTratoria.mp4" 
              autoPlay muted loop playsInline 
              className="w-full h-full object-cover object-center"
            />
          </foreignObject>

          {/* Thin bordo line outlining the video */}
          <path 
            d="M 0,1000 C 300,750 500,650 700,450 C 900,250 1200,150 1440,150" 
            fill="none" 
            stroke="black" 
            strokeWidth="3" 
          />
          
          {/* Star on the line */}
          <g transform="translate(700, 450)">
            <path d="M 0,-12 L 2,-2 L 12,0 L 2,2 L 0,12 L -2,2 L -12,0 L -2,-2 Z" fill="black" />
          </g>
        </svg>
      </div>

      {/* Navigation */}
      <div className="absolute inset-0 z-40 pointer-events-none">
        <StaggeredMenu 
          position="right"
          isFixed={false}
          logoUrl=""
          colors={['var(--color-brand-bordo)', 'var(--color-brand-marron-claro)', '#ebdccb']}
          accentColor="var(--color-brand-bordo)"
          menuButtonColor="var(--color-brand-marron-oscuro)"
          openMenuButtonColor="var(--color-brand-marron-oscuro)"
          items={[
            { label: 'INICIO', ariaLabel: 'Inicio', link: '#' },
            { label: 'SOBRE MÍ', ariaLabel: 'Sobre Mí', link: '#' },
            { label: 'SERVICIOS', ariaLabel: 'Servicios', link: '#' },
            { label: 'CLASES', ariaLabel: 'Clases', link: '#' },
            { label: 'PORTFOLIO', ariaLabel: 'Portfolio', link: '#' },
            { label: 'CONTACTO', ariaLabel: 'Contacto', link: '#' }
          ]}
          socialItems={[
            { label: 'Instagram', link: '#' },
            { label: 'TikTok', link: '#' }
          ]}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center px-8 md:px-16 lg:px-24">
        
        {/* Left Column (Logo & Text) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full lg:w-1/2 pt-12 pb-32 lg:py-0 flex flex-col items-start"
        >
          {/* Logo instead of Text */}
          <img 
            src="/logo.png" 
            alt="Femmora Logo" 
            className="w-full max-w-[300px] md:max-w-[500px] object-contain mb-8"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const span = document.createElement('span');
              span.className = 'font-brand text-6xl font-normal text-[var(--color-brand-bordo)] tracking-tight mb-8 block';
              span.innerHTML = 'FEMMORA';
              (e.target as HTMLImageElement).parentElement?.insertBefore(span, e.target as Node);
            }}
          />
          
          <p className="text-lg md:text-xl font-light text-[var(--color-brand-marron-oscuro)] max-w-md mb-12 leading-relaxed">
            Clases de automaquillaje, asesorías personalizadas y contenido visual para potenciar tu esencia.
          </p>
          
          <button className="flex items-center gap-3 px-8 py-3 rounded-full bg-[var(--color-brand-bordo)] text-[var(--color-brand-crema)] text-sm tracking-widest hover:bg-[var(--color-brand-marron-oscuro)] transition-all">
            CONOCÉ MÁS
            <Sparkles size={16} className="fill-[var(--color-brand-crema)]" />
          </button>
        </motion.div>

        {/* Right Column is empty since the image/video is handled by the background SVG mask */}
        <div className="hidden lg:block w-full lg:w-1/2 h-[70vh]"></div>
      </div>
      
    </section>
  )
}
