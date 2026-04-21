import { motion } from 'framer-motion'
import * as LucideIcons from 'lucide-react'

// grid_size ? Tailwind CSS grid classes
const sizeClasses = {
  normal: 'col-span-1 row-span-1',
  wide:   'col-span-2 row-span-1',
  tall:   'col-span-1 row-span-2',
  large:  'col-span-2 row-span-2',
}

// Skeleton shimmer card
function SkeletonCard({ className = '' }) {
  return (
    <div
      className={`${className} rounded-2xl bg-[#0d0d0d] overflow-hidden relative`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
    </div>
  )
}

function BentoCard({ item, index }) {
  const IconComponent = LucideIcons[item.icon_name] || LucideIcons.Zap

  return (
    <motion.div
      initial={{ opacity: 0, y: 48, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.55,
        delay: index * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`
        ${sizeClasses[item.grid_size] || sizeClasses.normal}
        group relative overflow-hidden rounded-2xl cursor-default
        border border-white/[0.06]
        bg-[#080808]
        transition-[box-shadow,border-color] duration-300
        hover:border-[#ccff00]/25
        hover:[box-shadow:0_0_0_1px_#ccff0018,0_0_30px_#ccff0010,inset_0_0_20px_#ccff0006]
      `}
    >
      {/* Background image with parallax-lite */}
      {item.image_url && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-18 group-hover:scale-105 transition-all duration-700"
          style={{ backgroundImage: `url(${item.image_url})` }}
        />
      )}

      {/* Neon top edge */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#ccff00]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

      {/* Neon corner accent */}
      <div className="absolute top-0 left-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 0 0, #ccff0014 0%, transparent 70%)' }}
      />

      <div className="relative z-10 p-6 h-full flex flex-col justify-between min-h-[200px]">
        <div>
          {/* Icon */}
          <motion.div
            whileHover={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#ccff00]/8 mb-5 group-hover:bg-[#ccff00]/16 transition-colors duration-300 border border-[#ccff00]/10 group-hover:border-[#ccff00]/30"
          >
            <IconComponent size={20} className="text-[#ccff00]" />
          </motion.div>

          <h3 className="text-base font-bold text-white leading-snug mb-2 group-hover:text-white transition-colors">
            {item.title}
          </h3>
          <p className="text-white/40 text-sm leading-relaxed group-hover:text-white/55 transition-colors duration-300">
            {item.description}
          </p>
        </div>

        {/* Bottom neon line reveal */}
        <div className="mt-6 h-px w-0 group-hover:w-full bg-gradient-to-r from-[#ccff00]/40 to-transparent transition-all duration-500" />
      </div>
    </motion.div>
  )
}

/**
 * BentoGrid
 * Props: services (array from useGymData), loading (bool)
 */
export default function BentoGrid({ services = [], loading = false }) {
  const skeletonSizes = [
    'col-span-2 row-span-2', 'col-span-1 row-span-1', 'col-span-1 row-span-1',
    'col-span-1 row-span-2', 'col-span-1 row-span-1', 'col-span-1 row-span-1',
  ]

  return (
    <section id="services" className="py-24 px-6 md:px-12 bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <span className="inline-flex items-center gap-3 text-[#ccff00] text-xs font-bold uppercase tracking-[0.3em]">
              <span className="w-6 h-px bg-[#ccff00]" />
              Servicios
            </span>
            <h2 className="mt-3 text-[clamp(2rem,5vw,4.5rem)] font-black uppercase leading-[0.9] text-white">
              Todo lo que<br />
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: '2px #ffffff' }}
              >
                Necesitas
              </span>
            </h2>
          </div>
          <p className="max-w-xs text-white/30 text-sm leading-relaxed hidden md:block">
            Equipamiento de clase mundial. Coaches certificados. Resultados reales.
          </p>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[220px] gap-4">
            {skeletonSizes.map((cls, i) => (
              <SkeletonCard key={i} className={cls} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[220px] gap-4">
            {services.map((item, i) => (
              <BentoCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
