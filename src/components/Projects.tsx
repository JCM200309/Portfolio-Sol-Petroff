import { motion } from 'framer-motion'
import InfiniteMenu from './ui/InfiniteMenu'

const projectItems = [
  {
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop',
    link: '#',
    title: 'Editorial Belleza',
    description: 'Campaña de maquillaje'
  },
  {
    image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=1000&auto=format&fit=crop',
    link: '#',
    title: 'Retrato Corporativo',
    description: 'Estudio Fotográfico'
  },
  {
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1000&auto=format&fit=crop',
    link: '#',
    title: 'Piel Perfecta',
    description: 'Técnicas de preparación'
  },
  {
    image: 'https://images.unsplash.com/photo-1512496015851-a1c84c478a0c?q=80&w=1000&auto=format&fit=crop',
    link: '#',
    title: 'Masterclass',
    description: 'Enseñanza online'
  }
];

export default function Projects() {
  return (
    <section id="proyectos" className="min-h-screen py-24 flex flex-col justify-center relative overflow-hidden bg-[var(--color-brand-marron-claro)]">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl text-[var(--color-brand-bordo)] mb-8 px-8 md:px-16 lg:px-24 z-10 text-center font-brand"
      >
        Portfolio
      </motion.h2>

      <div className="w-full h-[70vh] relative z-0">
        <InfiniteMenu items={projectItems} />
      </div>
    </section>
  )
}
