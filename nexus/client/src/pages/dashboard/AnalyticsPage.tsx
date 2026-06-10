import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { FolderKanban, CheckSquare, Clock, AlertTriangle, Loader2, TrendingUp } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { staggerContainer } from '@/animations/variants'
import { analyticsService } from '@/services/user.service'

const PERIODS = ['7d', '30d', '90d'] as const
type Period = typeof PERIODS[number]

interface DashboardData {
  totalProjects:    number
  activeProjects:   number
  completedProjects:number
  pausedProjects:   number
  totalTasks:       number
  completedTasks:   number
  inProgressTasks:  number
  todoTasks:        number
  highPriorityTasks:number
  completionRate:   number
  projectsByStatus: { name: string; value: number; color: string }[]
  tasksByStatus:    { name: string; value: number; color: string }[]
  taskTrend:        { _id: string; created: number; completed: number }[]
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-white/10 bg-background/90 p-3 backdrop-blur-xl shadow-xl text-xs">
      <p className="font-semibold mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="flex justify-between gap-4">
          <span>{p.name}</span>
          <span className="font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const [period, setPeriod]   = useState<Period>('30d')
  const [data, setData]       = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    analyticsService.getDashboardStats()
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [period])

  // Slice taskTrend to the selected period
  const trendDays = period === '7d' ? 7 : period === '30d' ? 30 : 90
  const trend = (data?.taskTrend ?? []).slice(-trendDays)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-nexus-400" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Real-time project and task metrics for your workspace."
        actions={
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
            {PERIODS.map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  period === p ? 'bg-nexus-500 text-white' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        }
      />

      {/* KPIs */}
      <motion.div
        variants={staggerContainer} initial="hidden" animate="visible"
        className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8"
      >
        <StatCard title="Total Projects"   value={data?.totalProjects   ?? 0} change={0} format="number"  icon={<FolderKanban size={18} />} iconColor="bg-nexus-500/10 text-nexus-400" />
        <StatCard title="Total Tasks"      value={data?.totalTasks      ?? 0} change={0} format="number"  icon={<CheckSquare size={18} />}  iconColor="bg-purple-500/10 text-purple-400" />
        <StatCard title="In Progress"      value={data?.inProgressTasks ?? 0} change={0} format="number"  icon={<Clock size={18} />}        iconColor="bg-yellow-500/10 text-yellow-400" />
        <StatCard title="High Priority"    value={data?.highPriorityTasks ?? 0} change={0} format="number"icon={<AlertTriangle size={18} />} iconColor="bg-red-500/10 text-red-400" />
      </motion.div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Task trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Task Activity ({period})</CardTitle>
            </CardHeader>
            <CardContent>
              {trend.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[240px] text-center">
                  <TrendingUp className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">No task activity in this period.</p>
                  <p className="text-xs text-muted-foreground mt-1">Create projects and add tasks to see data here.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={trend} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="_id" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} interval={Math.floor(trend.length / 6)} />
                    <YAxis allowDecimals={false} tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, color: '#6b7280' }} />
                    <Bar dataKey="created"   name="Created"   fill="#6366f1" radius={[4,4,0,0]} />
                    <Bar dataKey="completed" name="Completed" fill="#22c55e" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Task status pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Tasks by Status</CardTitle>
            </CardHeader>
            <CardContent>
              {(data?.totalTasks ?? 0) === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-center">
                  <CheckSquare className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">No tasks yet</p>
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={data?.tasksByStatus.filter(d => d.value > 0)} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                        {data?.tasksByStatus.filter(d => d.value > 0).map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 mt-2">
                    {data?.tasksByStatus.map(d => (
                      <div key={d.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                          <span className="text-muted-foreground">{d.name}</span>
                        </div>
                        <span className="font-medium">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Project status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Projects by Status</CardTitle>
            </CardHeader>
            <CardContent>
              {(data?.totalProjects ?? 0) === 0 ? (
                <div className="flex flex-col items-center justify-center h-[160px] text-center">
                  <FolderKanban className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">No projects yet</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={data?.projectsByStatus.filter(d => d.value > 0)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Projects" radius={[0,4,4,0]}>
                      {data?.projectsByStatus.filter(d => d.value > 0).map((entry, i) => (
                        <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Completion summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Completion Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-2">
              {[
                { label: 'Task completion rate',    value: data?.completionRate ?? 0,                                      color: '#22c55e', suffix: '%' },
                { label: 'Tasks completed',          value: data?.totalTasks ? Math.round(((data.completedTasks) / data.totalTasks) * 100) : 0, color: '#6366f1', suffix: '%' },
                { label: 'Projects completed',       value: data?.totalProjects ? Math.round(((data.completedProjects ?? 0) / data.totalProjects) * 100) : 0, color: '#a855f7', suffix: '%' },
                { label: 'High-priority outstanding',value: data?.highPriorityTasks ?? 0, color: '#ef4444', suffix: ' tasks' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-semibold">{item.value}{item.suffix}</span>
                  </div>
                  {item.suffix === '%' && (
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full rounded-full"
                        style={{ background: item.color }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
