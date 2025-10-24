import type { PostDto } from '@/types/community'
import { PostType } from '@/types/community'

interface VideoGalleryProps {
  posts: PostDto[]
}

const PlayButton = ({ size = 'large' }: { size?: 'large' | 'small' }) => {
  const iconSize = size === 'large' ? 56 : 36
  const className = size === 'large' 
    ? 'w-[56px] h-[56px]' 
    : 'w-[36px] h-[36px]'

  return (
    <div className={`${className} bg-[var(--color-background-21)] rounded-full flex items-center justify-center cursor-pointer hover:bg-[var(--color-background-23)] transition-colors`}>
      <svg
        width={iconSize * 0.4}
        height={iconSize * 0.4}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 5V19L19 12L8 5Z"
          fill="var(--color-night-background)"
        />
      </svg>
    </div>
  )
}

export const VideoGallery = ({ posts }: VideoGalleryProps) => {
  // Filter for video posts only
  const videoPosts = posts.filter(post => post.type === PostType.Video)
  
  // Get first post for featured video and next 2 for thumbnails
  const featuredPost = videoPosts[0]
  const thumbnailPosts = videoPosts.slice(1, 3)
  const remainingCount = Math.max(0, videoPosts.length - 3)
  
  // Helper function to get cover video from post media
  const getCoverVideo = (post: PostDto) => {
    const coverMedia = post.media.find(media => media.isCover) || post.media[0]
    return coverMedia.file || '/game-image.png'
  }

  return (
    <div className="bg-[var(--color-background-8)] rounded-[20px] p-[20px] mb-[24px]">
      <div className="flex items-center justify-between mb-[20px]">
        <h2 className="text-[20px] font-bold text-[var(--color-background)] font-manrope">
          Галерея відео
        </h2>
      </div>

      <div className="space-y-[20px]">
        {/* Featured Video */}
        {featuredPost && (
          <div className="relative w-full h-[522px] bg-[var(--color-background-15)] rounded-[16px] overflow-hidden group">
            <img
              src={getCoverVideo(featuredPost)}
              alt={featuredPost.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <PlayButton size="large" />
            </div>
          </div>
        )}

        {/* Thumbnail Videos */}
        <div className="flex gap-[8px]">
          {thumbnailPosts.map((post) => (
            <div
              key={post.id}
              className="relative w-[345px] h-[184px] bg-[var(--color-background-15)] rounded-[16px] overflow-hidden group cursor-pointer"
            >
              <img
                src={getCoverVideo(post)}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayButton size="small" />
              </div>
            </div>
          ))}
          
          {/* More Count */}
          {remainingCount > 0 && (
            <div className="w-[345px] h-[184px] bg-[var(--color-background-15)] rounded-[16px] flex items-center justify-center relative">
              <div className="absolute inset-0 bg-black bg-opacity-60 rounded-[16px] flex items-center justify-center">
                <span className="text-[24px] font-bold text-[#f1fdff]">
                  +{remainingCount}
                </span>
              </div>
            </div>
          )}
        </div>
        
        {/* Show empty state if no videos */}
        {videoPosts.length === 0 && (
          <div className="flex justify-center items-center h-32">
            <div className="text-[var(--color-background)] opacity-60">
              Немає відео
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
