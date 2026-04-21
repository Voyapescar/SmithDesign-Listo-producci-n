-- ============================================================
--  SMITH DESIGN GYM — Supabase SQL Schema
--  Execute this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. SITE CONTENT  (key/value global texts)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_content (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed default content
INSERT INTO public.site_content (key, value) VALUES
  ('hero_title',       'FORJA TU LÍMITE'),
  ('hero_subtitle',    'El gimnasio de élite que te desafía a ir más allá.'),
  ('hero_cta',         'Empieza Ahora'),
  ('about_title',      'Nuestra Filosofía'),
  ('about_text',       'No somos un gimnasio convencional. Somos un laboratorio de rendimiento humano donde la tecnología, la ciencia y la disciplina se fusionan para llevarte al siguiente nivel.'),
  ('contact_email',    'info@smithdesigngym.com'),
  ('contact_phone',    '+34 900 000 000'),
  ('footer_tagline',   'POWER. FOCUS. ELITE.')
ON CONFLICT (key) DO NOTHING;

-- ─────────────────────────────────────────────
-- 2. SERVICES BENTO GRID
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.services_bento (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title       TEXT        NOT NULL,
  description TEXT        NOT NULL,
  icon_name   TEXT        NOT NULL DEFAULT 'Zap',   -- Lucide icon name
  image_url   TEXT,
  grid_size   TEXT        NOT NULL DEFAULT 'normal' -- 'normal' | 'wide' | 'tall' | 'large'
                           CHECK (grid_size IN ('normal','wide','tall','large')),
  sort_order  INT         NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

INSERT INTO public.services_bento (title, description, icon_name, image_url, grid_size, sort_order) VALUES
  ('Entrenamiento Personal',  'Coaches certificados de élite con planes 100 % personalizados.', 'UserCheck',    NULL, 'large',  1),
  ('Zona de Pesas Libre',     'Más de 500 m² con el equipamiento más avanzado del mercado.',    'Dumbbell',     NULL, 'wide',   2),
  ('Clases Funcionales',      'HIIT, CrossFit y MetCon en sesiones de alto rendimiento.',        'Flame',        NULL, 'normal', 3),
  ('Nutrición Deportiva',     'Plan nutricional integrado con seguimiento continuo.',            'Apple',        NULL, 'normal', 4),
  ('Recuperación & Spa',      'Crioterapia, sauna finlandesa y masajes de recuperación.',       'Wind',         NULL, 'tall',   5),
  ('App de Seguimiento',      'Dashboard personal con métricas en tiempo real.',                'BarChart2',    NULL, 'normal', 6)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────
-- 3. CAROUSEL SLIDES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.carousel_slides (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  image_url   TEXT        NOT NULL,
  alt_text    TEXT        NOT NULL DEFAULT '',
  sort_order  INT         NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

INSERT INTO public.carousel_slides (image_url, alt_text, sort_order) VALUES
  ('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80', 'Zona de cardio de alto rendimiento',   1),
  ('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&q=80', 'Entrenamiento funcional en grupo',      2),
  ('https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1600&q=80', 'Área de pesas libre',                   3),
  ('https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1600&q=80', 'Clases de spinning de élite',           4),
  ('https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1600&q=80', 'Instalaciones de recuperación',         5)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────
-- 4. MEMBERSHIP PLANS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.plans (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name            TEXT            NOT NULL,
  price           NUMERIC(8,2)    NOT NULL,
  billing_period  TEXT            NOT NULL DEFAULT 'mes' CHECK (billing_period IN ('mes','trimestre','año')),
  features        TEXT[]          NOT NULL DEFAULT '{}',
  highlight_neon  BOOLEAN         NOT NULL DEFAULT FALSE, -- true = neon green highlight card
  sort_order      INT             NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ     DEFAULT now()
);

INSERT INTO public.plans (name, price, billing_period, features, highlight_neon, sort_order) VALUES
  ('Básico',    15000, 'mes',
   ARRAY['Acceso a sala de pesas', 'Vestuarios y duchas', 'Horario completo'],
   FALSE, 1),
  ('Estándar',  22000, 'mes',
   ARRAY['Acceso a sala de pesas', 'Vestuarios y duchas', 'Horario completo', 'Clases grupales incluidas', 'Seguimiento de entrenador'],
   TRUE, 2),
  ('Premium',   32000, 'mes',
   ARRAY['Acceso a sala de pesas', 'Vestuarios y duchas', 'Horario completo', 'Clases grupales incluidas', 'Seguimiento de entrenador', 'Atención con kinesiólogo', 'Plan de entrenamiento personalizado'],
   FALSE, 3)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────
-- 5. TEAM MEMBERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.team_members (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name         TEXT        NOT NULL,
  role         TEXT        NOT NULL,
  description  TEXT        NOT NULL DEFAULT '',
  image_url    TEXT,
  availability TEXT        NOT NULL DEFAULT 'Activa',
  sort_order   INT         NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now()
);

INSERT INTO public.team_members (name, role, description, image_url, availability, sort_order) VALUES
  ('Camila Torres',  'Entrenadora de Fuerza',   'Diseña planes progresivos para hipertrofia y rendimiento, con seguimiento semanal de cargas y tecnica.',                                      NULL, 'Activa', 1),
  ('Matias Rojas',   'Coach de Funcional',       'Especialista en movilidad y acondicionamiento metabolico para mejorar resistencia, coordinacion y postura.',                                  NULL, 'Activa', 2),
  ('Valentina Diaz', 'Kinesiologa Deportiva',    'Evalua patrones de movimiento, previene lesiones y acompana la recuperacion para entrenar de forma segura.',                                  NULL, 'Activa', 3)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────
-- 6. SCHEDULES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.schedules (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  label       TEXT        NOT NULL,
  days        TEXT        NOT NULL,
  hours       TEXT[]      NOT NULL DEFAULT '{}',
  is_special  BOOLEAN     NOT NULL DEFAULT FALSE,
  sort_order  INT         NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

INSERT INTO public.schedules (label, days, hours, is_special, sort_order) VALUES
  ('Horario Regular',  'Lunes a Viernes',    ARRAY['8:00 – 13:00', '15:00 – 22:00'], FALSE, 1),
  ('Fin de Semana',    'Sábados y Domingos', ARRAY['9:00 – 14:00'],                  FALSE, 2),
  ('Horario Especial', 'Lunes a Viernes',    ARRAY['6:00 – 8:00'],                   TRUE,  3)
ON CONFLICT DO NOTHING;

-- ============================================================
--  ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.site_content    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_bento  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carousel_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules       ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────
-- PUBLIC: SELECT only (anonymous + authenticated)
-- ─────────────────────────────────────────────
DROP POLICY IF EXISTS "public_read_site_content"    ON public.site_content;
DROP POLICY IF EXISTS "public_read_services_bento"  ON public.services_bento;
DROP POLICY IF EXISTS "public_read_carousel_slides" ON public.carousel_slides;
DROP POLICY IF EXISTS "public_read_plans"           ON public.plans;
DROP POLICY IF EXISTS "public_read_team_members"    ON public.team_members;
DROP POLICY IF EXISTS "public_read_schedules"       ON public.schedules;

CREATE POLICY "public_read_site_content"
  ON public.site_content FOR SELECT
  USING (true);

CREATE POLICY "public_read_services_bento"
  ON public.services_bento FOR SELECT
  USING (true);

CREATE POLICY "public_read_carousel_slides"
  ON public.carousel_slides FOR SELECT
  USING (true);

CREATE POLICY "public_read_plans"
  ON public.plans FOR SELECT
  USING (true);

CREATE POLICY "public_read_team_members"
  ON public.team_members FOR SELECT
  USING (true);

CREATE POLICY "public_read_schedules"
  ON public.schedules FOR SELECT
  USING (true);

-- ─────────────────────────────────────────────
-- ADMIN: Full write access (authenticated users only)
-- For production, replace `auth.role() = 'authenticated'`
-- with a specific email check or a custom claim.
-- ─────────────────────────────────────────────
DROP POLICY IF EXISTS "admin_write_site_content"    ON public.site_content;
DROP POLICY IF EXISTS "admin_write_services_bento"  ON public.services_bento;
DROP POLICY IF EXISTS "admin_write_carousel_slides" ON public.carousel_slides;
DROP POLICY IF EXISTS "admin_write_plans"           ON public.plans;
DROP POLICY IF EXISTS "admin_write_team_members"    ON public.team_members;
DROP POLICY IF EXISTS "admin_write_schedules"       ON public.schedules;

CREATE POLICY "admin_write_site_content"
  ON public.site_content FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_write_services_bento"
  ON public.services_bento FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_write_carousel_slides"
  ON public.carousel_slides FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_write_plans"
  ON public.plans FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_write_team_members"
  ON public.team_members FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_write_schedules"
  ON public.schedules FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
--  HELPER: Auto-update updated_at on site_content
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_updated_at ON public.site_content;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
--  STORAGE (carousel uploads)
-- ============================================================
-- Create public bucket for carousel images (id = bucket name)
INSERT INTO storage.buckets (id, name, public)
VALUES ('smithdesign', 'smithdesign', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for uploaded objects in this bucket
DROP POLICY IF EXISTS "public_read_smithdesign_bucket" ON storage.objects;
CREATE POLICY "public_read_smithdesign_bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'smithdesign');

-- Authenticated admins can upload/update/delete images in this bucket
DROP POLICY IF EXISTS "auth_write_smithdesign_bucket_insert" ON storage.objects;
CREATE POLICY "auth_write_smithdesign_bucket_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'smithdesign');

DROP POLICY IF EXISTS "auth_write_smithdesign_bucket_update" ON storage.objects;
CREATE POLICY "auth_write_smithdesign_bucket_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'smithdesign')
  WITH CHECK (bucket_id = 'smithdesign');

DROP POLICY IF EXISTS "auth_write_smithdesign_bucket_delete" ON storage.objects;
CREATE POLICY "auth_write_smithdesign_bucket_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'smithdesign');
