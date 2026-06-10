import { Request, Response, NextFunction } from 'express'
import { admin } from '../config/firebase-admin'
import { User } from '../models/User'

export interface AuthRequest extends Request {
  user?: {
    _id:         string
    firebaseUid: string
    email:       string
    name:        string
    role:        string
    plan:        string
  }
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized: no token' })
    }

    const idToken = authHeader.split('Bearer ')[1]
    const decoded = await admin.auth().verifyIdToken(idToken)

    const user = await User.findOne({ firebaseUid: decoded.uid }).lean()
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' })
    }

    req.user = {
      _id:         (user._id as { toString(): string }).toString(),
      firebaseUid: user.firebaseUid,
      email:       user.email,
      name:        user.name,
      role:        user.role,
      plan:        user.plan,
    }
    return next()
  } catch {
    return res.status(401).json({ success: false, message: 'Unauthorized: invalid token' })
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden: insufficient permissions' })
    }
    return next()
  }
}
