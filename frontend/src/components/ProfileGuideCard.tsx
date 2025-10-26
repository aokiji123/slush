import { useNavigate } from '@tanstack/react-router'
import { useLikeToggle } from '@/hooks/useLikeToggle'
import { useShare } from '@/hooks/useShare'
import { formatRelativeDate } from '@/utils/formatters'
import { BsThreeDots } from 'react-icons/bs'
import type { PostDto } from '@/types/community'
import { OptimizedImage } from './OptimizedImage'
import { PostActionButtons } from './PostActionButtons'

export interface ProfileGuideCardProps {
  post: PostDto
  onNavigate?: () => void
  className?: string
}

export const ProfileGuideCard = ({ 
  post, 
  onNavigate, 
  className = '' 
}: ProfileGuideCardProps) => {
  const navigate = useNavigate()
  const { share } = useShare()
  
  const { isLiked, likesCount, handleLike } = useLikeToggle({
    itemId: post.id,
    initialLikesCount: post.likesCount || 0
  })

  const handlePostClick = () => {
    if (onNavigate) {
      onNavigate()
    }
    navigate({
      to: '/$slug/community/post/$id',
      params: { slug: post.gameId || 'default', id: post.id },
    })
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await share({
      title: post.title,
      text: post.content || '',
      url: `${window.location.origin}/${post.gameId}/community/post/${post.id}`
    })
  }

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation()
    handlePostClick()
  }

  const getThumbnail = () => {
    if (post.media.length > 0) {
      return post.media[0]?.file || '/game-image.png'
    }
    return post.gameMainImage || '/game-image.png'
  }

  return (
    <div
      className={`bg-[#002f3d] rounded-[20px] p-[24px] hover:bg-[#003a4a] transition-colors cursor-pointer ${className}`}
      onClick={handlePostClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-[16px]">
        <div className="flex items-center gap-[12px]">
          {/* Game Badge */}
          {post.gameMainImage && (
            <div className="flex items-center gap-[8px]">
              <img
                src={post.gameMainImage}
                alt="Game"
                className="w-[36px] h-[36px] rounded-full object-cover"
              />
              <span className="px-[12px] py-[4px] bg-[#046075] rounded-[20px] text-[14px] font-artifakt-bold text-[#f1fdff]">
                {post.gameId}
              </span>
            </div>
          )}
          
          {/* Date */}
          <span className="text-[14px] font-artifakt text-[rgba(204,248,255,0.65)]">
            {formatRelativeDate(post.createdAt)}
          </span>
        </div>

        {/* Menu Button */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-[8px] hover:bg-[rgba(255,255,255,0.1)] rounded-[8px] transition-colors"
        >
          <BsThreeDots size={16} className="text-[rgba(204,248,255,0.65)]" />
        </button>
      </div>

      {/* Content */}
      <div className="flex gap-[20px]">
        {/* Thumbnail */}
        <div className="flex-shrink-0">
          <OptimizedImage
            src={getThumbnail()}
            alt={post.title}
            className="w-[200px] h-[120px] rounded-[20px] object-cover"
            placeholder="/game-image.png"
          />
        </div>

        {/* Text Content */}
        <div className="flex flex-col gap-[12px] flex-1">
          {/* Title */}
          <h3 className="text-[20px] font-bold text-[#f1fdff] font-manrope line-clamp-2 leading-[1.2]">
            {post.title}
          </h3>

          {/* Description */}
          {post.content && (
            <p className="text-[16px] text-[rgba(204,248,255,0.8)] font-artifakt line-clamp-3 leading-[1.5]">
              {post.content}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-[20px]">
        <PostActionButtons
          likesCount={likesCount}
          commentsCount={post.commentsCount || 0}
          isLiked={isLiked}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
        />
      </div>
    </div>
  )
}
