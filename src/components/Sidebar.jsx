import React, { useRef } from 'react';
import { 
  LayoutDashboard, 
  Columns, 
  BarChart3, 
  Download, 
  Upload, 
  Sun, 
  Moon, 
  User, 
  PlusCircle, 
  Search, 
  MapPin, 
  Briefcase,
  LogOut
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  theme,
  toggleTheme,
  exportData,
  importData,
  setIsAddModalOpen,
  searchQuery,
  setSearchQuery,
  filterLocation,
  setFilterLocation,
  jobsCount,
  setIsProfileModalOpen,
  logout,
  profile
}) {
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      await importData(file);
      alert('¡Datos importados con éxito!');
    } catch (err) {
      alert(err.message || 'Error al importar datos.');
    }
    
    // Clear input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <aside className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0 transition-colors duration-300">
      {/* HEADER LOGO */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-500 to-blue-600 text-white p-2.5 rounded-xl shadow-md shadow-blue-500/20">
            <Briefcase size={22} className="animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl bg-gradient-to-r from-slate-900 to-indigo-600 dark:from-white dark:to-indigo-400 bg-clip-text text-transparent tracking-tight">
              JobTracker
            </h1>
            <span className="text-xs font-semibold text-indigo-500 tracking-wider uppercase">Pro CRM</span>
          </div>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      {/* QUICK SEARCH & FILTERS */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Buscar empresa, puesto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500/80 transition-all duration-200"
          />
        </div>

        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 px-1">
            <MapPin size={12} />
            <span>Filtro:</span>
          </div>
          <div className="flex gap-1 flex-1">
            {['All', 'Remote', 'Hybrid', 'Onsite'].map((loc) => (
              <button
                key={loc}
                onClick={() => setFilterLocation(loc)}
                className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all duration-200 flex-1 text-center ${
                  filterLocation === loc 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-500/10 dark:border-indigo-500/30 dark:text-indigo-400' 
                    : 'bg-transparent border-slate-300 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                {loc === 'All' ? 'Todos' : loc}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold tracking-wider uppercase px-2 mb-2">
          Vistas principales
        </div>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
            activeTab === 'dashboard'
              ? 'bg-gradient-to-r from-indigo-500/10 to-blue-500/5 text-indigo-600 dark:text-indigo-400 border-l-4 border-indigo-500 font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 border-l-4 border-transparent'
          }`}
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard size={18} />
            <span>Panel General</span>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            {jobsCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('kanban')}
          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
            activeTab === 'kanban'
              ? 'bg-gradient-to-r from-indigo-500/10 to-blue-500/5 text-indigo-600 dark:text-indigo-400 border-l-4 border-indigo-500 font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 border-l-4 border-transparent'
          }`}
        >
          <div className="flex items-center gap-3">
            <Columns size={18} />
            <span>Tablero Kanban</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
            activeTab === 'analytics'
              ? 'bg-gradient-to-r from-indigo-500/10 to-blue-500/5 text-indigo-600 dark:text-indigo-400 border-l-4 border-indigo-500 font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 border-l-4 border-transparent'
          }`}
        >
          <div className="flex items-center gap-3">
            <BarChart3 size={18} />
            <span>Estadísticas</span>
          </div>
        </button>

        <div className="pt-6">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-xl font-semibold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/45 dark:shadow-indigo-950/20 transition-all duration-300"
          >
            <PlusCircle size={16} />
            <span>Nueva Aplicación</span>
          </button>
        </div>
      </nav>

      {/* PORTABILITY ACTIONS */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/15 space-y-2">
        <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold tracking-wider uppercase px-1 mb-1">
          Portabilidad de datos
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportData}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all duration-200"
          >
            <Download size={13} />
            <span>Respaldar</span>
          </button>
          
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={handleImportClick}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all duration-200"
          >
            <Upload size={13} />
            <span>Importar</span>
          </button>
        </div>
      </div>

      {/* PROFILE INFO & LOGOUT */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 shrink-0">
        <div 
          onClick={() => setIsProfileModalOpen(true)}
          className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
          title="Ver mi perfil"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20 shrink-0">
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
              {profile.name} {profile.surname}
            </h4>
            <p className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 truncate mt-0.5">
              Mi Perfil · Biblioteca
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-200 shrink-0"
          title="Cerrar sesión"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
