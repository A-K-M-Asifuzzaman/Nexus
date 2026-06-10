import { Router } from 'express'
import { requireAuth } from '../middleware/firebaseAuth'
import { sendInvite } from '../controllers/team.controller'

const router = Router()
router.use(requireAuth)
router.post('/invite', sendInvite)

export default router
