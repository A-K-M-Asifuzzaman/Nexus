import { Router } from 'express'
import { requireAuth } from '../middleware/firebaseAuth'
import { listProjects, getProject, createProject, updateProject, deleteProject } from '../controllers/project.controller'

const router = Router()
router.use(requireAuth)
router.get('/',     listProjects)
router.get('/:id',  getProject)
router.post('/',    createProject)
router.patch('/:id',updateProject)
router.delete('/:id',deleteProject)

export default router
