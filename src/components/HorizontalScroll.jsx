import { useRef, Children, useEffect, useCallback, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

const AUTO_INTERVAL_MS = 6000  // tiempo entre cambios automáticos de panel
const PAUSE_AFTER_INTERACT_MS = 4000  // pausa después de que el usuario interactúa

const INTERACTIVE_SELECTOR = [
  'a', 'button', 'input', 'textarea', 'select', 'label',
  '[role="button"]', '[role="link"]', '[data-no-horizontal-drag]'
].join(',')

/**
 * HorizontalScroll
 * ─────────────────
 * Desktop (md+): maps vertical wheel scroll → lateral X translation.
 * The scroll container is given height = childCount * 100vh so the
 * total scrollable distance equals one full viewport per panel.
 *
 * Mobile: falls back to a normal vertical flow (flex-col).
 *
 * Props:
 *   children   — React nodes; each child becomes one full-width panel.
 */
export default function HorizontalScroll({
  children,
}) {
  const containerRef = useRef(null)
  const childArray = Children.toArray(children)
  const childCount = childArray.length

  // scrollYProgress goes 0 → 1 as the user scrolls through the sticky area
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // 1. Map scroll progress → discrete panel index (0, 1, 2 …)
  const maxIndex = Math.max(childCount - 1, 0)
  const panelStepPct = childCount > 0 ? 100 / childCount : 100

  const indexMV = useTransform(scrollYProgress, (v) => {
    if (maxIndex === 0) return 0
    // Use maxIndex (not childCount) so snap thresholds align with real panel stops.
    return Math.max(0, Math.min(maxIndex, Math.round(v * maxIndex)))
  })

  // 2. Convert index to the exact target translate-x percentage
  const targetX = useTransform(indexMV, (idx) => -(idx * panelStepPct))

  // 3. Spring follows the snapped target — tight enough to feel locked,
  //    gentle enough to glide smoothly between panels.
  const smoothX = useSpring(targetX, { stiffness: 105, damping: 30, mass: 1.45, restDelta: 0.001 })

  // 4. Format as CSS percentage string for the track
  const x = useTransform(smoothX, (v) => `${v}%`)

  // ── Drag & scroll-wheel support ─────────────────────────────────────
  const stickyRef  = useRef(null)
  const dragStartX = useRef(null)
  const entryHoldUntilRef = useRef(0)
  const entryArmedRef = useRef(true)
  const lastWheelDirRef = useRef(0)
  const reversalLockUntilRef = useRef(0)

  // ── Auto-play refs ───────────────────────────────────────────────────
  const pauseUntilRef = useRef(0)
  const inViewRef = useRef(false)

  const pauseAutoPlay = useCallback(() => {
    pauseUntilRef.current = Date.now() + PAUSE_AFTER_INTERACT_MS
  }, [])

  // Jump window scroll instantly to panel n — the spring handles the visuals
  const scrollToPanel = useCallback((n) => {
    const el = containerRef.current
    if (!el) return
    const target = Math.max(0, Math.min(maxIndex, n))
    const containerTop = el.getBoundingClientRect().top + window.scrollY
    const vh = window.innerHeight
    // Each panel stop is exactly one viewport apart inside the sticky section.
    window.scrollTo({ top: containerTop + target * vh, behavior: 'instant' })
  }, [maxIndex])

  // Notificar al Navbar qué panel está activo
  useEffect(() => {
    return indexMV.on('change', (v) => {
      window.dispatchEvent(
        new CustomEvent('h-panel-change', { detail: { index: Math.round(v) } })
      )
    })
  }, [indexMV])

  // Observar si la sección está visible en el viewport
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { inViewRef.current = entry.isIntersecting },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Intervalo de auto-avance (solo desktop, pausa si el usuario interactúa)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!inViewRef.current) return
      if (Date.now() < pauseUntilRef.current) return
      if (window.innerWidth < 768) return
      if (!containerRef.current || containerRef.current.offsetParent === null) return
      const p = scrollYProgress.get()
      const idx = Math.max(0, Math.min(maxIndex, Math.round(p * maxIndex)))
      if (idx >= maxIndex) return
      scrollToPanel(idx + 1)
    }, AUTO_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [scrollYProgress, maxIndex, scrollToPanel])

  // Non-passive wheel: intercept while in sticky zone, advance one panel per burst
  useEffect(() => {
    const sticky = stickyRef.current
    if (!sticky) return
    let cooldown = false
    let wheelAccum = 0
    const WHEEL_THRESHOLD = 220
    const COOLDOWN_MS = 900
    const ENTRY_HOLD_MS = 700

    function onWheel(e) {
      pauseUntilRef.current = Date.now() + PAUSE_AFTER_INTERACT_MS
      const p = scrollYProgress.get()
      const now = performance.now()
      const dir = Math.sign(e.deltaY)

      if (dir !== 0 && lastWheelDirRef.current !== 0 && dir !== lastWheelDirRef.current) {
        reversalLockUntilRef.current = now + 180
        wheelAccum = 0
      }
      lastWheelDirRef.current = dir

      if (p <= 0.0001 && e.deltaY < 0) {
        entryArmedRef.current = true
        return   // let user scroll up & leave
      }
      if (p >= 0.9999 && e.deltaY > 0) return   // let user scroll down & leave
      if (p < 0 || p > 1) return
      e.preventDefault()

      if (now < reversalLockUntilRef.current) return

      // Single entry lock: first downward intent inside horizontal lands on panel 0,
      // then momentum is briefly absorbed so it does not jump to panel 1.
      if (e.deltaY > 0 && p <= 0.12 && entryArmedRef.current) {
        entryArmedRef.current = false
        entryHoldUntilRef.current = now + ENTRY_HOLD_MS
        wheelAccum = 0
        cooldown = true
        scrollToPanel(0)
        setTimeout(() => { cooldown = false }, 360)
        return
      }

      // Rearm entry lock when user comes back to the top boundary.
      if (e.deltaY < 0 && p <= 0.04) entryArmedRef.current = true

      // Absorb residual wheel momentum right after entering panel 0.
      if (e.deltaY > 0 && p <= 0.2 && now < entryHoldUntilRef.current) return

      if (cooldown) return

      // Accumulate wheel intent so tiny trackpad moves do not skip panels.
      wheelAccum += e.deltaY
      if (Math.abs(wheelAccum) < WHEEL_THRESHOLD) return

      const direction = wheelAccum > 0 ? 1 : -1
      wheelAccum = 0
      cooldown = true
      const idx = Math.max(0, Math.min(maxIndex, Math.round(p * maxIndex)))
      scrollToPanel(idx + direction)
      setTimeout(() => { cooldown = false }, COOLDOWN_MS)
    }

    sticky.addEventListener('wheel', onWheel, { passive: false })
    return () => sticky.removeEventListener('wheel', onWheel)
  }, [scrollToPanel, maxIndex, scrollYProgress])

  // Global pointerup so drag resolves even if cursor leaves the element
  useEffect(() => {
    function clearDrag() {
      dragStartX.current = null
    }

    function onPointerUp(e) {
      if (dragStartX.current === null) return
      const delta = e.clientX - dragStartX.current
      clearDrag()
      if (Math.abs(delta) < 120) return
      const p   = scrollYProgress.get()
      const idx = Math.max(0, Math.min(maxIndex, Math.round(p * maxIndex)))
      scrollToPanel(delta < 0 ? idx + 1 : idx - 1)
    }

    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', clearDrag)
    return () => {
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', clearDrag)
    }
  }, [scrollToPanel, maxIndex, scrollYProgress])

  function onPointerDown(e) {
    // Horizontal drag should not hijack interactive controls inside panels.
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    if (e.target instanceof Element && e.target.closest(INTERACTIVE_SELECTOR)) return
    pauseAutoPlay()
    dragStartX.current = e.clientX
  }

  return (
    <>
      {/* ── DESKTOP: sticky horizontal track ─────────────────── */}
      <section
        ref={containerRef}
        aria-label="Secciones horizontales"
        className="relative hidden md:block"
        style={{ height: `${childCount * 100}vh` }}
      >
        {/* Sticky viewport window */}
        <div
          ref={stickyRef}
          className="sticky top-0 h-screen overflow-hidden cursor-grab active:cursor-grabbing select-none"
          style={{ touchAction: 'pan-y' }}
          onPointerDown={onPointerDown}
        >
          {/* Horizontal track */}
          <motion.div
            className="flex h-full will-change-transform"
            aria-live="polite"
            style={{ x, width: `${childCount * 100}%` }}
          >
            {childArray.map((child, i) => (
              <div
                key={i}
                className="relative h-full flex-shrink-0 overflow-hidden"
                style={{ width: `${100 / Math.max(childCount, 1)}%` }}
              >
                {child}
              </div>
            ))}
          </motion.div>

          {/* Section progress dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
            {childArray.map((_, i) => (
              <ProgressDot
                key={i}
                index={i}
                indexMV={indexMV}
              />
            ))}
          </div>

          {/* Auto-play progress bar — se llena cada 6 s, desaparece en el último panel */}
          <AutoPlayBar indexMV={indexMV} maxIndex={maxIndex} intervalMs={AUTO_INTERVAL_MS} pauseUntilRef={pauseUntilRef} />

          {/* Scroll hint — visible only at the very start */}
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]) }}
            className="absolute bottom-8 right-10 flex items-center gap-2 text-white/20 text-xs uppercase tracking-widest pointer-events-none"
          >
            <span>Scroll</span>
            <ScrollArrows />
          </motion.div>
        </div>
      </section>

      {/* ── MOBILE: normal vertical flow ─────────────────────── */}
      <div className="md:hidden flex flex-col">
        {childArray.map((child, i) => (
          <div key={i} className="w-full">{child}</div>
        ))}
      </div>
    </>
  )
}

