import { useState, useRef, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ConfirmationModal } from './ConfirmationModal'
import { useRemoveFriend, useBlockUser } from '@/api/queries/useFriendship'

interface FriendActionsMenuProps {
  friendId: string
  friendName: string
  currentUserId: string
  isOpen: boolean
  onClose: () => void
  buttonRef: React.RefObject<HTMLButtonElement | null>
}

export const FriendActionsMenu = ({
  friendId,
  friendName,
  currentUserId,
  isOpen,
  onClose,
  buttonRef,
}: FriendActionsMenuProps) => {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const menuRef = useRef<HTMLDivElement>(null)
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [showBlockModal, setShowBlockModal] = useState(false)

  const removeFriendMutation = useRemoveFriend()
  const blockUserMutation = useBlockUser()

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose, buttonRef])

  const handleViewProfile = () => {
    navigate({ to: `/profile/${friendId}` })
    onClose()
  }

  const handleSendMessage = () => {
    // Mock implementation
    alert(t('friends.actions.chatComingSoon'))
    onClose()
  }

  const handleRemoveFriend = async () => {
    try {
      await removeFriendMutation.mutateAsync({
        senderId: currentUserId,
        receiverId: friendId,
      })
      setShowRemoveModal(false)
    } catch (error) {
      console.error('Failed to remove friend:', error)
      // Keep modal open on error so user can try again
    }
  }

  const handleBlockUser = async () => {
    try {
      await blockUserMutation.mutateAsync(friendId)
      setShowBlockModal(false)
    } catch (error) {
      console.error('Failed to block user:', error)
      // Keep modal open on error so user can try again
    }
  }

  // Calculate menu position based on button position
  const getMenuPosition = () => {
    if (!buttonRef.current) return { top: 0, left: 0 }

    const buttonRect = buttonRef.current.getBoundingClientRect()
    return {
      top: buttonRect.bottom + 8,
      left: buttonRect.left - 200 + buttonRect.width,
    }
  }

  const position = getMenuPosition()

  return (
    <>
      {isOpen && (
        <div
          ref={menuRef}
          className="fixed z-40 bg-[var(--color-background-15)] rounded-[12px] py-[8px] shadow-lg min-w-[200px]"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
        <button
          onClick={handleViewProfile}
          className="w-full px-[16px] py-[10px] text-left text-[16px] text-[var(--color-background)] hover:bg-[var(--color-background-18)] transition-colors"
        >
          {t('friends.actions.viewProfile')}
        </button>

        <button
          onClick={handleSendMessage}
          className="w-full px-[16px] py-[10px] text-left text-[16px] text-[var(--color-background)] hover:bg-[var(--color-background-18)] transition-colors"
        >
          {t('friends.actions.sendMessage')}
        </button>

        <div className="h-[1px] bg-[var(--color-background-16)] my-[8px]" />

        <button
          onClick={() => {
            setShowRemoveModal(true)
            onClose()
          }}
          className="w-full px-[16px] py-[10px] text-left text-[16px] text-[var(--color-background)] hover:bg-[var(--color-background-18)] transition-colors"
        >
          {t('friends.actions.removeFriend')}
        </button>

        <button
          onClick={() => {
            setShowBlockModal(true)
            onClose()
          }}
          className="w-full px-[16px] py-[10px] text-left text-[16px] text-[#FF4444] hover:bg-[var(--color-background-18)] transition-colors"
        >
          {t('friends.actions.block')}
        </button>
        </div>
      )}

      {/* Remove Friend Confirmation */}
      <ConfirmationModal
        isOpen={showRemoveModal}
        title={t('friends.actions.removeConfirm.title')}
        message={t('friends.actions.removeConfirm.message', { name: friendName })}
        confirmText={t('friends.actions.removeConfirm.confirm')}
        cancelText={t('friends.actions.removeConfirm.cancel')}
        onConfirm={handleRemoveFriend}
        onCancel={() => {
          setShowRemoveModal(false)
        }}
        isDestructive
        isLoading={removeFriendMutation.isPending}
      />

      {/* Block User Confirmation */}
      <ConfirmationModal
        isOpen={showBlockModal}
        title={t('friends.actions.blockConfirm.title')}
        message={t('friends.actions.blockConfirm.message', { name: friendName })}
        confirmText={t('friends.actions.blockConfirm.confirm')}
        cancelText={t('friends.actions.blockConfirm.cancel')}
        onConfirm={handleBlockUser}
        onCancel={() => {
          setShowBlockModal(false)
        }}
        isDestructive
        isLoading={blockUserMutation.isPending}
      />
    </>
  )
}

