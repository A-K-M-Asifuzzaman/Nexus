import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/firebaseAuth'
import { updateProfile, deleteAccount, listUsers, updateUserRole } from '../controllers/user.controller'

const router = Router()

router.use(requireAuth)

router.patch('/me',        updateProfile)
router.delete('/me',       deleteAccount)

// Admin
router.get('/',            requireRole('admin'), listUsers)
router.patch('/:id/role',  requireRole('admin'), updateUserRole)

export default router
