import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Neon typewriter line that writes once (then cursor stops).
export default function NeonTypeLine({ text, startDelay = 0, speedMs = 165 }) {
  const [visibleChars, setVisibleChars] = useState(0)

  useEffect(() => {
    let cancelled = false
    let timer = null

    const step = () => {
      if (cancelled) return
      setVisibleChars((prev) => {
        if (prev >= text.length) return prev
        timer = setTimeout(step, speedMs)
        return prev + 1
      })
    }

    setVisibleChars(0)
    timer = setTimeout(step, startDelay)

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [text, startDelay, speedMs])

  return (
    <div className="relative flex items-center gap-2 min-h-[2.8rem] md:min-h-[3.2rem]">
      <motion.div
        aria-hidden="true"
        className="absolute -inset-x-2 -inset-y-1 rounded-xl pointer-events-none"
        animate={{ opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, #ccff0044 0%, transparent 75%)',
          filter: 'blur(10px)',
        }}
      />

      <motion.p
        className="text-[clamp(1.08rem,1.75vw,1.45rem)] font-black uppercase tracking-[0.08em] text-[#84ffa7]"
        animate={{
          opacity: [0.88, 1, 0.88],
          textShadow: [
            '0 0 8px #ccff0088, 0 0 20px #ccff0055',
            '0 0 12px #ccff00bb, 0 0 30px #ccff0088',
            '0 0 8px #ccff0088, 0 0 20px #ccff0055',
          ],
        }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        {text.slice(0, visibleChars)}
      </motion.p>

      <motion.span
        animate={{ opacity: visibleChars >= text.length ? 0 : [1, 0.2, 1] }}
        transition={{ duration: 1.05, repeat: Infinity, ease: 'easeInOut' }}
        className="inline-block w-[2px] h-5 md:h-6 bg-[#ccff00] shadow-[0_0_12px_#ccff00,0_0_28px_#ccff00aa]"
        aria-hidden="true"
      />
    </div>
  )
}

