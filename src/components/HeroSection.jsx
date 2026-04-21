import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import MotivationalWall from './MotivationalWall'
import NeonTypeLine from './NeonTypeLine'

// Grain texture as inline SVG data URI
const GRAIN_URI = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

// Datos curiosos del gym (sin emojis, estilo profesional y corporativo pero fácil de entender)
const GYM_FACTS = [
  "El músculo más fuerte del cuerpo humano, en relación a su tamaño, es el de la mandíbula.",
  "Ganar masa muscular acelera tu metabolismo, haciendo que quemes más calorías incluso cuando estás descansando.",
  "Entrenar con pesas fortalece tus huesos y ayuda a prevenir enfermedades como la osteoporosis.",
  "Levantar pesas libera endorfinas, lo que reduce el estrés y mejora tu estado de ánimo casi al instante.",
  "El corazón es un músculo: el ejercicio cardiovascular regular hace que bombee sangre con mucho menos esfuerzo.",
  "Tus músculos no crecen mientras entrenas, sino mientras descansas y te recuperas después de la rutina.",
  "Sudar más no significa que estés quemando más grasa; es solo la forma en que el cuerpo regula su temperatura.",
  "La constancia siempre le gana a la intensidad. Es mejor entrenar moderado pero siempre, que matarse un día y faltar un mes.",
  "El tendón de Aquiles es tan fuerte que puede soportar hasta 10 veces tu peso corporal cuando corres o saltas.",
  "Los músculos representan aproximadamente el 40% de tu peso corporal total.",
  "Se necesitan usar alrededor de 200 músculos diferentes para dar un solo paso al caminar.",
  "Entrenar fuerza ayuda a tu cuerpo a procesar mejor el azúcar en la sangre y mejora la sensibilidad a la insulina.",
  "El ejercicio cardiovascular mejora la memoria y la concentración al llevar más oxígeno y nutrientes al cerebro.",
  "El glúteo mayor es el músculo más grande del cuerpo y es el principal encargado de mantenernos de pie.",
  "El momento ideal para que tu cuerpo mejore y se adapte es entre 48 y 72 horas después de haber entrenado.",
  "Los movimientos rápidos y explosivos estimulan un tipo de fibra muscular que te da más fuerza y potencia.",
  "El músculo es un tejido que consume mucha energía, por lo que ayuda a reducir la grasa corporal que lo rodea.",
  "Estirar mucho tiempo antes de levantar pesas puede hacer que pierdas fuerza temporalmente. Es mejor un calentamiento dinámico.",
  "Estar apenas un 2% deshidratado puede hacer que tu rendimiento y fuerza bajen notablemente en el gimnasio.",
  "Entrenar un brazo o una pierna a la vez es clave para corregir desequilibrios y prevenir lesiones futuras.",
  "Cuidar tu flexibilidad es tan importante como tu fuerza para mantener tus articulaciones sanas a largo plazo.",
  "Después de los 30 años comenzamos a perder músculo de forma natural, pero el entrenamiento de fuerza detiene este proceso.",
  "El dolor muscular del día siguiente ocurre principalmente por la parte del ejercicio donde bajas o frenas el peso.",
  "Comer proteínas y carbohidratos después de entrenar acelera significativamente la recuperación de tus músculos.",
  "Aprender a respirar con el abdomen al levantar peso protege tu columna y te da mucha más estabilidad.",
  "Para que un músculo crezca necesitas dos cosas: peso que lo desafíe y llegar a sentir esa fatiga característica.",
  "Los ejercicios que involucran varias articulaciones, como las sentadillas, generan una mayor respuesta hormonal positiva en el cuerpo.",
  "Tus tendones y ligamentos tardan más tiempo en fortalecerse que tus músculos, por eso la progresión debe ser gradual.",
  "Tener una buena capacidad cardiovascular es uno de los indicadores más precisos de una vida larga y saludable.",
  "Dormir profundamente es el momento más importante para la recuperación física y la creación de músculo nuevo.",
  "Tener buena movilidad en los tobillos es el secreto principal para lograr una sentadilla profunda y segura.",
  "Para mejorar tu resistencia en el cardio, ser constante con el tiempo de entrenamiento es mejor que ir siempre al máximo.",
  "Los músculos no se multiplican en cantidad cuando entrenamos, sino que las fibras que ya tenemos aumentan su tamaño."
]

/**
 * Splits a string into individual characters wrapped in motion spans
 * for staggered letter reveal animations.
 */
function SplitText({ text, className, style, delay = 0, staggerDelay = 0.04 }) {
  const chars = text.split('')
  return (
    <span className={className} style={style} aria-label={text}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          initial={{ opacity: 0, y: '60%', skewY: 4 }}
          animate={{ opacity: 1, y: '0%', skewY: 0 }}
          transition={{
            opacity: { duration: 0.55, delay: delay + i * staggerDelay, ease: [0.16, 1, 0.3, 1] },
            y: { duration: 0.55, delay: delay + i * staggerDelay, ease: [0.16, 1, 0.3, 1] },
            skewY: { duration: 0.55, delay: delay + i * staggerDelay, ease: [0.16, 1, 0.3, 1] }
          }}
          className="inline-block"
          style={{ willChange: 'transform' }}
        >
          <span className="text-stroke-animated">
            {char === ' ' ? '\u00A0' : char}
          </span>
        </motion.span>
      ))}
    </span>
  )
}

/**
 * Typewriter effect wrapper for longer paragraphs.
 */
