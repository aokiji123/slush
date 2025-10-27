import { useLikeToggle } from '@/hooks'
import { PostAuthorBadge } from './PostAuthorBadge'
import { OptimizedImage } from './OptimizedImage'
import { formatSimpleDate } from '@/utils/formatters'
import { FavoriteIcon, FavoriteFilledIcon, CommentsIcon } from '@/icons'
import type { PostDto } from '@/types/community'

interface LibraryNewsCardProps {
  post: PostDto
  onClick: () => void
}

export const LibraryNewsCard = ({ post, onClick }: LibraryNewsCardProps) => {
  const { isLiked, likesCount, handleLike } = useLikeToggle({
    itemId: post.id,
    initialLikesCount: post.likesCount || 0
  })

  // Helper function to get cover image from post media or game main image
  const getCoverImage = () => {
    if (post.media.length > 0) {
      const coverMedia = post.media.find((m) => m.isCover) || post.media[0]
      return coverMedia?.file || '/cyberpunk-image.png'
    }
    // Use game's main image as fallback for posts without media
    return post.gameMainImage || '/cyberpunk-image.png'
  }

  return (
    <div 
      className="w-[475px] h-[424px] rounded-[20px] overflow-hidden cursor-pointer hover:opacity-90 transition-opacity bg-[var(--color-background-15)]"
      onClick={onClick}
    >
      <OptimizedImage
        src={getCoverImage()}
        alt={post.title}
        className="w-full h-[184px] object-cover"
        loading="lazy"
      />
      
      <div className="flex flex-col gap-[20px] h-[240px] p-[24px]">
        <div className="flex flex-col gap-[16px] flex-1 min-h-0">
          <PostAuthorBadge
            avatar={post.authorAvatar}
            username={post.authorUsername}
            showMenu={true}
          />
          
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
            <div className="flex items-center gap-[8px] py-[4px] px-[8px] text-[var(--color-background-25)] bg-[var(--color-background-17)] rounded-[8px]">
              <CommentsIcon />
              <p>{post.commentsCount}</p>
            </div>
          </div>
          <p className="text-[14px] font-normal text-[var(--color-background-25)]">
            {formatSimpleDate(post.createdAt)}
          </p>
        </div>
      </div>
    </div>
  )
}

