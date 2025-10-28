import { useQuery } from '@tanstack/react-query'
import { getAllBadges, getUserBadges } from '../badgesAPI'

// Hook for fetching all available badges
export function useAllBadges() {
  return useQuery({
    queryKey: ['badges', 'all'],
    queryFn: () => getAllBadges(),
    staleTime: 1000 * 60 * 60, // 1 hour - badges don't change often
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

// Hook for fetching user's earned badges
export function useUserBadges(userId: string) {
  return useQuery({
    queryKey: ['badges', 'user', userId],
    queryFn: () => getUserBadges(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}