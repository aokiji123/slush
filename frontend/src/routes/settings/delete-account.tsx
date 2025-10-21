import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuthenticatedUser, useDeleteAccount } from '@/api/queries/useUser'

export const Route = createFileRoute('/settings/delete-account')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: user } = useAuthenticatedUser()
  const deleteAccountMutation = useDeleteAccount()
  
  const [formData, setFormData] = useState({
    nickname: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nickname) {
      newErrors.nickname = 'Введіть нікнейм'
    } else if (formData.nickname !== user?.nickname) {
      newErrors.nickname = 'Нікнейм не співпадає з поточним'
    }

    if (!formData.password) {
      newErrors.password = 'Введіть пароль'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Підтвердіть пароль'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Паролі не співпадають'
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
        }
      })
      
      // Clear local storage and redirect
      localStorage.clear()
      sessionStorage.clear()
      window.location.href = '/'
    } catch (error) {
      setMessage({ type: 'error', text: 'Помилка видалення акаунта. Перевірте дані та спробуйте ще раз.' })
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
          <p className="text-white text-lg mb-4">Потрібно увійти в акаунт</p>
          <a 
            href="/login" 
            className="inline-block px-6 py-2 bg-[var(--color-background-21)] text-black rounded-lg hover:opacity-80"
          >
            Увійти
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-[60%] bg-[var(--color-background-15)] rounded-[20px] p-[24px] text-white gap-[24px] flex flex-col">
        <p className="text-[24px] font-bold text-center font-manrope">
          Видалення акаунта
        </p>

        {/* Message Display */}
        {message && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}>
            {message.text}
          </div>
        )}

        <div className="p-[12px] bg-[#FF6F952E] rounded-[16px]">
          <p>
            Натисніть{' '}
            <span className="font-bold text-[var(--color-background-19)]">
              видалити мій акаунт
            </span>
            , щоб розпочати процес остаточного видалення вашого акаунта Slush,
            включно з усією особистою інформацією та купленим контентом. Після
            видалення вашого акаунта Slush баланс вашого гаманця також буде
            безповоротно видалено.
          </p>
        </div>

        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[8px]">
            <label htmlFor="nickname" className="text-[16px] font-bold">
              Нікнейм
            </label>
            <input
              type="text"
              id="nickname"
              value={formData.nickname}
              onChange={(e) => handleInputChange('nickname', e.target.value)}
              placeholder="Введіть ваш поточний нікнейм..."
              className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)] placeholder:text-[var(--color-background-25)]"
            />
            {errors.nickname && (
              <p className="text-red-400 text-sm">{errors.nickname}</p>
            )}
          </div>

          <div className="flex flex-col gap-[8px]">
            <label htmlFor="password" className="text-[16px] font-bold">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Введіть ваш поточний пароль..."
              className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)] placeholder:text-[var(--color-background-25)]"
            />
            {errors.password && (
              <p className="text-red-400 text-sm">{errors.password}</p>
            )}
            
            <input
              type="password"
              id="confirm-password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Повторіть пароль..."
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
            {deleteAccountMutation.isPending ? 'Видалення...' : 'Видалити мій акаунт'}
          </button>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[var(--color-background-15)] rounded-[20px] p-[24px] max-w-md w-full mx-4">
              <h3 className="text-[20px] font-bold text-white mb-4 text-center">
                Підтвердження видалення
              </h3>
              <p className="text-white mb-6 text-center">
                Ви впевнені, що хочете видалити свій акаунт? Ця дія незворотна і всі ваші дані будуть втрачені назавжди.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleCancelDelete}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Скасувати
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteAccountMutation.isPending}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {deleteAccountMutation.isPending ? 'Видалення...' : 'Видалити'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
