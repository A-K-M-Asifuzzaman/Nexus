import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  glow?: boolean
}

export function GlowButton({
  children, className, variant = 'primary', size = 'md', glow = true, ...props
}: GlowButtonProps) {
  const sizes: Record<string, string> = {
    sm:  'h-8  px-4  text-xs rounded-lg',
    md:  'h-10 px-6  text-sm rounded-xl',
    lg:  'h-12 px-8  text-base rounded-xl',
    xl:  'h-14 px-10 text-base rounded-2xl',
  }

  const variants: Record<string, string> = {
    primary:   'bg-gradient-to-r from-nexus-500 to-purple-600 text-white font-semibold',
    secondary: 'bg-white/10 border border-white/10 text-white font-semibold hover:bg-white/15 backdrop-blur-sm',
    outline:   'border-2 border-nexus-500/50 text-nexus-400 font-semibold hover:border-nexus-400 hover:text-nexus-300',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-nexus-500/50 focus:ring-offset-2 focus:ring-offset-background',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizes[size],
        variants[variant],
        glow && variant === 'primary' && 'shadow-lg shadow-nexus-500/30 hover:shadow-nexus-500/50',
        className
      )}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {glow && variant === 'primary' && (
        <span className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
      )}
      {children}
    </motion.button>
  )
}
