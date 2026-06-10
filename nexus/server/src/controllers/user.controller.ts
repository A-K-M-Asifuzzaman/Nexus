import { Response } from 'express'
import { AuthRequest } from '../middleware/firebaseAuth'
import { User } from '../models/User'

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    const allowed = ['name', 'settings']
    const updates: Record<string, unknown> = {}
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key]
    }

    const user = await User.findByIdAndUpdate(req.user!._id, { $set: updates }, { new: true, runValidators: true })
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    return res.json({ success: true, data: user })
  } catch {
    return res.status(400).json({ success: false, message: 'Failed to update profile' })
  }
}

export async function deleteAccount(req: AuthRequest, res: Response) {
  try {
    await User.findByIdAndDelete(req.user!._id)
    return res.json({ success: true, message: 'Account deleted' })
  } catch {
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ── Admin only ──────────────────────────────────────────────────────────────

export async function listUsers(req: AuthRequest, res: Response) {
  try {
    const page  = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const skip  = (page - 1) * limit
    const search = req.query.search as string

    const filter = search
      ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
      : {}

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(filter),
    ])

    return res.json({
      success: true,
      data: users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch {
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

export async function updateUserRole(req: AuthRequest, res: Response) {
  try {
    const { role } = req.body
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true })
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    return res.json({ success: true, data: user })
  } catch {
    return res.status(400).json({ success: false, message: 'Failed to update role' })
  }
}
