/**
 * Utility functions for formatting data across the application
 */

/**
 * Formats a number into a readable count string
 * @example formatCount(1234) => "1.2k"
 * @example formatCount(1234567) => "1.2M"
 */
export const formatCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return count.toString()
}

/**
 * Formats a price with currency symbol
 * @example formatPrice(0) => "Безкоштовно"
 * @example formatPrice(299) => "299₴"
 * @example formatPrice(4090.0600000000004) => "4090.06₴"
 */
export const formatPrice = (price: number, currency = '₴', freeText = 'Безкоштовно'): string => {
  if (price === 0) return freeText
  // Round to 2 decimal places to handle floating point precision issues
  const roundedPrice = Math.round(price * 100) / 100
  // Format with 2 decimal places only if there's a decimal part
  const formattedPrice = roundedPrice % 1 === 0 
    ? roundedPrice.toString() 
    : roundedPrice.toFixed(2)
  return `${formattedPrice}${currency}`
}

/**
 * Formats a date in Ukrainian locale format
 * @example formatSimpleDate("2024-01-15") => "15.01.2024"
 */
export const formatSimpleDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * Formats a date as relative time (e.g., "2 год. тому", "5 дн. тому")
 * @example formatRelativeDate("2024-01-15") => "2 дн. тому"
 */
export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Щойно'
  if (diffInHours < 24) return `${diffInHours} год. тому`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} дн. тому`
  
  return date.toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

