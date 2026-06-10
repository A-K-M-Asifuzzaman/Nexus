import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/firebaseAuth'
import { getDashboardStats, getAdminStats } from '../controllers/analytics.controller'

const router = Router()
router.use(requireAuth)

router.get('/dashboard', getDashboardStats)
router.get('/admin',     requireRole('admin'), getAdminStats)

export default router
