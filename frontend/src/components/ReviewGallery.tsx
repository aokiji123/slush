interface ReviewGalleryProps {
  reviews?: any[] // Mock data for now
}

export const ReviewGallery = ({ reviews: _reviews = [] }: ReviewGalleryProps) => {
  // Mock review data matching Figma design
  const mockReviews = [
    {
      id: '1',
      gameTitle: 'SONS OF THE FOREST',
      gameName: 'Sons of the forest',
      rating: 4.5,
      description: 'Відмінна гра з чудовою графікою та захоплюючим геймплеєм. Рекомендую всім любителям survival жанру.',
      likes: 2500,
      comments: 2500,
      date: '21.02.2023',
      gameImage: '/sekiro.jpg'
    },
    {
      id: '2',
      gameTitle: 'The Witcher 3',
      gameName: 'The Witcher 3',
      rating: 4.5,
      description: 'Одна з найкращих RPG ігор усіх часів. Сюжет, персонажі, світ - все на найвищому рівні.',
      likes: 2500,
      comments: 2500,
      date: '21.02.2023',
      gameImage: '/witcher-3.jpg'
    }
  ]

  const displayReviews = mockReviews.slice(0, 2)
  const remainingCount = Math.max(0, mockReviews.length - 2)

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 0L10.5 5.5L16 6L12 10L13 16L8 13L3 16L4 10L0 6L5.5 5.5L8 0Z"
            fill="#ff6f95"
          />
        </svg>
      )
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <defs>
            <linearGradient id="half-star">
              <stop offset="50%" stopColor="#ff6f95" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            d="M8 0L10.5 5.5L16 6L12 10L13 16L8 13L3 16L4 10L0 6L5.5 5.5L8 0Z"
            fill="url(#half-star)"
          />
        </svg>
      )
    }

    return stars
  }

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  return (
    <div className="bg-[var(--color-background-8)] rounded-[20px] p-[20px] mb-[24px]">
      <div className="flex items-center justify-between mb-[20px]">
        <h2 className="text-[20px] font-bold text-[var(--color-background)] font-manrope">
          Галерея рецензій
        </h2>
        <div className="bg-[var(--color-background-18)] rounded-[20px] px-[12px] py-[4px]">
          <span className="text-[14px] font-bold text-[var(--color-background-25)] opacity-65">
            {mockReviews.length}
          </span>
        </div>
      </div>

      <div className="space-y-[24px]">
        {/* Display first 2 reviews */}
        {displayReviews.map((review) => (
          <div key={review.id} className="bg-[#002f3d] rounded-[20px] p-[24px]">
            <div className="flex flex-col gap-[16px]">
              {/* Game Image and Title */}
              <div className="flex items-center gap-[16px]">
                <img
                  src={review.gameImage}
                  alt={review.gameTitle}
                  className="w-[60px] h-[60px] object-cover rounded-[12px]"
                />
                <div>
                  <h3 className="text-[20px] font-bold text-[#f1fdff] font-manrope">
                    {review.gameName}
                  </h3>
                  <div className="flex items-center gap-[8px] mt-[4px]">
                    {renderStars(review.rating)}
                    <span className="text-[16px] text-[#f1fdff] font-artifakt">
                      {review.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <p className="text-[16px] text-[#f1fdff] leading-[1.5] font-artifakt">
                {review.description}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-[12px]">
                <button className="flex items-center gap-[8px] py-[4px] px-[8px] cursor-pointer text-[#ccf8ffa6] bg-[#37c3ff1f] rounded-[8px] transition-colors">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M10 18.35L8.55 17.03C3.4 12.36 0 9.28 0 5.5C0 2.42 2.42 0 5.5 0C7.24 0 8.91 0.81 10 2.09C11.09 0.81 12.76 0 14.5 0C17.58 0 20 2.42 20 5.5C20 9.28 16.6 12.36 11.45 17.04L10 18.35Z"
                      fill="currentColor"
                    />
                  </svg>
                  <p>{formatCount(review.likes)}</p>
                </button>

                <button className="flex items-center gap-[8px] py-[4px] px-[8px] cursor-pointer text-[#ccf8ffa6] bg-[#37c3ff1f] rounded-[8px] transition-colors">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5 20C4.90566 20 4.71698 20 4.62264 19.9057C4.24528 19.717 4.0566 19.434 4.0566 19.0566V15.283H2.83019C1.22642 15.283 0 14.0566 0 12.4528V2.83019C0 1.22642 1.22642 0 2.83019 0H17.1698C18.7736 0 20 1.22642 20 2.83019V12.4528C20 14.0566 18.7736 15.283 17.1698 15.283H10.0943L5.66038 19.717C5.4717 19.9057 5.18868 20 5 20Z"
                      fill="currentColor"
                    />
                  </svg>
                  <p>{formatCount(review.comments)}</p>
                </button>

                <button className="flex items-center gap-[8px] py-[4px] px-[8px] cursor-pointer text-[#ccf8ffa6] bg-[#37c3ff1f] rounded-[8px] transition-colors">
                  <svg width="19" height="20" viewBox="0 0 19 20" fill="none">
                    <path
                      d="M15.7 20H3.1C2.3 20 1.5 19.7 0.9 19.1C0.3 18.5 0 17.7 0 16.9V13.2C0 12.6 0.4 12.2 1 12.2C1.6 12.2 2 12.6 2 13.2V16.9C2 17.2 2.1 17.5 2.3 17.7C2.5 17.9 2.8 18 3.1 18H15.7C16 18 16.3 17.9 16.5 17.7C16.7 17.5 16.8 17.2 16.8 16.9V13.2C16.8 12.6 17.2 12.2 17.8 12.2C18.4 12.2 18.8 12.6 18.8 13.2V16.9C18.8 17.7 18.5 18.5 17.9 19.1C17.3 19.7 16.5 20 15.7 20Z"
                      fill="currentColor"
                    />
                  </svg>
                  <p>Поділитись</p>
                </button>

                <span className="text-[14px] text-[rgba(204,248,255,0.65)] font-artifakt ml-auto">
                  {review.date}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Show remaining count if there are more than 2 reviews */}
        {remainingCount > 0 && (
          <div className="flex justify-center">
            <div className="bg-[#002f3d] rounded-[20px] w-[160px] h-[474px] flex items-center justify-center border border-[#046075]">
              <div className="text-center">
                <div className="text-[24px] font-bold text-[#f1fdff] mb-[8px]">
                  +{remainingCount}
                </div>
                <div className="text-[14px] text-[rgba(204,248,255,0.65)]">
                  більше рецензій
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Show empty state if no reviews */}
        {mockReviews.length === 0 && (
          <div className="flex justify-center items-center h-32">
            <div className="text-[var(--color-background)] opacity-60">
              Немає рецензій
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
