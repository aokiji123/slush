import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { WalletIcon } from '@/icons'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { useWalletBalance, useAddBalance, usePaymentHistory } from '@/api/queries/useWallet'
import { useAuthenticatedUser } from '@/api/queries/useUser'

export const Route = createFileRoute('/settings/wallet')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: user } = useAuthenticatedUser()
  const { data: balance, isLoading: balanceLoading } = useWalletBalance()
  const addBalanceMutation = useAddBalance()
  const { data: paymentHistory, isLoading: historyLoading } = usePaymentHistory(user?.id || '', 1, 10)
  
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatAmount = (sum: number) => {
    const formatted = sum.toFixed(2)
    return sum >= 0 ? `+${formatted}₴` : `${formatted}₴`
  }

  const getAmountColor = (sum: number) => {
    return sum >= 0 ? 'text-green-400' : 'text-red-400'
  }

  const handleAddBalance = async () => {
    if (!amount || !user) return

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      setMessage({ type: 'error', text: 'Введіть коректну суму' })
      return
    }

    try {
      await addBalanceMutation.mutateAsync({
        amount: amountNum,
        title: 'Поповнення балансу'
      })
      setAmount('')
      setMessage({ type: 'success', text: 'Баланс успішно поповнено!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Помилка поповнення балансу' })
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-white text-lg mb-4">Потрібно увійти в акаунт</p>
          <a 
            href="/login" 
            className="inline-block px-6 py-2 bg-[var(--color-background-21)] text-black rounded-lg hover:opacity-80"
          >
            Увійти
          </a>
        </div>
      </div>
    )
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const renderPagination = () => {
    if (!paymentHistory) return null

    const totalPages = paymentHistory.totalPages
    const pages = []
    
    // Show first page
    if (currentPage > 3) {
      pages.push(1)
      if (currentPage > 4) pages.push('...')
    }
    
    // Show pages around current page
    const start = Math.max(1, currentPage - 2)
    const end = Math.min(totalPages, currentPage + 2)
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    // Show last page
    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) pages.push('...')
      pages.push(totalPages)
    }

    return (
      <div className="w-full flex justify-center mt-[20px]">
        <div className="flex items-center gap-[16px] w-[300px] justify-center text-white text-[16px] font-light">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaArrowLeft />
          </button>
          
          {pages.map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && handlePageChange(page)}
              disabled={page === '...'}
              className={`cursor-pointer hover:underline disabled:cursor-default disabled:hover:no-underline ${
                page === currentPage ? 'font-bold' : ''
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="w-[60%] flex flex-col gap-[24px]">
        <div className="w-full h-[300px] bg-[var(--color-background-8)] rounded-[20px] p-[24px] text-white gap-[24px] flex items-center justify-center">
          <WalletIcon className="w-[68px] h-[62px]" />
          <div>
            <p className="text-[20px] text-[var(--color-background-25)]">
              Мій баланс
            </p>
            <p className="text-[36px] font-bold font-manrope">
              {balanceLoading ? 'Завантаження...' : `${balance?.amount.toFixed(2) || '0.00'}₴`}
            </p>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}>
            {message.text}
          </div>
        )}

        <div className="flex flex-col gap-[8px]">
          <label
            htmlFor="amount"
            className="text-[16px] text-[var(--color-background-25)]"
          >
            Поповнення балансу
          </label>
          <div className="flex items-center gap-[8px]">
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Сума"
              min="0"
              step="0.01"
              className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)]"
            />
            <button 
              onClick={handleAddBalance}
              disabled={!amount || addBalanceMutation.isPending}
              className="h-[40px] py-[8px] px-[24px] rounded-[20px] bg-[var(--color-background-21)] text-[16px] font-medium text-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addBalanceMutation.isPending ? 'Поповнення...' : 'Поповнити'}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full mt-[40px] flex flex-col gap-[20px]">
        <p className="text-[24px] font-bold text-center text-white">
          Історія транзакцій
        </p>
        <div className="w-full bg-[var(--color-background-8)] rounded-[20px] p-[20px] flex flex-col">
          <div className="flex items-center px-[20px] text-[16px] text-white font-light mb-[20px]">
            <div className="w-[15%]">
              <p>Сума</p>
            </div>
            <div className="w-[75%]">
              <p>Найменування</p>
            </div>
            <div className="w-[10%] text-right">
              <p>Дата</p>
            </div>
          </div>
          
          {historyLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-white">Завантаження історії...</p>
            </div>
          ) : paymentHistory?.data && paymentHistory.data.length > 0 ? (
            <div className="w-full rounded-[20px] flex flex-col gap-[8px]">
              {paymentHistory.data.map((payment) => (
                <div key={payment.id} className="flex items-center px-[20px] py-[16px] rounded-[20px] text-[16px] text-white font-light bg-[var(--color-background-15)]">
                  <div className="w-[15%]">
                    <p className={getAmountColor(payment.sum)}>
                      {formatAmount(payment.sum)}
                    </p>
                  </div>
                  <div className="w-[75%]">
                    <p>{payment.name}</p>
                  </div>
                  <div className="w-[10%] text-right">
                    <p>{formatDate(payment.data)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-white">Історія транзакцій порожня</p>
            </div>
          )}

          {renderPagination()}
        </div>
      </div>
    </div>
  )
}
