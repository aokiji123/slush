import { createFileRoute } from '@tanstack/react-router'
import { useAuthenticatedUser } from '@/api/queries/useUser'
import { usePaymentHistory } from '@/api/queries/usePayments'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/settings/payments')({
  component: PaymentsSettingsPage,
})

function PaymentsSettingsPage() {
  const { t } = useTranslation('settings')
  const { data: user } = useAuthenticatedUser()
  const [type, setType] = useState<'All' | 'Purchase' | 'TopUp' | 'Refund'>('All')
  const [from, setFrom] = useState<string>('')
  const [to, setTo] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(20)

  const params = useMemo(() => ({
    page,
    limit,
    from: from || undefined,
    to: to || undefined,
    type: type === 'All' ? undefined : type,
  }), [page, limit, from, to, type])

  const { data, isLoading, error } = usePaymentHistory(user?.id || '', params)

  if (!user) return null

  return (
    <div className="min-h-screen bg-[var(--color-night-background)] py-[40px] px-[24px]">
      <div className="max-w-[960px] mx-auto flex flex-col gap-[16px]">
        <h1 className="text-[24px] font-bold text-[var(--color-background)]">{t('payments.title')}</h1>

        {/* Filters */}
        <div className="bg-[var(--color-background-15)] rounded-[12px] p-[16px] flex gap-[12px] items-end">
          <div className="flex flex-col gap-[6px]">
            <label className="text-[var(--color-background-50)] text-[12px]">{t('payments.filters.from')}</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="bg-transparent border border-[var(--color-background-25)] rounded-[8px] px-[10px] py-[8px] text-[var(--color-background)]" />
          </div>
          <div className="flex flex-col gap-[6px]">
            <label className="text-[var(--color-background-50)] text-[12px]">{t('payments.filters.to')}</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="bg-transparent border border-[var(--color-background-25)] rounded-[8px] px-[10px] py-[8px] text-[var(--color-background)]" />
          </div>
          <div className="flex flex-col gap-[6px]">
            <label className="text-[var(--color-background-50)] text-[12px]">{t('payments.filters.type')}</label>
            <select value={type} onChange={(e) => setType(e.target.value as any)} className="bg-transparent border border-[var(--color-background-25)] rounded-[8px] px-[10px] py-[8px] text-[var(--color-background)]">
              <option>{t('payments.filters.typeOptions.all')}</option>
              <option>{t('payments.filters.typeOptions.purchase')}</option>
              <option>{t('payments.filters.typeOptions.topUp')}</option>
              <option>{t('payments.filters.typeOptions.refund')}</option>
            </select>
          </div>
        </div>

        {/* List */}
        <div className="bg-[var(--color-background-15)] rounded-[12px]">
          {isLoading ? (
            <div className="p-[20px] text-[var(--color-background)]">{t('payments.loading')}</div>
          ) : error ? (
            <div className="p-[20px] text-[var(--color-background)]">{t('payments.error')}</div>
          ) : !data || data.items.length === 0 ? (
            <div className="p-[20px] text-[var(--color-background)]">{t('payments.empty')}</div>
          ) : (
            <div className="divide-y divide-[var(--color-background-10)]">
              {data.items.map(item => (
                <div key={item.id} className="p-[16px] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[var(--color-background)]">{item.description}</span>
                    <span className="text-[var(--color-background-50)] text-[12px]">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <div className="text-[var(--color-background)]">{item.amount} {item.currency}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-[8px]">
          <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-[10px] py-[8px] border border-[var(--color-background-25)] rounded-[8px] text-[var(--color-background)] disabled:opacity-50">{t('payments.pagination.prev')}</button>
          <span className="text-[var(--color-background-50)]">{t('payments.pagination.page')} {page}</span>
          <button disabled={!data || page * limit >= data.total} onClick={() => setPage(p => p + 1)} className="px-[10px] py-[8px] border border-[var(--color-background-25)] rounded-[8px] text-[var(--color-background)] disabled:opacity-50">{t('payments.pagination.next')}</button>
        </div>
      </div>
    </div>
  )
}

export default PaymentsSettingsPage

