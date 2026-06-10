import { motion } from 'framer-motion'
import { APP_NAME } from '@/constants'

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="relative h-16 w-16"
        >
          <div className="absolute inset-0 rounded-full border-2 border-nexus-500/20" />
          <div className="absolute inset-0 rounded-full border-t-2 border-nexus-500" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-nexus-500/20 to-purple-500/10 blur-sm" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-lg font-bold text-gradient">{APP_NAME}</p>
          <p className="text-xs text-muted-foreground mt-1">Loading your workspace...</p>
        </motion.div>
      </div>
    </div>
  )
}

export function InlineLoader({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="h-6 w-6 rounded-full border-2 border-nexus-500/20 border-t-nexus-500"
      />
    </div>
  )
}
