import { motion } from 'framer-motion'
import { fadeInDown } from '@/animations/variants'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  badge?: string
}

export function PageHeader({ title, description, actions, badge }: PageHeaderProps) {
  return (
    <motion.div
      variants={fadeInDown}
      initial="hidden"
      animate="visible"
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
    >
      <div>
        {badge && (
          <span className="inline-block mb-2 rounded-full bg-nexus-500/10 px-3 py-1 text-xs font-semibold text-nexus-400 border border-nexus-500/20">
            {badge}
          </span>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </motion.div>
  )
}
