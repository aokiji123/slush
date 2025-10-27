import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { LibraryQueryParams, AddToLibraryRequest } from '../types/library'
import {
  getMyLibrary,
  getMyLibraryWithQuery,
  addToMyLibrary,
  checkGameOwnership,
  getOwnedGames,
  getSharedGames,
  toggleFavorite,
} from '../libraryAPI'

// Hook for simple library list (no filtering)
export function useMyLibrary() {
  return useQuery({
    queryKey: ['library', 'me'],
    queryFn: () => getMyLibrary(),
    staleTime: 1000 * 60 * 5,
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

// Hook for advanced library query with filtering
export function useMyLibraryQuery(params: LibraryQueryParams = {}) {
  return useQuery({
    queryKey: ['library', 'me', 'query', params],
    queryFn: () => getMyLibraryWithQuery(params),
    staleTime: 1000 * 60 * 5,
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

// Hook for owned games (legacy endpoint)
export function useOwnedGames(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['ownedGames', page, limit],
    queryFn: () => getOwnedGames(page, limit),
    staleTime: 1000 * 60 * 5,
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

// Hook for checking game ownership
export function useGameOwnership(gameId: string) {
  return useQuery({
    queryKey: ['gameOwnership', gameId],
    queryFn: () => checkGameOwnership(gameId),
    staleTime: 1000 * 60 * 5,
    retry: 3,
    refetchOnWindowFocus: false,
    enabled: !!gameId,
  })
}

// Mutation hook for adding to library
export function useAddToLibrary() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (request: AddToLibraryRequest) => addToMyLibrary(request),
    onSuccess: () => {
      // Invalidate all library queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['library'] })
      queryClient.invalidateQueries({ queryKey: ['ownedGames'] })
      queryClient.invalidateQueries({ queryKey: ['gameOwnership'] })
    },
  })
}

// Hook for getting shared games between two users
export function useSharedGames(userId1: string, userId2: string) {
  return useQuery({
    queryKey: ['sharedGames', userId1, userId2],
    queryFn: () => getSharedGames(userId1, userId2),
    enabled: !!userId1 && !!userId2 && userId1 !== userId2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

// Mutation hook for toggling favorite status
export function useToggleFavorite() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (gameId: string) => toggleFavorite(gameId),
    onSuccess: () => {
      // Invalidate all library queries to refresh data with updated favorite status
      queryClient.invalidateQueries({ queryKey: ['library'] })
    },
  })
}
