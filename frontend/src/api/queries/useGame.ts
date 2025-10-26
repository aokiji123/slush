import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import axiosInstance from '..'
import type {
  CreateReviewRequest,
  Game,
  GameCharacteristics,
  GamePlatformInfo,
  GamesListResponse,
  PagedGamesResponse,
  Review,
  UpdateReviewRequest,
} from '../types/game'

async function getGameById(id: string): Promise<Game> {
  const { data } = await axiosInstance.get(`/game/${id}`)
  return data
}

async function getNewGames(): Promise<GamesListResponse> {
  const { data } = await axiosInstance.get('/game/new')
  return data
}

async function getDiscountedGames(): Promise<GamesListResponse> {
  const { data } = await axiosInstance.get('/game/discount')
  return data
}

async function getGameDlcs(id: string): Promise<GamesListResponse> {
  const { data } = await axiosInstance.get(`/game/dlcs/slug/${id}`)
  return data
}

async function getRecommendedGames(): Promise<GamesListResponse> {
  const { data } = await axiosInstance.get('/game/recommended')
  return data
}

async function getGamesWithPriceLessThan(
  price: number,
): Promise<GamesListResponse> {
  const { data } = await axiosInstance.get(`/game/price/${price}`)
  return data
}

async function getHitsGames(): Promise<GamesListResponse> {
  const { data } = await axiosInstance.get('/game/hits')
  return data
}

async function getFreeGames(): Promise<GamesListResponse> {
  const { data } = await axiosInstance.get('/game/free')
  return data
}

async function getGameReviews(id: string, sortBy?: string): Promise<{ success: boolean; message: string; data: any[] }> {
  const params = new URLSearchParams()
  params.append('GameId', id)
  
  if (sortBy) {
    const [field, order] = sortBy.split(':')
    params.append('SortBy', field)
    params.append('SortOrder', order || 'desc')
  }
  
  const { data } = await axiosInstance.get(`/review?${params.toString()}`)
  return data
}

async function createGameReview(review: CreateReviewRequest): Promise<Review> {
  const { data } = await axiosInstance.post('/review', review)
  return data.data
}

async function updateGameReview(reviewId: string, review: UpdateReviewRequest): Promise<Review> {
  const { data } = await axiosInstance.put(`/review/${reviewId}`, review)
  return data.data
}

async function likeReview(reviewId: string): Promise<void> {
  await axiosInstance.post(`/review/${reviewId}/like`)
}

async function unlikeReview(reviewId: string): Promise<void> {
  await axiosInstance.delete(`/review/${reviewId}/like`)
}

async function getGameCharacteristics(
  id: string,
): Promise<GameCharacteristics> {
  const { data } = await axiosInstance.get(`/game/${id}/characteristics`)
  return data
}

async function getGamePlatformInfo(identifier: string): Promise<GamePlatformInfo> {
  const { data } = await axiosInstance.get(`/game/${identifier}/platforms`)
  return data
}

async function getBaseGame(gameId: string): Promise<Game> {
  const { data } = await axiosInstance.get(`/game/${gameId}/base-game`)
  return data
}

async function getAllGames(): Promise<GamesListResponse> {
  const { data } = await axiosInstance.get('/game/all')
  return data
}

