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
 */
export const formatPrice = (price: number, currency = '₴', freeText = 'Безкоштовно'): string => {
  return price === 0 ? freeText : `${price}${currency}`
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

