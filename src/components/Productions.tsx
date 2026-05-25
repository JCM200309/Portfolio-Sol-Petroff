import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { animate, set, stagger } from 'animejs'
import ProductionPhotoOverlay from './ProductionPhotoOverlay'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Production {
  id: number
  num: string
  title: string
  subtitle: string
  image: string
  photos: string[]
  longDescription: string
  color: string
  featured?: boolean
}

// ─── Data — ordered by hierarchy ─────────────────────────────────────────────

const productions: Production[] = [
  {
    id: 1,
    num: '01',
    title: 'Memoria Vívido',
    subtitle: 'Editorial de tendencias',
    featured: true,
    image: '/producciones/memoriaVivido/foto principal.jpg',
    photos: [
      '/producciones/memoriaVivido/foto principal.jpg',
      '/producciones/memoriaVivido/471988EA-FB4A-409D-9469-30F36DD5F0A8_L0_001-4_7_2024, 4_46_10 p.m..jpg',
      '/producciones/memoriaVivido/4BB58F99-F85C-42E3-ABAF-BFDC83DACAA5_L0_001-4_7_2024, 4_46_12 p.m..jpg',
      '/producciones/memoriaVivido/57459F9E-70BA-4ABE-B28B-48C88CE86B11_L0_001-4_7_2024, 4_46_11 p.m..jpg',
      '/producciones/memoriaVivido/BAEE5B7E-3A79-4FB2-9CE5-9709AE4A0256_L0_001-4_7_2024, 4_46_10 p.m..jpg',
      '/producciones/memoriaVivido/D9742183-A5A7-46D6-AB10-7A5753506F1D_L0_001-4_7_2024, 4_46_12 p.m..jpg',
      '/producciones/memoriaVivido/DEFAEDF5-C8A4-4749-A019-35E3FC68706A_L0_001-4_7_2024, 4_46_10 p.m..jpg',
    ],
    longDescription:
      'Editorial basada en un reporte de tendencias que desarrolla el concepto de "memoria vivido", representando un universo estético desde la nostalgia y el recuerdo como un peso. Se plasma la naturaleza expansiva y a veces caótica de la memoria, y como se convive con ese peso.',
    color: '#f6e0e3',
  },
  {
    id: 4,
    num: '02',
    title: 'Neo Trattoria',
    subtitle: 'Nostalgia contemporánea',
    image: '/producciones/neoTrattoria/fotoPortada.JPG',
    photos: [
      '/producciones/neoTrattoria/fotoPortada.JPG',
      '/producciones/neoTrattoria/image-1ece3b78-ba85-4ade-834d-db38a1d2334a.webp',
      '/producciones/neoTrattoria/image-2dbdc33d-cb5e-4f4f-b608-58cab0a92803.webp',
      '/producciones/neoTrattoria/image-6c536fd8-f84b-4020-b323-5951d0483c10.webp',
      '/producciones/neoTrattoria/image-f56d6f9a-82f6-42b8-808e-5a0f755f5a10.webp',
    ],
    longDescription:
      'Neo Trattoria explora la convivencia entre lo orgánico y lo estructural, articulando formas curvas, repeticiones y superposiciones que generan un equilibrio entre exceso y armonía.',
    color: '#f1f1de',
  },
  {
    id: 2,
    num: '03',
    title: 'No Futuro',
    subtitle: 'Subcultura Punk',
    image: '/producciones/noFuturo/fotoPortada.JPG',
    photos: [
      '/producciones/noFuturo/fotoPortada.JPG',
      '/producciones/noFuturo/IMG_8052.JPG',
      '/producciones/noFuturo/IMG_8058.JPG',
      '/producciones/noFuturo/IMG_8061.JPG',
      '/producciones/noFuturo/IMG_8065.JPG',
      '/producciones/noFuturo/IMG_8066.JPG',
      '/producciones/noFuturo/IMG_8070.JPG',
      '/producciones/noFuturo/IMG_8081.JPG',
    ],
    longDescription:
      'En esta editorial busqué trabajar dentro de la subcultura Punk, el concepto de No – Futuro. Mediante las luces, poses y expresiones faciales reflejamos la personalidad de protesta, rebeldía.',
    color: '#e8def1',
  },
  {
    id: 3,
    num: '04',
    title: 'Años 20',
    subtitle: 'Elegancia de época',
    image: '/producciones/años20/fotoPortada.webp',
    photos: [
      '/producciones/años20/fotoPortada.webp',
      '/producciones/años20/image-4d1736d6-2031-4813-930b-f0376060cbb9.webp',
      '/producciones/años20/image-58472fae-a344-43b9-b0d2-00cf3b4593ba.webp',
      '/producciones/años20/image-98d2f1ab-b1d4-48aa-8234-2bccb0e2928d.webp',
      '/producciones/años20/image-ab55dd13-2ec1-435c-b54b-c6ed1f6ab46e.webp',
    ],
    longDescription:
      'Una editorial inspirada en la estética de los años 20 que retoma el espíritu de una década marcada por la elegancia, la liberación y la modernidad emergente.',
    color: '#dee8f1',
  },
]

