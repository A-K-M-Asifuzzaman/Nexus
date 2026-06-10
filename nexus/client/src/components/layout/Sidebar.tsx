import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, BarChart3, FolderKanban, Users, Bell,
  CreditCard, Settings, ChevronLeft, Zap, LogOut, ChevronRight,
  DollarSign, TrendingUp, Server, FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import { useUIStore } from '@/store/ui.store'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { APP_NAME } from '@/constants'

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, BarChart3, FolderKanban, Users, Bell,
  CreditCard, Settings, DollarSign, TrendingUp, Server, FileText,
}

const USER_NAV = [
  { label: 'Overview',       href: '/dashboard',               icon: 'LayoutDashboard' },
  { label: 'Analytics',      href: '/dashboard/analytics',     icon: 'BarChart3' },
  { label: 'Projects',       href: '/dashboard/projects',      icon: 'FolderKanban' },
  { label: 'Team',           href: '/dashboard/team',          icon: 'Users' },
  { label: 'Notifications',  href: '/dashboard/notifications', icon: 'Bell' },
]

const USER_BOTTOM = [
  { label: 'Billing',   href: '/dashboard/billing',   icon: 'CreditCard' },
  { label: 'Settings',  href: '/dashboard/settings',  icon: 'Settings' },
]

const ADMIN_NAV = [
  { label: 'Overview',      href: '/admin',                  icon: 'LayoutDashboard' },
  { label: 'Users',         href: '/admin/users',            icon: 'Users' },
  { label: 'Revenue',       href: '/admin/revenue',          icon: 'DollarSign' },
  { label: 'Analytics',     href: '/admin/analytics',        icon: 'TrendingUp' },
  { label: 'Subscriptions', href: '/admin/subscriptions',    icon: 'CreditCard' },
  { label: 'System',        href: '/admin/system',           icon: 'Server' },
  { label: 'Logs',          href: '/admin/logs',             icon: 'FileText' },
]

interface SidebarProps {
  variant?: 'user' | 'admin'
}

export function Sidebar({ variant = 'user' }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { sidebarCollapsed, toggleCollapse, sidebarOpen, setSidebarOpen } = useUIStore()

  const navItems = variant === 'admin' ? ADMIN_NAV : USER_NAV
  const bottomItems = variant === 'admin' ? [] : USER_BOTTOM

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const NavItem = ({ item }: { item: typeof navItems[0] }) => {
    const Icon = iconMap[item.icon] || LayoutDashboard
    const isActive = location.pathname === item.href ||
      (item.href !== '/dashboard' && item.href !== '/admin' && location.pathname.startsWith(item.href))

    return (
      <Link
        to={item.href}
        onClick={() => setSidebarOpen(false)}
        className={cn(
          'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-nexus-500/10 text-nexus-400 border border-nexus-500/20'
            : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
        )}
      >
        <Icon className={cn('h-4.5 w-4.5 shrink-0', isActive ? 'text-nexus-400' : 'group-hover:text-foreground')} size={18} />
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden whitespace-nowrap"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
        {isActive && !sidebarCollapsed && (
          <motion.div
            layoutId="activeIndicator"
            className="ml-auto h-1.5 w-1.5 rounded-full bg-nexus-400"
          />
        )}
      </Link>
    )
  }

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: sidebarCollapsed ? 72 : 256 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/5 bg-background/95 backdrop-blur-xl',
          'lg:translate-x-0 transition-transform',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-nexus-500 to-purple-600 shadow-lg shadow-nexus-500/25">
              <Zap className="h-4 w-4 text-white" fill="currentColor" />
            </div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden font-bold text-lg font-[Syne] whitespace-nowrap"
                >
                  {APP_NAME}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground"
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
          {variant === 'admin' && !sidebarCollapsed && (
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Admin Panel
            </p>
          )}
          {navItems.map((item) => <NavItem key={item.href} item={item} />)}
        </nav>

        {/* Bottom actions */}
        {bottomItems.length > 0 && (
          <div className="p-3 space-y-1 border-t border-white/5">
            {bottomItems.map((item) => <NavItem key={item.href} item={item} />)}
          </div>
        )}

        {/* User profile */}
        <div className="p-3 border-t border-white/5">
          <div className={cn('flex items-center gap-3 rounded-xl p-2.5 hover:bg-white/5 transition-colors', sidebarCollapsed && 'justify-center')}>
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{getInitials(user?.name || 'U')}</AvatarFallback>
            </Avatar>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex-1 overflow-hidden min-w-0"
                >
                  <p className="text-xs font-semibold truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
