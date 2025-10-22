import axiosInstance from '.'
import type { PurchaseRequest, PurchaseResult } from './types/purchase'

export async function purchaseGame(request: PurchaseRequest): Promise<PurchaseResult> {
  const { data } = await axiosInstance.post('/store/purchase', request)
  return data
}
