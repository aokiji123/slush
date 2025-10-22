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
      />

      {/* Modal */}
      <div className="relative bg-[var(--color-background-8)] rounded-[20px] p-[32px] w-[480px] max-w-[90vw]">
        <h2 className="font-manrope font-bold text-[24px] text-[var(--color-background)] leading-[1.1] mb-[16px]">
          {title}
        </h2>

        <p className="text-[16px] text-[var(--color-background-25)] opacity-65 leading-[1.25] tracking-[-0.16px] mb-[32px]">
          {message}
        </p>

        <div className="flex gap-[12px] justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="bg-[var(--color-background-18)] rounded-[20px] px-[26px] py-[12px] text-[16px] text-[var(--color-background)] font-medium leading-[1.25] hover:bg-[var(--color-background-16)] transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-[20px] px-[26px] py-[12px] text-[16px] font-medium leading-[1.25] transition-colors disabled:opacity-50 ${
              isDestructive
                ? 'bg-[#FF4444] text-white hover:bg-[#FF6666]'
                : 'bg-[var(--color-background-21)] text-[var(--color-night-background)] hover:bg-[var(--color-background-23)]'
            }`}
          >
            {isLoading ? 'Завантаження...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

