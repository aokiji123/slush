import { LevelBadge } from './LevelBadge'
import { useAcceptFriendRequest, useDeclineFriendRequest } from '@/api/queries/useFriendship'
import type { Friend } from '@/types/friendship'

interface IncomingRequestCardProps extends Friend {
  currentUserId: string
}

export const IncomingRequestCard = ({
  userId,
  nickname,
  avatar,
  level,
  isOnline,
  currentUserId,
}: IncomingRequestCardProps) => {
  const acceptMutation = useAcceptFriendRequest()
  const declineMutation = useDeclineFriendRequest()

  const handleAccept = async () => {
    try {
      await acceptMutation.mutateAsync({
        senderId: userId,
        receiverId: currentUserId,
      })
    } catch (error) {
      console.error('Failed to accept friend request:', error)
    }
  }

  const handleDecline = async () => {
    try {
      await declineMutation.mutateAsync({
        senderId: userId,
        receiverId: currentUserId,
      })
    } catch (error) {
      console.error('Failed to decline friend request:', error)
    }
  }

  return (
    <div className="bg-[var(--color-background-15)] rounded-[12px] p-[16px] flex items-center justify-between">
      <div className="flex items-center gap-[16px]">
        <div className="relative w-[44px] h-[44px] flex-shrink-0">
          <img
            src={avatar || '/avatar.png'}
            alt={nickname}
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
        <div className="flex items-center gap-[16px]">
          <p className="font-bold text-[16px] text-[var(--color-background)] leading-[1.25] tracking-[-0.16px]">
            {nickname}
          </p>
          <LevelBadge level={level} />
        </div>
      </div>

      <div className="flex items-center gap-[8px]">
        <button
          onClick={handleAccept}
          disabled={acceptMutation.isPending || declineMutation.isPending}
          className="bg-[var(--color-background-21)] rounded-[12px] px-[20px] py-[8px] text-[14px] text-[var(--color-night-background)] font-medium hover:bg-[var(--color-background-23)] transition-colors disabled:opacity-50"
        >
          {acceptMutation.isPending ? 'Прийняття...' : 'Прийняти'}
        </button>
        <button
          onClick={handleDecline}
          disabled={acceptMutation.isPending || declineMutation.isPending}
          className="bg-[var(--color-background-18)] rounded-[12px] px-[20px] py-[8px] text-[14px] text-[var(--color-background)] font-medium hover:bg-[var(--color-background-16)] transition-colors disabled:opacity-50"
        >
          {declineMutation.isPending ? 'Відхилення...' : 'Відхилити'}
        </button>
      </div>
    </div>
  )
}

