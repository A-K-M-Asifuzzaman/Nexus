import { api } from './api'
import type { User, UserSettings, Project, Notification, Invoice, ApiResponse, Pagination } from '@/types'

export const userService = {
  async updateProfile(data: Partial<User>) {
    const res = await api.patch('/users/me', data)
    return res.data.data as User
  },

  async updateSettings(settings: Partial<UserSettings>) {
    const res = await api.patch('/users/me/settings', settings)
    return res.data.data as User
  },

  async uploadAvatar(file: File) {
    const form = new FormData()
    form.append('avatar', file)
    const res = await api.post('/users/me/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } })
    return res.data.data as { avatarUrl: string }
  },

  async changePassword(current: string, newPassword: string) {
    const res = await api.post('/users/me/change-password', { currentPassword: current, newPassword })
    return res.data
  },

  async deleteAccount() {
    const res = await api.delete('/users/me')
    return res.data
  },
}

export const projectService = {
  async list(page = 1, limit = 10) {
    const res = await api.get(`/projects?page=${page}&limit=${limit}`)
    return res.data as ApiResponse<Project[]>
  },

  async get(id: string) {
    const res = await api.get(`/projects/${id}`)
    return res.data.data as Project
  },

  async create(data: Partial<Project>) {
    const res = await api.post('/projects', data)
    return res.data.data as Project
  },

  async update(id: string, data: Partial<Project>) {
    const res = await api.patch(`/projects/${id}`, data)
    return res.data.data as Project
  },

  async delete(id: string) {
    const res = await api.delete(`/projects/${id}`)
    return res.data
  },
}

export const notificationService = {
  async list() {
    const res = await api.get('/notifications')
    return res.data.data as Notification[]
  },

  async markRead(id: string) {
    const res = await api.patch(`/notifications/${id}/read`)
    return res.data
  },

  async markAllRead() {
    const res = await api.patch('/notifications/read-all')
    return res.data
  },
}

export const billingService = {
  async getSubscription() {
    const res = await api.get('/billing/subscription')
    return res.data.data
  },

  async createCheckout(plan: string, interval: 'monthly' | 'yearly') {
    const res = await api.post('/billing/checkout', { plan, interval })
    return res.data.data as { url: string }
  },

  async createPortalSession() {
    const res = await api.post('/billing/portal')
    return res.data.data as { url: string }
  },

  async getInvoices() {
    const res = await api.get('/billing/invoices')
    return res.data.data as Invoice[]
  },
}

export const analyticsService = {
  async getDashboardStats() {
    const res = await api.get('/analytics/dashboard')
    return res.data.data
  },

  async getRevenueSeries(period = '30d') {
    const res = await api.get(`/analytics/revenue?period=${period}`)
    return res.data.data
  },

  async getUserSeries(period = '30d') {
    const res = await api.get(`/analytics/users?period=${period}`)
    return res.data.data
  },
}
