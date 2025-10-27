import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getMyCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
  addGameToCollection,
  removeGameFromCollection,
} from '../collectionAPI'
import type { CreateCollectionDto, UpdateCollectionDto } from '@/types/collection'

// Query keys
export const collectionKeys = {
  all: ['collections'] as const,
  lists: () => [...collectionKeys.all, 'list'] as const,
  list: (filters: string) => [...collectionKeys.lists(), { filters }] as const,
  details: () => [...collectionKeys.all, 'detail'] as const,
  detail: (id: string) => [...collectionKeys.details(), id] as const,
}

// Get user's collections
export function useCollections() {
  return useQuery({
    queryKey: collectionKeys.lists(),
    queryFn: () => getMyCollections(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

// Get collection details by ID
export function useCollection(id: string) {
  return useQuery({
    queryKey: collectionKeys.detail(id),
    queryFn: () => getCollectionById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

// Create collection mutation
export function useCreateCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateCollectionDto) => createCollection(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() })
    },
  })
}

// Update collection mutation
export function useUpdateCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCollectionDto }) =>
      updateCollection(id, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: collectionKeys.detail(data.data.id) })
    },
  })
}

// Delete collection mutation
export function useDeleteCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.all })
    },
  })
}

// Add game to collection mutation
export function useAddGameToCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ collectionId, gameId }: { collectionId: string; gameId: string }) =>
      addGameToCollection(collectionId, gameId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.detail(variables.collectionId) })
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() })
    },
  })
}

// Remove game from collection mutation
export function useRemoveGameFromCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ collectionId, gameId }: { collectionId: string; gameId: string }) =>
      removeGameFromCollection(collectionId, gameId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.detail(variables.collectionId) })
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() })
    },
  })
}

