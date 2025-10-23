import axiosInstance from '.'
import type { Badge, UserBadge } from '@/types/profile'

// Get all available badges
export async function getAllBadges(): Promise<Badge[]> {
  const { data } = await axiosInstance.get('/badge/all')
  return data.data
}

// Get user's earned badges
export async function getUserBadges(userId: string): Promise<UserBadge[]> {
  const { data } = await axiosInstance.get(`/badge/user/${userId}`)
  return data.data
}

// Check and award badges for a user (admin only)
export async function checkAndAwardBadges(userId: string): Promise<void> {
  await axiosInstance.post(`/badge/check/${userId}`)
}
