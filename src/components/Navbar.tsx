import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Menu, X, ArrowUpRight } from 'lucide-react'

interface SubItem {
  label: string;
  link: string;
}

interface NavItem {
  label: string;
  link: string;
  subItems?: SubItem[];
}

export default function Navbar({ isLight = false, currentHash = '' }: { isLight?: boolean; currentHash?: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const isLightNavbar = isLight || scrolled;
  const showBordoLogo = isLightNavbar && (!currentHash.startsWith('#escena-') || (isMobile && scrolled));
  const isLightHamburger = isLightNavbar && !(currentHash.startsWith('#escena-') && !scrolled);

  // Determine dynamic target for back button logic on the logo
  let logoHref = '#universo';
  if (currentHash) {
    if (currentHash.startsWith('#escena-')) {
      logoHref = '#escena';
    } else if (currentHash.startsWith('#narrativa-')) {
      logoHref = '#narrativa';
    } else if (currentHash === '#escena' || currentHash === '#movimiento' || currentHash === '#narrativa') {
      logoHref = '#proyectos';
    }
  }

  // Track window size for responsive logic
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileOpen(false);
      }
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
        { label: 'Audiovisuales', link: '#movimiento' },
        { label: 'Narrativa', link: '#narrativa' },
        { label: 'Producciones', link: '#escena' }
      ]
    },
    { label: 'Conocéme', link: '#conoceme' }
  ];

  // Animation variants for desktop links collapsing/expanding
  const linksContainerVariants: any = {
    expanded: {
      width: 'auto',
      opacity: 1,
      x: 0,
      transition: {
        width: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any },
        opacity: { duration: 0.35, ease: 'easeOut' },
        x: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any }
      }
    },
    collapsed: {
      width: 0,
      opacity: 0,
      x: 40,
      transition: {
        width: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any },
        opacity: { duration: 0.25, ease: 'easeIn' },
        x: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any }
      }
    }
  };

  // Animation variants for the hamburger button scaling/sliding in
  const hamburgerButtonVariants: any = {
    hidden: {
      scale: 0.4,
      opacity: 0,
      width: 0,
      marginLeft: 0,
      transition: {
        width: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as any },
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
        width: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any },
        scale: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any },
        opacity: { duration: 0.35, ease: 'easeOut', delay: 0.05 }
      }
    }
  };

  return (
    <>
      <header
        className={`w-full fixed top-0 left-0 z-40 flex items-center justify-between px-6 md:px-16 transition-all duration-500 ease-in-out select-none bg-transparent border-b border-transparent ${
          scrolled ? 'py-4' : 'py-7'
        }`}
      >
        {/* Brand Logo (Left Margin) */}
        <a
          href={logoHref}
          onClick={() => setMobileOpen(false)}
          className="flex items-center select-none cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
          aria-label={logoHref === '#universo' ? 'Volver al inicio' : 'Volver'}
        >
          <img
            src={showBordoLogo ? "/logoFemmoraBordo.png" : "/logoFemmoraBeige.png"}
            alt="Logo"
            className="block w-auto object-contain transition-all duration-500"
            style={{
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
          {/* Desktop Navigation links */}
          <motion.nav
            variants={linksContainerVariants}
            initial="expanded"
            animate="expanded"
            className="hidden md:flex items-center gap-4 lg:gap-6 whitespace-nowrap overflow-visible"
          >
            {navItems.map((item, idx) => {
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
                      className={`group text-[11px] font-sans tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer flex items-center gap-1 py-1.5 px-3 rounded-full active:scale-95 ${
                        isLightNavbar
                          ? 'text-[var(--color-brand-bordo)]/85 hover:text-[var(--color-brand-bordo)] hover:bg-[var(--color-brand-bordo)]/5'
                          : 'text-[var(--color-brand-crema)]/85 hover:text-white hover:bg-white/5'
                      }`}
                      aria-expanded={dropdownOpen}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-300 ${
                          isLightNavbar ? 'text-[var(--color-brand-bordo)]' : 'text-current'
                        } ${dropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className={`absolute top-full right-0 mt-2 w-48 rounded-sm shadow-xl border overflow-hidden ${
                            scrolled
                              ? 'bg-[var(--color-brand-bordo)] text-[var(--color-brand-crema)] border-white/10'
                              : isLightNavbar
                              ? 'bg-white/95 text-[var(--color-brand-marron-oscuro)] border-[var(--color-brand-marron-claro)]/25 shadow-[0_10px_30px_rgba(146,94,61,0.15)]'
                              : 'bg-black/90 backdrop-blur-md text-[var(--color-brand-crema)] border-white/10'
                          }`}
                        >
                          <div className="py-2" role="menu" aria-orientation="vertical">
                            {item.subItems?.map((sub, sIdx) => (
                              <a
                                key={sub.label + sIdx}
                                href={sub.link}
                                onClick={() => setDropdownOpen(false)}
                                className={`block px-5 py-2.5 text-[10px] font-sans tracking-[0.15em] uppercase transition-all duration-200 cursor-pointer ${
                                  isLightNavbar
                                    ? 'text-[var(--color-brand-marron-oscuro)] hover:bg-[var(--color-brand-bordo)]/5 hover:text-[var(--color-brand-bordo)]'
                                    : 'text-[var(--color-brand-crema)]/80 hover:bg-white/10 hover:text-white'
                                }`}
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
                  className={`group text-[11px] font-sans tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer relative py-2 px-3 rounded-full active:scale-95 ${
                    isLightNavbar
                      ? 'text-[var(--color-brand-bordo)]/85 hover:text-[var(--color-brand-bordo)] hover:bg-[var(--color-brand-bordo)]/5'
                      : 'text-[var(--color-brand-crema)]/85 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                  <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full opacity-0 scale-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 ${
                    isLightNavbar ? 'bg-[var(--color-brand-bordo)]' : 'bg-[var(--color-brand-crema)]'
                  }`} />
                </a>
              );
            })}
          </motion.nav>

          {/* Hamburger Trigger button (displays on Mobile only) */}
          {isMobile && (
            <motion.button
              variants={hamburgerButtonVariants}
              initial="visible"
              animate="visible"
              onClick={() => setMobileOpen(true)}
              className={`flex items-center justify-center p-2.5 rounded-full transition-colors cursor-pointer overflow-hidden whitespace-nowrap ${
                isLightHamburger
                  ? 'text-[var(--color-brand-bordo)] hover:bg-[var(--color-brand-bordo)]/5'
                  : 'text-[var(--color-brand-crema)] hover:bg-white/5'
              }`}
              aria-label="Abrir menú de navegación"
            >
              <Menu size={24} />
            </motion.button>
          )}
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
              className="fixed top-0 right-0 h-full w-full sm:w-[380px] bg-[var(--color-brand-crema)] shadow-2xl z-50 p-8 md:p-10 flex flex-col justify-between pointer-events-auto"
            >
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between border-b border-[var(--color-brand-marron-claro)]/15 pb-5">
                <a
                  href={logoHref}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center"
                  aria-label={logoHref === '#universo' ? 'Volver al inicio' : 'Volver'}
                >
                  <img
                    src="/logoFemmoraBordo.png"
                    alt="Logo"
                    className="block h-8 w-auto object-contain"
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
              <nav className="flex-grow flex flex-col justify-start pt-16 pb-8">
                <ul className="list-none m-0 p-0 flex flex-col gap-8" role="list">
                  {navItems.map((item, idx) => {
                    const isContact = item.link === '#conoceme';
                    const hasDropdown = item.subItems !== undefined;

                    if (hasDropdown) {
                      return (
                        <li key={item.label + idx} className="flex flex-col gap-2">
                          <button
                            onClick={() => setMobileProjectsOpen(!mobileProjectsOpen)}
                            className="text-left w-full text-3xl font-brand text-[var(--color-brand-marron-oscuro)] hover:text-[var(--color-brand-bordo)] hover:translate-x-1 transition-all duration-300 flex items-center justify-between cursor-pointer group"
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
                            className="list-none pl-4 flex flex-col gap-4 overflow-hidden"
                          >
                            {item.subItems?.map((sub, sIdx) => (
                              <li key={sub.label + sIdx} className="pt-2">
                                <a
                                  href={sub.link}
                                  onClick={() => setMobileOpen(false)}
                                  className="text-base md:text-lg font-sans tracking-widest uppercase text-[var(--color-brand-marron-oscuro)]/70 hover:text-[var(--color-brand-bordo)] hover:pl-1 transition-all duration-200 cursor-pointer"
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
                          className="inline-block text-3xl font-brand text-[var(--color-brand-marron-oscuro)] hover:text-[var(--color-brand-bordo)] hover:translate-x-1 transition-all duration-300 cursor-pointer"
                        >
                          {item.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Drawer Footer (Socials) */}
              <div className="border-t border-[var(--color-brand-marron-claro)]/25 pt-8 flex flex-col gap-4">
                <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[var(--color-brand-marron-claro)] mb-1">
                  Sociales
                </span>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://instagram.com/solpetroff.ph"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-4 rounded-sm border border-[var(--color-brand-marron-claro)]/15 bg-white/20 hover:bg-[var(--color-brand-bordo)]/5 hover:border-[var(--color-brand-bordo)]/35 transition-all duration-300 cursor-pointer pointer-events-auto active:scale-[0.99]"
                  >
                    <div className="flex flex-col">
                      <span className="text-[9px] font-sans tracking-widest uppercase text-[var(--color-brand-marron-claro)] group-hover:text-[var(--color-brand-bordo)]/80 transition-colors">
                        Instagram
                      </span>
                      <span className="text-base font-brand text-[var(--color-brand-marron-oscuro)] group-hover:text-[var(--color-brand-bordo)] transition-colors mt-0.5">
                        @solpetroff.ph
                      </span>
                    </div>
                    <ArrowUpRight size={18} className="text-[var(--color-brand-marron-claro)] group-hover:text-[var(--color-brand-bordo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                  </a>

                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-4 rounded-sm border border-[var(--color-brand-marron-claro)]/15 bg-white/20 hover:bg-[var(--color-brand-bordo)]/5 hover:border-[var(--color-brand-bordo)]/35 transition-all duration-300 cursor-pointer pointer-events-auto active:scale-[0.99]"
                  >
                    <div className="flex flex-col">
                      <span className="text-[9px] font-sans tracking-widest uppercase text-[var(--color-brand-marron-claro)] group-hover:text-[var(--color-brand-bordo)]/80 transition-colors">
                        TikTok
                      </span>
                      <span className="text-base font-brand text-[var(--color-brand-marron-oscuro)] group-hover:text-[var(--color-brand-bordo)] transition-colors mt-0.5">
                        @solpetroff.ph
                      </span>
                    </div>
                    <ArrowUpRight size={18} className="text-[var(--color-brand-marron-claro)] group-hover:text-[var(--color-brand-bordo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
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
