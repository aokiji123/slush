import { LevelBadge } from './LevelBadge'
import { FriendCard } from './FriendCard'

interface ProfileSidebarProps {
  level: number
  friends: Array<{
    id: string
    userId: string
    nickname: string
    avatar?: string
    isOnline: boolean
    level: number
  }>
  currentUserId: string
}

export const ProfileSidebar = ({ level, friends, currentUserId }: ProfileSidebarProps) => {
  const statsMenu = [
    { label: 'Досягнення', value: '5' },
    { label: 'Ігри', value: '1234' },
    { label: 'DLC', value: '121' },
    { label: 'Бажане', value: '2564' },
    { label: 'Рецензії', value: '42' },
    { label: 'Гайди', value: '8' },
    { label: 'Скріншоти', value: '156' },
    { label: 'Відео', value: '23' },
    { label: 'Друзі', value: '25' },
  ]

  return (
    <div className="w-[348px] flex-shrink-0 space-y-[24px]">
      {/* Level Card */}
      <div className="bg-[var(--color-background-8)] rounded-[20px] p-[16px]">
        <div className="flex items-center gap-[16px] mb-[20px]">
          <span className="text-[16px] font-bold text-[var(--color-background)]">
            Рівень
          </span>
          <LevelBadge level={level} />
        </div>

        {/* Stats Menu */}
        <div className="space-y-[4px]">
          {statsMenu.map((stat, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-[12px] bg-[var(--color-background-15)] rounded-[12px] hover:bg-[var(--color-background-16)] transition-colors cursor-pointer"
            >
              <span className="text-[14px] text-[var(--color-background)]">
                {stat.label}
              </span>
              <span className="text-[14px] font-bold text-[var(--color-background-21)]">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Friends Card */}
      <div className="bg-[var(--color-background-8)] rounded-[20px] p-[16px]">
        <div className="flex items-center justify-between mb-[16px]">
          <h3 className="text-[16px] font-bold text-[var(--color-background)]">
            Друзі
          </h3>
          <span className="text-[14px] text-[var(--color-background-25)] opacity-65">
            {friends.length}
          </span>
        </div>

        <div className="space-y-[8px] max-h-[268px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {friends.slice(0, 5).map((friend) => (
            <FriendCard
              key={friend.id}
              id={friend.id}
              userId={friend.userId}
              username={friend.nickname}
              avatar={friend.avatar}
              level={friend.level}
              isOnline={friend.isOnline}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
