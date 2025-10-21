import {
  createFileRoute,
  useNavigate,
  useLocation,
} from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useVerifyCode, useResendVerificationCode } from '@/api/queries/useAuth'

export const Route = createFileRoute('/code-access')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation('auth')
  const [code, setCode] = useState(['', '', '', '', ''])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const verifyCodeMutation = useVerifyCode()
  const resendCodeMutation = useResendVerificationCode()

  const email = ((location.search as any)?.email as string) || ''

  useEffect(() => {
    if (!email) {
      navigate({ to: '/forgot-password' })
    }
  }, [email, navigate])

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyCode = async () => {
    setError('')
    setSuccess('')

    const codeString = code.join('')

    if (codeString.length !== 5) {
      setError(t('codeAccess.errors.codeRequired'))
      return
    }

    try {
      await verifyCodeMutation.mutateAsync({ email, code: codeString })

      navigate({
        to: '/change-password',
        search: { email, code: codeString } as any,
      })
    } catch (err: any) {
      setError(
        err?.response?.data?.message || t('codeAccess.errors.invalidCode'),
      )
    }
  }

  const handleResendCode = async () => {
    setError('')
    setSuccess('')

    try {
      await resendCodeMutation.mutateAsync({ email })
      setSuccess(t('codeAccess.resendSuccess'))
      setCode(['', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          t('codeAccess.errors.resendError'),
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
        <div className="w-full max-w-[470px] min-h-[400px] bg-[var(--color-background-15)] rounded-[20px] sm:p-[40px] p-[24px] flex flex-col items-center gap-[64px] mx-[16px]">
          <div className="flex flex-col gap-[32px] w-full">
            <div className="flex flex-col gap-[16px]">
              <p className="text-[24px] font-bold text-center font-manrope">
                {t('codeAccess.title')}
              </p>
              <p className="text-[16px] font-normal text-center">
                {t('codeAccess.description')}
              </p>
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-[12px] p-[12px] text-red-500 text-center text-[14px]">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-500/10 border border-green-500 rounded-[12px] p-[12px] text-green-500 text-center text-[14px]">
                {success}
              </div>
            )}
            <div className="flex gap-[16px] justify-center">
              {[0, 1, 2, 3, 4].map((index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el
                  }}
                  type="text"
                  maxLength={1}
                  value={code[index]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={
                    verifyCodeMutation.isPending || resendCodeMutation.isPending
                  }
                  className="sm:w-[64px] sm:h-[76px] w-[48px] h-[56px] bg-[var(--color-background-14)] rounded-[12px] text-center text-[36px] font-bold border-1 border-[var(--color-background-16)] focus:border-[var(--color-background-21)] focus:outline-none disabled:opacity-50"
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-[16px] items-center">
            <button
              onClick={handleVerifyCode}
              disabled={verifyCodeMutation.isPending}
              className="h-[48px] w-[200px] rounded-[22px] bg-[var(--color-background-21)] text-[16px] font-normal text-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verifyCodeMutation.isPending ? t('codeAccess.errors.loading') : t('codeAccess.submit')}
            </button>
            <button
              onClick={handleResendCode}
              disabled={resendCodeMutation.isPending}
              className="text-[16px] font-medium hover:underline cursor-pointer disabled:opacity-50"
            >
              {resendCodeMutation.isPending
                ? t('codeAccess.errors.loading')
                : t('codeAccess.resendCode')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
