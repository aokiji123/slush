import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  getUserStatistics, 
  getUserReviews, 
  getUserPosts, 
  getProfileComments, 
  addProfileComment, 
  deleteProfileComment,
  getFriendsWithDetails 
} from '@/api/profileAPI'
import type { CreateProfileComment } from '@/types/profile'

// Get user statistics
export function useUserStatistics(userId: string) {
  return useQuery({
    queryKey: ['user-statistics', userId],
    queryFn: () => getUserStatistics(userId),
    enabled: !!userId,
  })
}

// Get user reviews
export function useUserReviews(userId: string) {
  return useQuery({
    queryKey: ['user-reviews', userId],
    queryFn: () => getUserReviews(userId),
    enabled: !!userId,
  })
}

// Get user posts
export function useUserPosts(userId: string) {
  return useQuery({
    queryKey: ['user-posts', userId],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,
  })
}

// Get profile comments
export function useProfileComments(userId: string) {
  return useQuery({
    queryKey: ['profile-comments', userId],
    queryFn: () => getProfileComments(userId),
    enabled: !!userId,
  })
}

// Add profile comment
export function useAddProfileComment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (comment: CreateProfileComment) => addProfileComment(comment),
    onSuccess: (_, variables) => {
      // Invalidate profile comments for the target user
      queryClient.invalidateQueries({ queryKey: ['profile-comments', variables.profileUserId] })
    },
  })
}

// Delete profile comment
export function useDeleteProfileComment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (commentId: string) => deleteProfileComment(commentId),
    onSuccess: () => {
      // Invalidate all profile comments queries
      queryClient.invalidateQueries({ queryKey: ['profile-comments'] })
    },
  })
}

// Get friends with details
export function useFriendsWithDetails(userId: string) {
  return useQuery({
    queryKey: ['friends-details', userId],
    queryFn: () => getFriendsWithDetails(userId),
    enabled: !!userId,
  })
}
