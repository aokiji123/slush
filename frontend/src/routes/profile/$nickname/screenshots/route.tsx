import { createFileRoute } from '@tanstack/react-router'
import {
  ProfileTabs,
  ProfileHeader,
  ProfileTabToolbar,
  ProfileMediaCard,
  ProfileFriendsPreview,
} from '@/components'
import { useUserByNickname, useAuthenticatedUser } from '@/api/queries/useUser'
import { useUserStatistics, useUserPosts } from '@/api/queries/useProfile'
import { useFriendshipStatus } from '@/api/queries/useFriendship'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { PostType } from '@/types/community'

export const Route = createFileRoute('/profile/$nickname/screenshots')({
  component: ProfileScreenshotsPage,
})

function ProfileScreenshotsPage() {
  const { nickname } = Route.useParams()
  const { t } = useTranslation('common')
  const [searchText, setSearchText] = useState('')
  const [sortBy, setSortBy] = useState('CreatedAt:desc')
  const {
    data: profileUser,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useUserByNickname(nickname)

  const { data: currentUser, isLoading: isLoadingCurrentUser } =
    useAuthenticatedUser()

  const isOwnProfile =
    currentUser && profileUser && currentUser.id === profileUser.id

  const { data: friendshipStatus = 'none' } = useFriendshipStatus(
    currentUser?.id || '',
    profileUser?.id || '',
  )

  const { data: statistics } = useUserStatistics(profileUser?.id || '')

  const {
    data: userPosts,
    isLoading: isLoadingPosts,
    isError: isPostsError,
  } = useUserPosts(profileUser?.id || '', 'Screenshot', sortBy)

  const sortOptions = [
    { label: t('sorting.newest'), value: 'CreatedAt:desc' },
    { label: t('sorting.oldest'), value: 'CreatedAt:asc' },
    { label: t('sorting.popular'), value: 'LikesCount:desc' },
    { label: t('sorting.mostCommented'), value: 'CommentsCount:desc' },
  ]

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
  }

  const screenshotPosts =
    userPosts?.filter((post) => post.type === PostType.Screenshot) || []

  const filteredItems = screenshotPosts.filter((post) => {
    if (!searchText.trim()) return true
    const searchLower = searchText.toLowerCase()
    return (
      post.title.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower)
    )
  })

  if (isLoadingProfile || isLoadingCurrentUser) {
    return (
      <div className="min-h-screen bg-[var(--color-night-background)] flex items-center justify-center">
        <div className="text-[var(--color-background)] text-[18px]">
          {t('loading')}
        </div>
      </div>
    )
  }

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
      <div className="absolute w-[497px] h-[459px] left-[-131px] top-[14px] pointer-events-none opacity-30">
        <div className="absolute inset-[-130.72%_-120.72%]">
          <svg
            viewBox="0 0 1600 1600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="800"
              cy="800"
              r="600"
              fill="url(#gradient1)"
              opacity="0.3"
            />
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
          <svg
            viewBox="0 0 1600 1600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="800"
              cy="800"
              r="600"
              fill="url(#gradient2)"
              opacity="0.3"
            />
            <defs>
              <radialGradient id="gradient2">
                <stop offset="0%" stopColor="#24E5C2" />
                <stop offset="100%" stopColor="#24E5C2" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="relative z-10 mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 2xl:px-[228px] pt-8 sm:pt-16 md:pt-24 lg:pt-[121px] pb-8 sm:pb-16 md:pb-20 lg:pb-[100px] max-w-[1920px]">
        <div className="w-full max-w-[1464px]">
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

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-[24px]">
            <div className="w-full lg:w-[calc(75%-12px)] xl:w-[1092px]">
              <div className="bg-[#004252] p-3 sm:p-4 lg:p-[20px] rounded-[20px] flex flex-col gap-3 sm:gap-[12px]">
                <ProfileTabToolbar
                  searchText={searchText}
                  onSearchChange={setSearchText}
                  searchPlaceholder={t(
                    'profile.searchPlaceholders.screenshots',
                  )}
                  sortBy={sortBy}
                  onSortChange={handleSortChange}
                  sortOptions={sortOptions}
                  showFilters={false}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-[8px]">
                  {isLoadingPosts ? (
                    <div className="col-span-full flex items-center justify-center py-8">
                      <p className="text-[rgba(204,248,255,0.65)] text-lg">
                        {t('common.loading')}
                      </p>
                    </div>
                  ) : isPostsError ? (
                    <div className="col-span-full flex items-center justify-center py-8">
                      <p className="text-red-400 text-lg">
                        {t('games.errorLoading')}
                      </p>
                    </div>
                  ) : !filteredItems.length ? (
                    <div className="col-span-full flex items-center justify-center py-8">
                      <p className="text-[rgba(204,248,255,0.65)] text-lg">
                        {searchText
                          ? t('games.noGamesFound')
                          : t('games.noGamesMessage')}
                      </p>
                    </div>
                  ) : (
                    filteredItems.map((post) => (
                      <ProfileMediaCard key={post.id} post={post} />
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[calc(25%-12px)] xl:w-[348px] flex flex-col gap-4 sm:gap-5 lg:gap-[20px]">
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
