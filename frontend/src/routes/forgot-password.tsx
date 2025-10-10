import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForgotPassword } from '@/api/queries/useAuth'

export const Route = createFileRoute('/forgot-password')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const sendCodeMutation = useForgotPassword()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Будь ласка, введіть email')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Введіть коректну email адресу')
      return
    }

    try {
      await sendCodeMutation.mutateAsync({ email })

      navigate({
        to: '/code-access',
        search: { email } as any,
      })
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Помилка відправки коду. Спробуйте ще раз.',
      )
    }
  }

  return (
    <div className="bg-[var(--color-night-background)] text-white">
      <div
        className="w-full h-screen flex justify-center items-center"
        style={{
          background: `url(/auth-bg.png) no-repeat center center`,
          backgroundSize: 'cover',
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="w-[720px] min-h-[300px] bg-[var(--color-background-15)] rounded-[20px] p-[40px] flex flex-col items-center gap-[64px] mx-[16px]"
        >
          <div className="flex flex-col gap-[32px] w-full">
            <div className="flex flex-col gap-[16px]">
              <p className="text-[24px] font-bold text-center font-manrope">
                Забули пароль?
              </p>
              <p className="text-[16px] font-normal text-center">
                Вам буде надіслано лист із кодом для зміни паролю
              </p>
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-[12px] p-[12px] text-red-500 text-center text-[14px]">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="email" className="text-[16px] font-bold">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Введіть ваш email..."
                  className="bg-[var(--color-background-14)] rounded-[22px] py-[12px] px-[16px] text-[16px] font-bold placeholder:font-light border-1 border-[var(--color-background-16)]"
                  disabled={sendCodeMutation.isPending}
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={sendCodeMutation.isPending}
            className="h-[48px] w-[200px] rounded-[22px] bg-[var(--color-background-21)] text-[16px] font-normal text-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sendCodeMutation.isPending ? 'Відправка...' : 'Продовжити'}
          </button>
        </form>
      </div>
    </div>
  )
}
