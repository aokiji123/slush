import { createFileRoute } from '@tanstack/react-router'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
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
          <div className="w-full rounded-[20px] flex flex-col gap-[8px]">
            <div className="flex items-center px-[20px] py-[16px] rounded-[20px] text-[16px] text-white font-light bg-[var(--color-background-15)]">
              <div className="w-[15%]">
                <p> -999₴ </p>
              </div>
              <div className="w-[75%]">
                <p>Ghost of Tsushima</p>
              </div>
              <div className="w-[10%] text-right">
                <p>21.02.2023</p>
              </div>
            </div>
            <div className="flex items-center px-[20px] py-[16px] rounded-[20px] text-[16px] text-white font-light bg-[var(--color-background-15)]">
              <div className="w-[15%]">
                <p> -599₴ </p>
              </div>
              <div className="w-[75%]">
                <p>The Witcher 3</p>
              </div>
              <div className="w-[10%] text-right">
                <p>21.02.2023</p>
              </div>
            </div>
            <div className="flex items-center px-[20px] py-[16px] rounded-[20px] text-[16px] text-white font-light bg-[var(--color-background-15)]">
              <div className="w-[15%]">
                <p> +1000₴ </p>
              </div>
              <div className="w-[75%]">
                <p>Поповнення балансу</p>
              </div>
              <div className="w-[10%] text-right">
                <p>21.02.2023</p>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center mt-[20px]">
            <div className="flex items-center gap-[16px] w-[300px] justify-center text-white text-[16px] font-light">
              <p className="cursor-pointer">
                <FaArrowLeft />
              </p>
              <p className="cursor-pointer hover:underline">1</p>
              <p className="cursor-pointer hover:underline">2</p>
              <p>...</p>
              <p className="cursor-pointer hover:underline">10</p>
              <p className="cursor-pointer">
                <FaArrowRight />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
