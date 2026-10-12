import React, { useState } from 'react';
import { 
  X, Calendar, MapPin, DollarSign, ExternalLink, Star, FileText, 
  Trash2, Edit, ChevronRight, Plus, HelpCircle, Trophy, Smile, Frown, Save 
} from 'lucide-react';

export default function JobDetails({ 
  job, 
  onClose, 
  updateJob, 
  deleteJob, 
  addInterview, 
  deleteInterview,
  onEditClick,
  downloadDocument 
}) {
  const [activeSubTab, setActiveSubTab] = useState('info'); // 'info' | 'timeline' | 'interviews' | 'feedback'
  
  // States for adding a new interview
  const [isAddingInterview, setIsAddingInterview] = useState(false);
  const [newInterview, setNewInterview] = useState({
    type: 'Technical',
    date: new Date().toISOString().slice(0, 16),
    interviewer: '',
    rating: 3,
    notes: '',
    questions: ['']
  });

  // State for feedback editing
  const [feedbackText, setFeedbackText] = useState(job ? job.feedback : '');

  if (!job) return null;

  const handleDeleteClick = () => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la candidatura en ${job.company}?`)) {
      deleteJob(job.id);
      onClose();
    }
  };

  const handleStatusChange = (newStatus) => {
    updateJob(job.id, { status: newStatus });
  };

  const handleSaveFeedback = () => {
    updateJob(job.id, { feedback: feedbackText });
  };

  // Add interview handlers
  const handleAddQuestionField = () => {
    setNewInterview(prev => ({
      ...prev,
      questions: [...prev.questions, '']
    }));
  };

  const handleQuestionChange = (index, value) => {
    const updated = [...newInterview.questions];
    updated[index] = value;
    setNewInterview(prev => ({
      ...prev,
      questions: updated
    }));
  };

  const handleRemoveQuestionField = (index) => {
    setNewInterview(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleCreateInterview = (e) => {
    e.preventDefault();
    if (!newInterview.interviewer.trim()) return;

    // Filter out empty questions
    const finalQuestions = newInterview.questions.filter(q => q.trim() !== '');

    addInterview(job.id, {
      ...newInterview,
      questions: finalQuestions,
      date: new Date(newInterview.date).toISOString()
    });

    // Reset
    setIsAddingInterview(false);
    setNewInterview({
      type: 'Technical',
      date: new Date().toISOString().slice(0, 16),
      interviewer: '',
      rating: 3,
      notes: '',
      questions: ['']
    });
  };

  // Real or simulated download handler
  const handleDownload = (fileName, docType) => {
    if (downloadDocument) {
      downloadDocument(fileName, docType);
    } else {
      triggerSimulatedDownload(fileName, docType);
    }
  };

  const triggerSimulatedDownload = (fileName, docType) => {
    const fileContent = `=== Documento JobTracker ===\n\nTipo: ${docType}\nNombre: ${fileName}\nCandidatura: ${job.position} en ${job.company}\nFecha: ${new Date().toLocaleDateString()}`;
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden">
      {/* BACKGROUND BACKDROP */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
      ></div>

      {/* DETAILED VIEWER PANEL */}
      <div className="relative w-full max-w-2xl h-full bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-10 animate-slide-in">
        
        {/* PANEL HEADER WITH CONTROLS */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-950/20">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                job.status === 'Offer' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-450 border border-emerald-200/50 dark:border-emerald-900/40' :
                job.status === 'Interviewing' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-450 border border-amber-200/50 dark:border-amber-900/40' :
                job.status === 'Applied' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-450 border border-blue-200/50 dark:border-blue-900/40' :
                job.status === 'Rejected' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-450 border border-rose-200/50 dark:border-rose-900/40' :
                'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-800'
              }`}>
                {job.status === 'Wishlist' ? 'Lista de Deseos' :
                 job.status === 'Applied' ? 'Aplicado' :
                 job.status === 'Interviewing' ? 'En Entrevistas' :
                 job.status === 'Offer' ? 'Oferta Recibida' : 'Descartado'}
              </span>
              <div className="flex items-center gap-0.5 text-amber-450">
                <Star size={12} fill="currentColor" />
                <span className="text-xs font-bold">{job.rating}/5</span>
              </div>
            </div>
            <h3 className="font-extrabold text-xl text-slate-900 dark:text-white mt-1.5 leading-tight">
              {job.position}
            </h3>
            <p className="text-sm font-semibold text-indigo-650 dark:text-indigo-400 mt-0.5">
              {job.company}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditClick(job)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-all duration-200"
              title="Editar aplicación"
            >
              <Edit size={15} />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 hover:text-rose-500 transition-all duration-200"
              title="Eliminar aplicación"
            >
              <Trash2 size={15} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-250 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* METADATA BAR */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-900 grid grid-cols-3 gap-4 shrink-0 text-xs font-medium text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-indigo-500 shrink-0" />
            <span className="truncate">{job.location === 'Remote' ? 'Remoto' : `${job.location} · ${job.city}`}</span>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign size={14} className="text-emerald-500 shrink-0" />
            <span className="truncate">{job.salary || 'No especificado'}</span>
          </div>

          <div className="flex items-center gap-2">
            <ExternalLink size={14} className="text-indigo-500 shrink-0" />
            {job.url ? (
              <a 
                href={job.url} 
                target="_blank" 
                rel="noreferrer" 
                className="text-indigo-550 dark:text-indigo-400 hover:underline truncate"
              >
                Ver oferta original
              </a>
            ) : (
              <span>Sin enlace</span>
            )}
          </div>
        </div>

        {/* TAB CONTROLS */}
        <div className="px-6 border-b border-slate-100 dark:border-slate-900 shrink-0 flex gap-4 bg-white dark:bg-slate-950">
          {[
            { id: 'info', label: 'Descripción' },
            { id: 'timeline', label: 'Historial / Timeline' },
            { id: 'interviews', label: `Entrevistas (${(job.interviews || []).length})` },
            { id: 'feedback', label: 'Feedback y Notas' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`py-3.5 border-b-2 font-bold text-xs transition-all duration-300 ${
                activeSubTab === tab.id 
                  ? 'border-indigo-500 text-indigo-700 dark:text-indigo-400' 
                  : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* DETAILS SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB: INFO (DESCRIPTION & DOCUMENTS) */}
          {activeSubTab === 'info' && (
            <div className="space-y-6 animate-fade-in">
              {/* Job description section */}
              <div className="bg-slate-50/50 dark:bg-slate-900/20 p-5 rounded-2xl border border-slate-100 dark:border-slate-900/60">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  Detalles y Requisitos
                </h4>
                
                {job.description ? (
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2 whitespace-pre-wrap">
                    {job.description}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                    No se ha añadido una descripción para este puesto. Haz clic en el botón de edición superior para registrarla.
                  </p>
                )}
              </div>

              {/* Document locker section */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  Archivos Adjuntos
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* CV File */}
                  <div className="p-4 border border-slate-200 dark:border-slate-800/80 rounded-xl flex items-center justify-between bg-white dark:bg-slate-900/30">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-450 p-2.5 rounded-lg shrink-0">
                        <FileText size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-slate-800 dark:text-slate-300 truncate">Currículum Vitae</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                          {job.cvName || 'No enviado en esta postulación'}
                        </p>
                      </div>
                    </div>

                    {job.cvName && (
                      <button
                        onClick={() => handleDownload(job.cvName, 'Curriculum Vitae')}
                        className="text-[10px] font-bold text-indigo-550 dark:text-indigo-400 hover:underline shrink-0 pl-2"
                      >
                        Descargar
                      </button>
                    )}
                  </div>

                  {/* Cover Letter File */}
                  <div className="p-4 border border-slate-200 dark:border-slate-800/80 rounded-xl flex items-center justify-between bg-white dark:bg-slate-900/30">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-450 p-2.5 rounded-lg shrink-0">
                        <FileText size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-slate-800 dark:text-slate-300 truncate">Carta de Presentación</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                          {job.coverLetterName || 'No enviada en esta postulación'}
                        </p>
                      </div>
                    </div>

                    {job.coverLetterName && (
                      <button
                        onClick={() => handleDownload(job.coverLetterName, 'Carta de Presentacion')}
                        className="text-[10px] font-bold text-indigo-550 dark:text-indigo-400 hover:underline shrink-0 pl-2"
                      >
                        Descargar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: TIMELINE */}
          {activeSubTab === 'timeline' && (
            <div className="space-y-6 animate-fade-in">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                Línea de Tiempo del Proceso
              </h4>
              
              <div className="space-y-6 pl-4 border-l border-slate-100 dark:border-slate-800/80 relative">
                {(job.history || []).map((event, idx) => (
                  <div key={idx} className="relative group">
                    {/* Circle Bullet */}
                    <div className="absolute left-[-21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-indigo-500 bg-white dark:bg-slate-950 z-10 group-hover:scale-130 transition-transform"></div>
                    
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block">
                        {new Date(event.date).toLocaleDateString('es-ES', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1 bg-slate-50/50 dark:bg-slate-900/35 px-3.5 py-2 rounded-xl border border-slate-100 dark:border-slate-900/40">
                        {event.action}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: INTERVIEWS */}
          {activeSubTab === 'interviews' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* TOP ACTIONS */}
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Rondas de Entrevista
                </h4>
                
                {!isAddingInterview && (
                  <button
                    onClick={() => setIsAddingInterview(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-650 dark:text-indigo-400 rounded-lg text-xs font-bold transition-all duration-200"
                  >
                    <Plus size={14} /> Registrar Entrevista
                  </button>
                )}
              </div>

              {/* ADD INTERVIEW FORM OVERLAY/ACCORDION */}
              {isAddingInterview && (
                <form onSubmit={handleSaveInterview} className="p-5 border border-indigo-200 dark:border-indigo-900 bg-indigo-50/10 dark:bg-indigo-950/20 rounded-2xl space-y-4 animate-slide-in">
                  <h5 className="text-xs font-bold text-indigo-650 dark:text-indigo-400 flex items-center gap-1">
                    <span>📅</span> Añadir Nueva Fase / Entrevista
                  </h5>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                        Tipo de Entrevista
                      </label>
                      <select
                        value={newInterview.type}
                        onChange={(e) => setNewInterview(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                      >
                        <option value="HR">Screening / HR (Llamada inicial)</option>
                        <option value="Technical">Ronda Técnica / Código</option>
                        <option value="Manager">Entrevista con Manager / Líder</option>
                        <option value="Onsite">Ronda Completa / Presencial</option>
                        <option value="Other">Otro / Fit cultural</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                        Fecha y Hora
                      </label>
                      <input 
                        type="datetime-local"
                        value={newInterview.date}
                        onChange={(e) => setNewInterview(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Entrevistadores (Nombre y cargo)
                    </label>
                    <input 
                      type="text"
                      placeholder="Ej: Sarah Jenkins (Lead TA)"
                      value={newInterview.interviewer}
                      onChange={(e) => setNewInterview(prev => ({ ...prev, interviewer: e.target.value }))}
                      className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                        Autoevaluación / Sensación
                      </label>
                      <div className="flex items-center gap-1.5 h-8">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewInterview(prev => ({ ...prev, rating: star }))}
                            className="text-slate-300 dark:text-slate-700"
                          >
                            <Star 
                              size={16} 
                              fill={star <= newInterview.rating ? '#fbbf24' : 'transparent'} 
                              color={star <= newInterview.rating ? '#fbbf24' : 'currentColor'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Preguntas Planteadas en la Entrevista
                    </label>
                    <div className="space-y-2">
                      {newInterview.questions.map((q, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <HelpCircle size={14} className="text-indigo-400 shrink-0" />
                          <input 
                            type="text"
                            placeholder="Escribe la pregunta recibida..."
                            value={q}
                            onChange={(e) => handleQuestionChange(idx, e.target.value)}
                            className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                          />
                          {newInterview.questions.length > 1 && (
                            <button 
                              type="button" 
                              onClick={() => handleRemoveQuestionField(idx)}
                              className="text-[10px] font-bold text-rose-500 hover:underline px-1 shrink-0"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleAddQuestionField}
                        className="text-[10px] font-extrabold text-indigo-550 dark:text-indigo-400 hover:underline mt-1 block"
                      >
                        + Añadir pregunta adicional
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Notas de Preparación y Sensaciones
                    </label>
                    <textarea 
                      rows={2}
                      placeholder="Anota tus dudas, qué respondiste bien, qué mejorar..."
                      value={newInterview.notes}
                      onChange={(e) => setNewInterview(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingInterview(false)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-850 text-slate-700 dark:text-slate-300 text-[10px] font-extrabold hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-lg text-[10px] font-extrabold shadow-md shadow-indigo-650/10"
                    >
                      Guardar Fase
                    </button>
                  </div>
                </form>
              )}

              {/* LIST OF INTERVIEWS */}
              <div className="space-y-4">
                {(!job.interviews || job.interviews.length === 0) ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-500 dark:text-slate-400 text-xs">
                    <p className="font-semibold">No se han registrado entrevistas aún.</p>
                    <p className="mt-0.5">Añade tu primera entrevista en el botón superior.</p>
                  </div>
                ) : (
                  job.interviews.map((int) => (
                    <div 
                      key={int.id}
                      className="group p-5 border border-slate-200 dark:border-slate-800/80 rounded-2xl bg-slate-50/15 dark:bg-slate-950/20 space-y-4 hover:border-slate-300 dark:hover:border-slate-855/80 transition-all duration-200"
                    >
                      {/* Interview Header */}
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md ${
                              int.type === 'HR' ? 'bg-blue-50 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400' :
                              int.type === 'Technical' ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400' :
                              int.type === 'Manager' ? 'bg-purple-50 text-purple-800 dark:bg-purple-950/30 dark:text-purple-400' :
                              'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-300'
                            }`}>
                              {int.type === 'HR' ? 'Llamada HR' : int.type === 'Technical' ? 'Técnica' : int.type === 'Manager' ? 'Manager' : 'Entrevista'}
                            </span>
                            
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                              <Calendar size={10} />
                              {new Date(int.date).toLocaleDateString('es-ES', { 
                                day: 'numeric', 
                                month: 'short', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>

                          <h5 className="text-xs font-extrabold text-slate-800 dark:text-white mt-2">
                            Con: <span className="text-indigo-650 dark:text-indigo-400">{int.interviewer}</span>
                          </h5>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5 text-amber-400 mr-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} size={11} fill={s <= int.rating ? 'currentColor' : 'transparent'} />
                            ))}
                          </div>
                          <button
                            onClick={() => deleteInterview(job.id, int.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded transition-all"
                            title="Eliminar esta entrevista"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Notes / Feelings */}
                      {int.notes && (
                        <div className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40 leading-relaxed font-medium">
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                            <Smile size={11} className="text-indigo-400" /> Sensaciones y Notas
                          </p>
                          {int.notes}
                        </div>
                      )}

                      {/* Questions Received */}
                      {int.questions && int.questions.length > 0 && (
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <HelpCircle size={11} className="text-amber-500" /> Preguntas Formuladas
                          </p>
                          
                          <div className="space-y-1.5 pl-1.5">
                            {int.questions.map((q, idx) => (
                              <div key={idx} className="flex gap-2.5 items-start text-xs font-semibold text-slate-700 dark:text-slate-300">
                                <span className="text-amber-500 mt-0.5 shrink-0">❓</span>
                                <span className="italic leading-relaxed">"{q}"</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB: FEEDBACK & RETROSPECTIVE */}
          {activeSubTab === 'feedback' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 bg-gradient-to-tr from-indigo-500/10 to-purple-500/5 dark:from-indigo-950/30 dark:to-purple-950/20 p-5 rounded-2xl border border-indigo-50/50 dark:border-indigo-900/30">
                <Trophy size={20} className="text-indigo-500 shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                    Retrospectiva & Aprendizajes
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    Anota aquí los motivos específicos del rechazo/aceptación, qué feedback directo te dieron los entrevistadores, y tus propias conclusiones para seguir puliendo tu perfil.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Notas sobre el Desenlace
                </label>
                
                <div className="relative">
                  {job.status === 'Rejected' && (
                    <Frown size={20} className="absolute right-3.5 top-3.5 text-rose-500/80" />
                  )}
                  {job.status === 'Offer' && (
                    <Smile size={20} className="absolute right-3.5 top-3.5 text-emerald-500/80" />
                  )}

                  <textarea
                    rows={8}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Ej: Rechazado tras la prueba técnica de algoritmos por no optimizar el tiempo. Feedback recibido: sólida base de React pero mejorar teoría de grafos. Aprendizaje: hacer 2 ejercicios diarios de LeetCode de grafos antes de la siguiente entrevista..."
                    className="w-full p-4 pr-12 text-xs rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none font-medium leading-relaxed"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleSaveFeedback}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-650 hover:bg-indigo-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-650/15 transition-all duration-200"
                  >
                    <Save size={14} /> Guardar Notas
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
