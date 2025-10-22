import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameData } from '@/api/types/game'
import type { CartItem } from '@/types/cart'

type CartStore = {
  items: CartItem[]
  addToCart: (game: GameData) => void
  removeFromCart: (gameId: string) => void
  clearCart: () => void
  isInCart: (gameId: string) => boolean
  getCartTotal: () => number
  getCartSavings: () => number
  getCartCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (game: GameData) => {
        const { items } = get()
        
        // Check if item already exists in cart
        const existingItem = items.find((item) => item.game.id === game.id)
        
        if (existingItem) {
          // Item already in cart, do nothing
          return
        }

        // Add new item to cart
        set({
          items: [
            ...items,
            {
              game,
              addedAt: new Date().toISOString(),
            },
          ],
        })
      },

      removeFromCart: (gameId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.game.id !== gameId),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      isInCart: (gameId: string) => {
        const { items } = get()
        return items.some((item) => item.game.id === gameId)
      },

      getCartTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => {
          const price = item.game.salePrice > 0 ? item.game.salePrice : item.game.price
          return total + price
        }, 0)
      },

      getCartSavings: () => {
        const { items } = get()
        return items.reduce((savings, item) => {
          if (item.game.salePrice > 0) {
            return savings + (item.game.price - item.game.salePrice)
          }
          return savings
        }, 0)
      },

      getCartCount: () => {
        const { items } = get()
        return items.length
      },
    }),
    {
      name: 'slush-cart-storage',
    }
  )
)

