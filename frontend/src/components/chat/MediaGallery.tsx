import { memo } from 'react'
import type { ChatMessageDto } from '@/api/types/chat'
import { VoiceMessagePlayer } from './VoiceMessagePlayer'

interface MediaGalleryProps {
  mediaType: 'photos' | 'files' | 'voice'
  messages: ChatMessageDto[]
  isLoading?: boolean
  onImageClick?: (url: string) => void
  onFileDownload?: (url: string, fileName: string) => void
  isInModal?: boolean
}

export const MediaGallery = memo<MediaGalleryProps>(({
  mediaType,
  messages,
  isLoading = false,
  onImageClick,
  onFileDownload,
  isInModal = false
}) => {
  if (isLoading) {
    return (
      <div className="p-[20px] text-center text-[rgba(204,248,255,0.65)] text-[14px] font-['Artifakt_Element']">
        Loading media...
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="p-[20px] text-center text-[rgba(204,248,255,0.65)] text-[14px] font-['Artifakt_Element']">
        {mediaType === 'photos' && 'No photos yet'}
        {mediaType === 'files' && 'No files yet'}
        {mediaType === 'voice' && 'No voice messages yet'}
      </div>
    )
  }

  if (mediaType === 'photos') {
    const gridCols = isInModal ? 'grid-cols-4' : 'grid-cols-3'
    return (
      <div className={`grid ${gridCols} gap-[12px]`}>
        {messages.map((message) => (
            <button
              key={message.id}
              onClick={() => onImageClick?.(message.mediaUrl || '')}
              className="aspect-square rounded-[12px] overflow-hidden bg-[rgba(55,195,255,0.25)] hover:opacity-80 transition-opacity"
            >
            {message.mediaUrl && (
              <img
                src={message.mediaUrl}
                alt={message.fileName || 'Photo'}
                className="w-full h-full object-cover"
              />
            )}
          </button>
        ))}
      </div>
    )
  }

  if (mediaType === 'files') {
    return (
      <div className="p-[20px] space-y-[8px]">
        {messages.map((message) => (
          <button
            key={message.id}
            onClick={() => onFileDownload?.(message.mediaUrl || '', message.fileName || 'Unknown')}
            className="w-full flex items-center gap-[12px] p-[12px] bg-[rgba(55,195,255,0.25)] rounded-[12px] hover:bg-[rgba(55,195,255,0.35)] transition-colors"
          >
            <div className="w-[32px] h-[32px] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 4C4 2.89543 4.89543 2 6 2H12L20 10V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4Z"
                  stroke="#f1fdff"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M12 2V10H20"
                  stroke="#f1fdff"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-[#f1fdff] text-[14px] font-['Artifakt_Element'] leading-[1.25] truncate">
                {message.fileName || 'Unknown file'}
              </p>
              {message.fileSize && (
                <p className="text-[rgba(204,248,255,0.65)] text-[12px] font-['Artifakt_Element'] mt-[2px]">
                  {formatFileSize(message.fileSize)}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-[12px]">
      {messages.map((message) => (
        <VoiceMessagePlayer
          key={message.id}
          audioUrl={message.mediaUrl || ''}
          duration={message.fileSize ? Math.floor(message.fileSize / 1000) : 0}
          isOwn={false}
        />
      ))}
    </div>
  )
})

MediaGallery.displayName = 'MediaGallery'

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Б'
  const k = 1024
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(0)) + ' ' + sizes[i]
}

