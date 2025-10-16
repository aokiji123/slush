import { useMutation, useQuery } from '@tanstack/react-query'
import axiosInstance from '..'
import type {
  CreateReviewRequest,
  Game,
  GameCharacteristics,
  GamesListResponse,
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
  const { data } = await axiosInstance.get(`/game/dlcs/${id}`)
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

async function getGameReviews(id: string): Promise<Game> {
  const { data } = await axiosInstance.get(`/game/${id}/reviews`)
  return data
}

async function createGameReview(review: CreateReviewRequest): Promise<void> {
  const { data } = await axiosInstance.post('/game/review', review)
  return data
}

async function getGameCharacteristics(
  id: string,
): Promise<GameCharacteristics> {
  const { data } = await axiosInstance.get(`/game/${id}/characteristics`)
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
  return useQuery({
    queryKey: ['game', id],
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

export function useGameReviews(id: string) {
  return useQuery({
    queryKey: ['gameReviews', id],
    queryFn: () => getGameReviews(id),
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

export function useCreateGameReview() {
  return useMutation({
    mutationFn: (review: CreateReviewRequest) => createGameReview(review),
  })
}
