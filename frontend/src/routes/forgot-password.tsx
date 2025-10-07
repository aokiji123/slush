import { createFileRoute, useNavigate } from '@tanstack/react-router'
import ReCAPTCHA from 'react-google-recaptcha'

export const Route = createFileRoute('/forgot-password')({
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
        <div className="w-[720px] min-h-[460px] bg-[var(--color-background-15)] rounded-[20px] p-[40px] flex flex-col items-center gap-[64px]">
          <div className="flex flex-col gap-[32px] w-full">
            <div className="flex flex-col gap-[16px]">
              <p className="text-[24px] font-bold text-center">
                Забули пароль?
              </p>
              <p className="text-[16px] font-normal text-center">
                Вам буде надіслано лист із посиланням для зміни паролю
              </p>
            </div>
            <div className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="email" className="text-[16px] font-bold">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  placeholder="Введіть ваш email..."
                  className="bg-[var(--color-background-14)] rounded-[22px] py-[12px] px-[16px] text-[16px] font-bold placeholder:font-light border-1 border-[var(--color-background-16)]"
                />
              </div>
              <div className="flex justify-center mt-[16px]">
                <ReCAPTCHA
                  sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                  theme="light"
                />
              </div>
            </div>
          </div>
          <button
            className="h-[48px] w-[200px] rounded-[22px] bg-[var(--color-background-21)] text-[16px] font-normal text-black cursor-pointer"
            onClick={() => {
              navigate({
                to: '/code-access',
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
