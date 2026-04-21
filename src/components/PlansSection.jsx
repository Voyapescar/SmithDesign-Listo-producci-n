import { motion } from 'framer-motion'
import { Check, Zap, ArrowRight } from 'lucide-react'

// Neon border sequential animation config
const NEON_SEQ     = ['neon-seq-0', 'neon-seq-1', 'neon-seq-2']
const NEON_PER_CARD = 2.5  // seconds per card rotation
const NEON_TOTAL    = 7.5  // 3 × 2.5 s

function PlanSkeleton() {
  return (
    <div className="rounded-2xl bg-[#0d0d0d] h-full min-h-[340px] relative overflow-hidden border border-white/[0.04]">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
    </div>
  )
}

function PlanCard({ plan, index }) {
  const isHighlighted = plan.highlight_neon
  const seqAnim = NEON_SEQ[index] ?? NEON_SEQ[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      whileHover={{ scale: 1.02 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-2xl overflow-hidden p-[2px]"
      style={isHighlighted ? { boxShadow: '0 0 40px #ccff0044, 0 0 80px #ccff0018' } : {}}
    >
      {/* ── Traveling neon border ring ── */}
      <div
        aria-hidden="true"
        className="absolute w-[300%] aspect-square top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          background: 'conic-gradient(from 0deg, transparent 42%, #ccff0000 44%, #ccff00 48%, #e6ff80 50%, #ccff00 52%, #ccff0000 56%, transparent 58%)',
          animation: `neon-border-rotate ${NEON_PER_CARD}s linear infinite, ${seqAnim} ${NEON_TOTAL}s linear infinite`,
        }}
      />

      {/* ── Inner card ── */}
      <div
        className={`
          relative flex flex-col rounded-[14px] p-4 sm:p-6 z-10 overflow-hidden h-full
          ${isHighlighted
            ? 'bg-[#ccff00] text-black'
            : 'bg-[#080808] text-white'
          }
        `}
      >
        {isHighlighted && (
          <div className="absolute top-0 right-8 flex items-center gap-1.5 bg-black text-[#ccff00] text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-b-xl">
            <Zap size={10} fill="currentColor" /> Más Popular
          </div>
        )}

        <div className="mb-4">
          <p className={`text-xs font-bold uppercase tracking-[0.25em] mb-2 ${isHighlighted ? 'text-black/50' : 'text-white/30'}`}>
            {plan.name}
          </p>
          <div className="flex items-end gap-1 leading-none">
            <span className={`text-[2.6rem] font-black tracking-tighter ${isHighlighted ? 'text-black' : 'text-white'}`}>
              ${Math.floor(Number(plan.price)).toLocaleString('es-CL')}
            </span>
            <div className="mb-1 flex flex-col">
              <span className={`text-xs ${isHighlighted ? 'text-black/40' : 'text-white/25'}`}>/{plan.billing_period}</span>
            </div>
          </div>
        </div>

        <div className={`h-px mb-3 ${isHighlighted ? 'bg-black/10' : 'bg-white/[0.06]'}`} />

        <ul className="flex-1 space-y-2 mb-4">
          {plan.features?.map((feature, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + i * 0.06 }}
              className="flex items-start gap-3 text-sm"
            >
              <span className={`flex-shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center ${isHighlighted ? 'bg-black/15' : 'bg-[#ccff00]/12'}`}>
                <Check size={10} className={isHighlighted ? 'text-black' : 'text-[#ccff00]'} strokeWidth={3} />
              </span>
              <span className={isHighlighted ? 'text-black/75' : 'text-white/55'}>{feature}</span>
            </motion.li>
          ))}
        </ul>

        <a
          href="#contact"
          className={`
            group inline-flex items-center justify-center gap-2
            py-4 rounded-xl font-bold text-sm uppercase tracking-widest
            transition-all duration-200
            ${isHighlighted
              ? 'bg-black text-[#ccff00] hover:bg-[#111] hover:gap-4'
              : 'bg-[#ccff00]/8 border border-[#ccff00]/25 text-[#ccff00] hover:bg-[#ccff00] hover:text-black hover:border-transparent'
            }
          `}
        >
          Elegir Plan
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </motion.div>
  )
}

/**
 * PlansSection
 * Props: plans (array from useGymData), loading (bool)
 */
export default function PlansSection({ plans = [], loading = false }) {
  return (
    <section id="plans" className="relative overflow-hidden h-full w-full px-4 sm:px-6 md:px-8 py-24 md:py-0 bg-black flex flex-col justify-center">
      {/* ── Background video ── */}
      <video
        autoPlay muted loop playsInline preload="none"
        className="absolute inset-0 w-full h-full object-cover object-center"
        aria-hidden="true"
      >
        <source src="/images/video3.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/82" />

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-3 text-[#ccff00] text-xs font-bold uppercase tracking-[0.3em]">
            <span className="w-6 h-px bg-[#ccff00]" />
            Membresías
          </span>
          <h2 className="mt-2 text-[clamp(1.6rem,4vw,3.5rem)] font-black uppercase leading-[0.9] text-white">
            Planes <span className="text-[#ccff00]">Disponibles</span>
          </h2>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => <PlanSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {plans.map((plan, i) => <PlanCard key={plan.id} plan={plan} index={i} />)}
          </div>
        )}
      </div>
    </section>
  )
}
