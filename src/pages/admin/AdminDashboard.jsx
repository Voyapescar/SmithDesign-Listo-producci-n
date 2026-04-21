import { useState, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../hooks/useAuth'
import { useSupabaseQuery, useSiteContent } from '../../hooks/useSupabaseQuery'
import AdminLayout from '../../components/AdminLayout'
import {
  Save, Loader2, CheckCircle2, XCircle, Plus, Trash2, Upload,
} from 'lucide-react'

// ─── Toast ───────────────────────────────────────────────
function ToastStack({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 8,  scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-medium shadow-2xl ${
              t.type === 'error'
                ? 'bg-[#1a0505]/95 border border-red-500/25 text-red-300'
                : 'bg-[#040f07]/95 border border-[#ccff00]/25 text-[#ccff00]'
            }`}
          >
            {t.type === 'error' ? <XCircle size={15} /> : <CheckCircle2 size={15} />}
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// ─── Shared input style ──────────────────────────────────
const inputCls =
  'w-full bg-[#0d0d0d] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm ' +
  'placeholder-white/20 focus:outline-none focus:border-[#ccff00]/60 transition-colors'

// ─── Field ───────────────────────────────────────────────
function Field({ label, register, name, type = 'text', placeholder, rows, className = '' }) {
  const cls = rows ? `${inputCls} resize-none` : inputCls
  return (
    <div className={className}>
      <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30 mb-2">
        {label}
      </label>
      {rows
        ? <textarea rows={rows} placeholder={placeholder} {...register(name)} className={cls} />
        : <input type={type} placeholder={placeholder} {...register(name)} className={cls} />
      }
    </div>
  )
}

// ─── Select ──────────────────────────────────────────────
function Select({ label, value, onChange, options, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30 mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`${inputCls} cursor-pointer`}
        style={{ background: '#0d0d0d' }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

// ─── SaveBtn ─────────────────────────────────────────────
function SaveBtn({ saving, saved, label = 'Guardar', onClick }) {
  return (
    <button
      type={onClick ? 'button' : 'submit'}
      onClick={onClick}
      disabled={saving}
      className="flex items-center gap-2 bg-[#ccff00] text-black font-bold text-xs uppercase tracking-[0.15em] px-6 py-3 rounded-xl hover:bg-white transition-all disabled:opacity-40"
    >
      {saving
        ? <Loader2 size={13} className="animate-spin" />
        : saved ? <CheckCircle2 size={13} /> : <Save size={13} />
      }
      {saving ? 'Guardando...' : saved ? '¡Guardado!' : label}
    </button>
  )
}

// ─── SiteContentPanel ────────────────────────────────────
function SiteContentPanel({ toast }) {
  const { content, refetch } = useSiteContent()
  const { register, handleSubmit } = useForm({ values: content })
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  const onSubmit = async (data) => {
    if (!supabase) { toast('Supabase no configurado', 'error'); return }
    setSaving(true)
    try {
      const updates = Object.entries(data).map(([key, value]) => ({ key, value }))
      for (const row of updates) {
        await supabase.from('site_content').upsert(row, { onConflict: 'key' })
      }
      toast('Contenido guardado correctamente')
      setSaved(true)
      refetch()
      setTimeout(() => setSaved(false), 3000)
    } catch {
      toast('Error al guardar', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Título Hero"    register={register} name="hero_title" />
        <Field label="CTA Hero"       register={register} name="hero_cta" />
      </div>
      <Field label="Subtítulo Hero"   register={register} name="hero_subtitle" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Título About"   register={register} name="about_title" />
        <Field label="Tagline Footer" register={register} name="footer_tagline" />
      </div>
      <Field label="Texto About" register={register} name="about_text" rows={4} />
      <div className="pt-2">
        <SaveBtn saving={saving} saved={saved} />
      </div>
    </form>
  )
}

// ─── BentoPanel ──────────────────────────────────────────
const ICON_OPTIONS = [
  'Users','HeartPulse','Dumbbell','ShowerHead','Coffee','Trophy',
  'Zap','Flame','Apple','Wind','UserCheck','BarChart2','Activity',
  'Bike','Star','Heart','Shield','Clock',
].map(v => ({ value: v, label: v }))

const SIZE_OPTIONS = [
  { value: 'normal', label: 'Normal (1×1)' },
  { value: 'wide',   label: 'Ancho  (2×1)' },
  { value: 'tall',   label: 'Alto   (1×2)' },
  { value: 'large',  label: 'Grande (2×2)' },
]

function BentoPanel({ toast }) {
  const { data: services, loading, refetch } = useSupabaseQuery('services_bento', { orderBy: 'sort_order' })
  const [saving, setSaving] = useState(null)

  const update = async (id, field, value) => {
    if (!supabase) { toast('Supabase no configurado', 'error'); return }
    setSaving(id)
    try {
      await supabase.from('services_bento').update({ [field]: value }).eq('id', id)
      toast('Servicio actualizado')
    } catch {
      toast('Error al guardar', 'error')
    } finally {
      setSaving(null)
    }
  }

  const add = async () => {
    if (!supabase) { toast('Supabase no configurado', 'error'); return }
    await supabase.from('services_bento').insert({
      title: 'Nuevo Servicio',
      description: 'Descripción del servicio.',
      icon_name: 'Zap',
      grid_size: 'normal',
      sort_order: (services?.length || 0) + 1,
    })
    toast('Servicio añadido')
    refetch()
  }

  const remove = async (id) => {
    if (!window.confirm('¿Eliminar este servicio?')) return
    if (!supabase) { toast('Supabase no configurado', 'error'); return }
    await supabase.from('services_bento').delete().eq('id', id)
    toast('Servicio eliminado')
    refetch()
  }

  if (loading) return <p className="text-white/30 text-sm animate-pulse">Cargando servicios...</p>

  return (
    <div className="space-y-4 max-w-3xl">
      {services?.map(svc => (
        <div key={svc.id} className="bg-[#0d0d0d] rounded-2xl p-5 border border-white/[0.06] space-y-4">
          {/* Row header */}
          <div className="flex items-center justify-between">
            <span className="text-white/20 text-[10px] uppercase tracking-widest font-bold">
              #{svc.sort_order}
              {saving === svc.id && <Loader2 size={10} className="text-[#ccff00] animate-spin inline ml-2" />}
            </span>
            <button onClick={() => remove(svc.id)} className="text-white/20 hover:text-red-400 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30 mb-2">Título</label>
              <input
                defaultValue={svc.title}
                onBlur={e => update(svc.id, 'title', e.target.value)}
                className={inputCls}
              />
            </div>
            {/* Icon + Size */}
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Icono"
                value={svc.icon_name}
                onChange={v => update(svc.id, 'icon_name', v)}
                options={ICON_OPTIONS}
              />
              <Select
                label="Tamaño"
                value={svc.grid_size}
                onChange={v => update(svc.id, 'grid_size', v)}
                options={SIZE_OPTIONS}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30 mb-2">Descripción</label>
            <textarea
              rows={2}
              defaultValue={svc.description}
              onBlur={e => update(svc.id, 'description', e.target.value)}
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>
      ))}

      <button
        onClick={add}
        className="flex items-center justify-center gap-2 w-full border border-dashed border-white/10 text-white/30 hover:border-[#ccff00]/40 hover:text-[#ccff00] text-xs uppercase tracking-widest px-5 py-4 rounded-xl transition-all"
      >
        <Plus size={14} /> Añadir Servicio
      </button>
    </div>
  )
}

// ─── PlanCard ────────────────────────────────────────────
function PlanCard({ plan, saving, onUpdate, onUpdateFeatures, onRemove }) {
  const [features, setFeatures] = useState(plan.features || [])

  const addFeature    = () => setFeatures(f => [...f, ''])
  const removeFeature = (i) => {
    const next = features.filter((_, idx) => idx !== i)
    setFeatures(next)
    onUpdateFeatures(plan.id, next.filter(Boolean))
  }
  const changeFeature = (i, val) => setFeatures(f => { const n = [...f]; n[i] = val; return n })
  const saveFeatures  = () => onUpdateFeatures(plan.id, features.filter(Boolean))

  return (
    <div className="bg-[#0d0d0d] rounded-2xl p-6 border border-white/[0.06] space-y-5">
      {/* Plan header */}
      <div className="flex items-center gap-3 pb-3 border-b border-white/[0.05]">
        <span className="text-[#ccff00] font-black text-sm uppercase tracking-widest flex-1">{plan.name}</span>
        {saving === plan.id && <Loader2 size={14} className="text-[#ccff00] animate-spin" />}
        <button onClick={() => onRemove(plan.id)} className="text-white/20 hover:text-red-400 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30 mb-2">Nombre</label>
          <input defaultValue={plan.name} onBlur={e => onUpdate(plan.id, 'name', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30 mb-2">Precio ($)</label>
          <input
            type="text"
            inputMode="numeric"
            defaultValue={Number(plan.price).toLocaleString('es-CL')}
            onBlur={e => {
              // Accept both "15.000" (Chilean) and "15000" — strip dots used as thousands sep
              const raw = parseFloat(e.target.value.replace(/\./g, '').replace(',', '.'))
              if (!isNaN(raw)) onUpdate(plan.id, 'price', raw)
            }}
            className={inputCls}
            placeholder="ej: 15.000"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30 mb-2">Período</label>
          <input defaultValue={plan.billing_period} onBlur={e => onUpdate(plan.id, 'billing_period', e.target.value)} className={inputCls} placeholder="mes" />
        </div>
      </div>

      {/* Dynamic features */}
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30 mb-3">
          Características
        </label>
        <div className="space-y-2">
          {features.map((f, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={f}
                onChange={e => changeFeature(i, e.target.value)}
                onBlur={saveFeatures}
                placeholder={`Característica ${i + 1}`}
                className={`${inputCls} flex-1`}
              />
              <button
                type="button"
                onClick={() => removeFeature(i)}
                className="px-3 text-white/20 hover:text-red-400 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addFeature}
            className="flex items-center gap-2 text-white/25 hover:text-[#ccff00] text-xs uppercase tracking-widest transition-colors py-2"
          >
            <Plus size={13} /> Añadir característica
          </button>
        </div>
      </div>

      {/* Highlight toggle */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <button
          type="button"
          onClick={() => onUpdate(plan.id, 'highlight_neon', !plan.highlight_neon)}
          className={`w-10 h-5 rounded-full relative transition-colors flex-shrink-0 ${plan.highlight_neon ? 'bg-[#ccff00]' : 'bg-white/10'}`}
          aria-checked={plan.highlight_neon}
          role="switch"
        >
          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${plan.highlight_neon ? 'left-5' : 'left-0.5'}`} />
        </button>
        <span className="text-white/40 text-sm group-hover:text-white/60 transition-colors">Destacado (neón)</span>
      </label>
    </div>
  )
}

