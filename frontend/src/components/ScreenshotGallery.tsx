import type { PostDto } from '@/types/community'
import { PostType } from '@/types/community'

interface ScreenshotGalleryProps {
  posts: PostDto[]
}

export const ScreenshotGallery = ({ posts }: ScreenshotGalleryProps) => {
  // Filter for screenshot posts only
  const screenshotPosts = posts.filter(post => post.type === PostType.Screenshot)
  
  // Get first post for featured image and next 2 for thumbnails
  const featuredPost = screenshotPosts[0]
  const thumbnailPosts = screenshotPosts.slice(1, 3)
  const remainingCount = Math.max(0, screenshotPosts.length - 3)
  
  // Helper function to get cover image from post media
  const getCoverImage = (post: PostDto) => {
    const coverMedia = post.media.find(media => media.isCover) || post.media[0]
    return coverMedia?.file || '/game-image.png'
  }

  return (
    <div className="bg-[var(--color-background-8)] rounded-[20px] p-[20px] mb-[24px]">
      <div className="flex items-center justify-between mb-[20px]">
        <h2 className="text-[20px] font-bold text-[var(--color-background)] font-manrope">
          Галерея скріншотів
        </h2>
      </div>

      <div className="space-y-[20px]">
        {/* Featured Screenshot */}
        {featuredPost && (
          <div className="w-full h-[522px] bg-[var(--color-background-15)] rounded-[16px] overflow-hidden">
            <img
              src={getCoverImage(featuredPost)}
              alt={featuredPost.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Thumbnail Screenshots */}
        <div className="flex gap-[8px]">
          {thumbnailPosts.map((post) => (
            <div
              key={post.id}
              className="w-[345px] h-[184px] bg-[var(--color-background-15)] rounded-[16px] overflow-hidden"
            >
              <img
                src={getCoverImage(post)}
                alt={post.title}
                className="w-full h-full object-cover"
              />
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
        
        {/* Show empty state if no screenshots */}
        {screenshotPosts.length === 0 && (
          <div className="flex justify-center items-center h-32">
            <div className="text-[var(--color-background)] opacity-60">
              Немає скріншотів
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
