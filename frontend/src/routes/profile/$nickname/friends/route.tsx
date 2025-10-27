import { createFileRoute } from '@tanstack/react-router'
import { useUserByNickname, useAuthenticatedUser } from '@/api/queries/useUser'
import { 
  useFriendshipStatus,
  useSendFriendRequest,
  useCancelFriendRequest,
  useAcceptFriendRequest,
  useRemoveFriend
} from '@/api/queries/useFriendship'
import { useUserStatistics } from '@/api/queries/useProfile'
import { ProfileHeader } from '@/components/ProfileHeader'
import { ProfileTabs } from '@/components/ProfileTabs'
import { ProfileFriendsPreview } from '@/components/ProfileFriendsPreview'
import { FriendsListSection } from '@/components/FriendsListSection'
import { useToastStore } from '@/lib/toast-store'

export const Route = createFileRoute('/profile/$nickname/friends')({
  component: ProfileFriendsPage,
})

function ProfileFriendsPage() {
  const { nickname } = Route.useParams()
  const { success: showSuccess, error: showError } = useToastStore()

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

  // Mutations
  const sendFriendRequestMutation = useSendFriendRequest()
  const cancelFriendRequestMutation = useCancelFriendRequest()
  const acceptFriendRequestMutation = useAcceptFriendRequest()
  const removeFriendMutation = useRemoveFriend()

  const handleEditProfile = () => {
    // Navigate to settings page when implemented
    console.log('Edit profile - to be implemented')
  }

  const handleAddFriend = async () => {
    if (!profileUser?.id) return
    
    try {
      await sendFriendRequestMutation.mutateAsync(profileUser.id)
      showSuccess('Запит на дружбу відправлено')
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Не вдалося відправити запит на дружбу'
      showError(errorMessage)
    }
  }

  const handleCancelRequest = async () => {
    if (!currentUser?.id || !profileUser?.id) return
    
    try {
      await cancelFriendRequestMutation.mutateAsync({
        senderId: currentUser.id,
        receiverId: profileUser.id
      })
      showSuccess('Запит скасовано')
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Не вдалося скасувати запит'
      showError(errorMessage)
    }
  }

  const handleAcceptRequest = async () => {
    if (!currentUser?.id || !profileUser?.id) return
    
    try {
      await acceptFriendRequestMutation.mutateAsync({
        senderId: profileUser.id,
        receiverId: currentUser.id
      })
      showSuccess('Запит прийнято')
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Не вдалося прийняти запит'
      showError(errorMessage)
    }
  }

  const handleRemoveFriend = async () => {
    if (!currentUser?.id || !profileUser?.id) return
    
    if (!window.confirm('Ви впевнені, що хочете видалити цього користувача з друзів?')) {
      return
    }
    
    try {
      await removeFriendMutation.mutateAsync({
        senderId: currentUser.id,
        receiverId: profileUser.id
      })
      showSuccess('Користувача видалено з друзів')
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Не вдалося видалити друга'
      showError(errorMessage)
    }
  }

  // Loading state
  if (isLoadingProfile || isLoadingCurrentUser) {
    return (
      <div className="min-h-screen bg-[var(--color-night-background)] flex items-center justify-center">
        <div className="text-[var(--color-background)] text-[18px]">Загрузка...</div>
      </div>
    )
  }

  // Error state
  if (profileError || !profileUser) {
    return (
      <div className="min-h-screen bg-[var(--color-night-background)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[var(--color-background)] text-[24px] font-bold mb-[8px]">
            Пользователь не найден
          </div>
          <div className="text-[var(--color-background-25)] text-[16px]">
            Профиль с никнеймом "{nickname}" не существует
          </div>
        </div>
      </div>
    )
  }

  // Use real data from API calls
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
            onEditProfile={handleEditProfile}
            onAddFriend={handleAddFriend}
            onCancelRequest={handleCancelRequest}
            onAcceptRequest={handleAcceptRequest}
            onRemoveFriend={handleRemoveFriend}
          />

          <div className="flex gap-[24px]">
            {/* Main Content */}
            <div style={{ width: '1092px' }}>
              <FriendsListSection
                userId={profileUser.id}
                currentUserId={currentUser?.id || ''}
                showAllTab={true}
                showOnlineTab={true}
                showBlockedTab={false}
                showRequestsTab={false}
                showShared={!isOwnProfile}
              />
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
