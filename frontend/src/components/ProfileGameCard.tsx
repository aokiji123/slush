import { FaStar, FaHeart } from 'react-icons/fa'
import { useGenreTranslation } from '@/utils/translateGenre'
import { OptimizedImage } from './OptimizedImage'

export interface ProfileGameCardProps {
  game: {
    id: string
    name: string
    mainImage: string
    genre: string[]
    rating: number
    developer?: string
    publisher?: string
    description?: string
    price?: number
    originalPrice?: number
    discount?: number
    discountValidUntil?: string
  }
  status?: 'inLibrary' | 'inWishlist' | 'shared'
  statusText?: string
  variant?: 'games' | 'wishlist'
  isInWishlist?: boolean
  onWishlistToggle?: () => void
  onAddToCart?: () => void
  onClick?: () => void
  className?: string
}

export const ProfileGameCard = ({
  game,
  status = 'inLibrary',
  statusText,
  variant = 'games',
  isInWishlist = false,
  onWishlistToggle,
  onAddToCart,
  onClick,
  className = ''
}: ProfileGameCardProps) => {
  const translateGenre = useGenreTranslation()

  const getStatusBadge = () => {
    const baseClasses = "px-[26px] py-[12px] rounded-[20px]"
    
    switch (status) {
      case 'inLibrary':
        return (
          <div className={`${baseClasses} bg-[rgba(55,195,255,0.25)]`}>
            <p className="text-[20px] font-artifakt-bold text-[rgba(204,248,255,0.65)]">
              {statusText || 'У Бібліотеці'}
            </p>
          </div>
        )
      case 'inWishlist':
        return (
          <div className={`${baseClasses} bg-[rgba(55,195,255,0.25)]`}>
            <p className="text-[20px] font-artifakt-bold text-[rgba(204,248,255,0.65)]">
              {statusText || 'У Списку бажань'}
            </p>
          </div>
        )
      case 'shared':
        return (
          <div className={`${baseClasses} bg-[rgba(55,195,255,0.25)]`}>
            <p className="text-[20px] font-artifakt-bold text-[rgba(204,248,255,0.65)]">
              {statusText || 'Спільна'}
            </p>
          </div>
        )
      default:
        return null
    }
  }

  const renderWishlistFeatures = () => {
    if (variant !== 'wishlist') return null

    return (
      <>
        {/* Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onWishlistToggle?.()
          }}
          className={`absolute top-[20px] right-[20px] p-[8px] rounded-[20px] transition-colors ${
            isInWishlist 
              ? 'bg-[#004a5b] text-[#f1fdff]' 
              : 'bg-[#046075] text-[rgba(204,248,255,0.65)] hover:text-[#f1fdff]'
          }`}
        >
          <FaHeart size={24} />
        </button>

        {/* Pricing Section */}
        {(game.price || game.originalPrice) && (
          <div className="flex flex-col gap-[8px]">
            {game.discount && (
              <div className="flex items-center gap-[8px]">
                <span className="bg-[#ff6f95] px-[8px] py-[4px] rounded-[20px] text-[14px] font-artifakt-bold text-[#00141f]">
                  -{game.discount}%
                </span>
                {game.discountValidUntil && (
                  <span className="text-[14px] font-artifakt text-[rgba(204,248,255,0.65)]">
                    Дійсна до {game.discountValidUntil}
                  </span>
                )}
              </div>
            )}
            
            <div className="flex items-center gap-[8px]">
              {game.price && (
                <span className="text-[20px] font-artifakt-bold text-[#f1fdff]">
                  {game.price}₴
                </span>
              )}
              {game.originalPrice && game.originalPrice > (game.price || 0) && (
                <span className="text-[16px] font-artifakt text-[rgba(204,248,255,0.65)] line-through">
                  {game.originalPrice}₴
                </span>
              )}
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        {onAddToCart && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAddToCart()
            }}
            className="bg-[#24e5c2] px-[26px] py-[12px] rounded-[20px] text-[20px] font-artifakt-medium text-[#00141f] hover:bg-[#1dd1a8] transition-colors"
          >
            У кошик
          </button>
        )}
      </>
    )
  }

  return (
    <div
      className={`bg-[#002f3d] rounded-[16px] p-[20px] flex gap-[20px] hover:bg-[#003a4a] transition-colors cursor-pointer relative ${className}`}
      onClick={onClick}
    >
      {/* Game Image */}
      <div className="flex-shrink-0">
        <OptimizedImage
          src={game.mainImage}
          alt={game.name}
          className="w-[320px] h-[174px] rounded-[12px] object-cover"
          placeholder="/game-image.png"
        />
      </div>

      {/* Game Content */}
      <div className="flex flex-col gap-[20px] w-full">
        {/* Header */}
        <div className={`flex flex-col ${variant === 'games' ? 'gap-[16px]' : 'gap-[12px]'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-[24px] font-bold text-[#f1fdff] font-manrope leading-[1.1]">
              {game.name}
            </h3>
          </div>

          {/* Genres */}
          <div className="flex items-center gap-[8px] flex-wrap">
            {game.genre.slice(0, 5).map((genre: string) => (
              <span
                key={genre}
                className="text-[14px] rounded-[20px] py-[4px] px-[12px] font-artifakt-bold text-[rgba(204,248,255,0.65)] bg-[rgba(55,195,255,0.25)]"
              >
                {translateGenre(genre)}
              </span>
            ))}
            {game.genre.length > 5 && (
              <span className="text-[14px] rounded-[20px] py-[4px] px-[12px] font-artifakt text-[rgba(204,248,255,0.65)] bg-[rgba(55,195,255,0.25)]">
                +{game.genre.length - 5}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between w-full items-center">
          {/* Rating */}
          <div className="flex items-center gap-[8px] h-[24px] justify-center">
            <p className="text-[20px] font-artifakt-bold text-[#f1fdff]">
              {game.rating.toFixed(1)}
            </p>
            <FaStar
              size={24}
              className="text-[#f1fdff]"
            />
          </div>

          {/* Status Badge or Wishlist Features */}
          {variant === 'games' ? (
            <div>
              {getStatusBadge()}
            </div>
          ) : (
            <div className="flex flex-col items-end gap-[12px]">
              {renderWishlistFeatures()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
