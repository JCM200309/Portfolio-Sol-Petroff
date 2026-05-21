import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductionItem {
  title: string;
  image: string;
  photos: string[];
  longDescription: string;
  num: string;
  color?: string;
}

interface ProductionPhotoOverlayProps {
  production: ProductionItem | null;
  onClose: () => void;
}

export default function ProductionPhotoOverlay({ production, onClose }: ProductionPhotoOverlayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Lock scroll + reset on open
  useEffect(() => {
    if (production) {
      document.body.style.overflow = 'hidden';
      setCurrentIndex(0);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [production]);

  // Track which photo is visible via IntersectionObserver
  useEffect(() => {
    if (!production) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = photoRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) setCurrentIndex(idx);
          }
        });
      },
      {
        root: scrollContainerRef.current,
        threshold: 0.5,
      }
    );
    photoRefs.current.forEach((ref) => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, [production]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') scrollToPhoto(currentIndex + 1);
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') scrollToPhoto(currentIndex - 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIndex, onClose]);

  const scrollToPhoto = useCallback((idx: number) => {
    if (!production) return;
    const clamped = Math.min(Math.max(idx, 0), production.photos.length - 1);
    photoRefs.current[clamped]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [production]);

  if (!production) return null;

  const total = production.photos.length;
  const progress = total > 1 ? currentIndex / (total - 1) : 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
        className="fixed inset-0 z-50 flex overflow-hidden"
        style={{ backgroundColor: 'var(--color-brand-crema)' }}
      >

        {/* ─── LEFT PANEL (fixed info) ─── */}
        <motion.aside
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden md:flex w-[36%] lg:w-[32%] h-full flex-col justify-between px-10 lg:px-14 py-10 border-r border-black/8 flex-shrink-0 z-10"
        >
          {/* Top: nav + number */}
          <div className="flex items-start justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-black/15 bg-white/60 text-[var(--color-brand-marron-oscuro)] hover:bg-[var(--color-brand-bordo)] hover:text-[var(--color-brand-crema)] hover:border-[var(--color-brand-bordo)] transition-all duration-300 cursor-pointer text-xs font-sans font-semibold uppercase tracking-widest"
              aria-label="Volver"
            >
              <span className="text-base leading-none">&larr;</span>
              Volver
            </button>

            {/* Progress bar */}
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] font-sans tracking-widest text-black/35 uppercase">
                {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
              <div className="w-20 h-[2px] bg-black/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[var(--color-brand-bordo)] rounded-full"
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>

          {/* Center: title + description */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.45em] text-[var(--color-brand-marron-claro)] font-semibold mb-4 font-sans">
              {production.num} — Editorial Fotográfica
            </span>

            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-brand font-black text-[var(--color-brand-marron-oscuro)] mb-6 tracking-tight leading-tight">
              {production.title}
            </h2>

            <div className="w-12 h-[2px] bg-[var(--color-brand-bordo)] mb-6" />

            <p className="text-black/65 font-light leading-[1.8] text-sm lg:text-base">
              {production.longDescription}
            </p>

            <p className="mt-8 text-[10px] uppercase tracking-widest text-black/30 font-sans font-semibold">
              Fotografía & Dirección<br />Sol Petroff
            </p>
          </div>

          {/* Bottom: dot navigation */}
          <div className="flex flex-col gap-2">
            <p className="text-[9px] uppercase tracking-widest text-black/25 font-sans mb-1">Navegar</p>
            <div className="flex gap-1.5 flex-wrap">
              {production.photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToPhoto(i)}
                  aria-label={`Foto ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === currentIndex
                      ? 'bg-[var(--color-brand-bordo)] scale-125'
                      : 'bg-black/20 hover:bg-black/40'
                  }`}
                />
              ))}
            </div>
            <p className="text-[9px] text-black/20 font-sans mt-2">↑↓ flechas para navegar · Esc para cerrar</p>
          </div>
        </motion.aside>

        {/* ─── RIGHT PANEL (scrollable photos) ─── */}
        <div
          ref={scrollContainerRef}
          className="flex-1 h-full overflow-y-auto scroll-smooth"
          style={{ scrollbarWidth: 'none' }}
        >
          {/* Mobile back button */}
          <div className="md:hidden sticky top-0 left-0 right-0 z-20 px-4 pt-4 pb-2 flex justify-between items-center bg-[var(--color-brand-crema)]/90 backdrop-blur-sm border-b border-black/8">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-[var(--color-brand-marron-oscuro)] text-xs font-sans font-semibold uppercase tracking-widest cursor-pointer"
            >
              <span className="text-lg">&larr;</span> Volver
            </button>
            <span className="text-[10px] font-sans tracking-widest text-black/40">
              {currentIndex + 1} / {total}
            </span>
          </div>

          {/* Mobile title */}
          <div className="md:hidden px-6 pt-6 pb-4">
            <h2 className="text-3xl font-brand font-black text-[var(--color-brand-marron-oscuro)] tracking-tight">
              {production.title}
            </h2>
            <p className="mt-3 text-black/60 text-sm leading-relaxed">{production.longDescription}</p>
          </div>

          {/* Photo stack */}
          <div className="flex flex-col">
            {production.photos.map((src, i) => (
              <div
                key={i}
                ref={(el) => { photoRefs.current[i] = el; }}
                className="relative w-full"
                style={{ minHeight: '100dvh' }}
              >
                {/* Full-bleed photo */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-5%' }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="w-full h-full"
                  style={{ minHeight: '100dvh' }}
                >
                  <img
                    src={src}
                    alt={`${production.title} — ${i + 1}`}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    className="w-full h-full object-cover object-top"
                    style={{ minHeight: '100dvh', display: 'block' }}
                  />
                </motion.div>

                {/* Photo number badge */}
                <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-[var(--color-brand-crema)]/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-black/10">
                  <span className="text-[10px] font-sans font-semibold tracking-widest text-[var(--color-brand-marron-oscuro)] uppercase">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* End spacer with project name */}
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-8 h-[1px] bg-[var(--color-brand-bordo)] mb-6" />
            <p className="text-[10px] uppercase tracking-[0.5em] text-black/30 font-sans mb-2">Fin de la producción</p>
            <h3 className="text-2xl font-brand font-black text-[var(--color-brand-marron-oscuro)]/30 tracking-tight">
              {production.title}
            </h3>
            <button
              onClick={onClose}
              className="mt-8 px-6 py-3 rounded-full border border-[var(--color-brand-marron-oscuro)]/20 text-[var(--color-brand-marron-oscuro)]/50 font-sans text-xs tracking-widest uppercase hover:border-[var(--color-brand-bordo)] hover:text-[var(--color-brand-bordo)] transition-all duration-300 cursor-pointer"
            >
              ← Volver a producciones
            </button>
          </div>
        </div>

        {/* Thin right progress bar (desktop only) */}
        <div className="hidden md:block absolute right-0 top-0 w-[3px] h-full bg-black/5 z-20">
          <motion.div
            className="w-full bg-[var(--color-brand-bordo)] rounded-b-full"
            animate={{ height: `${progress * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

      </motion.div>
    </AnimatePresence>
  );
}
