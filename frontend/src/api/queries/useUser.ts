import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '..'
import type { User, UserUpdateRequest, NotificationsRequest, NotificationsSettings, DeleteAccountRequest, ResetPasswordRequest } from '../types/user'

async function getAuthenticatedUser(): Promise<User> {
  const { data } = await axiosInstance.get(`/user/me`)
  return data.data
}

async function updateUser(userId: string, request: UserUpdateRequest): Promise<User> {
  const { data } = await axiosInstance.put(`/user/${userId}`, request)
  return data.data
}

async function updateNotifications(userId: string, request: NotificationsRequest): Promise<void> {
  await axiosInstance.put(`/user/${userId}/notifications`, request)
}

async function deleteAccount(userId: string, request: DeleteAccountRequest): Promise<void> {
  await axiosInstance.delete(`/user/${userId}`, { data: request })
}

async function uploadAvatar(userId: string, file: File): Promise<{ url: string }> {
  const formData = new FormData()
  formData.append('file', file)
  
  const { data } = await axiosInstance.post(`/user/${userId}/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data.data
}

async function uploadBanner(userId: string, file: File): Promise<{ url: string }> {
  const formData = new FormData()
  formData.append('file', file)
  
  const { data } = await axiosInstance.post(`/user/${userId}/banner`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data.data
}

async function resetPassword(request: ResetPasswordRequest): Promise<void> {
  await axiosInstance.post('/auth/reset-password', request)
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

export function useUpdateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, request }: { userId: string; request: UserUpdateRequest }) =>
      updateUser(userId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authenticatedUser'] })
    },
  })
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: ({ userId, request }: { userId: string; request: DeleteAccountRequest }) =>
      deleteAccount(userId, request),
  })
}

export function useUploadAvatar() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, file }: { userId: string; file: File }) =>
      uploadAvatar(userId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authenticatedUser'] })
    },
  })
}

export function useUploadBanner() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, file }: { userId: string; file: File }) =>
      uploadBanner(userId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authenticatedUser'] })
    },
  })
}

async function getNotifications(userId: string): Promise<NotificationsSettings> {
  const { data } = await axiosInstance.get(`/user/${userId}/notifications`)
  return data.data
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  })
}

export function useNotifications(userId: string) {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => getNotifications(userId),
    enabled: !!userId,
  })
}

export function useUpdateNotifications() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, request }: { userId: string; request: NotificationsRequest }) =>
      updateNotifications(userId, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notifications', variables.userId] })
    },
  })
}

export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: ['searchUsers', query],
    queryFn: async () => {
      const { searchUsers } = await import('../userAPI')
      return searchUsers(query)
    },
    enabled: query.length >= 2,
    staleTime: 1000 * 30, // 30 seconds
  })
}

export function useUserByNickname(nickname: string) {
  return useQuery({
    queryKey: ['user', 'nickname', nickname],
    queryFn: async () => {
      const { getUserByNickname } = await import('../userAPI')
      return getUserByNickname(nickname)
    },
    enabled: !!nickname,
  })
}