// ─── PlansPanel ──────────────────────────────────────────
function PlansPanel({ toast }) {
  const { data: plans, loading, refetch } = useSupabaseQuery('plans', { orderBy: 'sort_order' })
  const [saving, setSaving] = useState(null)

  const update = async (id, field, value) => {
    if (!supabase) { toast('Supabase no configurado', 'error'); return }
    setSaving(id)
    try {
      await supabase.from('plans').update({ [field]: value }).eq('id', id)
      toast('Plan actualizado')
    } catch {
      toast('Error al guardar', 'error')
    } finally {
      setSaving(null)
    }
  }

  const updateFeatures = async (id, features) => {
    if (!supabase) { toast('Supabase no configurado', 'error'); return }
    try {
      await supabase.from('plans').update({ features }).eq('id', id)
      toast('Características guardadas')
      refetch()
    } catch {
      toast('Error al guardar', 'error')
    }
  }

  const remove = async (id) => {
    if (!window.confirm('¿Eliminar este plan?')) return
    if (!supabase) { toast('Supabase no configurado', 'error'); return }
    await supabase.from('plans').delete().eq('id', id)
    toast('Plan eliminado')
    refetch()
  }

  const add = async () => {
    if (!supabase) { toast('Supabase no configurado', 'error'); return }
    await supabase.from('plans').insert({
      name: 'Nuevo Plan', price: 0, billing_period: 'mes', features: [], highlight_neon: false,
      sort_order: (plans?.length || 0) + 1,
    })
    toast('Plan añadido')
    refetch()
  }

  if (loading) return <p className="text-white/30 text-sm animate-pulse">Cargando planes...</p>

  return (
    <div className="space-y-5 max-w-3xl">
      {plans?.map(plan => (
        <PlanCard
          key={plan.id}
          plan={plan}
          saving={saving}
          onUpdate={update}
          onUpdateFeatures={updateFeatures}
          onRemove={remove}
        />
      ))}
      <button
        onClick={add}
        className="flex items-center justify-center gap-2 w-full border border-dashed border-white/10 text-white/30 hover:border-[#ccff00]/40 hover:text-[#ccff00] text-xs uppercase tracking-widest px-5 py-4 rounded-xl transition-all"
      >
        <Plus size={14} /> Añadir Plan
      </button>
    </div>
  )
}

