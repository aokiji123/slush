import { createFileRoute } from '@tanstack/react-router'
import { ProfileTabs, ProfileHeader, ProfileTabToolbar, ProfileDiscussionCard, ProfileFriendsPreview } from '@/components'
import { useUserByNickname, useAuthenticatedUser } from '@/api/queries/useUser'
import { useUserStatistics, useUserPosts } from '@/api/queries/useProfile'
import { useFriendshipStatus } from '@/api/queries/useFriendship'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { PostType } from '@/types/community'

export const Route = createFileRoute('/profile/$nickname/discussions')({
  component: ProfileDiscussionsPage,
})

function ProfileDiscussionsPage() {
  const { nickname } = Route.useParams()
  const { t } = useTranslation('common')
  const [searchText, setSearchText] = useState('')
  const [sortBy] = useState('CreatedAt:desc')

  // Fetch profile user data
  const { data: profileUser, isLoading: isLoadingProfile, error: profileError } = useUserByNickname(nickname)
  
  // Fetch current authenticated user
  const { data: currentUser, isLoading: isLoadingCurrentUser } = useAuthenticatedUser()

  // Determine if this is the user's own profile
  const isOwnProfile = currentUser && profileUser && currentUser.id === profileUser.id

  // Get friendship status (only if not own profile)
  const { data: friendshipStatus = 'none' } = useFriendshipStatus(
    currentUser?.id || '',
    profileUser?.id || ''
  )

  // Fetch profile data
  const { data: statistics } = useUserStatistics(profileUser?.id || '')

  // Fetch user's posts (discussions only)
  const { data: userPosts, isLoading: isLoadingPosts, isError: isPostsError } = useUserPosts(profileUser?.id || '', 'Discussion', sortBy)

  // Create sort options dynamically using translations
  const sortOptions = [
    { label: t('sorting.newest'), value: 'CreatedAt:desc' },
    { label: t('sorting.oldest'), value: 'CreatedAt:asc' },
    { label: t('sorting.popular'), value: 'LikesCount:desc' },
    { label: t('sorting.mostCommented'), value: 'CommentsCount:desc' },
  ]

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
  }

  // Filter posts to only show discussions
  const discussionPosts = userPosts?.filter(post => post.type === PostType.Discussion) || []

  // Client-side search filtering
  const filteredItems = discussionPosts.filter((post) => {
    if (!searchText.trim()) return true
    const searchLower = searchText.toLowerCase()
    return (
      post.title?.toLowerCase().includes(searchLower) ||
      post.content?.toLowerCase().includes(searchLower)
    )
  })

  // Loading state
  if (isLoadingProfile || isLoadingCurrentUser) {
    return (
      <div className="min-h-screen bg-[var(--color-night-background)] flex items-center justify-center">
        <div className="text-[var(--color-background)] text-[18px]">{t('loading')}</div>
      </div>
    )
  }

  // Error state
  if (profileError || !profileUser) {
    return (
      <div className="min-h-screen bg-[var(--color-night-background)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[var(--color-background)] text-[24px] font-bold mb-[8px]">
            {t('profile.userNotFound')}
          </div>
          <div className="text-[var(--color-background-25)] text-[16px]">
            {t('profile.userNotFoundMessage', { nickname })}
          </div>
        </div>
      </div>
    )
  }

  // Prepare profile data
  const profileData = {
    ...profileUser,
    level: statistics?.level || 1,
    stats: {
      badges: statistics?.badgesCount || 0,
      games: statistics?.gamesCount || 0,
      dlc: statistics?.dlcCount || 0,
      wishlist: statistics?.wishlistCount || 0,
      discussions: statistics?.postsCount || 0,
      screenshots: statistics?.screenshotsCount || 0,
      videos: statistics?.videosCount || 0,
      guides: statistics?.guidesCount || 0,
      reviews: statistics?.reviewsCount || 0,
    },
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

      <div className="relative z-10 mx-auto" style={{ 
        paddingLeft: '228px', 
        paddingRight: '228px', 
        paddingTop: '121px', 
        paddingBottom: '100px', 
        maxWidth: '1920px' 
      }}>
        <div style={{ width: '1464px' }}>
          {/* Profile Header */}
          <ProfileHeader
            username={profileUser.nickname}
            bio={profileUser.bio || ''}
            avatar={profileUser.avatar}
            banner={profileUser.banner}
            isOnline={profileUser.isOnline ?? false}
            isOwnProfile={isOwnProfile || false}
            friendshipStatus={isOwnProfile ? 'none' : friendshipStatus}
            onEditProfile={() => {}}
            onAddFriend={() => {}}
            onCancelRequest={() => {}}
            onAcceptRequest={() => {}}
            onRemoveFriend={() => {}}
          />

          <div className="flex gap-[24px]">
            {/* Main Content */}
            <div style={{ width: '1092px' }}>
              {/* Main Container */}
              <div className="bg-[#004252] p-[20px] rounded-[20px] flex flex-col gap-[12px]">
                {/* Toolbar */}
                <ProfileTabToolbar
                  searchText={searchText}
                  onSearchChange={setSearchText}
                  searchPlaceholder={t('profile.searchPlaceholders.discussions')}
                  sortBy={sortBy}
                  onSortChange={handleSortChange}
                  sortOptions={sortOptions}
                  showFilters={false}
                />

                {/* Content */}
                <div className="flex flex-col gap-[8px]">
                {isLoadingPosts ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-[rgba(204,248,255,0.65)] text-lg">{t('common.loading')}</p>
                  </div>
                ) : isPostsError ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-red-400 text-lg">{t('games.errorLoading')}</p>
                  </div>
                ) : !filteredItems.length ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-[rgba(204,248,255,0.65)] text-lg">
                      {searchText ? t('games.noGamesFound') : t('games.noGamesMessage')}
                    </p>
                  </div>
                ) : (
                  filteredItems.map((post) => (
                    <ProfileDiscussionCard
                      key={post.id}
                      post={post}
                    />
                  ))
                )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-[20px]">
              <ProfileTabs
                nickname={profileUser.nickname}
                level={profileData.level}
                stats={profileData.stats}
              />
              <ProfileFriendsPreview
                nickname={profileUser.nickname}
                userId={profileUser.id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
