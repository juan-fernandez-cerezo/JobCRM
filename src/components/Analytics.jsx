import React from 'react';
import { 
  BarChart3, 
  MapPin, 
  Globe, 
  Compass, 
  AlertCircle, 
  TrendingUp, 
  Award, 
  ThumbsUp, 
  Briefcase 
} from 'lucide-react';

export default function Analytics({ jobs }) {
  const total = jobs.length;
  const applied = jobs.filter(j => j.status === 'Applied').length;
  const interviewing = jobs.filter(j => j.status === 'Interviewing').length;
  const offers = jobs.filter(j => j.status === 'Offer').length;
  const rejected = jobs.filter(j => j.status === 'Rejected').length;
  const wishlist = jobs.filter(j => j.status === 'Wishlist').length;
  
  // Calculate average rating
  const avgRating = total > 0 
    ? (jobs.reduce((acc, curr) => acc + curr.rating, 0) / total).toFixed(1) 
    : 0;

  // Calculate location counts
  const remote = jobs.filter(j => j.location === 'Remote').length;
  const hybrid = jobs.filter(j => j.location === 'Hybrid').length;
  const onsite = jobs.filter(j => j.location === 'Onsite').length;

  // Calculate sources by simple parsing of job URL or description
  const getSource = (job) => {
    const url = (job.url || '').toLowerCase();
    if (url.includes('linkedin')) return 'LinkedIn';
    if (url.includes('infojobs')) return 'InfoJobs';
    if (url.includes('indeed')) return 'Indeed';
    if (url.includes('glassdoor')) return 'Glassdoor';
    if (url.includes('refer')) return 'Referido';
    return 'Web Corporativa';
  };

  const sourcesMap = jobs.reduce((acc, curr) => {
    const src = getSource(curr);
    acc[src] = (acc[src] || 0) + 1;
    return acc;
  }, {});

  const sources = Object.entries(sourcesMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // NLP: Extract keywords from rejected feedback or retro notes for actionable learnings!
  const getKeywordsAnalysis = () => {
    const keywords = [
      { key: 'algoritmos', label: 'Estructuras de Datos / Algoritmos', count: 0, color: 'bg-rose-500' },
      { key: 'react 19', label: 'React 19 / APIs avanzadas', count: 0, color: 'bg-indigo-500' },
      { key: 'inglés', label: 'Fluidez en Inglés', count: 0, color: 'bg-amber-500' },
      { key: 'aws', label: 'AWS / Cloud Computing', count: 0, color: 'bg-sky-500' },
      { key: 'diseño', label: 'System Design / Arquitectura', count: 0, color: 'bg-purple-500' },
    ];

    jobs.filter(j => j.status === 'Rejected').forEach(job => {
      const text = `${job.feedback || ''} ${job.description || ''}`.toLowerCase();
      keywords.forEach(kw => {
        if (text.includes(kw.key)) {
          kw.count += 1;
        }
      });
    });

    return keywords.filter(kw => kw.count > 0).sort((a, b) => b.count - a.count);
  };

  const criticalKeywords = getKeywordsAnalysis();

  // SVG Chart values
  const totalNoWishlist = total - wishlist;
  const appliedPct = totalNoWishlist > 0 ? (applied / totalNoWishlist) * 100 : 0;
  const interviewingPct = totalNoWishlist > 0 ? (interviewing / totalNoWishlist) * 100 : 0;
  const offersPct = totalNoWishlist > 0 ? (offers / totalNoWishlist) * 100 : 0;
  const rejectedPct = totalNoWishlist > 0 ? (rejected / totalNoWishlist) * 100 : 0;

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      
      {/* ANALYTICS HEADER */}
      <header className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Estadísticas & Insights
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm font-medium">
          Métricas avanzadas para analizar y optimizar el rendimiento de tu búsqueda laboral.
        </p>
      </header>

      {/* OVERVIEW STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 p-4 rounded-xl shrink-0">
            <Compass size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Total Procesos Iniciados</p>
            <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{totalNoWishlist}</h4>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Excluyendo lista de deseos ({wishlist})</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 p-4 rounded-xl shrink-0">
            <Award size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Tasa de Éxito Final</p>
            <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {totalNoWishlist > 0 ? ((offers / totalNoWishlist) * 100).toFixed(0) : 0}%
            </h4>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{offers} Ofertas obtenidas</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 p-4 rounded-xl shrink-0">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Nivel de Interés Medio</p>
            <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{avgRating} / 5.0</h4>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Puntuación de atracción del puesto</span>
          </div>
        </div>

      </div>

      {/* CHARTS CONTAINER */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        
        {/* CHART 1: RATIOS BY STATE (SVG STACKED VIEW) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span>📊</span> Ratios por Estado del Proceso
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-6 font-medium">
              Porcentaje relativo de cada etapa sobre el total de postulaciones activas.
            </p>
          </div>

          {totalNoWishlist === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500 text-xs">
              Sin datos suficientes. Registra aplicaciones para ver estadísticas.
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* Stacked single bar */}
              <div className="h-6 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex shadow-inner border border-slate-200 dark:border-slate-700/50">
                {appliedPct > 0 && <div className="h-full bg-blue-500 hover:scale-y-105 transition-all duration-300" style={{ width: `${appliedPct}%` }} title={`Aplicados: ${appliedPct.toFixed(0)}%`}></div>}
                {interviewingPct > 0 && <div className="h-full bg-amber-500 hover:scale-y-105 transition-all duration-300" style={{ width: `${interviewingPct}%` }} title={`Entrevistas: ${interviewingPct.toFixed(0)}%`}></div>}
                {offersPct > 0 && <div className="h-full bg-emerald-500 hover:scale-y-105 transition-all duration-300" style={{ width: `${offersPct}%` }} title={`Ofertas: ${offersPct.toFixed(0)}%`}></div>}
                {rejectedPct > 0 && <div className="h-full bg-rose-500 hover:scale-y-105 transition-all duration-300" style={{ width: `${rejectedPct}%` }} title={`Descartados: ${rejectedPct.toFixed(0)}%`}></div>}
              </div>

              {/* Progress bars list */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Applied */}
                <div className="bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-xl border border-slate-200 dark:border-slate-800/40">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block"></span>Aplicado</span>
                    <span>{applied} ({appliedPct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${appliedPct}%` }}></div>
                  </div>
                </div>

                {/* Interviewing */}
                <div className="bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-xl border border-slate-200 dark:border-slate-800/40">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block"></span>Entrevistas</span>
                    <span>{interviewing} ({interviewingPct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${interviewingPct}%` }}></div>
                  </div>
                </div>

                {/* Offer */}
                <div className="bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-xl border border-slate-200 dark:border-slate-800/40">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span>Oferta</span>
                    <span>{offers} ({offersPct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${offersPct}%` }}></div>
                  </div>
                </div>

                {/* Rejected */}
                <div className="bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-xl border border-slate-200 dark:border-slate-800/40">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block"></span>Descartado</span>
                    <span>{rejected} ({rejectedPct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-rose-500" style={{ width: `${rejectedPct}%` }}></div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* CHART 2: LOCATION MODE (HORIZONTAL PERCENTAGE BARS) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <MapPin size={16} className="text-indigo-500" /> Distribución por Modalidad
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-6 font-medium">
              Comparativa de puestos remotos, híbridos y presenciales en tu historial.
            </p>
          </div>

          {total === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500 text-xs">
              Sin datos suficientes.
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Remote */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span className="flex items-center gap-1.5">💻 100% Remoto</span>
                  <span>{remote} de {total} ({((remote/total)*100).toFixed(0)}%)</span>
                </div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800/50">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-lg transition-all duration-500" style={{ width: `${(remote/total)*100}%` }}></div>
                </div>
              </div>

              {/* Hybrid */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span className="flex items-center gap-1.5">🏢 Híbrido</span>
                  <span>{hybrid} de {total} ({((hybrid/total)*100).toFixed(0)}%)</span>
                </div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800/50">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-sky-500 rounded-lg transition-all duration-500" style={{ width: `${(hybrid/total)*100}%` }}></div>
                </div>
              </div>

              {/* Onsite */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span className="flex items-center gap-1.5">📍 Presencial</span>
                  <span>{onsite} de {total} ({((onsite/total)*100).toFixed(0)}%)</span>
                </div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800/50">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg transition-all duration-500" style={{ width: `${(onsite/total)*100}%` }}></div>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

      {/* PORTALS SOURCES & CRITICAL FEEDBACK scorecards */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        
        {/* SOURCE ANALYTICS (2/5) */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Globe size={16} className="text-indigo-500" /> Portales y Orígenes de Oferta
          </h3>

          <div className="flex-1 space-y-3.5">
            {sources.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400 dark:text-slate-500 text-xs">
                Sin datos suficientes de enlaces.
              </div>
            ) : (
              sources.map((src, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-700 dark:text-slate-350">{src.name}</span>
                  </div>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30">
                    {src.count} {src.count === 1 ? 'postulación' : 'postulaciones'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SKILLS SCORECARD - PORTFOLIO GOLD KEYWORDS (3/5) */}
        <div className="xl:col-span-3 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-500" /> Puntos Críticos a Reforzar (Basado en Rechazos)
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-6 font-medium">
              Habilidades u obstáculos recurrentes detectados automáticamente de tus notas de feedback.
            </p>
          </div>

          {criticalKeywords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 dark:text-slate-500 text-xs p-6 text-center">
              <ThumbsUp size={24} className="text-emerald-500 mb-2 animate-bounce" />
              <p className="font-semibold">¡Historial limpio!</p>
              <p className="mt-0.5 max-w-[280px]">No hemos detectado debilidades o palabras críticas de rechazo aún. ¡Buen trabajo en tus entrevistas!</p>
            </div>
          ) : (
            <div className="space-y-4 flex-1">
              {criticalKeywords.map((kw, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 dark:text-slate-350">
                    <span>{kw.label}</span>
                    <span className="text-rose-500 font-extrabold flex items-center gap-1">
                      ⚠️ Detectado {kw.count} {kw.count === 1 ? 'vez' : 'veces'}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${kw.color}`} style={{ width: `${(kw.count / rejected) * 100}%` }}></div>
                  </div>
                </div>
              ))}

              <div className="mt-5 p-4 rounded-xl bg-rose-500/5 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 flex gap-2">
                <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                <p className="text-[10px] font-semibold text-rose-705 leading-relaxed">
                  <strong>Recomendación técnica:</strong> Tienes menciones críticas de <strong>{criticalKeywords[0]?.label}</strong> en tu feedback de descarte. Te sugerimos agendar bloques de estudio de 30-45 minutos para resolver estos temas concretos en tus notas de preparación para las próximas rondas.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
