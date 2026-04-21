import { useState } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { ExternalLink, MapPin } from 'lucide-react'

// ── Change this to the real Instagram handle ──────────────
const IG_HANDLE  = '@smith_desiign'
const IG_URL     = 'https://www.instagram.com/smith_desiign/'
const COACH_HANDLE = '@_ifa_gi_'
const COACH_URL    = 'https://www.instagram.com/_ifa_gi_/'
const IG_POSTS   = [
  { url: '/images/ig1.PNG' },
  { url: '/images/ig2.PNG' },
  { url: '/images/ig3.PNG' },
  { url: '/images/ig4.PNG' },
  { url: '/images/ig5.PNG' },
  { url: '/images/ig6.PNG' },
]

// SmithDesign neon theme (avoid Instagram brand colors)
const NEON_GRADIENT = 'linear-gradient(135deg, rgba(57,211,83,0.95) 0%, rgba(200,255,210,0.85) 55%, rgba(57,211,83,0.95) 100%)'

// ── Tilt card (mouse parallax) ────────────────────────────
function TiltCard({ children }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-80, 80], [6, -6]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-80, 80], [-6, 6]), { stiffness: 300, damping: 30 })

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - rect.left - rect.width / 2)
    y.set(e.clientY - rect.top - rect.height / 2)
  }
  const handleLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="relative"
    >
      {children}
    </motion.div>
  )
}

// ── Individual post cell ─────────────────────────────────
function PostCell({ post, index }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.a
      href={IG_URL}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="relative aspect-[9/14] overflow-hidden rounded-xl cursor-pointer block"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <motion.img
        src={post.url}
        alt=""
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover object-center"
        animate={{ scale: hovered ? 1.08 : 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.55)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ExternalLink size={16} className="text-white" />
      </motion.div>
    </motion.a>
  )
}

// ── Main component ───────────────────────────────────────
export default function InstagramPanel() {
  return (
    <div className="w-full max-w-[27rem] mx-auto">
      <TiltCard>
        {/* Outer glow */}
        <div
          className="absolute -inset-[2px] rounded-3xl opacity-60 blur-md pointer-events-none"
          style={{ background: NEON_GRADIENT }}
        />

        {/* Gradient border ring */}
        <div
          className="absolute -inset-px rounded-3xl"
          style={{ background: NEON_GRADIENT, padding: '1px' }}
        >
          <div className="w-full h-full rounded-3xl bg-[#080808]" />
        </div>

        {/* Card body */}
        <div className="relative rounded-3xl overflow-hidden bg-[#080808] border border-white/[0.05] shadow-[0_20px_70px_rgba(0,0,0,0.5)] min-h-[34rem]">

          {/* Header */}
          <div className="px-5 pt-5 pb-4 border-b border-[#ccff00]/15">
            <div className="flex items-center gap-3">
              {/* Avatar with IG ring */}
              <motion.a
                href={IG_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 p-[2px] rounded-full"
                style={{ background: NEON_GRADIENT }}
              >
                <div className="p-[2px] bg-[#080808] rounded-full">
                  <img
                    src="/images/igperfil.PNG"
                    alt="Smith Design"
                    decoding="async"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
              </motion.a>

              {/* Username + inline stats */}
              <div className="flex-1 min-w-0">
                <a
                  href={IG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-bold text-base leading-tight truncate hover:text-[#ccff00] transition-colors block"
                >
                  {IG_HANDLE}
                </a>
                {/* Coach / owner */}
                <a
                  href={COACH_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-0.5 hover:text-[#ccff00] transition-colors"
                >
                  <span className="text-[#ccff00] text-[10px] font-bold uppercase tracking-[0.18em]">Coach</span>
                  <span className="text-white/55 text-[10px] font-semibold">{COACH_HANDLE}</span>
                </a>
                <p className="text-white/45 text-xs mt-1 leading-snug">
                  Creando hábitos y una buena salud ✨💪<br />
                  Cuidemos nuestro cuerpo 🏋️<br />
                  y nuestra mente 🧠
                </p>
                <div className="flex gap-4 mt-1.5">
                  {[
                    { val: '∞', label: 'posts' },
                    { val: '∞', label: 'Únete a nosotros' },
                    { val: 'Cañete', label: 'ubicación', icon: MapPin },
                  ].map(({ val, label, icon: Icon }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      {Icon ? <Icon size={12} className="text-[#ccff00] opacity-90" /> : null}
                      <span className="text-white font-black text-xs">{val}</span>
                      <span className="text-white/30 text-[10px] ml-1">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* External link icon */}
              <a
                href={IG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/25 hover:text-white/65 transition-colors"
              >
                <ExternalLink size={15} />
              </a>
            </div>

            {/* Follow button */}
            <motion.a
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-[0.15em] relative overflow-hidden"
              style={{ background: NEON_GRADIENT, boxShadow: '0 0 0 1px rgba(57,211,83,0.35), 0 0 22px rgba(57,211,83,0.25)' }}
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white flex-shrink-0" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              Seguir en Instagram
            </motion.a>
          </div>

          {/* Post grid — 3 cols × 2 rows, square aspect */}
          <div className="p-3.5 grid grid-cols-3 gap-2.5">
            {IG_POSTS.map((post, i) => (
              <PostCell key={i} post={post} index={i} />
            ))}
          </div>

          <div className="px-5 pb-2">
            <p className="text-white/35 text-[10px] uppercase tracking-[0.18em] mb-2">Comunidad activa</p>
            <div className="flex flex-wrap gap-2">
              {['Entrenamiento', 'Powerlifting', 'Disciplina'].map((tag) => (
                <span key={tag} className="text-[10px] uppercase tracking-[0.14em] text-[#ccff00] border border-[#ccff00]/30 rounded-full px-2.5 py-1 bg-[#ccff00]/10">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom hashtag strip */}
          <div className="px-5 pb-4 pt-1 flex items-center justify-center border-t border-[#ccff00]/10">
            <p className="text-white/20 text-[9px] uppercase tracking-[0.28em]">
              #smithdesign · #powerlifting · #entrenamiento
            </p>
          </div>
        </div>
      </TiltCard>
    </div>
  )
}
