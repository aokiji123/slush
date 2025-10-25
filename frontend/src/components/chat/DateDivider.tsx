import { memo } from 'react'
import { format, isToday, isYesterday } from 'date-fns'
import { uk } from 'date-fns/locale'

interface DateDividerProps {
  date: string
}

export const DateDivider = memo<DateDividerProps>(({ date }) => {
  const formatDate = (dateString: string) => {
    try {
      const messageDate = new Date(dateString)
      
      if (isToday(messageDate)) {
        return 'Сьогодні'
      }
      
      if (isYesterday(messageDate)) {
        return 'Вчора'
      }
      
      return format(messageDate, 'd MMMM', { locale: uk })
    } catch {
      return 'Дата невідома'
    }
  }

  return (
    <div className="flex items-center gap-[16px] my-[30px]">
      <div className="flex-1 h-px bg-[#37C3FF]" />
      <p className="text-[rgba(204,248,255,0.65)] text-[16px] font-['Artifakt_Element'] font-bold whitespace-nowrap">
        {formatDate(date)}
      </p>
      <div className="flex-1 h-px bg-[#37C3FF]" />
    </div>
  )
})

DateDivider.displayName = 'DateDivider'
