import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useLikePost, useUnlikePost } from '@/api/queries/useCommunity'
import { useAuthState } from '@/api/queries/useAuth'
import { FavoriteIcon, FavoriteFilledIcon, CommentsIcon } from '@/icons'
import { BsThreeDots } from 'react-icons/bs'
import { FaShare } from 'react-icons/fa'
import type { PostDto } from '@/types/community'
import { MediaType } from '@/types/community'
import { OptimizedImage } from './OptimizedImage'

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
  const { user } = useAuthState()
  
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likesCount || 0)

  const likePostMutation = useLikePost()
  const unlikePostMutation = useUnlikePost()

  const handlePostClick = () => {
    if (onNavigate) {
      onNavigate()
    }
    navigate({
      to: '/$slug/community/post/$id',
      params: { slug: post.gameId || 'default', id: post.id },
    })
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!user) return

    const wasLiked = isLiked
    const previousLikesCount = likesCount

    // Optimistic update
    setIsLiked(!wasLiked)
    setLikesCount(wasLiked ? likesCount - 1 : likesCount + 1)

    try {
      if (wasLiked) {
        await unlikePostMutation.mutateAsync(post.id)
      } else {
        await likePostMutation.mutateAsync(post.id)
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(wasLiked)
      setLikesCount(previousLikesCount)
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Implement share functionality
  }

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation()
    handlePostClick()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Щойно'
    if (diffInHours < 24) return `${diffInHours} год. тому`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} дн. тому`
    
    return date.toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const renderMedia = () => {
    if (post.media.length === 0) return null
    
    const firstMedia = post.media[0]
    if (firstMedia.type !== MediaType.Image) return null

    return (
      <div className="mt-[16px]">
        <OptimizedImage
          src={firstMedia.file}
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
            {formatDate(post.createdAt)}
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
        <div className="flex items-center gap-[24px]">
          {/* Like Button */}
          <button
            onClick={handleLike}
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
            onClick={handleComment}
            className="flex items-center gap-[8px] bg-[rgba(55,195,255,0.12)] px-[8px] py-[4px] rounded-[8px] text-[rgba(204,248,255,0.65)] hover:text-[#24E5C2] transition-colors"
          >
            <CommentsIcon className="w-[24px] h-[24px]" />
            <span className="text-[16px] font-artifakt-medium">{post.commentsCount || 0}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-[8px] bg-[rgba(55,195,255,0.12)] px-[8px] py-[4px] rounded-[8px] text-[rgba(204,248,255,0.65)] hover:text-[#24E5C2] transition-colors"
          >
            <FaShare className="w-[24px] h-[24px]" />
            <span className="text-[16px] font-artifakt-medium">Поділитись</span>
          </button>
        </div>
      </div>
    </div>
  )
}
