import { motion } from 'framer-motion'
import InfiniteMenu from './ui/InfiniteMenu'

const projectItems = [
  {
    image: '/Fotos/Memoria Vivido/memoriaVivido1.jpg',
    link: '#',
    title: 'Memoria Vivido',
    description: 'Campaña principal'
  },
  {
    image: '/Fotos/Memoria Vivido/memoriaVivido2.jpg',
    link: '#',
    title: 'Texturas',
    description: 'Estudio de piel'
  },
  {
    image: '/Fotos/Memoria Vivido/memoriaVivido3.jpg',
    link: '#',
    title: 'Iluminación',
    description: 'Claroscuro'
  },
  {
    image: '/Fotos/Memoria Vivido/43D3B602-263E-41E2-9A83-5628F33A7DB8_L0_001-4_7_2024, 5_18_22 p.m..jpg',
    link: '#',
    title: 'Backstage',
    description: 'Detrás de escena'
  }
];

export default function Projects() {
  return (
    <section id="proyectos" className="h-full w-full relative overflow-hidden bg-[var(--color-brand-crema)]">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="absolute top-8 left-0 right-0 text-4xl md:text-5xl text-[var(--color-brand-bordo)] z-10 text-center font-brand pointer-events-none drop-shadow-sm"
      >
        Portfolio
      </motion.h2>

      <div className="w-full h-full relative z-0">
        <InfiniteMenu items={projectItems} />
      </div>
    </section>
  )
}
