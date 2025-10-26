import { formatPrice } from '@/utils/formatters'

interface GamePriceDisplayProps {
  price: number
  salePrice?: number
  discountPercent?: number
  freeText?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Displays game price with discount badge and strikethrough for original price
 * 
 * @example
 * ```tsx
 * <GamePriceDisplay 
 *   price={299} 
 *   salePrice={199} 
 *   discountPercent={25} 
 * />
 * ```
 */
export const GamePriceDisplay = ({ 
  price, 
  salePrice, 
  discountPercent, 
  freeText,
  size = 'md',
  className = '' 
}: GamePriceDisplayProps) => {
  const priceClasses = {
    sm: 'text-[16px]',
    md: 'text-[32px]',
    lg: 'text-[48px]'
  }

  const badgeSize = {
    sm: 'text-[14px] px-[8px] py-[4px]',
    md: 'text-[14px] px-[12px] py-[4px]',
    lg: 'text-[16px] px-[12px] py-[6px]'
  }

  // Free game
  if (price === 0) {
    return (
      <p className={`text-white font-bold font-manrope ${priceClasses[size]} ${className}`}>
        {freeText || 'Безкоштовно'}
      </p>
    )
  }

  // Game is on sale - salePrice must be greater than 0 and less than regular price
  const isOnSale = salePrice ? salePrice > 0 && salePrice < price : false

  return (
    <div className="flex items-center gap-[8px]">
      {isOnSale && discountPercent && discountPercent > 0 && (
        <p className={`rounded-[20px] bg-[var(--color-background-10)] text-black ${badgeSize[size]}`}>
          -{discountPercent}%
        </p>
      )}
      {isOnSale && salePrice && salePrice > 0 && (
        <p className={`text-white font-bold font-manrope ${priceClasses[size]}`}>
          {formatPrice(salePrice)}
        </p>
      )}
      <p
        className={`text-white font-${isOnSale ? 'extralight' : 'bold'} font-manrope ${priceClasses[size]} ${
          isOnSale
            ? 'line-through text-[var(--color-background-25)]'
            : ''
        }`}
      >
        {formatPrice(price)}
      </p>
    </div>
  )
}

