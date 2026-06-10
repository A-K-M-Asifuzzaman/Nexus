import { Response } from 'express'
import { AuthRequest } from '../middleware/firebaseAuth'
import { Task } from '../models/Task'
import { Project } from '../models/Project'

async function verifyProjectOwner(projectId: string, userId: string) {
  return Project.findOne({ _id: projectId, userId })
}

export async function listTasks(req: AuthRequest, res: Response) {
  try {
    const project = await verifyProjectOwner(req.params.projectId, String(req.user!._id))
    if (!project) return res.status(403).json({ success: false, message: 'Not found' })
    const tasks = await Task.find({ projectId: req.params.projectId }).sort({ createdAt: -1 })
    return res.json({ success: true, data: tasks })
  } catch {
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

export async function createTask(req: AuthRequest, res: Response) {
  try {
    const project = await verifyProjectOwner(req.params.projectId, String(req.user!._id))
    if (!project) return res.status(403).json({ success: false, message: 'Not found' })

    const task = await Task.create({ ...req.body, projectId: req.params.projectId, userId: req.user!._id })

    // Update project counters
    await Project.findByIdAndUpdate(req.params.projectId, { $inc: { taskCount: 1 } })

    return res.status(201).json({ success: true, data: task })
  } catch {
    return res.status(400).json({ success: false, message: 'Failed to create task' })
  }
}

export async function updateTask(req: AuthRequest, res: Response) {
  try {
    const task = await Task.findOne({ _id: req.params.taskId, projectId: req.params.projectId })
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' })

    const wasCompleted = task.status === 'done'
    const willComplete = req.body.status === 'done'

    Object.assign(task, req.body)
    await task.save()

    // Sync completedTasks counter
    if (!wasCompleted && willComplete) {
      await Project.findByIdAndUpdate(req.params.projectId, { $inc: { completedTasks: 1 } })
    } else if (wasCompleted && !willComplete && req.body.status !== undefined) {
      await Project.findByIdAndUpdate(req.params.projectId, { $inc: { completedTasks: -1 } })
    }

    return res.json({ success: true, data: task })
  } catch {
    return res.status(400).json({ success: false, message: 'Failed to update task' })
  }
}

export async function deleteTask(req: AuthRequest, res: Response) {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.taskId, projectId: req.params.projectId })
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' })

    const wasDone = task.status === 'done'
    await Project.findByIdAndUpdate(req.params.projectId, {
      $inc: { taskCount: -1, ...(wasDone && { completedTasks: -1 }) },
    })

    return res.json({ success: true, message: 'Task deleted' })
  } catch {
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}
