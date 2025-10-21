import { format, formatDistanceToNow, isBefore, subDays, type Locale } from 'date-fns'
import { enUS, uk } from 'date-fns/locale'

const locales: { [key: string]: Locale } = {
  en: enUS,
  uk: uk,
}

export const formatReviewDate = (dateString: string, lang: string = 'en'): string => {
  const date = new Date(dateString)
  const now = new Date()
  const locale = locales[lang] || enUS

  // If the date is within the last 24 hours
  if (isBefore(subDays(now, 1), date)) {
    return formatDistanceToNow(date, { addSuffix: true, locale })
  }

  // If the date is within the last 7 days
  if (isBefore(subDays(now, 7), date)) {
    return format(date, 'EEEE', { locale }) // e.g., "Monday"
  }

  // For older dates, use a specific format
  return format(date, 'dd.MM.yyyy', { locale }) // e.g., "21.02.2023"
}
