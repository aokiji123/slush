import type { ReactNode } from 'react'

type MediaType = 'image' | 'video'

interface MediaThumbnailProps {
  /** Media source URL */
  src: string
  /** Alt text for the media */
  alt: string
  /** Type of media (image or video) */
  type: MediaType
  /** Overlay content to display on hover */
  overlay?: ReactNode
  /** Click handler */
  onClick?: () => void
  /** Additional CSS classes */
  className?: string
  /** Width of the thumbnail */
  width?: string
  /** Height of the thumbnail */
  height?: string
}

/**
 * A reusable media thumbnail component for images and videos.
 * Used in ScreenshotGallery, VideoGallery, and other media displays.
 * 
 * @example
 * ```tsx
 * <MediaThumbnail
 *   src="/screenshot.jpg"
 *   alt="Game screenshot"
 *   type="image"
 *   width="345px"
 *   height="184px"
 *   onClick={handleClick}
 * />
 * ```
 */
export const MediaThumbnail = ({ 
  src, 
  alt, 
  type, 
  overlay, 
  onClick, 
  className = '',
  width = '100%',
  height = 'auto'
}: MediaThumbnailProps) => {
  const baseStyles = 'bg-[var(--color-background-15)] rounded-[16px] overflow-hidden relative group'
  const clickableStyles = onClick ? 'cursor-pointer' : ''
  
  return (
    <div
      className={`${baseStyles} ${clickableStyles} ${className}`}
      style={{ width, height }}
      onClick={onClick}
    >
      {type === 'video' ? (
        <video
          src={src}
          className="w-full h-full object-cover"
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      )}
      
      {overlay && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {overlay}
        </div>
      )}
    </div>
  )
}
