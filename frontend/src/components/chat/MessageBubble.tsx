import { memo, useCallback } from 'react'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'
import { VoiceMessagePlayer } from './VoiceMessagePlayer'
import type { ChatMessageDto } from '@/api/types/chat'
import { ChatMessageTypeDto } from '@/api/types/chat'

interface MessageBubbleProps {
  message: ChatMessageDto
  isOwn: boolean
  showTimestamp?: boolean
  onImageClick?: (url: string) => void
  onFileDownload?: (url: string, fileName: string) => void
}

const getFileIcon = () => {
  // Use a single, simple document icon for all file types
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 4C4 2.89543 4.89543 2 6 2H12L20 10V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M12 2V10H20"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  )
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Б'
  const k = 1024
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(0)) + ' ' + sizes[i]
}

export const MessageBubble = memo<MessageBubbleProps>(({
  message,
  isOwn,
  onImageClick,
  onFileDownload
}) => {
  const handleImageClick = useCallback(() => {
    if (message.mediaUrl && onImageClick) {
      onImageClick(message.mediaUrl)
    }
  }, [message.mediaUrl, onImageClick])

  const handleFileDownload = useCallback(() => {
    if (message.mediaUrl && message.fileName && onFileDownload) {
      onFileDownload(message.mediaUrl, message.fileName)
    }
  }, [message.mediaUrl, message.fileName, onFileDownload])

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm', { locale: uk })
    } catch {
      return '00:00'
    }
  }

  const getBubbleClasses = () => {
    const baseClasses = "max-w-[596px] px-[20px] py-[20px]"
    
    if (isOwn) {
      return `${baseClasses} bg-[rgba(36,229,194,0.2)] rounded-tl-[20px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[6px]`
    } else {
      return `${baseClasses} bg-[rgba(55,195,255,0.25)] rounded-tl-[20px] rounded-tr-[20px] rounded-br-[20px] rounded-bl-[6px]`
    }
  }

  const renderContent = () => {
    switch (message.messageType) {
      case ChatMessageTypeDto.Text:
        // Check if this is actually a document message with file attachment
        if (message.mediaUrl && message.fileName) {
          // Document/File attachment - match Figma design
          return (
            <div className="space-y-[10px]">
              {message.content && (
                <p className="text-[#f1fdff] text-[16px] font-['Artifakt_Element'] leading-[1.5] whitespace-pre-wrap">
                  {message.content}
                </p>
              )}
              <button
                onClick={handleFileDownload}
                className="flex items-center gap-[16px] p-[20px] bg-[rgba(55,195,255,0.25)] rounded-tl-[20px] rounded-tr-[20px] rounded-br-[20px] rounded-bl-[6px] hover:bg-[rgba(55,195,255,0.35)] transition-colors w-full max-w-[472px]"
              >
                {/* Green circular icon container */}
                <div className="bg-[#24e5c2] rounded-[60px] p-[15px] shrink-0">
                  <div className="w-[24px] h-[24px] text-[#00141F]">
                    {getFileIcon()}
                  </div>
                </div>
                
                {/* Document info */}
                <div className="flex-1 text-left min-w-0">
                  <p className="text-[#f1fdff] text-[16px] font-['Artifakt_Element'] leading-[1.25] tracking-[-0.16px] truncate">
                    {message.fileName || 'Unknown file'}
                  </p>
                  {message.fileSize && (
                    <p className="text-[rgba(204,248,255,0.65)] text-[14px] font-['Artifakt_Element'] leading-[1.15] tracking-[-0.14px] mt-[6px]">
                      {formatFileSize(message.fileSize)}
                    </p>
                  )}
                </div>
              </button>
            </div>
          )
        }
        
        // Regular text message
        return (
          <p className="text-[#f1fdff] text-[16px] font-['Artifakt_Element'] leading-[1.5] whitespace-pre-wrap">
            {message.content}
          </p>
        )

      case ChatMessageTypeDto.Image:
        return (
          <div className="space-y-[10px]">
            {message.content && (
              <p className="text-[#f1fdff] text-[16px] font-['Artifakt_Element'] leading-[1.5] whitespace-pre-wrap">
                {message.content}
              </p>
            )}
            {message.mediaUrl && (
              <div 
                className="cursor-pointer rounded-[8px] overflow-hidden max-w-[400px]"
                onClick={handleImageClick}
              >
                <img
                  src={message.mediaUrl}
                  alt={message.fileName || 'Image'}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </div>
        )

      case ChatMessageTypeDto.Video:
        return (
          <div className="space-y-[10px]">
            {message.content && (
              <p className="text-[#f1fdff] text-[16px] font-['Artifakt_Element'] leading-[1.5] whitespace-pre-wrap">
                {message.content}
              </p>
            )}
            {message.mediaUrl && (
              <div className="relative rounded-[8px] overflow-hidden max-w-[400px]">
                <video
                  src={message.mediaUrl}
                  className="w-full h-auto"
                  controls
                  preload="metadata"
                />
              </div>
            )}
          </div>
        )

      case ChatMessageTypeDto.Audio:
        return (
          <div className="space-y-[10px]">
            {message.content && (
              <p className="text-[#f1fdff] text-[16px] font-['Artifakt_Element'] leading-[1.5] whitespace-pre-wrap">
                {message.content}
              </p>
            )}
            {message.mediaUrl && (
              <VoiceMessagePlayer
                audioUrl={message.mediaUrl}
                duration={message.fileSize ? Math.floor(message.fileSize / 1000) : 0}
              />
            )}
          </div>
        )

      default:
        // Check if this is a document/file message
        if (message.mediaUrl && message.fileName) {
          // Document/File attachment - match Figma design
          return (
            <div className="space-y-[10px]">
              {message.content && (
                <p className="text-[#f1fdff] text-[16px] font-['Artifakt_Element'] leading-[1.5] whitespace-pre-wrap">
                  {message.content}
                </p>
              )}
              <button
                onClick={handleFileDownload}
                className="flex items-center gap-[16px] p-[20px] bg-[rgba(55,195,255,0.25)] rounded-tl-[20px] rounded-tr-[20px] rounded-br-[20px] rounded-bl-[6px] hover:bg-[rgba(55,195,255,0.35)] transition-colors w-full max-w-[472px]"
              >
                {/* Green circular icon container */}
                <div className="bg-[#24e5c2] rounded-[60px] p-[15px] shrink-0">
                  <div className="w-[24px] h-[24px] text-[#00141F]">
                    {getFileIcon()}
                  </div>
                </div>
                
                {/* Document info */}
                <div className="flex-1 text-left min-w-0">
                  <p className="text-[#f1fdff] text-[16px] font-['Artifakt_Element'] leading-[1.25] tracking-[-0.16px] truncate">
                    {message.fileName || 'Unknown file'}
                  </p>
                  {message.fileSize && (
                    <p className="text-[rgba(204,248,255,0.65)] text-[14px] font-['Artifakt_Element'] leading-[1.15] tracking-[-0.14px] mt-[6px]">
                      {formatFileSize(message.fileSize)}
                    </p>
                  )}
                </div>
              </button>
            </div>
          )
        }
        
        // Fallback for unknown message types
        return (
          <p className="text-[#f1fdff] text-[16px] font-['Artifakt_Element'] leading-[1.5] whitespace-pre-wrap">
            {message.content || 'Unknown message type'}
          </p>
        )
    }
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} gap-[14px] items-end`}>
      {!isOwn && (
        <p className="text-[rgba(204,248,255,0.65)] text-[14px] font-['Artifakt_Element'] whitespace-nowrap">
          {formatTime(message.createdAt)}
        </p>
      )}
      
      <div className={getBubbleClasses()}>
        {renderContent()}
      </div>
      
      {isOwn && (
        <p className="text-[rgba(204,248,255,0.65)] text-[14px] font-['Artifakt_Element'] whitespace-nowrap">
          {formatTime(message.createdAt)}
        </p>
      )}
    </div>
  )
})

MessageBubble.displayName = 'MessageBubble'