import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Send, Loader2, ArrowUpRight } from 'lucide-react'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [service, setService] = useState('Dirección de Arte')
  const [message, setMessage] = useState('')
  
  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({})

  const services = ['Dirección de Arte', 'Fotografía', 'Diseño de Espacio', 'Colaboraciones']

  const validate = () => {
    const tempErrors: typeof errors = {}
    if (!name.trim()) tempErrors.name = 'El nombre es requerido'
    if (!email.trim()) {
      tempErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'El email no es válido'
    }
    if (!message.trim()) tempErrors.message = 'El mensaje es requerido'
    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    
    // Simulate email sending
    try {
      await new Promise((resolve) => setTimeout(resolve, 1800))
      setIsSubmitted(true)
      
      // Reset form
      setName('')
      setEmail('')
      setMessage('')
      setService('Dirección de Arte')
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section 
      id="conectemos" 
      className="min-h-screen md:h-full w-full pt-32 pb-20 px-6 md:px-16 flex flex-col justify-center items-center bg-[var(--color-brand-crema)] md:overflow-y-auto"
    >
      <div className="w-full max-w-6xl z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
          
          {/* LEFT COLUMN: Contact details, Socials and Call to Action */}
          <div className="lg:col-span-5 flex flex-col justify-between select-none text-left h-full">
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-6xl font-brand text-[var(--color-brand-bordo)] uppercase tracking-tight leading-none mb-8"
              >
                Conectemos
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-base md:text-lg font-sans font-light leading-relaxed text-[var(--color-brand-marron-oscuro)] max-w-sm mb-12"
              >
                ¿Tienes un proyecto en mente, deseas colaborar o simplemente quieres conocer más sobre mi trabajo? Escríbeme y construyamos algo único.
              </motion.p>
            </div>

            {/* Socials buttons - custom designed */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6 pt-6 border-t border-[var(--color-brand-marron-claro)]/20"
            >
              <span className="text-[10px] font-sans tracking-[0.25em] text-[var(--color-brand-marron-claro)] uppercase block">
                Mis redes & contacto
              </span>
              
              <div className="flex flex-col gap-4">
                <a 
                  href="https://instagram.com/solpetroff.ph" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-2 border-b border-[var(--color-brand-marron-claro)]/15 text-[var(--color-brand-marron-oscuro)] hover:text-[var(--color-brand-bordo)] transition-colors cursor-pointer pointer-events-auto"
                >
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-[var(--color-brand-marron-claro)]">Instagram</span>
                    <span className="text-lg font-brand mt-0.5">@SOLPETROFF.PH</span>
                  </div>
                  <ArrowUpRight size={20} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </a>

                <a 
                  href="https://www.linkedin.com/in/sol-petroff-b6898620b/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-2 border-b border-[var(--color-brand-marron-claro)]/15 text-[var(--color-brand-marron-oscuro)] hover:text-[var(--color-brand-bordo)] transition-colors cursor-pointer pointer-events-auto"
                >
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-[var(--color-brand-marron-claro)]">LinkedIn</span>
                    <span className="text-lg font-brand mt-0.5">Sol Petroff</span>
                  </div>
                  <ArrowUpRight size={20} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Interactive Form with animation states */}
          <div className="lg:col-span-7 flex flex-col justify-center relative">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="contact-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  onSubmit={handleSubmit}
                  className="space-y-6 md:space-y-8 pointer-events-auto"
                >
                  {/* Name field */}
                  <div className="flex flex-col relative group">
                    <label 
                      htmlFor="name" 
                      className={`text-xs font-sans uppercase tracking-[0.2em] transition-colors duration-300 ${
                        errors.name ? 'text-red-500' : 'text-[var(--color-brand-marron-claro)] group-focus-within:text-[var(--color-brand-bordo)]'
                      }`}
                    >
                      Nombre
                    </label>
                    <input 
                      type="text" 
                      id="name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        if (errors.name) setErrors(prev => ({ ...prev, name: undefined }))
                      }}
                      className={`bg-transparent border-0 border-b outline-none text-lg py-3 px-0 text-[var(--color-brand-marron-oscuro)] focus:ring-0 focus:border-[var(--color-brand-bordo)] transition-all duration-300 ${
                        errors.name ? 'border-red-500' : 'border-[var(--color-brand-marron-claro)]/40'
                      }`}
                      placeholder="Tu nombre..."
                    />
                    {errors.name && (
                      <span className="text-[10px] text-red-500 font-sans tracking-wide mt-1">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="flex flex-col relative group">
                    <label 
                      htmlFor="email" 
                      className={`text-xs font-sans uppercase tracking-[0.2em] transition-colors duration-300 ${
                        errors.email ? 'text-red-500' : 'text-[var(--color-brand-marron-claro)] group-focus-within:text-[var(--color-brand-bordo)]'
                      }`}
                    >
                      Email
                    </label>
                    <input 
                      type="email" 
                      id="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (errors.email) setErrors(prev => ({ ...prev, email: undefined }))
                      }}
                      className={`bg-transparent border-0 border-b outline-none text-lg py-3 px-0 text-[var(--color-brand-marron-oscuro)] focus:ring-0 focus:border-[var(--color-brand-bordo)] transition-all duration-300 ${
                        errors.email ? 'border-red-500' : 'border-[var(--color-brand-marron-claro)]/40'
                      }`}
                      placeholder="correo@ejemplo.com"
                    />
                    {errors.email && (
                      <span className="text-[10px] text-red-500 font-sans tracking-wide mt-1">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Service selector (Horizontal pills) */}
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-sans uppercase tracking-[0.2em] text-[var(--color-brand-marron-claro)]">
                      ¿Qué proyecto tienes en mente?
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {services.map((srv) => {
                        const isSelected = service === srv
                        return (
                          <button
                            key={srv}
                            type="button"
                            onClick={() => setService(srv)}
                            className={`px-4 py-2 text-[10px] font-sans uppercase tracking-widest rounded-full border transition-all duration-300 cursor-pointer ${
                              isSelected
                                ? 'bg-[var(--color-brand-bordo)] text-[var(--color-brand-crema)] border-[var(--color-brand-bordo)] shadow-md'
                                : 'bg-transparent text-[var(--color-brand-marron-oscuro)] border-[var(--color-brand-marron-claro)]/40 hover:border-[var(--color-brand-bordo)] hover:text-[var(--color-brand-bordo)]'
                            }`}
                          >
                            {srv}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Message field */}
                  <div className="flex flex-col relative group">
                    <label 
                      htmlFor="message" 
                      className={`text-xs font-sans uppercase tracking-[0.2em] transition-colors duration-300 ${
                        errors.message ? 'text-red-500' : 'text-[var(--color-brand-marron-claro)] group-focus-within:text-[var(--color-brand-bordo)]'
                      }`}
                    >
                      Mensaje
                    </label>
                    <textarea 
                      id="message"
                      rows={4}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value)
                        if (errors.message) setErrors(prev => ({ ...prev, message: undefined }))
                      }}
                      className={`bg-transparent border-0 border-b outline-none text-lg py-3 px-0 text-[var(--color-brand-marron-oscuro)] focus:ring-0 focus:border-[var(--color-brand-bordo)] transition-all duration-300 resize-none ${
                        errors.message ? 'border-red-500' : 'border-[var(--color-brand-marron-claro)]/40'
                      }`}
                      placeholder="Describe tu idea..."
                    />
                    {errors.message && (
                      <span className="text-[10px] text-red-500 font-sans tracking-wide mt-1">
                        {errors.message}
                      </span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="group relative flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-[var(--color-brand-bordo)] text-[var(--color-brand-crema)] uppercase tracking-[0.2em] text-xs hover:bg-[var(--color-brand-marron-oscuro)] transition-colors duration-300 cursor-pointer disabled:bg-[var(--color-brand-marron-claro)]/50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                        <span>Enviar Mensaje</span>
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                // SUCCESS STATE CARD
                <motion.div 
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="w-full border border-[var(--color-brand-bordo)]/20 bg-[var(--color-brand-marron-claro)]/[0.04] p-10 md:p-14 text-center rounded-sm flex flex-col items-center justify-center select-none"
                >
                  <div className="w-16 h-16 rounded-full bg-[var(--color-brand-bordo)] text-[var(--color-brand-crema)] flex items-center justify-center mb-6 shadow-md">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="font-brand text-2xl md:text-3xl text-[var(--color-brand-bordo)] uppercase tracking-wide mb-4">
                    ¡Mensaje Enviado!
                  </h3>
                  <p className="text-sm font-sans font-light tracking-wide leading-relaxed text-[var(--color-brand-marron-oscuro)] max-w-sm mb-8">
                    Muchas gracias por contactarte. He recibido tu mensaje y me pondré en contacto contigo a la brevedad para conversar sobre tu propuesta.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-3 border border-[var(--color-brand-bordo)] text-[var(--color-brand-bordo)] uppercase tracking-widest text-[10px] hover:bg-[var(--color-brand-bordo)] hover:text-[var(--color-brand-crema)] transition-all duration-300 cursor-pointer pointer-events-auto rounded-xs"
                  >
                    Enviar otro mensaje
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  )
}
