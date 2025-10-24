import { useState, useRef } from 'react'
import { useUpdateUser, useUploadAvatar, useUploadBanner } from '@/api/queries/useUser'
import type { User } from '@/api/types/user'

interface EditProfileModalProps {
  user: User
  isOpen: boolean
  onClose: () => void
}

export const EditProfileModal = ({ user, isOpen, onClose }: EditProfileModalProps) => {
  const [formData, setFormData] = useState({
    nickname: user.nickname,
    bio: user.bio || '',
    lang: user.lang || 'uk',
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const updateUserMutation = useUpdateUser()
  const uploadAvatarMutation = useUploadAvatar()
  const uploadBannerMutation = useUploadBanner()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (event) => setAvatarPreview(event.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBannerFile(file)
      const reader = new FileReader()
      reader.onload = (event) => setBannerPreview(event.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Update user data
      await updateUserMutation.mutateAsync({
        userId: user.id,
        request: {
          id: user.id,
          nickname: formData.nickname,
          email: user.email,
          bio: formData.bio,
          lang: formData.lang,
        }
      })

      // Upload avatar if changed
      if (avatarFile) {
        await uploadAvatarMutation.mutateAsync({
          userId: user.id,
          file: avatarFile
        })
      }

      // Upload banner if changed
      if (bannerFile) {
        await uploadBannerMutation.mutateAsync({
          userId: user.id,
          file: bannerFile
        })
      }

      onClose()
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const isLoading = updateUserMutation.isPending || uploadAvatarMutation.isPending || uploadBannerMutation.isPending

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--color-background-8)] rounded-[20px] p-[32px] w-[600px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-[24px]">
          <h2 className="text-[24px] font-bold text-[var(--color-background)] font-manrope">
            Редактировать профиль
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--color-background-25)] hover:text-[var(--color-background)] transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-[24px]">
          {/* Avatar Upload */}
          <div>
            <label className="block text-[16px] font-medium text-[var(--color-background)] mb-[12px]">
              Аватар
            </label>
            <div className="flex items-center gap-[16px]">
              <div className="w-[80px] h-[80px] rounded-[12px] overflow-hidden bg-[var(--color-background-15)]">
                <img
                  src={avatarPreview || user.avatar}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="bg-[var(--color-background-21)] text-[var(--color-night-background)] px-[16px] py-[8px] rounded-[12px] font-medium text-[14px] hover:bg-[var(--color-background-23)] transition-colors"
                >
                  Загрузить
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Banner Upload */}
          <div>
            <label className="block text-[16px] font-medium text-[var(--color-background)] mb-[12px]">
              Баннер
            </label>
            <div className="w-full h-[120px] rounded-[12px] overflow-hidden bg-[var(--color-background-15)]">
              <img
                src={bannerPreview || user.banner}
                alt="Banner preview"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => bannerInputRef.current?.click()}
              className="mt-[12px] bg-[var(--color-background-21)] text-[var(--color-night-background)] px-[16px] py-[8px] rounded-[12px] font-medium text-[14px] hover:bg-[var(--color-background-23)] transition-colors"
            >
              Загрузить баннер
            </button>
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              className="hidden"
            />
          </div>

          {/* Nickname */}
          <div>
            <label className="block text-[16px] font-medium text-[var(--color-background)] mb-[12px]">
              Никнейм
            </label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleInputChange}
              className="w-full bg-[var(--color-background-15)] border border-[var(--color-background-18)] rounded-[12px] px-[16px] py-[12px] text-[var(--color-background)] placeholder:text-[var(--color-background-25)] placeholder:opacity-65 focus:outline-none focus:border-[var(--color-background-21)] transition-colors"
              placeholder="Введите никнейм"
              maxLength={50}
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-[16px] font-medium text-[var(--color-background)] mb-[12px]">
              О себе
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full bg-[var(--color-background-15)] border border-[var(--color-background-18)] rounded-[12px] px-[16px] py-[12px] text-[var(--color-background)] placeholder:text-[var(--color-background-25)] placeholder:opacity-65 focus:outline-none focus:border-[var(--color-background-21)] transition-colors resize-none"
              placeholder="Расскажите о себе"
              rows={4}
              maxLength={500}
            />
            <div className="text-[12px] text-[var(--color-background-25)] opacity-65 mt-[4px]">
              {formData.bio.length}/500
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block text-[16px] font-medium text-[var(--color-background)] mb-[12px]">
              Язык
            </label>
            <select
              name="lang"
              value={formData.lang}
              onChange={handleInputChange}
              className="w-full bg-[var(--color-background-15)] border border-[var(--color-background-18)] rounded-[12px] px-[16px] py-[12px] text-[var(--color-background)] focus:outline-none focus:border-[var(--color-background-21)] transition-colors"
            >
              <option value="uk">Українська</option>
              <option value="en">English</option>
              <option value="ru">Русский</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-[16px] justify-end pt-[8px]">
            <button
              type="button"
              onClick={onClose}
              className="px-[24px] py-[12px] rounded-[12px] border border-[var(--color-background-18)] text-[var(--color-background)] hover:bg-[var(--color-background-15)] transition-colors"
              disabled={isLoading}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[var(--color-background-21)] text-[var(--color-night-background)] px-[24px] py-[12px] rounded-[12px] font-medium hover:bg-[var(--color-background-23)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
