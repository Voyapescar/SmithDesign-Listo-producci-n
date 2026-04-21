import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

const DEFAULT_CONTENT = {
  hero_title:    'FORJA TU\nLÍMITE',
  hero_subtitle: '¿Quieres mejorar tu estado físico? Ven y conoce los planes que tenemos especialmente para ti.',

  hero_cta:      'Empieza Ahora',
  about_title:   'Más Que Un Gimnasio',
  about_text:    'Smith Design ofrece una experiencia de entrenamiento integral y profesional. Contamos con 4 entrenadores de distintas disciplinas y un Kinesiólogo para garantizar un entrenamiento seguro y efectivo. Nuestras instalaciones incluyen variedad de máquinas, baños equipados y casilleros. También contamos con una cafetería y un espacio de juegos de mesa — un lugar diseñado para que te sientas cómodo, alcances tus metas de estética o Powerlifting y disfrutes de tu vida social.',
  footer_tagline:'POWER. FOCUS. ELITE.',
}

const MOCK_SERVICES = [
  { id: 1, title: 'Entrenadores Especializados', description: '4 entrenadores de distintas disciplinas listos para guiarte con planes 100 % personalizados según tus objetivos.',          icon_name: 'Users',     image_url: null, grid_size: 'large',  sort_order: 1 },
  { id: 2, title: 'Kinesiólogo en Planta',      description: 'Supervisión profesional de un Kinesiólogo para que entrenes de forma segura, previniendo lesiones en cada sesión.',        icon_name: 'HeartPulse',image_url: null, grid_size: 'wide',   sort_order: 2 },
  { id: 3, title: 'Equipamiento Completo',      description: 'Amplia variedad de máquinas y equipos de última generación para trabajar cada grupo muscular.',                             icon_name: 'Dumbbell',  image_url: null, grid_size: 'normal', sort_order: 3 },
  { id: 4, title: 'Baños & Casilleros',         description: 'Baños completamente equipados y casilleros de seguridad para que llegues y salgas sin preocupaciones.',                    icon_name: 'ShowerHead',image_url: null, grid_size: 'normal', sort_order: 4 },
  { id: 5, title: 'Cafetería & Juegos',         description: 'Café de calidad y un espacio de juegos de mesa — porque el bienestar también está en compartir y disfrutar.',              icon_name: 'Coffee',    image_url: null, grid_size: 'tall',   sort_order: 5 },
  { id: 6, title: 'Powerlifting & Estética',    description: 'Infraestructura y metodología preparada tanto para metas estéticas como para atletas de Powerlifting de competición.',    icon_name: 'Trophy',    image_url: null, grid_size: 'normal', sort_order: 6 },
]

