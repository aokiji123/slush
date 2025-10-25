import { memo, useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ConversationListItem } from './ConversationListItem'
import { EmptyState } from '../EmptyState'
import { ErrorState } from '../ErrorState'
import { useConversations } from '@/api/queries/useChat'
import type { ChatConversationDto } from '@/api/types/chat'

interface ConversationListProps {
  selectedConversationId?: string
  onConversationSelect: (conversation: ChatConversationDto) => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

export const ConversationList = memo<ConversationListProps>(({
  selectedConversationId,
  onConversationSelect,
  searchQuery = '',
  onSearchChange,
}) => {
  const { t } = useTranslation('chat')
  const [page] = useState(1)
  const pageSize = 20

  const {
    data: conversations = [],
    isLoading,
    error,
    refetch,
  } = useConversations(page, pageSize)

  // Filter conversations based on search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations

    return conversations.filter(conversation =>
      conversation.friendNickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage?.content?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [conversations, searchQuery])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value)
  }, [onSearchChange])

  const handleConversationClick = useCallback((conversation: ChatConversationDto) => {
    onConversationSelect(conversation)
  }, [onConversationSelect])

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        {/* Search input skeleton */}
        <div className="bg-[rgba(0,20,31,0.4)] border border-[#046075] rounded-[22px] h-[44px] mb-[20px] animate-pulse" />
        
        {/* Conversation list skeleton */}
        <div className="flex-1 space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex gap-[12px] items-center">
              <div className="w-[44px] h-[44px] bg-[rgba(204,248,255,0.1)] rounded-[39px] animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[rgba(204,248,255,0.1)] rounded animate-pulse" />
                <div className="h-3 bg-[rgba(204,248,255,0.1)] rounded w-3/4 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex flex-col">
        {/* Search input */}
        <div className="bg-[rgba(0,20,31,0.4)] border border-[#046075] rounded-[22px] h-[44px] mb-[20px] flex items-center px-[16px]">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-1 bg-transparent text-[#f1fdff] placeholder-[rgba(204,248,255,0.65)] text-[16px] outline-none"
          />
        </div>
        
        {/* Error state */}
        <div className="flex-1 flex items-center justify-center">
          <ErrorState
            title={t('errorTitle')}
            message={t('errorMessage')}
            onRetry={() => refetch()}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search input */}
      <div className="bg-[rgba(0,20,31,0.4)] border border-[#046075] rounded-[22px] h-[44px] mb-[20px] flex items-center px-[16px]">
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={handleSearchChange}
          className="flex-1 bg-transparent text-[#f1fdff] placeholder-[rgba(204,248,255,0.65)] text-[16px] outline-none"
          aria-label={t('searchPlaceholder')}
        />
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <EmptyState
              title={searchQuery ? t('noSearchResults') : t('noConversations')}
              message={searchQuery ? t('noSearchResultsMessage') : t('noConversationsMessage')}
            />
          </div>
        ) : (
          <div className="space-y-[20px]">
            {filteredConversations.map((conversation) => (
              <ConversationListItem
                key={conversation.friendId}
                conversation={conversation}
                isActive={selectedConversationId === conversation.friendId}
                onClick={handleConversationClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
})

ConversationList.displayName = 'ConversationList'
