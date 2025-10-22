import { LevelBadge } from './LevelBadge'
import { useCancelFriendRequest } from '@/api/queries/useFriendship'
import type { Friend } from '@/types/friendship'

interface OutgoingRequestCardProps extends Friend {
  currentUserId: string
}

export const OutgoingRequestCard = ({
  userId,
  nickname,
  avatar,
  level,
  isOnline,
  currentUserId,
}: OutgoingRequestCardProps) => {
  const cancelMutation = useCancelFriendRequest()

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync({
        senderId: currentUserId,
        receiverId: userId,
      })
    } catch (error) {
      console.error('Failed to cancel friend request:', error)
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

      <button
        onClick={handleCancel}
        disabled={cancelMutation.isPending}
        className="bg-[#FF4444] rounded-[12px] px-[20px] py-[8px] text-[14px] text-white font-medium hover:bg-[#FF6666] transition-colors disabled:opacity-50"
      >
        {cancelMutation.isPending ? 'Скасування...' : 'Скасувати'}
      </button>
    </div>
  )
}

