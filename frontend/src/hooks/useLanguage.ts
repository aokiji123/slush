import { useTranslation } from 'react-i18next'
import { useCallback, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthState } from '@/api/queries/useAuth'
import { useUpdateUser } from '@/api/queries/useUser'

export const useLanguage = () => {
  const { i18n } = useTranslation()
  const queryClient = useQueryClient()
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
        
        // Invalidate and refetch all game queries to force refetch with new language
        await queryClient.invalidateQueries({ predicate: (query) => 
          query.queryKey[0] === 'newGames' || 
          query.queryKey[0] === 'discountedGames' ||
          query.queryKey[0] === 'recommendedGames' ||
          query.queryKey[0] === 'gamesWithPriceLessThan' ||
          query.queryKey[0] === 'hitsGames' ||
          query.queryKey[0] === 'freeGames'
        })
        
        // Now refetch queries with new language
        await queryClient.refetchQueries({ predicate: (query) => 
          query.queryKey[0] === 'newGames' || 
          query.queryKey[0] === 'discountedGames' ||
          query.queryKey[0] === 'recommendedGames' ||
          query.queryKey[0] === 'gamesWithPriceLessThan' ||
          query.queryKey[0] === 'hitsGames' ||
          query.queryKey[0] === 'freeGames'
        })
        
        // If user is authenticated, update their profile
        if (isAuth && user && 'id' in user && typeof user.id === 'string') {
          try {
            // Map frontend language codes to backend language codes
            const mapLanguageCode = (frontendLang: string): string => {
              const mapping: Record<string, string> = {
                'uk': 'UA',
                'en': 'EN'
              }
              return mapping[frontendLang] || 'UA'
            }

            await updateUserMutation.mutateAsync({
              userId: user.id,
              request: {
                id: user.id,
                nickname: (user as any).nickname || user.username,
                email: user.email,
                bio: (user as any).bio || '',
                avatar: (user as any).avatar || undefined,
                banner: (user as any).banner || undefined,
                lang: mapLanguageCode(newLanguage),
              }
            })
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.warn('Failed to update user language preference:', error)
            }
            // Don't throw error - language change should still work locally
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to change language:', error)
        }
        throw error
      }
    },
    [i18n, isAuth, user, updateUserMutation, queryClient]
  )

  // Load user's preferred language on auth state change
  useEffect(() => {
    if (isAuth && user && 'lang' in user && typeof (user as any).lang === 'string') {
      // Map backend language codes to frontend language codes
      const mapBackendLanguageCode = (backendLang: string): string => {
        const mapping: Record<string, string> = {
          'UA': 'uk',
          'EN': 'en'
        }
        return mapping[backendLang] || 'uk'
      }

      const frontendLang = mapBackendLanguageCode((user as any).lang)
      
      // If user has a language preference and it's different from current
      if (frontendLang !== currentLanguage) {
        i18n.changeLanguage(frontendLang)
        localStorage.setItem('i18nextLng', frontendLang)
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
