import { useQuery, useMutation } from '@tanstack/react-query'
import { getAllBadges, getUserBadges, checkAndAwardBadges } from '@/api/badgeAPI'

// Get all available badges
export function useAllBadges() {
  return useQuery({
    queryKey: ['badges'],
    queryFn: getAllBadges,
  })
}

// Get user's earned badges
export function useUserBadges(userId: string) {
  return useQuery({
    queryKey: ['user-badges', userId],
    queryFn: () => getUserBadges(userId),
    enabled: !!userId,
  })
}

// Check and award badges for a user (admin only)
export function useCheckAndAwardBadges() {
  return useMutation({
    mutationFn: (userId: string) => checkAndAwardBadges(userId),
  })
}
