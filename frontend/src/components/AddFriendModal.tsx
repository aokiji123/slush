import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchUsers, useAuthenticatedUser } from '@/api/queries/useUser'
import { useSendFriendRequest, useFriendRequests, useFriends, useBlockedUsers, useUnblockUser } from '@/api/queries/useFriendship'
import { useToastStore } from '@/lib/toast-store'

interface AddFriendModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AddFriendModal = ({ isOpen, onClose }: AddFriendModalProps) => {
  const { t } = useTranslation('common')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const { data: currentUser } = useAuthenticatedUser()
  const { data: searchResults, isLoading: isSearching } = useSearchUsers(debouncedQuery)
  const sendFriendRequestMutation = useSendFriendRequest()
  const unblockUserMutation = useUnblockUser()
  const { error: showError, success: showSuccess } = useToastStore()
  
  // Get friend IDs, outgoing requests, and blocked users to check status
  const { data: friends } = useFriends(currentUser?.id ?? '')
  const { outgoing } = useFriendRequests(currentUser?.id ?? '')
  const { data: blockedUsers } = useBlockedUsers(currentUser?.id ?? '')

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  if (!isOpen) return null

  const handleSendRequest = async (receiverId: string) => {
    try {
      await sendFriendRequestMutation.mutateAsync(receiverId)
      showSuccess(t('friends.addModal.requestSentSuccess'))
    } catch (error: any) {
      console.error('Failed to send friend request:', error)
      const errorMessage = error?.response?.data?.message || t('friends.addModal.requestSentError')
      showError(errorMessage)
    }
  }

  const handleUnblock = async (blockedUserId: string) => {
    try {
      await unblockUserMutation.mutateAsync(blockedUserId)
      showSuccess(t('friends.addModal.unblockSuccess'))
    } catch (error: any) {
      console.error('Failed to unblock user:', error)
      const errorMessage = error?.response?.data?.message || t('friends.addModal.unblockError')
      showError(errorMessage)
    }
  }

  const getFriendIds = () => friends?.map((f) => f.userId) ?? []
  const getOutgoingIds = () => outgoing.map((r) => r.userId)
  const getBlockedIds = () => blockedUsers?.map((b) => b.userId) ?? []

  const getUserStatus = (userId: string) => {
    if (userId === currentUser?.id) return 'self'
    if (getFriendIds().includes(userId)) return 'friend'
    if (getOutgoingIds().includes(userId)) return 'pending'
    if (getBlockedIds().includes(userId)) return 'blocked'
    return 'none'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-60"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[var(--color-background-8)] rounded-[20px] p-[32px] w-[600px] max-w-[90vw] max-h-[80vh] flex flex-col">
        <h2 className="font-manrope font-bold text-[24px] text-[var(--color-background)] leading-[1.1] mb-[24px]">
          {t('friends.addModal.title')}
        </h2>

        {/* Search Input */}
        <input
          type="text"
          placeholder={t('friends.addModal.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-[var(--color-night-background)] bg-opacity-40 border border-[var(--color-background-16)] rounded-[22px] px-[16px] py-[10px] text-[16px] text-[var(--color-background)] placeholder:text-[var(--color-background-25)] placeholder:opacity-65 leading-[1.25] tracking-[-0.16px] outline-none mb-[24px]"
          autoFocus
        />

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto mb-[24px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {isSearching ? (
            <div className="flex items-center justify-center py-[40px]">
              <p className="text-[16px] text-[var(--color-background-25)] opacity-65">
                {t('friends.addModal.searching')}
              </p>
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="flex flex-col gap-[8px]">
              {searchResults.map((user) => {
                const status = getUserStatus(user.id)
                return (
                  <div
                    key={user.id}
                    className="bg-[var(--color-background-15)] rounded-[12px] p-[16px] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-[16px]">
                      <div className="relative w-[44px] h-[44px] flex-shrink-0">
                        <img
                          src={user.avatar || '/avatar.png'}
                          alt={user.nickname}
                          className="w-[44px] h-[44px] rounded-[39px] object-cover"
                        />
                        {user.isOnline && (
                          <div className="absolute bottom-0 left-[72.73%] right-0 top-[72.73%]">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                cx="6"
                                cy="6"
                                r="5"
                                fill="#8EFF72"
                                stroke="#002F3D"
                                strokeWidth="2"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="font-bold text-[16px] text-[var(--color-background)] leading-[1.25] tracking-[-0.16px]">
                        {user.nickname}
                      </p>
                    </div>

                    {status === 'self' ? (
                      <span className="text-[14px] text-[var(--color-background-25)] opacity-65">
                        {t('friends.addModal.status.self')}
                      </span>
                    ) : status === 'friend' ? (
                      <span className="text-[14px] text-[var(--color-background-21)]">
                        {t('friends.addModal.status.alreadyFriends')}
                      </span>
                    ) : status === 'pending' ? (
                      <span className="text-[14px] text-[var(--color-background-25)] opacity-65">
                        {t('friends.addModal.status.requestSent')}
                      </span>
                    ) : status === 'blocked' ? (
                      <button
                        onClick={() => handleUnblock(user.id)}
                        disabled={unblockUserMutation.isPending}
                        className="bg-[var(--color-background-18)] rounded-[12px] px-[20px] py-[8px] text-[14px] text-[var(--color-background)] font-medium hover:bg-[var(--color-background-16)] transition-colors disabled:opacity-50"
                      >
                        {t('friends.addModal.unblock')}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSendRequest(user.id)}
                        disabled={sendFriendRequestMutation.isPending}
                        className="bg-[var(--color-background-21)] rounded-[12px] px-[20px] py-[8px] text-[14px] text-[var(--color-night-background)] font-medium hover:bg-[var(--color-background-23)] transition-colors disabled:opacity-50"
                      >
                        {t('friends.addModal.sendRequest')}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          ) : debouncedQuery.length >= 2 ? (
            <div className="flex items-center justify-center py-[40px]">
              <p className="text-[16px] text-[var(--color-background-25)] opacity-65">
                {t('friends.addModal.noResults')}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center py-[40px]">
              <p className="text-[16px] text-[var(--color-background-25)] opacity-65">
                {t('friends.addModal.enterNickname')}
              </p>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="bg-[var(--color-background-18)] rounded-[20px] px-[26px] py-[12px] text-[16px] text-[var(--color-background)] font-medium leading-[1.25] hover:bg-[var(--color-background-16)] transition-colors"
        >
          {t('friends.addModal.close')}
        </button>
      </div>
    </div>
  )
}

