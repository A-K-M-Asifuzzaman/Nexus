import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts'
import {
  DollarSign, Users, TrendingUp, CreditCard,
  ArrowUpRight, AlertCircle, CheckCircle, Clock,
} from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { staggerContainer } from '@/animations/variants'
import { formatCurrency, formatRelativeTime, getInitials } from '@/lib/utils'

const mrrData = [
  { month: 'Jul', mrr: 38000, churn: 1200 },
  { month: 'Aug', mrr: 41000, churn: 900 },
  { month: 'Sep', mrr: 45000, churn: 1100 },
  { month: 'Oct', mrr: 48000, churn: 800 },
  { month: 'Nov', mrr: 52000, churn: 1300 },
  { month: 'Dec', mrr: 58200, churn: 700 },
]

const planGrowth = [
  { plan: 'Free',       count: 12400 },
  { plan: 'Pro',        count: 4200 },
  { plan: 'Enterprise', count: 890 },
]

const recentUsers = [
  { name: 'Sarah Chen',   email: 'sarah@veritas.io',  plan: 'enterprise', joinedAt: new Date(Date.now() - 10 * 60_000).toISOString() },
  { name: 'Marcus W.',    email: 'marcus@luminary.co', plan: 'pro',        joinedAt: new Date(Date.now() - 45 * 60_000).toISOString() },
  { name: 'Priya Patel',  email: 'priya@orion.health', plan: 'enterprise', joinedAt: new Date(Date.now() - 2 * 3600_000).toISOString() },
  { name: 'James R.',     email: 'james@apex.io',      plan: 'pro',        joinedAt: new Date(Date.now() - 4 * 3600_000).toISOString() },
  { name: 'Emma L.',      email: 'emma@datapulse.co',  plan: 'free',       joinedAt: new Date(Date.now() - 6 * 3600_000).toISOString() },
]

const systemHealth = [
  { label: 'API Gateway',   status: 'healthy',  latency: '28ms',  uptime: '99.99%' },
  { label: 'Auth Service',  status: 'healthy',  latency: '12ms',  uptime: '100%' },
  { label: 'Database',      status: 'healthy',  latency: '4ms',   uptime: '99.98%' },
  { label: 'CDN',           status: 'degraded', latency: '82ms',  uptime: '99.92%' },
  { label: 'Billing API',   status: 'healthy',  latency: '55ms',  uptime: '99.99%' },
]

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-white/10 bg-background/90 p-3 backdrop-blur-xl shadow-xl text-xs">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {p.name === 'mrr' || p.name === 'churn' ? formatCurrency(p.value) : p.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

export default function AdminOverviewPage() {
  return (
    <div>
      <PageHeader title="Admin Overview" description="System-wide metrics and health status." badge="Admin" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8"
      >
        <StatCard title="MRR"              value={58200}  change={12} format="currency" icon={<DollarSign size={18} />} iconColor="bg-nexus-500/10 text-nexus-400" />
        <StatCard title="Total Users"      value={17490}  change={9}  format="number"   icon={<Users size={18} />}       iconColor="bg-purple-500/10 text-purple-400" />
        <StatCard title="Active Subs"      value={5090}   change={7}  format="number"   icon={<CreditCard size={18} />}  iconColor="bg-cyan-500/10 text-cyan-400" />
        <StatCard title="Churn Rate"       value={1.8}    change={-3} format="percent"  icon={<TrendingUp size={18} />}  iconColor="bg-green-500/10 text-green-400" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* MRR chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">MRR vs Churn</CardTitle>
                <span className="text-xs text-green-400 font-medium flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" /> ARR: $698K
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={mrrData}>
                  <defs>
                    <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="churnGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="mrr"   name="mrr"   stroke="#6366f1" strokeWidth={2} fill="url(#mrrGrad)" />
                  <Area type="monotone" dataKey="churn" name="churn" stroke="#ef4444" strokeWidth={2} fill="url(#churnGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Plan distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="h-full">
            <CardHeader className="pb-2"><CardTitle className="text-base">Users by Plan</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={planGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="plan" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="users" fill="#6366f1" radius={[4, 4, 0, 0]} opacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent signups */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Recent Signups</CardTitle></CardHeader>
            <CardContent className="p-0">
              {recentUsers.map((u, i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-3 border-b border-white/5 last:border-0">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{getInitials(u.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{u.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                  </div>
                  <Badge variant={u.plan === 'enterprise' ? 'purple' : u.plan === 'pro' ? 'info' : 'secondary'}>
                    {u.plan}
                  </Badge>
                  <span className="text-xs text-muted-foreground shrink-0">{formatRelativeTime(u.joinedAt)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* System health */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">System Health</CardTitle>
                <div className="flex items-center gap-1.5 text-xs text-green-400">
                  <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  Operational
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {systemHealth.map((s) => (
                <div key={s.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-2.5">
                    {s.status === 'healthy'
                      ? <CheckCircle className="h-4 w-4 text-green-400" />
                      : s.status === 'degraded'
                      ? <AlertCircle className="h-4 w-4 text-yellow-400" />
                      : <Clock className="h-4 w-4 text-red-400" />
                    }
                    <span className="text-sm">{s.label}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{s.latency}</span>
                    <span className="text-green-400">{s.uptime}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
