import { memo, useState } from 'react'
import type { ChatConversationDto } from '@/api/types/chat'

interface ChatProfileSidebarProps {
  conversation: ChatConversationDto | null
  isOnline: boolean
}

export const ChatProfileSidebar = memo<ChatProfileSidebarProps>(({
  conversation,
  isOnline
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [activeTab, setActiveTab] = useState<'photos' | 'files' | 'voice'>('photos')

  const handleRemoveFriend = () => {
    // TODO: Implement remove friend functionality
    console.log('Remove friend:', conversation?.friendId)
  }

  const handleClearHistory = () => {
    // TODO: Implement clear history functionality
    console.log('Clear history:', conversation?.friendId)
  }

  const handleBlockUser = () => {
    // TODO: Implement block user functionality
    console.log('Block user:', conversation?.friendId)
  }

  const handleReportUser = () => {
    // TODO: Implement report user functionality
    console.log('Report user:', conversation?.friendId)
  }

  if (!conversation) {
    return null
  }

  return (
    <div className="w-[348px] bg-[#004252] rounded-[20px] flex flex-col overflow-hidden">
      {/* Profile Header */}
      <div className="relative h-[308px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: conversation.friendAvatar 
              ? `url(${conversation.friendAvatar})` 
              : 'linear-gradient(135deg, #37C3FF 0%, #24E5C2 100%)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(0,20,31,0.9)]" />
        
        <div className="absolute bottom-0 left-0 right-0 p-[20px]">
          <h3 className="text-[#f1fdff] text-[20px] font-bold font-['Manrope'] mb-1">
            {conversation.friendNickname}
          </h3>
          <p className={`text-[16px] font-['Artifakt_Element'] ${
            isOnline ? 'text-[#ff6f95]' : 'text-[rgba(204,248,255,0.65)]'
          }`}>
            {isOnline ? 'онлайн' : 'офлайн'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-[20px] pb-[24px] px-[20px] space-y-[20px]">
        {/* Notifications Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[12px]">
            <div className="w-[24px] h-[24px] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1.5C6.067 1.5 4.5 3.067 4.5 5V7.5L3 9V10H13V9L11.5 7.5V5C11.5 3.067 9.933 1.5 8 1.5Z"
                  fill="#f1fdff"
                />
                <path
                  d="M6 12H10C10 13.1046 9.10457 14 8 14C6.89543 14 6 13.1046 6 12Z"
                  fill="#f1fdff"
                />
              </svg>
            </div>
            <span className="text-[#f1fdff] text-[16px] font-['Artifakt_Element']">
              Сповіщення
            </span>
          </div>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`relative w-[36px] h-[20px] rounded-[20px] border border-[#046075] transition-colors ${
              notificationsEnabled 
                ? 'bg-transparent' 
                : 'bg-[rgba(0,20,31,0.4)]'
            }`}
          >
            <div className={`absolute top-[3px] w-[14px] h-[14px] rounded-[20px] transition-all ${
              notificationsEnabled 
                ? 'right-[3px] bg-[#ff6f95]' 
                : 'left-[3px] bg-[#046075]'
            }`} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#046075]" />

        {/* Media Tabs */}
        <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
          <div className={`box-border content-stretch flex items-center justify-between px-[20px] py-[8px] relative rounded-[12px] shrink-0 w-full ${
            activeTab === 'photos' ? 'bg-[rgba(55,195,255,0.25)]' : ''
          }`}>
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
              <div className="overflow-clip relative shrink-0 size-[24px]">
                <div className="absolute inset-[8.33%_7.92%_8.33%_8.33%]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M2 4C2 2.89543 2.89543 2 4 2H12C13.1046 2 14 2.89543 14 4V12C14 13.1046 13.1046 14 12 14H4C2.89543 14 2 13.1046 2 12V4Z"
                      stroke="#f1fdff"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <path
                      d="M6 6.5C6.27614 6.5 6.5 6.27614 6.5 6C6.5 5.72386 6.27614 5.5 6 5.5C5.72386 5.5 5.5 5.72386 5.5 6C5.5 6.27614 5.72386 6.5 6 6.5Z"
                      fill="#f1fdff"
                    />
                    <path
                      d="M2 10L4.5 7.5L7 10L10 7L14 11"
                      stroke="#f1fdff"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
              <p className="font-['Artifakt_Element:Bold',sans-serif] leading-[1.25] not-italic relative shrink-0 text-[#f1fdff] text-[16px]">
                Фото
              </p>
            </div>
            <div className="bg-[rgba(55,195,255,0.25)] box-border content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[4px] relative rounded-[20px] shrink-0">
              <p className="font-['Artifakt_Element:Bold',sans-serif] leading-[1.15] not-italic relative shrink-0 text-[14px] text-[rgba(204,248,255,0.65)] tracking-[-0.14px]">
                100
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('files')}
            className={`w-full flex items-center justify-between px-[20px] py-[8px] rounded-[12px] transition-colors ${
              activeTab === 'files' ? 'bg-[rgba(55,195,255,0.25)]' : 'hover:bg-[rgba(55,195,255,0.1)]'
            }`}
          >
            <div className="flex items-center gap-[12px]">
              <div className="w-[24px] h-[24px] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 4C3 2.89543 3.89543 2 5 2H8.5L13 6.5V12C13 13.1046 12.1046 14 11 14H5C3.89543 14 3 13.1046 3 12V4Z"
                    stroke="#f1fdff"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    d="M8 2V6.5H12.5"
                    stroke="#f1fdff"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              </div>
              <span className="text-[#f1fdff] text-[16px] font-['Artifakt_Element'] font-bold">
                Файли
              </span>
            </div>
            <div className="bg-[rgba(55,195,255,0.25)] px-[12px] py-[4px] rounded-[20px]">
              <span className="text-[rgba(204,248,255,0.65)] text-[14px] font-['Artifakt_Element'] font-bold">
                100
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('voice')}
            className={`w-full flex items-center justify-between px-[20px] py-[8px] rounded-[12px] transition-colors ${
              activeTab === 'voice' ? 'bg-[rgba(55,195,255,0.25)]' : 'hover:bg-[rgba(55,195,255,0.1)]'
            }`}
          >
            <div className="flex items-center gap-[12px]">
              <div className="w-[24px] h-[24px] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 1C6.34315 1 5 2.34315 5 4V8C5 9.65685 6.34315 11 8 11C9.65685 11 11 9.65685 11 8V4C11 2.34315 9.65685 1 8 1Z"
                    stroke="#f1fdff"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    d="M3 7V8C3 10.7614 5.23858 13 8 13C10.7614 13 13 10.7614 13 8V7"
                    stroke="#f1fdff"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    d="M8 13V15M6 15H10"
                    stroke="#f1fdff"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              </div>
              <span className="text-[#f1fdff] text-[16px] font-['Artifakt_Element'] font-bold">
                Голосові повідомлення
              </span>
            </div>
            <div className="bg-[rgba(55,195,255,0.25)] px-[12px] py-[4px] rounded-[20px]">
              <span className="text-[rgba(204,248,255,0.65)] text-[14px] font-['Artifakt_Element'] font-bold">
                100
              </span>
            </div>
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#046075]" />

        {/* Action Buttons */}
        <div className="space-y-[20px]">
          <button
            onClick={handleRemoveFriend}
            className="w-full flex items-center gap-[8px] text-[#f1fdff] text-[16px] font-['Artifakt_Element'] font-medium hover:text-[#ff6f95] transition-colors"
          >
            <div className="w-[24px] h-[24px] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M5 8H11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>
            Видалити с друзів
          </button>

          <button
            onClick={handleClearHistory}
            className="w-full flex items-center gap-[8px] text-[#f1fdff] text-[16px] font-['Artifakt_Element'] font-medium hover:text-[#ff6f95] transition-colors"
          >
            <div className="w-[24px] h-[24px] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 4H14M5.33333 4V2.66667C5.33333 2.29848 5.63181 2 6 2H10C10.3682 2 10.6667 2.29848 10.6667 2.66667V4M6.66667 7.33333V11.3333M9.33333 7.33333V11.3333"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>
            Очистити історію
          </button>

          <button
            onClick={handleBlockUser}
            className="w-full flex items-center gap-[8px] text-[#f1fdff] text-[16px] font-['Artifakt_Element'] font-medium hover:text-[#ff6f95] transition-colors"
          >
            <div className="w-[24px] h-[24px] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M5 5L11 11M11 5L5 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>
            Заблокувати
          </button>

          <button
            onClick={handleReportUser}
            className="w-full flex items-center gap-[8px] text-[#ffa599] text-[16px] font-['Artifakt_Element'] font-medium hover:text-[#ff6f95] transition-colors"
          >
            <div className="w-[24px] h-[24px] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1L9.5 5.5H14L10.5 8.5L12 13L8 10L4 13L5.5 8.5L2 5.5H6.5L8 1Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>
            Поскаржитись
          </button>
        </div>
      </div>
    </div>
  )
})

ChatProfileSidebar.displayName = 'ChatProfileSidebar'
