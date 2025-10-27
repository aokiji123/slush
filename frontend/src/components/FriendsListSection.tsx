import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useFriends,
  useOnlineFriends,
  useBlockedUsers,
  useFriendRequests,
  useFriendsWhoOwnGame
} from '@/api/queries/useFriendship'
import { FriendCard } from './FriendCard'
import { GameSelector } from './GameSelector'
import type { GameData } from '@/api/types/game'

interface FriendsListSectionProps {
  userId: string
  currentUserId: string
  showAllTab?: boolean
  showOnlineTab?: boolean
  showBlockedTab?: boolean
  showRequestsTab?: boolean
  showShared?: boolean
}

type TabType = 'all' | 'online' | 'blocked' | 'requests'

export const FriendsListSection = ({
  userId,
  currentUserId,
  showAllTab = true,
  showOnlineTab = true,
  showBlockedTab = false,
  showRequestsTab = false,
  showShared = false,
}: FriendsListSectionProps) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [searchValue, setSearchValue] = useState('')
  const [selectedGame, setSelectedGame] = useState<GameData | null>(null)
  const [filterByGame, setFilterByGame] = useState(false)

  // Fetch friends data for all profiles (public)
  const { data: friends, isLoading: isLoadingFriends } = useFriends(userId)
  const { data: onlineFriends, isLoading: isLoadingOnline } = useOnlineFriends(userId)
  
  // Fetch blocked users and requests (only for own profile or when tabs are enabled)
  const { data: blockedUsers, isLoading: isLoadingBlocked } = useBlockedUsers(
    showBlockedTab || showRequestsTab ? userId : ''
  )
  const { incoming, outgoing, isLoading: isLoadingRequests } = useFriendRequests(
    showRequestsTab ? userId : ''
  )

  // Fetch friends who own the selected game
  const { data: friendsWithGame, isLoading: isLoadingFriendsWithGame } = useFriendsWhoOwnGame(
    selectedGame?.id || '',
    {
      enabled: filterByGame && !!selectedGame?.id
    }
  )

  // Get available tabs based on props
  const availableTabs = useMemo(() => {
    const tabs: { key: TabType; label: string; count: number }[] = []
    
    if (showAllTab) {
      tabs.push({ key: 'all', label: t('friends.tabs.all'), count: friends?.length || 0 })
    }
    if (showOnlineTab) {
      tabs.push({ key: 'online', label: t('friends.tabs.online'), count: onlineFriends?.length || 0 })
    }
    if (showBlockedTab) {
      tabs.push({ key: 'blocked', label: t('friends.tabs.blocked'), count: blockedUsers?.length || 0 })
    }
    if (showRequestsTab) {
      tabs.push({ key: 'requests', label: t('friends.tabs.requests'), count: (incoming?.length || 0) + (outgoing?.length || 0) })
    }
    
    return tabs
  }, [friends, onlineFriends, blockedUsers, incoming, outgoing, showAllTab, showOnlineTab, showBlockedTab, showRequestsTab, t])

  // Filter friends by search and game
  const getFilteredFriends = (friendsList: typeof friends) => {
    if (!friendsList) return []

    let filtered = friendsList

    // Apply search filter
    if (searchValue) {
      filtered = filtered.filter((friend) =>
        friend.nickname.toLowerCase().includes(searchValue.toLowerCase())
      )
    }

    // Apply game-based filtering
    if (filterByGame && selectedGame && friendsWithGame) {
      const friendsWithGameIds = new Set(friendsWithGame.map(f => f.userId))
      filtered = filtered.filter(friend => friendsWithGameIds.has(friend.userId))
    }

    return filtered
  }

  // Get data for active tab
  const getTabData = () => {
    switch (activeTab) {
      case 'all':
        return getFilteredFriends(friends)
      case 'online':
        return getFilteredFriends(onlineFriends)
      case 'blocked':
        return blockedUsers || []
      case 'requests':
        return [...(incoming || []), ...(outgoing || [])]
      default:
        return []
    }
  }

  const getTabLoading = () => {
    switch (activeTab) {
      case 'all':
        return isLoadingFriends || (filterByGame && selectedGame ? isLoadingFriendsWithGame : false)
      case 'online':
        return isLoadingOnline || (filterByGame && selectedGame ? isLoadingFriendsWithGame : false)
      case 'blocked':
        return isLoadingBlocked
      case 'requests':
        return isLoadingRequests
      default:
        return false
    }
  }

  const tabData = getTabData()
  const isLoading = getTabLoading()

  // Render loading skeleton
  const renderLoadingSkeleton = () => (
    <div className="flex flex-col gap-[8px]">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex gap-[8px]">
          <div className="flex-1 bg-[var(--color-background-15)] rounded-[12px] p-[16px] animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[16px]">
                <div className="w-[44px] h-[44px] bg-[var(--color-background-16)] rounded-[39px]" />
                <div className="h-[16px] w-[80px] bg-[var(--color-background-16)] rounded" />
              </div>
              <div className="w-[33px] h-[32px] bg-[var(--color-background-16)] rounded" />
            </div>
          </div>
          <div className="flex-1 bg-[var(--color-background-15)] rounded-[12px] p-[16px] animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[16px]">
                <div className="w-[44px] h-[44px] bg-[var(--color-background-16)] rounded-[39px]" />
                <div className="h-[16px] w-[80px] bg-[var(--color-background-16)] rounded" />
              </div>
              <div className="w-[33px] h-[32px] bg-[var(--color-background-16)] rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  // Render empty state
  const renderEmptyState = () => (
    <div className="text-center py-[40px]">
      <div className="text-[var(--color-background-25)] text-[18px] mb-[8px]">
        {activeTab === 'all' ? t('friends.empty.noFriends') : t('friends.empty.noOnlineFriends')}
      </div>
      <div className="text-[var(--color-background-25)] text-[14px] opacity-65">
        {activeTab === 'all' 
          ? t('friends.empty.noFriendsMessage')
          : t('friends.empty.noOnlineFriendsMessage')
        }
      </div>
    </div>
  )



  // Render friends grid
  const renderFriendsGrid = () => {
    if (isLoading) {
      return renderLoadingSkeleton()
    }

    if (!tabData || tabData.length === 0) {
      return renderEmptyState()
    }

    // Render friends in 2-column grid
    const rows: typeof tabData[] = []
    for (let i = 0; i < tabData.length; i += 2) {
      rows.push(tabData.slice(i, i + 2))
    }

    return (
      <div className="flex flex-col gap-[8px]">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-[8px]">
            {row.map((friend) => (
              <div key={friend.userId} className="flex-1">
                <FriendCard
                  id={friend.id}
                  userId={friend.userId}
                  username={friend.nickname}
                  avatar={friend.avatar}
                  level={friend.level}
                  isOnline={friend.isOnline}
                  currentUserId={currentUserId}
                />
              </div>
            ))}
            {/* Add placeholder if odd number */}
            {row.length === 1 && <div className="flex-1" />}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-[var(--color-background-15)] rounded-[20px] p-[20px]">
      {/* Tabs */}
      {availableTabs.length > 1 && (
        <div className="flex gap-[40px] items-center mb-[24px]">
          {availableTabs.map((tab) => (
            <div key={tab.key} className="flex flex-col h-[40px] justify-between">
              <div className="flex gap-[12px] items-end">
                <button
                  onClick={() => setActiveTab(tab.key)}
                  className={`text-[24px] font-bold leading-[1.1] transition-colors ${
                    activeTab === tab.key
                      ? 'text-[var(--color-primary)]'
                      : 'text-[rgba(204,248,255,0.65)]'
                  }`}
                >
                  {tab.label}
                </button>
                <div className="bg-[rgba(55,195,255,0.25)] rounded-[20px] px-[12px] py-[4px]">
                  <span className="text-[14px] font-bold text-[rgba(204,248,255,0.65)] tracking-[-0.14px]">
                    {tab.count}
                  </span>
                </div>
              </div>
              <div className={`h-[3px] rounded-[2px] w-full ${
                activeTab === tab.key ? 'bg-[var(--color-primary)]' : 'bg-transparent'
              }`} />
            </div>
          ))}
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex items-center justify-between mb-[16px]">
        <div className="bg-[rgba(0,20,31,0.4)] border border-[var(--color-secondary)] rounded-[22px] px-[16px] py-[10px] w-[522px]">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={t('friends.search.placeholder')}
            className="w-full bg-transparent text-[var(--color-background)] placeholder:text-[rgba(204,248,255,0.65)] outline-none"
          />
        </div>
        <div className="flex gap-[12px] items-center">
          <label className="flex items-center gap-[8px] cursor-pointer">
            <input
              type="checkbox"
              checked={filterByGame}
              onChange={(e) => setFilterByGame(e.target.checked)}
              className="w-[24px] h-[24px] border border-[var(--color-primary)] rounded-[6px] bg-transparent"
            />
            <span className="text-[16px] font-medium text-[var(--color-background)]">
              {t('friends.search.byGame')}
            </span>
          </label>
          <GameSelector
            selectedGame={selectedGame}
            onSelectGame={setSelectedGame}
          />
        </div>
      </div>

      {/* Shared Friends Section */}
      {showShared && (
        <div className="mb-[16px]">
          <div className="flex gap-[8px] items-start mb-[14px]">
            <div className="flex gap-[8px] items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 14L12 9L17 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-[20px] font-normal text-[var(--color-background)] tracking-[-0.2px]">
              {t('profile.categories.shared')}
            </p>
          </div>

          {/* Shared friends grid */}
          {(() => {
            const sharedFriends = useMemo(() => {
              if (!friends || !currentUserId) return []

              // This is a simplified version - in a real app, you'd fetch current user's friends
              // For now, we'll show a subset of friends as "shared"
              return friends.slice(0, 4) // Mock shared friends
            }, [friends, currentUserId])

            if (sharedFriends.length === 0) return null

            return (
              <div className="flex flex-col gap-[8px] mb-[16px]">
                <div className="flex gap-[8px]">
                  {sharedFriends.map((friend) => (
                    <div key={friend.userId} className="flex-1 max-w-[120px]">
                      <FriendCard
                        id={friend.id}
                        userId={friend.userId}
                        username={friend.nickname}
                        avatar={friend.avatar}
                        level={friend.level}
                        isOnline={friend.isOnline}
                        currentUserId={currentUserId}
                        compact={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* Friends Grid */}
      {renderFriendsGrid()}
    </div>
  )
}


