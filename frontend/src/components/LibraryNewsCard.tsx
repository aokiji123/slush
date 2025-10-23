import { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { CommentsIcon, FavoriteIcon, FavoriteFilledIcon } from '@/icons'
import { useLikePost, useUnlikePost } from '@/api/queries/useCommunity'
import { useAuthState } from '@/api/queries/useAuth'
import type { PostDto } from '@/types/community'

interface LibraryNewsCardProps {
  post: PostDto
  onClick: () => void
}

export const LibraryNewsCard = ({ post, onClick }: LibraryNewsCardProps) => {
  const { user } = useAuthState()
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likesCount ?? 0)

  const likePostMutation = useLikePost()
  const unlikePostMutation = useUnlikePost()

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
      console.error('Failed to toggle like:', error)
    }
  }
  // Helper function to get cover image from post media or game main image
  const getCoverImage = () => {
    if (post.media && post.media.length > 0) {
      const coverMedia = post.media.find((m) => m.isCover) || post.media[0]
      return coverMedia.file
    }
    // Use game's main image as fallback for posts without media
    return post.gameMainImage || '/cyberpunk-image.png'
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div 
      className="w-[475px] h-[424px] rounded-[20px] overflow-hidden cursor-pointer hover:opacity-90 transition-opacity bg-[var(--color-background-15)]"
      onClick={onClick}
    >
      <img
        src={getCoverImage()}
        alt={post.title}
        className="w-full h-[184px] object-cover"
      />
      
      <div className="flex flex-col gap-[20px] h-[240px] p-[24px]">
        <div className="flex flex-col gap-[16px] flex-1 min-h-0">
          <div className="flex items-center justify-between">
            <div className="relative bg-[var(--color-background-8)] pl-[36px] pr-[12px] h-[28px] rounded-[20px] flex items-center justify-end w-fit text-white">
              <img
                src={post.authorAvatar || "/avatar.png"}
                alt={post.authorUsername}
                className="w-[28px] h-[28px] object-cover rounded-full absolute top-0 left-0"
                loading="lazy"
              />
              <p className="text-right text-[16px] font-medium">
                {post.authorUsername}
              </p>
            </div>
            <BsThreeDots size={24} className="cursor-pointer text-white" />
          </div>
          
          <div className="flex flex-col gap-[8px] flex-1 min-h-0">
            <p className="text-[20px] font-bold text-white">
              {post.title}
            </p>
            <p className="text-[16px] font-light text-white line-clamp-3 flex-1 min-h-0">
              {post.content}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[12px]">
            <button
              onClick={handleLike}
              className={`flex items-center gap-[8px] py-[4px] px-[8px] cursor-pointer text-[var(--color-background-25)] bg-[var(--color-background-17)] rounded-[8px] transition-colors ${
                isLiked ? 'text-[var(--color-background-10)]' : ''
              }`}
            >
              {isLiked ? (
                <FavoriteFilledIcon className="text-[var(--color-background-10)]" />
              ) : (
                <FavoriteIcon className="text-[var(--color-background-10)]" />
              )}
              <p>{likesCount}</p>
            </button>
            <div className="flex items-center gap-[8px] py-[4px] px-[8px] cursor-pointer text-[var(--color-background-25)] bg-[var(--color-background-17)] rounded-[8px]">
              <CommentsIcon />
              <p>{post.commentsCount}</p>
            </div>
          </div>
          <p className="text-[14px] font-normal text-[var(--color-background-25)]">
            {formatDate(post.createdAt)}
          </p>
        </div>
      </div>
    </div>
  )
}

