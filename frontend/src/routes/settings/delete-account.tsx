import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { useAuthenticatedUser, useDeleteAccount } from '@/api/queries/useUser'

export const Route = createFileRoute('/settings/delete-account')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation('settings')
  const { data: user } = useAuthenticatedUser()
  const deleteAccountMutation = useDeleteAccount()

  const [formData, setFormData] = useState({
    nickname: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nickname) {
      newErrors.nickname = t('deleteAccount.validation.nicknameRequired')
    } else if (formData.nickname !== user?.nickname) {
      newErrors.nickname = t('deleteAccount.validation.nicknameMismatch')
    }

    if (!formData.password) {
      newErrors.password = t('deleteAccount.validation.passwordRequired')
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t(
        'deleteAccount.validation.confirmPasswordRequired',
      )
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t(
        'deleteAccount.validation.passwordsNotMatch',
      )
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleDeleteClick = () => {
    if (!validateForm() || !user) return
    setShowConfirmation(true)
  }

  const handleConfirmDelete = async () => {
    if (!user) return

    try {
      await deleteAccountMutation.mutateAsync({
        userId: user.id,
        request: {
          userId: user.id,
          nickname: formData.nickname,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },
      })

      localStorage.clear()
      sessionStorage.clear()
      window.location.href = '/'
    } catch (error) {
      toast.error(t('deleteAccount.errorMessage'))
      setShowConfirmation(false)
    }
  }

  const handleCancelDelete = () => {
    setShowConfirmation(false)
    setFormData({ nickname: '', password: '', confirmPassword: '' })
    setErrors({})
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-white text-lg mb-4">
            {t('deleteAccount.loginRequired')}
          </p>
          <a
            href="/login"
            className="inline-block px-6 py-2 bg-[var(--color-background-21)] text-black rounded-lg hover:opacity-80"
          >
            {t('deleteAccount.loginButton')}
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center">
      <div className="lg:w-[60%] w-full bg-[var(--color-background-15)] rounded-[20px] p-[24px] text-white gap-[24px] flex flex-col">
        <p className="text-[24px] font-bold text-center font-manrope">
          {t('deleteAccount.title')}
        </p>

        <div className="p-[12px] bg-[#FF6F952E] rounded-[16px]">
          <p>{t('deleteAccount.warning')}</p>
        </div>

        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[8px]">
            <label htmlFor="nickname" className="text-[16px] font-bold">
              {t('deleteAccount.nicknameLabel')}
            </label>
            <input
              type="text"
              id="nickname"
              value={formData.nickname}
              onChange={(e) => handleInputChange('nickname', e.target.value)}
              placeholder={t('deleteAccount.nicknamePlaceholder')}
              className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)] placeholder:text-[var(--color-background-25)]"
            />
            {errors.nickname && (
              <p className="text-red-400 text-sm">{errors.nickname}</p>
            )}
          </div>

          <div className="flex flex-col gap-[8px]">
            <label htmlFor="password" className="text-[16px] font-bold">
              {t('deleteAccount.passwordLabel')}
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder={t('deleteAccount.passwordPlaceholder')}
              className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)] placeholder:text-[var(--color-background-25)]"
            />
            {errors.password && (
              <p className="text-red-400 text-sm">{errors.password}</p>
            )}

            <input
              type="password"
              id="confirm-password"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange('confirmPassword', e.target.value)
              }
              placeholder={t('deleteAccount.confirmPasswordPlaceholder')}
              className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)] placeholder:text-[var(--color-background-25)]"
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button
            onClick={handleDeleteClick}
            disabled={deleteAccountMutation.isPending}
            className="h-[40px] rounded-[22px] bg-[var(--color-background-19)] text-[16px] font-medium text-black cursor-pointer px-[24px] py-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleteAccountMutation.isPending
              ? t('deleteAccount.deleting')
              : t('deleteAccount.deleteButton')}
          </button>
        </div>

        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[var(--color-background-15)] rounded-[20px] p-[24px] max-w-md w-full mx-4">
              <h3 className="text-[20px] font-bold text-white mb-4 text-center">
                {t('deleteAccount.confirmationTitle')}
              </h3>
              <p className="text-white mb-6 text-center">
                {t('deleteAccount.confirmationMessage')}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleCancelDelete}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  {t('deleteAccount.cancelButton')}
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteAccountMutation.isPending}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {deleteAccountMutation.isPending
                    ? t('deleteAccount.deleting')
                    : t('deleteAccount.confirmDeleteButton')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
