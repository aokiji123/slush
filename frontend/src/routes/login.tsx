import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { CustomCheckbox } from '@/components'
import { useLogin } from '@/api/queries/useAuth'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')

  const loginMutation = useLogin()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Будь ласка, заповніть всі поля')
      return
    }

    try {
      const response = await loginMutation.mutateAsync({
        email,
        password,
      })

      if (rememberMe) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response))
      } else {
        sessionStorage.setItem('token', response.token)
        sessionStorage.setItem('user', JSON.stringify(response))
      }

      window.dispatchEvent(new Event('authStateChanged'))

      navigate({ to: '/' })
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 'Помилка авторизації. Перевірте дані.',
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
          className="w-[720px] min-h-[460px] bg-[var(--color-background-15)] rounded-[20px] p-[40px] flex flex-col gap-[24px] sm:gap-[64px] mx-[16px]"
        >
          <div className="flex flex-col gap-[32px] w-full">
            <p className="text-[24px] font-bold text-center font-manrope">
              Авторизуйтесь, щоб продовжити
            </p>
            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-[12px] p-[12px] text-red-500 text-center text-[14px]">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="login" className="text-[16px] font-bold">
                  Логін або email
                </label>
                <input
                  type="text"
                  id="login"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Введіть ваш логін або email..."
                  className="bg-[var(--color-background-14)] rounded-[22px] py-[12px] px-[16px] text-[16px] font-bold placeholder:font-light border-1 border-[var(--color-background-16)]"
                  disabled={loginMutation.isPending}
                />
              </div>
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="password" className="text-[16px] font-bold">
                  Пароль
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введіть ваш пароль..."
                  className="bg-[var(--color-background-14)] rounded-[22px] py-[12px] px-[16px] text-[16px] font-bold placeholder:font-light border-1 border-[var(--color-background-16)]"
                  disabled={loginMutation.isPending}
                />
              </div>
              <div className="flex sm:flex-row flex-col items-center sm:justify-between justify-center sm:gap-0 gap-[16px] sm:mt-0 mt-[16px]">
                <div className="flex items-center gap-[12px]">
                  <CustomCheckbox
                    id="checkbox"
                    checked={rememberMe}
                    onChange={setRememberMe}
                  />
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
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="h-[48px] w-[200px] rounded-[22px] bg-[var(--color-background-21)] text-[16px] font-normal text-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? 'Завантаження...' : 'Продовжити'}
            </button>
            <p className="text-[12px] font-light">
              Не маєте акаунту?{' '}
              <a href="/sign-up" className="text-[var(--color-background-21)]">
                Зареєструйтесь
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
