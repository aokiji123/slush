import axiosInstance from '.'
import type { ApiResponse } from './types/library'
import type { Collection, CollectionDetails, CreateCollectionDto, UpdateCollectionDto } from '@/types/collection'

export async function getMyCollections(): Promise<ApiResponse<Collection[]>> {
  const { data } = await axiosInstance.get('/collection')
  return data
}

export async function getCollectionById(id: string): Promise<ApiResponse<CollectionDetails>> {
  const { data } = await axiosInstance.get(`/collection/${id}`)
  return data
}

export async function createCollection(dto: CreateCollectionDto): Promise<ApiResponse<Collection>> {
  const { data } = await axiosInstance.post('/collection', dto)
  return data
}

export async function updateCollection(id: string, dto: UpdateCollectionDto): Promise<ApiResponse<Collection>> {
  const { data } = await axiosInstance.put(`/collection/${id}`, dto)
  return data
}

export async function deleteCollection(id: string): Promise<ApiResponse<boolean>> {
  const { data } = await axiosInstance.delete(`/collection/${id}`)
  return data
}

export async function addGameToCollection(collectionId: string, gameId: string): Promise<ApiResponse<boolean>> {
  const { data } = await axiosInstance.post(`/collection/${collectionId}/games/${gameId}`)
  return data
}

export async function removeGameFromCollection(collectionId: string, gameId: string): Promise<ApiResponse<boolean>> {
  const { data } = await axiosInstance.delete(`/collection/${collectionId}/games/${gameId}`)
  return data
}

