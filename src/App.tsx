import { useState, useEffect } from 'react'
import Hero from './components/Hero'
import Productions from './components/Productions'
import Projects from './components/Projects'
import About from './components/About'
import Contact from './components/Contact'
import SplashCursor from './components/ui/SplashCursor'
import Whiteboard from './components/Whiteboard'
import Navbar from './components/Navbar'
import ProjectsSelector from './components/ProjectsSelector'

function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash)

  // Listen to hash changes for sub-page routing
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash)
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const isSubPage = ['#movimiento', '#escena', '#narrativa'].includes(currentHash);

  return (
    <div className="w-full h-screen overflow-y-auto snap-y snap-mandatory text-[var(--color-brand-marron-oscuro)] font-sans bg-[var(--color-brand-crema)] selection:bg-[var(--color-brand-bordo)] selection:text-[var(--color-brand-crema)] scroll-smooth">
      <SplashCursor 
        DENSITY_DISSIPATION={3.5}
        VELOCITY_DISSIPATION={2.0}
        PRESSURE={0.1}
        SPLAT_RADIUS={0.07}
        SPLAT_FORCE={6000}
        CURL={3.0}
        COLOR="#840624"
        RAINBOW_MODE={false}
      />
      <Navbar />

      {isSubPage ? (
        <div className="w-full h-full relative pointer-events-auto bg-[var(--color-brand-crema)]">
          {/* Back Button */}
          <a 
            href="#proyectos"
            className="fixed top-24 left-6 md:left-12 z-50 flex items-center gap-2 text-[10px] font-sans tracking-[0.2em] uppercase text-[var(--color-brand-crema)] bg-[var(--color-brand-bordo)] hover:bg-[var(--color-brand-bordo)]/90 hover:scale-[1.03] active:scale-97 px-5 py-2.5 rounded-full transition-all duration-300 shadow-md cursor-pointer"
          >
            ← Volver
          </a>
          <div className="w-full h-full pt-16">
            {currentHash === '#movimiento' && <Projects />}
            {currentHash === '#escena' && <Productions />}
            {currentHash === '#narrativa' && <Whiteboard />}
          </div>
        </div>
      ) : (
        <main className="w-full h-full">
          <div className="snap-start h-screen">
            <Hero />
          </div>
          <div className="snap-start h-screen">
            <ProjectsSelector />
          </div>
          <div className="snap-start h-screen">
            <About />
          </div>
          <div className="snap-start h-screen">
            <Contact />
          </div>
        </main>
      )}
    </div>
  )
}

export default App
