import nodemailer from 'nodemailer'

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com'
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587')
const SMTP_USER = process.env.SMTP_USER || ''
const SMTP_PASS = process.env.SMTP_PASS || ''
const FROM_NAME = process.env.FROM_NAME || 'Nexus'
const FROM_EMAIL = SMTP_USER

function getTransporter() {
  if (!SMTP_USER || !SMTP_PASS) return null
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
}

export async function sendInviteEmail(opts: {
  to:          string
  inviterName: string
  role:        string
  appUrl:      string
}) {
  const transporter = getTransporter()
  if (!transporter) {
    console.warn('⚠️  Email not sent: SMTP_USER / SMTP_PASS not configured in server/.env')
    return { skipped: true }
  }

  const subject = `${opts.inviterName} invited you to Nexus`
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#09090f;font-family:'Inter',Arial,sans-serif;">
      <div style="max-width:520px;margin:40px auto;padding:0 16px;">
        <!-- Logo bar -->
        <div style="text-align:center;margin-bottom:32px;">
          <span style="font-size:24px;font-weight:800;background:linear-gradient(135deg,#818cf8,#a78bfa,#67e8f9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
            ✦ Nexus
          </span>
        </div>

        <!-- Card -->
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:20px;overflow:hidden;">
          <!-- Top accent -->
          <div style="height:3px;background:linear-gradient(90deg,#6366f1,#a855f7,#06b6d4);"></div>

          <div style="padding:40px 36px;">
            <h1 style="color:#f9fafb;font-size:22px;font-weight:700;margin:0 0 8px;">You're invited 🎉</h1>
            <p style="color:#9ca3af;font-size:15px;margin:0 0 28px;line-height:1.6;">
              <strong style="color:#e5e7eb;">${opts.inviterName}</strong> has invited you to join their workspace on Nexus as a
              <strong style="color:#818cf8;">${opts.role}</strong>.
            </p>

            <div style="text-align:center;margin-bottom:28px;">
              <a href="${opts.appUrl}/signup" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 36px;border-radius:12px;letter-spacing:0.01em;">
                Accept Invitation →
              </a>
            </div>

            <p style="color:#6b7280;font-size:13px;text-align:center;margin:0;">
              Or sign up at <a href="${opts.appUrl}/signup" style="color:#818cf8;text-decoration:none;">${opts.appUrl}/signup</a>
            </p>
          </div>
        </div>

        <p style="color:#4b5563;font-size:12px;text-align:center;margin-top:24px;">
          You received this email because someone invited you to Nexus. If you weren't expecting this, you can ignore it.
        </p>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from:    `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to:      opts.to,
    subject,
    html,
  })

  console.log(`✉️  Invite sent to ${opts.to}`)
  return { skipped: false }
}
