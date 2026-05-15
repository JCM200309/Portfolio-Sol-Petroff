import Hero from './components/Hero'
import Projects from './components/Projects'
import About from './components/About'
import Contact from './components/Contact'

function App() {
  return (
    <div className="w-full min-h-screen text-[var(--color-brand-marron-oscuro)] font-sans bg-[var(--color-brand-crema)] selection:bg-[var(--color-brand-bordo)] selection:text-[var(--color-brand-crema)]">
      <main className="w-full">
        <Hero />
        <Projects />
        <About />
        <Contact />
      </main>
    </div>
  )
}

export default App
