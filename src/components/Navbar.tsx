import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Menu, X } from 'lucide-react'

interface SubItem {
  label: string;
  link: string;
}

interface NavItem {
  label: string;
  link: string;
  subItems?: SubItem[];
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Track window size for responsive logic
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track scrolling inside the snapping container
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && typeof target.scrollTop === 'number') {
        setScrolled(target.scrollTop > 50);
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  const navItems: NavItem[] = [
    { label: 'Universo', link: '#universo' },
    {
      label: 'Proyectos',
      link: '#movimiento',
      subItems: [
        { label: 'Movimiento', link: '#movimiento' },
        { label: 'Escena', link: '#escena' },
        { label: 'Narrativa', link: '#narrativa' }
      ]
    },
    { label: 'Conoceme', link: '#conoceme' },
    { label: 'Conectemos', link: '#conectemos' }
  ];

  // CSS Filter to convert black/dark logo image into the exact CSS cream color #f6edde
  const logoCreamFilter = 'brightness(0) invert(98%) sepia(5%) saturate(795%) hue-rotate(323deg) brightness(101%) contrast(93%)';

  // Animation variants for desktop links collapsing/expanding
  const linksContainerVariants = {
    expanded: {
      width: 'auto',
      opacity: 1,
      x: 0,
      transition: {
        width: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.35, ease: 'easeOut' },
        x: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
      }
    },
    collapsed: {
      width: 0,
      opacity: 0,
      x: 40,
      transition: {
        width: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.25, ease: 'easeIn' },
        x: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
      }
    }
  };

  // Animation variants for the hamburger button scaling/sliding in
  const hamburgerButtonVariants = {
    hidden: {
      scale: 0.4,
      opacity: 0,
      width: 0,
      marginLeft: 0,
      transition: {
        width: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
        scale: { duration: 0.3, ease: 'easeIn' },
        opacity: { duration: 0.2, ease: 'easeIn' }
      }
    },
    visible: {
      scale: 1,
      opacity: 1,
      width: 'auto',
      marginLeft: 16,
      transition: {
        width: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        scale: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.35, ease: 'easeOut', delay: 0.05 }
      }
    }
  };

  return (
    <>
      <header
        className={`w-full fixed top-0 left-0 z-40 flex items-center justify-between px-6 md:px-16 transition-all duration-500 ease-in-out select-none ${
          scrolled
            ? 'bg-[var(--color-brand-bordo)]/90 backdrop-blur-md border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.15)] py-4'
            : 'bg-transparent border-b border-transparent py-7'
        }`}
      >
        {/* Brand Logo (Left Margin) */}
        <a
          href="#universo"
          onClick={() => setMobileOpen(false)}
          className="flex items-center select-none cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
          aria-label="Volver al inicio"
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="block w-auto object-contain transition-all duration-500"
            style={{
              filter: logoCreamFilter,
              height: scrolled 
                ? (isMobile ? '36px' : '44px') // Scrolled sizes
                : (isMobile ? '44px' : '58px') // Transparent/Hero sizes (heavy/larger presence)
            }}
            draggable={false}
            width={160}
            height={44}
          />
        </a>

        {/* Navigation Group (Right Margin) */}
        <div className="flex items-center z-50">
          {/* Desktop Navigation links (collapses on scroll) */}
          <motion.nav
            variants={linksContainerVariants}
            initial="expanded"
            animate={!isMobile && scrolled ? 'collapsed' : 'expanded'}
            className="hidden md:flex items-center gap-4 lg:gap-6 overflow-hidden whitespace-nowrap"
          >
            {navItems.map((item, idx) => {
              const isContact = item.link === '#conectemos';
              const hasDropdown = item.subItems !== undefined;

              if (hasDropdown) {
                return (
                  <div
                    key={item.label + idx}
                    className="relative py-2"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <button
                      className="group text-[11px] font-sans tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer flex items-center gap-1 py-1.5 px-3 rounded-full hover:bg-white/5 active:scale-95 text-[var(--color-brand-crema)]/85 hover:text-white"
                      aria-expanded={dropdownOpen}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-300 ${
                          dropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className={`absolute top-full right-0 mt-2 w-48 rounded-sm shadow-xl border border-white/10 overflow-hidden ${
                            scrolled
                              ? 'bg-[var(--color-brand-bordo)] text-[var(--color-brand-crema)]'
                              : 'bg-black/90 backdrop-blur-md text-[var(--color-brand-crema)]'
                          }`}
                        >
                          <div className="py-2" role="menu" aria-orientation="vertical">
                            {item.subItems?.map((sub, sIdx) => (
                              <a
                                key={sub.label + sIdx}
                                href={sub.link}
                                onClick={() => setDropdownOpen(false)}
                                className="block px-5 py-2.5 text-[10px] font-sans tracking-[0.15em] uppercase transition-all duration-200 cursor-pointer hover:bg-white/10 hover:text-white"
                                role="menuitem"
                              >
                                {sub.label}
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <a
                  key={item.label + idx}
                  href={item.link}
                  className={
                    isContact
                      ? 'text-[11px] font-sans tracking-[0.2em] uppercase text-[var(--color-brand-bordo)] bg-[var(--color-brand-crema)] hover:bg-white hover:scale-[1.03] active:scale-97 px-5 py-2 rounded-full transition-all duration-300 cursor-pointer shadow-md'
                      : 'group text-[11px] font-sans tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer relative py-2 px-3 rounded-full hover:bg-white/5 active:scale-95 text-[var(--color-brand-crema)]/85 hover:text-white'
                  }
                >
                  {item.label}
                  {!isContact && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--color-brand-crema)] rounded-full opacity-0 scale-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100" />
                  )}
                </a>
              );
            })}
          </motion.nav>

          {/* Hamburger Trigger button (displays on Mobile always, on Desktop on Scroll) */}
          <motion.button
            variants={hamburgerButtonVariants}
            initial={isMobile ? 'visible' : 'hidden'}
            animate={isMobile || scrolled ? 'visible' : 'hidden'}
            onClick={() => setMobileOpen(true)}
            className="flex items-center justify-center p-2.5 rounded-full text-[var(--color-brand-crema)] hover:bg-white/5 transition-colors cursor-pointer overflow-hidden whitespace-nowrap"
            aria-label="Abrir menú de navegación"
          >
            <Menu size={24} />
          </motion.button>
        </div>
      </header>

      {/* Mobile & Scrolled Drawer Navigation Panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 pointer-events-auto"
            />

            {/* Slide-out Drawer */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[380px] bg-[var(--color-brand-crema)] shadow-2xl z-50 p-6 flex flex-col justify-between pointer-events-auto"
            >
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between border-b border-[var(--color-brand-marron-claro)]/10 pb-4">
                <a
                  href="#universo"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center"
                >
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="block h-8 w-auto object-contain filter invert brightness-0"
                    draggable={false}
                    width={100}
                    height={22}
                  />
                </a>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-full text-[var(--color-brand-marron-oscuro)] hover:bg-[var(--color-brand-bordo)]/5 transition-colors cursor-pointer"
                  aria-label="Cerrar menú de navegación"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Drawer Links List */}
              <nav className="flex-grow flex flex-col justify-center py-8">
                <ul className="list-none m-0 p-0 flex flex-col gap-6" role="list">
                  {navItems.map((item, idx) => {
                    const isContact = item.link === '#conectemos';
                    const hasDropdown = item.subItems !== undefined;

                    if (hasDropdown) {
                      return (
                        <li key={item.label + idx} className="flex flex-col gap-2">
                          <button
                            onClick={() => setMobileProjectsOpen(!mobileProjectsOpen)}
                            className="text-left w-full text-2xl font-brand text-[var(--color-brand-marron-oscuro)] hover:text-[var(--color-brand-bordo)] transition-colors flex items-center justify-between cursor-pointer"
                            aria-expanded={mobileProjectsOpen}
                          >
                            <span>{item.label}</span>
                            <ChevronDown
                              size={20}
                              className={`transition-transform duration-300 text-[var(--color-brand-marron-claro)] ${
                                mobileProjectsOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {/* Smooth expandable list for mobile */}
                          <motion.ul
                            initial={false}
                            animate={mobileProjectsOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                            className="list-none pl-4 flex flex-col gap-3 overflow-hidden"
                          >
                            {item.subItems?.map((sub, sIdx) => (
                              <li key={sub.label + sIdx} className="pt-2">
                                <a
                                  href={sub.link}
                                  onClick={() => setMobileOpen(false)}
                                  className="text-base font-sans tracking-wider uppercase text-[var(--color-brand-marron-oscuro)]/70 hover:text-[var(--color-brand-bordo)] transition-colors cursor-pointer"
                                >
                                  {sub.label}
                                </a>
                              </li>
                            ))}
                          </motion.ul>
                        </li>
                      );
                    }

                    return (
                      <li key={item.label + idx}>
                        <a
                          href={item.link}
                          onClick={() => setMobileOpen(false)}
                          className={
                            isContact
                              ? 'inline-block text-center w-full text-sm font-sans tracking-widest uppercase text-[var(--color-brand-crema)] bg-[var(--color-brand-bordo)] hover:bg-[var(--color-brand-bordo)]/90 px-6 py-3 rounded-full transition-all duration-300 cursor-pointer shadow-md'
                              : 'text-2xl font-brand text-[var(--color-brand-marron-oscuro)] hover:text-[var(--color-brand-bordo)] transition-colors cursor-pointer'
                          }
                        >
                          {item.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Drawer Footer (Socials) */}
              <div className="border-t border-[var(--color-brand-marron-claro)]/10 pt-4 flex flex-col gap-2">
                <span className="text-[9px] font-sans tracking-widest uppercase text-[var(--color-brand-marron-claro)]">
                  Sociales
                </span>
                <div className="flex gap-4">
                  <a
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-sans tracking-wider uppercase text-[var(--color-brand-marron-oscuro)] hover:text-[var(--color-brand-bordo)] transition-colors"
                  >
                    Instagram
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-sans tracking-wider uppercase text-[var(--color-brand-marron-oscuro)] hover:text-[var(--color-brand-bordo)] transition-colors"
                  >
                    TikTok
                  </a>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
