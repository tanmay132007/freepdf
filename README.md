# 📄 FreePDF Editor

> 29 free online PDF tools. No installation. No signup required. Files deleted after 1 hour.

**Live Site:** https://www.savepdf.tech
**GitHub:** https://github.com/tanmay132007/freepdf

---

## 🏗️ Architecture Overview

```
User Browser
    │
    ▼
Vercel (Next.js 14 Frontend)
    │
    ▼
Render (Node.js Express API) ←──── Upstash Redis (Job Queue)
    │
    ▼
Render (Python FastAPI PDF Processor)
    │
    ▼
Supabase (PostgreSQL + Storage)
```

---

## 🧰 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14 + TypeScript + Tailwind | UI and pages |
| UI Components | shadcn/ui + Framer Motion + Lucide | Design system |
| API Server | Node.js + Express | Auth, jobs, users |
| PDF Engine | Python FastAPI | 29 PDF tools + AI |
| Database | PostgreSQL via Supabase | All data |
| Cache/Queue | Redis via Upstash | Job processing |
| Storage | Supabase Storage | File storage |
| AI | Google Gemini (free) | Summarizer + OCR |
| Deploy (FE) | Vercel | Frontend hosting |
| Deploy (BE) | Render | Backend hosting |
| Email | Resend | Transactional emails |

---

## 📁 Project Structure

```
freepdf/
├── apps/
│   └── web/                        # Next.js 14 Frontend
│       ├── app/
│       │   ├── page.tsx            # Home page
│       │   ├── (auth)/             # Login, Signup, Forgot Password
│       │   ├── tools/[slug]/       # 29 dynamic tool pages
│       │   ├── dashboard/          # User dashboard
│       │   ├── admin/              # Admin panel
│       │   └── (marketing)/        # Pricing, Blog, About
│       ├── components/
│       │   ├── tools/              # FileDropzone, ProgressBar, DownloadButton
│       │   ├── layout/             # Navbar, Footer, Sidebar
│       │   └── shared/             # PricingCard, ToolGrid
│       ├── lib/
│       │   ├── api.ts              # API client
│       │   ├── supabase.ts         # Supabase client
│       │   └── tools.ts            # 29 tools data
│       └── hooks/
│           ├── useUpload.ts        # Upload + polling logic
│           ├── useJobStatus.ts     # Job status polling
│           └── useUser.ts          # Auth state
│
├── apps/
│   └── api/                        # Node.js Express API
│       └── src/
│           ├── routes/             # auth, pdf, user, admin, payment
│           ├── middleware/         # auth, rateLimit, plan, admin
│           └── services/          # supabase, storage, queue, stripe
│
├── services/
│   └── pdf-processor/              # Python FastAPI
│       ├── main.py
│       └── routers/               # merge, split, compress, rotate, etc.
│
└── docker-compose.yml
```

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- Git

### 1. Clone the repository
```bash
git clone https://github.com/tanmay132007/freepdf
cd freepdf
```

### 2. Install frontend dependencies
```bash
cd apps/web
npm install
```

### 3. Install backend dependencies
```bash
cd apps/api
npm install
```

### 4. Install Python dependencies
```bash
cd services/pdf-processor
pip install -r requirements.txt
```

### 5. Set up environment variables (see below)

### 6. Run locally
```bash
# Terminal 1 — Frontend
cd apps/web && npm run dev

# Terminal 2 — Node.js API
cd apps/api && npm run dev

# Terminal 3 — Python PDF Processor
cd services/pdf-processor && uvicorn main:app --reload --port 8000
```

---

## 🔐 Environment Variables

### Frontend — `apps/web/.env.local`
```env
NEXT_PUBLIC_API_BASE_URL=https://freepdf-api.onrender.com
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Backend — `apps/api/.env`
```env
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Redis (Upstash)
REDIS_URL=rediss://default:xxx@xxx.upstash.io:6379

# Supabase Storage
SUPABASE_BUCKET=pdf-files

# App
FRONTEND_URL=https://www.savepdf.tech
PORT=4000
```

### Python Processor — `services/pdf-processor/.env`
```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_BUCKET=pdf-files
GEMINI_API_KEY=your-gemini-api-key
NODE_API_URL=https://freepdf-api.onrender.com
PORT=8000
```

---

## 🗄️ Database Setup — Supabase

**What is Supabase?**  
Supabase is a managed PostgreSQL database with built-in authentication, storage, and APIs. We use it as our primary data store.

**Free tier:** 500MB database, 1GB storage, 50MB file uploads.

### Step 1 — Create Supabase project
1. Go to [supabase.com](https://supabase.com) → Sign up free
2. Click **New Project** → enter name `freepdf` → set password → Create
3. Wait ~2 minutes for project to spin up

### Step 2 — Run database schema
1. Go to **SQL Editor** in Supabase dashboard
2. Paste and run `DB-01` schema (creates all tables, indexes, RLS policies)
3. Tables created: `users`, `plans`, `subscriptions`, `operations`, `saved_files`, `payments`, `api_keys`, `teams`, `team_members`, `promo_codes`

### Step 3 — Configure Auth
1. **Auth → URL Configuration:**
   - Site URL: `https://www.savepdf.tech`
   - Redirect URLs: `https://www.savepdf.tech/auth/callback`
