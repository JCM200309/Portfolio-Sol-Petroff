import { lazy, Suspense, useState, useEffect, useRef, Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { motion } from 'framer-motion'

// Lazy-load Spline for maximum initial performance
const Spline = lazy(() => import('@splinetool/react-spline'))

// --- REACT ERROR BOUNDARY FOR SPLINE ---
interface ErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class SplineErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("Spline WebGL or loading asset error captured gracefully:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

interface ProjectPostIt {
  id: number
  title: string
  image: string
  left: string
  top: string
  rotate: number
  floatDuration: number
  floatY: number
  badgeColor: string
}

const whiteboardProjects: ProjectPostIt[] = [
  {
    id: 1,
    title: 'Pre adolescentes',
    image: '/narrativa/preAdolescentes/portada.png',
    left: '8%',
    top: '12%',
    rotate: -4,
    floatDuration: 5.5,
    floatY: -10,
    badgeColor: 'bg-[var(--color-brand-bordo)]/10 text-[var(--color-brand-bordo)]'
  },
  {
    id: 2,
    title: 'Ferran Adria',
    image: '/narrativa/ferranAdria/portada.jpg',
    left: '56%',
    top: '10%',
    rotate: 3,
    floatDuration: 6.2,
    floatY: -8,
    badgeColor: 'bg-[var(--color-brand-marron-oscuro)]/10 text-[var(--color-brand-marron-oscuro)]'
  },
  {
    id: 3,
    title: 'El Plumero',
    image: '/narrativa/elPlumero/portada.png',
    left: '14%',
    top: '48%',
    rotate: -2,
    floatDuration: 4.8,
    floatY: -12,
    badgeColor: 'bg-emerald-950/10 text-emerald-800'
  }
]

function shouldLoadSpline(mobileBreakpoint: number): boolean {
  if (typeof window === 'undefined') return false

  const isMobile = window.innerWidth < mobileBreakpoint
  const isLowEnd = navigator.hardwareConcurrency <= 2

  // WebGL Check
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
  const noWebGL = !gl

  return !isMobile && !isLowEnd && !noWebGL
}

export default function Whiteboard() {
  const boardRef = useRef<HTMLDivElement>(null)
  const [splineLoaded, setSplineLoaded] = useState(false)
  const [splineFailed, setSplineFailed] = useState(false)
  const [canLoadSpline, setCanLoadSpline] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Detect device capabilities
    const eligible = shouldLoadSpline(768)
    setCanLoadSpline(eligible)

    if (eligible) {
      // Set safety timeout to fall back if loading hangs (e.g. network CORS or slow CDN)
      timeoutRef.current = setTimeout(() => {
        if (!splineLoaded) {
          setSplineFailed(true)
        }
      }, 5000)
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [splineLoaded])

  const handleSplineLoad = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setSplineLoaded(true)
  }



  return (
    <section 
      id="narrativa" 
      ref={boardRef}
      className="relative w-full h-full overflow-hidden bg-[var(--color-brand-crema)] flex flex-col justify-between"
      aria-label="Pizarra interactiva de proyectos"
    >
      {/* Background Layer: 3D Spline Scene / Fallback Glass Blurs */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        {/* Grain overlay for luxury editorial feel */}
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-10" />
        
        {/* Premium fallback: Glowing, floating glass/blur shapes */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-brand-crema)] via-white to-[var(--color-brand-crema)] z-0">
          <div className="absolute top-[10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-[var(--color-brand-bordo)]/5 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-[20%] right-[10%] w-[45vw] h-[45vw] rounded-full bg-[var(--color-brand-marron-claro)]/10 blur-[100px] animate-pulse" style={{ animationDuration: '12s' }} />
          <div className="absolute top-[40%] right-[40%] w-[30vw] h-[30vw] rounded-full bg-amber-500/[0.03] blur-[80px] animate-pulse" style={{ animationDuration: '6s' }} />
        </div>

        {/* Spline Canvas wrapped in Local ErrorBoundary */}
        {canLoadSpline && !splineFailed && (
          <SplineErrorBoundary fallback={null}>
            <Suspense fallback={null}>
              <Spline
                scene="https://prod.spline.design/kZiQHAthYdq7zqg8/scene.splinecode"
                onLoad={handleSplineLoad}
                className={`w-full h-full transition-opacity duration-1000 ease-out ${splineLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
              />
            </Suspense>
          </SplineErrorBoundary>
        )}
      </div>

      {/* Header Overlay */}
      <div className="relative z-10 w-full px-8 md:px-24 pt-12 md:pt-16 flex flex-col pointer-events-none">
        <h2 className="text-3xl md:text-5xl font-brand text-[var(--color-brand-marron-oscuro)] leading-none select-none">
          Narrativa
        </h2>
      </div>

      {/* Sandbox Workspace Container */}
      <div className="relative z-10 w-full flex-grow overflow-hidden px-4 md:px-12 py-4">
        {whiteboardProjects.map((project) => (
          <motion.div
            key={project.id}
            drag
            dragConstraints={boardRef}
            dragElastic={0.15}
            dragMomentum={true}
            initial={{ 
              left: project.left, 
              top: project.top,
              rotate: project.rotate,
              scale: 0.9,
              opacity: 0 
            }}
            whileInView={{
              scale: 1,
              opacity: 1,
              transition: { duration: 0.6, ease: 'easeOut', delay: project.id * 0.1 }
            }}
            viewport={{ once: true }}
            animate={{
              y: [0, project.floatY, 0],
              transition: {
                y: {
                  repeat: Infinity,
                  duration: project.floatDuration,
                  ease: 'easeInOut',
                }
              }
            }}
            whileHover={{ 
              scale: 1.03, 
              rotate: project.rotate * 0.5,
              z: 30,
              boxShadow: "0 25px 50px -12px rgba(132, 6, 36, 0.12)"
            }}
            whileDrag={{ 
              scale: 1.05, 
              rotate: project.rotate * 1.5,
              zIndex: 100,
              boxShadow: "0 40px 80px rgba(132, 6, 36, 0.22)" 
            }}
            className="absolute w-[260px] md:w-[310px] p-5 cursor-grab active:cursor-grabbing rounded-sm border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] select-none pointer-events-auto will-change-transform"
          >
            {/* Post-it Header Pin/Indicator */}
            <div className="w-full flex items-center justify-between mb-4">
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-sans tracking-widest font-medium uppercase ${project.badgeColor}`}>
                {project.category}
              </span>
              <span className="text-[10px] font-sans tracking-widest text-[var(--color-brand-marron-claro)]/40 font-bold">
                0{project.id}
              </span>
            </div>

            {/* Thumbnail Project Frame */}
            <div className="w-full aspect-[16/10] overflow-hidden rounded-sm mb-4 bg-[var(--color-brand-crema)] relative group">
              <img 
                src={project.image} 
                className="w-full h-full object-cover grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 ease-in-out pointer-events-none" 
                alt={project.title}
                draggable="false"
              />
              <div className="absolute inset-0 bg-[var(--color-brand-bordo)]/5 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-500" />
            </div>

            {/* Post-it Content */}
            <div className="flex flex-col">
              <h3 className="text-lg md:text-xl font-brand text-[var(--color-brand-marron-oscuro)] tracking-wide leading-tight mb-2">
                {project.title}
              </h3>
              <div className="w-full flex items-center justify-between border-t border-[var(--color-brand-marron-claro)]/20 pt-3 mt-1">
                <span className="text-[10px] font-sans tracking-wider text-[var(--color-brand-marron-claro)] uppercase font-semibold">
                  FEMMORA STUDIO
                </span>
                <span className="text-[10px] font-sans text-[var(--color-brand-bordo)] font-bold tracking-wider hover:translate-x-1 transition-transform duration-300">
                  Ver caso →
                </span>
              </div>
            </div>

            {/* Glass corner highlight reflection */}
            <div className="absolute inset-0 pointer-events-none rounded-sm border-t border-l border-white/20 z-10" />
          </motion.div>
        ))}
      </div>

      {/* Footer Branding Bar */}
      <div className="relative z-10 w-full px-8 md:px-24 pb-12 flex justify-between items-center pointer-events-none select-none">
        <span className="text-[9px] tracking-[0.2em] font-sans text-[var(--color-brand-marron-claro)]/50 uppercase">
          © 2026 FEMMORA STUDIO
        </span>
        <span className="text-[9px] tracking-[0.2em] font-sans text-[var(--color-brand-bordo)]/60 uppercase font-semibold">
          HTML5 WEBGL2 3D / FRAMER MOTION
        </span>
      </div>
    </section>
  )
}
