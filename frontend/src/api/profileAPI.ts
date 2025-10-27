import axiosInstance from '.'
import type { ProfileStatistics, ProfileComment, CreateProfileComment, FriendDetails } from '@/types/profile'
import type { Review } from '@/api/types/game'
import type { PostDto } from '@/types/community'

// Get user statistics
export async function getUserStatistics(userId: string): Promise<ProfileStatistics> {
  const { data } = await axiosInstance.get(`/user/${userId}/statistics`)
  return data.data
}

// Get user reviews
export async function getUserReviews(userId: string, sortBy?: string): Promise<Review[]> {
  const params = new URLSearchParams()
  if (sortBy) {
    params.append('sortBy', sortBy)
  }
  const queryString = params.toString()
  const { data } = await axiosInstance.get(`/user/${userId}/reviews${queryString ? `?${queryString}` : ''}`)
  return data.data
}

// Get user posts
export async function getUserPosts(userId: string, type?: string, sortBy?: string): Promise<PostDto[]> {
  const params = new URLSearchParams()
  if (type) {
    params.append('type', type)
  }
  if (sortBy) {
    params.append('sortBy', sortBy)
  }
  const queryString = params.toString()
  const { data } = await axiosInstance.get(`/user/${userId}/posts${queryString ? `?${queryString}` : ''}`)
  return data.data
}

// Get user games
export async function getUserGames(userId: string, sortBy?: string): Promise<any[]> {
  const params = new URLSearchParams()
  if (sortBy) {
    params.append('sortBy', sortBy)
  }
  const queryString = params.toString()
  const { data } = await axiosInstance.get(`/user/${userId}/games${queryString ? `?${queryString}` : ''}`)
  return data.data
}

// Get profile comments
export async function getProfileComments(userId: string): Promise<ProfileComment[]> {
  const { data } = await axiosInstance.get(`/profilecomment/${userId}`)
  return data.data
}

// Add profile comment
export async function addProfileComment(comment: CreateProfileComment): Promise<ProfileComment> {
  const { data } = await axiosInstance.post('/profilecomment', comment)
  return data.data
}

// Delete profile comment
export async function deleteProfileComment(commentId: string): Promise<void> {
  await axiosInstance.delete(`/profilecomment/${commentId}`)
}

// Get friends with details
export async function getFriendsWithDetails(userId: string): Promise<FriendDetails[]> {
  const { data } = await axiosInstance.get(`/friendship/friends/${userId}/details`)
  return data.data
}
