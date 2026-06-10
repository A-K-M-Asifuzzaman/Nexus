export type UserRole = 'admin' | 'moderator' | 'user'
export type PlanType = 'free' | 'pro' | 'enterprise'
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete'
export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived'
export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface User {
  _id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  plan: PlanType
  isEmailVerified: boolean
  createdAt: string
  updatedAt: string
  subscription?: Subscription
  settings?: UserSettings
}

export interface UserSettings {
  notifications: {
    email: boolean
    push: boolean
    marketing: boolean
  }
  theme: 'dark' | 'light' | 'system'
  language: string
  timezone: string
}

export interface Subscription {
  _id: string
  userId: string
  plan: PlanType
  status: SubscriptionStatus
  stripeCustomerId: string
  stripeSubscriptionId: string
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  trialEnd?: string
}

export interface Project {
  _id: string
  userId: string
  name: string
  description?: string
  status: ProjectStatus
  color: string
  icon: string
  tags: string[]
  memberCount: number
  taskCount: number
  completedTasks: number
  createdAt: string
  updatedAt: string
}

export interface Notification {
  _id: string
  userId: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  actionUrl?: string
  createdAt: string
}

export interface AnalyticsData {
  revenue: TimeSeriesPoint[]
  users: TimeSeriesPoint[]
  projects: TimeSeriesPoint[]
  pageViews: TimeSeriesPoint[]
}

export interface TimeSeriesPoint {
  date: string
  value: number
}

export interface Invoice {
  _id: string
  userId: string
  amount: number
  currency: string
  status: 'paid' | 'open' | 'void' | 'uncollectible'
  invoiceUrl: string
  pdfUrl: string
  createdAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  pagination?: Pagination
}

export interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
}

export interface DashboardStats {
  totalRevenue: number
  totalUsers: number
  activeProjects: number
  growthRate: number
  revenueChange: number
  usersChange: number
  projectsChange: number
}

export interface AdminStats extends DashboardStats {
  totalSubscriptions: number
  churnRate: number
  mrr: number
  arr: number
}
