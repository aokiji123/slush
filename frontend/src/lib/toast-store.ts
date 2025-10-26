import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  showToast: (message: string, type?: ToastType, duration?: number) => void
  removeToast: (id: string) => void
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  
  showToast: (message, type = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substring(7)
    const toast: Toast = { id, type, message, duration }
    
    set((state) => ({ toasts: [...state.toasts, toast] }))
    
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
      }, duration)
    }
  },
  
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
  },
  
  success: (message, duration) => {
    const id = Math.random().toString(36).substring(7)
    const toast: Toast = { id, type: 'success', message, duration }
    
    set((state) => ({ toasts: [...state.toasts, toast] }))
    
    if (duration !== 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
      }, duration || 4000)
    }
  },
  
  error: (message, duration) => {
    const id = Math.random().toString(36).substring(7)
    const toast: Toast = { id, type: 'error', message, duration }
    
    set((state) => ({ toasts: [...state.toasts, toast] }))
    
    if (duration !== 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
      }, duration || 4000)
    }
  },
  
  info: (message, duration) => {
    const id = Math.random().toString(36).substring(7)
    const toast: Toast = { id, type: 'info', message, duration }
    
    set((state) => ({ toasts: [...state.toasts, toast] }))
    
    if (duration !== 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
      }, duration || 4000)
    }
  },
  
  warning: (message, duration) => {
    const id = Math.random().toString(36).substring(7)
    const toast: Toast = { id, type: 'warning', message, duration }
    
    set((state) => ({ toasts: [...state.toasts, toast] }))
    
    if (duration !== 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
      }, duration || 4000)
    }
  },
}))

