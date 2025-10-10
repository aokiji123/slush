import { createFileRoute } from '@tanstack/react-router'
import { CustomCheckbox } from '@/components'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-[var(--color-night-background)] text-white">
      <div
        className="w-full h-screen flex justify-center items-center"
        style={{
          background: `url(/auth-bg.png) no-repeat center center`,
          backgroundSize: 'cover',
        }}
      >
        <div className="w-[720px] min-h-[460px] bg-[var(--color-background-15)] rounded-[20px] p-[40px] flex flex-col gap-[24px] sm:gap-[64px] mx-[16px]">
          <div className="flex flex-col gap-[32px] w-full">
            <p className="text-[24px] font-bold text-center font-manrope">
              Авторизуйтесь, щоб продовжити
            </p>
            <div className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="login" className="text-[16px] font-bold">
                  Логін або email
                </label>
                <input
                  type="text"
                  id="login"
                  placeholder="Введіть ваш логін або email..."
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
              <div className="flex sm:flex-row flex-col items-center sm:justify-between justify-center sm:gap-0 gap-[16px] sm:mt-0 mt-[16px]">
                <div className="flex items-center gap-[12px]">
                  <CustomCheckbox id="checkbox" />
                  <label htmlFor="checkbox" className="text-[16px] font-light">
                    Запам'ятати мене
                  </label>
                </div>
                <a
                  href="/forgot-password"
                  className="text-[16px] font-light hover:underline"
                >
                  Не пам'ятаю пароль
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-[8px]">
            <button className="h-[48px] w-[200px] rounded-[22px] bg-[var(--color-background-21)] text-[16px] font-normal text-black cursor-pointer">
              Продовжити
            </button>
            <p className="text-[12px] font-light">
              Не маєте акаунту?{' '}
              <a href="/sign-up" className="text-[var(--color-background-21)]">
                Зареєструйтесь
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
