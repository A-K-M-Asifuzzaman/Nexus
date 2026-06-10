import { Response } from 'express'
import { AuthRequest } from '../middleware/firebaseAuth'
import { sendInviteEmail } from '../services/email.service'

export async function sendInvite(req: AuthRequest, res: Response) {
  try {
    const { email, role } = req.body
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid email required' })
    }

    const appUrl  = process.env.CLIENT_URL || 'http://localhost:3000'
    const result  = await sendInviteEmail({
      to:          email,
      inviterName: req.user!.name || 'A Nexus user',
      role:        role || 'member',
      appUrl,
    })

    if (result.skipped) {
      return res.json({
        success: true,
        skipped: true,
        message: 'SMTP not configured — invite recorded but email not sent. Add SMTP_USER and SMTP_PASS to server/.env',
      })
    }

    return res.json({ success: true, message: `Invitation sent to ${email}` })
  } catch (err) {
    console.error('Invite email error:', err)
    return res.status(500).json({ success: false, message: 'Failed to send invitation email' })
  }
}
