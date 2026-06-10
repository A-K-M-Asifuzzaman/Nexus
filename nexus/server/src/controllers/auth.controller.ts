import { Request, Response } from 'express'
import { admin } from '../config/firebase-admin'
import { User } from '../models/User'
import { config } from '../config'

function sanitizeUser(user: InstanceType<typeof User>) {
  const obj = user.toObject()
  return {
    _id:             obj._id,
    name:            obj.name,
    email:           obj.email,
    avatar:          obj.avatar,
    role:            obj.role,
    plan:            obj.plan,
    isEmailVerified: obj.isEmailVerified,
    settings:        obj.settings,
    createdAt:       obj.createdAt,
    updatedAt:       obj.updatedAt,
  }
}

/**
 * POST /api/auth/firebase-sync
 * Called after every Firebase sign-in. Creates the user record on first login.
 * Stripe customer creation is skipped gracefully if no Stripe key is configured.
 */
export async function firebaseSync(req: Request, res: Response) {
  try {
    const { idToken } = req.body
    if (!idToken) {
      return res.status(400).json({ success: false, message: 'idToken required' })
    }

    const decoded = await admin.auth().verifyIdToken(idToken)

    let user = await User.findOne({ firebaseUid: decoded.uid })

    if (!user) {
      // Try to create a Stripe customer only if key is configured
      let stripeCustomerId: string | undefined
      if (config.stripe.secretKey) {
        try {
          const Stripe = (await import('stripe')).default
          const stripe = new Stripe(config.stripe.secretKey, { apiVersion: '2023-10-16' })
          const customer = await stripe.customers.create({
            email: decoded.email || '',
            name:  decoded.name  || decoded.email?.split('@')[0] || 'User',
          })
          stripeCustomerId = customer.id
        } catch (stripeErr) {
          console.warn('⚠️  Stripe customer creation skipped:', (stripeErr as Error).message)
        }
      }

      user = await User.create({
        firebaseUid:      decoded.uid,
        name:             decoded.name            || decoded.email?.split('@')[0] || 'User',
        email:            decoded.email           || '',
        avatar:           decoded.picture         || undefined,
        isEmailVerified:  decoded.email_verified  || false,
        ...(stripeCustomerId && { stripeCustomerId }),
      })
    } else {
      // Refresh email verification and avatar on repeat sign-in
      user.isEmailVerified = decoded.email_verified ?? user.isEmailVerified
      if (decoded.picture && !user.avatar) user.avatar = decoded.picture
      await user.save()
    }

    return res.json({ success: true, data: { user: sanitizeUser(user) } })
  } catch (err) {
    console.error('firebase-sync error:', err)
    return res.status(500).json({ success: false, message: 'Authentication failed' })
  }
}

/** GET /api/auth/me */
export async function getMe(req: Request & { user?: { firebaseUid: string } }, res: Response) {
  try {
    const user = await User.findOne({ firebaseUid: req.user?.firebaseUid })
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    return res.json({ success: true, data: sanitizeUser(user) })
  } catch {
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}
