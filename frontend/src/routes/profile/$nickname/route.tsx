import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ProfileHeader,
  ProfileSidebar,
  BadgeGallery,
  ProfileStats,
  ScreenshotGallery,
  VideoGallery,
  ProfileCommentCard,
  EditProfileModal,
  DiscussionGallery,
  ReviewGallery,
  GuideGallery,
} from '@/components'
import { useUserByNickname, useAuthenticatedUser } from '@/api/queries/useUser'
import { useFriendshipStatus, useSendFriendRequest, useCancelFriendRequest, useAcceptFriendRequest, useRemoveFriend } from '@/api/queries/useFriendship'
import { 
  useUserStatistics, 
  useUserReviews, 
  useUserPosts, 
  useProfileComments, 
  useAddProfileComment, 
  useDeleteProfileComment,
  useFriendsWithDetails 
} from '@/api/queries/useProfile'
import { useUserBadges } from '@/api/queries/useBadges'
import { 
  mockGuides 
} from '@/data/mockGalleryData'

export const Route = createFileRoute('/profile/$nickname')({
  component: ProfilePage,
})

function ProfilePage() {
  const { nickname } = Route.useParams()
  const [newComment, setNewComment] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

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
  const { data: userReviews } = useUserReviews(profileUser?.id || '')
  const { data: userPosts } = useUserPosts(profileUser?.id || '')
  const { data: profileComments } = useProfileComments(profileUser?.id || '')
  const { data: userBadges } = useUserBadges(profileUser?.id || '')
  const { data: friendsWithDetails } = useFriendsWithDetails(
    isOwnProfile ? (profileUser?.id || '') : ''
  )

  // Friendship mutations
  const sendFriendRequestMutation = useSendFriendRequest()
  const cancelFriendRequestMutation = useCancelFriendRequest()
  const acceptFriendRequestMutation = useAcceptFriendRequest()
  const removeFriendMutation = useRemoveFriend()

  // Profile comment mutations
  const addProfileCommentMutation = useAddProfileComment()
  const deleteProfileCommentMutation = useDeleteProfileComment()

  const handleEditProfile = () => {
    setIsEditModalOpen(true)
  }

  const handleAddFriend = () => {
    if (profileUser && friendshipStatus === 'none') {
      sendFriendRequestMutation.mutate(profileUser.id)
    }
  }

  const handleCancelRequest = () => {
    if (currentUser && profileUser) {
      cancelFriendRequestMutation.mutate({
        senderId: currentUser.id,
        receiverId: profileUser.id
      })
    }
  }

  const handleAcceptRequest = () => {
    if (currentUser && profileUser) {
      acceptFriendRequestMutation.mutate({
        senderId: profileUser.id,
        receiverId: currentUser.id
      })
    }
  }

  const handleRemoveFriend = () => {
    if (currentUser && profileUser) {
      removeFriendMutation.mutate({
        senderId: currentUser.id,
        receiverId: profileUser.id
      })
    }
  }

  const handleAddComment = () => {
    if (newComment.trim() && profileUser) {
      addProfileCommentMutation.mutate({
        profileUserId: profileUser.id,
        content: newComment.trim()
      })
      setNewComment('')
    }
  }

  const gameThumbnails = [
    '/baldurs-gate-3.png',
    '/cyberpunk.png',
    '/destiny-2.png',
    '/ghost-of-tsushima.png',
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

  // Use real data from API calls
  const profileData = {
    ...profileUser,
    level: statistics?.level || 1,
    badges: userBadges?.map(ub => ({
      id: ub.badge.id,
      name: ub.badge.name,
      icon: ub.badge.icon,
      description: ub.badge.description,
      earnedAt: ub.earnedAt
    })) || [],
    stats: {
      games: statistics?.gamesCount || 0,
      dlc: statistics?.dlcCount || 0,
      wishlist: statistics?.wishlistCount || 0,
    },
    friends: isOwnProfile ? (friendsWithDetails?.map(f => ({
      id: f.id,
      userId: f.id,
      nickname: f.nickname,
      avatar: f.avatar,
      isOnline: f.isOnline,
      level: f.level,
    })) || []) : [],
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
            friendshipStatus={isOwnProfile ? 'none' : friendshipStatus as 'none' | 'pending_outgoing' | 'pending_incoming' | 'friends'}
            onEditProfile={handleEditProfile}
            onAddFriend={handleAddFriend}
            onCancelRequest={handleCancelRequest}
            onAcceptRequest={handleAcceptRequest}
            onRemoveFriend={handleRemoveFriend}
          />

          <div className="flex gap-[24px]">
            {/* Main Content */}
            <div style={{ width: '1092px' }}>
              {/* Badge Gallery */}
              <BadgeGallery badges={profileData.badges} />

              {/* Profile Stats */}
              <ProfileStats
                games={profileData.stats.games}
                dlc={profileData.stats.dlc}
                wishlist={profileData.stats.wishlist}
                gameThumbnails={gameThumbnails}
              />

              {/* Discussion Gallery */}
              <DiscussionGallery posts={userPosts || []} />

              {/* Screenshot Gallery */}
              <ScreenshotGallery posts={userPosts || []} />

              {/* Video Gallery */}
              <VideoGallery posts={userPosts || []} />

              {/* Reviews Gallery */}
              <ReviewGallery reviews={userReviews} />

              {/* Guides Gallery */}
              <GuideGallery guides={mockGuides} />

              {/* Comments Section */}
              <div className="bg-[var(--color-background-8)] rounded-[20px] p-[20px]">
                <div className="flex items-center justify-between mb-[20px]">
                  <h2 className="text-[20px] font-bold text-[var(--color-background)] font-manrope">
                    Коментарі
                  </h2>
                  <div className="bg-[var(--color-background-18)] rounded-[20px] px-[12px] py-[4px]">
                    <span className="text-[14px] font-bold text-[var(--color-background-25)] opacity-65">
                      {profileComments?.length || 0}
                    </span>
                  </div>
                </div>

                {/* Add Comment Input */}
                <div className="mb-[20px]">
                  <div className="bg-[var(--color-background-15)] rounded-[20px] p-[16px]">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Написати коментар..."
                      className="w-full bg-transparent text-[var(--color-background)] placeholder:text-[var(--color-background-25)] placeholder:opacity-65 resize-none outline-none min-h-[40px]"
                      rows={1}
                    />
                    <div className="flex justify-end mt-[12px]">
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="bg-[var(--color-background-21)] text-[var(--color-night-background)] px-[20px] py-[8px] rounded-[12px] font-medium text-[14px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-background-23)] transition-colors"
                      >
                        Опублікувати
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-[8px]">
                  {profileComments?.map((comment) => (
                    <ProfileCommentCard 
                      key={comment.id} 
                      comment={{
                        id: comment.id,
                        username: comment.authorNickname,
                        avatar: comment.authorAvatar || '/avatar.png',
                        content: comment.content,
                        createdAt: comment.createdAt
                      } as const} 
                      onDelete={() => deleteProfileCommentMutation.mutate(comment.id)}
                      canDelete={isOwnProfile || comment.authorId === currentUser?.id}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <ProfileSidebar
              level={profileData.level}
              friends={profileData.friends}
              currentUserId={currentUser?.id || 'current-user-id'}
            />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isOwnProfile && currentUser && (
        <EditProfileModal
          user={currentUser}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  )
}
