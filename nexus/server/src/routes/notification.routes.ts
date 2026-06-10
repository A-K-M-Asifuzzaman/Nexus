import { Router, Response } from 'express'
import { requireAuth, AuthRequest } from '../middleware/firebaseAuth'
import { Notification } from '../models/Notification'

const router = Router()
router.use(requireAuth)

router.get('/', async (req: AuthRequest, res: Response) => {
  const notifications = await Notification.find({ userId: req.user!._id })
    .sort({ createdAt: -1 }).limit(50)
  return res.json({ success: true, data: notifications })
})

router.patch('/:id/read', async (req: AuthRequest, res: Response) => {
  await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user!._id }, { read: true })
  return res.json({ success: true })
})

router.patch('/read-all', async (req: AuthRequest, res: Response) => {
  await Notification.updateMany({ userId: req.user!._id, read: false }, { read: true })
  return res.json({ success: true })
})

export default router
