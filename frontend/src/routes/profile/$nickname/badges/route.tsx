import { createFileRoute } from '@tanstack/react-router'
import { BadgeGallery } from '@/components'
import { useUserByNickname, useAuthenticatedUser } from '@/api/queries/useUser'
import { useUserStatistics } from '@/api/queries/useProfile'
import { useUserBadges } from '@/api/queries/useBadges'
import { ProfileTabs } from '@/components/ProfileTabs'
import { ProfileHeader } from '@/components/ProfileHeader'
import { useFriendshipStatus } from '@/api/queries/useFriendship'

export const Route = createFileRoute('/profile/$nickname/badges')({
  component: ProfileBadgesPage,
})

function ProfileBadgesPage() {
  const { nickname } = Route.useParams()

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
  const { data: userBadges } = useUserBadges(profileUser?.id || '')

  // Mock data for testing
  const mockBadges = [
    {
      id: '1',
      name: 'First Steps',
      icon: '/badge-icon.png',
      description: 'Complete your first game',
      requiredValue: 100,
      earnedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Explorer',
      icon: '/badge-icon.png',
      description: 'Play 10 different games',
      requiredValue: 500,
      earnedAt: '2024-01-20T15:30:00Z'
    },
    {
      id: '3',
      name: 'Collector',
      icon: '/badge-icon.png',
      description: 'Collect 50 games',
      requiredValue: 1000,
      earnedAt: '2024-01-25T12:00:00Z'
    },
    {
      id: '4',
      name: 'Reviewer',
      icon: '/badge-icon.png',
      description: 'Write 10 reviews',
      requiredValue: 750,
      earnedAt: '2024-01-30T14:30:00Z'
    }
  ]

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

  // Prepare profile data
  const profileData = {
    ...profileUser,
    level: statistics?.level || 1,
    badges: userBadges?.map(ub => ({
      id: ub.badge.id,
      name: ub.badge.name,
      icon: ub.badge.icon,
      description: ub.badge.description,
      requiredValue: ub.badge.requiredValue,
      earnedAt: ub.earnedAt
    })) || [],
    stats: {
      badges: statistics?.badgesCount || 0,
      games: statistics?.gamesCount || 0,
      dlc: statistics?.dlcCount || 0,
      wishlist: statistics?.wishlistCount || 0,
      discussions: statistics?.postsCount || 0,
      screenshots: 0, // TODO: Add screenshots count to statistics
      videos: 0, // TODO: Add videos count to statistics
      guides: 0, // TODO: Add guides count to statistics
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
              {/* Badge Gallery */}
              <BadgeGallery 
                badges={profileData.badges.length > 0 ? profileData.badges : mockBadges} 
                level={profileData.level}
                experience={statistics?.experience || 0}
                nextLevelExperience={statistics?.nextLevelExperience || 100}
              />
            </div>

            {/* Sidebar */}
            <ProfileTabs
              nickname={profileUser.nickname}
              level={profileData.level}
              stats={profileData.stats}
            />
          </div>
        </div>
      </div>
    </div>
  )
}