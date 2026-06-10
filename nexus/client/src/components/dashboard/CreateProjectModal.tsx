import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUIStore } from '@/store/ui.store'
import { projectService } from '@/services/user.service'
import { PROJECT_COLORS } from '@/constants'
import { modalVariants } from '@/animations/variants'
import { cn } from '@/lib/utils'

const schema = z.object({
  name:        z.string().min(2, 'Name must be at least 2 characters').max(50),
  description: z.string().max(200).optional(),
  color:       z.string().default('#6366f1'),
  tags:        z.string().optional(),
})
type FormData = z.infer<typeof schema>

interface CreateProjectModalProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

export function CreateProjectModal({ open, onClose, onCreated }: CreateProjectModalProps) {
  const [selectedColor, setSelectedColor] = useState(PROJECT_COLORS[0])
  const [loading, setLoading] = useState(false)
  const { addToast } = useUIStore()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { color: PROJECT_COLORS[0] },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      await projectService.create({
        name:        data.name,
        description: data.description || '',
        color:       selectedColor,
        tags:        data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        status:      'active',
      })
      addToast({ type: 'success', title: 'Project created!', description: `"${data.name}" is ready.` })
      reset()
      setSelectedColor(PROJECT_COLORS[0])
      onCreated()
      onClose()
    } catch {
      addToast({ type: 'error', title: 'Failed to create project', description: 'Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d0d1a] shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-nexus-500/10">
                    <FolderOpen className="h-4 w-4 text-nexus-400" />
                  </div>
                  <h2 className="text-base font-semibold">New Project</h2>
                </div>
                <button
                  onClick={handleClose}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Project name <span className="text-destructive">*</span></label>
                  <Input
                    {...register('name')}
                    placeholder="e.g. Aurora Design System"
                    error={errors.name?.message}
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Description <span className="text-muted-foreground text-xs">(optional)</span></label>
                  <textarea
                    {...register('description')}
                    placeholder="What is this project about?"
                    rows={3}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none"
                  />
                  {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>}
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {PROJECT_COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          'h-7 w-7 rounded-full transition-all ring-offset-2 ring-offset-background',
                          selectedColor === color && 'ring-2 ring-white scale-110'
                        )}
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Tags <span className="text-muted-foreground text-xs">(comma separated)</span></label>
                  <Input
                    {...register('tags')}
                    placeholder="e.g. Frontend, React, Design"
                  />
                </div>

                {/* Preview */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${selectedColor}25` }}>
                    <FolderOpen className="h-4 w-4" style={{ color: selectedColor }} />
                  </div>
                  <div>
                    <p className="text-xs font-medium">Preview</p>
                    <p className="text-xs text-muted-foreground">How your project will look</p>
                  </div>
                  <div className="ml-auto h-1.5 w-16 rounded-full overflow-hidden bg-white/5">
                    <div className="h-full w-0 rounded-full" style={{ background: selectedColor }} />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="glow" className="flex-1" loading={loading}>
                    Create Project
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
