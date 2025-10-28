import axiosInstance from '.'

export type PaymentType = 'Purchase' | 'TopUp' | 'Refund'

export interface PaymentHistoryItem {
  id: string
  date: string
  type: PaymentType
  description: string
  amount: number
  currency: string
  status: string
  gameId?: string
  gameName?: string
  gameImage?: string
}

export interface PaymentHistoryParams {
  page?: number
  limit?: number
  from?: string
  to?: string
  type?: PaymentType
}

export interface PagedResult<T> {
  items: T[]
  page: number
  limit: number
  total: number
}

export async function getPaymentHistory(userId: string, params: PaymentHistoryParams = {}): Promise<PagedResult<PaymentHistoryItem>> {
  const search = new URLSearchParams()
  if (params.page) search.append('page', String(params.page))
  if (params.limit) search.append('limit', String(params.limit))
  if (params.from) search.append('from', params.from)
  if (params.to) search.append('to', params.to)
  if (params.type) search.append('type', params.type)

  const qs = search.toString()
  const { data } = await axiosInstance.get(`/payment/history/${userId}${qs ? `?${qs}` : ''}`)
  return data.data
}


