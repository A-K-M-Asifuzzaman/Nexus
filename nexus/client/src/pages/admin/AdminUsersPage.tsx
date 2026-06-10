import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, MoreHorizontal, UserPlus, Download, Shield } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatDate, getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { User } from '@/types'

const DUMMY_USERS: User[] = [
  { _id: '1', name: 'Sarah Chen',   email: 'sarah@veritas.io',   role: 'user',      plan: 'enterprise', isEmailVerified: true, createdAt: '2024-01-10T10:00:00Z', updatedAt: '2024-02-01T10:00:00Z' },
  { _id: '2', name: 'Marcus W.',    email: 'marcus@luminary.co', role: 'user',      plan: 'pro',        isEmailVerified: true, createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-30T10:00:00Z' },
  { _id: '3', name: 'Priya Patel',  email: 'priya@orion.health', role: 'moderator', plan: 'enterprise', isEmailVerified: true, createdAt: '2024-01-20T10:00:00Z', updatedAt: '2024-02-05T10:00:00Z' },
  { _id: '4', name: 'James R.',     email: 'james@apex.io',      role: 'user',      plan: 'pro',        isEmailVerified: false,createdAt: '2024-01-25T10:00:00Z', updatedAt: '2024-02-08T10:00:00Z' },
  { _id: '5', name: 'Emma Larsson', email: 'emma@datapulse.co',  role: 'user',      plan: 'free',       isEmailVerified: true, createdAt: '2024-02-01T10:00:00Z', updatedAt: '2024-02-10T10:00:00Z' },
  { _id: '6', name: 'Alex T.',      email: 'alex@cloudshift.io', role: 'admin',     plan: 'enterprise', isEmailVerified: true, createdAt: '2023-12-01T10:00:00Z', updatedAt: '2024-02-09T10:00:00Z' },
  { _id: '7', name: 'Lin Wei',      email: 'lin@techbyte.io',    role: 'user',      plan: 'pro',        isEmailVerified: true, createdAt: '2024-02-03T10:00:00Z', updatedAt: '2024-02-11T10:00:00Z' },
]

const planColors: Record<string, 'purple' | 'info' | 'secondary'> = {
  enterprise: 'purple',
  pro:        'info',
  free:       'secondary',
}

const roleColors: Record<string, 'destructive' | 'warning' | 'secondary'> = {
  admin:     'destructive',
  moderator: 'warning',
  user:      'secondary',
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const filtered = DUMMY_USERS.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  return (
    <div>
      <PageHeader
        title="User Management"
        description="View and manage all platform users."
        badge="Admin"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />Export
            </Button>
            <Button variant="glow" size="sm" className="gap-2">
              <UserPlus className="h-4 w-4" />Invite User
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-white/10 bg-white/5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
          {['all', 'admin', 'moderator', 'user'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all',
                roleFilter === r ? 'bg-nexus-500 text-white' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['User', 'Role', 'Plan', 'Verified', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(user => (
                  <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant={roleColors[user.role]}>
                        {user.role === 'admin' && <Shield className="h-2.5 w-2.5 mr-1" />}
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant={planColors[user.plan]}>{user.plan}</Badge>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`text-xs font-medium ${user.isEmailVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                        {user.isEmailVerified ? '✓ Verified' : '⏳ Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-3.5">
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
