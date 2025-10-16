import { useQuery } from '@tanstack/react-query'
import axiosInstance from '..'
import type { User } from '../types/user'

async function getAuthenticatedUser(): Promise<User> {
  const { data } = await axiosInstance.get(`/user/me`)
  return data
}

export function useAuthenticatedUser() {
  return useQuery({
    queryKey: ['authenticatedUser'],
    queryFn: () => getAuthenticatedUser(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
    refetchOnWindowFocus: false,
    enabled: !!(
      localStorage.getItem('token') || sessionStorage.getItem('token')
    ),
  })
}
