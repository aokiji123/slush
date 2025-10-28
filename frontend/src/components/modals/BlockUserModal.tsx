import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '../Modal'
import { Button } from '../Button'

interface BlockUserModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  friendNickname: string
  isBlocking: boolean
}

export const BlockUserModal = memo<BlockUserModalProps>(({ 
  isOpen,
  onClose,
  onConfirm,
  friendNickname,
  isBlocking,
}) => {
  const { t } = useTranslation('chat')

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('blockUserTitle')}
      size="md"
      showCloseButton={!isBlocking}
    >
      <div className="p-6">
        <div className="mb-6">
          <p className="text-[var(--color-background)] text-base mb-4">
            {t('blockUserWarning')}
          </p>
          <p className="text-[var(--color-background-25)] text-sm">
            {friendNickname}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isBlocking}
            className="flex-1"
          >
            {t('cancel')}
          </Button>
          <Button
            variant="destructive"
            size="md"
            onClick={onConfirm}
            isLoading={isBlocking}
            className="flex-1"
          >
            {t('blockUserConfirm')}
          </Button>
        </div>
      </div>
    </Modal>
  )
})

BlockUserModal.displayName = 'BlockUserModal'


