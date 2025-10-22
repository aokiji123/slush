import type { GameData } from '@/api/types/game'

export type CartItem = {
  game: GameData
  addedAt: string
}

export type Cart = {
  items: CartItem[]
}

export type CartStore = {
  items: CartItem[]
  addToCart: (game: GameData) => void
  removeFromCart: (gameId: string) => void
  clearCart: () => void
  isInCart: (gameId: string) => boolean
  getCartTotal: () => number
  getCartSavings: () => number
  getCartCount: () => number
}

