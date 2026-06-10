import { useState, useEffect, lazy, Suspense } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import SplashCursor from './components/ui/SplashCursor'
import Navbar from './components/Navbar'
import ProjectsSelector from './components/ProjectsSelector'

const Productions = lazy(() => import('./components/Productions'))
const Projects = lazy(() => import('./components/Projects'))
const Whiteboard = lazy(() => import('./components/Whiteboard'))
const FerranAdriaExperience = lazy(() => import('./components/FerranAdriaExperience'))
const ElPlumeroExperience = lazy(() => import('./components/ElPlumeroExperience'))
const PreAdolescentesExperience = lazy(() => import('./components/PreAdolescentesExperience'))

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

  const isSubPage = currentHash.startsWith('#movimiento') || ['#narrativa', '#narrativa-ferran-adria', '#narrativa-el-plumero', '#narrativa-pre-adolescentes'].includes(currentHash) || currentHash.startsWith('#escena');
  const isLightNavbar = isSubPage && currentHash !== '#escena';

  return (
    <div className="w-full h-screen overflow-y-auto md:snap-y md:snap-mandatory text-[var(--color-brand-marron-oscuro)] font-sans bg-[var(--color-brand-crema)] selection:bg-[var(--color-brand-bordo)] selection:text-[var(--color-brand-crema)] scroll-smooth">
      <SplashCursor 
        DENSITY_DISSIPATION={3.0}
        VELOCITY_DISSIPATION={2.0} 
        PRESSURE={0.1}
        SPLAT_RADIUS={0.13}
        SPLAT_FORCE={4500}
        CURL={3.0}
        COLOR="#840624"
        RAINBOW_MODE={false}
      />
      <Navbar isLight={isLightNavbar} currentHash={currentHash} />

      <Suspense fallback={
        <div className="w-full h-screen flex items-center justify-center bg-[var(--color-brand-crema)]">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--color-brand-bordo)] border-t-transparent animate-spin" />
        </div>
      }>
        {isSubPage ? (
          <div className="w-full h-full relative pointer-events-auto bg-[var(--color-brand-crema)]">
            <div className="w-full h-full">
              {currentHash.startsWith('#movimiento') && <Projects />}
              {currentHash.startsWith('#escena') && (
                <Productions 
                  initialProject={currentHash.startsWith('#escena-') ? currentHash.replace('#escena-', '') : null} 
                />
              )}
              {currentHash === '#narrativa' && <Whiteboard />}
              {currentHash === '#narrativa-ferran-adria' && <FerranAdriaExperience />}
              {currentHash === '#narrativa-el-plumero' && <ElPlumeroExperience />}
              {currentHash === '#narrativa-pre-adolescentes' && <PreAdolescentesExperience />}
            </div>
          </div>
        ) : (
          <main className="w-full h-full">
            <div className="md:snap-start h-[100dvh] md:h-screen">
              <Hero />
            </div>
            <div className="md:snap-start min-h-screen md:h-screen">
              <ProjectsSelector />
            </div>
            <div className="md:snap-start min-h-screen md:h-screen">
              <About />
            </div>
          </main>
        )}
      </Suspense>
    </div>
  )
}

export default App
