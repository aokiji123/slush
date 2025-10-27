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
    initialLikesCount: post.likesCount || 0,
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
      className="w-full h-[280px] sm:h-[340px] lg:h-[424px] rounded-[12px] sm:rounded-[16px] lg:rounded-[20px] overflow-hidden cursor-pointer hover:opacity-90 transition-opacity bg-[var(--color-background-15)]"
      onClick={onClick}
    >
      <OptimizedImage
        src={getCoverImage()}
        alt={post.title}
        className="w-full h-[100px] sm:h-[130px] lg:h-[184px] object-cover"
        loading="lazy"
      />

      <div className="flex flex-col gap-[12px] sm:gap-[16px] lg:gap-[20px] h-[180px] sm:h-[210px] lg:h-[240px] p-[12px] sm:p-[16px] lg:p-[24px]">
        <div className="flex flex-col gap-[10px] sm:gap-[12px] lg:gap-[16px] flex-1 min-h-0">
          <PostAuthorBadge
            avatar={post.authorAvatar}
            username={post.authorUsername}
            showMenu={true}
          />

          <div className="flex flex-col gap-[6px] sm:gap-[8px] flex-1 min-h-0">
            <p className="text-[14px] sm:text-[16px] lg:text-[20px] font-bold text-white">
              {post.title}
            </p>
            <p className="text-[12px] sm:text-[14px] lg:text-[16px] font-light text-white line-clamp-2 sm:line-clamp-3 flex-1 min-h-0">
              {post.content}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[8px] sm:gap-[10px] lg:gap-[12px]">
            <button
              onClick={handleLike}
              className={`flex items-center gap-[6px] sm:gap-[8px] py-[2px] sm:py-[4px] px-[6px] sm:px-[8px] cursor-pointer text-[var(--color-background-25)] bg-[var(--color-background-17)] rounded-[6px] sm:rounded-[8px] transition-colors ${
                isLiked ? 'text-[var(--color-background-10)]' : ''
              }`}
            >
              {isLiked ? (
                <FavoriteFilledIcon className="text-[var(--color-background-10)] w-[14px] h-[14px] sm:w-auto sm:h-auto" />
              ) : (
                <FavoriteIcon className="text-[var(--color-background-10)] w-[14px] h-[14px] sm:w-auto sm:h-auto" />
              )}
              <p className="text-[12px] sm:text-[14px]">{likesCount}</p>
            </button>
            <div className="flex items-center gap-[6px] sm:gap-[8px] py-[2px] sm:py-[4px] px-[6px] sm:px-[8px] text-[var(--color-background-25)] bg-[var(--color-background-17)] rounded-[6px] sm:rounded-[8px]">
              <CommentsIcon className="w-[14px] h-[14px] sm:w-auto sm:h-auto" />
              <p className="text-[12px] sm:text-[14px]">{post.commentsCount}</p>
            </div>
          </div>
          <p className="text-[11px] sm:text-[13px] lg:text-[14px] font-normal text-[var(--color-background-25)]">
            {formatSimpleDate(post.createdAt)}
          </p>
        </div>
      </div>
    </div>
  )
}
