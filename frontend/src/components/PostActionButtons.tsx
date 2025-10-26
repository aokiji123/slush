import { FavoriteIcon, FavoriteFilledIcon, CommentsIcon } from '@/icons'
import { FaShare } from 'react-icons/fa'

interface PostActionButtonsProps {
  likesCount: number
  commentsCount: number
  onLike: (e: React.MouseEvent) => void
  onComment: (e: React.MouseEvent) => void
  onShare: (e: React.MouseEvent) => void
  isLiked: boolean
  shareText?: string
  className?: string
}

/**
 * Reusable action buttons for posts (like, comment, share)
 * 
 * @example
 * ```tsx
 * <PostActionButtons
 *   likesCount={10}
 *   commentsCount={5}
 *   isLiked={false}
 *   onLike={handleLike}
 *   onComment={handleComment}
 *   onShare={handleShare}
 * />
 * ```
 */
export const PostActionButtons = ({
  likesCount,
  commentsCount,
  onLike,
  onComment,
  onShare,
  isLiked,
  shareText = 'Поділитись',
  className = ''
}: PostActionButtonsProps) => {
  return (
    <div className={`flex items-center gap-[24px] ${className}`}>
      {/* Like Button */}
      <button
        onClick={onLike}
        className="flex items-center gap-[8px] bg-[rgba(55,195,255,0.12)] px-[8px] py-[4px] rounded-[8px] text-[rgba(204,248,255,0.65)] hover:text-[#24E5C2] transition-colors"
      >
        {isLiked ? (
          <FavoriteFilledIcon className="text-[#24E5C2] w-[24px] h-[24px]" />
        ) : (
          <FavoriteIcon className="w-[24px] h-[24px]" />
        )}
        <span className="text-[16px] font-artifakt-medium">{likesCount}</span>
      </button>

      {/* Comment Button */}
      <button
        onClick={onComment}
        className="flex items-center gap-[8px] bg-[rgba(55,195,255,0.12)] px-[8px] py-[4px] rounded-[8px] text-[rgba(204,248,255,0.65)] hover:text-[#24E5C2] transition-colors"
      >
        <CommentsIcon className="w-[24px] h-[24px]" />
        <span className="text-[16px] font-artifakt-medium">{commentsCount}</span>
      </button>

      {/* Share Button */}
      <button
        onClick={onShare}
        className="flex items-center gap-[8px] bg-[rgba(55,195,255,0.12)] px-[8px] py-[4px] rounded-[8px] text-[rgba(204,248,255,0.65)] hover:text-[#24E5C2] transition-colors"
      >
        <FaShare className="w-[24px] h-[24px]" />
        <span className="text-[16px] font-artifakt-medium">{shareText}</span>
      </button>
    </div>
  )
}

