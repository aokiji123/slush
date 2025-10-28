export type WalletBalance = {
  amount: number
}

export type AddBalanceRequest = {
  amount: number
  title: string
}

export type PaymentHistoryItem = {
  id: string
  date: string
  type: 'Purchase' | 'TopUp' | 'Refund'
  description: string
  amount: number
  currency: string
  status: string
  gameId?: string
  gameName?: string
  gameImage?: string
}

export type PagedPayments = {
  items: PaymentHistoryItem[]
  totalCount: number
  page: number
  pageSize: number
}
