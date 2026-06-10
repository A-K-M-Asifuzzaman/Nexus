import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Plus, CheckCircle2, Circle, Clock, AlertCircle,
  Pencil, Trash2, Loader2, FolderOpen, CheckSquare, MoreVertical, X, Flag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { staggerContainer, staggerItem, modalVariants } from '@/animations/variants'
import { api } from '@/services/api'
import { projectService } from '@/services/user.service'
import { useUIStore } from '@/store/ui.store'
import { cn, formatDate } from '@/lib/utils'
import type { Project } from '@/types'

interface Task {
  _id: string
  title:       string
  description?: string
  status:      'todo' | 'in_progress' | 'done'
  priority:    'low' | 'medium' | 'high'
  dueDate?:    string
  createdAt:   string
}

const STATUS_COLS = [
  { key: 'todo',        label: 'To Do',       icon: Circle,        color: 'text-muted-foreground',  bg: 'bg-white/5' },
  { key: 'in_progress', label: 'In Progress',  icon: Clock,         color: 'text-yellow-400',        bg: 'bg-yellow-400/5' },
  { key: 'done',        label: 'Done',         icon: CheckCircle2,  color: 'text-green-400',         bg: 'bg-green-400/5' },
] as const

const PRIORITY_CONFIG = {
  high:   { label: 'High',   color: 'text-red-400',    dot: 'bg-red-400' },
  medium: { label: 'Medium', color: 'text-yellow-400', dot: 'bg-yellow-400' },
  low:    { label: 'Low',    color: 'text-blue-400',   dot: 'bg-blue-400' },
}

