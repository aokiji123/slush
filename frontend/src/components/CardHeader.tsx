import { formatSimpleDate } from '@/utils/formatters'

interface CardHeaderProps {
  /** User avatar URL */
  avatar?: string
  /** Username to display */
  username: string
  /** Date to display */
  date?: string
  /** Additional CSS classes */
  className?: string
  /** Avatar size */
  avatarSize?: 'sm' | 'md' | 'lg'
  /** Whether to show online indicator */
  isOnline?: boolean
}

const avatarSizes = {
  sm: 'w-6 h-6',
  md: 'w-9 h-9',
  lg: 'w-12 h-12',
}

/**
 * A reusable card header component for displaying user information.
 * Used in posts, reviews, guides, and comments.
 * 
 * @example
 * ```tsx
 * <CardHeader
 *   avatar="/avatar.jpg"
 *   username="JohnDoe"
 *   date="2024-01-15"
 *   isOnline={true}
 * />
 * ```
 */
export const CardHeader = ({ 
  avatar, 
  username, 
  date, 
  className = '', 
  avatarSize = 'md',
  isOnline = false 
}: CardHeaderProps) => {
  const sizeClass = avatarSizes[avatarSize]
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
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
              xmlns="http://www.w3.org/200vg"
            >
              <circle cx="6" cy="6" r="5" fill="#8EFF72" stroke="#002F3D" strokeWidth="2" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="bg-[#004252] rounded-[20px] flex items-center gap-3 pr-4">
          <span className="text-[16px] font-bold text-[#f1fdff]">
            {username}
          </span>
        </div>
        {date && (
          <span className="text-[14px] text-[rgba(204,248,255,0.65)]">
            {formatSimpleDate(date)}
          </span>
        )}
      </div>
    </div>
  )
}
