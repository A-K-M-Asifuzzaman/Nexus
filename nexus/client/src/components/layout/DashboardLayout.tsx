import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, Bell, Search, Sun, Moon } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { useAuthStore } from '@/store/auth.store'
import { useUIStore } from '@/store/ui.store'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { pageTransition } from '@/animations/variants'
import { getInitials } from '@/lib/utils'
import { ToastContainer } from '@/components/shared/Toast'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  variant?: 'user' | 'admin'
}

export function DashboardLayout({ variant = 'user' }: DashboardLayoutProps) {
  const { isAuthenticated, user } = useAuthStore()
  const { sidebarCollapsed, toggleSidebar, theme, toggleTheme } = useUIStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) navigate('/login')
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar variant={variant} />

      {/* Main content */}
      <div className={cn(
        'flex flex-1 flex-col min-w-0 transition-all duration-300',
        sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'
      )}>
        {/* Topbar */}
        <header className="h-16 border-b border-white/5 bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="lg:hidden flex items-center justify-center h-9 w-9 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Menu size={18} />
            </button>
            <div className="hidden sm:flex items-center gap-2 h-9 px-4 rounded-xl bg-white/5 border border-white/10 text-sm text-muted-foreground w-64">
              <Search size={14} />
              <span>Search...</span>
              <kbd className="ml-auto text-xs bg-white/5 px-1.5 py-0.5 rounded border border-white/10">⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center h-9 w-9 rounded-xl hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button className="relative flex items-center justify-center h-9 w-9 rounded-xl hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-nexus-500 ring-2 ring-background" />
            </button>
            <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-nexus-500/20 hover:ring-nexus-500/50 transition-all">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="text-xs">{getInitials(user?.name || 'U')}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            variants={pageTransition}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="p-4 sm:p-6 lg:p-8 max-w-screen-2xl"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      <ToastContainer />
    </div>
  )
}
