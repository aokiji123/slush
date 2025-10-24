import { Link, useLocation } from '@tanstack/react-router'
import { LevelBadge } from './LevelBadge'
import { useTranslation } from 'react-i18next'

interface ProfileTabsProps {
  nickname: string
  level: number
  stats: {
    badges: number
    games: number
    wishlist: number
    discussions: number
    screenshots: number
    videos: number
    guides: number
    reviews: number
  }
}

export const ProfileTabs = ({ nickname, level, stats }: ProfileTabsProps) => {
  const { t } = useTranslation()
  const location = useLocation()

  const tabs = [
    { key: 'home', label: t('profile.tabs.home'), count: null, path: `/profile/${nickname}/` },
    { key: 'badges', label: t('profile.tabs.badges'), count: stats.badges, path: `/profile/${nickname}/badges` },
    { key: 'games', label: t('profile.tabs.games'), count: stats.games, path: `/profile/${nickname}/games` },
    { key: 'wishlist', label: t('profile.tabs.wishlist'), count: stats.wishlist, path: `/profile/${nickname}/wishlist` },
    { key: 'discussions', label: t('profile.tabs.discussions'), count: stats.discussions, path: `/profile/${nickname}/discussions` },
    { key: 'screenshots', label: t('profile.tabs.screenshots'), count: stats.screenshots, path: `/profile/${nickname}/screenshots` },
    { key: 'videos', label: t('profile.tabs.videos'), count: stats.videos, path: `/profile/${nickname}/videos` },
    { key: 'guides', label: t('profile.tabs.guides'), count: stats.guides, path: `/profile/${nickname}/guides` },
    { key: 'reviews', label: t('profile.tabs.reviews'), count: stats.reviews, path: `/profile/${nickname}/reviews` },
  ]

  const isActive = (path: string) => {
    if (path === `/profile/${nickname}/`) {
      return location.pathname === `/profile/${nickname}/`
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="bg-[var(--color-background-15)] rounded-[20px] p-[12px] w-[348px]">
      {/* Level Section */}
      <div className="flex items-center gap-[14px] pl-[16px] mb-[12px]">
        <h2 className="text-[24px] font-bold text-[var(--color-background)] font-manrope leading-[1.1]">
          {t('profile.level')}
        </h2>
        <LevelBadge level={level} />
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-col gap-[4px]">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            to={tab.path}
            className={`flex items-center justify-between px-[12px] py-[8px] rounded-[12px] transition-colors ${
              isActive(tab.path)
                ? 'bg-[rgba(55,195,255,0.25)]'
                : 'hover:bg-[var(--color-background-16)]'
            }`}
          >
            <div className="flex items-center gap-[12px]">
              <span className="text-[20px] font-bold text-[var(--color-background)] font-artifakt leading-[1.2]">
                {tab.label}
              </span>
            </div>
            {tab.count !== null && (
              <div className="bg-[rgba(55,195,255,0.25)] rounded-[20px] px-[12px] py-[4px]">
                <span className="text-[16px] font-bold text-[rgba(204,248,255,0.65)] font-artifakt leading-[1.25] tracking-[-0.16px]">
                  {tab.count}
                </span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
