import React, { useState, useEffect } from 'react';
import { X, Briefcase, Building2, MapPin, DollarSign, Link, Star, FileText, UploadCloud } from 'lucide-react';

const INITIAL_FORM = {
  company: '',
  position: '',
  status: 'Applied',
  appliedDate: new Date().toISOString().split('T')[0],
  salary: '',
  location: 'Remote',
  city: '',
  url: '',
  rating: 3,
  description: '',
  cvName: '',
  coverLetterName: ''
};

export default function JobModal({ isOpen, onClose, addJob, editJob, jobToEdit, profile = { cvs: [], coverLetters: [] }, addDocumentToLibrary }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (jobToEdit) {
      setFormData({
        company: jobToEdit.company || '',
        position: jobToEdit.position || '',
        status: jobToEdit.status || 'Applied',
        appliedDate: jobToEdit.appliedDate || new Date().toISOString().split('T')[0],
        salary: jobToEdit.salary || '',
        location: jobToEdit.location || 'Remote',
        city: jobToEdit.city || '',
        url: jobToEdit.url || '',
        rating: jobToEdit.rating || 3,
        description: jobToEdit.description || '',
        cvName: jobToEdit.cvName || '',
        coverLetterName: jobToEdit.coverLetterName || ''
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setErrors({});
  }, [jobToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleRatingChange = (ratingValue) => {
    setFormData(prev => ({ ...prev, rating: ratingValue }));
  };

  // Selector & Upload Handler
  const handleDocumentSelect = (e, field) => {
    const value = e.target.value;
    if (value === '__UPLOAD_NEW__') {
      const fileInput = document.getElementById(`modal-file-input-${field}`);
      fileInput?.click();
      // Reset select choice value temporarily
      e.target.value = formData[field] || '';
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleFileUpload = (e, field, type) => {
    const file = e.target.files?.[0];
    if (file) {
      addDocumentToLibrary(type, file);
      setFormData(prev => ({
        ...prev,
        [field]: file.name
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.company.trim()) newErrors.company = 'El nombre de la empresa es obligatorio';
    if (!formData.position.trim()) newErrors.position = 'El puesto de trabajo es obligatorio';
    if (!formData.appliedDate) newErrors.appliedDate = 'La fecha es obligatoria';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (jobToEdit) {
      editJob(jobToEdit.id, formData);
    } else {
      addJob(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden">
      {/* BACKGROUND BACKDROP */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
      ></div>

      {/* DRAWER CONTENT */}
      <div className="relative w-full max-w-lg h-full bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-10 transition-transform duration-300 animate-slide-in">
        
        {/* MODAL HEADER */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 p-2 rounded-xl">
              <Briefcase size={18} />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white dark:text-white">
              {jobToEdit ? 'Editar Candidatura' : 'Registrar Nueva Candidatura'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-650 dark:hover:text-slate-250 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* FORM CONTAINER */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* COMPANY & POSITION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Empresa *
              </label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Ej: Spotify"
                  className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border bg-slate-50/50 dark:bg-slate-900/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.company 
                      ? 'border-rose-500 dark:border-rose-800/80 focus:border-rose-500' 
                      : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500'
                  }`}
                />
              </div>
              {errors.company && <p className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.company}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Puesto de Trabajo *
              </label>
              <div className="relative">
                <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Ej: Frontend Developer"
                  className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border bg-slate-50/50 dark:bg-slate-900/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.position 
                      ? 'border-rose-500 dark:border-rose-800/80 focus:border-rose-500' 
                      : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500'
                  }`}
                />
              </div>
              {errors.position && <p className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.position}</p>}
            </div>
          </div>

          {/* STATUS & DATE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Estado del Proceso
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="Wishlist">📝 Lista de Deseos</option>
                <option value="Applied">📩 Aplicado</option>
                <option value="Interviewing">📞 En Entrevistas</option>
                <option value="Offer">🎉 Oferta Recibida</option>
                <option value="Rejected">❌ Descartado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Fecha de Aplicación *
              </label>
              <input 
                type="date"
                name="appliedDate"
                value={formData.appliedDate}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 text-sm rounded-xl border bg-slate-50/50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                  errors.appliedDate 
                    ? 'border-rose-500 dark:border-rose-800 focus:border-rose-500' 
                    : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500'
                }`}
              />
              {errors.appliedDate && <p className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.appliedDate}</p>}
            </div>
          </div>

          {/* COMPENSATION & RATING */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Compensación / Salario
              </label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Ej: 55K / Remoto"
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Nivel de Interés
              </label>
              <div className="flex items-center gap-2 h-10 px-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    className="text-slate-300 dark:text-slate-700 hover:scale-110 transition-transform"
                  >
                    <Star 
                      size={22} 
                      fill={star <= formData.rating ? '#fbbf24' : 'transparent'} 
                      color={star <= formData.rating ? '#fbbf24' : 'currentColor'}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* LOCATION TYPE & CITY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Modalidad
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="Remote">100% Remoto</option>
                <option value="Hybrid">Híbrido</option>
                <option value="Onsite">Presencial</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Ubicación / Ciudad
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Ej: Madrid, España"
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* LINK TO OFFER */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Enlace de la Oferta (URL)
            </label>
            <div className="relative">
              <Link size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="Ej: https://careers.spotify.com/..."
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* JOB DESCRIPTION */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Descripción del Puesto / Requisitos
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Pega aquí la descripción del puesto, tecnologías solicitadas o detalles importantes..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-y"
            />
          </div>

          {/* DOCUMENTS ATTACHMENT */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-900 space-y-4">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Documentos de la Candidatura (Simulado)
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* CV FILE */}
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/30 dark:bg-slate-950/20 flex flex-col gap-3 justify-between min-h-[110px]">
                <div className="flex gap-2">
                  <FileText size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Currículum Vitae (CV)</p>
                    {/* Select Dropdown */}
                    <select
                      value={formData.cvName}
                      onChange={(e) => handleDocumentSelect(e, 'cvName')}
                      className="w-full mt-1.5 px-2 py-1.5 text-[10px] rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="">Selecciona de mi biblioteca...</option>
                      {(profile.cvs || []).map(file => (
                        <option key={file} value={file}>{file}</option>
                      ))}
                      <option value="__UPLOAD_NEW__" className="text-indigo-600 dark:text-indigo-400 font-extrabold bg-indigo-50 dark:bg-indigo-950/40">
                        [+ Subir Nuevo Currículum]
                      </option>
                    </select>
                  </div>
                </div>

                <input 
                  type="file" 
                  id="modal-file-input-cvName"
                  onChange={(e) => handleFileUpload(e, 'cvName', 'cv')}
                  className="hidden" 
                  accept=".pdf,.doc,.docx"
                />

                {formData.cvName && (
                  <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-2 shrink-0">
                    <span className="truncate max-w-[130px]">{formData.cvName}</span>
                    <button 
                      type="button" 
                      onClick={() => setFormData(prev => ({ ...prev, cvName: '' }))} 
                      className="text-[9px] font-extrabold text-rose-500 hover:underline shrink-0 cursor-pointer"
                    >
                      Quitar
                    </button>
                  </div>
                )}
              </div>

              {/* COVER LETTER */}
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/30 dark:bg-slate-950/20 flex flex-col gap-3 justify-between min-h-[110px]">
                <div className="flex gap-2">
                  <FileText size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Carta de Presentación</p>
                    {/* Select Dropdown */}
                    <select
                      value={formData.coverLetterName}
                      onChange={(e) => handleDocumentSelect(e, 'coverLetterName')}
                      className="w-full mt-1.5 px-2 py-1.5 text-[10px] rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="">Selecciona de mi biblioteca...</option>
                      {(profile.coverLetters || []).map(file => (
                        <option key={file} value={file}>{file}</option>
                      ))}
                      <option value="__UPLOAD_NEW__" className="text-indigo-600 dark:text-indigo-400 font-extrabold bg-indigo-50 dark:bg-indigo-950/40">
                        [+ Subir Nueva Carta]
                      </option>
                    </select>
                  </div>
                </div>

                <input 
                  type="file" 
                  id="modal-file-input-coverLetterName"
                  onChange={(e) => handleFileUpload(e, 'coverLetterName', 'coverLetter')}
                  className="hidden" 
                  accept=".pdf,.doc,.docx"
                />

                {formData.coverLetterName && (
                  <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-2 shrink-0">
                    <span className="truncate max-w-[130px]">{formData.coverLetterName}</span>
                    <button 
                      type="button" 
                      onClick={() => setFormData(prev => ({ ...prev, coverLetterName: '' }))} 
                      className="text-[9px] font-extrabold text-rose-500 hover:underline shrink-0 cursor-pointer"
                    >
                      Quitar
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

        </form>

        {/* MODAL ACTIONS FOOTER */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-900/80 bg-slate-50/50 dark:bg-slate-950/40 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all duration-200"
          >
            Cancelar
          </button>
          
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-650/15 transition-all duration-200"
          >
            {jobToEdit ? 'Guardar Cambios' : 'Añadir Candidatura'}
          </button>
        </div>

      </div>
    </div>
  );
}