const MOCK_SLIDES = [
  { id: 1, image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80', alt_text: 'Zona de cardio de alto rendimiento',  sort_order: 1 },
  { id: 2, image_url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&q=80', alt_text: 'Entrenamiento funcional en grupo',     sort_order: 2 },
  { id: 3, image_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1600&q=80', alt_text: 'Área de pesas libre',                  sort_order: 3 },
  { id: 4, image_url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1600&q=80', alt_text: 'Clases de spinning de élite',          sort_order: 4 },
  { id: 5, image_url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1600&q=80', alt_text: 'Instalaciones de recuperación',        sort_order: 5 },
]

const MOCK_PLANS = [
  {
    id: 1, name: 'Básico', price: 15000, billing_period: 'mes', highlight_neon: false, sort_order: 1,
    features: ['Acceso a sala de pesas', 'Vestuarios y duchas', 'Horario completo'],
  },
  {
    id: 2, name: 'Estándar', price: 22000, billing_period: 'mes', highlight_neon: true, sort_order: 2,
    features: ['Acceso a sala de pesas', 'Vestuarios y duchas', 'Horario completo', 'Clases grupales incluidas', 'Seguimiento de entrenador'],
  },
  {
    id: 3, name: 'Premium', price: 32000, billing_period: 'mes', highlight_neon: false, sort_order: 3,
    features: ['Acceso a sala de pesas', 'Vestuarios y duchas', 'Horario completo', 'Clases grupales incluidas', 'Seguimiento de entrenador', 'Atención con kinesiólogo', 'Plan de entrenamiento personalizado'],
  },
]

const MOCK_TEAM = [
  { id: 1, name: 'Camila Torres',  role: 'Entrenadora de Fuerza',  description: 'Diseña planes progresivos para hipertrofia y rendimiento, con seguimiento semanal de cargas y tecnica.',                     image_url: null, availability: 'Activa', sort_order: 1 },
  { id: 2, name: 'Matias Rojas',   role: 'Coach de Funcional',     description: 'Especialista en movilidad y acondicionamiento metabolico para mejorar resistencia, coordinacion y postura.', image_url: null, availability: 'Activa', sort_order: 2 },
  { id: 3, name: 'Valentina Diaz', role: 'Kinesiologa Deportiva',  description: 'Evalua patrones de movimiento, previene lesiones y acompana la recuperacion para entrenar de forma segura.', image_url: null, availability: 'Activa', sort_order: 3 },
]

const MOCK_SCHEDULES = [
  { id: 1, label: 'Horario Regular',  days: 'Lunes a Viernes',    hours: ['8:00 – 13:00', '15:00 – 22:00'], is_special: false, sort_order: 1 },
  { id: 2, label: 'Fin de Semana',    days: 'Sábados y Domingos', hours: ['9:00 – 14:00'],                  is_special: false, sort_order: 2 },
  { id: 3, label: 'Horario Especial', days: 'Lunes a Viernes',    hours: ['6:00 – 8:00'],                   is_special: true,  sort_order: 3 },
]

/**
 * useGymData — fetches all four Supabase tables in parallel.
 * Falls back to built-in mock data when Supabase is not configured.
 */
export function useGymData() {
  const [content,     setContent]     = useState(DEFAULT_CONTENT)
  const [services,    setServices]    = useState(null)
  const [slides,      setSlides]      = useState(null)
  const [plans,       setPlans]       = useState(null)
  const [teamMembers, setTeamMembers] = useState(null)
  const [schedules,   setSchedules]   = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)

    // ── Offline / demo mode ───────────────────────────────
    if (!supabase) {
      setContent(DEFAULT_CONTENT)
      setServices(MOCK_SERVICES)
      setSlides(MOCK_SLIDES)
      setPlans(MOCK_PLANS)
      setTeamMembers(MOCK_TEAM)
      setSchedules(MOCK_SCHEDULES)
      setLoading(false)
      return
    }

    // ── Live Supabase fetch ───────────────────────────────
    try {
      const [
        { data: contentRows, error: e1 },
        { data: serviceRows, error: e2 },
        { data: slideRows,   error: e3 },
        { data: planRows,    error: e4 },
        { data: teamRows,    error: e5 },
        { data: scheduleRows, error: e6 },
      ] = await Promise.all([
        supabase.from('site_content').select('*'),
        supabase.from('services_bento').select('*').order('sort_order', { ascending: true }),
        supabase.from('carousel_slides').select('*').order('sort_order', { ascending: true }),
        supabase.from('plans').select('*').order('sort_order', { ascending: true }),
        supabase.from('team_members').select('*').order('sort_order', { ascending: true }),
        supabase.from('schedules').select('*').order('sort_order', { ascending: true }),
      ])

      const firstError = e1 || e2 || e3 || e4 || e5 || e6
      if (firstError) throw firstError

      if (contentRows) {
        setContent({
          ...DEFAULT_CONTENT,
          ...Object.fromEntries(contentRows.map(({ key, value }) => [key, value])),
        })
      }
      setServices(serviceRows || [])
      setSlides(slideRows || [])
      setPlans(planRows || [])
      setTeamMembers(teamRows || [])
      setSchedules(scheduleRows || [])
    } catch (err) {
      setError(err?.message || 'Error fetching data from Supabase.')
      // Fallback to mock data so the UI is never empty
      setServices(MOCK_SERVICES)
      setSlides(MOCK_SLIDES)
      setPlans(MOCK_PLANS)
      setTeamMembers(MOCK_TEAM)
      setSchedules(MOCK_SCHEDULES)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  return { content, services, slides, plans, teamMembers, schedules, loading, error, refetch: fetchAll }
}
