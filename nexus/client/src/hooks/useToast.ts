import { useUIStore } from '@/store/ui.store'

export function useToast() {
  const { addToast } = useUIStore()

  return {
    toast: {
      success: (title: string, description?: string) => addToast({ type: 'success', title, description }),
      error:   (title: string, description?: string) => addToast({ type: 'error',   title, description }),
      info:    (title: string, description?: string) => addToast({ type: 'info',    title, description }),
      warning: (title: string, description?: string) => addToast({ type: 'warning', title, description }),
    },
  }
}
