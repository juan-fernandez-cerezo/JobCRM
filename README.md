# 💼 JobTracker Pro (JobCRM)

> **JobTracker Pro** is a modern, responsive, and full-featured Job Application CRM designed to help professionals streamline, track, and optimize their job search and recruitment pipelines.

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-K8s-326CE5?logo=kubernetes&logoColor=white)](https://kubernetes.io/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Quick Start](#-quick-start)
- [Database & Backend Setup](#-database--backend-setup-supabase)
- [Docker & Kubernetes Deployment](#-docker--kubernetes-deployment)
- [Available Scripts](#-available-scripts)
- [Documentation & Guides](#-documentation--guides)

---

## 🌟 Overview

Navigating job hunts across multiple job boards, recruiters, and interview stages can quickly become chaotic. **JobTracker Pro** provides a centralized command center to:

- Organize applications through an interactive Kanban board with drag-and-drop.
- Analyze conversion rates, application sources, and interview trends.
- Log technical questions, interview feedback, and post-mortems for continuous improvement.
- Manage custom CVs and cover letter pairings per application.
- Work seamlessly with cloud persistence via **Supabase PostgreSQL** or run immediately in offline/demo mode with **LocalStorage**.

---

## ✨ Key Features

### 1. 🗂️ Interactive Kanban Board
- Visual columns: `Wishlist`, `Applied`, `Interviewing`, `Offer`, and `Rejected`.
- Intuitive drag-and-drop workflow to advance or retreat applications.
- Card details include company name, position, salary estimate, location tag, priority stars, and attached resume badge.
- Instant export of pipeline data directly to **Excel (`.xlsx`)**.

### 2. 📊 Executive Dashboard & Conversion Funnel
- Real-time KPIs: Total Applications, Active Interviews, Received Offers, Rejection rates.
- Conversion funnel metrics (Application-to-Interview & Interview-to-Offer rates).
- High-priority application highlights (⭐ 4+ rating).
- Live activity timeline recording every status change and interview event.

### 3. 📈 Deep Analytics & Insights
- Platform source attribution (LinkedIn, Indeed, InfoJobs, Referrals, Company site).
- Work model breakdown (Remote vs. Hybrid vs. Onsite).
- Feedback keyword analysis (System design, React, English, Algorithms, Cloud).

### 4. 🎯 Granular Interview Tracker
- Schedule and log specific interview rounds: HR Screening, Technical, Hiring Manager, Onsite.
- Store interviewer names, ratings, comprehensive notes, and verbatim interview questions.

### 5. 📁 Document Library & Candidate Profile
- Candidate profile management (Name, contact info).
- Storage and association of specific CV versions and Cover Letters per job.
- Upload, preview, and download documents.

### 6. 🔐 Dual-Mode Authentication & Security
- **Cloud Mode**: Full Supabase authentication (Email/Password, Google OAuth) backed by PostgreSQL with strict **Row Level Security (RLS)** ensuring users only access their own data.
- **Demo / Offline Mode**: Instant exploration with mock data and LocalStorage persistence if Supabase credentials are not supplied.

### 7. 💾 Data Portability
- Single-click full backup export to JSON.
- Restore/import backups from JSON.
- Spreadsheet export (`.xlsx`) with automated styling.

### 8. 🌓 UI/UX & Customization
- Built-in Dark Mode and Light Mode support with smooth transitions.
- Global search bar and instant location filters (Remote, Hybrid, Onsite).

---

## 🛠️ Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [React 19](https://react.dev/) | Component architecture with Hooks and Context |
| **Build Tool** | [Vite 8](https://vitejs.dev/) | Next-generation frontend tooling and fast HMR |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first CSS engine |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, accessible vector icons |
| **Spreadsheets** | [SheetJS (xlsx)](https://docs.sheetjs.com/) | Client-side Excel export generation |
| **Backend / DB** | [Supabase](https://supabase.com/) | Hosted PostgreSQL, Row-Level Security, Auth & Triggers |
| **Containers** | [Docker](https://www.docker.com/) | Multi-stage production build with Nginx Alpine |
| **Orchestration** | [Kubernetes](https://kubernetes.io/) | Production deployment and LoadBalancer service manifests |

---

## 📂 Project Architecture

```plaintext
JobCRM/
├── .env.example              # Environment variables template
├── Dockerfile                # Multi-stage production container build
├── nginx.conf                # Nginx SPA reverse-proxy & gzip configuration
├── package.json              # Project dependencies and npm scripts
├── vite.config.js            # Vite build configuration
│
├── k8s/                      # Kubernetes deployment manifests
│   ├── deployment.yaml       # Deployment with 2 replicas, probes, and resource limits
│   └── service.yaml          # Public LoadBalancer service
│
├── supabase/
│   └── schema.sql            # Full SQL DDL schema (Tables, RLS policies, triggers)
│
├── public/                   # Static public assets
│
└── src/
    ├── main.jsx              # Application entry point
    ├── App.jsx               # Main application container, router, and modal coordinator
    ├── App.css               # Global application styles
    ├── index.css             # Tailwind CSS imports & theme definitions
    │
    ├── components/
    │   ├── Analytics.jsx     # Visual charts, KPIs, conversion funnels & keywords
    │   ├── Auth.jsx          # Login, Registration, Google OAuth & Demo mode switch
    │   ├── Dashboard.jsx     # Summary overview, high-priority cards, and activity log
    │   ├── JobDetails.jsx    # Slide-over modal with full job specs and interview log
    │   ├── JobModal.jsx      # Creation and edit drawer for applications
    │   ├── KanbanBoard.jsx   # 5-stage drag-and-drop Kanban workflow
    │   ├── ProfileModal.jsx  # Candidate details and document library manager
    │   └── Sidebar.jsx        # Navigation, search filter, theme toggle, backup tools
    │
    ├── hooks/
    │   └── useJobs.js        # Core custom hook managing state, Supabase sync & LocalStorage
    │
    ├── lib/
    │   └── supabaseClient.js # Supabase client initialization and connection health check
    │
    └── utils/
        └── mockData.js       # Default demo applications, history, and interview fixtures
```

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ or 20+ recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/JobCRM.git
cd JobCRM
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables (Optional for Cloud Mode)
To connect with Supabase, create a `.env` file in the project root:
```bash
cp .env.example .env
```
Update `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```
> *Note: If you leave these empty or skip this step, the app automatically runs in **Offline / Demo Mode** using LocalStorage.*

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗄️ Database & Backend Setup (Supabase)

If you wish to use PostgreSQL cloud persistence:

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** tab in the Supabase Dashboard.
3. Paste the contents of [`supabase/schema.sql`](./supabase/schema.sql) and execute the query.
4. The script provisions:
   - `profiles`: User information and uploaded document names.
   - `jobs`: Applications with salary, status, rating, dates, and CV links.
   - `interviews`: Rounds, ratings, questions, and notes per job.
   - `job_history`: Automated timestamped timeline events.
   - Row-Level Security (RLS) policies guaranteeing strict multi-tenant isolation.
5. Copy your **Project URL** and **anon public key** into `.env`.
6. For detailed instructions, refer to [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md).

---

## 🐳 Docker & Kubernetes Deployment

### Local Docker Build
Build and run the containerized application locally with Nginx:

```bash
# Build the Docker image
docker build -t jobtracker-pro:latest .

# Run container on port 8080
docker run -d -p 8080:80 jobtracker-pro:latest
```
Access the application at [http://localhost:8080](http://localhost:8080).

### Kubernetes / AWS EKS
Manifests for Kubernetes are provided in the [`k8s/`](./k8s) directory:

```bash
# Apply deployment and load balancer service
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

For complete instructions on building with **AWS ECR** and deploying to **Amazon EKS**, see [`AWS_DEPLOYMENT.md`](./AWS_DEPLOYMENT.md).

---

## 📜 Available Scripts

In the project root, you can run:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with Hot Module Replacement (HMR). |
| `npm run build` | Compiles and bundles production-ready static assets into `dist/`. |
| `npm run preview` | Locally serves the production build for testing before deployment. |
| `npm run lint` | Runs ESLint across the codebase. |

---

## 📚 Documentation & Guides

- 📘 [Supabase Connection Guide (`SUPABASE_SETUP.md`)](./SUPABASE_SETUP.md) - Detailed guide for cloud database initialization and RLS setup.
- ☁️ [AWS & Kubernetes Deployment Guide (`AWS_DEPLOYMENT.md`)](./AWS_DEPLOYMENT.md) - Step-by-step guide for deploying on Amazon ECR & Amazon EKS.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
