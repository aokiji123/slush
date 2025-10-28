import { useQuery } from '@tanstack/react-query'
import { getPaymentHistory, type PaymentHistoryParams } from '../paymentAPI'

export function usePaymentHistory(userId: string, params: PaymentHistoryParams = {}) {
  return useQuery({
    queryKey: ['payments', 'history', userId, params],
    queryFn: () => getPaymentHistory(userId, params),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    refetchOnWindowFocus: false,
  })
}


