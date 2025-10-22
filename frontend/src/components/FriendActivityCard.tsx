interface FriendActivityCardProps {
  type: 'wish' | 'buy' | 'screenshot'
  username: string
  avatar: string
  isOnline: boolean
  gameName: string
  gameImage: string
  gameImages?: string[]
  screenshotCount?: number
}

export const FriendActivityCard = ({
  type,
  username,
  avatar,
  isOnline,
  gameName,
  gameImage,
  gameImages,
  screenshotCount,
}: FriendActivityCardProps) => {
  const getActionText = () => {
    switch (type) {
      case 'wish':
        return 'бажає:'
      case 'buy':
        return 'купує:'
      case 'screenshot':
        return 'Нові скріншоти:'
      default:
        return ''
    }
  }

  return (
    <div className="bg-[var(--color-background-15)] rounded-[16px] p-[12px] flex flex-col gap-[12px]">
      <div className="flex items-center gap-[12px]">
        <div className="relative w-[44px] h-[44px] flex-shrink-0">
          <img
            src={avatar}
            alt={username}
            className="w-[44px] h-[44px] rounded-[39px] object-cover"
          />
          {isOnline && (
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
        <div className="flex-1 flex flex-col gap-[4px]">
          {type === 'screenshot' ? (
            <>
              <p className="font-bold text-[16px] text-[var(--color-background)] leading-[1.25] tracking-[-0.16px]">
                {username}
              </p>
              <div className="flex items-start gap-[4px] text-[14px] leading-[1.15] tracking-[-0.14px] text-[var(--color-background-25)]">
                <p>{getActionText()}</p>
                <p className="font-bold">{screenshotCount}</p>
              </div>
            </>
          ) : (
            <>
              <p className="text-[16px] leading-[1.25] text-[var(--color-background)]">
                <span className="font-bold tracking-[-0.16px]">{username}</span>{' '}
                <span className="font-normal tracking-[-0.16px]">{getActionText()}</span>
              </p>
              <p className="font-bold text-[16px] text-[var(--color-background)] leading-[1.25] tracking-[-0.16px] truncate">
                {gameName}
              </p>
            </>
          )}
        </div>
      </div>

      {type === 'screenshot' && gameImages ? (
        <div className="flex flex-col gap-[4px]">
          <img
            src={gameImages[0]}
            alt="Screenshot"
            className="w-full h-[160px] object-cover rounded-[8px]"
          />
          <div className="flex gap-[4px]">
            <img
              src={gameImages[1]}
              alt="Screenshot"
              className="flex-1 h-[64px] object-cover rounded-[8px]"
            />
            <img
              src={gameImages[2]}
              alt="Screenshot"
              className="flex-1 h-[64px] object-cover rounded-[8px]"
            />
            {screenshotCount && screenshotCount > 3 && (
              <div className="w-[64px] h-[64px] bg-[var(--color-background-18)] rounded-[8px] flex items-center justify-center">
                <p className="text-[16px] text-[var(--color-background-25)] leading-[1.25] tracking-[-0.16px]">
                  +{screenshotCount - 3}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <img
          src={gameImage}
          alt={gameName}
          className="w-full h-[88px] object-cover rounded-[8px]"
        />
      )}
    </div>
  )
}

