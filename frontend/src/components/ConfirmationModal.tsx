import { Button } from './Button'

interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText: string
  cancelText: string
  onConfirm: () => void
  onCancel: () => void
  isDestructive?: boolean
  isLoading?: boolean
}

export const ConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isDestructive = false,
  isLoading = false,
}: ConfirmationModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-60"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div 
        className="relative bg-[var(--color-background-8)] rounded-[20px] p-[32px] w-[480px] max-w-[90vw]"
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <h2 id="modal-title" className="font-manrope font-bold text-[24px] text-[var(--color-background)] leading-[1.1] mb-[16px]">
          {title}
        </h2>

        <p id="modal-description" className="text-[16px] text-[var(--color-background-25)] opacity-65 leading-[1.25] tracking-[-0.16px] mb-[32px]">
          {message}
        </p>

        <div className="flex gap-[12px] justify-end">
          <Button
            onClick={onCancel}
            disabled={isLoading}
            variant="secondary"
            size="md"
          >
            {cancelText}
          </Button>

          <Button
            onClick={onConfirm}
            disabled={isLoading}
            isLoading={isLoading}
            variant={isDestructive ? 'destructive' : 'primary'}
            size="md"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}

