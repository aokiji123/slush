import { useState, useCallback } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
  onLoad?: () => void
  onError?: () => void
  placeholder?: string
  blurDataURL?: string
}

export const OptimizedImage = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  onLoad,
  onError,
  placeholder,
  blurDataURL,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    setHasError(true)
    onError?.()
  }, [onError])

  // If src is empty or undefined, use placeholder or default image
  const imageSrc = src || placeholder || '/game-image.png'

  if (hasError && placeholder) {
    return (
      <img
        src={placeholder}
        alt={alt}
        className={className}
        loading={loading}
      />
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blur placeholder */}
      {blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
          aria-hidden="true"
        />
      )}
      
      {/* Main image */}
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}
