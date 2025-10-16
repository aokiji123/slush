import type { Game } from './game'

export type Wishlist = {
  success: boolean
  message: string
  data: Game[]
}

export type AddToWishlistRequest = {
  userId: string
  gameId: string
}

export type RemoveFromWishlistRequest = AddToWishlistRequest
