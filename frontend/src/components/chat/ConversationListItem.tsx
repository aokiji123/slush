import { memo, useCallback } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { uk } from 'date-fns/locale'
import { OptimizedImage } from '../OptimizedImage'
import type { ChatConversationDto } from '@/api/types/chat'

interface ConversationListItemProps {
  conversation: ChatConversationDto
  isActive?: boolean
  onClick: (conversation: ChatConversationDto) => void
}

export const ConversationListItem = memo<ConversationListItemProps>(({
  conversation,
  isActive = false,
  onClick,
}) => {
  const handleClick = useCallback(() => {
    onClick(conversation)
  }, [conversation, onClick])

  const formatLastMessageTime = useCallback((dateString: string) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { 
        addSuffix: true, 
        locale: uk,
        includeSeconds: true 
      })
    } catch {
      return 'щойно'
    }
  }, [])

  const getLastMessagePreview = useCallback(() => {
    if (!conversation.lastMessage) {
      return 'Немає повідомлень'
    }

    const { lastMessage } = conversation
    const isFromCurrentUser = lastMessage.senderId !== conversation.friendId

    if (lastMessage.messageType === 0) { // Text message
      const prefix = isFromCurrentUser ? 'Ви: ' : ''
      return `${prefix}${lastMessage.content || ''}`
    } else if (lastMessage.messageType === 1) { // Image
      return isFromCurrentUser ? 'Ви: [Зображення]' : '[Зображення]'
    } else if (lastMessage.messageType === 2) { // Video
      return isFromCurrentUser ? 'Ви: [Відео]' : '[Відео]'
    } else if (lastMessage.messageType === 3) { // Audio
      return isFromCurrentUser ? 'Ви: [Аудіо]' : '[Аудіо]'
    }

    return 'Повідомлення'
  }, [conversation])

  return (
    <button
      onClick={handleClick}
      className={`
        w-full flex gap-[12px] items-center p-0 relative transition-colors
        hover:bg-[rgba(0,20,31,0.1)] rounded-[8px] group
        ${isActive ? 'bg-[rgba(0,20,31,0.2)]' : ''}
      `}
      aria-label={`Відкрити чат з ${conversation.friendNickname}`}
    >
      {/* Avatar */}
      <div className="relative shrink-0 size-[44px]">
        <OptimizedImage
          src={conversation.friendAvatar || '/avatar.png'}
          alt={`${conversation.friendNickname} аватар`}
          className="w-full h-full rounded-[39px] object-cover"
          loading="lazy"
        />
        {/* Online indicator */}
        {conversation.friendIsOnline && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#49ffde] rounded-full border-2 border-[#004252]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-[6px] items-start justify-center">
        {/* Header with name and time */}
        <div className="w-full flex items-center justify-between">
          <h3 className="font-['Artifakt_Element',sans-serif] font-bold text-[#f1fdff] text-[16px] leading-[1.25] truncate">
            {conversation.friendNickname}
          </h3>
          {conversation.lastMessage && (
            <time className="font-['Artifakt_Element',sans-serif] text-[12px] text-[rgba(204,248,255,0.65)] leading-[1.2] tracking-[-0.12px] shrink-0">
              {formatLastMessageTime(conversation.lastMessage.createdAt)}
            </time>
          )}
        </div>

        {/* Last message preview */}
        <div className="w-full flex gap-[6px] items-center">
          <p className="flex-1 font-['Artifakt_Element',sans-serif] text-[12px] text-[rgba(204,248,255,0.65)] leading-[1.2] tracking-[-0.12px] truncate">
            {getLastMessagePreview()}
          </p>
          
          {/* Unread count badge */}
          {conversation.unreadCount > 0 && (
            <div className="bg-[#ff6f95] flex items-center justify-center px-[7px] py-[4px] rounded-[20px] shrink-0">
              <span className="font-['Artifakt_Element',sans-serif] font-bold text-[#00141f] text-[10px] leading-[1.2] tracking-[-0.1px]">
                {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  )
})

ConversationListItem.displayName = 'ConversationListItem'
