export const formatCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return count.toString()
}

export const formatPrice = (
  price: number,
  currency = '₴',
  freeText = 'Безкоштовно',
): string => {
  if (price === 0) return freeText
  const roundedPrice = Math.round(price * 100) / 100
  const formattedPrice =
    roundedPrice % 1 === 0 ? roundedPrice.toString() : roundedPrice.toFixed(2)
  return `${formattedPrice}${currency}`
}

export const formatSimpleDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60),
  )

  if (diffInHours < 1) return 'Щойно'
  if (diffInHours < 24) return `${diffInHours} год. тому`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} дн. тому`

  return date.toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
