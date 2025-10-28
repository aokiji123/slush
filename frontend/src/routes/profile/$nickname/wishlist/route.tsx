import { createFileRoute } from '@tanstack/react-router'
import {
  ProfileTabs,
  ProfileHeader,
  ProfileTabToolbar,
  ProfileGameCard,
  ProfileFriendsPreview,
} from '@/components'
import { useUserByNickname, useAuthenticatedUser } from '@/api/queries/useUser'
import { useUserStatistics } from '@/api/queries/useProfile'
import {
  useWishlistQuery,
  useRemoveFromWishlist,
} from '@/api/queries/useWishlist'
import { useToastStore } from '@/lib/toast-store'
import { useCartStore } from '@/lib/cartStore'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useProfileActions } from '@/hooks'
import type { WishlistQueryParams } from '@/api/types/wishlist'

export const Route = createFileRoute('/profile/$nickname/wishlist')({
  component: ProfileWishlistPage,
})

function ProfileWishlistPage() {
  const { nickname } = Route.useParams()
  const { t } = useTranslation('common')
  const [searchText, setSearchText] = useState('')
  const [sortBy, setSortBy] = useState('AddedAtUtc:desc')
  const [filters, setFilters] = useState<WishlistQueryParams>({
    page: 1,
    limit: 20,
  })

  const { success: showSuccess, error: showError } = useToastStore()
  const { addToCart } = useCartStore()
  const removeFromWishlistMutation = useRemoveFromWishlist()

  const {
    data: profileUser,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useUserByNickname(nickname)

  const { data: currentUser, isLoading: isLoadingCurrentUser } =
    useAuthenticatedUser()

  const isOwnProfile =
    currentUser && profileUser && currentUser.id === profileUser.id

  const profileActions = useProfileActions({
    currentUserId: currentUser?.id,
    profileUserId: profileUser?.id,
    nickname,
    isOwnProfile: isOwnProfile || false,
  })

  const { data: statistics } = useUserStatistics(profileUser?.id || '')

  const {
    data: wishlistData,
    isLoading: isLoadingWishlist,
    isError: isWishlistError,
  } = useWishlistQuery(isOwnProfile ? filters : { page: 1, limit: 0 })

  const sortOptions = [
    { label: t('sorting.relevance'), value: 'AddedAtUtc:desc' },
    { label: t('sorting.popular'), value: 'Rating:desc' },
    { label: t('sorting.newest'), value: 'ReleaseDate:desc' },
    { label: t('sorting.priceLowHigh'), value: 'Price:asc' },
    { label: t('sorting.priceHighLow'), value: 'Price:desc' },
    { label: t('sorting.nameAZ'), value: 'Name:asc' },
    { label: t('sorting.nameZA'), value: 'Name:desc' },
  ]

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
    setFilters({ ...filters, sortBy: newSortBy })
  }

  const filteredItems =
    wishlistData?.data.items.filter((game) => {
      if (!searchText.trim()) return true
      const searchLower = searchText.toLowerCase()
      return (
        game.name.toLowerCase().includes(searchLower) ||
        game.developer.toLowerCase().includes(searchLower) ||
        game.publisher.toLowerCase().includes(searchLower) ||
        game.description.toLowerCase().includes(searchLower)
      )
    }) || []

  const renderGameCard = (game: any) => (
    <ProfileGameCard
      key={game.id}
      game={game}
      variant="wishlist"
      status="inWishlist"
      statusText={t('profile.status.inWishlist')}
      isInWishlist={true}
      onWishlistToggle={async () => {
        try {
          await removeFromWishlistMutation.mutateAsync({ gameId: game.id })
          showSuccess(t('wishlist.removed'))
        } catch (error: any) {
          showError(
            error?.response?.data?.message || t('wishlist.removeFailed'),
          )
        }
      }}
      onAddToCart={() => {
        addToCart(game)
        showSuccess(t('cart.added'))
      }}
    />
  )

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
            friendshipStatus={
              profileActions.friendshipStatus as
                | 'none'
                | 'pending_outgoing'
                | 'pending_incoming'
                | 'friends'
            }
            onEditProfile={profileActions.handleEditProfile}
            onAddFriend={profileActions.handleAddFriend}
            onCancelRequest={profileActions.handleCancelRequest}
            onAcceptRequest={profileActions.handleAcceptRequest}
            onRemoveFriend={profileActions.handleRemoveFriend}
          />

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-[24px]">
            <div className="w-full lg:w-[calc(75%-12px)] xl:w-[1092px]">
              <div className="bg-[#004252] p-3 sm:p-4 lg:p-[20px] rounded-[20px] flex flex-col gap-3 sm:gap-4 lg:gap-[16px]">
                <ProfileTabToolbar
                  searchText={searchText}
                  onSearchChange={setSearchText}
                  searchPlaceholder={t('profile.searchPlaceholders.wishlist')}
                  sortBy={sortBy}
                  onSortChange={handleSortChange}
                  sortOptions={sortOptions}
                  showFilters={false}
                />

                <div className="flex flex-col gap-2 sm:gap-3 lg:gap-[8px]">
                  {isLoadingWishlist ? (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-[rgba(204,248,255,0.65)] text-lg">
                        {t('common.loading')}
                      </p>
                    </div>
                  ) : isWishlistError ? (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-red-400 text-lg">
                        {t('games.errorLoading')}
                      </p>
                    </div>
                  ) : !filteredItems.length ? (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-[rgba(204,248,255,0.65)] text-lg">
                        {searchText
                          ? t('games.noGamesFound')
                          : t('games.noGamesMessage')}
                      </p>
                    </div>
                  ) : (
                    filteredItems.map((game) => renderGameCard(game))
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
