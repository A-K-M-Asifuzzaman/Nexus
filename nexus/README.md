# Nexus — Build. Scale. Grow.

> The AI-powered SaaS platform for modern teams. Enterprise-grade. Beautifully designed.

---

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 18, Vite, TypeScript, Tailwind CSS, Framer Motion |
| Auth       | **Firebase Authentication** (Email/Password, Google, GitHub) |
| State      | Zustand, TanStack Query |
| Forms      | React Hook Form + Zod |
| Charts     | Recharts |
| Backend    | Node.js, Express, TypeScript |
| Database   | MongoDB + Mongoose |
| Payments   | Stripe (subscriptions, webhooks, billing portal) |
| Deployment | Vercel (frontend) · Render/Railway (backend) · Docker |

---

## Project Structure

```
nexus/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── animations/      # Framer Motion variants
│   │   ├── components/
│   │   │   ├── ui/          # Button, Input, Card, Badge, Avatar, Skeleton
│   │   │   ├── layout/      # Navbar, Sidebar, DashboardLayout, LandingLayout
│   │   │   ├── landing/     # Hero, Features, Pricing, Testimonials, FAQ, Footer
│   │   │   └── shared/      # StatCard, GlowButton, PageHeader, Toast, Loaders
│   │   ├── constants/       # App-wide constants, plan definitions, nav links
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # utils.ts, firebase.ts
│   │   ├── pages/
│   │   │   ├── landing/     # LandingPage
│   │   │   ├── auth/        # Login, Signup, ForgotPassword, Onboarding
│   │   │   ├── dashboard/   # Overview, Analytics, Projects, Notifications, Settings, Billing
│   │   │   └── admin/       # AdminOverview, AdminUsers
│   │   ├── routes/          # ProtectedRoute
│   │   ├── services/        # api.ts, auth.service.ts, user.service.ts
│   │   ├── store/           # auth.store.ts (Zustand), ui.store.ts
│   │   └── types/           # TypeScript interfaces
│   ├── .env.example
│   ├── vercel.json
│   ├── Dockerfile
│   └── nginx.conf
│
├── server/                  # Node.js + Express backend
│   ├── src/
│   │   ├── config/          # index.ts, database.ts, firebase-admin.ts
│   │   ├── controllers/     # auth, user, project, billing, analytics
│   │   ├── middleware/      # firebaseAuth.ts, errorHandler.ts
│   │   ├── models/          # User, Project, Subscription, Notification
│   │   └── routes/          # auth, user, project, billing, analytics, notification
│   ├── .env.example
│   ├── render.yaml
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- Firebase project (see setup below)
- Stripe account (see setup below)

### 1. Clone & install

```bash
git clone <your-repo-url> nexus
cd nexus
npm install          # installs workspace root
cd client && npm install
cd ../server && npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com) → **Create project**
2. Enable **Authentication** → Sign-in methods → enable **Email/Password** + **Google** + **GitHub**
3. Go to **Project Settings → Your Apps → Add app (Web)** → copy config into `client/.env`
4. Go to **Project Settings → Service Accounts → Generate new private key** → use values in `server/.env`

### 3. Configure environment

```bash
# Frontend
cp client/.env.example client/.env
# Fill in VITE_FIREBASE_* keys from Firebase Console

# Backend
cp server/.env.example server/.env
# Fill in MONGO_URI, FIREBASE_*, STRIPE_* values
```

### 4. Run in development

```bash
# From root — runs both frontend and backend concurrently
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API health: http://localhost:5000/health

---

## Stripe Setup

1. Create a [Stripe](https://stripe.com) account
2. In **Products**, create two products: **Pro** and **Enterprise**
3. For each, add Monthly + Yearly prices → copy Price IDs into `server/.env`
4. For webhooks: `stripe listen --forward-to localhost:5000/api/billing/webhook`
5. Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`

**Events to enable in Stripe Dashboard (production):**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

---

## Deployment

### Frontend → Vercel

```bash
cd client
npm run build
# Push to GitHub → connect repo in vercel.com
# Add all VITE_* env vars in Vercel dashboard
```

`vercel.json` is already configured for SPA routing.

### Backend → Render

1. Connect your GitHub repo at [render.com](https://render.com)
2. Create a **Web Service** pointing to `/server`
3. Build command: `npm install && npm run build`
4. Start command: `npm run start`
5. Add all env vars from `server/.env.example`

`server/render.yaml` can be used with Render's Blueprint deploys.

### Docker (self-hosted)

```bash
# Copy and fill env files first
cp server/.env.example server/.env
cp client/.env.example client/.env

# Build and run all services
docker-compose up --build -d
```

Services:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017

---

## Authentication Flow (Firebase)

```
User clicks Sign In
      │
      ▼
Firebase SDK (client)
      │  returns idToken (JWT, 1hr TTL, auto-refreshed)
      ▼
POST /api/auth/firebase-sync  { idToken }
      │
      ▼
Server verifies token with Firebase Admin SDK
      │  first login → creates MongoDB user + Stripe customer
      │  repeat     → refreshes emailVerified / avatar
      ▼
Returns { user, plan, role }  →  Zustand auth store
```

Every subsequent API request attaches the Firebase `idToken` as `Authorization: Bearer <token>`. The `requireAuth` middleware re-verifies it on each request.

---

## Role-Based Access Control

| Role       | Access |
|------------|--------|
| `user`     | Own dashboard, projects, billing |
| `moderator`| + basic content moderation tools |
| `admin`    | Full admin panel, all users, revenue |

Set a user's role via MongoDB:
```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

---

## Available Pages

### Public
| Route | Page |
|-------|------|
| `/` | Landing (Hero, Features, Pricing, Testimonials, FAQ, Footer) |
| `/login` | Firebase Login (Email + Google + GitHub) |
| `/signup` | Firebase Signup |
| `/forgot-password` | Firebase password reset |
| `/onboarding` | 4-step onboarding wizard |

### User Dashboard
| Route | Page |
|-------|------|
| `/dashboard` | Overview (stats, charts, activity, checklist) |
| `/dashboard/analytics` | Traffic, conversions, revenue charts |
| `/dashboard/projects` | Project cards with progress |
| `/dashboard/notifications` | Notification center |
| `/dashboard/settings` | Profile, security, notifications, appearance |
| `/dashboard/billing` | Plan, Stripe portal, invoices |

### Admin
| Route | Page |
|-------|------|
| `/admin` | MRR, churn, plan distribution, system health |
| `/admin/users` | Full user table with role management |

---

## Subscription Plans

| Plan       | Price     | Projects | Members | Storage |
|------------|-----------|----------|---------|---------|
| Free       | $0        | 3        | 1       | 5 GB    |
| Pro        | $29/mo    | Unlimited| 10      | 50 GB   |
| Enterprise | $99/mo    | Unlimited| Unlimited| 500 GB |

All paid plans include a **14-day free trial** via Stripe.

---

## Firebase Credentials Needed

Share these with the project and paste them into your `.env` files:

**client/.env** (from Firebase Console → Project Settings → Web App):
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

**server/.env** (from Firebase Console → Service Accounts):
```
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
```

---

## License

MIT — built with ❤️ using Nexus.
