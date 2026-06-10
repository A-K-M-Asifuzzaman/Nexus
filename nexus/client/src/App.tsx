import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuthStore } from '@/store/auth.store'
import { api } from '@/services/api'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { LandingLayout }   from '@/components/layout/LandingLayout'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ProtectedRoute }  from '@/routes/ProtectedRoute'
import { ToastContainer }  from '@/components/shared/Toast'

// Landing
const LandingPage       = lazy(() => import('@/pages/landing/LandingPage'))

// Auth
const LoginPage         = lazy(() => import('@/pages/auth/LoginPage'))
const SignupPage        = lazy(() => import('@/pages/auth/SignupPage'))
const ForgotPasswordPage= lazy(() => import('@/pages/auth/ForgotPasswordPage'))
const OnboardingPage    = lazy(() => import('@/pages/auth/OnboardingPage'))

// Dashboard
const OverviewPage      = lazy(() => import('@/pages/dashboard/OverviewPage'))
const AnalyticsPage     = lazy(() => import('@/pages/dashboard/AnalyticsPage'))
const ProjectsPage      = lazy(() => import('@/pages/dashboard/ProjectsPage'))
const ProjectDetailPage = lazy(() => import('@/pages/dashboard/ProjectDetailPage'))
const TeamPage          = lazy(() => import('@/pages/dashboard/TeamPage'))
const NotificationsPage = lazy(() => import('@/pages/dashboard/NotificationsPage'))
const SettingsPage      = lazy(() => import('@/pages/dashboard/SettingsPage'))
const BillingPage       = lazy(() => import('@/pages/dashboard/BillingPage'))

// Admin
const AdminOverviewPage = lazy(() => import('@/pages/admin/AdminOverviewPage'))
const AdminUsersPage    = lazy(() => import('@/pages/admin/AdminUsersPage'))

export default function App() {
  const { setUser, setIdToken, logout, setLoading } = useAuthStore()

  // Sync Firebase auth state → Zustand store
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        // Retry firebase-sync up to 3 times in case the server just restarted
        let attempts = 0
        const sync = async (): Promise<void> => {
          attempts++
          try {
            const idToken = await fbUser.getIdToken(/* forceRefresh */ attempts > 1)
            setIdToken(idToken)
            const { data } = await api.post('/auth/firebase-sync', { idToken })
            setUser(data.data.user)
          } catch {
            if (attempts < 3) {
              await new Promise(r => setTimeout(r, 1500 * attempts))
              return sync()
            }
            // After 3 failures, sign out cleanly so user can try again
            logout()
          }
        }
        await sync()
      } else {
        logout()
      }
      setLoading(false)
    })
    return unsubscribe
  }, [setUser, setIdToken, logout, setLoading])

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public — landing */}
        <Route element={<LandingLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Auth pages (no layout shell) */}
        <Route path="/login"          element={<LoginPage />} />
        <Route path="/signup"         element={<SignupPage />} />
        <Route path="/forgot-password"element={<ForgotPasswordPage />} />
        <Route path="/onboarding"     element={<OnboardingPage />} />

        {/* User dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout variant="user" />}>
            <Route path="/dashboard"               element={<OverviewPage />} />
            <Route path="/dashboard/analytics"     element={<AnalyticsPage />} />
            <Route path="/dashboard/projects"      element={<ProjectsPage />} />
            <Route path="/dashboard/projects/:id"  element={<ProjectDetailPage />} />
            <Route path="/dashboard/team"          element={<TeamPage />} />
            <Route path="/dashboard/notifications" element={<NotificationsPage />} />
            <Route path="/dashboard/settings"      element={<SettingsPage />} />
            <Route path="/dashboard/billing"       element={<BillingPage />} />
          </Route>
        </Route>

        {/* Admin dashboard */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route element={<DashboardLayout variant="admin" />}>
            <Route path="/admin"       element={<AdminOverviewPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </Suspense>
  )
}
