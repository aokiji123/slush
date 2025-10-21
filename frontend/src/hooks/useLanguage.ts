import { useTranslation } from 'react-i18next'
import { useCallback, useEffect } from 'react'
import { useAuthState } from '@/api/queries/useAuth'
import { useUpdateUser } from '@/api/queries/useUser'

export const useLanguage = () => {
  const { i18n } = useTranslation()
  const { user, isAuth } = useAuthState()
  const updateUserMutation = useUpdateUser()

  // Get current language
  const currentLanguage = i18n.language

  // Change language function
  const changeLanguage = useCallback(
    async (newLanguage: string) => {
      try {
        // Update i18next instance
        await i18n.changeLanguage(newLanguage)
        
        // Save to localStorage for all users
        localStorage.setItem('i18nextLng', newLanguage)
        
        // If user is authenticated, update their profile
        if (isAuth && user && 'id' in user && typeof user.id === 'string') {
          try {
            await updateUserMutation.mutateAsync({
              userId: user.id,
              request: {
                id: user.id,
                nickname: (user as any).nickname || user.username,
                email: user.email,
                bio: (user as any).bio || '',
                avatar: (user as any).avatar || undefined,
                banner: (user as any).banner || undefined,
                lang: newLanguage,
              }
            })
          } catch (error) {
            console.warn('Failed to update user language preference:', error)
            // Don't throw error - language change should still work locally
          }
        }
      } catch (error) {
        console.error('Failed to change language:', error)
        throw error
      }
    },
    [i18n, isAuth, user, updateUserMutation]
  )

  // Load user's preferred language on auth state change
  useEffect(() => {
    if (isAuth && user && 'lang' in user && typeof (user as any).lang === 'string') {
      // If user has a language preference and it's different from current
      if ((user as any).lang !== currentLanguage) {
        i18n.changeLanguage((user as any).lang)
        localStorage.setItem('i18nextLng', (user as any).lang)
      }
    } else if (!isAuth) {
      // For non-authenticated users, use localStorage or browser default
      const storedLanguage = localStorage.getItem('i18nextLng')
      if (storedLanguage && storedLanguage !== currentLanguage) {
        i18n.changeLanguage(storedLanguage)
      }
    }
  }, [isAuth, user, currentLanguage, i18n])

  return {
    currentLanguage,
    changeLanguage,
    isChangingLanguage: updateUserMutation.isPending,
  }
}
