import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import ProductionPhotoOverlay from './ProductionPhotoOverlay'

const productions = [
  {
    id: 1,
    num: '01',
    title: 'Memoria Vívido',
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
    longDescription: 'Editorial basada en un reporte de tendencias que desarrolla el concepto de "memoria vivido", representando un universo estético desde la nostalgia y el recuerdo como un peso. Se plasma la naturaleza expansiva y a veces caótica de la memoria, y como se convive con ese peso.',
    color: '#f6e0e3'
  },
  {
    id: 2,
    num: '02',
    title: 'No Futuro',
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
    longDescription: 'En esta editorial busqué trabajar dentro de la subcultura Punk, el concepto de No – Futuro. Mediante las luces, poses y expresiones faciales reflejamos la personalidad de protesta, rebeldía. Personas interesadas en ellas y en la autogestión, sin visión de futuro colectivo.',
    color: '#e8def1'
  },
  {
    id: 3,
    num: '03',
    title: 'Años 20',
    image: '/producciones/años20/fotoPortada.webp',
    photos: [
      '/producciones/años20/fotoPortada.webp',
      '/producciones/años20/image-4d1736d6-2031-4813-930b-f0376060cbb9.webp',
      '/producciones/años20/image-58472fae-a344-43b9-b0d2-00cf3b4593ba.webp',
      '/producciones/años20/image-98d2f1ab-b1d4-48aa-8234-2bccb0e2928d.webp',
      '/producciones/años20/image-ab55dd13-2ec1-435c-b54b-c6ed1f6ab46e.webp',
    ],
    longDescription: 'Una editorial inspirada en la estética de los años 20 que retoma el espíritu de una década marcada por la elegancia, la liberación y la modernidad emergente. El proyecto se construye a partir de la reinterpretación contemporánea de sus rasgos distintivos: siluetas refinadas, maquillaje geométrico y mirada teatral.',
    color: '#dee8f1'
  },
  {
    id: 4,
    num: '04',
    title: 'Neo Trattoria',
    image: '/producciones/neoTrattoria/fotoPortada.JPG',
    photos: [
      '/producciones/neoTrattoria/fotoPortada.JPG',
      '/producciones/neoTrattoria/image-1ece3b78-ba85-4ade-834d-db38a1d2334a.webp',
      '/producciones/neoTrattoria/image-2dbdc33d-cb5e-4f4f-b608-58cab0a92803.webp',
      '/producciones/neoTrattoria/image-6c536fd8-f84b-4020-b323-5951d0483c10.webp',
      '/producciones/neoTrattoria/image-f56d6f9a-82f6-42b8-808e-5a0f755f5a10.webp',
    ],
    longDescription: 'Neo Trattoria explora la convivencia entre lo orgánico y lo estructural, articulando formas curvas, repeticiones y superposiciones que generan un equilibrio entre exceso y armonía. La propuesta combina materialidades rígidas y maleables, texturas sensoriales y una paleta cromática que mezcla lo vibrante y lo sobrio, construyendo una estética donde pasado y presente coexisten en una nostalgia contemporánea.',
    color: '#f1f1de'
  }
]

// Card dimensions as % of viewport — must match the CSS class below
const CARD_VH = 0.40
const CARD_MAX_PX = 360

export default function Productions() {
  const [activeId, setActiveId] = useState<number | null>(null)
  const [selectedProduction, setSelectedProduction] = useState<typeof productions[0] | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  // Initialize card state once on mount
  useEffect(() => {
    if (imageRef.current) {
      gsap.set(imageRef.current, { opacity: 0, scale: 0.88, y: 0 })
    }
  }, [])

  const handleMouseEnter = (id: number, e: React.MouseEvent<HTMLDivElement>) => {
    setActiveId(id)
    const rowElement = e.currentTarget
    const containerElement = containerRef.current
    const imageElement = imageRef.current
    if (!containerElement || !imageElement) return

    const containerRect = containerElement.getBoundingClientRect()
    const rowRect = rowElement.getBoundingClientRect()

    const rowCenterY = (rowRect.top - containerRect.top) + rowRect.height / 2
    const sectionCenterY = containerRect.height / 2

    const cardH = Math.min(CARD_VH * window.innerHeight, CARD_MAX_PX)
    let offset = rowCenterY - sectionCenterY

    const maxOffset = sectionCenterY - cardH / 2 - 16
    offset = Math.min(Math.max(offset, -maxOffset), maxOffset)

    gsap.to(imageElement, {
      y: offset,
      opacity: 1,
      scale: 1,
      rotate: 5,
      duration: 0.65,
      ease: 'power3.out',
      overwrite: 'auto'
    })
  }

  const handleMouseLeave = () => {
    setActiveId(null)
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        opacity: 0,
        scale: 0.88,
        duration: 0.4,
        ease: 'power3.inOut',
        overwrite: 'auto'
      })
    }
  }

  const handleRowClick = (item: typeof productions[0]) => {
    setSelectedProduction(item)
  }

  const activeItem = productions.find(p => p.id === activeId)

  return (
    <>
      <section
        id="escena"
        ref={containerRef}
        className="relative w-full h-full flex flex-col justify-center px-8 md:px-24 overflow-hidden transition-colors duration-700 ease-in-out"
        style={{ backgroundColor: activeItem ? activeItem.color : 'var(--color-brand-crema)' }}
      >
        {/* Noise Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left column: project list */}
          <div className="col-span-12 md:col-span-7 flex flex-col justify-center">
            <div className="flex flex-col border-t border-[var(--color-brand-marron-claro)]/30">
              {productions.map((item) => (
                <div
                  key={item.id}
                  onMouseEnter={(e) => handleMouseEnter(item.id, e)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleRowClick(item)}
                  className="group relative flex flex-col py-8 md:py-10 border-b border-[var(--color-brand-marron-claro)]/30 cursor-pointer"
                >
                  <div className="relative z-10 flex items-center justify-between">
                    <h3 className={`text-3xl md:text-5xl lg:text-6xl font-brand leading-tight transition-all duration-500 ease-out ${activeId === item.id ? 'text-[var(--color-brand-bordo)] translate-x-4' : 'text-[var(--color-brand-marron-oscuro)] opacity-40 group-hover:opacity-100'}`}>
                      {item.title}
                    </h3>
                    <span className={`text-xs font-sans tracking-widest uppercase transition-all duration-500 ${activeId === item.id ? 'text-[var(--color-brand-bordo)] opacity-100' : 'text-[var(--color-brand-marron-claro)] opacity-0 group-hover:opacity-60'}`}>
                      {item.num}
                    </span>
                  </div>

                  {/* Mobile inline image */}
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
          </div>

          {/* Right: negative space */}
          <div className="hidden md:block col-span-5 pointer-events-none" />
        </div>

        {/* Floating image card — centered by CSS, offset by GSAP y */}
        <div
          ref={imageRef}
          className="hidden md:block absolute right-10 lg:right-20 top-1/2 -translate-y-1/2 pointer-events-none z-20 w-[26vw] h-[40vh] max-w-[360px] overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.18)] rounded-sm"
          style={{ opacity: 0 }}
        >
          <AnimatePresence>
            {activeId && (
              <motion.div
                key={activeId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={activeItem?.image}
                  className="w-full h-full object-cover object-top"
                  alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Background color transition layer */}
        <div
          className="absolute inset-0 z-0 transition-opacity duration-1000"
          style={{
            backgroundColor: activeItem?.color,
            opacity: activeId ? 1 : 0
          }}
        />
      </section>

      {/* Photo overlay */}
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
