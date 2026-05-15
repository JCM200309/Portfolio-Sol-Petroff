import Hero from './components/Hero'
import Projects from './components/Projects'
import About from './components/About'
import Contact from './components/Contact'

function App() {
  return (
    <div className="w-full h-screen overflow-y-auto snap-y snap-mandatory text-[var(--color-brand-marron-oscuro)] font-sans bg-[var(--color-brand-crema)] selection:bg-[var(--color-brand-bordo)] selection:text-[var(--color-brand-crema)] scroll-smooth">
      <main className="w-full h-full">
        <div className="snap-start h-screen">
          <Hero />
        </div>
        <div className="snap-start h-screen">
          <Projects />
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
