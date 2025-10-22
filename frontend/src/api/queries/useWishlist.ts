import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '..'
import type {
  AddToWishlistRequest,
  RemoveFromWishlistRequest,
  Wishlist,
  PagedWishlistResponse,
  WishlistQueryParams,
} from '../types/wishlist'

async function getWishlist(): Promise<Wishlist> {
  const { data } = await axiosInstance.get(`/wishlist/me`)
  return data
}

async function getWishlistQuery(params: WishlistQueryParams): Promise<PagedWishlistResponse> {
  const searchParams = new URLSearchParams()
  
  if (params.page) searchParams.append('page', params.page.toString())
  if (params.limit) searchParams.append('limit', params.limit.toString())
  if (params.sortBy) searchParams.append('sortBy', params.sortBy)
  if (params.sortDirection) searchParams.append('sortDirection', params.sortDirection)
  if (params.search) searchParams.append('search', params.search)
  if (params.genres?.length) searchParams.append('genres', params.genres.join(','))
  if (params.platforms?.length) searchParams.append('platforms', params.platforms.join(','))
  if (params.minPrice !== undefined) searchParams.append('minPrice', params.minPrice.toString())
  if (params.maxPrice !== undefined) searchParams.append('maxPrice', params.maxPrice.toString())
  if (params.onSale !== undefined) searchParams.append('onSale', params.onSale.toString())
  if (params.isDlc !== undefined) searchParams.append('isDlc', params.isDlc.toString())

  const { data } = await axiosInstance.get(`/wishlist/me/query?${searchParams.toString()}`)
  return data
}

async function addToWishlist(gameId: string): Promise<void> {
  const { data } = await axiosInstance.post(`/wishlist/me`, { gameId })
  return data
}

async function removeFromWishlist(gameId: string): Promise<void> {
  const { data } = await axiosInstance.delete(`/wishlist/me/${gameId}`)
  return data
}

export function useWishlist() {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: () => getWishlist(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

export function useWishlistQuery(params: WishlistQueryParams = {}) {
  return useQuery({
    queryKey: ['wishlist', 'query', params],
    queryFn: () => getWishlistQuery(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

export function useAddToWishlist() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: AddToWishlistRequest) =>
      addToWishlist(data.gameId),
    onSuccess: () => {
      // Invalidate wishlist queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
  })
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: RemoveFromWishlistRequest) =>
      removeFromWishlist(data.gameId),
    onSuccess: () => {
      // Invalidate wishlist queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
  })
}
