import { memo, useCallback } from 'react'
import { Modal } from '../Modal'
import { MediaGallery } from './MediaGallery'
import { useConversationMedia } from '@/api/queries/useChat'

interface MediaModalProps {
  isOpen: boolean
  onClose: () => void
  mediaType: 'photos' | 'files' | 'voice'
  friendId: string
  friendName?: string
  onImageClick?: (url: string) => void
  onFileDownload?: (url: string, fileName: string) => void
}

const getModalTitle = (mediaType: 'photos' | 'files' | 'voice'): string => {
  switch (mediaType) {
    case 'photos':
      return 'Фото'
    case 'files':
      return 'Файли'
    case 'voice':
      return 'Голосові повідомлення'
    default:
      return 'Медіа'
  }
}

export const MediaModal = memo<MediaModalProps>(({
  isOpen,
  onClose,
  mediaType,
  friendId,
  onImageClick,
  onFileDownload,
}) => {
  const { data: mediaMessages = [], isLoading } = useConversationMedia(
    friendId,
    mediaType,
    1,
    100,
    isOpen // Only fetch when modal is open
  )

  const handleImageClick = useCallback((url: string) => {
    onImageClick?.(url)
  }, [onImageClick])

  const handleFileDownload = useCallback((url: string, fileName: string) => {
    onFileDownload?.(url, fileName)
  }, [onFileDownload])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getModalTitle(mediaType)}
      size="xl"
      className="bg-[#004252] border-2 border-[#046075]"
    >
      <div className="p-[24px]">
        <MediaGallery
          mediaType={mediaType}
          messages={mediaMessages}
          isLoading={isLoading}
          onImageClick={handleImageClick}
          onFileDownload={handleFileDownload}
          isInModal={true}
        />
      </div>
    </Modal>
  )
})

MediaModal.displayName = 'MediaModal'

