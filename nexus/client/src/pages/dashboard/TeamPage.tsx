import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserPlus, Mail, Shield, Crown, User as UserIcon, MoreHorizontal, Copy, CheckCheck } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { staggerContainer, staggerItem } from '@/animations/variants'
import { useAuthStore } from '@/store/auth.store'
import { useUIStore } from '@/store/ui.store'
import { getInitials } from '@/lib/utils'

const ROLES = [
  { key: 'owner',  label: 'Owner',  icon: Crown,  color: 'text-yellow-400', bg: 'bg-yellow-400/10',  desc: 'Full access to all resources and settings.' },
  { key: 'admin',  label: 'Admin',  icon: Shield, color: 'text-nexus-400',  bg: 'bg-nexus-400/10',  desc: 'Can manage members and most settings.' },
  { key: 'member', label: 'Member', icon: UserIcon,color: 'text-purple-400',bg: 'bg-purple-400/10', desc: 'Can view and contribute to projects.' },
]

interface PendingInvite {
  id: string
  email: string
  role: string
  sentAt: string
}

export default function TeamPage() {
  const { user } = useAuthStore()
  const { addToast } = useUIStore()
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole]   = useState('member')
  const [sending, setSending]         = useState(false)
  const [copied, setCopied]           = useState(false)
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([])

  const inviteLink = `${window.location.origin}/join?ref=${encodeURIComponent(user?.email ?? 'team')}`

  const copyInviteLink = async () => {
    await navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    addToast({ type: 'success', title: 'Link copied!', description: 'Share this link to invite teammates.' })
  }

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
      addToast({ type: 'error', title: 'Invalid email', description: 'Please enter a valid email address.' })
      return
    }
    setSending(true)
    try {
      const res = await import('@/services/api').then(m =>
        m.api.post('/team/invite', { email: inviteEmail.trim(), role: inviteRole })
      )
      const data = res.data
      if (data.skipped) {
        addToast({
          type: 'warning',
          title: 'Invite recorded — email not sent',
          description: 'Add SMTP_USER + SMTP_PASS to server/.env to enable email delivery.',
        })
      } else {
        addToast({ type: 'success', title: 'Invite sent!', description: `Email sent to ${inviteEmail}.` })
      }
      setPendingInvites(prev => [...prev, {
        id:     Date.now().toString(),
        email:  inviteEmail.trim(),
        role:   inviteRole,
        sentAt: new Date().toISOString(),
      }])
      setInviteEmail('')
    } catch {
      addToast({ type: 'error', title: 'Failed to send invite', description: 'Check server logs for details.' })
    } finally {
      setSending(false)
    }
  }

  const cancelInvite = (id: string) => {
    setPendingInvites(prev => prev.filter(i => i.id !== id))
    addToast({ type: 'info', title: 'Invite cancelled' })
  }

  const role = ROLES.find(r => r.key === 'owner')!

  return (
    <div>
      <PageHeader
        title="Team"
        description="Manage your team members and their access levels."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left: Members list */}
        <motion.div variants={staggerItem} className="lg:col-span-2 space-y-4">
          {/* Current members */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Members</CardTitle>
                <Badge variant="secondary">{1 + pendingInvites.length > 0 ? 1 : 1} member{1 + pendingInvites.length !== 1 ? 's' : ''}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-0 pt-0">
              {/* You (owner) */}
              <div className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
                <Avatar className="h-9 w-9">
                  {user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                  <AvatarFallback className="text-xs bg-nexus-500/20 text-nexus-300">
                    {getInitials(user?.name ?? 'You')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name ?? 'You'} <span className="text-xs text-muted-foreground">(you)</span></p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${role.bg} ${role.color}`}>
                    <Crown className="h-3 w-3" /> Owner
                  </span>
                </div>
              </div>

              {/* Empty state for more members */}
              {pendingInvites.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">No other members yet. Invite your team below.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending invites */}
          {pendingInvites.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Pending Invites</CardTitle>
                  <Badge variant="warning">{pendingInvites.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-0 pt-0">
                {pendingInvites.map(invite => {
                  const inviteRoleData = ROLES.find(r => r.key === invite.role) ?? ROLES[2]
                  return (
                    <div key={invite.id} className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{invite.email}</p>
                        <p className="text-xs text-muted-foreground">Invite pending</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${inviteRoleData.bg} ${inviteRoleData.color}`}>
                          {invite.role}
                        </span>
                        <button
                          onClick={() => cancelInvite(invite.id)}
                          className="text-xs text-muted-foreground hover:text-red-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Right: Invite panel */}
        <motion.div variants={staggerItem} className="space-y-4">
          {/* Invite by email */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-nexus-400" />
                Invite Member
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleInvite()}
                    placeholder="teammate@company.com"
                    className="w-full h-9 pl-9 pr-3 rounded-xl border border-white/10 bg-white/5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Role</label>
                <div className="space-y-2">
                  {ROLES.filter(r => r.key !== 'owner').map(r => {
                    const RoleIcon = r.icon
                    return (
                      <button
                        key={r.key}
                        type="button"
                        onClick={() => setInviteRole(r.key)}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                          inviteRole === r.key
                            ? 'border-nexus-500/50 bg-nexus-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${r.bg}`}>
                          <RoleIcon className={`h-3 w-3 ${r.color}`} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold">{r.label}</p>
                          <p className="text-xs text-muted-foreground">{r.desc}</p>
                        </div>
                        {inviteRole === r.key && (
                          <div className="ml-auto shrink-0 h-4 w-4 rounded-full bg-nexus-500 flex items-center justify-center">
                            <CheckCheck className="h-2.5 w-2.5 text-white" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              <Button
                variant="glow"
                className="w-full"
                onClick={handleInvite}
                loading={sending}
                disabled={!inviteEmail.trim()}
              >
                <UserPlus className="h-4 w-4 mr-2" /> Send Invite
              </Button>
            </CardContent>
          </Card>

          {/* Invite link */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Invite Link</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">Share this link to let people join your workspace.</p>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <span className="flex-1 text-xs text-muted-foreground truncate">{inviteLink}</span>
                <button onClick={copyInviteLink} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                  {copied ? <CheckCheck className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Roles legend */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Roles & Permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ROLES.map(r => {
                const RoleIcon = r.icon
                return (
                  <div key={r.key} className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${r.bg}`}>
                      <RoleIcon className={`h-3 w-3 ${r.color}`} />
                    </div>
                    <div>
                      <p className="text-xs font-medium">{r.label}</p>
                      <p className="text-xs text-muted-foreground">{r.desc}</p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
