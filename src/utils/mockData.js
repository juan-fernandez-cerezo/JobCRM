export const INITIAL_JOBS = [
  {
    id: '1',
    company: 'Google',
    position: 'Senior Frontend Developer',
    status: 'Applied',
    appliedDate: '2026-05-26',
    salary: '95,000 € / Año',
    location: 'Hybrid',
    city: 'Madrid, España',
    url: 'https://careers.google.com/jobs/results/senior-frontend-developer',
    rating: 5,
    description: `### Responsabilidades:
* Liderar el diseño e implementación de interfaces de usuario altamente escalables utilizando React y TypeScript.
* Colaborar de forma cruzada con equipos de Producto, UX y Backend para conceptualizar y desplegar nuevas características.
* Optimizar el rendimiento de las aplicaciones web para conseguir tiempos de carga instantáneos e interacciones ultra fluídas.
* Mentorizar a ingenieros de software junior y establecer mejores prácticas de codificación limpia.

### Requisitos:
* más de 5 años de experiencia en desarrollo web moderno.
* Conocimiento avanzado de React, arquitecturas de estado global y optimizaciones del DOM.
* Experiencia trabajando con metodologías ágiles en entornos dinámicos.`,
    cvName: 'CV_Juan_Senior_React_2026.pdf',
    coverLetterName: 'Carta_Presentacion_Google.pdf',
    interviews: [],
    feedback: '',
    history: [
      { date: '2026-05-26T10:00:00.000Z', action: 'Aplicación registrada en JobTracker' },
      { date: '2026-05-26T10:15:00.000Z', action: 'CV enviado a través del portal de Google Careers' }
    ]
  },
  {
    id: '2',
    company: 'Amazon',
    position: 'UX Designer',
    status: 'Applied',
    appliedDate: '2026-05-23',
    salary: '55,000 € / Año',
    location: 'Onsite',
    city: 'Madrid, España',
    url: 'https://amazon.jobs/jobs/ux-designer',
    rating: 4,
    description: `### Descripción del Rol:
Buscamos un diseñador UX con una fuerte obsesión por el cliente para unirse a nuestro equipo de Amazon Business. Crearás experiencias sencillas, intuitivas y eficientes para millones de usuarios empresariales en todo el mundo.

### Requisitos clave:
* Portafolio fuerte que demuestre investigación de usuarios, wireframes, prototipos interactivos y diseño visual.
* Habilidad para colaborar estrechamente con Product Managers e Ingenieros.
* Dominio avanzado de Figma, Adobe XD y herramientas de testing de usabilidad.`,
    cvName: 'Portfolio_Juan_UX_2026.pdf',
    coverLetterName: null,
    interviews: [],
    feedback: '',
    history: [
      { date: '2026-05-23T14:30:00.000Z', action: 'Aplicación registrada y enviada a través de LinkedIn Easy Apply' }
    ]
  },
  {
    id: '3',
    company: 'Spotify',
    position: 'React Developer',
    status: 'Interviewing',
    appliedDate: '2026-05-15',
    salary: '65,000 € / Año',
    location: 'Remote',
    city: 'Estocolmo (Remoto desde España)',
    url: 'https://lifeatspotify.com/jobs/react-dev',
    rating: 5,
    description: `### Acerca del equipo:
Formarás parte del equipo de "Music Discovery", enfocado en dar vida a nuevas experiencias interactivas de recomendación musical para millones de oyentes diarios.

### Lo que harás:
* Desarrollar código robusto, limpio y bien testado en React.
* Trabajar con APIs Web Audio y optimizar la reproducción multimedia y transiciones dinámicas.
* Experimentar a través de tests A/B para mejorar la retención de usuarios.`,
    cvName: 'CV_Juan_React_Staff.pdf',
    coverLetterName: 'Cover_Letter_Spotify_Juan.pdf',
    interviews: [
      {
        id: 'int-1',
        date: '2026-05-20T10:00:00.000Z',
        type: 'HR',
        interviewer: 'Sarah Jenkins (Talent Acquisition)',
        rating: 4,
        questions: [
          '¿Por qué quieres unirte a Spotify?',
          'Cuéntame un desafío técnico complejo que hayas resuelto recientemente.',
          '¿Cuáles son tus expectativas salariales y disponibilidad?'
        ],
        notes: 'La entrevista con HR fue fantástica. Sarah fue muy amable, me explicó en detalle el modelo de trabajo flexible "Work from Anywhere". Hablamos en inglés y la fluidez fue excelente.'
      },
      {
        id: 'int-2',
        date: '2026-05-27T15:30:00.000Z',
        type: 'Technical',
        interviewer: 'David Lindgren (Engineering Manager) & Anna Kovac (Lead Dev)',
        rating: 5,
        questions: [
          '¿Cómo optimizarías una lista infinita en React con miles de elementos multimedia?',
          'Explicación en detalle de hooks personalizados y el ciclo de vida en React 19.',
          'Prueba práctica en vivo: Diseñar un reproductor de audio simplificado que sincronice letras de canciones.'
        ],
        notes: 'La ronda técnica salió súper bien. Les gustó mucho mi solución estructurada y modular. Demostré mis conocimientos de React render optimization y técnicas de virtualización.'
      }
    ],
    feedback: 'Esperando respuesta de la prueba técnica y fecha para la ronda de System Design.',
    history: [
      { date: '2026-05-15T09:00:00.000Z', action: 'Aplicado en la web corporativa de Spotify' },
      { date: '2026-05-18T16:20:00.000Z', action: 'Contacto inicial de HR por correo' },
      { date: '2026-05-20T10:00:00.000Z', action: 'Entrevista de screening con HR completada' },
      { date: '2026-05-22T11:00:00.000Z', action: 'Invitación recibida para entrevista técnica en vivo' },
      { date: '2026-05-27T15:30:00.000Z', action: 'Entrevista técnica completada con feedback muy positivo' }
    ]
  },
  {
    id: '4',
    company: 'Meta',
    position: 'UI Engineer',
    status: 'Rejected',
    appliedDate: '2026-05-10',
    salary: '110,000 $ / Año',
    location: 'Remote',
    city: 'Londres (Remoto España)',
    url: 'https://www.metacareers.com/jobs',
    rating: 5,
    description: `### Sobre el rol:
Buscamos un Ingeniero de UI de clase mundial para trabajar en la evolución de nuestros componentes principales que impulsan Instagram Web y Facebook Lite.

### Requisitos:
* Experiencia masiva con optimización CSS, animaciones de alto rendimiento, y diseño de accesibilidad (ARIA).
* Conocimiento impecable de JavaScript puro y arquitecturas modernas.`,
    cvName: 'CV_Juan_Senior_React_2026.pdf',
    coverLetterName: null,
    interviews: [
      {
        id: 'meta-int-1',
        date: '2026-05-18T17:00:00.000Z',
        type: 'Technical',
        interviewer: 'Michael Zhao (Staff Engineer)',
        rating: 3,
        questions: [
          'Codificar un algoritmo de búsqueda binaria modificado en JavaScript vainilla en 25 minutos.',
          'Explicar el funcionamiento interno del motor de renderizado de Chrome.'
        ],
        notes: 'Me puse un poco nervioso con el límite de tiempo estricto del ejercicio algorítmico de LeetCode. Resolví el problema pero con una optimización mejorable en la complejidad espacial.'
      }
    ],
    feedback: 'Rechazado tras la primera prueba de algoritmos. La nota del reclutador indicaba que buscaban a alguien con mayor solidez en estructuras de datos avanzadas bajo presión de tiempo. ¡A seguir practicando LeetCode!',
    history: [
      { date: '2026-05-10T12:00:00.000Z', action: 'Aplicado mediante referidor (amigo interno)' },
      { date: '2026-05-13T18:00:00.000Z', action: 'Agendada primera llamada técnica de codificación' },
      { date: '2026-05-18T17:00:00.000Z', action: 'Ronda técnica de algoritmos completada' },
      { date: '2026-05-22T09:30:00.000Z', action: 'Recepción de correo electrónico informando rechazo del proceso' }
    ]
  },
  {
    id: '5',
    company: 'Startup X',
    position: 'Fullstack Developer',
    status: 'Offer',
    appliedDate: '2026-05-02',
    salary: '48,000 € / Año',
    location: 'Remote',
    city: 'Barcelona (100% Remoto)',
    url: 'https://startupx.com/jobs/fullstack-react-node',
    rating: 3,
    description: `### ¿Quiénes somos?
Somos una startup SaaS de rápido crecimiento en el sector de FinTech. Buscamos a nuestro quinto desarrollador para acelerar el desarrollo del backend en Node y el frontend en React.

### Tecnologías:
* React (Vite), Tailwind CSS, Node.js, Express, PostgreSQL, Prisma.`,
    cvName: 'CV_Juan_Fullstack_2026.pdf',
    coverLetterName: 'Carta_Motivacion_StartupX.pdf',
    interviews: [
      {
        id: 'sx-1',
        date: '2026-05-08T11:00:00.000Z',
        type: 'HR',
        interviewer: 'Laura Díaz (CEO & Co-founder)',
        rating: 5,
        questions: [
          '¿Qué te motiva de trabajar en una startup en fase temprana?',
          '¿Cómo manejas la ambigüedad en los requerimientos?'
        ],
        notes: 'Excelente sintonía con Laura. Tienen un proyecto muy ambicioso y un ambiente dinámico.'
      },
      {
        id: 'sx-2',
        date: '2026-05-14T10:00:00.000Z',
        type: 'Technical',
        interviewer: 'Tomas Martinez (CTO)',
        rating: 4,
        questions: [
          'Diseñar un esquema de base de datos relacional para pagos recurrentes.',
          '¿Cómo protegerías una API REST contra ataques comunes?'
        ],
        notes: 'Explicación clara de SQL, indexación y políticas CORS/JWT. El CTO quedó impresionado por mi pragmatismo.'
      }
    ],
    feedback: '¡Oferta recibida de 48K brutos anuales, 23 días de vacaciones, seguro médico privado y presupuesto para equipamiento en casa! He pedido un par de días para evaluarla mientras avanza Spotify.',
    history: [
      { date: '2026-05-02T16:00:00.000Z', action: 'Aplicado mediante formulario web directo' },
      { date: '2026-05-05T10:00:00.000Z', action: 'Llamada de screening con la fundadora' },
      { date: '2026-05-08T11:00:00.000Z', action: 'Entrevista de fit completada' },
      { date: '2026-05-14T10:00:00.000Z', action: 'Entrevista técnica profunda con el CTO' },
      { date: '2026-05-20T12:00:00.000Z', action: 'Recepción formal de la carta de oferta' }
    ]
  },
  {
    id: '6',
    company: 'Stripe',
    position: 'Staff Engineer (Developer Relations)',
    status: 'Wishlist',
    appliedDate: '2026-05-28',
    salary: '120,000 € / Año',
    location: 'Remote',
    city: 'Dublín (Remoto desde España)',
    url: 'https://stripe.com/jobs/staff-devrel-engineer',
    rating: 5,
    description: `### Descripción del Puesto:
Ayudarás a definir y evangelizar las APIs de Stripe para la comunidad hispanohablante y global. Participarás en conferencias, escribirás tutoriales técnicos detallados y colaborarás estrechamente con el equipo de producto para llevar el feedback directo de los desarrolladores externos.

### Requisitos:
* Fuertes habilidades comunicativas en inglés y español.
* Experiencia técnica sólida construyendo integraciones complejas con Stripe u otras APIs de pagos.
* Historial de contribuciones al ecosistema Open Source o creación de contenido técnico relevante.`,
    cvName: null,
    coverLetterName: null,
    interviews: [],
    feedback: 'Aún no he aplicado. Estoy puliendo un tutorial sobre integraciones de Stripe en React 19 para incluirlo como enlace en mi aplicación y llamar más la atención.',
    history: [
      { date: '2026-05-28T15:00:00.000Z', action: 'Oferta añadida a la lista de deseos (Wishlist) para preparar candidatura' }
    ]
  }
];

export const INITIAL_METRICS = {
  Applied: 2,
  Interviewing: 1,
  Offer: 1,
  Rejected: 1,
  Wishlist: 1
};
