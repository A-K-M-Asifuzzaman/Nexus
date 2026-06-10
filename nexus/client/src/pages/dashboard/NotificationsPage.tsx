import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Check, CheckCheck, Info, CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Notification } from '@/types'

const NOTIFICATIONS: Notification[] = [
  { _id: '1', userId: 'u1', title: 'Deployment successful',       message: 'Aurora UI v2.4.1 deployed to production.',           type: 'success', read: false, createdAt: new Date(Date.now() - 5 * 60_000).toISOString() },
  { _id: '2', userId: 'u1', title: 'New team member joined',      message: 'James Rodriguez joined the Aurora project.',         type: 'info',    read: false, createdAt: new Date(Date.now() - 30 * 60_000).toISOString() },
  { _id: '3', userId: 'u1', title: 'Subscription renewal',        message: 'Your Pro plan renews on April 1st. $290/year.',      type: 'info',    read: false, createdAt: new Date(Date.now() - 2 * 3600_000).toISOString() },
  { _id: '4', userId: 'u1', title: 'Storage usage warning',       message: 'You\'ve used 82% of your 50GB storage allowance.',   type: 'warning', read: true,  createdAt: new Date(Date.now() - 5 * 3600_000).toISOString() },
  { _id: '5', userId: 'u1', title: 'API rate limit reached',      message: 'You hit 10,000 API calls today. Limit resets at midnight.', type: 'error', read: true, createdAt: new Date(Date.now() - 12 * 3600_000).toISOString() },
  { _id: '6', userId: 'u1', title: 'Weekly analytics report',     message: 'Your week-over-week growth is up 12%. Check analytics.', type: 'success', read: true, createdAt: new Date(Date.now() - 24 * 3600_000).toISOString() },
]

const icons = { success: CheckCircle, info: Info, warning: AlertCircle, error: XCircle }
const styles = {
  success: 'text-green-400 bg-green-400/10',
  info:    'text-nexus-400 bg-nexus-400/10',
  warning: 'text-yellow-400 bg-yellow-400/10',
  error:   'text-red-400 bg-red-400/10',
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => setNotifications(n => n.map(notif => ({ ...notif, read: true })))
  const markRead = (id: string) => setNotifications(n => n.map(notif => notif._id === id ? { ...notif, read: true } : notif))

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Stay up to date with your workspace activity."
        actions={
          unreadCount > 0 ? (
            <Button variant="outline" size="sm" className="gap-2" onClick={markAllRead}>
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </Button>
          ) : undefined
        }
      />

      {unreadCount > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-nexus-500/10 border border-nexus-500/20 px-4 py-3 text-sm text-nexus-400">
          <Bell className="h-4 w-4" />
          You have <strong>{unreadCount}</strong> unread notification{unreadCount !== 1 ? 's' : ''}
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <div className="divide-y divide-white/5">
            {notifications.map((notif) => {
              const Icon = icons[notif.type]
              return (
                <motion.div
                  key={notif._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    'flex items-start gap-4 px-6 py-4 transition-colors cursor-pointer hover:bg-white/[0.02]',
                    !notif.read && 'bg-nexus-500/[0.03]'
                  )}
                  onClick={() => markRead(notif._id)}
                >
                  <div className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', styles[notif.type])}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium">{notif.title}</p>
                      {!notif.read && <div className="h-1.5 w-1.5 rounded-full bg-nexus-400 shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{notif.message}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{formatRelativeTime(notif.createdAt)}</span>
                    {!notif.read && (
                      <button
                        onClick={(e) => { e.stopPropagation(); markRead(notif._id) }}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
