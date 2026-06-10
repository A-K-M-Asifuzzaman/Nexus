import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from 'recharts'
import {
  FolderKanban, CheckSquare, Clock, TrendingUp,
  CheckCircle, Circle, FolderOpen, ArrowRight, Loader2,
} from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { staggerContainer } from '@/animations/variants'
import { formatDate } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import { analyticsService } from '@/services/user.service'

const CHECKLIST_KEY = 'nexus_onboarding_v1'
const CHECKLIST_ITEMS = [
  { id: 'signup',  label: 'Create your account' },
  { id: 'project', label: 'Create your first project' },
  { id: 'task',    label: 'Add your first task' },
  { id: 'team',    label: 'Invite a team member' },
  { id: 'profile', label: 'Complete your profile' },
]

function loadChecklist(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY)
    return raw ? JSON.parse(raw) : { signup: true }
  } catch { return { signup: true } }
}

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
  recentProjects:   { _id: string; name: string; status: string; color: string; updatedAt: string; taskCount: number; completedTasks: number }[]
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-white/10 bg-background/90 p-3 backdrop-blur-xl shadow-xl text-xs">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="text-muted-foreground">{p.name}: <span className="text-foreground font-medium">{p.value}</span></p>
      ))}
    </div>
  )
}

export default function OverviewPage() {
  const { user }    = useAuthStore()
  const navigate    = useNavigate()
  const [data, setData]       = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [checklist, setChecklist] = useState<Record<string, boolean>>(loadChecklist)

  useEffect(() => {
    analyticsService.getDashboardStats()
      .then(d => {
        setData(d)
        // Auto-check tasks item
        if (d.totalTasks > 0) {
          setChecklist(prev => {
            const next = { ...prev, task: true, project: true }
            localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next))
            return next
          })
        } else if (d.totalProjects > 0) {
          setChecklist(prev => {
            const next = { ...prev, project: true }
            localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next))
            return next
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggleChecklist = (id: string) => {
    if (id === 'signup') return
    setChecklist(prev => {
      const next = { ...prev, [id]: !prev[id] }
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next))
      return next
    })
  }

  const doneCount = CHECKLIST_ITEMS.filter(t => checklist[t.id]).length
  const pct       = Math.round((doneCount / CHECKLIST_ITEMS.length) * 100)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div>
      <PageHeader
        title={`${greeting}, ${user?.name?.split(' ')[0] ?? 'there'} 👋`}
        description="Here's your project management overview."
      />

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-nexus-400" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <motion.div
            variants={staggerContainer} initial="hidden" animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8"
          >
            <StatCard title="Total Projects"   value={data?.totalProjects   ?? 0} change={0} format="number" icon={<FolderKanban size={18} />} iconColor="bg-nexus-500/10 text-nexus-400" />
            <StatCard title="Total Tasks"      value={data?.totalTasks      ?? 0} change={0} format="number" icon={<CheckSquare size={18} />}  iconColor="bg-purple-500/10 text-purple-400" />
            <StatCard title="In Progress"      value={data?.inProgressTasks ?? 0} change={0} format="number" icon={<Clock size={18} />}         iconColor="bg-yellow-500/10 text-yellow-400" />
            <StatCard title="Completion Rate"  value={data?.completionRate  ?? 0} change={0} format="percent"icon={<TrendingUp size={18} />}    iconColor="bg-green-500/10 text-green-400" />
          </motion.div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Task activity bar chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Task Activity (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  {(data?.taskTrend?.length ?? 0) === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[220px] text-center">
                      <CheckSquare className="h-10 w-10 text-muted-foreground mb-3" />
                      <p className="text-sm text-muted-foreground">No task activity yet.</p>
                      <p className="text-xs text-muted-foreground">Create a project and add tasks to see activity.</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={data?.taskTrend ?? []} barCategoryGap="30%">
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="_id" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis allowDecimals={false} tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="created"   name="Created"   fill="#6366f1" radius={[4,4,0,0]} />
                        <Bar dataKey="completed" name="Completed" fill="#22c55e" radius={[4,4,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Status distribution */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Project Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {(data?.totalProjects ?? 0) === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[160px] text-center">
                      <FolderKanban className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground">No projects yet</p>
                    </div>
                  ) : (
                    <>
                      <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                          <Pie data={data?.projectsByStatus.filter(d => d.value > 0)} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                            {data?.projectsByStatus.filter(d => d.value > 0).map((entry, i) => (
                              <Cell key={i} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-1.5">
                        {data?.projectsByStatus.filter(d => d.value > 0).map(d => (
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

          {/* Bottom row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent projects */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Recent Projects</CardTitle>
                    <button onClick={() => navigate('/dashboard/projects')} className="flex items-center gap-1 text-xs text-nexus-400 hover:text-nexus-300 transition-colors">
                      View all <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-0 pt-0">
                  {(data?.recentProjects?.length ?? 0) === 0 ? (
                    <div className="py-8 text-center">
                      <FolderOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No projects yet.</p>
                      <button onClick={() => navigate('/dashboard/projects')} className="mt-2 text-xs text-nexus-400 hover:underline">Create your first project →</button>
                    </div>
                  ) : (
                    data?.recentProjects.map(p => {
                      const pct2 = p.taskCount > 0 ? Math.round((p.completedTasks / p.taskCount) * 100) : 0
                      return (
                        <div
                          key={p._id}
                          onClick={() => navigate(`/dashboard/projects/${p._id}`)}
                          className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0 cursor-pointer hover:bg-white/[0.02] rounded-lg px-2 -mx-2 transition-colors"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: `${p.color}20` }}>
                            <FolderOpen className="h-4 w-4" style={{ color: p.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{p.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="h-1 flex-1 rounded-full bg-white/5 overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${pct2}%`, background: p.color }} />
                              </div>
                              <span className="text-xs text-muted-foreground shrink-0">{pct2}%</span>
                            </div>
                          </div>
                          <div className="shrink-0 text-right">
                            <Badge variant={p.status === 'active' ? 'success' : p.status === 'completed' ? 'info' : 'warning'} className="capitalize text-xs">
                              {p.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">{formatDate(p.updatedAt)}</p>
                          </div>
                        </div>
                      )
                    })
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Onboarding checklist */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Getting Started</CardTitle>
                    <Badge variant={doneCount === CHECKLIST_ITEMS.length ? 'success' : 'secondary'}>{doneCount}/{CHECKLIST_ITEMS.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1 pt-0">
                  {CHECKLIST_ITEMS.map(task => {
                    const done   = !!checklist[task.id]
                    const locked = task.id === 'signup'
                    return (
                      <button
                        key={task.id}
                        onClick={() => toggleChecklist(task.id)}
                        disabled={locked}
                        className={`flex w-full items-center gap-3 py-2.5 px-3 rounded-lg transition-colors text-left ${locked ? 'cursor-default' : 'hover:bg-white/5 cursor-pointer'}`}
                      >
                        {done
                          ? <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                          : <Circle     className="h-4 w-4 text-muted-foreground shrink-0" />
                        }
                        <span className={`text-sm ${done ? 'line-through text-muted-foreground' : ''}`}>{task.label}</span>
                      </button>
                    )
                  })}
                  <div className="pt-2">
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="h-full rounded-full bg-gradient-to-r from-nexus-500 to-purple-600"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">{pct}% complete</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </div>
  )
}
