import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search, MoreHorizontal, FolderOpen, Users, CheckSquare, Calendar, Loader2, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CreateProjectModal } from '@/components/dashboard/CreateProjectModal'
import { staggerContainer, staggerItem } from '@/animations/variants'
import { cn, formatDate, truncate } from '@/lib/utils'
import { projectService } from '@/services/user.service'
import { useUIStore } from '@/store/ui.store'
import type { Project } from '@/types'

const statusColors: Record<string, string> = {
  active:    'success',
  paused:    'warning',
  completed: 'info',
  archived:  'secondary',
}

export default function ProjectsPage() {
  const navigate                    = useNavigate()
  const [search, setSearch]         = useState('')
  const [filter, setFilter]         = useState<string>('all')
  const [projects, setProjects]     = useState<Project[]>([])
  const [loading, setLoading]       = useState(true)
  const [modalOpen, setModalOpen]   = useState(false)
  const [menuOpen, setMenuOpen]     = useState<string | null>(null)
  const { addToast }                = useUIStore()

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      const res = await projectService.list(1, 50)
      setProjects(res.data ?? [])
    } catch {
      addToast({ type: 'error', title: 'Failed to load projects', description: 'Could not fetch your projects.' })
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await projectService.delete(id)
      setProjects(prev => prev.filter(p => p._id !== id))
      addToast({ type: 'success', title: 'Project deleted', description: `"${name}" was removed.` })
    } catch {
      addToast({ type: 'error', title: 'Delete failed', description: 'Please try again.' })
    }
    setMenuOpen(null)
  }

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || p.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Manage and track all your active projects."
        actions={
          <Button variant="glow" size="sm" className="gap-2" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-white/10 bg-white/5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
          {['all', 'active', 'paused', 'completed'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all',
                filter === s ? 'bg-nexus-500 text-white' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-nexus-400" />
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <FolderOpen className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold mb-1">
            {search || filter !== 'all' ? 'No matching projects' : 'No projects yet'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {search || filter !== 'all'
              ? 'Try a different search or filter.'
              : 'Create your first project to get started.'}
          </p>
          {!search && filter === 'all' && (
            <Button variant="glow" size="sm" onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> New Project
            </Button>
          )}
        </div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {filtered.map(project => {
            const pct = project.taskCount > 0
              ? Math.round((project.completedTasks / project.taskCount) * 100)
              : 0
            return (
              <motion.div
                key={project._id}
                variants={staggerItem}
                whileHover={{ y: -4 }}
              >
                <Card
                  className="h-full hover:border-white/20 transition-all cursor-pointer group relative"
                  onClick={() => { if (menuOpen !== project._id) navigate(`/dashboard/projects/${project._id}`) }}
                >
                  <CardContent className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${project.color}20` }}>
                          <FolderOpen className="h-5 w-5" style={{ color: project.color }} />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold group-hover:text-nexus-400 transition-colors">{project.name}</h3>
                          <Badge variant={statusColors[project.status] as 'success' | 'warning' | 'info' | 'secondary'} className="mt-0.5 text-xs">
                            {project.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="relative">
                        <button
                          onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === project._id ? null : project._id) }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        {menuOpen === project._id && (
                          <div className="absolute right-0 top-6 z-10 rounded-xl border border-white/10 bg-[#0d0d1a] shadow-xl min-w-[140px] py-1">
                            <button
                              onClick={() => handleDelete(project._id, project.name)}
                              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 className="h-3 w-3" /> Delete project
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {project.description && (
                      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{truncate(project.description, 80)}</p>
                    )}

                    {/* Tags */}
                    {project.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tags.map(tag => (
                          <span key={tag} className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-xs text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                        <span>Progress</span>
                        <span className="font-medium text-foreground">{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(to right, ${project.color}, ${project.color}99)` }}
                        />
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1"><Users className="h-3 w-3" />{project.memberCount ?? 1}</div>
                      <div className="flex items-center gap-1"><CheckSquare className="h-3 w-3" />{project.completedTasks ?? 0}/{project.taskCount ?? 0}</div>
                      <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(project.updatedAt)}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* Modal */}
      <CreateProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={fetchProjects}
      />
    </div>
  )
}
