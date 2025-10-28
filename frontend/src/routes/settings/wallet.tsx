import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { WalletIcon } from '@/icons'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import {
  useWalletBalance,
  useAddBalance,
  usePaymentHistory,
} from '@/api/queries/useWallet'
import { useAuthenticatedUser } from '@/api/queries/useUser'

export const Route = createFileRoute('/settings/wallet')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation('settings')
  const { data: user } = useAuthenticatedUser()
  const { data: balance, isLoading: balanceLoading } = useWalletBalance()
  const addBalanceMutation = useAddBalance()

  const [amount, setAmount] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const { data: paymentHistory, isLoading: historyLoading } = usePaymentHistory(
    user?.id || '',
    currentPage,
    10,
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
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
      toast.error(t('wallet.invalidAmount'))
      return
    }

    try {
      await addBalanceMutation.mutateAsync({
        amount: amountNum,
        title: t('wallet.balanceReplenishment'),
      })
      setAmount('')
      toast.success(t('wallet.successMessage'))
    } catch (error) {
      toast.error(t('wallet.errorMessage'))
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-white text-lg mb-4">{t('wallet.loginRequired')}</p>
          <a
            href="/login"
            className="inline-block px-6 py-2 bg-[var(--color-background-21)] text-black rounded-lg hover:opacity-80"
          >
            {t('wallet.loginButton')}
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

    const totalPages = Math.ceil(paymentHistory.totalCount / paymentHistory.pageSize)
    const pages: (number | string)[] = []

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
      <div className="w-full lg:w-[60%] flex flex-col gap-[24px]">
        <div className="w-full h-[300px] bg-[var(--color-background-8)] rounded-[20px] p-[24px] text-white gap-[24px] flex items-center justify-center">
          <WalletIcon className="w-[68px] h-[62px]" />
          <div>
            <p className="text-[20px] text-[var(--color-background-25)]">
              {t('wallet.myBalance')}
            </p>
            <p className="text-[36px] font-bold font-manrope">
              {balanceLoading
                ? t('wallet.loading')
                : `${balance?.amount.toFixed(2) || '0.00'}₴`}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-[8px]">
          <label
            htmlFor="amount"
            className="text-[16px] text-[var(--color-background-25)]"
          >
            {t('wallet.addBalance')}
          </label>
          <div className="flex items-center gap-[8px]">
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t('wallet.amountPlaceholder')}
              min="0"
              step="0.01"
              className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)]"
            />
            <button
              onClick={handleAddBalance}
              disabled={!amount || addBalanceMutation.isPending}
              className="h-[40px] py-[8px] px-[24px] rounded-[20px] bg-[var(--color-background-21)] text-[16px] font-medium text-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addBalanceMutation.isPending
                ? t('wallet.adding')
                : t('wallet.addButton')}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full mt-[40px] flex flex-col gap-[20px]">
        <p className="text-[24px] font-bold text-center text-white">
          {t('wallet.transactionHistory')}
        </p>
        <div className="w-full bg-[var(--color-background-8)] rounded-[20px] p-[20px] flex flex-col">
          <div className="flex items-center px-[20px] text-[16px] text-white font-light mb-[20px]">
            <div className="w-[15%]">
              <p>{t('wallet.amount')}</p>
            </div>
            <div className="w-[75%]">
              <p>{t('wallet.description')}</p>
            </div>
            <div className="w-[10%] text-right">
              <p>{t('wallet.date')}</p>
            </div>
          </div>

          {historyLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-white">{t('wallet.loadingHistory')}</p>
            </div>
          ) : paymentHistory?.items && paymentHistory.items.length > 0 ? (
            <div className="w-full rounded-[20px] flex flex-col gap-[8px]">
              {paymentHistory.items.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center px-[20px] py-[16px] rounded-[20px] text-[16px] text-white font-light bg-[var(--color-background-15)]"
                >
                  <div className="w-[15%]">
                    <p className={getAmountColor(payment.amount)}>
                      {formatAmount(payment.amount)}
                    </p>
                  </div>
                  <div className="w-[75%]">
                    <p>{payment.description}</p>
                  </div>
                  <div className="w-[10%] text-right">
                    <p>{formatDate(payment.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-white">{t('wallet.emptyHistory')}</p>
            </div>
          )}

          {renderPagination()}
        </div>
      </div>
    </div>
  )
}
