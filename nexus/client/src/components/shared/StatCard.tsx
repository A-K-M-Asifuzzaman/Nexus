import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn, formatNumber, formatCurrency } from '@/lib/utils'
import { staggerItem } from '@/animations/variants'

interface StatCardProps {
  title: string
  value: number
  change?: number
  format?: 'number' | 'currency' | 'percent'
  icon: React.ReactNode
  iconColor?: string
  description?: string
  className?: string
}

export function StatCard({ title, value, change, format = 'number', icon, iconColor, description, className }: StatCardProps) {
  const formatted =
    format === 'currency' ? formatCurrency(value) :
    format === 'percent'  ? `${value}%` :
    formatNumber(value)

  const isPositive = (change ?? 0) > 0
  const isNeutral  = (change ?? 0) === 0

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl',
        'hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300',
        className
      )}
    >
      {/* Gradient orb */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-nexus-500/10 to-purple-500/5 blur-2xl" />

      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', iconColor || 'bg-nexus-500/10 text-nexus-400')}>
          {icon}
        </div>
      </div>

      <div className="mb-2">
        <span className="text-3xl font-bold tracking-tight text-foreground">{formatted}</span>
      </div>

      {change !== undefined && (
        <div className={cn('flex items-center gap-1 text-xs font-medium', isPositive ? 'text-green-400' : isNeutral ? 'text-muted-foreground' : 'text-red-400')}>
          {isPositive ? <TrendingUp className="h-3 w-3" /> : isNeutral ? <Minus className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          <span>{isPositive ? '+' : ''}{change}%</span>
          <span className="text-muted-foreground font-normal ml-1">vs last month</span>
        </div>
      )}
      {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
    </motion.div>
  )
}
