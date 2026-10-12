-- ==============================================================================
-- JobTracker Pro - Supabase Database Schema
-- ==============================================================================
-- Este script crea todas las tablas, restricciones, índices, políticas RLS
-- y disparadores necesarios para JobTracker Pro en Supabase.
-- Ejecuta este script completo en el SQL Editor de tu proyecto de Supabase.
-- ==============================================================================

-- 1. TABLA: profiles (Información de contacto y biblioteca de documentos del candidato)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    surname TEXT,
    email TEXT,
    phone TEXT,
    cvs TEXT[] DEFAULT '{}'::TEXT[],
    cover_letters TEXT[] DEFAULT '{}'::TEXT[],
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. TABLA: jobs (Candidaturas / Puestos de trabajo postulados)
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Wishlist' CHECK (status IN ('Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected')),
    applied_date DATE DEFAULT CURRENT_DATE,
    salary TEXT,
    location TEXT DEFAULT 'Remote' CHECK (location IN ('Remote', 'Hybrid', 'Onsite')),
    city TEXT,
    url TEXT,
    rating INTEGER DEFAULT 3 CHECK (rating >= 1 AND rating <= 5),
    description TEXT,
    cv_name TEXT,
    cover_letter_name TEXT,
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. TABLA: interviews (Rondas de entrevista por postulación)
CREATE TABLE IF NOT EXISTS public.interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL DEFAULT 'Technical' CHECK (type IN ('HR', 'Technical', 'Manager', 'Onsite', 'Other')),
    date TIMESTAMPTZ NOT NULL,
    interviewer TEXT NOT NULL,
    rating INTEGER DEFAULT 3 CHECK (rating >= 1 AND rating <= 5),
    notes TEXT,
    questions TEXT[] DEFAULT '{}'::TEXT[],
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. TABLA: job_history (Historial / Línea de tiempo de cambios de cada postulación)
CREATE TABLE IF NOT EXISTS public.job_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    date TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- ÍNDICES PARA ALTO RENDIMIENTO EN BÚSQUEDAS Y FILTROS
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON public.jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_interviews_job_id ON public.interviews(job_id);
CREATE INDEX IF NOT EXISTS idx_interviews_user_id ON public.interviews(user_id);
CREATE INDEX IF NOT EXISTS idx_job_history_job_id ON public.job_history(job_id);
CREATE INDEX IF NOT EXISTS idx_job_history_user_id ON public.job_history(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) - CADA USUARIO SOLO ACCEDE A SUS PROPIOS DATOS
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_history ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON public.profiles;
CREATE POLICY "Los usuarios pueden ver su propio perfil" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Los usuarios pueden crear su propio perfil" ON public.profiles;
CREATE POLICY "Los usuarios pueden crear su propio perfil" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON public.profiles;
CREATE POLICY "Los usuarios pueden actualizar su propio perfil" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Políticas para jobs
DROP POLICY IF EXISTS "Los usuarios pueden ver sus postulaciones" ON public.jobs;
CREATE POLICY "Los usuarios pueden ver sus postulaciones" 
    ON public.jobs FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Los usuarios pueden insertar postulaciones" ON public.jobs;
CREATE POLICY "Los usuarios pueden insertar postulaciones" 
    ON public.jobs FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus postulaciones" ON public.jobs;
CREATE POLICY "Los usuarios pueden actualizar sus postulaciones" 
    ON public.jobs FOR UPDATE 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Los usuarios pueden eliminar sus postulaciones" ON public.jobs;
CREATE POLICY "Los usuarios pueden eliminar sus postulaciones" 
    ON public.jobs FOR DELETE 
    USING (auth.uid() = user_id);

-- Políticas para interviews
DROP POLICY IF EXISTS "Los usuarios pueden ver sus entrevistas" ON public.interviews;
CREATE POLICY "Los usuarios pueden ver sus entrevistas" 
    ON public.interviews FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Los usuarios pueden insertar entrevistas" ON public.interviews;
CREATE POLICY "Los usuarios pueden insertar entrevistas" 
    ON public.interviews FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus entrevistas" ON public.interviews;
CREATE POLICY "Los usuarios pueden actualizar sus entrevistas" 
    ON public.interviews FOR UPDATE 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Los usuarios pueden eliminar sus entrevistas" ON public.interviews;
CREATE POLICY "Los usuarios pueden eliminar sus entrevistas" 
    ON public.interviews FOR DELETE 
    USING (auth.uid() = user_id);

-- Políticas para job_history
DROP POLICY IF EXISTS "Los usuarios pueden ver el historial de sus postulaciones" ON public.job_history;
CREATE POLICY "Los usuarios pueden ver el historial de sus postulaciones" 
    ON public.job_history FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Los usuarios pueden insertar eventos en su historial" ON public.job_history;
CREATE POLICY "Los usuarios pueden insertar eventos en su historial" 
    ON public.job_history FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Los usuarios pueden eliminar eventos de su historial" ON public.job_history;
CREATE POLICY "Los usuarios pueden eliminar eventos de su historial" 
    ON public.job_history FOR DELETE 
    USING (auth.uid() = user_id);

-- ==============================================================================
-- TRIGGER AUTOMÁTICO: Crear perfil al registrarse un nuevo usuario en auth.users
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, surname, email, phone, cvs, cover_letters)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), ' ', 1)),
        COALESCE(NEW.raw_user_meta_data->>'surname', split_part(COALESCE(NEW.raw_user_meta_data->>'full_name', ''), ' ', 2)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        ARRAY['CV_Principal.pdf']::TEXT[],
        ARRAY['Carta_Presentacion.pdf']::TEXT[]
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar trigger previo si existe para permitir re-ejecuciones limpias
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- TRIGGER PARA ACTUALIZAR 'updated_at' AUTOMÁTICAMENTE
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS tr_jobs_updated_at ON public.jobs;
CREATE TRIGGER tr_jobs_updated_at
    BEFORE UPDATE ON public.jobs
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ==============================================================================
-- 5. SUPABASE STORAGE: BUCKET PARA DOCUMENTOS (CVs y Cartas de Presentación)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Seguridad para storage.objects
DROP POLICY IF EXISTS "Permitir subida a usuarios autenticados" ON storage.objects;
CREATE POLICY "Permitir subida a usuarios autenticados"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

DROP POLICY IF EXISTS "Permitir lectura publica de documentos" ON storage.objects;
CREATE POLICY "Permitir lectura publica de documentos"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');

DROP POLICY IF EXISTS "Permitir eliminar sus propios documentos" ON storage.objects;
CREATE POLICY "Permitir eliminar sus propios documentos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

