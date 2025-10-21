import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuthenticatedUser, useResetPassword } from '@/api/queries/useUser'

export const Route = createFileRoute('/settings/password')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: user } = useAuthenticatedUser()
  const resetPasswordMutation = useResetPassword()
  
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const validatePassword = (password: string) => {
    const errors = []
    if (password.length < 7) errors.push('Мінімум 7 символів')
    if (!/[a-zA-Z]/.test(password)) errors.push('Принаймні 1 літера')
    if (!/\d/.test(password)) errors.push('Принаймні 1 цифра')
    if (/\s/.test(password)) errors.push('Без пробілів')
    return errors
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.oldPassword) {
      newErrors.oldPassword = 'Введіть поточний пароль'
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Введіть новий пароль'
    } else {
      const passwordErrors = validatePassword(formData.newPassword)
      if (passwordErrors.length > 0) {
        newErrors.newPassword = passwordErrors.join(', ')
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Підтвердіть новий пароль'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Паролі не співпадають'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm() || !user) return

    try {
      await resetPasswordMutation.mutateAsync({
        email: user.email,
        newPassword: formData.newPassword,
        newPasswordConfirmed: formData.confirmPassword,
      })
      
      setMessage({ type: 'success', text: 'Пароль успішно змінено!' })
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Помилка зміни паролю. Спробуйте ще раз.' })
    }
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

  const getPasswordStrength = (password: string) => {
    const errors = validatePassword(password)
    if (password.length === 0) return { strength: 0, color: 'bg-gray-400' }
    if (errors.length === 0) return { strength: 100, color: 'bg-green-500' }
    if (errors.length <= 2) return { strength: 60, color: 'bg-yellow-500' }
    return { strength: 30, color: 'bg-red-500' }
  }

  const passwordStrength = getPasswordStrength(formData.newPassword)

  return (
    <div className="flex items-center justify-center">
      <div className="w-[60%] bg-[var(--color-background-15)] rounded-[20px] p-[24px] text-white gap-[24px] flex flex-col">
        <p className="text-[24px] font-bold text-center font-manrope">
          Зміна паролю
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

        <div className="bg-[var(--color-background-17)] rounded-[16px] py-[12px] px-[24px]">
          <ul className="flex flex-col gap-[4px] list-disc list-inside">
            <li>Не використовуйте жодного з останніх 5 паролів</li>
            <li>Використовуйте 7+ символів</li>
            <li>Використовуйте принаймні 1 літеру</li>
            <li>Використовуйте принаймні 1 цифру</li>
            <li>Без пробілів</li>
          </ul>
        </div>

        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[8px]">
            <label htmlFor="password" className="text-[16px] font-bold">
              Старий пароль
            </label>
            <input
              type="password"
              id="password"
              value={formData.oldPassword}
              onChange={(e) => handleInputChange('oldPassword', e.target.value)}
              placeholder="Введіть ваш поточний пароль..."
              className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)] placeholder:text-[var(--color-background-25)]"
            />
            {errors.oldPassword && (
              <p className="text-red-400 text-sm">{errors.oldPassword}</p>
            )}
          </div>

          <div className="flex flex-col gap-[8px]">
            <label htmlFor="new-password" className="text-[16px] font-bold">
              Новий пароль
            </label>
            <input
              type="password"
              id="new-password"
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              placeholder="Введіть новий пароль..."
              className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)] placeholder:text-[var(--color-background-25)]"
            />
            {formData.newPassword && (
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-300 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.strength}%` }}
                  />
                </div>
                <span className="text-sm text-gray-400">
                  {passwordStrength.strength === 100 ? 'Сильний' : 
                   passwordStrength.strength >= 60 ? 'Середній' : 'Слабкий'}
                </span>
              </div>
            )}
            {errors.newPassword && (
              <p className="text-red-400 text-sm">{errors.newPassword}</p>
            )}
            
            <input
              type="password"
              id="new-password-confirm"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Повторіть новий пароль..."
              className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)] placeholder:text-[var(--color-background-25)]"
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button 
            onClick={handleSubmit}
            disabled={resetPasswordMutation.isPending}
            className="h-[40px] w-[120px] rounded-[22px] bg-[var(--color-background-21)] text-[16px] font-medium text-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resetPasswordMutation.isPending ? 'Збереження...' : 'Зберегти'}
          </button>
        </div>
      </div>
    </div>
  )
}
