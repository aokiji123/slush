import axiosInstance from '.'
import type { User } from './types/user'

// Search users by nickname
export async function searchUsers(query: string): Promise<User[]> {
  if (!query || query.trim().length === 0) {
    return []
  }
  const { data } = await axiosInstance.get(`/user/search`, {
    params: { nickname: query },
  })
  return data.data
}

// Get user by ID
export async function getUserById(userId: string): Promise<User> {
  const { data } = await axiosInstance.get(`/user/${userId}`)
  return data.data
}

// Get user by nickname
export async function getUserByNickname(nickname: string): Promise<User> {
  const { data } = await axiosInstance.get(`/user/nickname/${nickname}`)
  return data.data
}

