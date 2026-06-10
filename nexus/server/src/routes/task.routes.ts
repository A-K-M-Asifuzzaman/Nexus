import { Router } from 'express'
import { requireAuth } from '../middleware/firebaseAuth'
import { listTasks, createTask, updateTask, deleteTask } from '../controllers/task.controller'

const router = Router({ mergeParams: true })
router.use(requireAuth)

router.get('/',           listTasks)
router.post('/',          createTask)
router.patch('/:taskId',  updateTask)
router.delete('/:taskId', deleteTask)

export default router
