import { memo, useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ConversationListItem } from './ConversationListItem'
import { EmptyState } from '../EmptyState'
import { ErrorState } from '../ErrorState'
import { useConversations } from '@/api/queries/useChat'
import { useFriends } from '@/api/queries/useFriendship'
import { useAuthenticatedUser } from '@/api/queries/useUser'
import type { ChatConversationDto } from '@/api/types/chat'

interface ConversationListProps {
  selectedConversationId?: string
  onConversationSelect: (conversation: ChatConversationDto) => void
  onFriendSelect?: (conversation: ChatConversationDto) => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

export const ConversationList = memo<ConversationListProps>(({
  selectedConversationId,
  onConversationSelect,
  onFriendSelect,
  searchQuery = '',
  onSearchChange,
}) => {
  const { t } = useTranslation('chat')
  const [page] = useState(1)
  const pageSize = 20

  // Get authenticated user
  const { data: authenticatedUser } = useAuthenticatedUser()

  const {
    data: conversations = [],
    isLoading: isLoadingConversations,
    error: conversationsError,
    refetch,
  } = useConversations(page, pageSize)

  // Get all friends
  const {
    data: friends = [],
    isLoading: isLoadingFriends,
    error: friendsError,
  } = useFriends(authenticatedUser?.id || '')

  const isLoading = isLoadingConversations || isLoadingFriends
  const error = conversationsError || friendsError

  // Merge friends and conversations into unified conversation-like objects
  const mergedConversations = useMemo(() => {
    const conversationMap = new Map<string, ChatConversationDto>()
    
    // Add existing conversations
    conversations.forEach(conv => {
      conversationMap.set(conv.friendId, conv)
    })

    // Add friends without conversations as conversation-like objects
    friends.forEach(friend => {
      if (!conversationMap.has(friend.userId) && !conversationMap.has(friend.id)) {
        const friendId = friend.userId
        const mockConversation: ChatConversationDto = {
          friendId: friendId,
          friendNickname: friend.nickname,
          friendAvatar: friend.avatar,
          friendIsOnline: friend.isOnline,
          unreadCount: 0,
          lastActivityAt: friend.lastSeenAt || new Date().toISOString(),
          lastMessage: undefined, // No messages yet
        }
        conversationMap.set(friendId, mockConversation)
      }
    })

    return Array.from(conversationMap.values())
  }, [conversations, friends])

  // Filter merged conversations based on search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return mergedConversations

    const queryLower = searchQuery.toLowerCase()
    return mergedConversations.filter(conversation =>
      conversation.friendNickname.toLowerCase().includes(queryLower) ||
      conversation.lastMessage?.content?.toLowerCase().includes(queryLower)
    )
  }, [mergedConversations, searchQuery])

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
              {filteredConversations.map((conversation) => {
              // Check if this conversation has messages (lastMessage is defined)
              const hasMessages = !!conversation.lastMessage
              
              return (
                <ConversationListItem
                  key={conversation.friendId}
                  conversation={conversation}
                  isActive={selectedConversationId === conversation.friendId}
                  onClick={hasMessages ? handleConversationClick : () => {
                    if (onFriendSelect) {
                      onFriendSelect(conversation)
                    } else {
                      handleConversationClick(conversation)
                    }
                  }}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
})

ConversationList.displayName = 'ConversationList'
