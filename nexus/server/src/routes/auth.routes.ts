import { Router } from 'express'
import { firebaseSync, getMe } from '../controllers/auth.controller'
import { requireAuth } from '../middleware/firebaseAuth'

const router = Router()

router.post('/firebase-sync', firebaseSync)
router.get('/me', requireAuth, getMe)

export default router
