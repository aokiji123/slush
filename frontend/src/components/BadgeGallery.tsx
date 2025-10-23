interface Badge {
  id: string
  name: string
  icon: string
  description: string
}

interface BadgeGalleryProps {
  badges: Badge[]
}

export const BadgeGallery = ({ badges }: BadgeGalleryProps) => {
  return (
    <div className="bg-[var(--color-background-8)] rounded-[20px] p-[20px] mb-[24px]">
      <div className="flex items-center justify-between mb-[20px]">
        <h2 className="text-[20px] font-bold text-[var(--color-background)] font-manrope">
          Галерея значків
        </h2>
      </div>
      
      <div className="flex items-center gap-[20px]">
        {/* Badge Count */}
        <div className="flex-shrink-0 w-[200px] h-[114px] bg-[var(--color-background-15)] rounded-[20px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-[50px] font-bold text-[var(--color-background)] mb-[4px]">
              {badges.length}
            </div>
            <div className="text-[24px] text-[var(--color-background-25)] opacity-65">
              Значків
            </div>
          </div>
        </div>

        {/* Badge List */}
        <div className="flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex gap-[20px] min-w-max">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="flex-shrink-0 w-[110px] h-[110px] bg-[var(--color-background-15)] rounded-[20px] flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--color-background-16)] transition-colors group"
                title={badge.description}
              >
                <div className="text-[32px] mb-[8px] group-hover:scale-110 transition-transform">
                  {badge.icon}
                </div>
                <div className="text-[12px] text-[var(--color-background-25)] opacity-65 text-center px-[4px]">
                  {badge.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
