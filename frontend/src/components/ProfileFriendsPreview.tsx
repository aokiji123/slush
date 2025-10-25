import { Link } from '@tanstack/react-router'
import { LevelBadge } from './LevelBadge'
import { useFriendsWithDetails } from '@/api/queries/useProfile'
import { useTranslation } from 'react-i18next'

interface ProfileFriendsPreviewProps {
  nickname: string
  userId: string
}

export const ProfileFriendsPreview = ({ nickname, userId }: ProfileFriendsPreviewProps) => {
  const { t } = useTranslation()
  
  // Fetch friends data for all profiles (public)
  const { data: friends, isLoading } = useFriendsWithDetails(userId)

  if (isLoading) {
    return (
      <div className="bg-[var(--color-background-15)] rounded-[20px] p-[12px] w-[348px]">
        <div className="bg-[rgba(55,195,255,0.25)] rounded-[12px] px-[12px] py-[8px] mb-[16px]">
          <div className="flex items-center justify-between">
            <div className="h-[20px] w-[60px] bg-[var(--color-background-16)] rounded animate-pulse" />
            <div className="h-[20px] w-[20px] bg-[var(--color-background-16)] rounded animate-pulse" />
          </div>
        </div>
        <div className="space-y-[12px]">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-[16px]">
                <div className="w-[44px] h-[44px] bg-[var(--color-background-16)] rounded-[39px] animate-pulse" />
                <div className="h-[16px] w-[80px] bg-[var(--color-background-16)] rounded animate-pulse" />
              </div>
              <div className="w-[33px] h-[32px] bg-[var(--color-background-16)] rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Sort friends by level (highest first) and take top 5
  const friendsToShow = friends
    ?.sort((a, b) => b.level - a.level)
    .slice(0, 5) || []

  return (
    <div className="bg-[var(--color-background-15)] rounded-[20px] p-[12px] w-[348px]">
      <Link
        to="/profile/$nickname/friends"
        params={{ nickname }}
        className="bg-[rgba(55,195,255,0.25)] rounded-[12px] px-[12px] py-[8px] mb-[16px] block hover:bg-[rgba(55,195,255,0.35)] transition-colors"
      >
        <div className="flex items-center justify-between">
          <span className="text-[20px] font-bold text-[var(--color-background)] font-artifakt leading-[1.2]">
            {t('profile.tabs.friends')}
          </span>
          <div className="bg-[rgba(55,195,255,0.25)] rounded-[20px] px-[12px] py-[4px]">
                <span className="text-[16px] font-bold text-[rgba(204,248,255,0.65)] font-artifakt leading-[1.25] tracking-[-0.16px]">
                  {friends?.length || 0}
                </span>
          </div>
        </div>
      </Link>

      <div className="flex flex-col gap-[12px] px-[12px]">
        {friendsToShow.map((friend) => (
          <div key={friend.id} className="flex items-center justify-between w-full">
            <div className="flex items-center gap-[16px]">
              <div className="relative w-[44px] h-[44px] flex-shrink-0">
                <img
                  src={friend.avatar || '/avatar.png'}
                  alt={friend.nickname}
                  className="w-[44px] h-[44px] rounded-[39px] object-cover"
                />
                {friend.isOnline && (
                  <div className="absolute bottom-0 left-[72.73%] right-0 top-[72.73%]">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="6" cy="6" r="5" fill="#8EFF72" stroke="#002F3D" strokeWidth="2" />
                    </svg>
                  </div>
                )}
              </div>
              <span className="text-[16px] font-bold text-[var(--color-background)] font-artifakt leading-[1.25] truncate max-w-[120px]">
                {friend.nickname}
              </span>
            </div>
            <LevelBadge level={friend.level} />
          </div>
        ))}
      </div>
    </div>
  )
}

