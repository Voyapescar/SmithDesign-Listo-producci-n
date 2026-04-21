import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

const links = [
  { label: 'Inicio', href: '#hero' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Planes', href: '#plans' },
  { label: 'Galeria', href: '#gallery' },
  { label: 'Profesionales', href: '#profesionales' },
  { label: 'Horarios', href: '#horarios' },
]

const NAV_HEIGHT = 80
const HORIZONTAL_PANEL_INDEX = {
  '#nosotros': 0,
  '#plans': 1,
  '#gallery': 2,
  '#profesionales': 3,
  '#horarios': 4,
}

const HIDE_DELAY = 2500

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeHref, setActiveHref] = useState('#hero')
  const [visible, setVisible] = useState(true)
  const hideTimer = useRef(null)

  useEffect(() => {
    const show = () => {
      setVisible(true)
      clearTimeout(hideTimer.current)
      // No ocultamos si estamos en la sección hero
      if (activeHref !== '#hero') {
        hideTimer.current = setTimeout(() => setVisible(false), HIDE_DELAY)
      }
    }

    // Al entrar en hero, cancelar cualquier timer pendiente y mostrar siempre
    if (activeHref === '#hero') {
      setVisible(true)
      clearTimeout(hideTimer.current)
    } else {
      // Si salimos del hero, arrancar el timer desde cero
      hideTimer.current = setTimeout(() => setVisible(false), HIDE_DELAY)
    }

    window.addEventListener('mousemove', show)
    window.addEventListener('touchstart', show, { passive: true })

    return () => {
      window.removeEventListener('mousemove', show)
      window.removeEventListener('touchstart', show)
      clearTimeout(hideTimer.current)
    }
  }, [activeHref])

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY
      setScrolled(currentY > 8)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false)
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useEffect(() => {
    const sections = links
      .map(({ href }) => document.querySelector(href))
      .filter(Boolean)

    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]?.target?.id) {
          setActiveHref(`#${visible[0].target.id}`)
        }
      },
      {
        rootMargin: '-35% 0px -45% 0px',
        threshold: [0.2, 0.4, 0.6],
      },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const handleNavClick = (event, href) => {
    const target = document.querySelector(href)
    if (!target) return

    event.preventDefault()
    setOpen(false)
    setActiveHref(href)

    // Desktop: map nav links to horizontal panel progress positions.
    if (window.innerWidth >= 768 && href in HORIZONTAL_PANEL_INDEX) {
      const horizontalRoot = document.querySelector('#nosotros')
      if (horizontalRoot) {
        const index = HORIZONTAL_PANEL_INDEX[href]
        const top = horizontalRoot.getBoundingClientRect().top + window.scrollY + index * window.innerHeight
        window.scrollTo({ top, behavior: 'smooth' })
        return
      }
    }

    const targetTop = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT
    window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' })
  }

  const navSurface = scrolled
    ? 'bg-black/90 border-b border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl'
    : 'bg-black/45 border-b border-transparent backdrop-blur-md'

  const linkClass = (href) =>
    `relative text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors duration-200 ${
      activeHref === href ? 'text-[#ccff00]' : 'text-white/75 hover:text-white'
    }`

  const underlineClass = (href) =>
    `absolute -bottom-1 left-0 h-px bg-[#ccff00] transition-all duration-250 ${
      activeHref === href ? 'w-full shadow-[0_0_10px_#ccff00]' : 'w-0 group-hover:w-full'
    }`

  return (
    <motion.header
      animate={{ y: 0, opacity: (open || activeHref === '#hero') ? 1 : visible ? 1 : 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <nav className={`w-full transition-all duration-300 ${navSurface}`}>
        <div className="max-w-7xl mx-auto h-[80px] md:h-[104px] px-4 md:px-8 flex items-center justify-between gap-4">
          <a href="#hero" onClick={(event) => handleNavClick(event, '#hero')} className="flex items-center">
            <img
              src="/images/logosmithnuevo.png"
              alt="Smith Design"
              className="h-16 md:h-20 xl:h-24 w-auto object-contain drop-shadow-[0_0_8px_rgba(57,211,83,0.4)] hover:drop-shadow-[0_0_18px_rgba(57,211,83,0.9)] transition-all duration-300"
            />
          </a>

          <ul className="hidden md:flex items-center gap-7 lg:gap-8">
            {links.map(({ label, href }) => (
              <li key={href} className="group relative">
                <a href={href} onClick={(event) => handleNavClick(event, href)} className={linkClass(href)}>
                  {label}
                </a>
                <span className={underlineClass(href)} />
              </li>
            ))}
          </ul>

          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#080808] border border-white/15 text-white/80 hover:text-[#ccff00] hover:border-[#ccff00]/50 transition-colors shadow-sm"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Abrir menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden border-b border-white/10 bg-black/95 backdrop-blur-xl"
          >
            <div className="max-w-7xl mx-auto px-5 py-4 flex flex-col gap-1">
              {links.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  onClick={(event) => handleNavClick(event, href)}
                  className={`rounded-lg px-3 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition-colors ${
                    activeHref === href
                      ? 'text-[#ccff00] bg-white/[0.03]'
                      : 'text-white/75 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  {label}
                </a>
              ))}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
