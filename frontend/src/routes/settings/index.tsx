import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { ChangeImageIcon } from '@/icons'
import { Select } from '@/components/Select'
import { useAuthenticatedUser, useUpdateUser, useUploadAvatar } from '@/api/queries/useUser'
import type { UserUpdateRequest } from '@/api/types/user'

export const Route = createFileRoute('/settings/')({
  component: RouteComponent,
})

const languageOptions = [
  {
    value: 'uk',
    label: 'Українська',
    icon: '/ua.svg',
  },
  {
    value: 'en',
    label: 'English',
    icon: '/english.svg',
  },
]

function RouteComponent() {
  const { data: user, isLoading: userLoading } = useAuthenticatedUser()
  const updateUserMutation = useUpdateUser()
  const uploadAvatarMutation = useUploadAvatar()
  
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    bio: '',
    lang: 'uk',
  })
  const [originalData, setOriginalData] = useState(formData)
  const [isDirty, setIsDirty] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Initialize form data when user data loads
  useEffect(() => {
    if (user) {
      const userData = {
        nickname: user.nickname || '',
        email: user.email || '',
        bio: user.bio || '',
        lang: user.lang || 'uk',
      }
      setFormData(userData)
      setOriginalData(userData)
    }
  }, [user])

  // Check if form is dirty
  useEffect(() => {
    const dirty = JSON.stringify(formData) !== JSON.stringify(originalData)
    setIsDirty(dirty)
  }, [formData, originalData])

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleLanguageChange = (value: string) => {
    handleInputChange('lang', value)
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    try {
      await uploadAvatarMutation.mutateAsync({ userId: user.id, file })
      setMessage({ type: 'success', text: 'Аватар успішно оновлено!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Помилка завантаження аватара' })
    }
  }

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Convert to base64 for now (since no banner upload endpoint)
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      // Store in form data, will be sent with profile update
      setFormData(prev => ({ ...prev, banner: base64 }))
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!user) return

    try {
      const updateRequest: UserUpdateRequest = {
        id: user.id,
        nickname: formData.nickname,
        email: formData.email,
        bio: formData.bio,
        lang: formData.lang,
        avatar: user.avatar,
        banner: formData.bio, // Using bio field as placeholder for banner
      }

      await updateUserMutation.mutateAsync({ userId: user.id, request: updateRequest })
      setOriginalData(formData)
      setIsDirty(false)
      setMessage({ type: 'success', text: 'Профіль успішно оновлено!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Помилка оновлення профілю' })
    }
  }

  const handleCancel = () => {
    setFormData(originalData)
    setIsDirty(false)
    setMessage(null)
  }

  if (userLoading) {
    return <div className="flex items-center justify-center h-64">Завантаження...</div>
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
    <div className="w-full bg-[var(--color-background-15)] rounded-[20px] overflow-hidden text-white">
      {/* Message Display */}
      {message && (
        <div className={`p-4 m-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          {message.text}
        </div>
      )}

      <div className="w-full relative">
        <img
          src={user.banner || "/banner-settings.jpg"}
          alt="Banner for settings page"
          className="w-full h-[175px] object-cover rounded-none"
        />
        <label className="bg-white rounded-full p-[8px] absolute bottom-[16px] right-[16px] cursor-pointer">
          <ChangeImageIcon className="text-black" />
          <input
            type="file"
            accept="image/*"
            onChange={handleBannerUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="p-[24px] w-full flex flex-col justify-between min-h-[600px]">
        <div className="flex gap-[24px]">
          <div className="w-[20%]">
            <div className="w-full relative">
              <img
                src={user.avatar || "/avatar-settings.png"}
                alt="Avatar"
                className="w-full h-full object-cover rounded-full"
              />
              <label className="bg-[var(--color-background-16)] rounded-full p-[8px] absolute bottom-0 right-[10px] cursor-pointer">
                <ChangeImageIcon className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <div className="w-[80%] flex flex-col gap-[24px]">
            <div className="flex items-center gap-[20px]">
              <div className="w-1/2 flex flex-col gap-[8px]">
                <label htmlFor="nickname" className="text-[16px] font-bold">
                  Нікнейм
                </label>
                <input
                  id="nickname"
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => handleInputChange('nickname', e.target.value)}
                  className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)] placeholder:text-[var(--color-background-25)]"
                  placeholder="Нікнейм"
                />
              </div>
              <div className="w-1/2 flex flex-col gap-[8px]">
                <label htmlFor="email" className="text-[16px] font-bold">
                  Ел. пошта
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)] placeholder:text-[var(--color-background-25)]"
                  placeholder="example@gmail.com"
                />
              </div>
            </div>
            <div className="flex flex-col gap-[8px]">
              <div className="flex items-center justify-between">
                <p className="text-[16px] font-bold">Про себе</p>
                <p className="text-[var(--color-background-25)] text-[12px]">
                  {formData.bio.length}/100
                </p>
              </div>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                maxLength={100}
                className="w-full h-[85px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)] placeholder:text-[var(--color-background-25)] resize-none"
                placeholder="Готовий до нових перемог! Кожна гра – це новий шанс довести свою майстерність та досягти нових вершин."
              />
            </div>
            <div className="flex flex-col gap-[8px] max-w-[400px] w-full">
              <label htmlFor="language" className="text-[16px] font-bold">
                Мова сайту
              </label>
              <Select
                options={languageOptions}
                value={formData.lang}
                onChange={handleLanguageChange}
                placeholder="Оберіть мову..."
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-[12px]">
          <button 
            onClick={handleCancel}
            disabled={!isDirty || updateUserMutation.isPending}
            className="h-[40px] w-[120px] text-[16px] text-[var(--color-background-19)] font-normal cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Скасувати
          </button>
          <button 
            onClick={handleSave}
            disabled={!isDirty || updateUserMutation.isPending}
            className="h-[40px] w-[120px] rounded-[20px] bg-[var(--color-background-21)] text-[16px] font-normal text-black cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateUserMutation.isPending ? 'Збереження...' : 'Зберегти'}
          </button>
        </div>
      </div>
    </div>
  )
}
