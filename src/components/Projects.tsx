import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import InfiniteMenu from './ui/InfiniteMenu';
import ProjectVideoOverlay from './ProjectVideoOverlay';

const projectItems = [
  {
    num: '01',
    image: '/proyectosAudiovisuales/neoTrattoriaPortada.JPG',
    video: '/proyectosAudiovisuales/neoTrattoria.mp4',
    link: '#',
    title: 'Neo Trattoria',
    description: 'Estudio de espacio',
    longDescription: 'Este fashion film traduce la macro tendencia Neo Trattoria en una experiencia audiovisual que explora la dualidad de lo orgánico y lo estructural. A través de la luz, el ritmo y la composición se busca reflejar la tensión entre lo tradicional y lo contemporáneo, lo sobrio y lo vibrante. Se encuentran lo Racing y el lujo, y las formas fluidas, la repetición y la superposición construyen una atmosfera sensorial donde lo íntimo y lo expansivo conviven, evocando una nostalgia vibrante que habita entre pasado y presente.',
    details: {
      year: '2025',
      category: 'Spatial Design & Video Art',
      duration: '02:15'
    }
  },
  {
    num: '02',
    image: '/proyectosAudiovisuales/PHYGITALPortada.png',
    video: '/proyectosAudiovisuales/phygital.mp4',
    link: '#',
    title: 'Phygital',
    description: 'Intersección digital',
    longDescription: 'Este proyecto explora la intersección entre lo físico y lo digital, creando un encuentro tangible con la inteligencia artificial. Sin recurrir a recursos digitales en postproducción, la obra traduce la estética digital a elementos físicos, generando experiencias que evocan interfaces, algoritmos y mundos virtuales a través de objetos, texturas y composiciones en el espacio real. La propuesta busca que lo tecnológico se sienta cercano y material, transformando conceptos abstractos en sensaciones físicas y visuales concretas.',
    details: {
      year: '2025',
      category: 'Interactive Performance',
      duration: '01:50'
    }
  },
  {
    num: '03',
    image: '/proyectosAudiovisuales/objetoAntiModaPortada.png',
    video: '/proyectosAudiovisuales/objetoAntiModa.mp4',
    link: '#',
    title: 'Objeto Anti-Moda',
    description: 'Diseño y estructura',
    longDescription: 'En este proyecto se tomó como inspiración un “objeto anti moda” para construir una narrativa y un universo visual. El objeto es una manta de sirena y la inspiración el surrealismo, donde se exploran aspectos profundos e irracionales de la mente, el inconsciente y los sueños como vías para acceder a una realidad mas autentica. Se refleja el anhelo utópico y una identidad onírica.',
    details: {
      year: '2024',
      category: 'Fashion & Sculpture',
      duration: '01:10'
    }
  },
  {
    num: '04',
    image: '/proyectosAudiovisuales/espejismoDelLujoPortada.png',
    video: '/proyectosAudiovisuales/espejismoDelLujo.mp4',
    link: '#',
    title: 'Espejismo del Lujo',
    description: 'Performance conceptual',
    longDescription: 'Este fashion film reflexiona sobre la paradoja del lujo contemporáneo: cuando lo aspiracional se convierte en un exceso vacío. Cada escena, situada en espacios domésticos y pulcros, revela la tensión entre lo real y lo ilusorio, entre la abundancia y el vacío. Se propone una mirada crítica e irónica sobre el consumo y el deseo, exponiendo la fragilidad del valor que otorgamos a las apariencias.',
    details: {
      year: '2025',
      category: 'Concept & Performance',
      duration: '01:45'
    }
  }
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<typeof projectItems[0] | null>(null);

  return (
    <section id="movimiento" className="h-full w-full relative overflow-hidden bg-[var(--color-brand-crema)]">
      

      <div className="w-full h-full relative z-0">
        <InfiniteMenu 
          items={projectItems} 
          onItemClick={(item) => setSelectedProject(item as typeof projectItems[0])}
        />
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectVideoOverlay 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
}