async function searchGames(
  searchText: string,
  filters?: {
    genres?: string[]
    platforms?: string[]
    minPrice?: number
    maxPrice?: number
    onSale?: boolean
    isDlc?: boolean
    page?: number
    limit?: number
    sortBy?: string
  }
): Promise<PagedGamesResponse> {
  const params = new URLSearchParams()
  
  if (searchText) {
    params.append('search', searchText)
  }
  
  if (filters?.genres?.length) {
    params.append('genres', filters.genres.join(','))
  }
  
  if (filters?.platforms?.length) {
    params.append('platforms', filters.platforms.join(','))
  }
  
  if (filters?.minPrice !== undefined) {
    params.append('minPrice', filters.minPrice.toString())
  }
  
  if (filters?.maxPrice !== undefined) {
    params.append('maxPrice', filters.maxPrice.toString())
  }
  
  if (filters?.onSale === true) {
    params.append('onSale', 'true')
  }
  
  if (filters?.isDlc === true) {
    params.append('isDlc', 'true')
  } else if (filters?.isDlc === false) {
    params.append('isDlc', 'false')
  }
  
  if (filters?.page) {
    params.append('page', filters.page.toString())
  }
  
  if (filters?.limit) {
    params.append('limit', filters.limit.toString())
  }
  
  if (filters?.sortBy) {
    params.append('sortBy', filters.sortBy)
  }

  const { data } = await axiosInstance.get(`/game/filter?${params.toString()}`)
  return data
}

export function useNewGames() {
  return useQuery({
    queryKey: ['newGames'],
    queryFn: () => getNewGames(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

export function useDiscountedGames() {
  return useQuery({
    queryKey: ['discountedGames'],
    queryFn: () => getDiscountedGames(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

export function useRecommendedGames() {
  return useQuery({
    queryKey: ['recommendedGames'],
    queryFn: () => getRecommendedGames(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

export function useGameById(id: string) {
  const { i18n } = useTranslation()
  return useQuery({
    queryKey: ['game', id, i18n.language],
    queryFn: () => getGameById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

export function useGamesWithPriceLessThan(price: number) {
  return useQuery({
    queryKey: ['gamesWithPriceLessThan', price],
    queryFn: () => getGamesWithPriceLessThan(price),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

export function useHitsGames() {
  return useQuery({
    queryKey: ['hitsGames'],
    queryFn: () => getHitsGames(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

export function useFreeGames() {
  return useQuery({
    queryKey: ['freeGames'],
    queryFn: () => getFreeGames(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

export function useGameDlcs(id: string) {
  return useQuery({
    queryKey: ['gameDlcs', id],
    queryFn: () => getGameDlcs(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

export function useGameReviews(id: string, sortBy?: string) {
  return useQuery({
    queryKey: ['gameReviews', id, sortBy],
    queryFn: () => getGameReviews(id, sortBy),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

export function useGameCharacteristics(id: string) {
  return useQuery({
    queryKey: ['gameCharacteristics', id],
    queryFn: () => getGameCharacteristics(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

export function useGamePlatformInfo(identifier: string) {
  return useQuery({
    queryKey: ['gamePlatformInfo', identifier],
    queryFn: () => getGamePlatformInfo(identifier),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

export function useBaseGame(gameId: string | null | undefined) {
  const { i18n } = useTranslation()
  return useQuery({
    queryKey: ['baseGame', gameId, i18n.language],
    queryFn: () => getBaseGame(gameId!),
    enabled: !!gameId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

export function useCreateGameReview() {
  return useMutation({
    mutationFn: (review: CreateReviewRequest) => createGameReview(review),
  })
}

export function useUpdateGameReview() {
  return useMutation({
    mutationFn: ({ reviewId, review }: { reviewId: string; review: UpdateReviewRequest }) => 
      updateGameReview(reviewId, review),
  })
}

export function useAllGames() {
  return useQuery({
    queryKey: ['allGames'],
    queryFn: () => getAllGames(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

export function useSearchGames(
  searchText: string,
  filters?: {
    genres?: string[]
    platforms?: string[]
    minPrice?: number
    maxPrice?: number
    onSale?: boolean
    isDlc?: boolean
    page?: number
    limit?: number
    sortBy?: string
  },
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['searchGames', searchText, filters],
    queryFn: () => searchGames(searchText, filters),
    enabled: enabled,
    staleTime: 1000 * 60 * 1, // 1 minute
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export function useLikeReview() {
  return useMutation({
    mutationFn: (reviewId: string) => likeReview(reviewId),
  })
}

export function useUnlikeReview() {
  return useMutation({
    mutationFn: (reviewId: string) => unlikeReview(reviewId),
  })
}