function TypingText({ text, speedMs = 35, startDelay = 800, className }) {
  const [visibleChars, setVisibleChars] = useState(0)

  useEffect(() => {
    let cancelled = false
    let timer = null
    setVisibleChars(0)

    const step = () => {
      if (cancelled) return
      setVisibleChars((prev) => {
        if (prev >= text.length) return prev
        timer = setTimeout(step, speedMs)
        return prev + 1
      })
    }

    timer = setTimeout(step, startDelay)
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [text, speedMs, startDelay])

  return (
    <p className={className}>
      {text.slice(0, visibleChars)}
      <motion.span
        animate={{ opacity: visibleChars >= text.length ? 0 : [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-1.5 h-[1em] bg-[#ccff00] align-middle ml-1"
        style={{ boxShadow: '0 0 8px #ccff00' }}
      />
    </p>
  )
}

/**
 * HeroSection — "Power Flow" hero.
 * Props: content (from useGymData), dataLoaded (bool)
 */
export default function HeroSection({ content = {}, dataLoaded = true }) {
  const sectionRef = useRef(null)
  const { scrollY } = useScroll()
  const [randomFacts, setRandomFacts] = useState([])

  useEffect(() => {
    // Al cargar la página, elegimos 1 dato curioso al azar
    const random = GYM_FACTS[Math.floor(Math.random() * GYM_FACTS.length)]
    setRandomFacts([random])
  }, [])

  // Parallax fade-out as user scrolls down
  const opacity = useTransform(scrollY, [0, 500], [1, 0])
  const yParallax = useTransform(scrollY, [0, 500], [0, 80])
  const smoothY = useSpring(yParallax, { stiffness: 100, damping: 30 })

  const title = dataLoaded ? (content.hero_title ?? '') : ''
  const subtitle = dataLoaded ? (content.hero_subtitle ?? '') : ''

  // Split title into lines for individual styling
  const lines = title.split('\n').filter(Boolean)

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black select-none"
    >
      {/* ── Background video ──────────────────────────────── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ willChange: 'transform' }}
      >
        <source src="/images/video1.mp4" type="video/mp4" />
      </video>

      {/* ── Dark overlay ─────────────────────────────────── */}
      <div className="absolute inset-0 bg-black/65" />

      {/* ── Bottom gradient fade to content below ─────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent pointer-events-none" />

      {/* ── Grain overlay ─────────────────────────────────── */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: GRAIN_URI,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
        }}
      />

      {/* ── Neon radial glow ────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 60%, #ccff0012 0%, transparent 70%)',
        }}
      />

      {/* ── Top rule ────────────────────────────────────────── */}
      <motion.div
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ccff00]/40 to-transparent"
      />

      {/* ── Main content ─────────────────────────────────────── */}
      <motion.div
        style={{ opacity, y: smoothY }}
        className="relative z-10 w-full max-w-[110rem] mx-auto px-6 md:px-12 pt-24"
      >
        <div className="flex flex-col xl:flex-row items-start xl:items-stretch gap-10 xl:gap-16">
          <div className="flex-1 min-w-0">
            {/* Label */}
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-3 text-[#ccff00] text-xs font-bold uppercase tracking-[0.3em] mb-8"
            >
              <span className="w-8 h-px bg-[#ccff00]" />
              Centro de Entrenamiento
            </motion.span>

            {/* Headline — large solid title in the site's base font */}
            <h1 className="font-[var(--font-display)] text-[clamp(3.5rem,10vw,6rem)] md:text-[clamp(4.5rem,7vw,7rem)] xl:text-[clamp(5rem,7vw,8rem)] font-extrabold leading-[1.1] pb-4 tracking-tight uppercase text-white">
              {lines.map((line, lineIdx) => {
                return (
                  <div key={lineIdx} className="block pb-2">
                    <SplitText
                      text={line}
                      delay={0.2 + lineIdx * 0.15}
                      staggerDelay={0.035}
                      className="text-white text-[inherit]"
                    />
                  </div>
                )
              })}
            </h1>



            {/* Subtitle */}
            <div className="mt-10">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-white/50 text-[clamp(0.9rem,1.8vw,1.25rem)] font-light leading-relaxed max-w-lg tracking-wide"
              >
                {subtitle}
              </motion.p>
            </div>

            {/* Random Gym Facts Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="mt-10 md:mt-16 pt-8 border-t border-white/[0.06] max-w-5xl"
            >
              {/* Global Title */}
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#ccff00]/20 shadow-[0_0_12px_rgba(57,211,83,0.3)] text-[#ccff00] text-[11px] font-bold">
                  i
                </span>
                <motion.h3
                  className="text-sm md:text-base font-black uppercase tracking-[0.2em] text-[#84ffa7]"
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
                  ¿Sabías qué?
                </motion.h3>
              </div>
              
              {/* Facts Container (Single Card) */}
              <div className="relative w-full">
                {randomFacts.map((fact, i) => (
                  <motion.div
                    key={i}
                    animate={{ 'box-shadow': ['0 0 4px #ccff0033, inset 0 0 4px #ccff0011', '0 0 14px #ccff0066, inset 0 0 8px #ccff0022', '0 0 4px #ccff0033, inset 0 0 4px #ccff0011'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="px-5 py-5 md:px-6 md:py-6 rounded-2xl bg-black/40 border border-[#ccff00]/40 transition-all duration-300"
                  >
                    <TypingText
                      text={fact}
                      speedMs={35}
                      startDelay={1000}
                      className="text-[#ccff00]/90 drop-shadow-[0_0_4px_rgba(57,211,83,0.3)] text-[13px] md:text-base leading-relaxed font-semibold tracking-wide"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Motivational neon wall (desktop only) */}
          <MotivationalWall />
        </div>
      </motion.div>

      {/* ── Scroll indicator ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="w-px h-10 bg-gradient-to-b from-[#ccff00] to-transparent"
        />
      </motion.div>
    </section>
  )
}
