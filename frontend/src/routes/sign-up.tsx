import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CustomCheckbox } from '../components'
import { useRegister } from '@/api/queries/useAuth'

export const Route = createFileRoute('/sign-up')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { t } = useTranslation('auth')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState('')

  const registerMutation = useRegister()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username || !email || !password || !confirmPassword) {
      setError(t('signUp.errors.fillAllFields'))
      return
    }

    if (password !== confirmPassword) {
      setError(t('signUp.errors.passwordsNotMatch'))
      return
    }

    if (password.length < 6) {
      setError(t('validation.minLength', { count: 6 }))
      return
    }

    if (!acceptedTerms) {
      setError(t('signUp.errors.agreeTerms'))
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError(t('validation.email'))
      return
    }

    try {
      const response = await registerMutation.mutateAsync({
        username,
        email,
        password,
      })

      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response))

      window.dispatchEvent(new Event('authStateChanged'))

      navigate({ to: '/' })
    } catch (err: any) {
      setError(
        err?.response?.data?.message || t('signUp.errors.registrationError'),
      )
    }
  }

  return (
    <div className="bg-[var(--color-night-background)] text-white">
      <div
        className="w-full h-screen flex items-center justify-center"
        style={{
          background: `url(/auth-bg.png) no-repeat center center`,
          backgroundSize: 'cover',
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="w-[720px] min-h-[680px] bg-[var(--color-background-15)] rounded-[20px] p-[40px] flex flex-col gap-[96px] sm:gap-[64px] mx-[16px]"
        >
          <div className="flex flex-col gap-[32px] h-[460px] w-full">
            <p className="text-[24px] font-bold text-center font-manrope">
              {t('signUp.title')}
            </p>
            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-[12px] p-[12px] text-red-500 text-center text-[14px]">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="login" className="text-[16px] font-bold">
                  {t('signUp.nicknameLabel')}
                </label>
                <input
                  type="text"
                  id="login"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('signUp.nicknamePlaceholder')}
                  className="bg-[var(--color-background-14)] rounded-[22px] py-[12px] px-[16px] text-[16px] font-bold placeholder:font-light border-1 border-[var(--color-background-16)]"
                  disabled={registerMutation.isPending}
                />
              </div>
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="email" className="text-[16px] font-bold">
                  {t('signUp.emailLabel')}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('signUp.emailPlaceholder')}
                  className="bg-[var(--color-background-14)] rounded-[22px] py-[12px] px-[16px] text-[16px] font-bold placeholder:font-light border-1 border-[var(--color-background-16)]"
                  disabled={registerMutation.isPending}
                />
              </div>
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="password" className="text-[16px] font-bold">
                  {t('signUp.passwordLabel')}
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('signUp.passwordPlaceholder')}
                  className="bg-[var(--color-background-14)] rounded-[22px] py-[12px] px-[16px] text-[16px] font-bold placeholder:font-light border-1 border-[var(--color-background-16)]"
                  disabled={registerMutation.isPending}
                />
              </div>
              <div className="flex flex-col gap-[8px]">
                <label
                  htmlFor="confirmPassword"
                  className="text-[16px] font-bold"
                >
                  {t('signUp.confirmPasswordLabel')}
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('signUp.confirmPasswordPlaceholder')}
                  className="bg-[var(--color-background-14)] rounded-[22px] py-[12px] px-[16px] text-[16px] font-bold placeholder:font-light border-1 border-[var(--color-background-16)]"
                  disabled={registerMutation.isPending}
                />
              </div>
              <div className="flex items-center gap-[12px]">
                <CustomCheckbox
                  id="checkbox"
                  checked={acceptedTerms}
                  onChange={setAcceptedTerms}
                />
                <label htmlFor="checkbox">
                  {t('signUp.agreeTerms')}
                </label>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-[8px]">
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="h-[48px] w-[200px] rounded-[22px] bg-[var(--color-background-21)] text-[16px] font-normal text-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {registerMutation.isPending ? t('signUp.errors.loading') : t('signUp.submit')}
            </button>
            <p className="text-[12px] font-light">
              {t('signUp.hasAccount')}{' '}
              <a href="/login" className="text-[var(--color-background-21)]">
                {t('signUp.login')}
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
