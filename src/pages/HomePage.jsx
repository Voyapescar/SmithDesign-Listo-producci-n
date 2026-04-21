import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import PhotoCarousel from '../components/PhotoCarousel'
import PlansSection from '../components/PlansSection'
import HorizontalScroll from '../components/HorizontalScroll'
import InstagramPanel from '../components/InstagramPanel'
import { useGymData } from '../hooks/useGymData'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

// ─── About panel (used as one of the horizontal panels) ───
function AboutPanel({ content, loading }) {
  return (
    <section className="relative h-full min-h-screen w-full flex items-center overflow-hidden px-5 sm:px-8 md:px-16 py-24 pb-32 md:py-0 md:pb-0">
      {/* ── Background video ── */}
      <video
        autoPlay muted loop playsInline preload="none"
        className="absolute inset-0 w-full h-full object-cover object-center"
        aria-hidden="true"
      >
        <source src="/images/video2.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/78" />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16 lg:gap-24">

        {/* ── Left: text ── */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="space-y-4">
              <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
              <div className="h-16 w-3/4 bg-white/5 rounded animate-pulse" />
              <div className="h-4 w-full bg-white/5 rounded animate-pulse mt-6" />
              <div className="h-4 w-5/6 bg-white/5 rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-white/5 rounded animate-pulse" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-flex items-center gap-3 text-[#ccff00] text-xs font-bold uppercase tracking-[0.3em]">
                <span className="w-6 h-px bg-[#ccff00]" />
                Nosotros
              </span>
              <h2 className="mt-4 text-[clamp(2.5rem,5vw,4.5rem)] font-black uppercase leading-[0.9] text-white">
                {content.about_title || 'Nuestra Filosofía'}
              </h2>
              <p className="mt-8 text-white/50 text-[clamp(0.95rem,1.4vw,1.15rem)] leading-relaxed max-w-lg">
                {content.about_text || ''}
              </p>
              <motion.div
                initial={{ scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4 }}
                className="mt-10 h-px bg-gradient-to-r from-[#ccff00] via-[#ccff00]/30 to-transparent max-w-xs"
              />
            </motion.div>
          )}
        </div>

        {/* ── Right: Instagram panel ── */}
        <motion.div
          initial={{ opacity: 0, x: 60, scale: 0.96 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex-shrink-0 w-full max-w-[34rem] flex justify-center md:justify-end mt-16 md:mt-10"
        >
          <InstagramPanel />
        </motion.div>

      </div>
    </section>
  )
}

function ProfessionalsSection({ members = [], loading }) {
  if (loading) {
    return (
      <section className="relative h-full min-h-screen w-full px-6 py-12 md:px-12 md:py-16 flex items-center overflow-hidden">
        <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {[0,1,2].map(i => (
            <div key={i} className="rounded-3xl bg-[#0d0d0d] min-h-[430px] border border-white/[0.04] animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section id="profesionales" className="relative h-full min-h-screen w-full px-6 py-24 md:px-12 md:py-16 flex items-center overflow-hidden">
      <video
        autoPlay muted loop playsInline preload="none"
        className="absolute inset-0 w-full h-full object-cover object-center"
        aria-hidden="true"
      >
        <source src="/images/video1.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/83" />

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-10 md:mb-12 max-w-3xl"
        >
          <span className="inline-flex items-center gap-3 text-[#ccff00] text-xs font-bold uppercase tracking-[0.3em]">
            <span className="w-6 h-px bg-[#ccff00]" />
            Profesionales
          </span>
          <h2 className="mt-3 text-[clamp(2rem,5vw,4.5rem)] font-black uppercase leading-[0.9] text-white">
            Equipo{' '}
            <span className="text-transparent" style={{ WebkitTextStroke: '2px #ffffff' }}>
              Experto
            </span>
          </h2>
          <p className="mt-4 text-white/50 text-sm md:text-base leading-relaxed">
            Entrenadores con enfoque tecnico, progresion medible y acompanamiento cercano para resultados reales.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch md:auto-rows-fr">
          {members.map((person, i) => (
            <motion.article
              key={person.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              className="group relative rounded-3xl overflow-hidden p-[1px]"
            >
              <div
                aria-hidden="true"
                className="absolute w-[280%] aspect-square top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 42%, #ccff0000 44%, #ccff00 48%, #e6ff80 50%, #ccff00 52%, #ccff0000 56%, transparent 58%)',
                  animation: `neon-border-rotate 2.8s linear infinite, ${['neon-seq-0', 'neon-seq-1', 'neon-seq-2'][i] ?? 'neon-seq-0'} 7.5s linear infinite`,
                }}
              />

              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#ccff00]/40 via-white/10 to-white/10 opacity-65 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative h-full min-h-[430px] rounded-[22px] border border-white/[0.06] bg-[#090909] overflow-hidden flex flex-col">
                <div className="relative h-56 overflow-hidden">
                  {person.image_url
                    ? <img src={person.image_url} alt={person.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                    : <div className="w-full h-full bg-[#111] flex items-center justify-center"><span className="text-5xl font-black text-white/10 uppercase">{person.name?.[0]}</span></div>
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                  <span className="absolute top-4 left-4 rounded-full border border-[#ccff00]/40 bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#ccff00]">
                    Elite Coach
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-[#ccff00] text-[11px] font-bold uppercase tracking-[0.22em]">
                    {person.role}
                  </p>
                  <h3 className="mt-2 text-[1.65rem] leading-none font-black tracking-tight text-white">
                    {person.name}
                  </h3>
                  <p className="mt-4 text-white/60 leading-relaxed text-sm flex-1">
                    {person.description}
                  </p>

                  <div className="mt-5 pt-4 border-t border-white/[0.07] flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-white/35">Disponibilidad</span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#ccff00]">{person.availability || 'Activa'}</span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ScheduleSection({ schedules = [] }) {
  return (
    <section id="horarios" className="relative h-full min-h-screen w-full px-6 py-24 md:px-12 md:py-16 flex items-center overflow-hidden">
      <video
        autoPlay muted loop playsInline preload="none"
        className="absolute inset-0 w-full h-full object-cover object-center"
        aria-hidden="true"
      >
        <source src="/images/video3.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/84" />

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 md:mb-12 max-w-3xl"
        >
          <span className="inline-flex items-center gap-3 text-[#ccff00] text-xs font-bold uppercase tracking-[0.3em]">
            <span className="w-6 h-px bg-[#ccff00]" />
            Horarios
          </span>
          <h2 className="mt-3 text-[clamp(2rem,5vw,4.5rem)] font-black uppercase leading-[0.9] text-white">
            Siempre{' '}
            <span className="text-transparent" style={{ WebkitTextStroke: '2px #ffffff' }}>
              Disponible
            </span>
          </h2>
          <p className="mt-4 text-white/50 text-sm md:text-base leading-relaxed">
            Horarios estructurados para que organices tu entrenamiento sin friccion, todos los dias.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch md:auto-rows-fr">
          {schedules.map(({ label, days, hours, is_special }, i) => {
            const seqAnims = ['neon-seq-0', 'neon-seq-1', 'neon-seq-2']
            const seqAnim  = seqAnims[i] ?? seqAnims[0]
            return (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 60, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                whileHover={{ y: -4 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-3xl overflow-hidden p-[2px] h-full"
              >
                <div
                  aria-hidden="true"
                  className="absolute w-[300%] aspect-square top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 42%, #ccff0000 44%, #ccff00 48%, #e6ff80 50%, #ccff00 52%, #ccff0000 56%, transparent 58%)',
                    animation: `neon-border-rotate 2.5s linear infinite, ${seqAnim} 7.5s linear infinite`,
                  }}
                />

                <div className="relative flex flex-col rounded-[22px] p-6 sm:p-7 z-10 overflow-hidden h-full min-h-[430px] bg-[#080808] text-white">
                  <div className="mb-7">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-3 text-white/35">
                      {label}
                    </p>
                    <p className="text-white/55 text-sm font-medium">{days}</p>
                  </div>

                  <div className="h-px mb-6 bg-white/[0.06]" />

                  <div className="flex-1 space-y-3.5">
                    {hours.map(h => (
                      <p key={h} className={`font-black tracking-tight leading-none ${is_special ? 'text-[#ccff00] text-[2rem]' : 'text-white text-[1.7rem]'}`}>
                        {h}
                      </p>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/[0.07] flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-white/35">Estado</span>
                    <span className={`text-[11px] font-semibold uppercase tracking-[0.15em] ${is_special ? 'text-[#ccff00]' : 'text-white/80'}`}>
                      {is_special ? 'Horario Premium' : 'Disponible'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Main page ────────────────────────────────────────────
export default function HomePage() {
  const { content, slides, plans, teamMembers, schedules, loading } = useGymData()

  return (
    <main className="bg-black text-white">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────── */}
      <HeroSection content={content} dataLoaded={!loading} />

      {/* ── HORIZONTAL EXPERIENCE (All sections to the right) ── */}
      <div id="nosotros">
        <HorizontalScroll>
          <AboutPanel content={content} loading={loading} />
          <div id="plans" className="h-full w-full overflow-hidden">
            <PlansSection plans={plans || []} loading={loading} />
          </div>
          <div id="gallery" className="h-full w-full overflow-hidden">
            <PhotoCarousel slides={slides || []} loading={loading} />
          </div>
          <div className="h-full w-full overflow-hidden">
            <ProfessionalsSection members={teamMembers || []} loading={loading} />
          </div>
          <div className="h-full w-full overflow-hidden">
            <ScheduleSection schedules={schedules || []} />
          </div>
        </HorizontalScroll>
      </div>

      <a
        href="https://wa.me/56900000000"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribenos por WhatsApp"
        className="fixed bottom-6 right-6 z-[70] group"
      >
        <div className="absolute inset-0 rounded-full bg-[#ccff00]/30 blur-xl group-hover:bg-[#ccff00]/45 transition-colors duration-300" />
        <div className="relative w-14 h-14 rounded-full border border-[#ccff00]/70 bg-black/85 backdrop-blur-md flex items-center justify-center text-[#ccff00] shadow-[0_0_24px_#ccff0088,0_0_52px_#ccff0044] group-hover:scale-105 transition-transform duration-200">
          <MessageCircle size={24} strokeWidth={2.2} />
        </div>
      </a>
    </main>
  )
}
