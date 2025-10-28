import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '../Modal'
import { Button } from '../Button'

interface RemoveFriendModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  friendNickname: string
  isRemoving: boolean
}

export const RemoveFriendModal = memo<RemoveFriendModalProps>(({
  isOpen,
  onClose,
  onConfirm,
  friendNickname,
  isRemoving,
}) => {
  const { t } = useTranslation('chat')

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('removeFriendTitle')}
      size="md"
      showCloseButton={!isRemoving}
    >
      <div className="p-6">
        {/* Warning message */}
        <div className="mb-6">
          <p className="text-[var(--color-background)] text-base mb-4">
            {t('removeFriendWarning')}
          </p>
          <p className="text-[var(--color-background-25)] text-sm">
            {friendNickname}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isRemoving}
            className="flex-1"
          >
            {t('cancel')}
          </Button>
          <Button
            variant="destructive"
            size="md"
            onClick={onConfirm}
            isLoading={isRemoving}
            className="flex-1"
          >
            {t('removeFriendConfirm')}
          </Button>
        </div>
      </div>
    </Modal>
  )
})

RemoveFriendModal.displayName = 'RemoveFriendModal'

