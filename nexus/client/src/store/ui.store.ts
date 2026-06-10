import { create } from 'zustand'

interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  description?: string
}

interface UIStore {
  sidebarOpen:      boolean
  sidebarCollapsed: boolean
  theme:            'dark' | 'light'
  toasts:           Toast[]
  commandOpen:      boolean

  toggleSidebar:  () => void
  setSidebarOpen: (open: boolean) => void
  toggleCollapse: () => void
  setTheme:       (theme: 'dark' | 'light') => void
  toggleTheme:    () => void
  addToast:       (toast: Omit<Toast, 'id'>) => void
  removeToast:    (id: string) => void
  setCommandOpen: (open: boolean) => void
}

function applyTheme(theme: 'dark' | 'light') {
  const root = document.documentElement
  if (theme === 'light') {
    root.classList.add('light')
    root.classList.remove('dark')
  } else {
    root.classList.remove('light')
    root.classList.add('dark')
  }
  try { localStorage.setItem('nexus_theme', theme) } catch {}
}

function loadTheme(): 'dark' | 'light' {
  try {
    const saved = localStorage.getItem('nexus_theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {}
  return 'dark'
}

const initialTheme = loadTheme()
applyTheme(initialTheme)

export const useUIStore = create<UIStore>((set, get) => ({
  sidebarOpen:      true,
  sidebarCollapsed: false,
  theme:            initialTheme,
  toasts:           [],
  commandOpen:      false,

  toggleSidebar:  () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleCollapse: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  setTheme: (theme) => {
    applyTheme(theme)
    set({ theme })
  },

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    set({ theme: next })
  },

  addToast: (toast) => {
    const id = Math.random().toString(36).slice(2)
    set(s => ({ toasts: [...s.toasts, { ...toast, id }] }))
    setTimeout(() => get().removeToast(id), 5000)
  },

  removeToast:    (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
  setCommandOpen: (open) => set({ commandOpen: open }),
}))
