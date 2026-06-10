import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { config } from './config'
import { connectDB } from './config/database'
import './config/firebase-admin'

// Routes
import authRoutes         from './routes/auth.routes'
import userRoutes         from './routes/user.routes'
import projectRoutes      from './routes/project.routes'
import taskRoutes         from './routes/task.routes'
import teamRoutes         from './routes/team.routes'
import billingRoutes      from './routes/billing.routes'
import analyticsRoutes    from './routes/analytics.routes'
import notificationRoutes from './routes/notification.routes'

// Middleware
import { errorHandler, notFound } from './middleware/errorHandler'

const app = express()

// ── Security & basics ────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))

const allowedOrigins = [
  config.clientUrl,
  'http://localhost:3000',
  'http://localhost:5173',
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return cb(null, true)
    // Allow any Vercel preview deployment
    if (origin.endsWith('.vercel.app') || allowedOrigins.includes(origin)) {
      return cb(null, true)
    }
    cb(new Error(`CORS: origin ${origin} not allowed`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}))
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'))

// Stripe webhook needs raw body — mount BEFORE json parser
app.use('/api/billing/webhook', express.raw({ type: 'application/json' }))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Rate limiting ────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 min
  max:      200,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, message: 'Too many requests, please try again later.' },
})
app.use('/api', limiter)

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',                              authRoutes)
app.use('/api/users',                             userRoutes)
app.use('/api/projects',                          projectRoutes)
app.use('/api/projects/:projectId/tasks',         taskRoutes)
app.use('/api/team',                              teamRoutes)
app.use('/api/billing',                           billingRoutes)
app.use('/api/analytics',                         analyticsRoutes)
app.use('/api/notifications',                     notificationRoutes)

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', env: config.nodeEnv }))

// ── Error handlers ───────────────────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

// ── Start ────────────────────────────────────────────────────────────────────
async function start() {
  await connectDB()
  app.listen(config.port, () => {
    console.log(`🚀 Nexus API running on http://localhost:${config.port}`)
    console.log(`   Environment: ${config.nodeEnv}`)
  })
}

start()
