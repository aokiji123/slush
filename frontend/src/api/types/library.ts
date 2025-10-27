import type { GameData } from './game'

export type LibraryDto = {
  id: string
  userId: string
  gameId: string
  addedAt: string
}

export type AddToLibraryRequest = {
  gameId: string
}

export type LibraryGameDto = {
  gameId: string
  title: string
  mainImage: string
  addedAt: string
  isFavorite?: boolean
}

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

export type LibraryQueryParams = {
  page?: number
  limit?: number
  sortBy?: string
  sortDirection?: string
  search?: string
  genres?: string[]
  platforms?: string[]
  minPrice?: number
  maxPrice?: number
  onSale?: boolean
  isDlc?: boolean
}

export type LibraryResponse = {
  success: boolean
  message: string
  data: GameData[]
}

export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}
