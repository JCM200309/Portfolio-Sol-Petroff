import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, Eye, Layers } from 'lucide-react';

interface PhygitalAudiovisualProps {
  onSelectPhoto: (src: string) => void;
}

const phygitalCategories = [
  {
    id: 'concepto-ia',
    title: 'Lenguaje Digital e IA',
    icon: Terminal,
    badge: '01 / CONCEPTO',
    tag: 'Humanidad digitalizada',
    summary: 'Exploramos cómo la inteligencia artificial procesa y replica la existencia humana. La IA actúa como un espejo imperfecto: imita nuestras acciones físicas basándose en patrones matemáticos, pero sufre un cortocircuito absoluto al enfrentarse a la subjetividad, la conciencia y la genuina liberación emocional humana.',
    bullets: [
      'IA como espejo imperfecto de lo orgánico',
      'Conversión de estímulos humanos en matrices de datos',
      'El límite insuperable: la experiencia emocional'
    ],
    images: [
      { src: '/proyectosAudiovisuales/PHYGITAL/Backstage/Inspo Explorador e IA/inspoExplorador.webp', caption: 'Inspiración Explorador - Rastreo espacial.' },
      { src: '/proyectosAudiovisuales/PHYGITAL/Backstage/Inspo Explorador e IA/inspoExplorador2.jpg', caption: 'Inspiración Explorador - Detalle de equipo.' },
      { src: '/proyectosAudiovisuales/PHYGITAL/Backstage/Inspo Explorador e IA/inspoIA.png', caption: 'Estética de la IA - Morfología y datos.' },
      { src: '/proyectosAudiovisuales/PHYGITAL/Backstage/Inspo Explorador e IA/inspoIA2.webp', caption: 'Estética de la IA - Patrones de código digital.' }
    ]
  },
  {
    id: 'locacion',
    title: 'El Bosque Misterioso',
    icon: Eye,
    badge: '02 / ESCENARIO',
    tag: 'El espejo natural',
    summary: 'La locación representa el contraste máximo: un bosque denso y silvestre que sirve como lienzo para la irrupción tecnológica. Este entorno orgánico actúa como receptor de la presencia digital, acentuando el cortocircuito del personaje replicante en medio de la naturaleza.',
    bullets: [
      'Bosque nativo como interfaz física del duelo',
      'Interacción orgánica entre hojas, ramas y lentes sensores',
      'Simbolismo del bosque como espacio de respuestas internas'
    ],
    images: [
      { src: '/proyectosAudiovisuales/PHYGITAL/Backstage/Locacion/locacion1.webp', caption: 'Mapeo de locación - Sombras y follaje.' },
      { src: '/proyectosAudiovisuales/PHYGITAL/Backstage/Locacion/locacion2.webp', caption: 'Encuadre natural - Entrada del explorador.' },
      { src: '/proyectosAudiovisuales/PHYGITAL/Backstage/Locacion/locacion3.webp', caption: 'Detalle cromático - La vegetación de Zárate.' }
    ]
  },
  {
    id: 'vestuario',
    title: 'Estilismo & Armadura',
    icon: Shield,
    badge: '03 / VESTUARIO',
    tag: 'Futuro Apocalíptico',
    summary: 'El estilismo contrasta la vulnerabilidad del explorador con la rigidez de la IA. La vestimenta de la réplica evoca un porvenir distópico y frío, repleto de patrones de código, mientras que el explorador se vale de lentes de tracking que deconstruyen la mirada tradicional.',
    bullets: [
      'Goggles especiales de rastreo digital',
      'Réplica envuelta en patrones de código vivo',
      'Texturas pesadas, capas asimétricas y funcionalidad urbana'
    ],
    images: [
      { src: '/proyectosAudiovisuales/PHYGITAL/Backstage/Vestuario/vestuario1.webp', caption: 'Prueba de vestuario - Máscara y sensor.' },
      { src: '/proyectosAudiovisuales/PHYGITAL/Backstage/Vestuario/vestuario2.webp', caption: 'Detalle de armadura y arnés explorador.' },
      { src: '/proyectosAudiovisuales/PHYGITAL/Backstage/Vestuario/vestuario3.webp', caption: 'Prenda técnica impermeable.' },
      { src: '/proyectosAudiovisuales/PHYGITAL/Backstage/Vestuario/vestuario4.webp', caption: 'Silueta completa y texturas urbanas.' }
    ]
  }
];

