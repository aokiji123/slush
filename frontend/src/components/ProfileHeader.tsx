import { OptimizedImage } from './OptimizedImage'

interface ProfileHeaderProps {
  username: string
  bio: string
  avatar?: string
  banner?: string
  isOnline: boolean
  isOwnProfile: boolean
  friendshipStatus?:
    | 'none'
    | 'pending_outgoing'
    | 'pending_incoming'
    | 'friends'
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
  onRemoveFriend,
}: ProfileHeaderProps) => {
  return (
    <div className="relative mb-6 sm:mb-8 lg:mb-[40px]">
      {/* Banner */}
      <div className="relative h-[120px] sm:h-[160px] md:h-[200px] lg:h-[240px] rounded-[20px] overflow-hidden">
        <OptimizedImage
          src={banner}
          alt="Profile banner"
          className="w-full h-full object-cover"
          loading="lazy"
          placeholder="/banner.png"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-night-background)] to-transparent" />
      </div>

      {/* Avatar and Info */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 lg:gap-[24px] -mt-[50px] sm:-mt-[60px] md:-mt-[80px] lg:-mt-[100px] relative z-10 px-2 sm:px-0">
        <div className="relative flex-shrink-0">
          <OptimizedImage
            src={avatar}
            alt={username}
            className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px] lg:w-[200px] lg:h-[200px] rounded-[20px] border-4 border-[var(--color-background-15)] object-cover"
            loading="eager"
            placeholder="/avatar.png"
          />
          {isOnline && (
            <div className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] bg-[var(--color-background-21)] rounded-full border-4 border-[var(--color-background-15)]" />
          )}
        </div>

        <div className="flex-1 w-full pt-0 sm:pt-[20px] px-2 sm:px-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="w-full sm:w-auto">
              <h1 className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-bold text-[var(--color-background)] font-manrope mb-1 sm:mb-2 lg:mb-[8px] text-center sm:text-left">
                {username}
              </h1>
              {isOnline && (
                <div className="flex items-center gap-1 sm:gap-2 lg:gap-[8px] mb-2 sm:mb-3 lg:mb-[16px] justify-center sm:justify-start">
                  <div className="w-[6px] h-[6px] sm:w-[8px] sm:h-[8px] bg-[var(--color-background-21)] rounded-full" />
                  <span className="text-[12px] sm:text-[14px] lg:text-[16px] text-[var(--color-background-25)] opacity-65">
                    онлайн
                  </span>
                </div>
              )}
            </div>
            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 sm:gap-[12px] items-stretch sm:items-center">
              {isOwnProfile ? (
                <button
                  onClick={onEditProfile}
                  className="bg-[var(--color-background-21)] text-[var(--color-night-background)] px-3 sm:px-4 md:px-6 lg:px-[26px] py-2 sm:py-[10px] lg:py-[12px] rounded-[20px] font-medium text-[12px] sm:text-[14px] lg:text-[16px] hover:bg-[var(--color-background-23)] transition-colors"
                >
                  Редактировать профиль
                </button>
              ) : (
                <>
                  {friendshipStatus === 'none' && (
                    <button
                      onClick={onAddFriend}
                      className="bg-[var(--color-background-21)] text-[var(--color-night-background)] px-3 sm:px-4 md:px-6 lg:px-[26px] py-2 sm:py-[10px] lg:py-[12px] rounded-[20px] font-medium text-[12px] sm:text-[14px] lg:text-[16px] hover:bg-[var(--color-background-23)] transition-colors"
                    >
                      Додати до друзів
                    </button>
                  )}
                  {friendshipStatus === 'pending_outgoing' && (
                    <button
                      onClick={onCancelRequest}
                      className="bg-[var(--color-background-15)] text-[var(--color-background)] px-3 sm:px-4 md:px-6 lg:px-[26px] py-2 sm:py-[10px] lg:py-[12px] rounded-[20px] font-medium text-[12px] sm:text-[14px] lg:text-[16px] hover:bg-[var(--color-background-16)] transition-colors"
                    >
                      Скасувати запит
                    </button>
                  )}
                  {friendshipStatus === 'pending_incoming' && (
                    <button
                      onClick={onAcceptRequest}
                      className="bg-[var(--color-background-21)] text-[var(--color-night-background)] px-3 sm:px-4 md:px-6 lg:px-[26px] py-2 sm:py-[10px] lg:py-[12px] rounded-[20px] font-medium text-[12px] sm:text-[14px] lg:text-[16px] hover:bg-[var(--color-background-23)] transition-colors"
                    >
                      Прийняти запит
                    </button>
                  )}
                  {friendshipStatus === 'friends' && (
                    <div className="relative group">
                      <button className="bg-[var(--color-background-15)] text-[var(--color-background)] px-3 sm:px-4 md:px-6 lg:px-[26px] py-2 sm:py-[10px] lg:py-[12px] rounded-[20px] font-medium text-[12px] sm:text-[14px] lg:text-[16px] hover:bg-[var(--color-background-16)] transition-colors w-full sm:w-auto">
                        У друзях
                      </button>
                      <div className="absolute top-full right-0 sm:right-0 mt-[8px] bg-[var(--color-background-8)] rounded-[12px] p-[8px] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden sm:block">
                        <button
                          onClick={onRemoveFriend}
                          className="text-[var(--color-background-25)] hover:text-[var(--color-background)] text-[14px] whitespace-nowrap"
                        >
                          Видалити з друзів
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <p className="text-[12px] sm:text-[14px] lg:text-[16px] text-[var(--color-background)] leading-[1.5] max-w-full lg:max-w-[596px] mt-2 sm:mt-3 lg:mt-0 text-center sm:text-left">
            {bio}
          </p>
        </div>
      </div>
    </div>
  )
}
