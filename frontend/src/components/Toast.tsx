import { useEffect } from 'react'
import { useToastStore } from '@/lib/toast-store'
import { HiX, HiCheckCircle, HiExclamationCircle, HiInformationCircle } from 'react-icons/hi'

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

interface ToastProps {
  toast: import('@/lib/toast-store').Toast
  onClose: () => void
}

const Toast = ({ toast, onClose }: ToastProps) => {
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(onClose, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast.duration, onClose])

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <HiCheckCircle className="w-5 h-5 text-[#24E5C2]" />
      case 'error':
        return <HiExclamationCircle className="w-5 h-5 text-[#ff6f95]" />
      case 'warning':
        return <HiExclamationCircle className="w-5 h-5 text-[var(--color-background-2)]" />
      case 'info':
        return <HiInformationCircle className="w-5 h-5 text-[var(--color-background-7)]" />
      default:
        return null
    }
  }

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-[rgba(36,229,194,0.1)] border-[#24E5C2]'
      case 'error':
        return 'bg-[rgba(255,111,149,0.1)] border-[#ff6f95]'
      case 'warning':
        return 'bg-[rgba(255,193,7,0.1)] border-[var(--color-background-2)]'
      case 'info':
        return 'bg-[rgba(55,195,255,0.1)] border-[var(--color-background-7)]'
      default:
        return 'bg-[var(--color-background-15)] border-[var(--color-background-16)]'
    }
  }

  return (
    <div
      className={`${getBackgroundColor()} border rounded-lg px-4 py-3 flex items-start gap-3 min-w-[320px] max-w-[500px] shadow-lg pointer-events-auto animate-slide-in-from-right`}
    >
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-[14px] font-medium break-words">
          {toast.message}
        </p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
        aria-label="Close notification"
      >
        <HiX className="w-5 h-5" />
      </button>
    </div>
  )
}

