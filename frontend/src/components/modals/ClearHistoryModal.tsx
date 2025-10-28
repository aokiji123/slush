import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '../Modal'
import { Button } from '../Button'

interface ClearHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  friendNickname: string
  isClearing: boolean
}

export const ClearHistoryModal = memo<ClearHistoryModalProps>(({ 
  isOpen,
  onClose,
  onConfirm,
  friendNickname,
  isClearing,
}) => {
  const { t } = useTranslation('chat')

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('clearHistoryTitle')}
      size="md"
      showCloseButton={!isClearing}
    >
      <div className="p-6">
        <div className="mb-6">
          <p className="text-[var(--color-background)] text-base mb-4">
            {t('clearHistoryWarning')}
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
            disabled={isClearing}
            className="flex-1"
          >
            {t('cancel')}
          </Button>
          <Button
            variant="destructive"
            size="md"
            onClick={onConfirm}
            isLoading={isClearing}
            className="flex-1"
          >
            {t('clearHistoryConfirm')}
          </Button>
        </div>
      </div>
    </Modal>
  )
})

ClearHistoryModal.displayName = 'ClearHistoryModal'


