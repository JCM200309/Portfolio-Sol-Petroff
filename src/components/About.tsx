import { motion } from 'framer-motion'

export default function About() {
  // Staggered list container variants for the collage and text blocks
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1] as any
      }
    }
  };

  const collageItemVariants: any = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.95,
        ease: [0.16, 1, 0.3, 1] as any
      }
    }
  };

  return (
    <section 
      id="conoceme" 
      className="h-full w-full pt-32 pb-20 px-6 md:px-16 flex flex-col justify-center items-center bg-[var(--color-brand-crema)] overflow-y-auto"
    >
      <div className="w-full max-w-6xl z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center"
        >
          {/* LEFT COLUMN: Text Content (spans 7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-center select-none text-left">
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-6xl font-brand text-[var(--color-brand-bordo)] uppercase tracking-tight leading-none mb-10"
            >
              Conóceme
            </motion.h2>

            <motion.div 
              variants={itemVariants}
              className="space-y-6 text-base md:text-lg font-sans font-light leading-relaxed text-[var(--color-brand-marron-oscuro)] max-w-xl"
            >
              <p className="text-xl md:text-2xl font-light text-[var(--color-brand-marron-oscuro)] leading-snug">
                ¡Hola! Soy <strong className="font-semibold text-[var(--color-brand-bordo)]">Sol Petroff</strong>, y <strong className="font-semibold text-[var(--color-brand-marron-oscuro)]">Femmora</strong> es mi universo creativo.
              </p>
              <p>
                Femmora significa la unión de lo femenino y el aura. Diseño desde la sensibilidad, entendiendo cada proyecto como una narrativa visual capaz de conectar con lo emocional y lo humano.
              </p>
              <p>
                Me interesa el cruce entre lo tangible y lo etéreo: el cuerpo como lienzo por sobre todas las cosas, y la puesta en escena como lenguaje.
              </p>
              <p>
                Trabajo desde una mirada femenina e intuitiva, explorando la suavidad, la intensidad y lo simbólico como fuerzas que conviven dentro de una misma identidad visual.
              </p>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Asymmetrical Editorial Collage (spans 5 cols on desktop) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-sm aspect-[4/5] sm:aspect-[1/1] select-none">
              
              {/* Box 1 (Top Left) - Placeholder */}
              <motion.div 
                variants={collageItemVariants}
                className="absolute w-[44%] aspect-[4/5] left-0 top-[4%] border border-[var(--color-brand-marron-claro)]/25 rounded-sm bg-[var(--color-brand-marron-claro)]/[0.04] flex flex-col items-center justify-center p-3 text-center shadow-[0_4px_24px_rgba(146,94,61,0.02)]"
              >
                <span className="text-[10px] font-sans tracking-[0.2em] text-[var(--color-brand-marron-claro)] uppercase mb-1">01</span>
                <span className="text-[8px] font-sans tracking-[0.15em] text-[var(--color-brand-marron-claro)]/70 uppercase">Sensibilidad</span>
              </motion.div>

              {/* Box 2 (Bottom Left) - Placeholder */}
              <motion.div 
                variants={collageItemVariants}
                className="absolute w-[44%] aspect-[4/5] left-0 bottom-[4%] border border-[var(--color-brand-marron-claro)]/25 rounded-sm bg-[var(--color-brand-marron-claro)]/[0.04] flex flex-col items-center justify-center p-3 text-center shadow-[0_4px_24px_rgba(146,94,61,0.02)]"
              >
                <span className="text-[10px] font-sans tracking-[0.2em] text-[var(--color-brand-marron-claro)] uppercase mb-1">02</span>
                <span className="text-[8px] font-sans tracking-[0.15em] text-[var(--color-brand-marron-claro)]/70 uppercase">El Aura</span>
              </motion.div>

              {/* Box 3 (Right Center - Profile Photo) */}
              <motion.div 
                variants={collageItemVariants}
                className="absolute w-[56%] aspect-[4/3] right-0 top-1/2 -translate-y-1/2 rounded-sm overflow-hidden border border-[var(--color-brand-bordo)]/25 shadow-[0_15px_40px_rgba(132,6,36,0.1)] z-10 group"
              >
                <img 
                  src="/conoceme/fotoPerfil.jpeg" 
                  alt="Sol Petroff Perfil" 
                  className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                  draggable={false}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/[0.02] group-hover:bg-transparent transition-colors duration-300 pointer-events-none" />
              </motion.div>
              
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
