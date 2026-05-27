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
          {/* LEFT COLUMN: Text Content (spans 5 cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-center select-none text-left">
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

          {/* RIGHT COLUMN: Editorial Pyramid Photos (spans 7 cols on desktop) */}
          <div className="lg:col-span-7 flex items-center justify-center">
            <div className="flex flex-col items-center gap-6 w-full max-w-3xl mx-auto">
              
              {/* Top Peak of the Pyramid: The Main Profile Photo (Landscape 3:2, fully uncropped) */}
              <motion.div
                variants={collageItemVariants}
                className="w-full overflow-hidden rounded-sm border border-[var(--color-brand-bordo)]/30 shadow-[0_20px_60px_rgba(132,6,36,0.15)] group"
                style={{ aspectRatio: '5184/3456' }}
              >
                <img
                  src="/conoceme/fotoPerfil.jpeg"
                  alt="Sol Petroff Perfil"
                  className="w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                  draggable={false}
                  loading="lazy"
                />
              </motion.div>

              {/* Bottom Base of the Pyramid: The two supporting detail photos side-by-side (fully uncropped) */}
              <div className="grid grid-cols-2 gap-6 w-full">
                {/* Left Base Image (Almost Square 1:1) */}
                <motion.div
                  variants={collageItemVariants}
                  className="w-full overflow-hidden rounded-sm border border-[var(--color-brand-marron-claro)]/20 shadow-[0_8px_32px_rgba(146,94,61,0.08)] group/img1"
                  style={{ aspectRatio: '1666/1743' }}
                >
                  <img
                    src="/conoceme/fotoPerfil2.jpg"
                    alt="Sol Petroff Detalle 1"
                    className="w-full h-full object-cover object-top transition-transform duration-[1.4s] ease-out group-hover/img1:scale-105"
                    draggable={false}
                    loading="lazy"
                  />
                </motion.div>

                {/* Right Base Image (Portrait ~6:7) */}
                <motion.div
                  variants={collageItemVariants}
                  className="w-full overflow-hidden rounded-sm border border-[var(--color-brand-marron-claro)]/20 shadow-[0_8px_32px_rgba(146,94,61,0.08)] group/img3"
                  style={{ aspectRatio: '3024/3536' }}
                >
                  <img
                    src="/conoceme/fotoPerfil3.jpg"
                    alt="Sol Petroff Detalle 2"
                    className="w-full h-full object-cover object-top transition-transform duration-[1.4s] ease-out group-hover/img3:scale-105"
                    draggable={false}
                    loading="lazy"
                  />
                </motion.div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
