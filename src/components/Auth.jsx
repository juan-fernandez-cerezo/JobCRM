import React, { useState } from 'react';
import { Briefcase, Mail, Lock, User, Phone, AlertCircle, ShieldAlert, ChevronRight, X } from 'lucide-react';

const GOOGLE_ACCOUNTS = [
  { name: 'Juan', surname: 'García', email: 'juan.garcia@gmail.com' },
  { name: 'Juan Dev', surname: 'Senior', email: 'juan.dev.senior@gmail.com' }
];

export default function Auth({ login, signUp, loginWithGoogle, isSupabaseConfigured }) {
  const [authMode, setAuthMode] = useState('register'); // 'register' | 'login'
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [isCustomGoogleMode, setIsCustomGoogleMode] = useState(false);
  const [apiError, setApiError] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Custom Google Selector Fields
  const [customGoogle, setCustomGoogle] = useState({
    name: '',
    surname: '',
    email: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    if (apiError) setApiError('');
  };

  const validate = () => {
    const newErrors = {};

    if (authMode === 'register') {
      if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
      if (!formData.surname.trim()) newErrors.surname = 'Los apellidos son obligatorios';
      if (!formData.phone.trim()) newErrors.phone = 'El teléfono es obligatorio';
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Debes confirmar la contraseña';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato de correo no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setApiError('');

    try {
      if (authMode === 'register') {
        if (signUp) {
          await signUp(formData.email, formData.password, formData.name, formData.surname, formData.phone);
        } else {
          await login(formData.email, formData.password, formData.name, formData.surname, formData.phone);
        }
      } else {
        await login(formData.email, formData.password);
      }
    } catch (err) {
      console.error('Error de autenticación:', err);
      setApiError(err.message || 'No se pudo iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSelect = async (acc) => {
    setIsLoading(true);
    setShowGoogleChooser(false);
    setApiError('');
    try {
      await loginWithGoogle(acc.email, acc.name, acc.surname);
    } catch (err) {
      setApiError(err.message || 'Error con el inicio de sesión de Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomGoogleSubmit = async (e) => {
    e.preventDefault();
    if (!customGoogle.name.trim() || !customGoogle.surname.trim() || !customGoogle.email.trim()) {
      alert('Por favor, rellena todos los campos de la cuenta Google');
      return;
    }
    if (!customGoogle.email.includes('@')) {
      alert('Escribe un correo de Google válido');
      return;
    }

    setIsLoading(true);
    setShowGoogleChooser(false);
    setIsCustomGoogleMode(false);
    setApiError('');
    try {
      await loginWithGoogle(customGoogle.email, customGoogle.name, customGoogle.surname);
    } catch (err) {
      setApiError(err.message || 'Error al autenticar con Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMode = () => {
    setAuthMode(prev => prev === 'register' ? 'login' : 'register');
    setErrors({});
    setApiError('');
  };

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center bg-slate-900 overflow-hidden font-sans select-none">
      
      {/* GLOWING MESH DECORATIVE BACKGROUNDS */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-3xl animate-pulse duration-8000"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/15 rounded-full blur-3xl animate-pulse duration-6000"></div>
      <div className="absolute top-[30%] right-[20%] w-[35%] h-[35%] bg-blue-600/10 rounded-full blur-3xl animate-pulse duration-10000"></div>

      {/* FLOATING LOGO */}
      <div className="absolute top-8 left-8 flex items-center gap-2.5 text-white">
        <div className="bg-gradient-to-tr from-indigo-500 to-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
          <Briefcase size={20} />
        </div>
        <div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
            JobTracker
          </span>
          <span className="text-[10px] font-bold text-indigo-400 block tracking-widest uppercase">Pro CRM</span>
        </div>
      </div>

      {/* DYNAMIC AUTHENTICATION CARD */}
      <div className="relative w-full max-w-lg mx-4 p-8 rounded-3xl glass-effect border border-white/10 shadow-2xl z-10 flex flex-col justify-center animate-slide-in">
        
        {/* DATABASE STATUS BADGE */}
        <div className="flex justify-center mb-3">
          {isSupabaseConfigured ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Conectado a Supabase PostgreSQL
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Modo Local / Demo (Configura .env para Supabase)
            </div>
          )}
        </div>

        {/* API ERROR BANNER */}
        {apiError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle size={16} className="text-rose-400 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-white tracking-tight">
            {authMode === 'register' ? 'Registra tu Cuenta 🚀' : '¡Hola de nuevo! 👋'}
          </h2>
          <p className="text-slate-350 text-xs mt-2 font-medium">
            {authMode === 'register' 
              ? 'Configura tu perfil de candidato para comenzar a trackear tus ofertas.' 
              : 'Inicia sesión para acceder a tu panel de seguimiento.'}
          </p>
        </div>

        {/* AUTH FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {authMode === 'register' && (
            <>
              {/* REGISTER NAME & SURNAME */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 pl-1">
                    Nombre
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFieldChange}
                      placeholder="Ej: Juan"
                      disabled={isLoading}
                      className={`w-full pl-9 pr-3 py-2.5 text-xs text-white bg-slate-950/40 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
                        errors.name ? 'border-rose-600' : 'border-white/10'
                      }`}
                    />
                  </div>
                  {errors.name && <p className="text-[9px] text-rose-450 font-bold mt-1 pl-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 pl-1">
                    Apellidos
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text"
                      name="surname"
                      value={formData.surname}
                      onChange={handleFieldChange}
                      placeholder="Ej: García"
                      disabled={isLoading}
                      className={`w-full pl-9 pr-3 py-2.5 text-xs text-white bg-slate-950/40 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
                        errors.surname ? 'border-rose-600' : 'border-white/10'
                      }`}
                    />
                  </div>
                  {errors.surname && <p className="text-[9px] text-rose-450 font-bold mt-1 pl-1">{errors.surname}</p>}
                </div>
              </div>

              {/* REGISTER PHONE */}
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 pl-1">
                  Número Telefónico
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFieldChange}
                    placeholder="+34 600 000 000"
                    disabled={isLoading}
                    className={`w-full pl-9 pr-3 py-2.5 text-xs text-white bg-slate-950/40 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
                      errors.phone ? 'border-rose-600' : 'border-white/10'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-[9px] text-rose-450 font-bold mt-1 pl-1">{errors.phone}</p>}
              </div>
            </>
          )}

          {/* EMAIL INPUT */}
          <div>
            <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 pl-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFieldChange}
                placeholder="juan@ejemplo.com"
                disabled={isLoading}
                className={`w-full pl-9 pr-3 py-2.5 text-xs text-white bg-slate-950/40 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
                  errors.email ? 'border-rose-600' : 'border-white/10'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-[9px] text-rose-450 font-bold mt-1 pl-1 flex items-center gap-1">
                <AlertCircle size={10} /> {errors.email}
              </p>
            )}
          </div>

          {/* PASSWORD INPUTS */}
          <div className={`grid grid-cols-1 ${authMode === 'register' ? 'md:grid-cols-2 gap-4' : 'gap-0'}`}>
            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 pl-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFieldChange}
                  placeholder="••••••••••••"
                  disabled={isLoading}
                  className={`w-full pl-9 pr-3 py-2.5 text-xs text-white bg-slate-950/40 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
                    errors.password ? 'border-rose-600' : 'border-white/10'
                  }`}
                />
              </div>
              {errors.password && <p className="text-[9px] text-rose-450 font-bold mt-1 pl-1">{errors.password}</p>}
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 pl-1">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleFieldChange}
                    placeholder="••••••••••••"
                    disabled={isLoading}
                    className={`w-full pl-9 pr-3 py-2.5 text-xs text-white bg-slate-950/40 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-550 transition-all ${
                      errors.confirmPassword ? 'border-rose-600' : 'border-white/10'
                    }`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-[9px] text-rose-450 font-bold mt-1 pl-1">{errors.confirmPassword}</p>}
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-650/20 hover:shadow-indigo-650/35 transition-all duration-300 flex items-center justify-center cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>{authMode === 'register' ? 'Crear mi Cuenta y Acceder' : 'Acceder al CRM'}</span>
              )}
            </button>
          </div>

        </form>

        {/* OR DIVIDER */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest px-3">O continúa con</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* GOOGLE AUTH BUTTON */}
        <button
          type="button"
          onClick={() => setShowGoogleChooser(true)}
          disabled={isLoading}
          className="w-full py-3 bg-slate-950/35 hover:bg-slate-950/55 border border-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          {/* Google Logo SVG */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.04c1.62 0 3.08.56 4.22 1.64l3.15-3.15C17.45 1.72 14.93 1 12 1 7.35 1 3.39 3.65 1.48 7.5l3.8 2.95C6.18 7.42 8.87 5.04 12 5.04z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.75-4.88 3.75-8.49z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.5c-.24-.72-.38-1.48-.38-2.28s.14-1.56.38-2.28L1.48 7.5C.54 9.4.01 11.64.01 14s.53 4.6 1.47 6.5l3.8-3c-.24-.72-.38-1.48-.38-2.28z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.66-2.84c-1.01.67-2.31 1.08-3.9 1.08-3.13 0-5.82-2.38-6.76-5.41l-3.8 3C3.39 20.35 7.35 23 12 23z"
            />
          </svg>
          <span>{authMode === 'register' ? 'Registrarse con Google' : 'Acceder con Google'}</span>
        </button>

        {/* TOGGLE LINKS */}
        <div className="mt-5 text-center">
          <button 
            type="button" 
            onClick={handleToggleMode}
            disabled={isLoading}
            className="text-xs text-slate-350 hover:text-white font-medium focus:outline-none transition-colors cursor-pointer"
          >
            {authMode === 'register' 
              ? '¿Ya tienes una cuenta de candidato? Inicia Sesión' 
              : '¿No tienes una cuenta aún? Regístrate gratis'}
          </button>
        </div>

      </div>

      {/* MOCK GOOGLE ACCOUNT SELECTOR MODAL (OVERLAY) */}
      {showGoogleChooser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-4">
          {/* Modal Backdrop */}
          <div 
            onClick={() => { setShowGoogleChooser(false); setIsCustomGoogleMode(false); }}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300"
          ></div>

          {/* Account Selector Card */}
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 z-10 animate-slide-in flex flex-col">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.75-4.88 3.75-8.49z"/>
                  <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.66-2.84c-1.01.67-2.31 1.08-3.9 1.08-3.13 0-5.82-2.38-6.76-5.41l-3.8 3C3.39 20.35 7.35 23 12 23z"/>
                  <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.64l3.15-3.15C17.45 1.72 14.93 1 12 1 7.35 1 3.39 3.65 1.48 7.5l3.8 2.95C6.18 7.42 8.87 5.04 12 5.04z"/>
                  <path fill="#FBBC05" d="M5.28 14.5c-.24-.72-.38-1.48-.38-2.28s.14-1.56.38-2.28L1.48 7.5C.54 9.4.01 11.64.01 14s.53 4.6 1.47 6.5l3.8-3c-.24-.72-.38-1.48-.38-2.28z"/>
                </svg>
                <span className="text-xs font-black text-slate-800 dark:text-white">Google Accounts</span>
              </div>
              <button 
                onClick={() => { setShowGoogleChooser(false); setIsCustomGoogleMode(false); }}
                className="p-1 rounded-lg text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            {!isCustomGoogleMode ? (
              <div className="py-4 space-y-3.5">
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Selecciona una cuenta de Google
                </p>

                {/* Pre-configured Account Options */}
                {GOOGLE_ACCOUNTS.map((acc, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleGoogleSelect(acc)}
                    className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-150 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/40 text-left transition-all duration-200 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-md shadow-indigo-500/10">
                        {acc.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                          {acc.name} {acc.surname}
                        </p>
                        <p className="text-[10px] text-slate-450 dark:text-slate-500 truncate">
                          {acc.email}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity pl-1 shrink-0" />
                  </button>
                ))}

                {/* Use another account button */}
                <button
                  type="button"
                  onClick={() => setIsCustomGoogleMode(true)}
                  className="w-full flex items-center justify-center gap-2 p-3 text-xs font-extrabold rounded-2xl border border-dashed border-slate-250 dark:border-slate-800 text-indigo-550 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-950/20 transition-colors cursor-pointer"
                >
                  + Usar otra cuenta de Google
                </button>
              </div>
            ) : (
              /* Custom Google Account Entry Sub-form */
              <form onSubmit={handleCustomGoogleSubmit} className="py-4 space-y-3.5">
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Ingresa tu cuenta de Google
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-450 dark:text-slate-500 uppercase mb-1">Nombre</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej: Juan"
                      value={customGoogle.name}
                      onChange={(e) => setCustomGoogle(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-slate-800 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-450 dark:text-slate-500 uppercase mb-1">Apellidos</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej: López"
                      value={customGoogle.surname}
                      onChange={(e) => setCustomGoogle(prev => ({ ...prev, surname: e.target.value }))}
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-slate-800 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-450 dark:text-slate-500 uppercase mb-1">Gmail de Google</label>
                    <input 
                      type="email" 
                      required
                      placeholder="ejemplo@gmail.com"
                      value={customGoogle.email}
                      onChange={(e) => setCustomGoogle(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-slate-800 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCustomGoogleMode(false)}
                    className="flex-1 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Atrás
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-bold rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white shadow-md shadow-indigo-650/15 transition-all"
                  >
                    Acceder
                  </button>
                </div>
              </form>
            )}

            <div className="text-[9px] text-center text-slate-400 dark:text-slate-500 mt-2">
              Google no compartirá tu contraseña ni cookies con esta aplicación.
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
