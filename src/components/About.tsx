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
      className="min-h-screen md:h-full w-full pt-32 pb-20 px-6 md:px-16 flex flex-col justify-center items-center bg-[var(--color-brand-crema)] md:overflow-y-auto"
    >
      <div className="w-full max-w-6xl z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center"
        >
          {/* LEFT COLUMN: Text Content & Contact Channels (spans 6 cols on desktop) */}
          <div className="lg:col-span-6 flex flex-col justify-center select-none text-left">
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-6xl font-brand text-[var(--color-brand-bordo)] uppercase tracking-tight leading-none mb-8"
            >
              Conóceme
            </motion.h2>

            <motion.div 
              variants={itemVariants}
              className="space-y-5 text-sm md:text-base font-sans font-light leading-relaxed text-[var(--color-brand-marron-oscuro)] max-w-xl"
            >
              <p className="text-lg md:text-xl font-light text-[var(--color-brand-marron-oscuro)] leading-snug">
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

            {/* Divider line */}
            <motion.div 
              variants={itemVariants}
              className="w-16 h-px bg-[var(--color-brand-marron-claro)]/25 my-8" 
            />

            {/* Prominent Contact / Social Networks Block */}
            <motion.div 
              variants={itemVariants}
              className="space-y-6"
            >
              <h3 className="text-xs font-sans tracking-[0.25em] text-[var(--color-brand-marron-claro)] uppercase block">
                Conectemos
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Instagram card */}
                <a 
                  href="https://instagram.com/solpetroff.ph" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex flex-col justify-between p-4 border border-[var(--color-brand-marron-claro)]/20 hover:border-[var(--color-brand-bordo)]/50 hover:bg-[var(--color-brand-bordo)]/[0.02] rounded-sm transition-all duration-300 pointer-events-auto"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] uppercase tracking-wider text-[var(--color-brand-marron-claro)]">Instagram</span>
                    <svg className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 text-[var(--color-brand-bordo)] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </div>
                  <span className="text-base font-brand text-[var(--color-brand-marron-oscuro)] group-hover:text-[var(--color-brand-bordo)] transition-colors duration-300">
                    @SOLPETROFF.PH
                  </span>
                </a>

                {/* LinkedIn card */}
                <a 
                  href="https://www.linkedin.com/in/sol-petroff-b6898620b/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex flex-col justify-between p-4 border border-[var(--color-brand-marron-claro)]/20 hover:border-[var(--color-brand-bordo)]/50 hover:bg-[var(--color-brand-bordo)]/[0.02] rounded-sm transition-all duration-300 pointer-events-auto"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] uppercase tracking-wider text-[var(--color-brand-marron-claro)]">LinkedIn</span>
                    <svg className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 text-[var(--color-brand-bordo)] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </div>
                  <span className="text-base font-brand text-[var(--color-brand-marron-oscuro)] group-hover:text-[var(--color-brand-bordo)] transition-colors duration-300">
                    Sol Petroff
                  </span>
                </a>
              </div>

              {/* Simple Mailto link below */}
              <div className="pt-1">
                <a 
                  href="mailto:solpetroff.ph@gmail.com"
                  className="inline-flex items-center gap-2 text-xs font-sans tracking-widest text-[var(--color-brand-marron-oscuro)]/70 hover:text-[var(--color-brand-bordo)] transition-colors pointer-events-auto group"
                >
                  <span className="border-b border-[var(--color-brand-marron-claro)]/30 group-hover:border-[var(--color-brand-bordo)] transition-all">
                    solpetroff.ph@gmail.com
                  </span>
                  <span className="text-[9px] font-sans text-[var(--color-brand-marron-claro)] group-hover:text-[var(--color-brand-bordo)] opacity-60 group-hover:opacity-100">
                    (Email)
                  </span>
                </a>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Single Profile Photo (spans 6 cols on desktop) */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <motion.div
              variants={collageItemVariants}
              className="w-full overflow-hidden rounded-sm border border-[var(--color-brand-bordo)]/20 shadow-[0_20px_50px_rgba(132,6,36,0.1)] group"
              style={{ aspectRatio: '5184/3456' }}
            >
              <img
                src="/conoceme/fotoPerfil.jpeg"
                alt="Sol Petroff Perfil"
                className="w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.03]"
                draggable={false}
                loading="lazy"
                decoding="async"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
