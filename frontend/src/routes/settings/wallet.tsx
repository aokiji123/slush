import { createFileRoute } from '@tanstack/react-router'
import { WalletIcon } from '@/icons'

export const Route = createFileRoute('/settings/wallet')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex items-center justify-center flex-col">
      <div className="w-[60%] flex flex-col gap-[24px]">
        <div className="w-full h-[300px] bg-[var(--color-background-8)] rounded-[20px] p-[24px] text-white gap-[24px] flex items-center justify-center">
          <WalletIcon className="w-[68px] h-[62px]" />
          <div>
            <p className="text-[20px] text-[var(--color-background-25)]">
              Мій баланс
            </p>
            <p className="text-[36px] font-bold">1000.50₴</p>
          </div>
        </div>
        <div className="flex flex-col gap-[8px]">
          <label
            htmlFor="amount"
            className="text-[16px] text-[var(--color-background-25)]"
          >
            Поповнення балансу
          </label>
          <div className="flex items-center gap-[8px]">
            <input
              type="text"
              id="amount"
              placeholder="Сума"
              className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)]"
            />
            <button className="h-[40px] py-[8px] px-[24px] rounded-[20px] bg-[var(--color-background-21)] text-[16px] font-medium text-black cursor-pointer">
              Поповнити
            </button>
          </div>
        </div>
      </div>

      <div className="w-full">
        <p className="text-[24px] font-bold text-center">Історія транзакцій</p>
      </div>
    </div>
  )
}
