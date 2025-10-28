import { memo } from 'react'
import type { ChatConversationDto } from '@/api/types/chat'

interface ChatHeaderProps {
  conversation: ChatConversationDto | null
  isOnline: boolean
  onToggleProfile: () => void
}

export const ChatHeader = memo<ChatHeaderProps>(({
  conversation,
  isOnline,
  onToggleProfile
}) => {
  if (!conversation) return null

  return (
    <div className="bg-[#00141f] border-b border-[#046075] px-[16px] py-[12px] flex items-center justify-between">
      {/* Left: Avatar + Info */}
      <div className="flex items-center gap-[12px] flex-1 min-w-0">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-[44px] h-[44px] rounded-full overflow-hidden bg-gradient-to-br from-[#37C3FF] to-[#24E5C2]">
            {conversation.friendAvatar ? (
              <img
                src={conversation.friendAvatar}
                alt={conversation.friendNickname}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[20px] font-bold text-[#00141f]">
                  {conversation.friendNickname.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          {/* Online Status Indicator */}
          <div className={`absolute bottom-0 right-0 w-[12px] h-[12px] rounded-full border-2 border-[#00141f] ${
            isOnline ? 'bg-[#ff6f95]' : 'bg-[#046075]'
          }`} />
        </div>

        {/* Name + Status */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[#f1fdff] text-[16px] font-bold font-['Manrope'] truncate">
            {conversation.friendNickname}
          </h3>
          <p className={`text-[14px] font-['Artifakt_Element'] ${
            isOnline ? 'text-[#ff6f95]' : 'text-[rgba(204,248,255,0.65)]'
          }`}>
            {isOnline ? 'онлайн' : 'офлайн'}
          </p>
        </div>
      </div>

      {/* Right: Info Button */}
      <button
        onClick={onToggleProfile}
        className="xl:hidden w-[40px] h-[40px] flex items-center justify-center rounded-full hover:bg-[rgba(4,96,117,0.3)] transition-colors"
        aria-label="View profile"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
            stroke="#f1fdff"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M2 20C2 17.7909 3.79086 16 6 16H18C20.2091 16 22 17.7909 22 20"
            stroke="#f1fdff"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </button>
    </div>
  )
})

ChatHeader.displayName = 'ChatHeader'

