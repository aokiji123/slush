import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/delete-account')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-[60%] bg-[var(--color-background-15)] rounded-[20px] p-[24px] text-white gap-[24px] flex flex-col">
        <p className="text-[24px] font-bold text-center">Видалення акаунта</p>

        <div className="p-[12px] bg-[#FF6F952E] rounded-[16px]">
          <p>
            Натисніть{' '}
            <span className="font-bold text-[var(--color-background-19)]">
              видалити мій акаунт
            </span>
            , щоб розпочати процес остаточного видалення вашого акаунта Slush,
            включно з усією особистою інформацією та купленим контентом. Після
            видалення вашого акаунта Slush баланс вашого гаманця також буде
            безповоротно видалено.
          </p>
        </div>

        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[8px]">
            <label htmlFor="password" className="text-[16px] font-bold">
              Нікнейм
            </label>
            <input
              type="text"
              id="nickname"
              placeholder="Введіть ваш поточний нікнейм..."
              className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)] placeholder:text-[var(--color-background-25)]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label htmlFor="new-password" className="text-[16px] font-bold">
              Пароль
            </label>
            <input
              type="password"
              id="new-password"
              placeholder="Введіть ваш поточний пароль..."
              className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)] placeholder:text-[var(--color-background-25)]"
            />
            <input
              type="password"
              id="new-password-confirm"
              placeholder="Повторіть пароль..."
              className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)] placeholder:text-[var(--color-background-25)]"
            />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button className="h-[40px] rounded-[22px] bg-[var(--color-background-19)] text-[16px] font-medium text-black cursor-pointer px-[24px] py-[8px]">
            Видалити мій акаунт
          </button>
        </div>
      </div>
    </div>
  )
}
