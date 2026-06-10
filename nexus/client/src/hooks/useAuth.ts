import { useAuthStore } from '@/store/auth.store'
import { authService } from '@/services/auth.service'
import { useNavigate } from 'react-router-dom'

export function useAuth() {
  const store    = useAuthStore()
  const navigate = useNavigate()

  const logout = async () => {
    await authService.logout()
    store.logout()
    navigate('/login')
  }

  return { ...store, logout }
}
