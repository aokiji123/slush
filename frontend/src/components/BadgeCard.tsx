import { OptimizedImage } from './OptimizedImage'
import { formatSimpleDate } from '@/utils/formatters'

interface BadgeCardProps {
  badge: {
    id: string
    name: string
    description: string
    icon: string
    requiredValue: number
    earnedAt: string
  }
}

export const BadgeCard = ({ badge }: BadgeCardProps) => {
  return (
    <div className="bg-[var(--color-background-15)] rounded-[12px] p-[20px] flex gap-[20px] items-center w-full h-[150px]">
      {/* Badge Icon */}
      <div className="flex-shrink-0 w-[110px] h-[110px] overflow-hidden rounded-[8px]">
        <OptimizedImage
          src={badge.icon}
          alt={badge.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Badge Content */}
      <div className="flex-1 flex flex-col justify-between h-full">
        {/* Title and Description */}
        <div className="flex flex-col gap-[8px]">
          <h3 className="text-[20px] font-bold text-[var(--color-background)] font-manrope leading-[1.2]">
            {badge.name}
          </h3>
          <p className="text-[16px] text-[var(--color-background)] font-artifakt leading-[1.5] tracking-[-0.16px]">
            {badge.description}
          </p>
        </div>

        {/* Footer with Points and Date */}
        <div className="flex justify-between items-center text-[16px] text-[rgba(204,248,255,0.65)] font-artifakt leading-[1.25] tracking-[-0.16px]">
          <span>{badge.requiredValue} очок</span>
          <span>{formatSimpleDate(badge.earnedAt)}</span>
        </div>
      </div>
    </div>
  )
}
