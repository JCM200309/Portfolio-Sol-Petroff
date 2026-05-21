import Hero from './components/Hero'
import Productions from './components/Productions'
import Projects from './components/Projects'
import About from './components/About'
import Contact from './components/Contact'
import SplashCursor from './components/ui/SplashCursor'
import Whiteboard from './components/Whiteboard'
import StaggeredMenu from './components/ui/StaggeredMenu'

function App() {
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
      <StaggeredMenu 
        position="right"
        isFixed={true}
        logoUrl=""
        colors={['var(--color-brand-bordo)', 'var(--color-brand-marron-claro)', '#ebdccb']}
        accentColor="var(--color-brand-bordo)"
        menuButtonColor="var(--color-brand-crema)"
        openMenuButtonColor="var(--color-brand-crema)"
        items={[
          { label: 'Universo', ariaLabel: 'Universo', link: '#universo' },
          { label: 'Movimiento', ariaLabel: 'Movimiento', link: '#movimiento' },
          { label: 'Escena', ariaLabel: 'Escena', link: '#escena' },
          { label: 'Narrativa', ariaLabel: 'Narrativa', link: '#narrativa' },
          { label: 'Conoceme', ariaLabel: 'Conoceme', link: '#conoceme' },
          { label: 'Conectemos', ariaLabel: 'Conectemos', link: '#conectemos' }
        ]}
        socialItems={[
          { label: 'Instagram', link: '#' },
          { label: 'TikTok', link: '#' }
        ]}
      />
      <main className="w-full h-full">
        <div className="snap-start h-screen">
          <Hero />
        </div>
        <div className="snap-start h-screen">
          <Projects />
        </div>
        <div className="snap-start h-screen">
          <Productions />
        </div>
        <div className="snap-start h-screen">
          <Whiteboard />
        </div>
        
        <div className="snap-start h-screen">
          <About />
        </div>
        <div className="snap-start h-screen">
          <Contact />
        </div>
      </main>
    </div>
  )
}

export default App
