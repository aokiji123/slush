import { useFriendshipStatus, useSendFriendRequest, useCancelFriendRequest, useAcceptFriendRequest, useRemoveFriend } from '@/api/queries/useFriendship'
import { useToastStore } from '@/lib/toast-store'
import { useCallback } from 'react'

interface UseProfileActionsProps {
  currentUserId?: string
  profileUserId?: string
  nickname: string
  isOwnProfile: boolean
}

export const useProfileActions = ({ 
  currentUserId, 
  profileUserId,
  nickname: _nickname,  // Reserved for future use
  isOwnProfile 
}: UseProfileActionsProps) => {
  const { success, error } = useToastStore()

  // Get friendship status
  const { data: friendshipStatus = 'none' } = useFriendshipStatus(
    currentUserId || '',
    profileUserId || ''
  )

  // Mutations
  const sendFriendRequestMutation = useSendFriendRequest()
  const cancelFriendRequestMutation = useCancelFriendRequest()
  const acceptFriendRequestMutation = useAcceptFriendRequest()
  const removeFriendMutation = useRemoveFriend()

  // Navigate to edit profile
  const handleEditProfile = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.location.href = '/settings'
    }
  }, [])

  // Add friend handler
  const handleAddFriend = useCallback(() => {
    if (profileUserId && friendshipStatus === 'none') {
      sendFriendRequestMutation.mutate(profileUserId, {
        onSuccess: () => {
          success('Friend request sent')
        },
        onError: (err: any) => {
          error(err?.response?.data?.message || 'Failed to send friend request')
        }
      })
    }
  }, [profileUserId, friendshipStatus, sendFriendRequestMutation, success, error])

  // Cancel friend request handler
  const handleCancelRequest = useCallback(() => {
    if (currentUserId && profileUserId) {
      cancelFriendRequestMutation.mutate(
        {
          senderId: currentUserId,
          receiverId: profileUserId
        },
        {
          onSuccess: () => {
            success('Friend request cancelled')
          },
          onError: (err: any) => {
            error(err?.response?.data?.message || 'Failed to cancel friend request')
          }
        }
      )
    }
  }, [currentUserId, profileUserId, cancelFriendRequestMutation, success, error])

  // Accept friend request handler
  const handleAcceptRequest = useCallback(() => {
    if (currentUserId && profileUserId) {
      acceptFriendRequestMutation.mutate(
        {
          senderId: profileUserId,
          receiverId: currentUserId
        },
        {
          onSuccess: () => {
            success('Friend request accepted')
          },
          onError: (err: any) => {
            error(err?.response?.data?.message || 'Failed to accept friend request')
          }
        }
      )
    }
  }, [currentUserId, profileUserId, acceptFriendRequestMutation, success, error])

  // Remove friend handler
  const handleRemoveFriend = useCallback(() => {
    if (currentUserId && profileUserId) {
      removeFriendMutation.mutate(
        {
          senderId: currentUserId,
          receiverId: profileUserId
        },
        {
          onSuccess: () => {
            success('Friend removed')
          },
          onError: (err: any) => {
            error(err?.response?.data?.message || 'Failed to remove friend')
          }
        }
      )
    }
  }, [currentUserId, profileUserId, removeFriendMutation, success, error])

  return {
    friendshipStatus: isOwnProfile ? 'none' : friendshipStatus,
    handleEditProfile,
    handleAddFriend,
    handleCancelRequest,
    handleAcceptRequest,
    handleRemoveFriend
  }
}

