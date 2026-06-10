import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthStore {
  user:            User | null
  idToken:         string | null   // Firebase ID token (short-lived, refreshed by SDK)
  isAuthenticated: boolean
  isLoading:       boolean

  setUser:     (user: User) => void
  setIdToken:  (token: string) => void
  updateUser:  (partial: Partial<User>) => void
  logout:      () => void
  setLoading:  (loading: boolean) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user:            null,
      idToken:         null,
      isAuthenticated: false,
      isLoading:       true,

      setUser:    (user)    => set({ user, isAuthenticated: true }),
      setIdToken: (idToken) => set({ idToken }),
      updateUser: (partial) =>
        set((s) => ({ user: s.user ? { ...s.user, ...partial } : null })),
      logout:     ()        => set({ user: null, idToken: null, isAuthenticated: false }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'nexus_auth',
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
    }
  )
)
