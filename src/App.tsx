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
  const isLightNavbar = isSubPage && currentHash !== '#escena';

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
      <Navbar isLight={isLightNavbar} />

      {isSubPage ? (
        <div className="w-full h-full relative pointer-events-auto bg-[var(--color-brand-crema)]">
          <div className="w-full h-full">
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
