import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import Analytics from './components/Analytics';
import JobModal from './components/JobModal';
import JobDetails from './components/JobDetails';
import ProfileModal from './components/ProfileModal';
import Auth from './components/Auth';
import { useJobs } from './hooks/useJobs';

export default function App() {
  const {
    jobs,
    filteredJobs,
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    selectedJobId,
    setSelectedJobId,
    selectedJob,
    isAddModalOpen,
    setIsAddModalOpen,
    isProfileModalOpen,
    setIsProfileModalOpen,
    searchQuery,
    setSearchQuery,
    filterLocation,
    setFilterLocation,
    
    // Auth
    auth,
    login,
    loginWithGoogle,
    logout,

    // Profile & Library
    profile,
    updateProfile,
    addDocumentToLibrary,
    removeDocumentFromLibrary,
    downloadDocument,

    // Actions
    addJob,
    updateJob,
    deleteJob,
    moveJob,
    isSupabaseConfigured,
    seedDemoDataToSupabase,
    signUp,
    addInterview,
    deleteInterview,
    exportData,
    importData,
    exportToExcel
  } = useJobs();

  // State to track if we are editing an application inside the JobModal
  const [jobToEdit, setJobToEdit] = useState(null);

  // AUTH PROTECTION LAYER
  if (!auth.isLoggedIn) {
    return (
      <Auth 
        login={login} 
        signUp={signUp} 
        loginWithGoogle={loginWithGoogle} 
        isSupabaseConfigured={isSupabaseConfigured} 
      />
    );
  }

  const handleEditClick = (job) => {
    setJobToEdit(job);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setJobToEdit(null);
  };

  const handleAddOrEditJob = (formData) => {
    if (jobToEdit) {
      updateJob(jobToEdit.id, formData);
      setJobToEdit(null);
    } else {
      addJob(formData);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      
      {/* SIDEBAR NAVIGATION & FILTERS */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        exportData={exportData}
        importData={importData}
        setIsAddModalOpen={setIsAddModalOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterLocation={filterLocation}
        setFilterLocation={setFilterLocation}
        jobsCount={jobs.length}
        setIsProfileModalOpen={setIsProfileModalOpen}
        logout={logout}
        profile={profile}
      />

      {/* MAIN VIEWPORT PANELS */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {activeTab === 'dashboard' && (
          <Dashboard 
            jobs={filteredJobs} 
            profile={profile}
            isSupabaseConfigured={isSupabaseConfigured}
            seedDemoDataToSupabase={seedDemoDataToSupabase}
            setActiveTab={setActiveTab}
            setSelectedJobId={setSelectedJobId}
            setIsAddModalOpen={setIsAddModalOpen}
          />
        )}

        {activeTab === 'kanban' && (
          <KanbanBoard 
            filteredJobs={filteredJobs} 
            moveJob={moveJob}
            setSelectedJobId={setSelectedJobId}
            setIsAddModalOpen={setIsAddModalOpen}
            exportToExcel={exportToExcel}
          />
        )}

        {activeTab === 'analytics' && (
          <Analytics 
            jobs={filteredJobs}
          />
        )}
      </main>

      {/* NEW OR EDIT APPLICATION DRAWER MODAL */}
      <JobModal 
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        addJob={handleAddOrEditJob}
        editJob={updateJob}
        jobToEdit={jobToEdit}
        profile={profile}
        addDocumentToLibrary={addDocumentToLibrary}
      />

      {/* DETAILED JOB VIEW SLIDER MODAL */}
      {selectedJob && (
        <JobDetails 
          job={selectedJob}
          onClose={() => setSelectedJobId(null)}
          updateJob={updateJob}
          deleteJob={deleteJob}
          addInterview={addInterview}
          deleteInterview={deleteInterview}
          onEditClick={handleEditClick}
          downloadDocument={downloadDocument}
        />
      )}

      {/* CANDIDATE PROFILE SLIDE OVER DRAWER */}
      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        updateProfile={updateProfile}
        addDocumentToLibrary={addDocumentToLibrary}
        removeDocumentFromLibrary={removeDocumentFromLibrary}
        downloadDocument={downloadDocument}
      />

    </div>
  );
}
