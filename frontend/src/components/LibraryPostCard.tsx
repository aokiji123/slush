import { useRef } from 'react'
import { useLikeToggle } from '@/hooks'
import { PostAuthorBadge } from './PostAuthorBadge'
import { OptimizedImage } from './OptimizedImage'
import { formatSimpleDate } from '@/utils'
import { CommentsIcon, FavoriteIcon, FavoriteFilledIcon } from '@/icons'
import { PostType, MediaType } from '@/types/community'
import type { PostDto } from '@/types/community'

interface LibraryPostCardProps {
  post: PostDto
  onClick: () => void
}

export const LibraryPostCard = ({ post, onClick }: LibraryPostCardProps) => {
  const { isLiked, likesCount, handleLike } = useLikeToggle({
    itemId: post.id,
    initialLikesCount: post.likesCount || 0
  })
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleVideoEnded = () => {
    // Video ended - can be used for analytics or other purposes
  }
  
  // Helper function to get cover image from post media or game main image
  const getCoverImage = () => {
    if (post.media.length > 0) {
      const coverMedia = post.media.find((m) => m.isCover) || post.media[0]
      return coverMedia.file || '/cyberpunk-image.png'
    }
    // Use game's main image as fallback for posts without media
    return post.gameMainImage || '/cyberpunk-image.png'
  }

  // Video type: Full media with play button, no text below
  if (post.type === PostType.Video) {
    const videoMedia = post.media.find(m => m.type === MediaType.Video)
    const videoUrl = videoMedia?.file || getCoverImage()
    
    return (
      <div 
        className="w-[475px] h-[400px] flex flex-col gap-[20px] rounded-[20px] overflow-hidden bg-[var(--color-background-15)] p-[20px] cursor-pointer hover:opacity-90 transition-opacity"
        onClick={onClick}
      >
        <div className="flex flex-col gap-[16px] flex-1 min-h-0">
          <PostAuthorBadge
            avatar={post.authorAvatar}
            username={post.authorUsername}
            showMenu={true}
          />
          
          <div className="relative flex-1 min-h-0 rounded-[8px] overflow-hidden">
            {videoMedia ? (
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-cover"
                poster={getCoverImage()}
                preload="metadata"
                controls
                controlsList="nodownload"
                crossOrigin="anonymous"
                playsInline
                onEnded={handleVideoEnded}
                onLoadedMetadata={() => {
                  // Force video to load metadata for preview thumbnails
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0.1
                  }
                }}
                onError={(e) => {
                  console.error('Video load error:', e)
                  // If video fails to load, show poster image as fallback
                }}
              />
            ) : (
              <OptimizedImage
                src={getCoverImage()}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
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
            {formatSimpleDate(post.createdAt)}
          </p>
        </div>
      </div>
    )
  }

  // Screenshot type: Media + single line text
  if (post.type === PostType.Screenshot) {
    return (
      <div 
        className="w-[475px] h-[400px] flex flex-col gap-[20px] rounded-[20px] overflow-hidden bg-[var(--color-background-15)] p-[20px] cursor-pointer hover:opacity-90 transition-opacity"
        onClick={onClick}
      >
        <div className="flex flex-col gap-[16px] flex-1 min-h-0">
          <PostAuthorBadge
            avatar={post.authorAvatar}
            username={post.authorUsername}
            showMenu={true}
          />
          
          <div className="flex flex-col gap-[8px] flex-1 min-h-0">
            <div className="flex-1 min-h-0 rounded-[8px] overflow-hidden">
              <OptimizedImage
                src={getCoverImage()}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="text-[16px] font-light text-white overflow-ellipsis overflow-hidden whitespace-nowrap">
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
            {formatSimpleDate(post.createdAt)}
          </p>
        </div>
      </div>
    )
  }

  // Guide type: Media (50% vertical) + title + description
  if (post.type === PostType.Guide) {
    return (
      <div 
        className="w-[475px] h-[400px] flex flex-col gap-[20px] rounded-[20px] overflow-hidden bg-[var(--color-background-15)] p-[20px] cursor-pointer hover:opacity-90 transition-opacity"
        onClick={onClick}
      >
        <div className="flex flex-col gap-[16px] flex-1 min-h-0">
          <PostAuthorBadge
            avatar={post.authorAvatar}
            username={post.authorUsername}
            showMenu={true}
          />
          
          <div className="flex flex-col gap-[8px] flex-1 min-h-0">
            <div className="flex-1 min-h-0 rounded-[8px] overflow-hidden">
              <OptimizedImage
                src={getCoverImage()}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col gap-[4px]">
              <p className="text-[16px] font-bold text-white">
                {post.title}
              </p>
              <p className="text-[16px] font-light text-white line-clamp-3">
                {post.content}
              </p>
            </div>
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
            {formatSimpleDate(post.createdAt)}
          </p>
        </div>
      </div>
    )
  }

  // Default layout for Discussion and other types
  return (
    <div 
      className="w-[475px] h-[400px] flex flex-col gap-[16px] rounded-[20px] overflow-hidden bg-[var(--color-background-15)] p-[20px] cursor-pointer hover:opacity-90 transition-opacity"
      onClick={onClick}
    >
      <PostAuthorBadge
        avatar={post.authorAvatar}
        username={post.authorUsername}
        showMenu={true}
      />
      
      <OptimizedImage
        src={getCoverImage()}
        alt={post.title}
        className="w-full h-[180px] rounded-[20px]"
        loading="lazy"
      />
      
      <div className="flex flex-col gap-[16px] rounded-[0px_0px_20px_20px]">
        <div className="flex flex-col gap-[8px]">
          <p className="text-[20px] font-bold text-white">
            {post.title}
          </p>
          <p className="text-[16px] font-light text-white line-clamp-3">
            {post.content}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[16px]">
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
          <p className="text-[16px] font-normal text-[var(--color-background-25)]">
            {formatSimpleDate(post.createdAt)}
          </p>
        </div>
      </div>
    </div>
  )
}
