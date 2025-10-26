import { useState, useCallback } from 'react'
import { useToastStore } from '@/lib/toast-store'

interface ShareOptions {
  title?: string
  text?: string
  url?: string
}

/**
 * Custom hook for sharing content with native Web Share API and fallback options
 * 
 * @example
 * ```tsx
 * const { isSharing, share } = useShare()
 * 
 * const handleShare = () => {
 *   share({
 *     title: 'Game Title',
 *     text: 'Check out this game!',
 *     url: 'https://example.com/game'
 *   })
 * }
 * ```
 */
export const useShare = () => {
  const [isSharing, setIsSharing] = useState(false)
  const { success: showSuccess, error: showError } = useToastStore()

  const share = useCallback(async (options: ShareOptions) => {
    const { title = '', text = '', url = window.location.href } = options

    // Check if native Web Share API is available
    if (navigator.share && navigator.canShare) {
      try {
        setIsSharing(true)
        
        const shareData: ShareData = {
          title,
          text,
          url,
        }

        // Check if the data can be shared
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData)
          showSuccess('Вміст успішно поділено')
        } else {
          // Fallback to clipboard
          await fallbackToClipboard(title, text, url)
        }
      } catch (error: any) {
        // User cancelled or error occurred
        if (error.name !== 'AbortError') {
          console.error('Share failed:', error)
          // Try fallback
          await fallbackToClipboard(title, text, url)
        }
      } finally {
        setIsSharing(false)
      }
    } else {
      // Fallback to clipboard
      await fallbackToClipboard(title, text, url)
    }
  }, [showSuccess, showError])

  const shareToSocial = useCallback(async (
    platform: 'twitter' | 'facebook' | 'discord',
    options: ShareOptions
  ) => {
    const { title = '', text = '', url = window.location.href } = options
    const encodedTitle = encodeURIComponent(title)
    const encodedText = encodeURIComponent(text)
    const encodedUrl = encodeURIComponent(url)

    let shareUrl = ''

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}%20${encodedText}&url=${encodedUrl}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`
        break
      case 'discord':
        // Discord doesn't have a share URL, so we'll just copy to clipboard
        await fallbackToClipboard(title, text, url)
        return
      default:
        break
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
      showSuccess('Відкрито сторінку спільного доступу')
    }
  }, [showSuccess])

  const fallbackToClipboard = async (title: string, text: string, url: string) => {
    try {
      const shareText = [title, text, url].filter(Boolean).join('\n')
      await navigator.clipboard.writeText(shareText)
      showSuccess('Посилання скопійовано в буфер обміну')
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      showError('Не вдалося скопіювати посилання')
    }
  }

  return {
    isSharing,
    share,
    shareToSocial,
  }
}