2. **Auth → Providers:**
   - Enable Google → paste Client ID + Secret from Google Cloud Console
3. **Auth → Email Templates:**
   - Update subject lines to say "FreePDF"

### Step 4 — Create Storage Bucket
1. Go to **Storage** → **New Bucket**
2. Name: `pdf-files` → Toggle Public: OFF → Save
3. Add policy: authenticated users can read/write only their own folder

### Step 5 — Get your credentials
Go to **Settings → API:**
- `SUPABASE_URL` — your project URL
- `SUPABASE_ANON_KEY` — for frontend (public)
- `SUPABASE_SERVICE_ROLE_KEY` — for backend only (keep secret)

### Make yourself admin
Run in Supabase SQL Editor:
```sql
UPDATE users SET role='admin' WHERE email='your@email.com';
```

---

## ⚡ Redis Setup — Upstash

**What is Upstash?**  
Upstash provides serverless Redis. We use it for job queuing via BullMQ — when a user uploads a PDF, the job goes into Redis and the Python processor picks it up.

**Free tier:** 10,000 requests/day, completely free, no credit card needed.

### Setup Steps
1. Go to [upstash.com](https://upstash.com) → Sign up with Google
2. Click **Create Database**
   - Name: `freepdf-redis`
   - Type: Regional
   - Region: AP-South-1 (Mumbai — closest to India)
3. Click on your database → **Connect** tab
4. Copy the `REDIS_URL` — starts with `rediss://`

### How it works in the app
```
User uploads PDF
    → Node.js API adds job to BullMQ (Redis)
    → Returns job_id immediately to frontend
    → Frontend polls every 2 seconds
    → Python processor picks up job from Redis
    → Processes PDF, uploads result to Supabase Storage
    → Marks job complete in Redis
    → Frontend gets download URL
```

---

## 🖥️ Backend Deployment — Render

**What is Render?**  
Render is a cloud platform to deploy Node.js, Python, and Docker services directly from GitHub. We deploy two separate backend services.

**Free tier:** Free web services are available for small projects.

### Blueprint deployment
The root `render.yaml` defines both Render services:

- `freepdf-api` — Node.js Express API
- `freepdf-pdf-processor` — Dockerized Python FastAPI PDF processor

Create the services from the Render Dashboard Blueprint flow:
`https://dashboard.render.com/blueprint/new?repo=https://github.com/tanmay132007/freepdf`

### Render Environment Variables
Add values marked `sync: false` in the Render Dashboard before deploying.

For the Node.js API service:

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
FRONTEND_URL=https://www.savepdf.tech
REDIS_URL=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=pdf-files
GEMINI_API_KEY=
```

For the PDF processor service:

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_BUCKET=pdf-files
NODE_API_URL=https://freepdf-api.onrender.com
GEMINI_API_KEY=
```

### Ports
Render provides `PORT` automatically. The Node API binds with
`process.env.PORT`, and the PDF processor starts uvicorn with `--port $PORT`.

---

## 🌐 Frontend Deployment — Vercel

**What is Vercel?**  
Vercel is the platform built for Next.js. It provides global CDN, automatic deployments from GitHub, and free SSL.

**Free tier:** Unlimited deployments, 100GB bandwidth/month.

### Setup Steps
1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. **Add New Project → Import** `freepdf` repository
3. Configure:
   - **Root Directory:** `apps/web`
   - **Framework:** Next.js (auto-detected)
   - **Build Command:** `npm run build`
4. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://freepdf-api.onrender.com
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
5. Click **Deploy**

### After deployment
Update Render API service variable:
```
FRONTEND_URL=https://www.savepdf.tech
```

Update Supabase Auth URL Configuration with your Vercel domain.

### Auto-deployment
Every `git push origin main` automatically redeploys to Vercel.

---

## 🛠️ 29 PDF Tools

| Category | Tools |
|----------|-------|
| **Edit** | Merge PDF, Split PDF, Rotate PDF, Watermark PDF, Sign PDF, Redact PDF, Crop PDF, Organize PDF, Page Numbers, Edit PDF |
| **Convert** | PDF to Word, PDF to Excel, PDF to JPG, PDF to PPT, JPG to PDF, Word to PDF, Excel to PDF, PPT to PDF, HTML to PDF |
| **Compress** | Compress PDF |
| **Security** | Protect PDF, Unlock PDF, PDF to PDF/A, Repair PDF |
| **AI Tools** | OCR PDF, AI Summarizer, Translate PDF, Compare PDF, Scan to PDF |

---

## 💰 Pricing Plans

| Feature | Free | Pro ($9/mo) | Business ($29/mo) |
|---------|------|-------------|-------------------|
| Tools | 27 basic | All 29 + AI | All + API |
| File size | 25MB | 200MB | 500MB |
| Daily ops | 20 | Unlimited | Unlimited |
| File retention | 1 hour | 7 days | 30 days |
| OCR + AI | ✗ | ✓ | ✓ |
| Team accounts | ✗ | ✗ | 5 members |
| API access | ✗ | ✗ | ✓ |

---

## 🔒 Security

- JWT authentication with 15-min access tokens + 30-day refresh tokens
- Files validated by magic bytes (not just file extension)
- All files auto-deleted after retention period
- Row Level Security (RLS) on all Supabase tables
- Rate limiting per IP and per user
- CORS restricted to frontend domain only
- Helmet.js security headers on all API responses

---

## 📦 Deployment Checklist

- [ ] Supabase project created and schema deployed
- [ ] Supabase Auth configured with correct redirect URLs
- [ ] Supabase Storage bucket `pdf-files` created
- [ ] Upstash Redis database created and URL copied
- [ ] Render Node.js API deployed and online
- [ ] Render Python processor deployed and online
- [ ] All environment variables added to Render
- [ ] Vercel project created with correct root directory
- [ ] All environment variables added to Vercel
- [ ] Render `FRONTEND_URL` updated with Vercel domain
- [ ] Supabase URL Configuration updated with Vercel domain
- [ ] Make admin user in Supabase SQL editor

---

## 🐳 Local Docker Setup

```bash
# Run everything locally with Docker
docker-compose up

# Services:
# Frontend  → http://localhost:3000
# API       → http://localhost:4000
# Processor → http://localhost:8000
# Redis     → localhost:6379
```

---

## 📊 Request Flow

```
1. User drops PDF on FileDropzone
2. Frontend calls POST /api/pdf/upload
3. Node.js API validates file (magic bytes, size, plan limits)
4. File uploaded to Supabase Storage bucket
5. Job added to BullMQ (Redis) with operation_id
6. API returns { operation_id, job_id } immediately
7. Frontend polls GET /api/pdf/jobs/:jobId every 2 seconds
8. Python FastAPI picks up job from queue
9. Downloads file from Supabase Storage
10. Processes PDF using PyMuPDF / pikepdf / ocrmypdf
11. Uploads result back to Supabase Storage
12. POSTs callback to Node.js API with result
13. Node.js marks job complete
14. Frontend receives downloadUrl
15. DownloadButton appears, auto-triggers download
16. File auto-deleted after retention period (1 hour for free)
```

---

## 👤 Author

**Tanmay Rajput**  
B.Tech CSE — Galgotias University (Class of 2028)  
[GitHub](https://github.com/tanmay132007) · [LinkedIn](https://www.linkedin.com/in/tanmaysinghrajput/)

---

## External service updates after moving to Render

The root `render.yaml` defines both Render services. Fill secret values marked
with `sync: false` in the Render Dashboard before deploying.

Update these dashboard values during the migration. These are configuration
changes, not code changes.

### Vercel

Set the frontend API base URL to the Render API URL:

```env
NEXT_PUBLIC_API_BASE_URL=https://freepdf-api.onrender.com
```

If the service name changes in Render, use the matching `.onrender.com` URL.
After changing the variable, redeploy the Vercel frontend. Do not change Vercel
project settings unrelated to the API URL.

### Render

Copy the existing backend secrets into the Render services:

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
REDIS_URL=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
GEMINI_API_KEY=
```

Set the API service `FRONTEND_URL` to the deployed Vercel frontend origin. Set
the PDF processor `NODE_API_URL` to the Render API origin if callbacks need to
call the API service.

### Supabase

No schema change is required for the Render migration. If Supabase Auth URL
settings are configured, keep the Site URL and redirect allow-list pointed at
the deployed frontend URL, not the backend API URL. Do not expose
`SUPABASE_SERVICE_ROLE_KEY` to any browser-facing Vercel variable.

### Upstash

Keep using the existing Redis instance. Set Render's `REDIS_URL` to the Upstash
Redis connection string supported by BullMQ/ioredis, preferably the TLS
`rediss://...` URL. Do not use Upstash REST-only variables for this queue.

---

## 📄 License

MIT License — free to use, modify, and distribute.
