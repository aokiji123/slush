import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ChangeImageIcon } from '@/icons'
import { Select } from '@/components/Select'
import { useAuthenticatedUser, useUpdateUser, useUploadAvatar, useUploadBanner } from '@/api/queries/useUser'
import { useLanguage } from '@/hooks/useLanguage'
import type { UserUpdateRequest } from '@/api/types/user'

export const Route = createFileRoute('/settings/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation('settings')
  const { data: user, isLoading: userLoading } = useAuthenticatedUser()
  const updateUserMutation = useUpdateUser()
  const uploadAvatarMutation = useUploadAvatar()
  const uploadBannerMutation = useUploadBanner()
  const { changeLanguage } = useLanguage()

  const languageOptions = [
    {
      value: 'uk',
      label: t('general.languageOptions.uk'),
      icon: '/ua.svg',
    },
    {
      value: 'en',
      label: t('general.languageOptions.en'),
      icon: '/english.svg',
    },
  ]
  
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    bio: '',
    lang: 'uk',
  })
  const [originalData, setOriginalData] = useState(formData)
  const [isDirty, setIsDirty] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Map backend language codes to frontend language codes
  const mapBackendLanguageCode = (backendLang: string): string => {
    const mapping: Record<string, string> = {
      'UA': 'uk',
      'EN': 'en'
    }
    return mapping[backendLang] || 'uk'
  }

  // Initialize form data when user data loads
  useEffect(() => {
    if (user) {
      const userData = {
        nickname: user.nickname || '',
        email: user.email || '',
        bio: user.bio || '',
        lang: mapBackendLanguageCode(user.lang || 'UA'),
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

  const handleLanguageChange = async (value: string) => {
    try {
      await changeLanguage(value)
      setMessage({ type: 'success', text: t('general.success') })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: t('general.error') })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    try {
      await uploadAvatarMutation.mutateAsync({ userId: user.id, file })
      setMessage({ type: 'success', text: t('general.avatarSuccess') })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: t('general.avatarError') })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    try {
      await uploadBannerMutation.mutateAsync({ userId: user.id, file })
      setMessage({ type: 'success', text: t('general.bannerSuccess') })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: t('general.bannerError') })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  // Map frontend language codes to backend language codes
  const mapLanguageCode = (frontendLang: string): string => {
    const mapping: Record<string, string> = {
      'uk': 'UA',
      'en': 'EN'
    }
    return mapping[frontendLang] || 'UA'
  }

  const handleSave = async () => {
    if (!user) return

    // Client-side validation
    if (!formData.nickname || formData.nickname.trim().length < 2) {
      setMessage({ type: 'error', text: 'Nickname must be at least 2 characters long' })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    if (formData.nickname.trim().length > 50) {
      setMessage({ type: 'error', text: 'Nickname cannot exceed 50 characters' })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    // Check nickname format (only letters, numbers, underscores, and hyphens)
    const nicknameRegex = /^[a-zA-Z0-9_-]+$/
    if (!nicknameRegex.test(formData.nickname.trim())) {
      setMessage({ type: 'error', text: 'Nickname can only contain letters, numbers, underscores, and hyphens' })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    if (!formData.email || !formData.email.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    if (formData.bio && formData.bio.length > 500) {
      setMessage({ type: 'error', text: 'Bio cannot exceed 500 characters' })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    try {
      const updateRequest: UserUpdateRequest = {
        id: user.id,
        nickname: formData.nickname.trim(),
        email: formData.email.trim(),
        bio: formData.bio?.trim() || '',
        lang: mapLanguageCode(formData.lang),
        avatar: user.avatar,
        banner: user.banner,
      }

      // Debug: Log the request data
      console.log('Sending update request:', updateRequest)
      console.log('Form data:', formData)
      console.log('Mapped language:', mapLanguageCode(formData.lang))

      await updateUserMutation.mutateAsync({ userId: user.id, request: updateRequest })
      setOriginalData(formData)
      setIsDirty(false)
      setMessage({ type: 'success', text: t('general.success') })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Update user error:', error)
      
      // Try to extract the actual error message from the backend
      let errorMessage = t('general.error')
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message
        } else if (axiosError.response?.data?.error) {
          errorMessage = axiosError.response.data.error
        }
      }
      
      setMessage({ type: 'error', text: errorMessage })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleCancel = () => {
    setFormData(originalData)
    setIsDirty(false)
    setMessage(null)
  }

  if (userLoading) {
    return <div className="flex items-center justify-center h-64">{t('common.loading')}</div>
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-white text-lg mb-4">{t('auth.loginRequired')}</p>
          <a 
            href="/login" 
            className="inline-block px-6 py-2 bg-[var(--color-background-21)] text-black rounded-lg hover:opacity-80"
          >
            {t('header.login')}
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
            <div className="w-full relative aspect-square">
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
                  {t('general.nicknameLabel')}
                </label>
                <input
                  id="nickname"
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => handleInputChange('nickname', e.target.value)}
                  className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)] placeholder:text-[var(--color-background-25)]"
                  placeholder={t('general.nicknamePlaceholder')}
                />
              </div>
              <div className="w-1/2 flex flex-col gap-[8px]">
                <label htmlFor="email" className="text-[16px] font-bold">
                  {t('general.emailLabel')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)] placeholder:text-[var(--color-background-25)]"
                  placeholder={t('general.emailPlaceholder')}
                />
              </div>
            </div>
            <div className="flex flex-col gap-[8px]">
              <div className="flex items-center justify-between">
                <p className="text-[16px] font-bold">{t('general.bioLabel')}</p>
                <p className="text-[var(--color-background-25)] text-[12px]">
                  {formData.bio.length}/100
                </p>
              </div>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                maxLength={100}
                className="w-full h-[85px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)] placeholder:text-[var(--color-background-25)] resize-none"
                placeholder={t('general.bioPlaceholder')}
              />
            </div>
            <div className="flex flex-col gap-[8px] max-w-[400px] w-full">
              <label htmlFor="language" className="text-[16px] font-bold">
                {t('general.languageLabel')}
              </label>
              <Select
                options={languageOptions}
                value={formData.lang}
                onChange={handleLanguageChange}
                placeholder={t('general.languageLabel')}
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
            {t('common.cancel')}
          </button>
          <button 
            onClick={handleSave}
            disabled={!isDirty || updateUserMutation.isPending}
            className="h-[40px] w-[120px] rounded-[20px] bg-[var(--color-background-21)] text-[16px] font-normal text-black cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateUserMutation.isPending ? t('common.saving') : t('common.save')}
          </button>
        </div>
      </div>
    </div>
  )
}
