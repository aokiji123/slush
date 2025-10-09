import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/password')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-[60%] bg-[var(--color-background-15)] rounded-[20px] p-[24px] text-white gap-[24px] flex flex-col">
        <p className="text-[24px] font-bold text-center font-manrope">
          Зміна паролю
        </p>
        <div className="bg-[var(--color-background-17)] rounded-[16px] py-[12px] px-[24px]">
          <ul className="flex flex-col gap-[4px] list-disc list-inside">
            <li>Не використовуйте жодного з останніх 5 паролів</li>
            <li>Використовуйте 7+ символів</li>
            <li>Використовуйте принаймні 1 літеру</li>
            <li>Використовуйте принаймні 1 цифру</li>
            <li>Без пробілів</li>
          </ul>
        </div>

        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[8px]">
            <label htmlFor="password" className="text-[16px] font-bold">
              Старий пароль
            </label>
            <input
              type="password"
              id="password"
              placeholder="Введіть ваш поточний пароль..."
              className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)] placeholder:text-[var(--color-background-25)]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label htmlFor="new-password" className="text-[16px] font-bold">
              Новий пароль
            </label>
            <input
              type="password"
              id="new-password"
              placeholder="Введіть новий пароль..."
              className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)] placeholder:text-[var(--color-background-25)]"
            />
            <input
              type="password"
              id="new-password-confirm"
              placeholder="Повторіть новий пароль..."
              className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)] placeholder:text-[var(--color-background-25)]"
            />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button className="h-[40px] w-[120px] rounded-[22px] bg-[var(--color-background-21)] text-[16px] font-medium text-black cursor-pointer">
            Зберегти
          </button>
        </div>
      </div>
    </div>
  )
}
