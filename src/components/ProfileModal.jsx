import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, FileText, UploadCloud, Trash2, ShieldCheck, Download } from 'lucide-react';

export default function ProfileModal({ 
  isOpen, 
  onClose, 
  profile, 
  updateProfile, 
  addDocumentToLibrary, 
  removeDocumentFromLibrary,
  downloadDocument 
}) {
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'library'
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: ''
  });
  const [isSavedGlow, setIsSavedGlow] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        surname: profile.surname || '',
        email: profile.email || '',
        phone: profile.phone || ''
      });
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    
    // Play a gorgeous saved animation feel
    setIsSavedGlow(true);
    setTimeout(() => {
      setIsSavedGlow(false);
    }, 2000);
  };

  // Real or simulated global file uploads
  const handleLibraryUpload = async (e, docType) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        await addDocumentToLibrary(docType, file);
      } finally {
        setIsUploading(false);
        e.target.value = '';
      }
    }
  };

  // Download handler (Real Supabase Storage or fallback)
  const handleDownload = (fileName, docType) => {
    if (downloadDocument) {
      downloadDocument(fileName, docType);
    } else {
      triggerSimulatedDownload(fileName, docType);
    }
  };

  const triggerSimulatedDownload = (fileName, docType) => {
    const fileContent = `=== Documento JobTracker ===\n\nTipo: ${docType}\nNombre: ${fileName}\nPropietario: ${profile.name} ${profile.surname}\nFecha: ${new Date().toLocaleDateString()}`;
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

      {/* DRAWER PANEL */}
      <div className="relative w-full max-w-lg h-full bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-10 animate-slide-in">
        
        {/* PANEL HEADER */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-950/20">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 text-white p-2.5 rounded-xl">
              <User size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white dark:text-white leading-tight">
                Mi Perfil de Candidato
              </h3>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                Configuración Personal & Archivos
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-650 dark:hover:text-slate-250 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* PROFILE SUB-TABS */}
        <div className="px-6 border-b border-slate-100 dark:border-slate-900 shrink-0 flex gap-4 bg-white dark:bg-slate-950">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3.5 border-b-2 font-bold text-xs transition-all duration-300 ${
              activeTab === 'details' 
                ? 'border-indigo-500 text-indigo-700 dark:text-indigo-400' 
                : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700'
            }`}
          >
            Datos Personales
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`py-3.5 border-b-2 font-bold text-xs transition-all duration-300 ${
              activeTab === 'library' 
                ? 'border-indigo-500 text-indigo-700 dark:text-indigo-400' 
                : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700'
            }`}
          >
            Biblioteca de Archivos
          </button>
        </div>

        {/* CONTAINER SCROLL BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB: DETAILS (EDIT FORM) */}
          {activeTab === 'details' && (
            <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
              
              {/* SAVED FLOATING ANIMATION BANNER */}
              {isSavedGlow && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-bounce">
                  <ShieldCheck size={16} />
                  <span>¡Los cambios se han guardado y sincronizado correctamente!</span>
                </div>
              )}

              {/* FIRSTNAME & SURNAME */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Nombre
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ej: Juan"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Apellidos
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text"
                      name="surname"
                      value={formData.surname}
                      onChange={handleChange}
                      placeholder="Ej: García"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Correo Electrónico de Contacto
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="juan@ejemplo.com"
                    className="w-full pl-8 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Número Telefónico
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+34 600 000 000"
                    className="w-full pl-8 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-900 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-650/15 transition-all duration-200"
                >
                  Guardar Cambios
                </button>
              </div>

            </form>
          )}

          {/* TAB: LIBRARY (FILE MANAGER) */}
          {activeTab === 'library' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* CV LIBRARY CARD */}
              <div className="space-y-3.5">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Biblioteca de Currículums (CVs)
                  </h4>
                  <label className="cursor-pointer flex items-center gap-1 text-[10px] font-extrabold text-indigo-650 dark:text-indigo-400 hover:underline">
                    <UploadCloud size={12} /> Subir nuevo CV
                    <input 
                      type="file" 
                      onChange={(e) => handleLibraryUpload(e, 'cv')}
                      className="hidden" 
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                </div>

                <div className="space-y-2">
                  {(!profile.cvs || profile.cvs.length === 0) ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic p-3 border border-slate-100 dark:border-slate-900 rounded-xl bg-slate-50/20 dark:bg-slate-950/10">
                      No hay ningún currículum registrado en la biblioteca.
                    </p>
                  ) : (
                    profile.cvs.map((file) => (
                      <div 
                        key={file} 
                        className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-900 bg-slate-50/15 dark:bg-slate-950/20 hover:border-slate-300 dark:hover:border-slate-800 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText size={14} className="text-indigo-500 shrink-0" />
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate pr-2">
                            {file}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <button
                            onClick={() => handleDownload(file, 'Curriculum Vitae')}
                            className="p-1 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                            title="Descargar este archivo"
                          >
                            <Download size={13} />
                          </button>
                          <button
                            onClick={() => removeDocumentFromLibrary('cv', file)}
                            className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded transition-colors"
                            title="Eliminar de la biblioteca"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* COVER LETTER LIBRARY CARD */}
              <div className="space-y-3.5 pt-4 border-t border-slate-100 dark:border-slate-900">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Biblioteca de Cartas de Presentación
                  </h4>
                  <label className="cursor-pointer flex items-center gap-1 text-[10px] font-extrabold text-indigo-650 dark:text-indigo-400 hover:underline">
                    <UploadCloud size={12} /> {isUploading ? 'Subiendo...' : 'Subir nueva Carta'}
                    <input 
                      type="file" 
                      onChange={(e) => handleLibraryUpload(e, 'coverLetter')}
                      className="hidden" 
                      accept=".pdf,.doc,.docx"
                      disabled={isUploading}
                    />
                  </label>
                </div>

                <div className="space-y-2">
                  {(!profile.coverLetters || profile.coverLetters.length === 0) ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic p-3 border border-slate-100 dark:border-slate-900 rounded-xl bg-slate-50/20 dark:bg-slate-950/10">
                      No hay ninguna carta de presentación registrada en la biblioteca.
                    </p>
                  ) : (
                    profile.coverLetters.map((file) => (
                      <div 
                        key={file} 
                        className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-900 bg-slate-50/15 dark:bg-slate-950/20 hover:border-slate-300 dark:hover:border-slate-800 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText size={14} className="text-indigo-500 shrink-0" />
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate pr-2">
                            {file}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <button
                            onClick={() => handleDownload(file, 'Carta de Presentacion')}
                            className="p-1 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                            title="Descargar este archivo"
                          >
                            <Download size={13} />
                          </button>
                          <button
                            onClick={() => removeDocumentFromLibrary('coverLetter', file)}
                            className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded transition-colors"
                            title="Eliminar de la biblioteca"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
