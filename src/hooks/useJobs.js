import { useState, useEffect, useCallback } from 'react';
import { INITIAL_JOBS } from '../utils/mockData';
import * as XLSX from 'xlsx';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const DEFAULT_PROFILE = {
  name: 'Juan',
  surname: 'García',
  email: 'juan.garcia@example.com',
  phone: '+34 600 123 456',
  cvs: [
    'CV_Juan_Senior_React_2026.pdf',
    'CV_Juan_React_Staff.pdf',
    'CV_Juan_Fullstack_2026.pdf'
  ],
  coverLetters: [
    'Carta_Presentacion_Google.pdf',
    'Cover_Letter_Spotify_Juan.pdf',
    'Carta_Motivacion_StartupX.pdf'
  ]
};

// ==============================================================================
// ADAPTADORES DE DATOS: BASE DE DATOS (snake_case) <-> INTERFAZ (camelCase)
// ==============================================================================
function mapDbJobToUi(dbJob) {
  return {
    id: dbJob.id,
    company: dbJob.company,
    position: dbJob.position,
    status: dbJob.status,
    appliedDate: dbJob.applied_date || new Date().toISOString().split('T')[0],
    salary: dbJob.salary || '',
    location: dbJob.location || 'Remote',
    city: dbJob.city || '',
    url: dbJob.url || '',
    rating: dbJob.rating || 3,
    description: dbJob.description || '',
    cvName: dbJob.cv_name || null,
    coverLetterName: dbJob.cover_letter_name || null,
    feedback: dbJob.feedback || '',
    interviews: (dbJob.interviews || []).map(i => ({
      id: i.id,
      type: i.type,
      date: i.date,
      interviewer: i.interviewer,
      rating: i.rating,
      notes: i.notes || '',
      questions: i.questions || []
    })),
    history: (dbJob.job_history || []).map(h => ({
      id: h.id,
      date: h.date,
      action: h.action
    }))
  };
}

function mapUiJobToDb(uiJob, userId) {
  return {
    user_id: userId,
    company: uiJob.company,
    position: uiJob.position,
    status: uiJob.status,
    applied_date: uiJob.appliedDate || new Date().toISOString().split('T')[0],
    salary: uiJob.salary || '',
    location: uiJob.location || 'Remote',
    city: uiJob.city || '',
    url: uiJob.url || '',
    rating: uiJob.rating || 3,
    description: uiJob.description || '',
    cv_name: uiJob.cvName || null,
    cover_letter_name: uiJob.coverLetterName || null,
    feedback: uiJob.feedback || ''
  };
}

