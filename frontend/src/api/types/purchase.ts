export type PurchaseRequest = {
  gameId: string
  title?: string
}

export type PurchaseResult = {
  success: boolean
  message: string
  ownedGameId?: string
  balance?: {
    amount: number
  }
}
