import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { OptimizedImage } from '../OptimizedImage'
import type { Friend } from '@/types/friendship'

interface FriendListItemProps {
  friend: Friend
  isActive?: boolean
  onClick: (friend: Friend) => void
}

export const FriendListItem = memo<FriendListItemProps>(({
  friend,
  isActive = false,
  onClick,
}) => {
  const { t } = useTranslation('chat')

  const handleClick = useCallback(() => {
    onClick(friend)
  }, [friend, onClick])

  return (
    <button
      onClick={handleClick}
      className={`
        w-full flex gap-[12px] items-center p-0 relative transition-colors
        hover:bg-[rgba(0,20,31,0.1)] rounded-[8px] group
        ${isActive ? 'bg-[rgba(0,20,31,0.2)]' : ''}
      `}
      aria-label={`${t('startConversation')} ${friend.nickname}`}
    >
      {/* Avatar */}
      <div className="relative shrink-0 size-[44px]">
        <OptimizedImage
          src={friend.avatar || '/avatar.png'}
          alt={`${friend.nickname} аватар`}
          className="w-full h-full rounded-[39px] object-cover"
          loading="lazy"
        />
        {/* Online indicator */}
        {friend.isOnline && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#49ffde] rounded-full border-2 border-[#004252]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-[6px] items-start justify-center">
        {/* Header with name and start conversation label */}
        <div className="w-full flex items-center justify-between">
          <h3 className="font-['Artifakt_Element',sans-serif] font-bold text-[#f1fdff] text-[16px] leading-[1.25] truncate">
            {friend.nickname}
          </h3>
          <span className="font-['Artifakt_Element',sans-serif] text-[12px] text-[rgba(204,248,255,0.5)] leading-[1.2] tracking-[-0.12px] shrink-0">
            {t('startConversation')}
          </span>
        </div>

        {/* Online/offline status */}
        <p className="font-['Artifakt_Element',sans-serif] text-[12px] text-[rgba(204,248,255,0.65)] leading-[1.2] tracking-[-0.12px] truncate">
          {friend.isOnline ? t('onlineStatus') : t('offlineStatus')}
        </p>
      </div>
    </button>
  )
})

FriendListItem.displayName = 'FriendListItem'

