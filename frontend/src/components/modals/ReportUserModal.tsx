import { memo, useState } from 'react'
import { useReportUser } from '@/api/queries/useUser'
import { useToastStore } from '@/lib/toast-store'
import type { ReportReason } from '@/api/types/report'

interface ReportUserModalProps {
  isOpen: boolean
  onClose: () => void
  reportedUserId: string
  reportedUserNickname: string
}

const reportReasons = [
  { value: 'Harassment' as ReportReason, label: 'Дошкулення', description: 'Загрози, цькування або небажана поведінка' },
  { value: 'Spam' as ReportReason, label: 'Спам', description: 'Незапитувані повідомлення або реклама' },
  { value: 'InappropriateContent' as ReportReason, label: 'Неприпустимий контент', description: 'Образливий або недоречний вміст' },
  { value: 'Impersonation' as ReportReason, label: 'Імперсонація', description: 'Прикиданняся іншою людиною' },
  { value: 'Other' as ReportReason, label: 'Інше', description: 'Інша причина порушення' },
]

export const ReportUserModal = memo<ReportUserModalProps>(({
  isOpen,
  onClose,
  reportedUserId,
  reportedUserNickname,
}) => {
  const { success: showSuccess, error: showError } = useToastStore()
  const reportUserMutation = useReportUser()

  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null)
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedReason) {
      showError('Будь ласка, оберіть причину скарги')
      return
    }

    if (!description.trim()) {
      showError('Будь ласка, надайте опис проблеми')
      return
    }

    setIsSubmitting(true)

    try {
      await reportUserMutation.mutateAsync({
        reportedUserId,
        reason: selectedReason,
        description: description.trim(),
      })

      showSuccess('Скаргу надіслано успішно')
      onClose()
      // Reset form
      setSelectedReason(null)
      setDescription('')
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Не вдалося надіслати скаргу'
      showError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
      // Reset form
      setSelectedReason(null)
      setDescription('')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="bg-[var(--color-background-8)] rounded-[20px] p-[32px] max-w-[500px] w-full mx-[20px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="mb-[24px]">
          <h2 className="text-[24px] font-bold text-[var(--color-background)] mb-[8px]">
            Поскаржитися на користувача
          </h2>
          <p className="text-[16px] text-[var(--color-background-25)]">
            Скарга на користувача <span className="font-medium text-[var(--color-background)]">@{reportedUserNickname}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-[24px]">
          {/* Reason Selection */}
          <div>
            <label className="block text-[16px] font-medium text-[var(--color-background)] mb-[12px]">
              Причина скарги *
            </label>
            <div className="space-y-[8px]">
              {reportReasons.map((reason) => (
                <label
                  key={reason.value}
                  className={`block p-[16px] border rounded-[12px] cursor-pointer transition-colors ${
                    selectedReason === reason.value
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)] bg-opacity-10'
                      : 'border-[var(--color-background-16)] hover:border-[var(--color-background-25)]'
                  }`}
                >
                  <div className="flex items-start gap-[12px]">
                    <input
                      type="radio"
                      name="reason"
                      value={reason.value}
                      checked={selectedReason === reason.value}
                      onChange={(e) => setSelectedReason(e.target.value as ReportReason)}
                      className="mt-[2px] w-[16px] h-[16px] border border-[var(--color-primary)] rounded-full bg-transparent"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-[var(--color-background)]">
                        {reason.label}
                      </div>
                      <div className="text-[14px] text-[var(--color-background-25)] mt-[4px]">
                        {reason.description}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[16px] font-medium text-[var(--color-background)] mb-[12px]">
              Опис проблеми *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Будь ласка, детально опишіть проблему..."
              rows={4}
              className="w-full bg-[var(--color-night-background)] bg-opacity-40 border border-[var(--color-background-16)] rounded-[12px] px-[16px] py-[12px] text-[var(--color-background)] placeholder:text-[var(--color-background-25)] placeholder:opacity-65 outline-none resize-none"
              maxLength={500}
            />
            <div className="text-[12px] text-[var(--color-background-25)] mt-[4px]">
              {description.length}/500 символів
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-[12px] pt-[16px]">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 bg-[var(--color-background-16)] hover:bg-[var(--color-background-18)] text-[var(--color-background)] font-medium py-[12px] px-[24px] rounded-[12px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedReason || !description.trim()}
              className="flex-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-night-background)] font-medium py-[12px] px-[24px] rounded-[12px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Надсилання...' : 'Надіслати скаргу'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
})

ReportUserModal.displayName = 'ReportUserModal'