// ── Sub-components ───────────────────────────────────────────────────────────

function AutoPlayBar({ indexMV, maxIndex, intervalMs, pauseUntilRef }) {
  const [key, setKey] = useState(0)
  const [paused, setPaused] = useState(false)
  const opacity = useTransform(indexMV, v => v >= maxIndex ? 0 : 1)

  // Reiniciar la animación cuando cambia el panel activo
  useEffect(() => {
    return indexMV.on('change', () => setKey(k => k + 1))
  }, [indexMV])

  // Detectar si el usuario pausó la reproducción automática
  useEffect(() => {
    const id = setInterval(() => {
      setPaused(Date.now() < pauseUntilRef.current)
    }, 300)
    return () => clearInterval(id)
  }, [pauseUntilRef])

  return (
    <motion.div
      style={{ opacity }}
      className="absolute top-0 left-0 right-0 z-40 h-[2px] bg-white/[0.06] pointer-events-none"
    >
      <div
        key={key}
        className="h-full bg-[#ccff00]/60"
        style={{
          boxShadow: '0 0 6px #ccff0066',
          animation: paused ? 'none' : `autoplay-fill ${intervalMs}ms linear forwards`,
          width: paused ? '0%' : undefined,
        }}
      />
    </motion.div>
  )
}

function ProgressDot({ index, indexMV }) {
  // Dot state follows the exact snapped panel index for perfect sync.
  const scale = useTransform(indexMV, (activeIndex) => (activeIndex === index ? 1.8 : 1))
  const opacity = useTransform(indexMV, (activeIndex) => (activeIndex === index ? 1 : 0.55))
  return (
    <motion.div
      style={{ scale, opacity }}
      className="w-1.5 h-1.5 rounded-full bg-[#ccff00] origin-center"
      title={`Sección ${index + 1}`}
    />
  )
}

function ScrollArrows() {
  return (
    <motion.div
      animate={{ x: [0, 6, 0] }}
      transition={{ repeat: Infinity, duration: 1.4 }}
      className="flex gap-0.5"
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-1 h-1 border-t border-r border-white/30 rotate-45"
          style={{ opacity: 1 - i * 0.3 }}
        />
      ))}
    </motion.div>
  )
}
