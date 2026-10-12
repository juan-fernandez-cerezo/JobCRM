import React, { useState } from 'react';
import { 
  Plus, 
  MapPin, 
  DollarSign, 
  Star, 
  FileText, 
  Calendar,
  HelpCircle,
  Download
} from 'lucide-react';

const COLUMNS = [
  { id: 'Wishlist', label: 'Lista de Deseos', icon: '📝', colorClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60' },
  { id: 'Applied', label: 'Aplicado', icon: '📩', colorClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800/60' },
  { id: 'Interviewing', label: 'Entrevistas', icon: '📞', colorClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-450 border-amber-200 dark:border-amber-800/60' },
  { id: 'Offer', label: 'Oferta', icon: '🎉', colorClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-450 border-emerald-200 dark:border-emerald-800/60' },
  { id: 'Rejected', label: 'Descartado', icon: '❌', colorClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800/60' },
];

export default function KanbanBoard({ 
  filteredJobs, 
  moveJob, 
  setSelectedJobId, 
  setIsAddModalOpen,
  exportToExcel
}) {
  const [activeDragColumn, setActiveDragColumn] = useState(null);
  const [draggedJobId, setDraggedJobId] = useState(null);

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e, jobId) => {
    e.dataTransfer.setData('text/plain', jobId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedJobId(jobId);
    
    // Smooth custom drag preview or style adjustment
    setTimeout(() => {
      const card = document.getElementById(`job-card-${jobId}`);
      if (card) card.style.opacity = '0.4';
    }, 0);
  };

  const handleDragEnd = (e, jobId) => {
    const card = document.getElementById(`job-card-${jobId}`);
    if (card) card.style.opacity = '1';
    setDraggedJobId(null);
    setActiveDragColumn(null);
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    if (activeDragColumn !== colId) {
      setActiveDragColumn(colId);
    }
  };

  const handleDragLeave = (e) => {
    // Basic verification to avoid flashing on child elements
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setActiveDragColumn(null);
    }
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const jobId = e.dataTransfer.getData('text/plain') || draggedJobId;
    if (jobId) {
      moveJob(jobId, targetStatus);
    }
    setActiveDragColumn(null);
    setDraggedJobId(null);
  };

  const getJobsByStatus = (status) => {
    return filteredJobs.filter(job => job.status === status);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950/20 transition-colors duration-300">
      
      {/* KANBAN BOARD HEADER */}
      <header className="p-8 pb-4 shrink-0 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Tablero de Seguimiento
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm font-medium">
            Organiza tus procesos y arrastra las tarjetas para cambiar su estado al instante.
          </p>
        </div>
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-97 cursor-pointer"
          title="Exportar a CSV compatible con Excel"
        >
          <Download size={14} className="text-indigo-600 dark:text-indigo-400" />
          <span>Descargar Excel</span>
        </button>
      </header>

      {/* COLUMNS SCROLL CONTAINER */}
      <div className="flex-1 overflow-x-auto p-8 pt-2 pb-6 flex gap-6 items-start h-[calc(100vh-10rem)]">
        {COLUMNS.map((col) => {
          const colJobs = getJobsByStatus(col.id);
          const isOver = activeDragColumn === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`w-76 shrink-0 rounded-2xl border transition-all duration-300 flex flex-col max-h-[calc(100vh-14rem)] ${
                isOver
                  ? 'bg-indigo-50/50 border-indigo-300 dark:bg-slate-900/40 dark:border-indigo-500/30 scale-102 shadow-lg shadow-indigo-500/5'
                  : 'bg-white/80 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80'
              }`}
            >
              {/* COLUMN HEADER */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{col.icon}</span>
                  <h3 className="font-extrabold text-sm text-slate-700 dark:text-slate-300">
                    {col.label}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    {colJobs.length}
                  </span>
                </div>

                {col.id === 'Wishlist' && (
                  <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="p-1 rounded-lg text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>

              {/* CARDS CONTAINER */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 custom-scrollbar min-h-[250px]">
                {colJobs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
                    <p className="font-semibold">Arrastra tarjetas aquí</p>
                    <p className="mt-0.5">O añade un nuevo registro</p>
                  </div>
                ) : (
                  colJobs.map((job) => (
                    <div
                      key={job.id}
                      id={`job-card-${job.id}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, job.id)}
                      onDragEnd={(e) => handleDragEnd(e, job.id)}
                      onClick={() => setSelectedJobId(job.id)}
                      className="group cursor-grab active:cursor-grabbing bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:scale-101 transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Priority indicator bar */}
                      <span className={`absolute left-0 top-0 bottom-0 w-1 ${
                        job.rating >= 5 ? 'bg-indigo-600' : job.rating >= 4 ? 'bg-indigo-400' : 'bg-transparent'
                      }`}></span>

                      {/* Header Info */}
                      <div className="flex justify-between items-start gap-1">
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                            {job.company}
                          </h4>
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {job.position}
                          </p>
                        </div>
                        {/* Rating Stars */}
                        <div className="flex items-center gap-0.5 shrink-0 text-amber-400">
                          <Star size={11} fill="currentColor" />
                          <span className="text-[10px] font-bold">{job.rating}</span>
                        </div>
                      </div>

                      {/* Key details */}
                      <div className="space-y-2 mt-4">
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                          <MapPin size={11} />
                          <span className="truncate">{job.location === 'Remote' ? '100% Remoto' : `${job.location} · ${job.city}`}</span>
                        </div>

                        {job.salary && (
                          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                            <DollarSign size={11} />
                            <span className="truncate">{job.salary}</span>
                          </div>
                        )}
                      </div>

                      {/* Footer: Date / Docs & Action */}
                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 mt-4 pt-3.5">
                        <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-400 flex items-center gap-1">
                          <Calendar size={10} />
                          <span>{new Date(job.appliedDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                        </span>

                        <div className="flex items-center gap-2">
                          {/* Indicator icons (has CV, has Interviews) */}
                          {job.cvName && (
                            <FileText size={12} className="text-indigo-500/60" title="CV cargado" />
                          )}
                          {job.interviews && job.interviews.length > 0 && (
                            <span className="bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-amber-100 dark:border-amber-900/30">
                              {job.interviews.length} {job.interviews.length === 1 ? 'Entrevista' : 'Entrevistas'}
                            </span>
                          )}
                          <button className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline">
                            Detalles
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