// ─── CarouselPanel ───────────────────────────────────────
const BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'smithdesign'

// Single slide row with its own replace-image upload
function SlideRow({ slide, onUpdate, onRemove, toast }) {
  const [uploading, setUploading] = useState(false)
  const [preview,   setPreview]   = useState(slide.image_url)

  const handleReplace = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !supabase) return
    if (!file.type.startsWith('image/')) {
      toast('El archivo debe ser una imagen', 'error')
      e.target.value = ''
      return
    }

    setUploading(true)
    try {
      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const safe = `carousel/${slide.id}_${Date.now()}_${cleanName}`
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(safe, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: '3600',
      })
      if (upErr) throw upErr

      const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(safe)
      const { error: dbErr } = await supabase
        .from('carousel_slides')
        .update({ image_url: publicUrl })
        .eq('id', slide.id)
      if (dbErr) throw dbErr

      setPreview(publicUrl)
      toast('Imagen actualizada')
    } catch (err) {
      const msg = err?.message || err?.error_description || 'Error al subir imagen'
      toast(msg, 'error')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="bg-[#0d0d0d] rounded-2xl p-4 border border-white/[0.06] flex gap-4 items-start">
      {/* Thumbnail + replace button */}
      <div className="relative flex-shrink-0 w-24 h-16">
        {preview
          ? <img src={preview} alt={slide.alt_text} className="w-24 h-16 object-cover rounded-xl border border-white/[0.06]" onError={e => { e.currentTarget.style.display = 'none' }} />
          : <div className="w-24 h-16 rounded-xl bg-[#080808] border border-white/[0.06] flex items-center justify-center"><Upload size={16} className="text-white/20" /></div>
        }
        <label className={`group absolute inset-0 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
          uploading ? 'bg-black/60' : 'bg-black/0 hover:bg-black/50'
        }`}>
          <input type="file" accept="image/*" className="hidden" onChange={handleReplace} disabled={uploading} />
          {uploading
            ? <Loader2 size={14} className="text-[#ccff00] animate-spin" />
            : <Upload size={14} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          }
        </label>
      </div>

      {/* Fields */}
      <div className="flex-1 space-y-2">
        <input
          defaultValue={slide.image_url}
          onBlur={e => { onUpdate(slide.id, 'image_url', e.target.value); setPreview(e.target.value) }}
          placeholder="URL de imagen"
          className={inputCls}
        />
        <input
          defaultValue={slide.alt_text}
          onBlur={e => onUpdate(slide.id, 'alt_text', e.target.value)}
          placeholder="Descripción de la imagen"
          className={inputCls}
        />
        <p className="text-white/20 text-[10px]">Pasa el cursor sobre la miniatura para reemplazar la imagen</p>
      </div>

      <button type="button" onClick={() => onRemove(slide.id)} className="text-white/20 hover:text-red-400 transition-colors mt-1 flex-shrink-0">
        <Trash2 size={14} />
      </button>
    </div>
  )
}

