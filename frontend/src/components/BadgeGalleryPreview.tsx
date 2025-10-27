import { useTranslation } from 'react-i18next'
import { OptimizedImage } from './OptimizedImage'

interface Badge {
  id: string
  name: string
  icon: string
}

interface BadgeGalleryPreviewProps {
  badgesCount: number
  topBadges: Badge[] // Only top 5
}

export const BadgeGalleryPreview = ({ badgesCount, topBadges }: BadgeGalleryPreviewProps) => {
  const { t } = useTranslation()

  // Render real badge icons
  const getBadgeIcon = (badge: Badge, index: number) => {
    return (
      <OptimizedImage
        key={badge.id}
        src={badge.icon}
        alt={badge.name}
        className="w-[110px] h-[110px] rounded-[12px] object-cover"
        loading="lazy"
        placeholder="/badge-placeholder.png"
        title={badge.name}
      />
    )
  }

  return (
    <div className="bg-[#004252] rounded-[20px] p-[20px] mb-[24px] flex flex-col gap-[20px] items-center w-full">
      {/* Title */}
      <h2 className="font-['Manrope:Bold',sans-serif] font-bold leading-[1.1] text-[#f1fdff] text-[24px] w-full">
        {t('badges.gallery')}
      </h2>
      
      {/* Content Row */}
      <div className="flex items-center w-full">
        {/* Badge Count Card */}
        <div className="bg-[#002f3d] rounded-[12px] w-[200px] flex flex-col items-center justify-center pb-[20px] pt-[16px] px-0">
          <div className="flex flex-col gap-[4px] items-center">
            <div className="font-['Manrope:Bold',sans-serif] font-bold leading-[1.25] text-[#f1fdff] text-[40px]">
              {badgesCount}
            </div>
            <div className="font-['Artifakt_Element:Regular',sans-serif] leading-[1.2] text-[20px] text-[rgba(204,248,255,0.65)] tracking-[-0.2px]">
              {t('badges.badgesCount')}
            </div>
          </div>
        </div>
        
        {/* Badges Row */}
        <div className="flex gap-[40px] items-start justify-center flex-1">
          {topBadges.slice(0, 5).map((badge, index) => getBadgeIcon(badge, index))}
        </div>
      </div>
    </div>
  )
}
