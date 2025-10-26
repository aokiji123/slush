import { useNavigate } from '@tanstack/react-router'
import { useLikeToggle } from '@/hooks/useLikeToggle'
import { useShare } from '@/hooks/useShare'
import { formatRelativeDate } from '@/utils/formatters'
import { BsThreeDots } from 'react-icons/bs'
import type { PostDto } from '@/types/community'
import { MediaType } from '@/types/community'
import { OptimizedImage } from './OptimizedImage'
import { PostActionButtons } from './PostActionButtons'

export interface ProfileDiscussionCardProps {
  post: PostDto
  onNavigate?: () => void
  className?: string
}

export const ProfileDiscussionCard = ({ 
  post, 
  onNavigate, 
  className = '' 
}: ProfileDiscussionCardProps) => {
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

  const renderMedia = () => {
    if (post.media.length === 0) return null
    
    const firstMedia = post.media[0]
    if (firstMedia?.type !== MediaType.Image) return null

    return (
      <div className="mt-[16px]">
        <OptimizedImage
          src={firstMedia?.file || '/game-image.png'}
          alt={post.title}
          className="w-full h-[480px] object-cover rounded-[16px]"
          placeholder="/game-image.png"
        />
      </div>
    )
  }

  return (
    <div
      className={`bg-[#002f3d] rounded-[12px] p-[24px] hover:bg-[#003a4a] transition-colors cursor-pointer ${className}`}
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

      {/* Title */}
      <h3 className="text-[20px] font-bold text-[#f1fdff] font-manrope mb-[12px] line-clamp-2 leading-[1.2]">
        {post.title}
      </h3>

      {/* Content */}
      {post.content && (
        <p className="text-[16px] text-[rgba(204,248,255,0.8)] font-artifakt mb-[16px] line-clamp-3 leading-[1.5]">
          {post.content}
        </p>
      )}

      {/* Media */}
      {renderMedia()}

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