// ─── Width percentages: default (resting) state ───────────────────────────────
// Featured starts expanded; others share the rest proportionally
const DEFAULT_WIDTHS  = [46, 22, 22, 10]   // Memoria, NeoTratt, NoFuturo, Años20
// When card i is hovered → it expands to HOVER_W; others shrink proportionally
const HOVER_W   = 52  // expanded card %
const HOVER_MIN = 6   // minimum non-featured card %

function widthsForHover(hoveredIdx: number): number[] {
  const result = productions.map((_, i) => {
    if (i === hoveredIdx) return HOVER_W
    // Featured card (0) retains more space when not hovered
    if (i === 0 && hoveredIdx !== 0) return 22
    return HOVER_MIN
  })
  // normalise to sum 100 (rounding may drift)
  const sum = result.reduce((a, b) => a + b, 0)
  return result.map(w => (w / sum) * 100)
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Productions() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([])
  const bgRef      = useRef<HTMLDivElement>(null)

  const [activeIdx, setActiveIdx]           = useState<number | null>(null)
  const [selectedProduction, setSelectedProduction] = useState<Production | null>(null)

  // ── Entrance animation on mount ──────────────────────────────────────────
  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[]

    // Start invisible
    set(cards, { opacity: 0, translateY: 30 })

    // Staggered entrance — spring physics
    animate(cards, {
      opacity:    [0, 1],
      translateY: [30, 0],
      delay:   stagger(90, { start: 200 }),
      duration: 900,
      ease:   'spring(1, 80, 12, 0)',
    })
  }, [])

  // ── Accordion: animate widths on hover ───────────────────────────────────
  const animateWidths = (widths: number[]) => {
    widths.forEach((w, i) => {
      const el = cardRefs.current[i]
      if (!el) return
      animate(el, {
        width:    `${w}%`,
        duration: 600,
        ease:     'cubicBezier(0.25, 0.46, 0.45, 0.94)',
      })
    })
  }

  const handleMouseEnter = (idx: number) => {
    setActiveIdx(idx)
    animateWidths(widthsForHover(idx))

    // Animate background colour via the bg overlay div
    if (bgRef.current) {
      bgRef.current.style.backgroundColor = productions[idx].color
      animate(bgRef.current, {
        opacity:  [0, 1],
        duration: 500,
        ease:     'outQuad',
      })
    }

    // Scale up hovered image slightly, dim others
    cardRefs.current.forEach((el, i) => {
      if (!el) return
      const img = el.querySelector('.card-img') as HTMLElement
      if (!img) return
      animate(img, {
        scale:    i === idx ? 1.05 : 0.98,
        opacity:  i === idx ? 1    : (i === 0 && idx !== 0 ? 0.72 : 0.55),
        duration: 450,
        ease:     'outQuad',
      })
    })
  }

  const handleMouseLeave = () => {
    setActiveIdx(null)
    animateWidths(DEFAULT_WIDTHS)

    if (bgRef.current) {
      animate(bgRef.current, {
        opacity:  [1, 0],
        duration: 600,
        ease:     'outQuad',
      })
    }

    // Reset all images
    cardRefs.current.forEach(el => {
      if (!el) return
      const img = el.querySelector('.card-img') as HTMLElement
      if (!img) return
      animate(img, { scale: 1, opacity: 1, duration: 400, ease: 'outQuad' })
    })
  }

  return (
    <>
      <section
        id="escena"
        ref={sectionRef}
        className="relative w-full h-full overflow-hidden flex flex-col"
        style={{ backgroundColor: 'var(--color-brand-crema)' }}
        onMouseLeave={handleMouseLeave}
      >
        {/* Colour background overlay */}
        <div
          ref={bgRef}
          className="absolute inset-0 pointer-events-none z-0"
          style={{ opacity: 0, backgroundColor: productions[0].color }}
        />

        {/* Noise texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        {/* Section label */}
        <span className="absolute top-5 left-8 z-10 text-[9px] tracking-[0.32em] uppercase text-[var(--color-brand-marron-claro)] font-sans pointer-events-none select-none">
          Producciones
        </span>

        {/* ── Accordion strip ─────────────────────────────────────────────── */}
        <div className="relative z-10 flex flex-row w-full h-full pt-16 pb-10 px-6 gap-3">
          {productions.map((prod, i) => {
            const isFeatured = prod.featured === true
            const isActive   = activeIdx === i
            const isAnyActive = activeIdx !== null

            return (
              <div
                key={prod.id}
                ref={el => { cardRefs.current[i] = el }}
                className="relative flex flex-col cursor-pointer group"
                style={{
                  width:          `${DEFAULT_WIDTHS[i]}%`,
                  flexShrink:     0,
                  willChange:     'width',
                }}
                onMouseEnter={() => handleMouseEnter(i)}
                onClick={() => setSelectedProduction(prod)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setSelectedProduction(prod)}
                aria-label={`Explorar producción ${prod.title}`}
              >
                {/* ── Polaroid card ───────────────────────────────────── */}
                <div
                  className="relative flex-1 overflow-hidden rounded-[2px] shadow-[0_8px_40px_rgba(0,0,0,0.10)]"
                  style={{
                    // Polaroid white frame via outline + background
                    outline:         '10px solid #fafafa',
                    outlineOffset:   '-10px',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="card-img w-full h-full object-cover"
                    style={{
                      willChange: 'transform, opacity',
                      transformOrigin: 'center center',
                    }}
                  />

                  {/* Subtle inner shadow for depth */}
                  <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] pointer-events-none rounded-[2px]" />

                  {/* Hover overlay — very subtle */}
                  <div
                    className="absolute inset-0 bg-black/0 transition-colors duration-300 pointer-events-none"
                    style={{ backgroundColor: isActive ? 'transparent' : isAnyActive ? 'rgba(0,0,0,0.08)' : 'transparent' }}
                  />
                </div>

                {/* ── Title block below polaroid ────────────────────── */}
                {/* Polaroid bottom strip (white) */}
                <div
                  className="relative bg-[#fafafa] px-3 pt-3 pb-4 shadow-[0_8px_40px_rgba(0,0,0,0.10)]"
                  style={{ marginTop: '-1px' }} // join with card above
                >
                  {/* Number — top right of strip */}
                  <span
                    className="absolute top-2 right-3 text-[9px] font-sans tracking-[0.2em] uppercase transition-colors duration-300"
                    style={{ color: isActive ? 'var(--color-brand-bordo)' : 'var(--color-brand-marron-claro)' }}
                  >
                    {prod.num}
                  </span>

                  <h3
                    className="font-brand leading-tight transition-colors duration-300 truncate"
                    style={{
                      fontSize:   isFeatured ? 'clamp(1rem, 2vw, 1.6rem)' : 'clamp(0.7rem, 1.3vw, 1.1rem)',
                      color:      isActive ? 'var(--color-brand-bordo)' : 'var(--color-brand-marron-oscuro)',
                      marginRight: '1.5rem',
                    }}
                  >
                    {prod.title}
                  </h3>

                  <p
                    className="font-sans truncate"
                    style={{
                      fontSize:   'clamp(0.55rem, 0.9vw, 0.72rem)',
                      color:      'var(--color-brand-marron-claro)',
                      marginTop:  '2px',
                      opacity:    isAnyActive && !isActive ? 0.5 : 0.8,
                      transition: 'opacity 0.3s',
                    }}
                  >
                    {prod.subtitle}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Photo overlay — existing component, unchanged */}
      <AnimatePresence>
        {selectedProduction && (
          <ProductionPhotoOverlay
            production={selectedProduction}
            onClose={() => setSelectedProduction(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
