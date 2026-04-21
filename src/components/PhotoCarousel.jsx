import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const TRANSITION = {
  enter: (dir) => ({ x: dir > 0 ? 120 : -120, opacity: 0, scale: 1.02, filter: 'blur(6px)' }),
  center: { x: 0, opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: (dir) => ({ x: dir > 0 ? -120 : 120, opacity: 0, scale: 0.99, filter: 'blur(4px)' }),
}

/**
 * PhotoCarousel
 * Props: slides (array from useGymData), loading (bool)
 */
export default function PhotoCarousel({ slides = [], loading = false }) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const total = slides.length

  const go = (dir) => {
    setDirection(dir)
    setCurrent((prev) => (prev + dir + total) % total)
  }

  const onTouchStart = (event) => {
    touchStartX.current = event.changedTouches[0].clientX
  }

  const onTouchEnd = (event) => {
    touchEndX.current = event.changedTouches[0].clientX
    const delta = touchEndX.current - touchStartX.current
    const threshold = 50
    if (delta < -threshold) go(1)
    if (delta > threshold) go(-1)
  }

  if (loading) {
    return (
      <section className="relative h-screen bg-[#050505] flex items-center justify-center overflow-hidden">
        <div className="w-12 h-12 border-2 border-[#ccff00] border-t-transparent rounded-full animate-spin" />
      </section>
    )
  }

  if (!slides.length) return null

  return (
    <section
      data-no-horizontal-drag
      className="relative h-full min-h-screen w-full overflow-hidden bg-black"
      aria-label="Galería de imágenes"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Slides ──────────────────────────────────────────── */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.figure
          key={current}
          custom={direction}
          variants={TRANSITION}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.58, ease: [0.22, 0.7, 0, 1] }}
          className="absolute inset-0 will-change-transform"
        >
          <img
            src={slides[current].image_url}
            alt={slides[current].alt_text}
            decoding="async"
            fetchPriority="high"
            className="w-full h-full object-cover object-center select-none pointer-events-none"
            draggable={false}
          />

          {/* Multi-layer gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        </motion.figure>
      </AnimatePresence>

      {/* ── Bottom bar: caption + dots ───────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-8 md:px-14 pb-10 flex items-end justify-between gap-6 pointer-events-none">

        {/* Caption */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`caption-${current}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <p className="text-[#ccff00] text-[10px] font-bold uppercase tracking-[0.3em] mb-1">
              {String(current + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(total).padStart(2, '0')}
            </p>
            <p className="text-white/60 text-sm font-medium">{slides[current].alt_text}</p>
          </motion.div>
        </AnimatePresence>

        {/* Dot navigation */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {slides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
              aria-label={`Imagen ${i + 1}`}
              animate={i === current
                ? { width: 28, backgroundColor: '#ccff00', boxShadow: '0 0 10px #ccff00aa' }
                : { width: 6, backgroundColor: 'rgba(255,255,255,0.25)', boxShadow: 'none' }
              }
              whileHover={i !== current ? { backgroundColor: 'rgba(255,255,255,0.5)' } : {}}
              transition={{ duration: 0.25 }}
              style={{ height: 5, borderRadius: 9999, display: 'block', padding: 0, border: 'none', cursor: 'pointer' }}
            />
          ))}
        </div>
      </div>

      {/* ── Arrow controls ──────────────────────────────────── */}
      {[{ dir: -1, side: 'left-6', Icon: ChevronLeft, label: 'Anterior' },
        { dir:  1, side: 'right-6', Icon: ChevronRight, label: 'Siguiente' }].map(({ dir, side, Icon, label }) => (
        <motion.button
          key={label}
          onClick={() => go(dir)}
          aria-label={label}
          whileHover={{ scale: 1.08, boxShadow: '0 0 28px #ccff00aa, 0 0 60px #ccff0033' }}
          whileTap={{ scale: 0.93 }}
          transition={{ type: 'spring', stiffness: 340, damping: 22 }}
          className={`absolute ${side} top-1/2 -translate-y-1/2 z-20 flex items-center justify-center gap-2 rounded-full border border-white/15 bg-black/55 backdrop-blur-md text-white/80 transition-colors duration-200 hover:border-[#ccff00]/70 hover:text-[#ccff00]`}
          style={{ width: 52, height: 52 }}
        >
          <Icon size={20} strokeWidth={1.8} />
        </motion.button>
      ))}

      {/* ── Neon progress bar ────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-[2px] bg-white/[0.05]">
        <motion.div
          className="h-full bg-[#ccff00]"
          style={{ boxShadow: '0 0 8px #ccff00, 0 0 20px #ccff0066' }}
          animate={{ width: `${((current + 1) / total) * 100}%` }}
          transition={{ duration: 0.4, ease: [0.22, 0.7, 0, 1] }}
        />
      </div>
    </section>
  )
}
