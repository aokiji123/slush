import { createFileRoute } from '@tanstack/react-router'
import { CustomCheckbox } from '../components'

export const Route = createFileRoute('/sign-up')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-[var(--color-night-background)] text-white">
      <div
        className="w-full h-screen flex items-center justify-center"
        style={{
          background: `url(/auth-bg.png) no-repeat center center`,
          backgroundSize: 'cover',
        }}
      >
        <div className="w-[720px] min-h-[680px] bg-[var(--color-background-15)] rounded-[20px] p-[40px] flex flex-col gap-[64px]">
          <div className="flex flex-col gap-[32px] h-[460px] w-full">
            <p className="text-[24px] font-bold text-center">
              Створіть новий акаунт
            </p>
            <div className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="login" className="text-[16px] font-bold">
                  Логін
                </label>
                <input
                  type="text"
                  id="login"
                  placeholder="Придумайте новий логін..."
                  className="bg-[var(--color-background-14)] rounded-[22px] py-[12px] px-[16px] text-[16px] font-bold placeholder:font-light border-1 border-[var(--color-background-16)]"
                />
              </div>
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="email" className="text-[16px] font-bold">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Введіть ваш email..."
                  className="bg-[var(--color-background-14)] rounded-[22px] py-[12px] px-[16px] text-[16px] font-bold placeholder:font-light border-1 border-[var(--color-background-16)]"
                />
              </div>
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="email" className="text-[16px] font-bold">
                  Пароль
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Придумайте новий пароль..."
                  className="bg-[var(--color-background-14)] rounded-[22px] py-[12px] px-[16px] text-[16px] font-bold placeholder:font-light border-1 border-[var(--color-background-16)]"
                />
              </div>
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="email" className="text-[16px] font-bold">
                  Повторіть пароль
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Напишіть пароль ще раз..."
                  className="bg-[var(--color-background-14)] rounded-[22px] py-[12px] px-[16px] text-[16px] font-bold placeholder:font-light border-1 border-[var(--color-background-16)]"
                />
              </div>
              <div className="flex items-center gap-[12px]">
                <CustomCheckbox id="checkbox" />
                <label htmlFor="checkbox">
                  Я погоджуюсь з{' '}
                  <span className="text-[var(--color-background-21)]">
                    Умовами використання
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-[8px]">
            <button className="h-[48px] w-[200px] rounded-[22px] bg-[var(--color-background-21)] text-[16px] font-normal text-black cursor-pointer">
              Продовжити
            </button>
            <p className="text-[12px] font-light">
              Маєте акаунт?{' '}
              <a href="/login" className="text-[var(--color-background-21)]">
                Авторизуйтесь
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