export default function ProjectDetailPage() {
  const { id }          = useParams<{ id: string }>()
  const navigate        = useNavigate()
  const { addToast }    = useUIStore()

  const [project, setProject]   = useState<Project | null>(null)
  const [tasks, setTasks]       = useState<Task[]>([])
  const [loading, setLoading]   = useState(true)
  const [addModal, setAddModal] = useState<'todo' | 'in_progress' | 'done' | null>(null)
  const [editProject, setEditProject] = useState(false)

  // New task form state
  const [newTitle, setNewTitle]       = useState('')
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [newDesc, setNewDesc]         = useState('')
  const [saving, setSaving]           = useState(false)

  // Edit project state
  const [editName, setEditName]   = useState('')
  const [editDesc, setEditDesc]   = useState('')
  const [editStatus, setEditStatus] = useState<Project['status']>('active')
  const [editSaving, setEditSaving] = useState(false)

  const fetchAll = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const [proj, taskRes] = await Promise.all([
        projectService.get(id),
        api.get(`/projects/${id}/tasks`),
      ])
      setProject(proj)
      setTasks(taskRes.data.data ?? [])
      setEditName(proj.name)
      setEditDesc(proj.description ?? '')
      setEditStatus(proj.status)
    } catch {
      addToast({ type: 'error', title: 'Failed to load project' })
      navigate('/dashboard/projects')
    } finally {
      setLoading(false)
    }
  }, [id, navigate, addToast])

  useEffect(() => { fetchAll() }, [fetchAll])

  const addTask = async () => {
    if (!newTitle.trim() || !id) return
    setSaving(true)
    try {
      const res = await api.post(`/projects/${id}/tasks`, {
        title:    newTitle.trim(),
        description: newDesc.trim() || undefined,
        status:   addModal,
        priority: newPriority,
      })
      setTasks(prev => [res.data.data, ...prev])
      setNewTitle('')
      setNewDesc('')
      setNewPriority('medium')
      setAddModal(null)
      addToast({ type: 'success', title: 'Task added' })
    } catch {
      addToast({ type: 'error', title: 'Failed to add task' })
    } finally {
      setSaving(false)
    }
  }

  const updateTaskStatus = async (task: Task, status: Task['status']) => {
    try {
      await api.patch(`/projects/${id}/tasks/${task._id}`, { status })
      setTasks(prev => prev.map(t => t._id === task._id ? { ...t, status } : t))
      if (status === 'done')
        addToast({ type: 'success', title: 'Task completed! ✓' })
    } catch {
      addToast({ type: 'error', title: 'Failed to update task' })
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      await api.delete(`/projects/${id}/tasks/${taskId}`)
      setTasks(prev => prev.filter(t => t._id !== taskId))
      addToast({ type: 'info', title: 'Task removed' })
    } catch {
      addToast({ type: 'error', title: 'Failed to delete task' })
    }
  }

  const saveProjectEdits = async () => {
    if (!id || !editName.trim()) return
    setEditSaving(true)
    try {
      const updated = await projectService.update(id, {
        name:        editName.trim(),
        description: editDesc.trim(),
        status:      editStatus,
      })
      setProject(updated)
      setEditProject(false)
      addToast({ type: 'success', title: 'Project updated' })
    } catch {
      addToast({ type: 'error', title: 'Failed to update project' })
    } finally {
      setEditSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-nexus-400" />
      </div>
    )
  }

  if (!project) return null

  const tasksByStatus = (status: Task['status']) => tasks.filter(t => t.status === status)
  const totalTasks    = tasks.length
  const doneTasks     = tasksByStatus('done').length
  const pct           = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  return (
    <div className="max-w-screen-xl">
      {/* Back button + header */}
      <div className="flex items-start gap-4 mb-8">
        <button
          onClick={() => navigate('/dashboard/projects')}
          className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${project.color}25` }}>
              <FolderOpen className="h-5 w-5" style={{ color: project.color }} />
            </div>
            <div>
              <h1 className="text-xl font-bold">{project.name}</h1>
              {project.description && (
                <p className="text-sm text-muted-foreground mt-0.5">{project.description}</p>
              )}
            </div>
            <Badge variant={
              project.status === 'active' ? 'success' :
              project.status === 'paused' ? 'warning' :
              project.status === 'completed' ? 'info' : 'secondary'
            } className="capitalize">{project.status}</Badge>
          </div>
        </div>
        <Button variant="outline" size="sm" className="shrink-0 gap-2" onClick={() => setEditProject(true)}>
          <Pencil className="h-3.5 w-3.5" /> Edit
        </Button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total tasks',     value: totalTasks },
          { label: 'In progress',     value: tasksByStatus('in_progress').length },
          { label: 'Completed',       value: doneTasks },
          { label: 'Completion rate', value: `${pct}%` },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      {totalTasks > 0 && (
        <div className="mb-8">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Overall progress</span>
            <span className="font-medium text-foreground">{doneTasks}/{totalTasks} tasks done</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8 }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(to right, ${project.color}, ${project.color}99)` }}
            />
          </div>
        </div>
      )}

      {/* Kanban columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {STATUS_COLS.map(col => {
          const colTasks = tasksByStatus(col.key as Task['status'])
          const ColIcon  = col.icon
          return (
            <div key={col.key} className="flex flex-col gap-3">
              {/* Column header */}
              <div className={cn('flex items-center justify-between rounded-xl px-4 py-3 border border-white/5', col.bg)}>
                <div className="flex items-center gap-2">
                  <ColIcon className={cn('h-4 w-4', col.color)} />
                  <span className="text-sm font-semibold">{col.label}</span>
                  <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-xs text-muted-foreground">{colTasks.length}</span>
                </div>
                <button
                  onClick={() => { setAddModal(col.key as Task['status']); setNewTitle(''); setNewDesc(''); setNewPriority('medium') }}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
                  title={`Add task to ${col.label}`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Task cards */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-2 min-h-[120px] flex-1"
              >
                {colTasks.length === 0 && (
                  <button
                    onClick={() => { setAddModal(col.key as Task['status']); setNewTitle(''); setNewDesc(''); setNewPriority('medium') }}
                    className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-8 text-center w-full hover:border-nexus-500/40 hover:bg-nexus-500/5 transition-all group"
                  >
                    <Plus className="h-5 w-5 text-muted-foreground mb-1 group-hover:text-nexus-400 transition-colors" />
                    <p className="text-xs text-muted-foreground group-hover:text-nexus-400 transition-colors">Add a task</p>
                  </button>
                )}

                {colTasks.map(task => {
                  const pri = PRIORITY_CONFIG[task.priority]
                  const nextStatus: Record<Task['status'], Task['status'] | null> = {
                    todo:        'in_progress',
                    in_progress: 'done',
                    done:        null,
                  }
                  const next = nextStatus[task.status]
                  return (
                    <motion.div key={task._id} variants={staggerItem}>
                      <Card className="hover:border-white/20 transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className={cn(
                              'text-sm font-medium leading-snug flex-1',
                              task.status === 'done' && 'line-through text-muted-foreground'
                            )}>
                              {task.title}
                            </p>
                            <div className="flex items-center gap-1 shrink-0">
                              {next && (
                                <button
                                  onClick={() => updateTaskStatus(task, next)}
                                  title={`Move to ${next.replace('_', ' ')}`}
                                  className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-green-400 hover:bg-green-400/10 transition-colors"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={() => deleteTask(task._id)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {task.description && (
                            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{task.description}</p>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <div className={cn('h-1.5 w-1.5 rounded-full', pri.dot)} />
                              <span className={cn('text-xs', pri.color)}>{pri.label}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{formatDate(task.createdAt)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </motion.div>
              {/* Always-visible add task button */}
              {colTasks.length > 0 && (
                <button
                  onClick={() => { setAddModal(col.key as Task['status']); setNewTitle(''); setNewDesc(''); setNewPriority('medium') }}
                  className="flex items-center gap-2 w-full rounded-xl border border-dashed border-white/10 px-4 py-2.5 text-xs text-muted-foreground hover:border-nexus-500/40 hover:text-nexus-400 hover:bg-nexus-500/5 transition-all"
                >
                  <Plus className="h-3.5 w-3.5" /> Add task
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Add task modal */}
      <AnimatePresence>
        {addModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setAddModal(null)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                variants={modalVariants} initial="hidden" animate="visible" exit="exit"
                className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d0d1a] shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
                  <h2 className="text-base font-semibold capitalize">
                    Add task — {addModal.replace('_', ' ')}
                  </h2>
                  <button onClick={() => setAddModal(null)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Task title <span className="text-destructive">*</span></label>
                    <Input
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addTask()}
                      placeholder="e.g. Design the landing page hero"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Description <span className="text-muted-foreground">(optional)</span></label>
                    <textarea
                      value={newDesc}
                      onChange={e => setNewDesc(e.target.value)}
                      rows={2}
                      placeholder="Add more details..."
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">Priority</label>
                    <div className="flex gap-2">
                      {(['low', 'medium', 'high'] as const).map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setNewPriority(p)}
                          className={cn(
                            'flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium border transition-all capitalize',
                            newPriority === p
                              ? p === 'high'   ? 'border-red-500/50 bg-red-500/10 text-red-400'
                              : p === 'medium' ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400'
                              : 'border-blue-500/50 bg-blue-500/10 text-blue-400'
                              : 'border-white/10 bg-white/5 text-muted-foreground hover:border-white/20'
                          )}
                        >
                          <Flag className="h-3 w-3" /> {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setAddModal(null)}>Cancel</Button>
                    <Button type="button" variant="glow" className="flex-1" onClick={addTask} loading={saving} disabled={!newTitle.trim()}>
                      Add Task
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Edit project modal */}
      <AnimatePresence>
        {editProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setEditProject(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                variants={modalVariants} initial="hidden" animate="visible" exit="exit"
                className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d0d1a] shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
                  <h2 className="text-base font-semibold">Edit Project</h2>
                  <button onClick={() => setEditProject(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Name</label>
                    <Input value={editName} onChange={e => setEditName(e.target.value)} autoFocus />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Description</label>
                    <textarea
                      value={editDesc}
                      onChange={e => setEditDesc(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">Status</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['active', 'paused', 'completed', 'archived'] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => setEditStatus(s)}
                          className={cn(
                            'rounded-lg py-2 px-3 text-xs font-medium border capitalize transition-all',
                            editStatus === s
                              ? 'border-nexus-500/50 bg-nexus-500/10 text-nexus-400'
                              : 'border-white/10 bg-white/5 text-muted-foreground hover:border-white/20'
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setEditProject(false)}>Cancel</Button>
                    <Button type="button" variant="glow" className="flex-1" onClick={saveProjectEdits} loading={editSaving}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
