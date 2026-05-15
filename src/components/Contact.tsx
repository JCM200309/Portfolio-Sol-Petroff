import { motion } from 'framer-motion'

export default function Contact() {
  return (
    <section id="contacto" className="h-full w-full py-24 flex flex-col justify-center items-center bg-[var(--color-brand-crema)]">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl text-[var(--color-brand-bordo)] mb-12"
      >
        Contacto
      </motion.h2>

      <motion.form 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
        className="max-w-xl space-y-8"
      >
        <div className="flex flex-col border-b border-[var(--color-brand-marron-claro)] py-2">
          <label htmlFor="name" className="text-sm font-light uppercase tracking-widest text-[var(--color-brand-marron-claro)] mb-2">Nombre</label>
          <input 
            type="text" 
            id="name"
            className="bg-transparent border-none outline-none text-xl focus:ring-0 px-0 text-[var(--color-brand-marron-oscuro)] placeholder:text-[var(--color-brand-marron-claro)]/50"
            placeholder="Tu nombre..."
          />
        </div>
        
        <div className="flex flex-col border-b border-[var(--color-brand-marron-claro)] py-2">
          <label htmlFor="email" className="text-sm font-light uppercase tracking-widest text-[var(--color-brand-marron-claro)] mb-2">Email</label>
          <input 
            type="email" 
            id="email"
            className="bg-transparent border-none outline-none text-xl focus:ring-0 px-0 text-[var(--color-brand-marron-oscuro)] placeholder:text-[var(--color-brand-marron-claro)]/50"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div className="flex flex-col border-b border-[var(--color-brand-marron-claro)] py-2">
          <label htmlFor="message" className="text-sm font-light uppercase tracking-widest text-[var(--color-brand-marron-claro)] mb-2">Mensaje</label>
          <textarea 
            id="message"
            rows={4}
            className="bg-transparent border-none outline-none text-xl focus:ring-0 px-0 text-[var(--color-brand-marron-oscuro)] placeholder:text-[var(--color-brand-marron-claro)]/50 resize-none"
            placeholder="¿En qué podemos ayudarte?"
          ></textarea>
        </div>

        <button type="button" className="mt-8 px-8 py-4 bg-[var(--color-brand-bordo)] text-[var(--color-brand-crema)] uppercase tracking-widest text-sm hover:bg-[var(--color-brand-marron-oscuro)] transition-colors duration-300">
          Enviar Mensaje
        </button>
      </motion.form>
    </section>
  )
}
