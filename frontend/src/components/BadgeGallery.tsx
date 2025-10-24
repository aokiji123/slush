import { useState, useMemo } from 'react'
import { BadgeCard } from './BadgeCard'
import { LevelProgress } from './LevelProgress'
import { EmptyState } from './EmptyState'
import { SortDropdown } from './SortDropdown'
import { useTranslation } from 'react-i18next'

interface Badge {
  id: string
  name: string
  icon: string
  description: string
  requiredValue: number
  earnedAt: string
}

interface BadgeGalleryProps {
  badges: Badge[]
  level: number
  experience: number
  nextLevelExperience: number
}

type SortOption = 'byDate' | 'byPoints' | 'byNameAsc' | 'byNameDesc'

export const BadgeGallery = ({ badges, level, experience, nextLevelExperience }: BadgeGalleryProps) => {
  const { t } = useTranslation()
  const [sortBy, setSortBy] = useState<SortOption>('byDate')
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)

  const sortOptions = [
    { label: t('badges.sorting.byDate'), value: 'byDate' },
    { label: t('badges.sorting.byPoints'), value: 'byPoints' },
    { label: t('badges.sorting.byNameAsc'), value: 'byNameAsc' },
    { label: t('badges.sorting.byNameDesc'), value: 'byNameDesc' },
  ]

  const sortedBadges = useMemo(() => {
    const sorted = [...badges]
    
    switch (sortBy) {
      case 'byDate':
        return sorted.sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())
      case 'byPoints':
        return sorted.sort((a, b) => b.requiredValue - a.requiredValue)
      case 'byNameAsc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'byNameDesc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name))
      default:
        return sorted
    }
  }, [badges, sortBy])

  const handleSortSelect = (value: string) => {
    setSortBy(value as SortOption)
    setIsSortDropdownOpen(false)
  }

  return (
    <div className="bg-[var(--color-background-8)] rounded-[20px] p-[20px] mb-[24px]">
      {/* Level Progress Section */}
      <div className="mb-[20px]">
        <LevelProgress
          currentLevel={level}
          experience={experience}
          nextLevelExperience={nextLevelExperience}
        />
      </div>

      {/* Sorting and Badges Section */}
      <div className="space-y-[20px]">
        {/* Sorting Controls */}
        <div className="flex items-center gap-[12px]">
          <span className="text-[16px] text-[var(--color-background)] font-artifakt">
            {t('common.sorting')}:
          </span>
          <div className="relative">
            <button
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              className="bg-[var(--color-background-15)] rounded-[8px] px-[12px] py-[6px] text-[16px] text-[var(--color-background)] font-artifakt hover:bg-[var(--color-background-16)] transition-colors"
            >
              {sortOptions.find(opt => opt.value === sortBy)?.label}
            </button>
            {isSortDropdownOpen && (
              <SortDropdown
                options={sortOptions}
                onSelect={handleSortSelect}
                className="top-full left-0 mt-[4px]"
              />
            )}
          </div>
        </div>

        {/* Badges Grid */}
        {badges.length === 0 ? (
          <EmptyState
            title={t('badges.noBadges')}
            message=""
          />
        ) : (
          <div className="grid grid-cols-2 gap-[20px]">
            {sortedBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
