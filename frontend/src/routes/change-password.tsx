import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/change-password')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  return (
    <div className="bg-[var(--color-night-background)] text-white">
      <div
        className="w-full h-screen flex justify-center items-center"
        style={{
          background: `url(/auth-bg.png) no-repeat center center`,
          backgroundSize: 'cover',
        }}
      >
        <div className="w-[720px] min-h-[410px] bg-[var(--color-background-15)] rounded-[20px] p-[40px] flex flex-col items-center gap-[64px]">
          <div className="flex flex-col gap-[32px] w-full">
            <div className="flex flex-col gap-[16px]">
              <p className="text-[24px] font-bold text-center">
                Придумайте новий пароль
              </p>
            </div>
            <div className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="password" className="text-[16px] font-bold">
                  Пароль
                </label>
                <input
                  type="text"
                  id="password"
                  placeholder="Придумайте новий пароль..."
                  className="bg-[var(--color-background-14)] rounded-[22px] py-[12px] px-[16px] text-[16px] font-bold placeholder:font-light border-1 border-[var(--color-background-16)]"
                />
              </div>

              <div className="flex flex-col gap-[8px]">
                <label
                  htmlFor="confirm-password"
                  className="text-[16px] font-bold"
                >
                  Підтвердіть пароль
                </label>
                <input
                  type="text"
                  id="confirm-password"
                  placeholder="Напишіть пароль ще раз..."
                  className="bg-[var(--color-background-14)] rounded-[22px] py-[12px] px-[16px] text-[16px] font-bold placeholder:font-light border-1 border-[var(--color-background-16)]"
                />
              </div>
            </div>
          </div>
          <button
            className="h-[48px] w-[200px] rounded-[22px] bg-[var(--color-background-21)] text-[16px] font-normal text-black cursor-pointer"
            onClick={() => {
              navigate({
                to: '/login',
              })
            }}
          >
            Продовжити
          </button>
        </div>
      </div>
    </div>
  )
}
