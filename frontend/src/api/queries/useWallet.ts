import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '..'
import type { WalletBalance, AddBalanceRequest, PagedPayments } from '../types/wallet'

async function getWalletBalance(): Promise<WalletBalance> {
  const { data } = await axiosInstance.get('/wallet/balance')
  return data
}

async function addBalance(request: AddBalanceRequest): Promise<WalletBalance> {
  const { data } = await axiosInstance.post('/wallet/add', request)
  return data
}

async function getPaymentHistory(
  userId: string,
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<PagedPayments> {
  const { data } = await axiosInstance.get(
    `/payment/history/${userId}?page=${pageNumber}&limit=${pageSize}`
  )
  // ApiResponse wraps the result in a "data" property
  return data.data
}

export function useWalletBalance() {
  return useQuery({
    queryKey: ['walletBalance'],
    queryFn: getWalletBalance,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

export function useAddBalance() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: addBalance,
    onSuccess: () => {
      // Invalidate and refetch wallet balance and payment history
      queryClient.invalidateQueries({ queryKey: ['walletBalance'] })
      queryClient.invalidateQueries({ queryKey: ['paymentHistory'] })
    },
  })
}

export function usePaymentHistory(userId: string, pageNumber: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: ['paymentHistory', userId, pageNumber, pageSize],
    queryFn: () => getPaymentHistory(userId, pageNumber, pageSize),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
    enabled: !!userId,
  })
}
