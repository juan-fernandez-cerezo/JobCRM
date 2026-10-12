import React from 'react';
import { 
  FileText, 
  PhoneCall, 
  Award, 
  XOctagon, 
  ArrowUpRight, 
  Calendar, 
  Flame, 
  TrendingUp, 
  Briefcase 
} from 'lucide-react';

export default function Dashboard({ 
  jobs, 
  setActiveTab, 
  setSelectedJobId, 
  setIsAddModalOpen,
  profile,
  isSupabaseConfigured,
  seedDemoDataToSupabase
}) {
  // Compute metrics
  const total = jobs.length;
  const applied = jobs.filter(j => j.status === 'Applied').length;
  const interviewing = jobs.filter(j => j.status === 'Interviewing').length;
  const offers = jobs.filter(j => j.status === 'Offer').length;
  const rejected = jobs.filter(j => j.status === 'Rejected').length;
  const wishlist = jobs.filter(j => j.status === 'Wishlist').length;

  // Funnel calculations
  const interviewConversion = total > 0 ? Math.round(((interviewing + offers + rejected) / (total - wishlist)) * 100) : 0;
  const offerConversion = (interviewing + offers + rejected) > 0 ? Math.round((offers / (interviewing + offers + rejected)) * 100) : 0;

  // Recent activity / Timeline logger across all jobs
  const allEvents = jobs.flatMap(job => 
    (job.history || []).map(event => ({
      ...event,
      jobId: job.id,
      company: job.company,
      position: job.position,
      status: job.status
    }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  // High priority applications (rating >= 4 and not rejected/offers)
  const highPriority = jobs
    .filter(j => j.rating >= 4 && (j.status === 'Wishlist' || j.status === 'Applied' || j.status === 'Interviewing'))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  // Formatting date helper
  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Fecha desconocida';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      
      {/* HEADER SECTION */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              ¡Hola de nuevo, {profile?.name || 'Candidato'}! 👋
            </h2>
            {isSupabaseConfigured ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Supabase DB
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Local Mode
              </span>
            )}
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm font-medium">
            Aquí está el estado actual de tu búsqueda de empleo. {offers > 0 ? `¡Enhorabuena! Tienes ${offers} ${offers === 1 ? 'oferta activa' : 'ofertas activas'}. 🎉` : '¡Sigue aplicando para alcanzar tu meta!'}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-semibold text-slate-500 dark:text-slate-400 self-start md:self-auto">
          <Calendar size={14} className="text-indigo-500" />
          <span>{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </header>

      {/* EMPTY ONBOARDING BANNER (SI NO HAY POSTULACIONES AÚN) */}
      {total === 0 && (
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 border border-indigo-200 dark:border-indigo-900/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              ¡Tu base de datos está lista y conectada! 🚀
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Todavía no tienes candidaturas registradas en tu cuenta de Supabase. Puedes empezar registrando tu primera postulación o cargar datos de muestra.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {seedDemoDataToSupabase && (
              <button
                onClick={seedDemoDataToSupabase}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all shadow-sm"
              >
                Cargar datos de ejemplo
              </button>
            )}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm"
            >
              + Añadir primera postulación
            </button>
          </div>
        </div>
      )}

      {/* METRIC CARDS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        
        {/* Total Aplicados */}
        <div className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -mr-4 -mt-4 group-hover:bg-blue-500/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 p-3 rounded-xl">
              <FileText size={20} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-full">
              Activas
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{applied}</p>
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">Candidaturas</h3>
        </div>

        {/* Entrevistas */}
        <div className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:border-amber-400 dark:hover:border-amber-500/50 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl -mr-4 -mt-4 group-hover:bg-amber-500/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-450 p-3 rounded-xl">
              <PhoneCall size={20} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-full">
              Procesos
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{interviewing}</p>
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">En Entrevistas</h3>
        </div>

        {/* Ofertas */}
        <div className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-500/50 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -mr-4 -mt-4 group-hover:bg-emerald-500/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl animate-bounce">
              <Award size={20} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/65 text-emerald-650 dark:text-emerald-400 rounded-full">
              ¡Conseguido!
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{offers}</p>
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">Ofertas Recibidas</h3>
        </div>

        {/* Rechazados */}
        <div className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:border-rose-400 dark:hover:border-rose-500/50 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl -mr-4 -mt-4 group-hover:bg-rose-500/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-450 p-3 rounded-xl">
              <XOctagon size={20} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-50 dark:bg-rose-950/60 text-rose-650 dark:text-rose-400 rounded-full">
              Feedback
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{rejected}</p>
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">Descartados</h3>
        </div>

      </section>

      {/* FUNNEL & QUICK ANALYTICS */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm mb-8">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp size={18} className="text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Embudo de Conversión (Funnel de Búsqueda)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Conversion rate 1 */}
          <div className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Aplicaciones ➔ Entrevista</p>
              <h4 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                {interviewConversion}%
              </h4>
            </div>
            <div className="text-right text-[10px] font-medium text-slate-500 dark:text-slate-400">
              <p>Tasa de respuesta positiva</p>
              <p className="mt-0.5 text-slate-705 dark:text-slate-300">{interviewing + offers + rejected} de {total - wishlist} candidaturas</p>
            </div>
          </div>

          {/* Conversion rate 2 */}
          <div className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Entrevista ➔ Oferta</p>
              <h4 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {offerConversion}%
              </h4>
            </div>
            <div className="text-right text-[10px] font-medium text-slate-500 dark:text-slate-400">
              <p>Éxito en fases finales</p>
              <p className="mt-0.5 text-slate-700 dark:text-slate-300">{offers} oferta(s) de {interviewing + offers + rejected} procesos</p>
            </div>
          </div>

          {/* Tips block */}
          <div className="bg-gradient-to-tr from-indigo-500/10 to-purple-500/5 dark:from-indigo-950/30 dark:to-purple-950/20 p-5 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
            <h4 className="text-xs font-extrabold text-indigo-700 dark:text-indigo-400 uppercase flex items-center gap-1.5">
              <span>💡</span> Consejo de Optimización
            </h4>
            <p className="text-xs text-indigo-650 dark:text-indigo-300 mt-1.5 leading-relaxed font-medium">
              {interviewConversion < 25 
                ? 'Tu tasa de respuesta es moderada. Considera adaptar el CV individualmente a cada oferta y optimizar las palabras clave de tu perfil.' 
                : '¡Excelente tasa de conversión! Estás llamando la atención de los reclutadores. Céntrate ahora en preparar técnicas avanzadas de entrevista.'}
            </p>
          </div>
        </div>
      </section>

      {/* TIMELINE FEED & HIGH PRIORITY COLUMNS */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        
        {/* TIMELINE LOGGER (COLUMN 3/5) */}
        <div className="xl:col-span-3 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span>⏰</span> Actividad Reciente
            </h3>
            <button 
              onClick={() => setActiveTab('kanban')}
              className="text-xs font-bold text-indigo-500 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Ver Kanban <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="flex-1 space-y-5">
            {allEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400 dark:text-slate-500 text-sm">
                <p>No hay eventos registrados aún.</p>
                <p className="text-xs mt-1">Empieza a interactuar con tus aplicaciones para ver su historial.</p>
              </div>
            ) : (
              allEvents.map((event, idx) => (
                <div key={idx} className="flex gap-4 relative">
                  {idx !== allEvents.length - 1 && (
                    <span className="absolute left-3 top-6 bottom-[-20px] w-0.5 bg-slate-100 dark:bg-slate-800"></span>
                  )}
                  
                  <div className="z-10 w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {event.company} — <span className="font-semibold text-slate-500 dark:text-slate-400">{event.position}</span>
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 shrink-0">
                        {formatDate(event.date)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium bg-slate-50/50 dark:bg-slate-950/20 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-900/50">
                      {event.action}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* HIGH PRIORITY TRACKING (COLUMN 2/5) */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Flame size={18} className="text-amber-500 animate-bounce" />
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Enfoque Prioritario (Favs)
            </h3>
          </div>

          <div className="flex-1 space-y-4">
            {highPriority.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 dark:text-slate-500 text-sm p-4 text-center">
                <p>No tienes aplicaciones prioritarias activas.</p>
                <p className="text-xs mt-1">Asigna una puntuación alta (4 o 5 estrellas) a tus puestos favoritos para verlos aquí.</p>
              </div>
            ) : (
              highPriority.map((job) => (
                <div 
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className="group cursor-pointer p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-950/10 hover:bg-white dark:hover:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                        {job.company}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{job.position}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      job.status === 'Interviewing' 
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400' 
                        : job.status === 'Applied' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400' 
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {job.status === 'Interviewing' ? 'Entrevistas' : job.status === 'Applied' ? 'Aplicado' : 'Wishlist'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-400 flex items-center gap-1">
                      <span>⭐</span> {job.rating} / 5 Interés
                    </span>
                    <button className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 group-hover:underline">
                      Ver Detalle
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl text-xs font-bold transition-all duration-200"
            >
              + Registrar nuevo puesto
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
