import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuthenticatedUser } from '@/api/queries/useUser'
import {
  useFriends,
  useOnlineFriends,
  useBlockedUsers,
  useFriendRequests,
} from '@/api/queries/useFriendship'
import { FriendCard } from '@/components/FriendCard'
import { FriendActivityCard } from '@/components/FriendActivityCard'
import { AddFriendModal } from '@/components/AddFriendModal'
import { IncomingRequestCard } from '@/components/IncomingRequestCard'
import { OutgoingRequestCard } from '@/components/OutgoingRequestCard'
import { BlockedUserCard } from '@/components/BlockedUserCard'
import { GameSelector } from '@/components/GameSelector'
import { BackArrowIcon } from '@/icons'
import { mockActivities } from '../../../data/mockActivities'
import type { GameData } from '@/api/types/game'

export const Route = createFileRoute('/friends/all')({
  component: FriendsAllPage,
})

type TabType = 'all' | 'online' | 'blocked' | 'requests'

function FriendsAllPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [searchValue, setSearchValue] = useState('')
  const [selectedGame, setSelectedGame] = useState<GameData | null>(null)
  const [showAddFriendModal, setShowAddFriendModal] = useState(false)

  // Get current user
  const { data: currentUser } = useAuthenticatedUser()

  // Fetch friends data
  const { data: friends, isLoading: isLoadingFriends } = useFriends(currentUser?.id ?? '')
  const { data: onlineFriends, isLoading: isLoadingOnline } = useOnlineFriends(currentUser?.id ?? '')
  const { data: blockedUsers, isLoading: isLoadingBlocked } = useBlockedUsers(currentUser?.id ?? '')
  const friendRequests = useFriendRequests(currentUser?.id ?? '')

  const todayActivities = mockActivities.filter((a) => a.date === 'today')
  const olderActivities = mockActivities.filter((a) => a.date !== 'today')

  // Filter friends by search
  // Note: Game-based filtering would require fetching each friend's library
  // For optimal performance, this should be done on the backend
  // For now, we'll only implement nickname search filtering
  const getFilteredFriends = (friendsList: typeof friends) => {
    if (!friendsList) return []
    
    let filtered = friendsList

    // Apply search filter
    if (searchValue) {
      filtered = filtered.filter((friend) =>
        friend.nickname.toLowerCase().includes(searchValue.toLowerCase())
      )
    }

    // TODO: Implement game-based filtering
    // This requires backend support or optimized frontend caching
    // to avoid making N API calls for N friends

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
        return getFilteredFriends(blockedUsers)
      case 'requests':
        return []
      default:
        return []
    }
  }

  const getTabLoading = () => {
    switch (activeTab) {
      case 'all':
        return isLoadingFriends
      case 'online':
        return isLoadingOnline
      case 'blocked':
        return isLoadingBlocked
      case 'requests':
        return friendRequests.isLoading
      default:
        return false
    }
  }

  const tabs = [
    { id: 'all' as TabType, label: 'Усі друзі', count: friends?.length ?? 0 },
    { id: 'online' as TabType, label: 'Онлайн', count: onlineFriends?.length ?? 0 },
    { id: 'blocked' as TabType, label: 'Заблоковані', count: blockedUsers?.length ?? 0 },
    {
      id: 'requests' as TabType,
      label: 'Поточні запити',
      count: (friendRequests.incoming?.length ?? 0) + (friendRequests.outgoing?.length ?? 0),
    },
  ]

  const tabData = getTabData()
  const isLoading = getTabLoading()

  // Render empty state
  const renderEmptyState = () => {
    const messages = {
      all: 'Додайте друзів, щоб побачити їх тут',
      online: 'Зараз немає друзів онлайн',
      blocked: 'Ви не заблокували жодного користувача',
      requests: 'Немає активних запитів на дружбу',
    }

    return (
      <div className="flex items-center justify-center py-[80px]">
        <p className="text-[18px] text-[var(--color-background-25)] opacity-65">
          {messages[activeTab]}
        </p>
      </div>
    )
  }

  // Render loading skeleton
  const renderLoadingSkeleton = () => {
    return (
      <div className="flex flex-col gap-[8px]">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-[var(--color-background-15)] rounded-[12px] p-[16px] h-[76px] animate-pulse"
          />
        ))}
      </div>
    )
  }

  // Render friends grid
  const renderFriendsGrid = () => {
    if (isLoading) {
      return renderLoadingSkeleton()
    }

    if (activeTab === 'requests') {
      const hasIncoming = friendRequests.incoming && friendRequests.incoming.length > 0
      const hasOutgoing = friendRequests.outgoing && friendRequests.outgoing.length > 0

      if (!hasIncoming && !hasOutgoing) {
        return renderEmptyState()
      }

      return (
        <div className="flex flex-col gap-[24px]">
          {/* Incoming Requests */}
          {hasIncoming && (
            <div>
              <h3 className="font-manrope font-bold text-[20px] text-[var(--color-background)] leading-[1.2] mb-[16px]">
                Вхідні запити
              </h3>
              <div className="flex flex-col gap-[8px]">
                {friendRequests.incoming.map((request) => (
                  <IncomingRequestCard
                    key={request.userId}
                    {...request}
                    currentUserId={currentUser?.id ?? ''}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Outgoing Requests */}
          {hasOutgoing && (
            <div>
              <h3 className="font-manrope font-bold text-[20px] text-[var(--color-background)] leading-[1.2] mb-[16px]">
                Вихідні запити
              </h3>
              <div className="flex flex-col gap-[8px]">
                {friendRequests.outgoing.map((request) => (
                  <OutgoingRequestCard
                    key={request.userId}
                    {...request}
                    currentUserId={currentUser?.id ?? ''}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )
    }

    if (!tabData || tabData.length === 0) {
      return renderEmptyState()
    }

    // Render blocked users differently
    if (activeTab === 'blocked') {
      return (
        <div className="flex flex-col gap-[8px]">
          {tabData.map((user) => (
            <BlockedUserCard key={user.userId} {...user} />
          ))}
        </div>
      )
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
                  currentUserId={currentUser?.id ?? ''}
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
    <div className="min-h-screen bg-[var(--color-night-background)] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute w-[497px] h-[459px] left-[-131px] top-[14px] pointer-events-none opacity-30">
        <div className="absolute inset-[-130.72%_-120.72%]">
          <svg viewBox="0 0 1600 1600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="800" cy="800" r="600" fill="url(#gradient1)" opacity="0.3" />
            <defs>
              <radialGradient id="gradient1">
                <stop offset="0%" stopColor="#24E5C2" />
                <stop offset="100%" stopColor="#24E5C2" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
      
      <div className="absolute w-[497px] h-[459px] right-[-136px] top-[829px] pointer-events-none opacity-30">
        <div className="absolute inset-[-130.72%_-120.72%]">
          <svg viewBox="0 0 1600 1600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="800" cy="800" r="600" fill="url(#gradient2)" opacity="0.3" />
            <defs>
              <radialGradient id="gradient2">
                <stop offset="0%" stopColor="#24E5C2" />
                <stop offset="100%" stopColor="#24E5C2" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="relative z-10 mx-auto" style={{ paddingLeft: '228px', paddingRight: '228px', paddingTop: '121px', paddingBottom: '100px', maxWidth: '1920px' }}>
        <div style={{ width: '1464px' }}>
          {/* Header with tabs and button - spans full width */}
          <div className="flex items-center justify-between mb-[40px]">
            <div className="flex items-start gap-[24px]">
              <div className="flex items-start gap-[16px]">
                <button className="flex items-center justify-center overflow-clip p-[2px] cursor-pointer">
                  <BackArrowIcon className="w-[24px] h-[24px] text-[var(--color-background)]" />
                </button>
                <div className="flex items-center gap-[40px]">
                  {tabs.map((tab) => (
                    <div
                      key={tab.id}
                      className="flex flex-col h-[40px] justify-between cursor-pointer"
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <div className="flex items-end gap-[12px]">
                        <p
                          className={`font-manrope font-bold text-[24px] leading-[1.1] ${
                            activeTab === tab.id
                              ? 'text-[var(--color-background-21)]'
                              : 'text-[var(--color-background-25)] opacity-65'
                          }`}
                        >
                          {tab.label}
                        </p>
                        <div
                          className={`rounded-[20px] px-[12px] py-[4px] flex items-center justify-center ${
                            tab.id === 'requests'
                              ? 'bg-[var(--color-background-10)]'
                              : 'bg-[var(--color-background-18)]'
                          }`}
                        >
                          <p
                            className={`font-bold text-[14px] leading-[1.15] tracking-[-0.14px] ${
                              tab.id === 'requests'
                                ? 'text-[var(--color-night-background)]'
                                : 'text-[var(--color-background-25)] opacity-65'
                            }`}
                          >
                            {tab.count}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`h-[3px] rounded-[2px] w-full ${
                          activeTab === tab.id
                            ? 'bg-[var(--color-background-21)]'
                            : 'opacity-0'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAddFriendModal(true)}
              className="bg-[var(--color-background-21)] rounded-[20px] px-[26px] py-[12px] flex items-center justify-center gap-[12px] cursor-pointer hover:bg-[var(--color-background-23)] transition-colors w-[348px]"
            >
              <p className="text-[20px] text-[var(--color-night-background)] leading-[1.2] font-medium">
                Додати друга
              </p>
            </button>
          </div>

          {/* Main content - Friends List and Activity Feed side by side */}
          <div className="flex gap-[24px]">
            {/* Left Section - Friends List */}
            <div style={{ width: '1092px' }}>
              {/* Search Section */}
              <div className="bg-[var(--color-background-8)] rounded-[20px] p-[20px]">
                <div className="flex flex-col gap-[16px]">
                  {/* Only show search for all, online, and blocked tabs */}
                  {activeTab !== 'requests' && (
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        placeholder="Пошук за нікнеймом..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="bg-[var(--color-night-background)] bg-opacity-40 border border-[var(--color-background-16)] rounded-[22px] px-[16px] py-[10px] text-[16px] text-[var(--color-background)] placeholder:text-[var(--color-background-25)] placeholder:opacity-65 leading-[1.25] tracking-[-0.16px] outline-none"
                        style={{ width: '522px' }}
                      />
                      <GameSelector
                        selectedGame={selectedGame}
                        onSelectGame={setSelectedGame}
                      />
                    </div>
                  )}

                  {/* Friends Grid */}
                  {renderFriendsGrid()}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Activity Feed */}
            <div style={{ width: '348px' }} className="flex-shrink-0">
              <div 
                className="bg-[var(--color-background-8)] rounded-[20px] p-[16px] flex flex-col gap-[20px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" 
                style={{ height: '855px' }}
              >
                <p className="font-manrope font-bold text-[20px] text-[var(--color-background)] leading-[1.2]">
                  Активність друзів
                </p>

                {/* Today Section */}
                <div className="flex items-center justify-center gap-[16px]">
                  <div className="flex-1 h-[1px] bg-[var(--color-background-16)]" />
                  <p className="text-[14px] text-[var(--color-background-25)] opacity-65 leading-[1.15] tracking-[-0.14px] whitespace-nowrap">
                    Сьогодні
                  </p>
                  <div className="flex-1 h-[1px] bg-[var(--color-background-16)]" />
                </div>

                <div className="flex flex-col gap-[8px]">
                  {todayActivities.map((activity) => (
                    <FriendActivityCard key={activity.id} {...activity} />
                  ))}
                </div>

                {/* Older Section */}
                {olderActivities.length > 0 && (
                  <>
                    <div className="flex items-center justify-center gap-[16px]">
                      <div className="flex-1 h-[1px] bg-[var(--color-background-16)]" />
                      <p className="text-[14px] text-[var(--color-background-25)] opacity-65 leading-[1.15] tracking-[-0.14px] whitespace-nowrap">
                        23 квітня
                      </p>
                      <div className="flex-1 h-[1px] bg-[var(--color-background-16)]" />
                    </div>

                    <div className="flex flex-col gap-[8px]">
                      {olderActivities.map((activity) => (
                        <FriendActivityCard key={activity.id} {...activity} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Friend Modal */}
      <AddFriendModal
        isOpen={showAddFriendModal}
        onClose={() => setShowAddFriendModal(false)}
      />
    </div>
  )
}