export function useJobs() {
  // Authentication State
  const [auth, setAuth] = useState(() => {
    try {
      const savedAuth = localStorage.getItem('jobtracker_auth');
      return savedAuth ? JSON.parse(savedAuth) : { isLoggedIn: false, user: null };
    } catch (e) {
      return { isLoggedIn: false, user: null };
    }
  });

  // Profile State
  const [profile, setProfile] = useState(() => {
    try {
      const savedProfile = localStorage.getItem('jobtracker_profile');
      return savedProfile ? JSON.parse(savedProfile) : DEFAULT_PROFILE;
    } catch (e) {
      return DEFAULT_PROFILE;
    }
  });

  // Jobs List State
  const [jobs, setJobs] = useState(() => {
    try {
      const savedJobs = localStorage.getItem('jobtracker_jobs');
      return savedJobs ? JSON.parse(savedJobs) : INITIAL_JOBS;
    } catch (e) {
      return INITIAL_JOBS;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'kanban' | 'analytics'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('jobtracker_theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('All'); // 'All' | 'Remote' | 'Hybrid' | 'Onsite'

  // ==============================================================================
  // SINCRONIZACIÓN CON SUPABASE: Carga inicial de datos del usuario
  // ==============================================================================
  const loadUserDataFromSupabase = useCallback(async (user) => {
    if (!isSupabaseConfigured || !user) return;
    setIsLoading(true);

    try {
      // 1. Cargar Perfil
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileData) {
        setProfile({
          name: profileData.name || user.user_metadata?.name || '',
          surname: profileData.surname || user.user_metadata?.surname || '',
          email: profileData.email || user.email || '',
          phone: profileData.phone || user.user_metadata?.phone || '',
          cvs: profileData.cvs || DEFAULT_PROFILE.cvs,
          coverLetters: profileData.cover_letters || DEFAULT_PROFILE.coverLetters
        });
      } else {
        // Crear perfil inicial si no existe en la tabla
        const initialProfile = {
          id: user.id,
          name: user.user_metadata?.name || 'Candidato',
          surname: user.user_metadata?.surname || '',
          email: user.email,
          phone: user.user_metadata?.phone || '',
          cvs: DEFAULT_PROFILE.cvs,
          cover_letters: DEFAULT_PROFILE.coverLetters
        };
        await supabase.from('profiles').insert([initialProfile]);
        setProfile({
          name: initialProfile.name,
          surname: initialProfile.surname,
          email: initialProfile.email,
          phone: initialProfile.phone,
          cvs: initialProfile.cvs,
          coverLetters: initialProfile.cover_letters
        });
      }

      // 2. Cargar Candidaturas con sus Entrevistas e Historial
      const { data: jobsData, error: jobsErr } = await supabase
        .from('jobs')
        .select('*, interviews(*), job_history(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!jobsErr && jobsData) {
        const mappedJobs = jobsData.map(mapDbJobToUi);
        setJobs(mappedJobs);
      }
    } catch (err) {
      console.error('Error cargando datos de Supabase:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Escuchar estado de sesión de Supabase
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Verificar sesión activa
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuth({
          isLoggedIn: true,
          user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email.split('@')[0],
            surname: session.user.user_metadata?.surname || ''
          }
        });
        loadUserDataFromSupabase(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setAuth({
          isLoggedIn: true,
          user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email.split('@')[0],
            surname: session.user.user_metadata?.surname || ''
          }
        });
        loadUserDataFromSupabase(session.user);
      } else if (event === 'SIGNED_OUT') {
        setAuth({ isLoggedIn: false, user: null });
        setSelectedJobId(null);
        setIsProfileModalOpen(false);
        setIsAddModalOpen(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadUserDataFromSupabase]);

  // Sync state to LocalStorage como respaldo
  useEffect(() => {
    localStorage.setItem('jobtracker_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('jobtracker_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('jobtracker_auth', JSON.stringify(auth));
  }, [auth]);

  // Sync theme class to document body
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('jobtracker_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const selectedJob = jobs.find(j => j.id === selectedJobId) || null;

  // ==============================================================================
  // MÉTODOS DE AUTENTICACIÓN (SUPABASE + FALLBACK LOCAL)
  // ==============================================================================
  const signUp = async (email, password, name = '', surname = '', phone = '') => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, surname, phone }
        }
      });
      if (error) throw error;
      return data;
    } else {
      // Modo Mock Local
      login(email, password, name, surname, phone);
      return { user: { email, name, surname } };
    }
  };

  const login = async (email, password, name = '', surname = '', phone = '') => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return data;
    } else {
      // Modo Mock Local
      if (name || surname || phone) {
        updateProfile({
          name: name || profile.name,
          surname: surname || profile.surname,
          email: email,
          phone: phone || profile.phone
        });
      }
      setAuth({
        isLoggedIn: true,
        user: {
          name: name || profile.name,
          surname: surname || profile.surname,
          email: email
        }
      });
    }
  };

  const loginWithGoogle = async (email, name, surname) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) {
        console.warn('Google OAuth en Supabase requiere Client ID configurado:', error.message);
        // Fallback a selector mock de google si OAuth no está activo en Supabase
        updateProfile({ name, surname, email });
        setAuth({
          isLoggedIn: true,
          user: { name, surname, email }
        });
      }
      return data;
    } else {
      // Modo Mock Local
      updateProfile({ name, surname, email });
      setAuth({
        isLoggedIn: true,
        user: { name, surname, email }
      });
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setAuth({
      isLoggedIn: false,
      user: null
    });
    setSelectedJobId(null);
    setIsProfileModalOpen(false);
    setIsAddModalOpen(false);
  };

  // ==============================================================================
  // GESTIÓN DE PERFIL Y DOCUMENTOS
  // ==============================================================================
  const updateProfile = async (updatedProfile) => {
    setProfile(prev => {
      const merged = { ...prev, ...updatedProfile };
      if (auth.isLoggedIn) {
        setAuth(curr => ({
          ...curr,
          user: {
            ...curr.user,
            name: merged.name,
            surname: merged.surname,
            email: merged.email
          }
        }));
      }
      return merged;
    });

    if (isSupabaseConfigured && auth.user?.id) {
      try {
        await supabase
          .from('profiles')
          .update({
            name: updatedProfile.name,
            surname: updatedProfile.surname,
            email: updatedProfile.email,
            phone: updatedProfile.phone,
            cvs: updatedProfile.cvs,
            cover_letters: updatedProfile.coverLetters
          })
          .eq('id', auth.user.id);
      } catch (e) {
        console.error('Error actualizando perfil en Supabase:', e);
      }
    }
  };

  const addDocumentToLibrary = async (type, fileOrName) => {
    let fileName = '';
    let fileObj = null;

    if (fileOrName instanceof File) {
      fileName = fileOrName.name;
      fileObj = fileOrName;
    } else if (typeof fileOrName === 'string') {
      fileName = fileOrName.trim();
    }

    if (!fileName) return;

    const listKey = type === 'cv' ? 'cvs' : 'coverLetters';
    const existingList = profile[listKey] || [];
    if (!existingList.includes(fileName)) {
      const updatedList = [...existingList, fileName];
      const newProfile = { ...profile, [listKey]: updatedList };
      setProfile(newProfile);

      if (isSupabaseConfigured && auth.user?.id) {
        const dbField = type === 'cv' ? 'cvs' : 'cover_letters';
        await supabase
          .from('profiles')
          .update({ [dbField]: updatedList })
          .eq('id', auth.user.id);
      }
    }

    // Si es un fichero File y Supabase está configurado, subir al bucket 'documents'
    if (fileObj && isSupabaseConfigured) {
      try {
        let userId = auth.user?.id;
        if (!userId) {
          const { data: userData } = await supabase.auth.getUser();
          userId = userData?.user?.id;
        }

        const filePath = `${userId || 'general'}/${fileName}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, fileObj, { upsert: true });

        if (uploadError) {
          console.error('Error subiendo a Supabase Storage:', uploadError);
          const msg = uploadError.message || '';
          if (msg.toLowerCase().includes('bucket not found')) {
            alert('Aviso Supabase: El bucket "documents" aún no existe en tu proyecto de Supabase. Ve a Supabase -> Storage -> New bucket y crea uno llamado "documents" con la opción "Public bucket" marcada.');
          } else if (msg.toLowerCase().includes('security') || msg.toLowerCase().includes('row-level security') || msg.toLowerCase().includes('violates')) {
            alert('Aviso Supabase: La política de seguridad (RLS) bloqueó la subida. Ve al SQL Editor de Supabase y ejecuta el script de políticas de Storage para el bucket "documents".');
          } else {
            alert(`Error de subida a Supabase Storage: ${msg}`);
          }
        } else {
          console.log('Fichero subido con éxito a Supabase Storage:', uploadData);
        }
      } catch (err) {
        console.error('Error procesando subida de archivo:', err);
      }
    }
  };

  const removeDocumentFromLibrary = async (type, fileName) => {
    const listKey = type === 'cv' ? 'cvs' : 'coverLetters';
    const updatedList = (profile[listKey] || []).filter(item => item !== fileName);
    const newProfile = { ...profile, [listKey]: updatedList };
    setProfile(newProfile);

    if (isSupabaseConfigured) {
      let userId = auth.user?.id;
      if (!userId) {
        const { data: userData } = await supabase.auth.getUser();
        userId = userData?.user?.id;
      }

      if (userId) {
        const dbField = type === 'cv' ? 'cvs' : 'cover_letters';
        await supabase
          .from('profiles')
          .update({ [dbField]: updatedList })
          .eq('id', userId);

        try {
          await supabase.storage.from('documents').remove([`${userId}/${fileName}`, `general/${fileName}`]);
        } catch (err) {
          console.error('Error eliminando archivo de Supabase Storage:', err);
        }
      }
    }
  };

  const downloadDocument = async (fileName, defaultType = 'Documento') => {
    if (!fileName) return;

    // 1. Intentar descargar el archivo físico real de Supabase Storage
    if (isSupabaseConfigured) {
      try {
        let userId = auth.user?.id;
        if (!userId) {
          const { data: userData } = await supabase.auth.getUser();
          userId = userData?.user?.id;
        }

        const pathsToTry = [
          userId ? `${userId}/${fileName}` : null,
          `general/${fileName}`,
          fileName
        ].filter(Boolean);

        for (const path of pathsToTry) {
          const { data, error } = await supabase.storage
            .from('documents')
            .download(path);

          if (!error && data) {
            const blobUrl = URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
            return;
          }
        }
      } catch (e) {
        console.log('Descarga desde Storage omitida o error:', e);
      }
    }

    // 2. Fallback: descarga funcional de respaldo
    const mockContent = `%PDF-1.4\n1 0 obj\n<< /Title (${fileName}) /Author (${profile.name || 'Candidato'} ${profile.surname || ''}) >>\nendobj\nContenido de ${defaultType}: ${fileName}\nGenerado por JobTracker Pro`;
    const blob = new Blob([mockContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ==============================================================================
  // OPERACIONES CRUD DE CANDIDATURAS (JOBS)
  // ==============================================================================
  const addJob = async (job) => {
    const tempId = Date.now().toString();
    const createdAction = `Creado en JobTracker con estado '${job.status}'`;
    const initialHistory = [
      { date: new Date().toISOString(), action: createdAction },
      ...(job.status !== 'Wishlist' ? [{ date: new Date().toISOString(), action: 'Candidatura enviada' }] : [])
    ];

    const newJobUi = {
      ...job,
      id: tempId,
      appliedDate: job.appliedDate || new Date().toISOString().split('T')[0],
      interviews: [],
      feedback: job.feedback || '',
      history: initialHistory
    };

    // Actualización optimista local
    setJobs(prev => [newJobUi, ...prev]);

    if (isSupabaseConfigured && auth.user?.id) {
      try {
        const dbPayload = mapUiJobToDb(job, auth.user.id);
        const { data: insertedJob, error: jobErr } = await supabase
          .from('jobs')
          .insert([dbPayload])
          .select()
          .single();

        if (!jobErr && insertedJob) {
          // Reemplazar tempId por el UUID de Supabase
          setJobs(prev => prev.map(j => j.id === tempId ? { ...j, id: insertedJob.id } : j));

          // Insertar eventos iniciales en job_history
          const historyInserts = [
            { job_id: insertedJob.id, user_id: auth.user.id, action: createdAction },
            ...(job.status !== 'Wishlist' ? [{ job_id: insertedJob.id, user_id: auth.user.id, action: 'Candidatura enviada' }] : [])
          ];
          await supabase.from('job_history').insert(historyInserts);
        }
      } catch (err) {
        console.error('Error insertando puesto en Supabase:', err);
      }
    }
  };

  const updateJob = async (id, updatedFields) => {
    let newHistoryAction = null;
    
    setJobs(prev => prev.map(job => {
      if (job.id === id) {
        const statusChanged = updatedFields.status && updatedFields.status !== job.status;
        const newHistory = [...(job.history || [])];
        if (statusChanged) {
          newHistoryAction = `Estado cambiado de '${job.status}' a '${updatedFields.status}'`;
          newHistory.push({
            date: new Date().toISOString(),
            action: newHistoryAction
          });
        }
        return {
          ...job,
          ...updatedFields,
          history: newHistory
        };
      }
      return job;
    }));

    if (isSupabaseConfigured && auth.user?.id) {
      try {
        const dbUpdates = {};
        if (updatedFields.company !== undefined) dbUpdates.company = updatedFields.company;
        if (updatedFields.position !== undefined) dbUpdates.position = updatedFields.position;
        if (updatedFields.status !== undefined) dbUpdates.status = updatedFields.status;
        if (updatedFields.appliedDate !== undefined) dbUpdates.applied_date = updatedFields.appliedDate;
        if (updatedFields.salary !== undefined) dbUpdates.salary = updatedFields.salary;
        if (updatedFields.location !== undefined) dbUpdates.location = updatedFields.location;
        if (updatedFields.city !== undefined) dbUpdates.city = updatedFields.city;
        if (updatedFields.url !== undefined) dbUpdates.url = updatedFields.url;
        if (updatedFields.rating !== undefined) dbUpdates.rating = updatedFields.rating;
        if (updatedFields.description !== undefined) dbUpdates.description = updatedFields.description;
        if (updatedFields.cvName !== undefined) dbUpdates.cv_name = updatedFields.cvName;
        if (updatedFields.coverLetterName !== undefined) dbUpdates.cover_letter_name = updatedFields.coverLetterName;
        if (updatedFields.feedback !== undefined) dbUpdates.feedback = updatedFields.feedback;

        if (Object.keys(dbUpdates).length > 0) {
          await supabase.from('jobs').update(dbUpdates).eq('id', id);
        }

        if (newHistoryAction) {
          await supabase.from('job_history').insert([{
            job_id: id,
            user_id: auth.user.id,
            action: newHistoryAction
          }]);
        }
      } catch (err) {
        console.error('Error actualizando puesto en Supabase:', err);
      }
    }
  };

  const deleteJob = async (id) => {
    setJobs(prev => prev.filter(job => job.id !== id));
    if (selectedJobId === id) setSelectedJobId(null);

    if (isSupabaseConfigured && auth.user?.id) {
      try {
        await supabase.from('jobs').delete().eq('id', id);
      } catch (err) {
        console.error('Error eliminando puesto de Supabase:', err);
      }
    }
  };

  const moveJob = async (id, newStatus) => {
    const historyAction = `Movido en el tablero Kanban a '${newStatus}'`;

    setJobs(prev => prev.map(job => {
      if (job.id === id) {
        if (job.status === newStatus) return job;
        return {
          ...job,
          status: newStatus,
          history: [
            ...(job.history || []),
            {
              date: new Date().toISOString(),
              action: historyAction
            }
          ]
        };
      }
      return job;
    }));

    if (isSupabaseConfigured && auth.user?.id) {
      try {
        await supabase.from('jobs').update({ status: newStatus }).eq('id', id);
        await supabase.from('job_history').insert([{
          job_id: id,
          user_id: auth.user.id,
          action: historyAction
        }]);
      } catch (err) {
        console.error('Error moviendo puesto en Supabase:', err);
      }
    }
  };

  // ==============================================================================
  // GESTIÓN DE RONDAS DE ENTREVISTA (INTERVIEWS)
  // ==============================================================================
  const addInterview = async (jobId, interview) => {
    const tempIntId = Date.now().toString();
    const stageName = interview.type === 'HR' ? 'Entrevista telefónica/HR' : 
                      interview.type === 'Technical' ? 'Prueba/Entrevista técnica' : 
                      interview.type === 'Manager' ? 'Entrevista con Manager' : 'Entrevista';
    const historyAction = `Agendada/Añadida ${stageName} con ${interview.interviewer || 'entrevistador'}`;

    const newInterviewUi = {
      ...interview,
      id: tempIntId,
      questions: interview.questions || []
    };
    
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          interviews: [...(job.interviews || []), newInterviewUi],
          history: [
            ...(job.history || []),
            {
              date: new Date().toISOString(),
              action: historyAction
            }
          ]
        };
      }
      return job;
    }));

    if (isSupabaseConfigured && auth.user?.id) {
      try {
        const { data: insertedInt, error } = await supabase
          .from('interviews')
          .insert([{
            job_id: jobId,
            user_id: auth.user.id,
            type: interview.type,
            date: interview.date,
            interviewer: interview.interviewer,
            rating: interview.rating || 3,
            notes: interview.notes || '',
            questions: interview.questions || []
          }])
          .select()
          .single();

        if (!error && insertedInt) {
          setJobs(prev => prev.map(job => {
            if (job.id === jobId) {
              return {
                ...job,
                interviews: job.interviews.map(i => i.id === tempIntId ? { ...i, id: insertedInt.id } : i)
              };
            }
            return job;
          }));
        }

        await supabase.from('job_history').insert([{
          job_id: jobId,
          user_id: auth.user.id,
          action: historyAction
        }]);
      } catch (err) {
        console.error('Error insertando entrevista en Supabase:', err);
      }
    }
  };

  const updateInterview = async (jobId, interviewId, updatedFields) => {
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          interviews: job.interviews.map(int => int.id === interviewId ? { ...int, ...updatedFields } : int)
        };
      }
      return job;
    }));

    if (isSupabaseConfigured && auth.user?.id) {
      try {
        await supabase
          .from('interviews')
          .update(updatedFields)
          .eq('id', interviewId);
      } catch (err) {
        console.error('Error actualizando entrevista en Supabase:', err);
      }
    }
  };

  const deleteInterview = async (jobId, interviewId) => {
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          interviews: job.interviews.filter(int => int.id !== interviewId)
        };
      }
      return job;
    }));

    if (isSupabaseConfigured && auth.user?.id) {
      try {
        await supabase
          .from('interviews')
          .delete()
          .eq('id', interviewId);
      } catch (err) {
        console.error('Error eliminando entrevista de Supabase:', err);
      }
    }
  };

  // Cargar datos plantilla de demostración a Supabase (para cuentas nuevas con 0 postulaciones)
  const seedDemoDataToSupabase = async () => {
    if (!isSupabaseConfigured || !auth.user?.id) return;
    setIsLoading(true);

    try {
      for (const mockJob of INITIAL_JOBS) {
        const dbPayload = mapUiJobToDb(mockJob, auth.user.id);
        const { data: insertedJob } = await supabase
          .from('jobs')
          .insert([dbPayload])
          .select()
          .single();

        if (insertedJob) {
          // Entrevistas
          if (mockJob.interviews && mockJob.interviews.length > 0) {
            const intPayloads = mockJob.interviews.map(i => ({
              job_id: insertedJob.id,
              user_id: auth.user.id,
              type: i.type,
              date: i.date,
              interviewer: i.interviewer,
              rating: i.rating,
              notes: i.notes,
              questions: i.questions || []
            }));
            await supabase.from('interviews').insert(intPayloads);
          }

          // Historial
          if (mockJob.history && mockJob.history.length > 0) {
            const histPayloads = mockJob.history.map(h => ({
              job_id: insertedJob.id,
              user_id: auth.user.id,
              action: h.action,
              date: h.date
            }));
            await supabase.from('job_history').insert(histPayloads);
          }
        }
      }
      // Recargar
      await loadUserDataFromSupabase(auth.user);
    } catch (e) {
      console.error('Error cargando datos demo en Supabase:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // ==============================================================================
  // EXPORTACIÓN E IMPORTACIÓN
  // ==============================================================================
  const exportData = () => {
    const dataStr = JSON.stringify(jobs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jobtracker_pro_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importData = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          if (Array.isArray(imported)) {
            const valid = imported.every(item => item.company && item.position && item.status);
            if (valid) {
              setJobs(imported);
              resolve(true);
            } else {
              reject(new Error('El archivo JSON no tiene el formato correcto de JobTracker.'));
            }
          } else {
            reject(new Error('El formato del archivo JSON debe ser una lista de aplicaciones.'));
          }
        } catch (err) {
          reject(new Error('Archivo JSON inválido. Verifique su contenido.'));
        }
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo.'));
      reader.readAsText(file);
    });
  };

  // Real Binary Excel Spreadsheet Exporter (.xlsx) via SheetJS
  const exportToExcel = () => {
    const headers = [
      'Empresa',
      'Puesto',
      'Estado',
      'Fecha Postulación',
      'Salario/Compensación',
      'Modalidad',
      'Ciudad/Ubicación',
      'Enlace Oferta',
      'Nro de Entrevistas',
      'Interés (1-5)',
      'Feedback/Notas Retrospectivas'
    ];

    const rows = jobs.map(j => [
      j.company,
      j.position,
      j.status === 'Wishlist' ? 'Lista de Deseos' :
      j.status === 'Applied' ? 'Aplicado' :
      j.status === 'Interviewing' ? 'En Entrevistas' :
      j.status === 'Offer' ? 'Oferta Recibida' : 'Descartado',
      j.appliedDate,
      j.salary || 'No especificado',
      j.location === 'Remote' ? 'Remoto' : j.location === 'Hybrid' ? 'Híbrido' : 'Presencial',
      j.city || '',
      j.url || '',
      (j.interviews || []).length,
      j.rating,
      j.feedback || ''
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    
    const colWidths = headers.map((h, i) => {
      const maxLen = Math.max(h.length, ...rows.map(r => String(r[i] || '').length));
      return { wch: Math.min(maxLen + 3, 50) };
    });
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Mis Postulaciones');
    XLSX.writeFile(wb, `jobtracker_pro_candidaturas_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Filtrado de puestos para Kanban y Dashboard
  const filteredJobs = jobs.filter(job => {
    const matchQuery = 
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.city && job.city.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchLocation = filterLocation === 'All' || job.location === filterLocation;
    
    return matchQuery && matchLocation;
  });

  return {
    jobs,
    filteredJobs,
    isLoading,
    isSupabaseConfigured,
    seedDemoDataToSupabase,
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
    signUp,
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
    addInterview,
    updateInterview,
    deleteInterview,
    exportData,
    importData,
    exportToExcel
  };
}
