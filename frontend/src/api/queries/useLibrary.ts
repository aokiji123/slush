import { useQuery } from '@tanstack/react-query'
import axiosInstance from '..'
import type { Game } from '../types/game'

export type OwnedGameDto = {
  gameId: string
  title: string
  mainImage: string
  purchasedAt: string
  purchasePrice: number
}

export type PagedResult<T> = {
  items: T[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export type LibraryResponse = {
  success: boolean
  message: string
  data: Game[]
}

export type AddToLibraryRequest = {
  userId: string
  gameId: string
}

async function getOwnedGames(page: number = 1, limit: number = 20): Promise<PagedResult<OwnedGameDto>> {
  const { data } = await axiosInstance.get(`/library/owned?page=${page}&limit=${limit}`)
  return data
}

async function getUserLibrary(userId: string): Promise<LibraryResponse> {
  const { data } = await axiosInstance.get(`/library/${userId}`)
  return data
}

async function checkGameOwnership(gameId: string): Promise<boolean> {
  try {
    const { data } = await axiosInstance.get(`/library/owned`)
    const pagedResult = data as PagedResult<OwnedGameDto>
    return pagedResult.items?.some((game) => game.gameId === gameId) || false
  } catch (error) {
    console.error('Failed to check game ownership:', error)
    return false
  }
}

export function useOwnedGames(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['ownedGames', page, limit],
    queryFn: () => getOwnedGames(page, limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

export function useUserLibrary(userId: string) {
  return useQuery({
    queryKey: ['userLibrary', userId],
    queryFn: () => getUserLibrary(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

export function useGameOwnership(gameId: string) {
  return useQuery({
    queryKey: ['gameOwnership', gameId],
    queryFn: () => checkGameOwnership(gameId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}
