import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { X, ArrowLeft, ArrowUpRight, Clock, Beaker, Sparkles, BookOpen } from 'lucide-react'

// --- HELPER COMPONENT: 3D Interactive Hover Tilt Container ---
interface TiltContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function TiltContainer({ children, className = "" }: TiltContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const springConfig = { damping: 25, stiffness: 180, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [0, 1], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-8, 8]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width;
    const relativeY = (e.clientY - rect.top) / rect.height;
    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
      className={`relative ${className}`}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function FerranAdriaExperience() {
  const [activeHour, setActiveHour] = useState<number>(6);
  const [activeConcept, setActiveConcept] = useState<number>(0);
  const [activeEnunciado, setActiveEnunciado] = useState<number | null>(null);
  
  const handleGoBack = () => {
    window.location.hash = '#narrativa';
  };

  // Clock plate data corresponding to PDF findings
  const clockNodes = [
    {
      hour: 12,
      title: "MUTA [00:00:01] & [00:00:02]",
      concept: "El tiempo como agente del cambio material",
      description: "Propuestas de recipientes y golosinas experimentales donde el tiempo es el ingrediente principal, guiando al comensal a presenciar el nacimiento y la mutación de la materia en su recorrido visual y sensorial.",
      angle: 0
    },
    {
      hour: 2,
      title: "El plato de las especias",
      concept: "El tiempo como elemento ordenador de la experiencia",
      description: "Una disposición radial de especias y un hilo de azafrán que funciona como aguja horaria. El plato deja de ser estático: se convierte en un reloj gustativo que pauta el orden, la velocidad y la pausa de los sabores.",
      angle: 60
    },
    {
      hour: 4,
      title: "Conceptos Clave",
      concept: "Alquimia y principios científico-técnicos",
      description: "La gastronomía entendida como una forma de conocimiento. La técnica se alía con la ciencia y la filosofía para deconstruir alimentos tradicionales y presentarlos en formatos disruptivos e inesperados.",
      angle: 120
    },
    {
      hour: 6,
      title: "Gastronomía Tecnoemocional",
      concept: "El menú como performance en vivo",
      description: "Cada servicio en elBulli concebido como una obra efímera e irrepetible. El comensal abandona el rol de espectador pasivo para convertirse en partícipe directo, aportando su percepción y reacción emocional.",
      angle: 180
    },
    {
      hour: 8,
      title: "Enunciados Culinarios",
      concept: "La deconstrucción y el plato como obra de arte",
      description: "Separar los componentes de una receta clásica para reorganizarlos de manera innovadora, transformando materias primas comunes en vivencias sensoriales irrepetibles a través de la precisión científica.",
      angle: 240
    },
    {
      hour: 10,
      title: "Partido Morfológico",
      concept: "Pistacho-LYO y la transformación material",
      description: "El estudio de texturas rígidas, gelatinosas y porosas. Uso de colores como el verde aplicados en distintos niveles de saturación y transparencias que revelan los elementos encapsulados en su interior.",
      angle: 300
    }
  ];

  const currentClockData = clockNodes.find(node => node.hour === activeHour) || clockNodes[3];

  const conceptosClave = [
    {
      title: "Experiencia Sensorial",
      desc: "Convierte la experiencia sensorial de la comida en el centro absoluto de todo el proceso creativo y perceptivo."
    },
    {
      title: "Cocina de Vanguardia",
      desc: "Desafía qué significa cocinar, qué significa comer y qué significa experimentar, llevando la gastronomía al plano del arte."
    },
    {
      title: "Alquimia y Ciencia",
      desc: "Aplicación de principios científico-técnicos (nitrógeno líquido, esferificaciones, liofilización) para comprender y mutar procesos químicos."
    },
    {
      title: "Experimentación Constante",
      desc: "Creación de un laboratorio de ideas (elBulliTaller) donde el equipo trabaja como investigadores y diseñadores, no como cocineros tradicionales."
    }
  ];

  const enunciados = [
    { id: 1, name: "Experimentación sensorial", desc: "El estímulo de los sentidos como eje prioritario del plato." },
    { id: 2, name: "Deconstrucción", desc: "Aislar las partes de una receta clásica y reconfigurarlas conservando su esencia." },
    { id: 3, name: "Técnicas disruptivas", desc: "Herramientas no convencionales que alteran texturas, temperaturas y estados físicos." },
    { id: 4, name: "Vanguardia culinaria", desc: "Investigación y rechazo a las fórmulas preestablecidas o bandas de redundancia." },
    { id: 5, name: "Alquimia comestible", desc: "Procesos químicos y creativos que transforman la materia prima en algo inédito." },
    { id: 6, name: "Plato como obra de arte", desc: "Composiciones visuales, cromáticas y morfológicas pensadas para conmover." },
    { id: 7, name: "Experiencia irrepetible", desc: "La fugacidad y la performance efímera que otorgan un valor sagrado al momento." }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full min-h-screen relative bg-[var(--color-brand-crema)] text-[var(--color-brand-marron-oscuro)] overflow-y-auto overflow-x-hidden selection:bg-[var(--color-brand-bordo)] selection:text-[var(--color-brand-crema)] pb-32 pt-24 pointer-events-auto"
    >
      {/* Noise overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />

      {/* Floating back button */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 flex justify-between items-center relative z-10 select-none">
        
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase opacity-55">
          REPORT PREVIEW // 02
        </span>
      </div>

      {/* BLOCK 1: EDITORIAL HERO & THEME */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-12 gap-8 lg:gap-16 items-center mb-32 relative z-10">
        
        {/* Left Column: Title Block */}
        <div className="col-span-12 lg:col-span-6 flex flex-col justify-center">
          <span className="text-xs font-mono tracking-[0.35em] text-[var(--color-brand-bordo)] uppercase font-semibold mb-4">
            Investigación Narrativa
          </span>
          <h1 className="text-5xl sm:text-7xl xl:text-[5vw] font-brand tracking-tight text-[var(--color-brand-marron-oscuro)] leading-[0.9] mb-8 uppercase">
            Ferrán <br />
            <span className="text-[var(--color-brand-bordo)]">Adriá</span>
          </h1>
          <div className="w-16 h-[1px] bg-[var(--color-brand-bordo)]/30 mb-8" />
          <p className="text-2xl sm:text-3xl font-brand italic text-[var(--color-brand-marron-oscuro)]/90 leading-tight mb-8">
            “Cuando el tiempo es el ingrediente secreto.”
          </p>
          <p className="text-base leading-relaxed text-[var(--color-brand-marron-oscuro)]/80 max-w-xl text-left">
            Este reporte analiza el nuevo marco discursivo de Ferrán Adriá. Su obra desafía qué es cocinar, qué es comer y qué es experimentar, llevando la cocina del terreno funcional al marco del arte, la ciencia y la filosofía. Basado exclusivamente en el análisis de su propuesta culinaria y morfológica.
          </p>
        </div>

        {/* Right Column: Editorial Photo Frame */}
        <div className="col-span-12 lg:col-span-6 flex justify-center">
          <TiltContainer className="w-full max-w-[460px] p-4 bg-white/40 backdrop-blur-md border border-[var(--color-brand-marron-claro)]/20 shadow-[0_30px_70px_rgba(146,94,61,0.06)] rounded-sm">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xs bg-[var(--color-brand-crema)] group">
              <img
                src="/narrativa/ferranAdria/portada.jpg"
                alt="Ferrán Adriá - Portada de Investigación"
                className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out select-none pointer-events-none"
              />
              <div className="absolute inset-0 bg-[var(--color-brand-bordo)]/5 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700" />
              
              {/* Focus crop markers */}
              <span className="absolute top-4 left-4 text-xs font-light text-white/50 select-none pointer-events-none">+</span>
              <span className="absolute top-4 right-4 text-xs font-light text-white/50 select-none pointer-events-none">+</span>
              <span className="absolute bottom-4 left-4 text-xs font-light text-white/50 select-none pointer-events-none">+</span>
              <span className="absolute bottom-4 right-4 text-xs font-light text-white/50 select-none pointer-events-none">+</span>
            </div>
            <div className="mt-4 flex justify-between items-center text-[10px] font-mono tracking-[0.2em] text-[var(--color-brand-marron-oscuro)]/60 uppercase px-1 select-none">
              <span>NARRATIVA ARCHIVE</span>
              <span>№ 02 // F.ADRIA</span>
            </div>
          </TiltContainer>
        </div>
      </div>

      {/* BLOCK 2: INTERACTIVE CLOCK PLATE (EL PLATO DE LAS ESPECIAS) */}
      <div className="w-full py-24 bg-white/30 border-y border-[var(--color-brand-marron-claro)]/20 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Left Column: Saffron Clock Visualizer */}
          <div className="col-span-12 lg:col-span-6 flex flex-col items-center justify-center relative min-h-[420px]">
            <span className="absolute -top-12 text-[10px] font-mono tracking-[0.3em] text-[var(--color-brand-marron-claro)] uppercase select-none">
              [ INTERACTIVE CLOCK DIAL ]
            </span>
            
            {/* The Plate Circle */}
            <div className="relative w-[340px] h-[340px] md:w-[380px] md:h-[380px] rounded-full border border-[var(--color-brand-marron-claro)]/30 flex items-center justify-center bg-white/40 shadow-[inset_0_4px_30px_rgba(146,94,61,0.03),_0_20px_50px_rgba(146,94,61,0.05)]">
              
              {/* Outer clock numbers */}
              <div className="absolute inset-4 rounded-full border border-dashed border-[var(--color-brand-marron-claro)]/15 pointer-events-none" />
              
              {/* Clock Nodes (Hours) */}
              {clockNodes.map((node) => {
                const isSelected = activeHour === node.hour;
                // Calculate position around the circle
                const rad = (node.angle - 90) * (Math.PI / 180);
                const radius = 135; // px
                const x = radius * Math.cos(rad);
                const y = radius * Math.sin(rad);

                return (
                  <motion.button
                    key={node.hour}
                    onClick={() => setActiveHour(node.hour)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ x, y }}
                    className={`absolute w-10 h-10 rounded-full flex items-center justify-center text-xs font-mono border transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? "bg-[var(--color-brand-bordo)] border-[var(--color-brand-bordo)] text-[var(--color-brand-crema)] font-bold shadow-lg"
                        : "bg-[var(--color-brand-crema)]/80 border-[var(--color-brand-marron-claro)]/30 text-[var(--color-brand-marron-oscuro)]/70 hover:border-[var(--color-brand-bordo)]/50"
                    }`}
                  >
                    {node.hour === 12 || node.hour === 10 ? `${node.hour}` : `0${node.hour}`}
                  </motion.button>
                );
              })}

              {/* Central Saffron Needle Hand */}
              <motion.div
                className="absolute w-1.5 bg-gradient-to-t from-[var(--color-brand-bordo)] via-[var(--color-brand-bordo)] to-amber-500 rounded-full origin-bottom pointer-events-none"
                style={{
                  height: "100px",
                  bottom: "50%",
                  left: "calc(50% - 3px)",
                }}
                animate={{
                  rotate: (clockNodes.find(n => n.hour === activeHour)?.angle || 0)
                }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              />

              {/* Center Dot Pin */}
              <div className="w-4 h-4 rounded-full bg-[var(--color-brand-marron-oscuro)] border-2 border-[var(--color-brand-crema)] shadow-md z-10" />

              {/* Inner subtle text label */}
              <div className="absolute text-[8px] tracking-[0.2em] font-mono text-[var(--color-brand-marron-claro)]/40 uppercase mt-28 select-none">
                EL TIEMPO ORDENA
              </div>
            </div>
          </div>

          {/* Right Column: Clock Narrative Display */}
          <div className="col-span-12 lg:col-span-6 select-none">
            <span className="text-xs font-mono tracking-[0.25em] text-[var(--color-brand-marron-claro)] uppercase mb-3 block">
              Tiempo y Gastronomía
            </span>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeHour}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="min-h-[220px] flex flex-col justify-center text-left"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-sm bg-[var(--color-brand-bordo)]/5 border border-[var(--color-brand-bordo)]/25">
                    <Clock size={20} className="text-[var(--color-brand-bordo)]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[var(--color-brand-bordo)] font-bold block">
                      SECCIÓN {activeHour === 12 ? "12:00" : `0${activeHour}:00`}
                    </span>
                    <h3 className="text-2xl font-brand uppercase text-[var(--color-brand-marron-oscuro)]">
                      {currentClockData.title}
                    </h3>
                  </div>
                </div>

                <div className="w-12 h-[1px] bg-[var(--color-brand-marron-claro)]/30 my-4" />
                
                <h4 className="text-sm font-mono tracking-wider font-semibold uppercase text-[var(--color-brand-marron-oscuro)]/70 mb-3">
                  {currentClockData.concept}
                </h4>

                <p className="text-sm md:text-base leading-relaxed text-[var(--color-brand-marron-oscuro)]/80">
                  {currentClockData.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* BLOCK 3: ¿INNOVADOR O REFORMULADOR? (THE QUOTE & LAB DESCRIPTION) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-32 relative z-10">
        <div className="grid grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Left Column: Big Typographic Quote */}
          <div className="col-span-12 lg:col-span-6 flex justify-center text-center lg:text-left">
            <div className="relative max-w-lg select-none">
              <span className="absolute -top-16 -left-6 text-8xl md:text-9xl font-brand text-[var(--color-brand-bordo)]/10 select-none pointer-events-none">
                “
              </span>
              <h2 className="text-3xl sm:text-5xl font-brand italic text-[var(--color-brand-bordo)] leading-tight font-light mb-6">
                No quiero que mi cocina sea solo buena. Quiero que sea una experiencia.
              </h2>
              <cite className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--color-brand-marron-oscuro)]/60 block not-italic">
                — FERRÁN ADRIÁ, ELBULLI
              </cite>
            </div>
          </div>

          {/* Right Column: Conceptual Context */}
          <div className="col-span-12 lg:col-span-6">
            <span className="text-xs font-mono tracking-[0.3em] text-[var(--color-brand-marron-claro)] uppercase mb-3 block">
              Innovación vs Reformulación
            </span>
            <h3 className="text-3xl font-brand uppercase text-[var(--color-brand-marron-oscuro)] mb-6">
              El marco tecnoemocional
            </h3>
            <div className="space-y-6 text-sm md:text-base leading-relaxed text-[var(--color-brand-marron-oscuro)]/80 text-left">
              <p>
                Ferrán Adrià actúa como un <strong>gastronómico reformulador</strong>, operando sobre un nuevo marco discursivo. Su trabajo transforma la gastronomía en una forma de conocimiento sensorial y cultural. No busca repetir fórmulas tradicionales, sino investigar y cuestionar el acto mismo de comer.
              </p>
              <p>
                Su marco es la <strong>gastronomía tecnoemocional</strong>, que combina de forma precisa técnica, emoción, ciencia y narrativa. Cada servicio en elBulli podía considerarse una performance efímera.
              </p>
              <p>
                Para lograr esto, Adrià aplicó el pensamiento de diseño a su estructura organizativa: creó <strong>elBulliTaller</strong>, un laboratorio creativo donde su equipo investigaba durante meses como científicos y diseñadores, rompiendo con el rol tradicional del cocinero.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BLOCK 4: THE 7 ENUNCIADOS (INTERACTIVE GRID) */}
      <div className="w-full py-24 bg-white/30 border-y border-[var(--color-brand-marron-claro)]/20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 select-none">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-xs font-mono tracking-[0.3em] text-[var(--color-brand-marron-claro)] uppercase mb-2">
              Principios de la Deconstrucción
            </span>
            <h3 className="text-3xl md:text-5xl font-brand uppercase text-[var(--color-brand-marron-oscuro)]">
              Enunciados Culinarios
            </h3>
            <div className="w-12 h-[1px] bg-[var(--color-brand-bordo)]/35 my-6" />
            <p className="text-sm md:text-base text-[var(--color-brand-marron-oscuro)]/70 max-w-xl">
              Los pilares metodológicos que transformaron el acto de cocinar en una disciplina conceptual y sensorial. Pasa el cursor por cada enunciado para revelar su sentido.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {enunciados.map((item) => {
              const isActive = activeEnunciado === item.id;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setActiveEnunciado(item.id)}
                  onMouseLeave={() => setActiveEnunciado(null)}
                  className={`p-6 rounded-sm border transition-all duration-500 flex flex-col justify-between h-[180px] shadow-sm relative overflow-hidden cursor-default ${
                    isActive
                      ? "bg-[var(--color-brand-bordo)] border-[var(--color-brand-bordo)] text-[var(--color-brand-crema)] -translate-y-1 shadow-md"
                      : "bg-white/50 border-[var(--color-brand-marron-claro)]/20 text-[var(--color-brand-marron-oscuro)] hover:border-[var(--color-brand-bordo)]/30 hover:shadow-md"
                  }`}
                >
                  <div>
                    <span className={`text-[10px] font-mono tracking-widest font-semibold block mb-3 uppercase ${
                      isActive ? "text-[var(--color-brand-crema)]/60" : "text-[var(--color-brand-marron-claro)]"
                    }`}>
                      № 0{item.id}
                    </span>
                    <h4 className="text-lg font-brand uppercase tracking-wide leading-tight mb-2">
                      {item.name}
                    </h4>
                  </div>
                  
                  <p className={`text-xs leading-relaxed transition-opacity duration-300 ${
                    isActive ? "text-[var(--color-brand-crema)]/90 opacity-100" : "text-[var(--color-brand-marron-oscuro)]/60 opacity-0 group-hover:opacity-100"
                  }`}>
                    {item.desc}
                  </p>

                  {/* Aesthetic corner bracket indicator */}
                  <span className={`absolute bottom-3 right-3 text-[10px] font-light transition-opacity duration-300 ${
                    isActive ? "opacity-30" : "opacity-0"
                  }`}>
                    +
                  </span>
                </div>
              );
            })}

            {/* Final interactive generic card referencing the clock */}
            <div
              onClick={() => setActiveHour(2)}
              className="p-6 rounded-sm border border-dashed border-[var(--color-brand-marron-claro)]/30 bg-transparent text-[var(--color-brand-marron-oscuro)] flex flex-col justify-between h-[180px] hover:border-[var(--color-brand-bordo)]/50 transition-colors duration-300 cursor-pointer group"
            >
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[var(--color-brand-marron-claro)] block mb-3 uppercase">
                  CONCEPTO RECEPTOR
                </span>
                <h4 className="text-lg font-brand uppercase tracking-wide leading-tight group-hover:text-[var(--color-brand-bordo)] transition-colors">
                  El Tiempo
                </h4>
              </div>
              <p className="text-xs leading-relaxed text-[var(--color-brand-marron-oscuro)]/60">
                La variable transversal que rige la transformación material y ordena la velocidad de degustación.
              </p>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--color-brand-bordo)] font-semibold">
                <span>Ver plato del tiempo</span>
                <ArrowUpRight size={12} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BLOCK 5: MUTA LABORATORY (EXPERIMENTAL TUBE FLOW VISUAL) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-32 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-stretch select-none">
          
          {/* MUTA 00:00:01 Card */}
          <div className="flex-1 p-8 rounded-sm bg-white/40 border border-[var(--color-brand-marron-claro)]/25 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-mono tracking-[0.25em] text-[var(--color-brand-marron-claro)] font-bold uppercase">
                  MUTA [00:00:01]
                </span>
                <span className="px-2 py-0.5 text-[8px] font-mono tracking-widest text-amber-900 bg-amber-500/10 rounded-sm">
                  ALQUIMIA LIQUIDA
                </span>
              </div>
              
              <h3 className="text-2xl font-brand uppercase text-[var(--color-brand-marron-oscuro)] mb-4">
                La Botella Experimental
              </h3>
              
              <p className="text-sm leading-relaxed text-[var(--color-brand-marron-oscuro)]/80 text-left mb-8">
                Muta [00:00:01] es una botella experimental reformuladora que fusiona gastronomía, alquimia y ciencia. Compuesta por cápsulas transparentes interconectadas por finos tubos, permite presenciar en un recorrido ascendente el destilado temporal y la mutación cromática de las sustancias. El recipiente se convierte en una narrativa del tiempo.
              </p>
            </div>

            {/* Interactive SVG Tube animation simulating liquid flow */}
            <div className="w-full h-32 relative flex items-center justify-center bg-[var(--color-brand-crema)]/60 rounded-xs border border-[var(--color-brand-marron-claro)]/15 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 400 100">
                {/* 3 capsules */}
                <circle cx="100" cy="50" r="16" fill="none" stroke="#925e3d" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="200" cy="50" r="16" fill="none" stroke="#925e3d" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="300" cy="50" r="16" fill="none" stroke="#925e3d" strokeWidth="1.5" strokeDasharray="3 3" />
                
                {/* Connector tubes */}
                <path d="M 116 50 L 184 50" fill="none" stroke="#be9e89" strokeWidth="1.5" />
                <path d="M 216 50 L 284 50" fill="none" stroke="#be9e89" strokeWidth="1.5" />

                {/* Flowing liquid dots */}
                <motion.circle
                  cx="0"
                  cy="50"
                  r="4"
                  fill="#840624"
                  animate={{
                    cx: [100, 200, 300],
                    r: [4, 7, 4],
                    fill: ["#840624", "#be9e89", "#925e3d"]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut"
                  }}
                />
                
                <motion.circle
                  cx="0"
                  cy="50"
                  r="5"
                  fill="#925e3d"
                  animate={{
                    cx: [200, 300, 100],
                    r: [5, 4, 6],
                    fill: ["#925e3d", "#840624", "#be9e89"]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    delay: 1.3,
                    ease: "easeInOut"
                  }}
                />
              </svg>
              <div className="absolute bottom-2 right-2 text-[8px] font-mono tracking-widest text-[var(--color-brand-marron-claro)]">
                ASCENDING FLOW ACTIVE
              </div>
            </div>
          </div>

          {/* MUTA 00:00:02 Card */}
          <div className="flex-1 p-8 rounded-sm bg-white/40 border border-[var(--color-brand-marron-claro)]/25 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-mono tracking-[0.25em] text-[var(--color-brand-marron-claro)] font-bold uppercase">
                  MUTA [00:00:02]
                </span>
                <span className="px-2 py-0.5 text-[8px] font-mono tracking-widest text-red-900 bg-red-500/10 rounded-sm">
                  REFORMULACIÓN SOLIDA
                </span>
              </div>
              
              <h3 className="text-2xl font-brand uppercase text-[var(--color-brand-marron-oscuro)] mb-4">
                Las Golosinas Comestibles
              </h3>
              
              <p className="text-sm leading-relaxed text-[var(--color-brand-marron-oscuro)]/80 text-left mb-8">
                Golosinas que no se compran confeccionadas, sino que se presencian nacer. En una cápsula generadora, una red de tubos traslúcidos permite al comensal observar cómo los ingredientes viajan y reaccionan progresivamente. El contenido muta en textura, sabor y temperatura a través de la espera.
              </p>
            </div>

            {/* Interactive SVG Candy solidification simulation */}
            <div className="w-full h-32 relative flex items-center justify-center bg-[var(--color-brand-crema)]/60 rounded-xs border border-[var(--color-brand-marron-claro)]/15 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 400 100">
                {/* Glass Chamber */}
                <rect x="120" y="20" width="160" height="60" rx="4" fill="none" stroke="#be9e89" strokeWidth="1.5" />
                <line x1="80" y1="50" x2="120" y2="50" stroke="#be9e89" strokeWidth="1.5" />
                <line x1="280" y1="50" x2="320" y2="50" stroke="#be9e89" strokeWidth="1.5" />

                {/* Candy element growing/solidifying */}
                <motion.rect
                  x="180"
                  y="40"
                  width="40"
                  height="20"
                  rx="10"
                  fill="#be9e89"
                  animate={{
                    scale: [0.6, 1.1, 0.6],
                    rx: [10, 2, 10],
                    fill: ["#be9e89", "#840624", "#be9e89"]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 5,
                    ease: "easeInOut"
                  }}
                  className="origin-center"
                />
              </svg>
              <div className="absolute bottom-2 right-2 text-[8px] font-mono tracking-widest text-[var(--color-brand-marron-claro)]">
                MUTATION & REACTION ACTIVE
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BLOCK 6: CONCLUDING QUOTE & CTA READ FULL REPORT */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center relative z-10 flex flex-col items-center gap-12">
        <div className="w-16 h-[1px] bg-[var(--color-brand-marron-claro)]/40" />
        
        <blockquote className="text-2xl sm:text-4xl font-brand italic text-[var(--color-brand-marron-oscuro)] leading-relaxed select-none">
          “Hay cosas que no se pueden hacer deprisa. El sabor necesita pausa.”
        </blockquote>
        
        <cite className="text-xs font-mono tracking-[0.25em] uppercase text-[var(--color-brand-bordo)] block not-italic -mt-4 font-bold select-none">
          — FERRÁN ADRIÁ
        </cite>

        {/* Read Full Report CTA Button */}
        <motion.a
          href="/narrativa/ferranAdria/reporte.pdf"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-8 px-10 py-5 bg-[var(--color-brand-bordo)] text-[var(--color-brand-crema)] text-xs font-mono tracking-[0.3em] uppercase rounded-sm shadow-[0_15px_40px_rgba(132,6,36,0.25)] hover:shadow-[0_20px_50px_rgba(132,6,36,0.35)] transition-all duration-300 flex items-center gap-4 cursor-pointer border border-white/10"
        >
          <BookOpen size={16} />
          <span>Leer reporte completo</span>
          <ArrowUpRight size={16} />
        </motion.a>
      </div>
    </motion.div>
  );
}
