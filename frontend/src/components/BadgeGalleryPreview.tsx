import { useTranslation } from 'react-i18next'

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

  // Mock badge icons as simple colored divs
  const getBadgeIcon = (badge: Badge, index: number) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500'
    ]
    const icons = ['🎮', '⚔️', '❤️', '🃏', '🎯']
    
    return (
      <div 
        key={badge.id} 
        className={`w-[110px] h-[110px] ${colors[index % colors.length]} rounded-[12px] flex items-center justify-center text-[48px]`}
        title={badge.name}
      >
        {icons[index % icons.length]}
      </div>
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
