import { BsThreeDots } from 'react-icons/bs'
import { OptimizedImage } from './OptimizedImage'

interface PostAuthorBadgeProps {
  avatar?: string
  username: string
  className?: string
  showMenu?: boolean
}

/**
 * Displays an author's avatar and username with an optional menu button
 * 
 * @example
 * ```tsx
 * <PostAuthorBadge 
 *   avatar="/avatar.png" 
 *   username="john_doe" 
 * />
 * ```
 */
export const PostAuthorBadge = ({ 
  avatar, 
  username, 
  className = '',
  showMenu = false
}: PostAuthorBadgeProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className={`relative bg-[var(--color-background-8)] pl-[36px] pr-[12px] h-[28px] rounded-[20px] flex items-center justify-end w-fit text-white ${className}`}>
        <OptimizedImage
          src={avatar || "/avatar.png"}
          alt={username}
          className="w-[28px] h-[28px] object-cover rounded-full absolute top-0 left-0"
          loading="lazy"
        />
        <p className="text-right text-[16px] font-medium">
          {username}
        </p>
      </div>
      {showMenu && (
        <BsThreeDots size={24} className="cursor-pointer text-white" />
      )}
    </div>
  )
}