function CarouselPanel({ toast }) {
  const { data: slides, loading, refetch } = useSupabaseQuery('carousel_slides', { orderBy: 'sort_order' })
  const [adding, setAdding] = useState(false)

  const update = async (id, field, value) => {
    if (!supabase) { toast('Supabase no configurado', 'error'); return }
    try { await supabase.from('carousel_slides').update({ [field]: value }).eq('id', id) }
    catch { toast('Error al actualizar', 'error') }
  }

  const add = async () => {
    if (!supabase) { toast('Supabase no configurado', 'error'); return }
    setAdding(true)
    await supabase.from('carousel_slides').insert({
      image_url: '', alt_text: 'Nueva imagen', sort_order: (slides?.length || 0) + 1,
    })
    toast('Slide añadido')
    refetch()
    setAdding(false)
  }

  const remove = async (id) => {
    if (!window.confirm('¿Eliminar este slide?')) return
    if (!supabase) { toast('Supabase no configurado', 'error'); return }
    await supabase.from('carousel_slides').delete().eq('id', id)
    toast('Slide eliminado')
    refetch()
  }

  if (loading) return <p className="text-white/30 text-sm animate-pulse">Cargando galería...</p>

  return (
    <div className="space-y-4 max-w-3xl">
      {slides?.map(slide => (
        <SlideRow key={slide.id} slide={slide} onUpdate={update} onRemove={remove} toast={toast} />
      ))}
      <button
        type="button"
        onClick={add}
        disabled={adding}
        className="flex items-center gap-2 border border-dashed border-white/10 text-white/30 hover:border-[#ccff00]/40 hover:text-[#ccff00] text-xs uppercase tracking-widest px-5 py-3.5 rounded-xl transition-all disabled:opacity-40"
      >
        {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Añadir slide
      </button>
    </div>
  )
}

// ─── TeamMembersPanel ─────────────────────────────────────
function TeamMembersPanel({ toast }) {
  const { data: members, loading, refetch } = useSupabaseQuery('team_members', { orderBy: 'sort_order' })
  const [saving, setSaving] = useState(null)
  const [adding, setAdding] = useState(false)
  const [uploading, setUploading] = useState(null)

  const update = async (id, field, value) => {
    if (!supabase) { toast('Supabase no configurado', 'error'); return }
    setSaving(id)
    try {
      await supabase.from('team_members').update({ [field]: value }).eq('id', id)
      toast('Miembro actualizado')
    } catch {
      toast('Error al guardar', 'error')
    } finally {
      setSaving(null)
    }
  }

  const add = async () => {
    if (!supabase) { toast('Supabase no configurado', 'error'); return }
    setAdding(true)
    await supabase.from('team_members').insert({
      name: 'Nuevo Profesional', role: 'Especialidad', description: '', availability: 'Activa',
      sort_order: (members?.length || 0) + 1,
    })
    toast('Miembro añadido')
    refetch()
    setAdding(false)
  }

  const remove = async (id) => {
    if (!window.confirm('¿Eliminar este miembro del equipo?')) return
    if (!supabase) { toast('Supabase no configurado', 'error'); return }
    await supabase.from('team_members').delete().eq('id', id)
    toast('Miembro eliminado')
    refetch()
  }

  const handleImageUpload = async (id, file) => {
    if (!file || !supabase) return
    if (!file.type.startsWith('image/')) { toast('El archivo debe ser una imagen', 'error'); return }
    setUploading(id)
    try {
      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const path = `team/${id}_${Date.now()}_${cleanName}`
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true, contentType: file.type })
      if (upErr) throw upErr
      const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path)
      await supabase.from('team_members').update({ image_url: publicUrl }).eq('id', id)
      toast('Foto actualizada')
      refetch()
    } catch (err) {
      toast(err?.message || 'Error al subir imagen', 'error')
    } finally {
      setUploading(null)
    }
  }

  if (loading) return <p className="text-white/30 text-sm animate-pulse">Cargando equipo...</p>

  return (
    <div className="space-y-4 max-w-3xl">
      {members?.map(member => (
        <div key={member.id} className="bg-[#0d0d0d] rounded-2xl p-5 border border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white/20 text-[10px] uppercase tracking-widest font-bold">
              #{member.sort_order}
              {saving === member.id && <Loader2 size={10} className="text-[#ccff00] animate-spin inline ml-2" />}
            </span>
            <button onClick={() => remove(member.id)} className="text-white/20 hover:text-red-400 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>

          {/* Photo + fields row */}
          <div className="flex gap-4 items-start">
            {/* Avatar / upload */}
            <div className="relative flex-shrink-0 w-20 h-20">
              {member.image_url
                ? <img src={member.image_url} alt={member.name} className="w-20 h-20 rounded-xl object-cover border border-white/[0.06]" onError={e => { e.currentTarget.style.display = 'none' }} />
                : <div className="w-20 h-20 rounded-xl bg-[#080808] border border-white/[0.06] flex items-center justify-center"><Upload size={16} className="text-white/20" /></div>
              }
              <label className={`absolute inset-0 rounded-xl flex items-center justify-center cursor-pointer transition-all ${uploading === member.id ? 'bg-black/60' : 'bg-black/0 hover:bg-black/50'}`}>
                <input type="file" accept="image/*" className="hidden" disabled={uploading === member.id} onChange={e => { const f = e.target.files?.[0]; if (f) { handleImageUpload(member.id, f); e.target.value = '' } }} />
                {uploading === member.id
                  ? <Loader2 size={13} className="text-[#ccff00] animate-spin" />
                  : <Upload size={13} className="text-white opacity-0 hover:opacity-100 transition-opacity" />
                }
              </label>
            </div>

            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30 mb-1">Nombre</label>
                  <input defaultValue={member.name} onBlur={e => update(member.id, 'name', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30 mb-1">Especialidad</label>
                  <input defaultValue={member.role} onBlur={e => update(member.id, 'role', e.target.value)} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30 mb-1">Disponibilidad</label>
                <input defaultValue={member.availability} onBlur={e => update(member.id, 'availability', e.target.value)} className={inputCls} placeholder="Activa" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30 mb-1">Descripción</label>
            <textarea rows={2} defaultValue={member.description} onBlur={e => update(member.id, 'description', e.target.value)} className={`${inputCls} resize-none`} />
          </div>
        </div>
      ))}

      <button
        onClick={add}
        disabled={adding}
        className="flex items-center justify-center gap-2 w-full border border-dashed border-white/10 text-white/30 hover:border-[#ccff00]/40 hover:text-[#ccff00] text-xs uppercase tracking-widest px-5 py-4 rounded-xl transition-all disabled:opacity-40"
      >
        {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Añadir Profesional
      </button>
    </div>
  )
}

// ─── SchedulesPanel ───────────────────────────────────────
function SchedulesPanel({ toast }) {
  const { data: schedules, loading, refetch } = useSupabaseQuery('schedules', { orderBy: 'sort_order' })
  const [saving, setSaving] = useState(null)
  const [adding, setAdding] = useState(false)

  const update = async (id, field, value) => {
    if (!supabase) { toast('Supabase no configurado', 'error'); return }
    setSaving(id)
    try {
      await supabase.from('schedules').update({ [field]: value }).eq('id', id)
      toast('Horario actualizado')
    } catch {
      toast('Error al guardar', 'error')
    } finally {
      setSaving(null)
    }
  }

  const updateHours = async (id, hoursArr) => {
    if (!supabase) { toast('Supabase no configurado', 'error'); return }
    try {
      await supabase.from('schedules').update({ hours: hoursArr }).eq('id', id)
      toast('Horas guardadas')
    } catch {
      toast('Error al guardar', 'error')
    }
  }

  const add = async () => {
    if (!supabase) { toast('Supabase no configurado', 'error'); return }
    setAdding(true)
    await supabase.from('schedules').insert({
      label: 'Nuevo Horario', days: 'Lunes a Viernes', hours: ['9:00 – 18:00'], is_special: false,
      sort_order: (schedules?.length || 0) + 1,
    })
    toast('Horario añadido')
    refetch()
    setAdding(false)
  }

  const remove = async (id) => {
    if (!window.confirm('¿Eliminar este horario?')) return
    if (!supabase) { toast('Supabase no configurado', 'error'); return }
    await supabase.from('schedules').delete().eq('id', id)
    toast('Horario eliminado')
    refetch()
  }

  if (loading) return <p className="text-white/30 text-sm animate-pulse">Cargando horarios...</p>

  return (
    <div className="space-y-4 max-w-3xl">
      {schedules?.map(sched => (
        <ScheduleRow key={sched.id} sched={sched} saving={saving} onUpdate={update} onUpdateHours={updateHours} onRemove={remove} />
      ))}
      <button
        onClick={add}
        disabled={adding}
        className="flex items-center justify-center gap-2 w-full border border-dashed border-white/10 text-white/30 hover:border-[#ccff00]/40 hover:text-[#ccff00] text-xs uppercase tracking-widest px-5 py-4 rounded-xl transition-all disabled:opacity-40"
      >
        {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Añadir Horario
      </button>
    </div>
  )
}

function ScheduleRow({ sched, saving, onUpdate, onUpdateHours, onRemove }) {
  const [hours, setHours] = useState(sched.hours || [])

  const changeHour   = (i, val) => setHours(h => { const n = [...h]; n[i] = val; return n })
  const addHour      = () => setHours(h => [...h, ''])
  const removeHour   = (i) => { const next = hours.filter((_, idx) => idx !== i); setHours(next); onUpdateHours(sched.id, next.filter(Boolean)) }
  const saveHours    = () => onUpdateHours(sched.id, hours.filter(Boolean))

  return (
    <div className="bg-[#0d0d0d] rounded-2xl p-5 border border-white/[0.06] space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-white/20 text-[10px] uppercase tracking-widest font-bold">
          #{sched.sort_order}
          {saving === sched.id && <Loader2 size={10} className="text-[#ccff00] animate-spin inline ml-2" />}
        </span>
        <button onClick={() => onRemove(sched.id)} className="text-white/20 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30 mb-1">Etiqueta</label>
          <input defaultValue={sched.label} onBlur={e => onUpdate(sched.id, 'label', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30 mb-1">Días</label>
          <input defaultValue={sched.days} onBlur={e => onUpdate(sched.id, 'days', e.target.value)} className={inputCls} />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30 mb-2">Horas</label>
        <div className="space-y-2">
          {hours.map((h, i) => (
            <div key={i} className="flex gap-2">
              <input value={h} onChange={e => changeHour(i, e.target.value)} onBlur={saveHours} placeholder="ej: 8:00 – 13:00" className={`${inputCls} flex-1`} />
              <button type="button" onClick={() => removeHour(i)} className="px-3 text-white/20 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
            </div>
          ))}
          <button type="button" onClick={addHour} className="flex items-center gap-2 text-white/25 hover:text-[#ccff00] text-xs uppercase tracking-widest transition-colors py-2">
            <Plus size={13} /> Añadir hora
          </button>
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer group">
        <button
          type="button"
          onClick={() => onUpdate(sched.id, 'is_special', !sched.is_special)}
          className={`w-10 h-5 rounded-full relative transition-colors flex-shrink-0 ${sched.is_special ? 'bg-[#ccff00]' : 'bg-white/10'}`}
          aria-checked={sched.is_special}
          role="switch"
        >
          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${sched.is_special ? 'left-5' : 'left-0.5'}`} />
        </button>
        <span className="text-white/40 text-sm group-hover:text-white/60 transition-colors">Horario especial (resaltado en verde)</span>
      </label>
    </div>
  )
}

// ─── Page meta ───────────────────────────────────────────
const PAGE_META = {
  content:   { title: 'Textos del Sitio',   desc: 'Edita los textos del Hero y la sección About' },
  services:  { title: 'Servicios',           desc: 'Gestiona las tarjetas del Bento Grid' },
  plans:     { title: 'Planes & Membresías', desc: 'Edita precios, características y destacados' },
  carousel:  { title: 'Galería',             desc: 'Administra las imágenes del carrusel de fotos' },
  team:      { title: 'Equipo',              desc: 'Gestiona los miembros del equipo de profesionales' },
  schedules: { title: 'Horarios',            desc: 'Configura los horarios de apertura del gimnasio' },
}
// ─── AdminDashboard ──────────────────────────────────────
let _toastId = 0

export default function AdminDashboard() {
  const { session, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('content')
  const [toasts, setToasts] = useState([])

  const toast = useCallback((msg, type = 'success') => {
    const id = ++_toastId
    setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const meta = PAGE_META[activeTab]

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onSignOut={signOut}
      email={session?.user?.email}
    >
      <div className="px-8 md:px-12 py-10">
        {/* Page header */}
        <div className="mb-10 pb-8 border-b border-white/[0.05]">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">{meta.title}</h2>
          <p className="text-white/30 text-sm mt-1">{meta.desc}</p>
        </div>

        {/* Panel with enter animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0  }}
            exit={{    opacity: 0, y: -8  }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {activeTab === 'content'   && <SiteContentPanel toast={toast} />}
            {activeTab === 'services'  && <BentoPanel        toast={toast} />}
            {activeTab === 'plans'     && <PlansPanel         toast={toast} />}
            {activeTab === 'carousel'  && <CarouselPanel      toast={toast} />}
            {activeTab === 'team'      && <TeamMembersPanel   toast={toast} />}
            {activeTab === 'schedules' && <SchedulesPanel     toast={toast} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <ToastStack toasts={toasts} />
    </AdminLayout>
  )
}
