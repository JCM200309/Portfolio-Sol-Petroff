import { motion } from 'framer-motion'

export default function About() {
  return (
    <section id="sobre-mi" className="h-full w-full py-24 flex flex-col justify-center items-center bg-[var(--color-brand-crema)]">
      <div className="max-w-4xl">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl text-[var(--color-brand-bordo)] mb-12"
        >
          Manifiesto
        </motion.h2>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8 text-lg md:text-xl font-light leading-relaxed text-[var(--color-brand-marron-oscuro)]"
        >
          <p>Para mí diseñar es canalizar, no imponer.</p>
          <p>
            Trabajo desde la sensibilidad como elemento esencial, como una forma de percibir, entendiendo cada proyecto como una oportunidad para construir una narrativa visual que conecte con lo reflexivo y lo humano.
          </p>
          <p>
            Valoro el cruce entre lo tangible y lo etéreo. El cuerpo como vehículo de energía, un lienzo, y la puesta en escena como lenguaje. Incorporo una dimensión más interna y espiritual, donde la creación se vincula con la energía, la percepción y lo simbólico.
          </p>
          <p>
            Mantengo lo femenino como territorio creativo. Un espacio de creación donde la sensibilidad es poder. Exploro la suavidad, la intensidad, lo sutil y lo visceral como fuerzas que conviven y construyen sentido.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
