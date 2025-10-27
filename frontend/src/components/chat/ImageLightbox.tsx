import { memo, useEffect, useCallback, useRef } from 'react'
import { useClickOutside } from '@/hooks'

interface ImageLightboxProps {
  imageUrl: string | null
  onClose: () => void
}

export const ImageLightbox = memo<ImageLightboxProps>(({ imageUrl, onClose }) => {
  const lightboxRef = useRef<HTMLDivElement>(null)
  
  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (imageUrl) {
      document.addEventListener('keydown', handleEsc)
      // Prevent body scroll when lightbox is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [imageUrl, onClose])

  // Handle click outside
  useClickOutside(lightboxRef as React.RefObject<HTMLElement>, onClose)

  // Handle download
  const handleDownload = useCallback(async () => {
    if (!imageUrl) return

    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `image-${Date.now()}.${blob.type.split('/')[1]}`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download image:', error)
    }
  }, [imageUrl])

  if (!imageUrl) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90" ref={lightboxRef as React.Ref<HTMLDivElement>}>
      <div className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-[-40px] right-0 w-[32px] h-[32px] flex items-center justify-center bg-[var(--color-surface)] hover:bg-[var(--color-background-15)] rounded-[8px] transition-colors"
          aria-label="Close lightbox"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4 12M4 4L12 12" stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Download button */}
        <button
          onClick={handleDownload}
          className="absolute top-[-40px] right-[40px] w-[32px] h-[32px] flex items-center justify-center bg-[var(--color-surface)] hover:bg-[var(--color-background-15)] rounded-[8px] transition-colors"
          aria-label="Download image"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 2V11M8 11L11 8M8 11L5 8M14 14H2" stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Image */}
        <img
          src={imageUrl}
          alt="Lightbox"
          className="max-w-full max-h-[90vh] object-contain rounded-[12px]"
        />
      </div>
    </div>
  )
})

ImageLightbox.displayName = 'ImageLightbox'

