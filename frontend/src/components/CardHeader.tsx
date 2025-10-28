import { formatSimpleDate } from '@/utils/formatters'

interface CardHeaderProps {
  avatar?: string
  username: string
  date?: string
  className?: string
  avatarSize?: 'sm' | 'md' | 'lg'
  isOnline?: boolean
}

const avatarSizes = {
  sm: 'w-5 h-5 md:w-6 md:h-6',
  md: 'w-8 h-8 md:w-9 md:h-9',
  lg: 'w-10 h-10 md:w-12 md:h-12',
}

export const CardHeader = ({ 
  avatar, 
  username, 
  date, 
  className = '', 
  avatarSize = 'md',
  isOnline = false,
}: CardHeaderProps) => {
  const sizeClass = avatarSizes[avatarSize]

  return (
    <div className={`flex items-center gap-2 md:gap-3 ${className}`}>
      <div className="relative">
        <img
          src={avatar || '/avatar.png'}
          alt={username}
          className={`${sizeClass} rounded-full object-cover`}
        />
        {isOnline && (
          <div className="absolute bottom-0 left-[72.73%] right-0 top-[72.73%]">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="6"
                cy="6"
                r="5"
                fill="#8EFF72"
                stroke="#002F3D"
                strokeWidth="2"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <div className="bg-[#004252] rounded-[16px] md:rounded-[20px] flex items-center gap-2 md:gap-3 pr-2 md:pr-4">
          <span className="text-[14px] md:text-[16px] font-bold text-[#f1fdff] truncate max-w-[120px] sm:max-w-none">
            {username}
          </span>
        </div>
        {date && (
          <span className="text-[12px] md:text-[14px] text-[rgba(204,248,255,0.65)] whitespace-nowrap">
            {formatSimpleDate(date)}
          </span>
        )}
      </div>
    </div>
  )
}
