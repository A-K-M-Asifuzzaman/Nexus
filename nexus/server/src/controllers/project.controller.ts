import { Response } from 'express'
import { AuthRequest } from '../middleware/firebaseAuth'
import { Project } from '../models/Project'
import { Types } from 'mongoose'

export async function listProjects(req: AuthRequest, res: Response) {
  try {
    const page  = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip  = (page - 1) * limit

    const [projects, total] = await Promise.all([
      Project.find({ userId: req.user!._id }).sort({ updatedAt: -1 }).skip(skip).limit(limit),
      Project.countDocuments({ userId: req.user!._id }),
    ])

    return res.json({
      success: true,
      data: projects,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch {
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

export async function getProject(req: AuthRequest, res: Response) {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user!._id })
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' })
    return res.json({ success: true, data: project })
  } catch {
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

export async function createProject(req: AuthRequest, res: Response) {
  try {
    const project = await Project.create({ ...req.body, userId: req.user!._id })
    return res.status(201).json({ success: true, data: project })
  } catch {
    return res.status(400).json({ success: false, message: 'Failed to create project' })
  }
}

export async function updateProject(req: AuthRequest, res: Response) {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },
      { $set: req.body },
      { new: true, runValidators: true }
    )
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' })
    return res.json({ success: true, data: project })
  } catch {
    return res.status(400).json({ success: false, message: 'Failed to update project' })
  }
}

export async function deleteProject(req: AuthRequest, res: Response) {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user!._id })
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' })
    return res.json({ success: true, message: 'Project deleted' })
  } catch {
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}
