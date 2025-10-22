import { useMutation, useQueryClient } from '@tanstack/react-query'
import { purchaseGame } from '../purchaseAPI'
import type { PurchaseRequest } from '../types/purchase'

export function usePurchaseGame() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: PurchaseRequest) => purchaseGame(request),
    onSuccess: () => {
      // Invalidate wallet balance to refresh it after purchase
      queryClient.invalidateQueries({ queryKey: ['wallet', 'balance'] })
      // Invalidate library to show newly purchased games
      queryClient.invalidateQueries({ queryKey: ['library'] })
    },
  })
}
