# Guía de Conexión y Configuración - Supabase & PostgreSQL

Esta guía te explica paso a paso cómo conectar **JobTracker Pro** con tu proyecto en la nube de **Supabase** para almacenar todas las postulaciones, entrevistas, historiales y perfiles en una base de datos PostgreSQL real con seguridad RLS.

---

## 🚀 Paso 1: Crear tu Proyecto Gratuito en Supabase

1. Ve a [https://supabase.com/](https://supabase.com/) e inicia sesión (puedes usar tu cuenta de GitHub).
2. En tu panel principal, haz clic en **"New Project"**.
3. Rellena los datos:
   - **Name**: `jobtracker-pro` (o el nombre que prefieras).
   - **Database Password**: Genera o introduce una contraseña segura (guárdala en un lugar seguro).
   - **Region**: Elige una región cercana (ej: `EU (Frankfurt - eu-central-1)` o `EU (London - eu-west-2)`).
4. Haz clic en **"Create new project"** y espera ~1-2 minutos mientras Supabase provisiona tu base de datos PostgreSQL.

---

## 🗄️ Paso 2: Crear las Tablas y Políticas de Seguridad

Hemos preparado un script SQL con toda la estructura relacional, índices, triggers y seguridad por filas (RLS):

1. En el menú lateral izquierdo de tu proyecto de Supabase, haz clic en el icono **SQL Editor** (o pestaña con símbolo `>_`).
2. Haz clic en el botón verde **"New query"** (o "New snippet").
3. Abre el archivo [`supabase/schema.sql`](./supabase/schema.sql) de tu proyecto local, copia **todo su contenido** y pégalo en el editor de Supabase.
4. Haz clic en el botón **"Run"** (abajo a la derecha o presiona `Ctrl + Enter`).
5. Verás el mensaje **"Success. No rows returned"**. ¡Tus 4 tablas (`profiles`, `jobs`, `interviews`, `job_history`), los índices, las políticas RLS y los triggers ya están creados!

---

## 🔑 Paso 3: Obtener tus Claves de Conexión y Crear `.env`

1. En el menú lateral izquierdo de Supabase, haz clic en **Project Settings** (icono de engranaje en la parte inferior) y selecciona **API** (o en Supabase 2026: **Configuration -> API Keys**).
2. Localiza estos dos valores:
   - **Project URL** (ej: `https://abcdefghijklm.supabase.co`)
   - **Project API Keys** -> Copia la clave llamada **`anon` / `public`**.
3. En la raíz de este proyecto (`JobCRM`), crea un archivo llamado `.env` (puedes basarte en `.env.example`):
   ```env
   VITE_SUPABASE_URL=https://tu-id-de-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu_clave_anon_publica_aqui
   ```
4. Guarda el archivo `.env`.

---

## 🌐 Paso 4: Iniciar la Aplicación

1. En tu terminal, arranca el servidor de desarrollo:
   ```bash
   npm run dev
   ```
2. Abre la aplicación en tu navegador: [http://localhost:5173/](http://localhost:5173/)
3. Registra tu cuenta en la pantalla de bienvenida.
4. A partir de este momento:
   - Cada puesto que agregues se guardará en la tabla `jobs` de PostgreSQL.
   - Cada fase o entrevista técnica se guardará en la tabla `interviews`.
   - Cada cambio de estado en el Kanban se reflejará en `jobs` y en la tabla `job_history`.
   - Tu perfil y archivos se guardarán en la tabla `profiles`.
   - Nadie más que tú podrá acceder a tus postulaciones gracias a las políticas **Row Level Security (RLS)** activadas.

---

## 🔒 Paso 5: Autenticación con Google (Opcional)

Si deseas activar el inicio de sesión real con Google en producción:
1. En Supabase -> **Authentication** -> **Providers** -> activa **Google**.
2. Sigue las instrucciones de Supabase para obtener tu `Client ID` y `Client Secret` en la consola de Google Cloud.
3. Agrega la URL de redirección que te proporciona Supabase en tus credenciales de Google.
4. ¡El botón de Google iniciará sesión automáticamente con tu cuenta de Google!
