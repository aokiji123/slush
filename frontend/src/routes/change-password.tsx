import {
  createFileRoute,
  useNavigate,
  useLocation,
} from '@tanstack/react-router'
import { useState } from 'react'
import { useResetPassword } from '@/api/queries/useAuth'

export const Route = createFileRoute('/change-password')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const location = useLocation()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const resetPasswordMutation = useResetPassword()

  const email = ((location.search as any)?.email as string) || ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!password || !confirmPassword) {
      setError('Будь ласка, заповніть всі поля')
      return
    }

    if (password !== confirmPassword) {
      setError('Паролі не співпадають')
      return
    }

    if (password.length < 6) {
      setError('Пароль має містити мінімум 6 символів')
      return
    }

    try {
      await resetPasswordMutation.mutateAsync({
        email,
        newPassword: password,
        newPasswordConfirmed: confirmPassword,
      })

      navigate({ to: '/login' })
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Помилка зміни паролю. Спробуйте ще раз.',
      )
    }
  }

  if (!email) {
    return null
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
          className="w-full max-w-[720px] min-h-[410px] bg-[var(--color-background-15)] rounded-[20px] p-[40px] flex flex-col items-center gap-[64px] mx-[16px]"
        >
          <div className="flex flex-col gap-[32px] w-full">
            <div className="flex flex-col gap-[16px]">
              <p className="text-[24px] font-bold text-center font-manrope">
                Придумайте новий пароль
              </p>
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-[12px] p-[12px] text-red-500 text-center text-[14px]">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="password" className="text-[16px] font-bold">
                  Пароль
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Придумайте новий пароль..."
                  className="bg-[var(--color-background-14)] rounded-[22px] py-[12px] px-[16px] text-[16px] font-bold placeholder:font-light border-1 border-[var(--color-background-16)]"
                  disabled={resetPasswordMutation.isPending}
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
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Напишіть пароль ще раз..."
                  className="bg-[var(--color-background-14)] rounded-[22px] py-[12px] px-[16px] text-[16px] font-bold placeholder:font-light border-1 border-[var(--color-background-16)]"
                  disabled={resetPasswordMutation.isPending}
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={resetPasswordMutation.isPending}
            className="h-[48px] w-[200px] rounded-[22px] bg-[var(--color-background-21)] text-[16px] font-normal text-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resetPasswordMutation.isPending ? 'Збереження...' : 'Продовжити'}
          </button>
        </form>
      </div>
    </div>
  )
}
