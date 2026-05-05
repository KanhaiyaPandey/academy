# 🎓 Pahal Academy — Education Portal

A production-grade **Turborepo monorepo** for Pahal Academy — a computer learning and IT education institute based in Ranchi, Jharkhand.

---

## 🏗️ Architecture

```
pahal-academy/
├── apps/
│   ├── web/           → Public website (students) — runs on :3000
│   └── admin/         → Admin dashboard (internal) — runs on :3001
│
├── packages/
│   ├── db/            → Drizzle ORM schema + PostgreSQL client
│   ├── lib/           → Shared utilities + notification services
│   ├── ui/            → Shared UI components (optional)
│   └── config/        → Shared configs (Tailwind, TypeScript, ESLint)
│
├── .env               → Root environment variables (single source of truth)
├── turbo.json         → Turborepo pipeline config
└── pnpm-workspace.yaml
```

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Monorepo | Turborepo |
| Frontend | Next.js 15 (App Router, TypeScript) |
| UI | Ant Design 5 + Tailwind CSS |
| State | Zustand |
| ORM | **Drizzle ORM** (Postgres) |
| Database | PostgreSQL |
| Notifications | WhatsApp (Meta Cloud API) + Email (Resend) |
| Package Manager | pnpm |

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- pnpm 9+
- PostgreSQL running locally

### 1. Install dependencies
```bash
pnpm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your DATABASE_URL and API keys
```

### 3. Set up the database
```bash
# Push schema to PostgreSQL
pnpm db:push

# Or run migrations
pnpm db:generate
pnpm db:migrate

# Seed with sample data
cd packages/db && npx ts-node seed.ts
```

### 4. Start development
```bash
# Start both apps simultaneously
pnpm dev

# Or start individually:
cd apps/web && pnpm dev     # → http://localhost:3000
cd apps/admin && pnpm dev   # → http://localhost:3001
```

### 5. Open Drizzle Studio (visual DB browser)
```bash
pnpm db:studio
# Opens at https://local.drizzle.studio
```

---

## 🌐 App 1: Public Website (`apps/web`)

**URL: http://localhost:3000**

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, featured courses, testimonials, CTA |
| Courses | `/courses` | All courses grid |
| Course Detail | `/courses/[slug]` | Curriculum, outcomes, enroll |
| About | `/about` | Academy story, vision, mission |
| Contact | `/contact` | Contact form + info |
| Admission | `/admission` | Multi-step application form |

### Public API Routes
```
POST /api/admissions     → Submit admission application
POST /api/leads          → Contact / inquiry form
GET  /api/leads          → Fetch all leads
```

---

## 🔐 App 2: Admin Dashboard (`apps/admin`)

**URL: http://localhost:3001**
**Login: admin / pahal@2025** *(change in production!)*

| Module | Route | Features |
|--------|-------|---------|
| Dashboard | `/dashboard` | Stats, recent admissions, pending fees, enrollment chart |
| Students | `/dashboard/students` | Full CRUD, search, status management |
| Courses | `/dashboard/courses` | Add/edit/toggle active courses |
| Fees | `/dashboard/fees` | Payment tracking, record installments, overdue alerts |
| Attendance | `/dashboard/attendance` | Daily bulk attendance marking by course |
| Employees | `/dashboard/employees` | Staff management, roles, salaries |
| Leaves | `/dashboard/leaves` | Approve/reject with WhatsApp notification |
| Leads | `/dashboard/leads` | Inquiry tracking, status pipeline, WhatsApp quick-contact |

### Admin API Routes
```
GET/POST   /api/students
GET/PUT/DELETE /api/students/[id]
GET/POST   /api/courses
GET/POST   /api/fees          → Record installment payments
GET/POST   /api/attendance    → Bulk attendance save
GET/POST   /api/employees
GET/POST/PATCH /api/leaves    → Apply + approve/reject
GET        /api/dashboard/stats
```

---

## 🗄️ Database Schema (Drizzle ORM)

| Table | Purpose |
|-------|---------|
| `students` | Student profiles with contact, qualification info |
| `courses` | Course catalog with fees, duration, level |
| `enrollments` | Student ↔ Course mapping |
| `fees` | Fee records per enrollment |
| `installments` | Individual payment transactions |
| `attendance` | Daily attendance by student + course |
| `employees` | Staff profiles with roles and salaries |
| `leaves` | Leave applications with approval workflow |
| `leads` | Inquiry/prospect management |
| `exam_results` | Test scores and grades |
| `testimonials` | Student reviews for website |

---

## 🔔 Notifications

### WhatsApp (Meta Cloud API)
Triggered automatically for:
- ✅ Admission confirmation
- 💰 Fee payment reminder
- 📋 Leave approval / rejection

### Email (Resend API)
Triggered for:
- ✅ Admission confirmation with course details

Configure in `.env`:
```bash
WHATSAPP_API_KEY=your_meta_api_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
EMAIL_API_KEY=your_resend_api_key
```

---

## 📦 Build for Production

```bash
# Build all apps
pnpm build

# Start production servers
cd apps/web && pnpm start    # :3000
cd apps/admin && pnpm start  # :3001
```

---

## 🎨 Design System

- **Primary Color:** `#1677ff` (Ant Design blue)
- **Fonts:** Sora (headings) + Plus Jakarta Sans (body)
- **Theme:** Light only, clean and professional
- **Components:** Ant Design 5 + Tailwind utility classes

---

## 📁 Key Files Reference

```
packages/db/src/schema/index.ts  → Complete DB schema
packages/db/seed.ts               → Sample data seeder
packages/lib/src/notifications/   → WhatsApp + Email services
packages/lib/src/utils/           → formatCurrency, generateStudentId, etc.
apps/web/src/app/admission/        → Multi-step admission form
apps/admin/src/components/dashboard/ → Dashboard overview
apps/admin/src/app/api/            → All admin API routes
```

---

> Built with ❤️ for Pahal Academy — Shaping Tech Careers in Jharkhand
