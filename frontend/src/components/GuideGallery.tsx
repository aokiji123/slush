import { ActionButton } from './ActionButton'
import { Card } from './Card'
import { CardHeader } from './CardHeader'
import { CardActions } from './CardActions'
import { GallerySection } from './GallerySection'

interface GuideGalleryProps {
  guides?: any[] // Mock data for now
}

export const GuideGallery = ({ guides: _guides = [] }: GuideGalleryProps) => {
  // Mock guide data matching Figma design
  const mockGuides = [
    {
      id: '1',
      title: 'Fallout 4 Як отримати силову броню Х-01',
      game: 'Fallout 4',
      description: 'Детальний посібник з пошуку та отримання силової броні Х-01 в Fallout 4. Включає всі необхідні кроки та локації.',
      image: '/baldurs-gate-3.png',
      views: 2500,
      likes: 2500,
      comments: 2500,
      date: '25.02.2024',
      author: 'MrAokiji',
      authorAvatar: '/avatar.png'
    },
    {
      id: '2',
      title: 'Посібник із баффів і дебафів Skyrim Requiem',
      game: 'Skyrim',
      description: 'Повний гайд по всіх бафах та дебафах в моді Skyrim Requiem. Детальні пояснення та поради.',
      image: '/cyberpunk.png',
      views: 1800,
      likes: 1800,
      comments: 1800,
      date: '25.02.2024',
      author: 'MrAokiji',
      authorAvatar: '/avatar.png'
    }
  ]

  const displayGuides = mockGuides.slice(0, 2)
  const remainingCount = Math.max(0, mockGuides.length - 2)

  return (
    <GallerySection 
      title="Галерея гайдів" 
      count={mockGuides.length}
      emptyState={
        <div className="flex justify-center items-center h-32">
          <div className="text-[var(--color-background)] opacity-60">
            Немає гайдів
          </div>
        </div>
      }
    >
      <div className="space-y-[24px]">
        {/* Display first 2 guides */}
        {displayGuides.map((guide) => (
          <Card key={guide.id} variant="interactive" className="p-[20px]">
            <div className="flex gap-[20px]">
              {/* Guide Image */}
              <img
                src={guide.image}
                alt={guide.title}
                className="w-[200px] h-[200px] object-cover rounded-[20px] flex-shrink-0"
              />
              
              {/* Guide Content */}
              <div className="flex-1 flex flex-col gap-[16px]">
                {/* Header */}
                <CardHeader
                  avatar={guide.authorAvatar}
                  username={guide.author}
                  date={guide.date}
                  avatarSize="sm"
                />

                {/* Game and Title */}
                <div>
                  <div className="text-[14px] text-[#37c3ff] font-artifakt mb-[4px]">
                    {guide.game}
                  </div>
                  <h3 className="text-[20px] font-bold text-[#f1fdff] font-manrope">
                    {guide.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-[16px] text-[#f1fdff] leading-[1.5] font-artifakt">
                  {guide.description}
                </p>

                {/* Actions */}
                <CardActions>
                  <ActionButton
                    icon={
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M10 18.35L8.55 17.03C3.4 12.36 0 9.28 0 5.5C0 2.42 2.42 0 5.5 0C7.24 0 8.91 0.81 10 2.09C11.09 0.81 12.76 0 14.5 0C17.58 0 20 2.42 20 5.5C20 9.28 16.6 12.36 11.45 17.04L10 18.35Z"
                          fill="currentColor"
                        />
                      </svg>
                    }
                    count={guide.likes}
                    variant="like"
                  />

                  <ActionButton
                    icon={
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M5 20C4.90566 20 4.71698 20 4.62264 19.9057C4.24528 19.717 4.0566 19.434 4.0566 19.0566V15.283H2.83019C1.22642 15.283 0 14.0566 0 12.4528V2.83019C0 1.22642 1.22642 0 2.83019 0H17.1698C18.7736 0 20 1.22642 20 2.83019V12.4528C20 14.0566 18.7736 15.283 17.1698 15.283H10.0943L5.66038 19.717C5.4717 19.9057 5.18868 20 5 20Z"
                          fill="currentColor"
                        />
                      </svg>
                    }
                    count={guide.comments}
                    variant="comment"
                  />

                  <ActionButton
                    icon={
                      <svg width="19" height="20" viewBox="0 0 19 20" fill="none">
                        <path
                          d="M15.7 20H3.1C2.3 20 1.5 19.7 0.9 19.1C0.3 18.5 0 17.7 0 16.9V13.2C0 12.6 0.4 12.2 1 12.2C1.6 12.2 2 12.6 2 13.2V16.9C2 17.2 2.1 17.5 2.3 17.7C2.5 17.9 2.8 18 3.1 18H15.7C16 18 16.3 17.9 16.5 17.7C16.7 17.5 16.8 17.2 16.8 16.9V13.2C16.8 12.6 17.2 12.2 17.8 12.2C18.4 12.2 18.8 12.6 18.8 13.2V16.9C18.8 17.7 18.5 18.5 17.9 19.1C17.3 19.7 16.5 20 15.7 20Z"
                          fill="currentColor"
                        />
                      </svg>
                    }
                    label="Поділитись"
                    variant="share"
                  />

                  <ActionButton
                    icon={
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M7 2C6.44772 2 6 2.44772 6 3C6 3.55228 6.44772 4 7 4H13C13.5523 4 14 3.55228 14 3C14 2.44772 13.5523 2 13 2H7ZM4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H16C16.5523 7 17 6.55228 17 6C17 5.44772 16.5523 5 16 5H4ZM2 8C1.44772 8 1 8.44772 1 9C1 9.55228 1.44772 10 2 10H18C18.5523 10 19 9.55228 19 9C19 8.44772 18.5523 8 18 8H2Z"
                          fill="currentColor"
                        />
                      </svg>
                    }
                    label="Купити"
                    variant="buy"
                  />
                </CardActions>
              </div>
            </div>
          </Card>
        ))}

        {/* Show remaining count if there are more than 2 guides */}
        {remainingCount > 0 && (
          <div className="flex justify-center">
            <div className="bg-[#002f3d] rounded-[20px] w-[160px] h-[220px] flex items-center justify-center border border-[#046075]">
              <div className="text-center">
                <div className="text-[24px] font-bold text-[#f1fdff] mb-[8px]">
                  +{remainingCount}
                </div>
                <div className="text-[14px] text-[rgba(204,248,255,0.65)]">
                  більше гайдів
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </GallerySection>
  )
}
