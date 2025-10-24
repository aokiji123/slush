import { useEffect, useRef } from 'react'
import { IoClose } from 'react-icons/io5'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean
  /** Function to call when modal should close */
  onClose: () => void
  /** Optional title for the modal */
  title?: string
  /** Modal content */
  children: React.ReactNode
  /** Size variant of the modal */
  size?: ModalSize
  /** Additional CSS classes */
  className?: string
  /** Whether to show close button */
  showCloseButton?: boolean
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
}

/**
 * A reusable modal component with consistent styling and behavior.
 * Handles backdrop clicks, ESC key, and focus management.
 * 
 * @example
 * ```tsx
 * <Modal
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   title="Confirm Action"
 *   size="md"
 * >
 *   <p>Are you sure you want to proceed?</p>
 * </Modal>
 * ```
 */
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md', 
  className = '',
  showCloseButton = true
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null)

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0] as HTMLElement
      firstElement.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-60"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative bg-[var(--color-background-8)] rounded-[20px] w-full ${sizeClasses[size]} mx-4 max-h-[90vh] overflow-hidden shadow-2xl ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-[var(--color-background-17)]">
            <h2 id="modal-title" className="text-[24px] font-bold text-[var(--color-background)] font-manrope">
              {title}
            </h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-[var(--color-background-25)] hover:text-white hover:bg-[var(--color-background-17)] p-2 rounded-[12px] transition-all duration-200"
                aria-label="Close modal"
              >
                <IoClose size={24} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
