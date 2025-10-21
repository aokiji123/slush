export type WalletBalance = {
  amount: number
}

export type AddBalanceRequest = {
  amount: number
  title: string
}

export type Payment = {
  id: string
  userId: string
  gameId?: string
  sum: number
  name: string
  data: string
}

export type PagedPayments = {
  data: Payment[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
}
