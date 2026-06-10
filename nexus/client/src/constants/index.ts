export const APP_NAME = 'Nexus'
export const APP_TAGLINE = 'Build. Scale. Grow.'
export const APP_DESCRIPTION = 'The AI-powered SaaS platform for modern teams'
export const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:3000'
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const PLANS = {
  free: {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    features: ['Up to 3 projects', '1 team member', '5GB storage', 'Basic analytics', 'Community support'],
    limits: { projects: 3, members: 1, storage: 5 },
    badge: null,
  },
  pro: {
    name: 'Pro',
    price: { monthly: 29, yearly: 290 },
    features: ['Unlimited projects', 'Up to 10 members', '50GB storage', 'Advanced analytics', 'Priority support', 'Custom domains', 'API access'],
    limits: { projects: -1, members: 10, storage: 50 },
    badge: 'Most Popular',
  },
  enterprise: {
    name: 'Enterprise',
    price: { monthly: 99, yearly: 990 },
    features: ['Everything in Pro', 'Unlimited members', '500GB storage', 'AI-powered insights', 'Dedicated support', 'SSO / SAML', 'Custom integrations', 'SLA guarantee', 'Audit logs'],
    limits: { projects: -1, members: -1, storage: 500 },
    badge: 'Best Value',
  },
} as const

export const NAV_LINKS = [
  { label: 'Features',   href: '#features' },
  { label: 'Pricing',    href: '#pricing' },
  { label: 'About',      href: '#about' },
  { label: 'Blog',       href: '#blog' },
  { label: 'Changelog',  href: '#changelog' },
]

export const DASHBOARD_NAV = [
  { label: 'Overview',      href: '/dashboard',              icon: 'LayoutDashboard' },
  { label: 'Analytics',     href: '/dashboard/analytics',    icon: 'BarChart3' },
  { label: 'Projects',      href: '/dashboard/projects',     icon: 'FolderKanban' },
  { label: 'Team',          href: '/dashboard/team',         icon: 'Users' },
  { label: 'Notifications', href: '/dashboard/notifications',icon: 'Bell' },
  { label: 'Billing',       href: '/dashboard/billing',      icon: 'CreditCard' },
  { label: 'Settings',      href: '/dashboard/settings',     icon: 'Settings' },
]

export const ADMIN_NAV = [
  { label: 'Overview',     href: '/admin',                 icon: 'LayoutDashboard' },
  { label: 'Users',        href: '/admin/users',           icon: 'Users' },
  { label: 'Revenue',      href: '/admin/revenue',         icon: 'DollarSign' },
  { label: 'Analytics',    href: '/admin/analytics',       icon: 'TrendingUp' },
  { label: 'Subscriptions',href: '/admin/subscriptions',   icon: 'CreditCard' },
  { label: 'System',       href: '/admin/system',          icon: 'Server' },
  { label: 'Logs',         href: '/admin/logs',            icon: 'FileText' },
]

export const PROJECT_COLORS = [
  '#6366f1', '#a855f7', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6',
]

export const TOKEN_KEY    = 'nexus_token'
export const REFRESH_KEY  = 'nexus_refresh_token'
export const USER_KEY     = 'nexus_user'
