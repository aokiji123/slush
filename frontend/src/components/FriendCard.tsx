import { useState, useRef } from 'react'
import { LevelBadge } from './LevelBadge'
import { FriendActionsMenu } from './FriendActionsMenu'

interface FriendCardProps {
  id: string
  userId: string
  username: string
  avatar?: string
  level: number
  isOnline: boolean
  currentUserId: string
}

export const FriendCard = ({
  userId,
  username,
  avatar,
  level,
  isOnline,
  currentUserId,
}: FriendCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <div className="bg-[var(--color-background-15)] rounded-[12px] p-[16px] flex items-center justify-between">
      <div className="flex items-center gap-[16px]">
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
        <p className="font-bold text-[16px] text-[var(--color-background)] leading-[1.25] tracking-[-0.16px]">
          {username}
        </p>
      </div>
      <div className="flex items-center gap-[16px]">
        <LevelBadge level={level} />
        <button
          ref={buttonRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center justify-center overflow-clip cursor-pointer w-[24px] h-[24px]"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
              fill="#F1FDFF"
            />
            <path
              d="M19 14C20.1046 14 21 13.1046 21 12C21 10.8954 20.1046 10 19 10C17.8954 10 17 10.8954 17 12C17 13.1046 17.8954 14 19 14Z"
              fill="#F1FDFF"
            />
            <path
              d="M5 14C6.10457 14 7 13.1046 7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12C3 13.1046 3.89543 14 5 14Z"
              fill="#F1FDFF"
            />
          </svg>
        </button>
      </div>

      <FriendActionsMenu
        friendId={userId}
        friendName={username}
        currentUserId={currentUserId}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        buttonRef={buttonRef}
      />
    </div>
  )
}

