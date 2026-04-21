import { Type, Image, CreditCard, LayoutGrid, LogOut, ExternalLink, Dumbbell, Users, Clock } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'content',   label: 'Textos',    icon: Type,       desc: 'Hero & About'      },
  { id: 'services',  label: 'Servicios', icon: LayoutGrid, desc: 'Bento Grid'         },
  { id: 'plans',     label: 'Planes',    icon: CreditCard, desc: 'Membresías'         },
  { id: 'carousel',  label: 'Galería',   icon: Image,      desc: 'Carrusel'           },
  { id: 'team',      label: 'Equipo',    icon: Users,      desc: 'Profesionales'      },
  { id: 'schedules', label: 'Horarios',  icon: Clock,      desc: 'Horas de apertura'  },
]

export default function AdminLayout({ children, activeTab, onTabChange, onSignOut, email }) {
  return (
    <div className="min-h-screen bg-[#030303] text-white flex">

      {/* ── Sidebar (fixed) ──────────────────────────────── */}
      <aside className="w-60 flex-shrink-0 fixed top-0 left-0 bottom-0 border-r border-white/[0.06] flex flex-col z-40 bg-[#030303]">

        {/* Branding */}
        <div className="px-5 py-7 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center flex-shrink-0">
              <Dumbbell size={15} className="text-[#ccff00]" />
            </div>
            <div>
              <p className="text-white font-black text-sm uppercase tracking-tight leading-none">
                Smith<span className="text-[#ccff00]">Design</span>
              </p>
              <p className="text-white/20 text-[9px] mt-0.5 uppercase tracking-widest">Panel Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/15 px-3 pb-3">Contenido</p>
          {NAV_ITEMS.map(({ id, label, icon: Icon, desc }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left group ${
                  active
                    ? 'bg-[#ccff00]/10 border border-[#ccff00]/15'
                    : 'border border-transparent hover:bg-white/[0.03]'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  active ? 'bg-[#ccff00]/15' : 'bg-white/[0.04] group-hover:bg-white/[0.07]'
                }`}>
                  <Icon size={14} className={active ? 'text-[#ccff00]' : 'text-white/35'} />
                </div>
                <div className="min-w-0">
                  <p className={`font-semibold text-[13px] leading-tight ${active ? 'text-white' : 'text-white/45'}`}>
                    {label}
                  </p>
                  <p className={`text-[10px] leading-tight ${active ? 'text-white/35' : 'text-white/20'}`}>
                    {desc}
                  </p>
                </div>
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#ccff00] flex-shrink-0" />}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/[0.06] space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/30 hover:text-white hover:bg-white/[0.03] text-sm transition-all"
          >
            <ExternalLink size={14} />
            <span>Ver Sitio Web</span>
          </a>
          <button
            onClick={onSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-950/20 text-sm transition-all"
          >
            <LogOut size={14} />
            <span>Cerrar Sesión</span>
          </button>
          {email && (
            <p className="px-3 pt-3 text-[9px] text-white/15 truncate font-mono">{email}</p>
          )}
        </div>
      </aside>

      {/* ── Content area ─────────────────────────────────── */}
      <main className="flex-1 ml-60 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