export default function PhygitalAudiovisual({ onSelectPhoto }: PhygitalAudiovisualProps) {
  const [inlinePreviews, setInlinePreviews] = useState<Record<string, string | null>>({});
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'SYSTEM INITIALIZED',
    'SCANNING ENVIRONMENT...',
    'READY TO DETECT DIGITAL SIGNALS'
  ]);
  const [hoveredData, setHoveredData] = useState<string>('SYS: STANDBY');

  const updateTelemetry = (section: string) => {
    let logMsg = '';
    let dataMsg = '';
    switch (section) {
      case 'concepto-ia':
        logMsg = 'AI_COGNITIVE_CHECK: DETECTING REPLICANT LOGIC... STATUS: CRITICAL ERROR IN EMOTIONAL BUFFER';
        dataMsg = 'AI_STABILITY: 34.2% [REPLICATION FAILED]';
        break;
      case 'locacion':
        logMsg = 'GEO_SCAN: LOC ZÁRATE FOREST // LAT 34.1202 S // LON 59.0125 W // BIOME: ORGANIC';
        dataMsg = 'SIGNAL_DECAY: 12% [ORGANIC INTERFERENCE]';
        break;
      case 'vestuario':
        logMsg = 'HARDWARE_DETECT: OPTICAL SENSORS INITIATED // PATTERN RECOGNITION: DISTOPIAN CLOTHING';
        dataMsg = 'GLASSES_TRACKING: active [120fps]';
        break;
      default:
        logMsg = 'SCANNER_IDLE: STANDBY';
        dataMsg = 'SYS: STANDBY';
    }

    setTerminalLogs(prev => [...prev.slice(-3), logMsg]);
    setHoveredData(dataMsg);
  };

  return (
    <div className="w-full py-24 bg-black/[0.01] border-t border-[var(--color-brand-marron-claro)]/25 relative pointer-events-auto select-none font-sans text-[var(--color-brand-marron-oscuro)]">
      
      {/* Editorial Header */}
      <div className="mb-20 grid grid-cols-1 md:grid-cols-12 gap-8 items-end border-b border-[var(--color-brand-marron-claro)]/10 pb-12">
        <div className="md:col-span-8 text-left">
          <span className="text-[10px] md:text-[11px] font-mono tracking-[0.35em] text-[var(--color-brand-bordo)] uppercase font-bold">
            PROCESO CREATIVO & INTERSECCIÓN DIGITAL
          </span>
          <h3 className="font-brand text-4xl sm:text-5xl uppercase tracking-wider text-[var(--color-brand-marron-oscuro)] mt-2 mb-4">
            Bitácora de Datos
          </h3>
          <p className="text-sm font-sans tracking-wide leading-relaxed text-[var(--color-brand-marron-oscuro)]/80 max-w-2xl text-left">
            Phygital materializa la inmaterialidad de la inteligencia artificial. A través de la dirección de arte real en un bosque analógico, se crea una confrontación simbólica entre la simulación algorítmica y la liberación humana.
          </p>
        </div>

        {/* INTERACTIVE TELEMETRY SCREEN */}
        <div className="md:col-span-4 w-full bg-white/40 border border-[var(--color-brand-marron-claro)]/25 rounded-xs p-4 font-mono text-[9px] text-[var(--color-brand-marron-oscuro)] shadow-sm flex flex-col justify-between min-h-[120px] text-left">
          <div className="flex justify-between items-center border-b border-[var(--color-brand-marron-claro)]/20 pb-1.5 mb-2">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-bordo)] animate-pulse" />
              DATALOGGER.SYS
            </span>
            <span className="text-[8px] opacity-70">COORD: 34-S / 59-W</span>
          </div>
          <div className="flex-1 space-y-1 opacity-90 overflow-hidden font-mono">
            {terminalLogs.map((log, i) => (
              <div key={i} className="truncate select-none">
                <span className="text-[var(--color-brand-bordo)]/50 mr-1">&gt;</span> {log}
              </div>
            ))}
          </div>
          <div className="border-t border-[var(--color-brand-marron-claro)]/20 pt-1.5 mt-2 flex justify-between text-[8px] font-bold">
            <span>TELEMETRY: ACTIVE</span>
            <span className="animate-pulse">{hoveredData}</span>
          </div>
        </div>
      </div>

      {/* Vertical Stack of Editorial Sections */}
      <div className="space-y-32">
        {phygitalCategories.map((cat, idx) => {
          const IconComp = cat.icon;
          const isEven = idx % 2 === 0;

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 55 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              onViewportEnter={() => updateTelemetry(cat.id)}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start py-4"
            >
              {/* Left/Right Narrative Text */}
              <div className={`col-span-12 lg:col-span-4 flex flex-col justify-between ${
                isEven ? 'lg:order-1' : 'lg:order-2'
              }`}>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[32px] sm:text-[40px] font-brand font-light text-[var(--color-brand-bordo)]/30 leading-none">
                      {cat.badge.split(' / ')[0]}
                    </span>
                    <div className="w-8 h-[1px] bg-[var(--color-brand-bordo)]/20" />
                    <span className="text-[9px] font-mono tracking-[0.25em] text-[var(--color-brand-marron-oscuro)]/60 uppercase">
                      {cat.badge.split(' / ')[1]}
                    </span>
                  </div>
                  
                  <h4 className="font-brand text-3xl sm:text-4xl uppercase tracking-wide text-[var(--color-brand-marron-oscuro)] mb-4 flex items-center gap-3 text-left">
                    {cat.title}
                    <IconComp size={22} className="text-[var(--color-brand-bordo)]" />
                  </h4>
                  
                  <span className="text-[10px] font-sans tracking-widest uppercase font-bold text-[var(--color-brand-bordo)] block mb-3 text-left">
                    [ {cat.tag} ]
                  </span>

                  <div className="w-12 h-[1.5px] bg-[var(--color-brand-bordo)]/30 my-4" />
                  
                  <p className="text-base md:text-lg leading-relaxed text-[var(--color-brand-marron-oscuro)]/90 mb-6 font-sans text-left">
                    {cat.summary}
                  </p>

                  <ul className="space-y-4 mt-4 text-left">
                    {cat.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm md:text-base text-[var(--color-brand-marron-oscuro)]/85">
                        <span className="text-[var(--color-brand-bordo)] mt-1.5 font-bold font-mono">■</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-[var(--color-brand-marron-claro)]/15 flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-[var(--color-brand-marron-oscuro)]/50">
                  <span>№02 // PHYGITAL</span>
                  <span>{`[ ${cat.images.length} ARCHIVOS ]`}</span>
                </div>
              </div>

              {/* Alternate Column: Inline Interactive Images */}
              <div className={`col-span-12 lg:col-span-8 min-h-[300px] flex flex-col justify-center w-full ${
                isEven ? 'lg:order-2' : 'lg:order-1'
              }`}>
                
                <div className="w-full flex flex-col gap-4">
                  {inlinePreviews[cat.id] ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full flex flex-col gap-4 relative"
                    >
                      <div className="w-full overflow-hidden border border-[var(--color-brand-marron-claro)]/25 shadow-md rounded-xs bg-black/[0.02] relative group">
                        <img 
                          src={inlinePreviews[cat.id]!} 
                          alt="Preview" 
                          className="w-full h-auto max-h-[60vh] object-contain mx-auto block cursor-zoom-out"
                          onClick={() => setInlinePreviews(prev => ({ ...prev, [cat.id]: null }))}
                        />
                      </div>
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[11px] font-sans text-[var(--color-brand-marron-oscuro)]/90 font-medium italic">
                          {cat.images.find(img => img.src === inlinePreviews[cat.id])?.caption || ''}
                        </span>
                        <button
                          onClick={() => setInlinePreviews(prev => ({ ...prev, [cat.id]: null }))}
                          className="text-[10px] font-mono tracking-wider uppercase text-[var(--color-brand-bordo)] hover:underline cursor-pointer flex items-center gap-1.5"
                        >
                          <span>&larr;</span> VOLVER AL REGISTRO
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {cat.images.map((img, idx) => (
                        <motion.div 
                          key={idx} 
                          onClick={() => setInlinePreviews(prev => ({ ...prev, [cat.id]: img.src }))}
                          whileHover={{ scale: 1.03 }}
                          onHoverStart={() => updateTelemetry(cat.id)}
                          className="group cursor-pointer border border-[var(--color-brand-marron-claro)]/20 shadow-xs rounded-xs overflow-hidden bg-black/[0.02] relative"
                        >
                          <div className="aspect-[3/4] w-full overflow-hidden">
                            <img 
                              src={img.src} 
                              alt={img.caption} 
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" 
                              draggable="false"
                              loading="lazy"
                            />
                            {/* Scanning bar effect on hover */}
                            <div className="absolute inset-x-0 h-[1.5px] bg-[var(--color-brand-bordo)] opacity-0 group-hover:opacity-100 top-0 group-hover:top-full transition-all duration-1000 ease-in-out pointer-events-none" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>

      {/* RODAJE SNAPSHOTS */}
      <div className="mt-24 select-none border-t border-[var(--color-brand-marron-claro)]/15 pt-20">
        <div className="mb-10 text-center select-none">
          <span className="text-[10px] md:text-[11px] font-mono tracking-[0.25em] text-[var(--color-brand-marron-oscuro)]/60 uppercase">
            [ REGISTRO ANALÓGICO // RODAJE EN LOCACIÓN ]
          </span>
          <h4 className="font-brand text-2xl uppercase tracking-wider text-[var(--color-brand-marron-oscuro)] mt-1">
            Capturas de Producción
          </h4>
          <p className="text-[10px] font-mono tracking-widest text-[var(--color-brand-marron-oscuro)]/50 uppercase mt-1">
            [ HAZ CLIC PARA PREVISUALIZAR IMAGEN COMPLETA ]
          </p>
        </div>

        {inlinePreviews['capturas'] ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full flex flex-col gap-4 relative max-w-4xl mx-auto"
          >
            <div className="w-full overflow-hidden border border-[var(--color-brand-marron-claro)]/25 shadow-md rounded-xs bg-black/[0.02] relative group">
              <img 
                src={inlinePreviews['capturas']!} 
                alt="Preview" 
                className="w-full h-auto max-h-[70vh] object-contain mx-auto block cursor-zoom-out"
                onClick={() => setInlinePreviews(prev => ({ ...prev, capturas: null }))}
              />
            </div>
            <div className="flex justify-between items-center px-1 font-mono">
              <span className="text-[11px] font-sans text-[var(--color-brand-marron-oscuro)]/90 font-medium italic">
                {[
                  { src: "/proyectosAudiovisuales/PHYGITAL/Backstage/Locacion/locacion1.webp", caption: "Búsqueda de claros y sombras" },
                  { src: "/proyectosAudiovisuales/PHYGITAL/Backstage/Vestuario/vestuario1.webp", caption: "Detalle de sensor óptico" },
                  { src: "/proyectosAudiovisuales/PHYGITAL/Backstage/Inspo Explorador e IA/inspoExplorador2.jpg", caption: "Calibración de goggles" },
                  { src: "/proyectosAudiovisuales/PHYGITAL/Backstage/Vestuario/vestuario4.webp", caption: "Silueta completa del explorador" },
                  { src: "/proyectosAudiovisuales/PHYGITAL/Backstage/Locacion/locacion3.webp", caption: "Dureza del entorno natural" }
                ].find(img => img.src === inlinePreviews['capturas'])?.caption || ''}
              </span>
              <button
                onClick={() => setInlinePreviews(prev => ({ ...prev, capturas: null }))}
                className="text-[10px] font-mono tracking-wider uppercase text-[var(--color-brand-bordo)] hover:underline cursor-pointer flex items-center gap-1.5"
              >
                <span>&larr;</span> VOLVER AL REGISTRO
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full mt-4">
            {[
              { src: "/proyectosAudiovisuales/PHYGITAL/Backstage/Locacion/locacion1.webp", caption: "Búsqueda de claros y sombras" },
              { src: "/proyectosAudiovisuales/PHYGITAL/Backstage/Vestuario/vestuario1.webp", caption: "Detalle de sensor óptico" },
              { src: "/proyectosAudiovisuales/PHYGITAL/Backstage/Inspo Explorador e IA/inspoExplorador2.jpg", caption: "Calibración de goggles" },
              { src: "/proyectosAudiovisuales/PHYGITAL/Backstage/Vestuario/vestuario4.webp", caption: "Silueta completa del explorador" },
              { src: "/proyectosAudiovisuales/PHYGITAL/Backstage/Locacion/locacion3.webp", caption: "Dureza del entorno natural" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                onClick={() => setInlinePreviews(prev => ({ ...prev, capturas: item.src }))}
                className={`bg-white/40 backdrop-blur-xs p-4 rounded-xs border border-[var(--color-brand-marron-claro)]/25 shadow-xs cursor-pointer group flex flex-col gap-3 relative pointer-events-auto ${idx === 3 || idx === 4 ? 'sm:col-span-1 lg:col-span-1' : ''}`}
              >
                <div className="w-full aspect-[4/3] bg-black/5 overflow-hidden rounded-xs relative">
                  <img 
                    src={item.src} 
                    alt={item.caption} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" 
                    draggable="false"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/[0.02] group-hover:bg-transparent transition-colors pointer-events-none" />
                </div>
                <div className="flex flex-col text-left font-mono">
                  <span className="text-[8px] tracking-widest text-[var(--color-brand-bordo)] uppercase font-bold">
                    DATA // SNAP №0{idx + 1}
                  </span>
                  <span className="text-[11px] font-sans italic text-[var(--color-brand-marron-oscuro)]/90 mt-1 font-light leading-snug">
                    {item.caption}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
