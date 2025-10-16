import { useMutation, useQuery } from '@tanstack/react-query'
import axiosInstance from '..'
import type {
  AddToWishlistRequest,
  RemoveFromWishlistRequest,
  Wishlist,
} from '../types/wishlist'

async function getWishlist(userId: string): Promise<Wishlist> {
  const { data } = await axiosInstance.get(`/wishlist/${userId}`)
  return data
}

async function addToWishlist(userId: string, gameId: string): Promise<void> {
  const { data } = await axiosInstance.post(`/wishlist`, { userId, gameId })
  return data
}

async function removeFromWishlist(
  userId: string,
  gameId: string,
): Promise<void> {
  const { data } = await axiosInstance.delete(`/wishlist/${userId}/${gameId}`)
  return data
}

export function useWishlist(userId: string) {
  return useQuery({
    queryKey: ['wishlist', userId],
    queryFn: () => getWishlist(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

export function useAddToWishlist() {
  return useMutation({
    mutationFn: (data: AddToWishlistRequest) =>
      addToWishlist(data.userId, data.gameId),
  })
}

export function useRemoveFromWishlist() {
  return useMutation({
    mutationFn: (data: RemoveFromWishlistRequest) =>
      removeFromWishlist(data.userId, data.gameId),
  })
}
