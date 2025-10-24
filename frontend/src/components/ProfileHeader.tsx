interface ProfileHeaderProps {
  username: string
  bio: string
  avatar?: string
  banner?: string
  isOnline: boolean
  isOwnProfile: boolean
  friendshipStatus?: 'none' | 'pending_outgoing' | 'pending_incoming' | 'friends'
  onEditProfile?: () => void
  onAddFriend?: () => void
  onCancelRequest?: () => void
  onAcceptRequest?: () => void
  onRemoveFriend?: () => void
}

export const ProfileHeader = ({ 
  username, 
  bio, 
  avatar = '/avatar.png', 
  banner = '/banner.png',
  isOnline,
  isOwnProfile,
  friendshipStatus = 'none',
  onEditProfile,
  onAddFriend,
  onCancelRequest,
  onAcceptRequest,
  onRemoveFriend
}: ProfileHeaderProps) => {
  return (
    <div className="relative mb-[40px]">
      {/* Banner */}
      <div className="relative h-[240px] rounded-[20px] overflow-hidden">
        <img
          src={banner}
          alt="Profile banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-night-background)] to-transparent" />
      </div>

      {/* Avatar and Info */}
      <div className="flex items-start gap-[24px] -mt-[100px] relative z-10">
        <div className="relative">
          <img
            src={avatar}
            alt={username}
            className="w-[200px] h-[200px] rounded-[20px] border-4 border-[var(--color-background-15)] object-cover"
          />
          {isOnline && (
            <div className="absolute -bottom-2 -right-2 w-[24px] h-[24px] bg-[var(--color-background-21)] rounded-full border-4 border-[var(--color-background-15)]" />
          )}
        </div>

        <div className="flex-1 pt-[20px]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[32px] font-bold text-[var(--color-background)] font-manrope mb-[8px]">
                {username}
              </h1>
              <div className="flex items-center gap-[8px] mb-[16px]">
                <div className="w-[8px] h-[8px] bg-[var(--color-background-21)] rounded-full" />
                <span className="text-[16px] text-[var(--color-background-25)] opacity-65">
                  онлайн
                </span>
              </div>
            </div>
            {isOwnProfile ? (
              <button
                onClick={onEditProfile}
                className="bg-[var(--color-background-21)] text-[var(--color-night-background)] px-[26px] py-[12px] rounded-[20px] font-medium text-[16px] hover:bg-[var(--color-background-23)] transition-colors"
              >
                Редактировать профиль
              </button>
            ) : (
              <div className="flex gap-[12px]">
                {friendshipStatus === 'none' && (
                  <button
                    onClick={onAddFriend}
                    className="bg-[var(--color-background-21)] text-[var(--color-night-background)] px-[26px] py-[12px] rounded-[20px] font-medium text-[16px] hover:bg-[var(--color-background-23)] transition-colors"
                  >
                    Додати до друзів
                  </button>
                )}
                {friendshipStatus === 'pending_outgoing' && (
                  <button
                    onClick={onCancelRequest}
                    className="bg-[var(--color-background-15)] text-[var(--color-background)] px-[26px] py-[12px] rounded-[20px] font-medium text-[16px] hover:bg-[var(--color-background-16)] transition-colors"
                  >
                    Скасувати запит
                  </button>
                )}
                {friendshipStatus === 'pending_incoming' && (
                  <button
                    onClick={onAcceptRequest}
                    className="bg-[var(--color-background-21)] text-[var(--color-night-background)] px-[26px] py-[12px] rounded-[20px] font-medium text-[16px] hover:bg-[var(--color-background-23)] transition-colors"
                  >
                    Прийняти запит
                  </button>
                )}
                {friendshipStatus === 'friends' && (
                  <div className="relative group">
                    <button className="bg-[var(--color-background-15)] text-[var(--color-background)] px-[26px] py-[12px] rounded-[20px] font-medium text-[16px] hover:bg-[var(--color-background-16)] transition-colors">
                      У друзях
                    </button>
                    <div className="absolute top-full right-0 mt-[8px] bg-[var(--color-background-8)] rounded-[12px] p-[8px] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        onClick={onRemoveFriend}
                        className="text-[var(--color-background-25)] hover:text-[var(--color-background)] text-[14px] whitespace-nowrap"
                      >
                        Видалити з друзів
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <p className="text-[16px] text-[var(--color-background)] leading-[1.5] max-w-[596px]">
            {bio}
          </p>
        </div>
      </div>
    </div>
  )
}
