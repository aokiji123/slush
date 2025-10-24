import type { GameData } from './game'

export type Wishlist = {
  success: boolean
  message: string
  data: GameData[]
}

export type PagedWishlistResponse = {
  success: boolean
  message: string
  data: {
    items: GameData[]
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
  }
}

export type WishlistQueryParams = {
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

export type AddToWishlistRequest = {
  gameId: string
}

export type RemoveFromWishlistRequest = {
  gameId: string
}
