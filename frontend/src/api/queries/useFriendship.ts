import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as friendshipAPI from '../friendshipAPI'
import { getUserById } from '../userAPI'
import type { Friend } from '../../types/friendship'
import type { User } from '../types/user'

// Helper function to convert user to friend format
const userToFriend = (user: User): Friend => ({
  id: user.id,
  userId: user.id,
  nickname: user.nickname,
  avatar: user.avatar,
  banner: user.banner,
  isOnline: user.isOnline ?? false,
  level: 1, // TODO: Implement level calculation based on user data
  lastSeenAt: user.lastSeenAt,
  bio: user.bio,
  email: user.email,
})

// Query: Get all friends
export function useFriends(userId: string) {
  return useQuery({
    queryKey: ['friends', userId],
    queryFn: async () => {
      const friendships = await friendshipAPI.getFriends(userId)
      
      // Fetch user details for each friend
      const friendPromises = friendships.map(async (friendship) => {
        const friendId = friendship.user1Id === userId ? friendship.user2Id : friendship.user1Id
        const user = await getUserById(friendId)
        return userToFriend(user)
      })
      
      return await Promise.all(friendPromises)
    },
    enabled: !!userId,
  })
}

// Query: Get online friends
export function useOnlineFriends(userId: string) {
  return useQuery({
    queryKey: ['onlineFriends', userId],
    queryFn: async () => {
      const onlineFriendIds = await friendshipAPI.getOnlineFriends(userId)
      
      // Fetch user details for each online friend
      const friendPromises = onlineFriendIds.map(async (friendId) => {
        const user = await getUserById(friendId)
        return userToFriend(user)
      })
      
      return await Promise.all(friendPromises)
    },
    enabled: !!userId,
  })
}

// Query: Get blocked users
export function useBlockedUsers(userId: string) {
  return useQuery({
    queryKey: ['blockedUsers', userId],
    queryFn: async () => {
      const blockedUserIds = await friendshipAPI.getBlockedUsers(userId)
      
      // Fetch user details for each blocked user
      const userPromises = blockedUserIds.map(async (blockedId) => {
        const user = await getUserById(blockedId)
        return userToFriend(user)
      })
      
      return await Promise.all(userPromises)
    },
    enabled: !!userId,
  })
}

// Query: Get friend requests (incoming and outgoing)
export function useFriendRequests(userId: string) {
  const incomingQuery = useQuery({
    queryKey: ['incomingRequests', userId],
    queryFn: async () => {
      const senderIds = await friendshipAPI.getIncomingRequests(userId)
      
      // Fetch user details for each sender
      const senderPromises = senderIds.map(async (senderId) => {
        const user = await getUserById(senderId)
        return userToFriend(user)
      })
      
      return await Promise.all(senderPromises)
    },
    enabled: !!userId,
  })

  const outgoingQuery = useQuery({
    queryKey: ['outgoingRequests', userId],
    queryFn: async () => {
      const receiverIds = await friendshipAPI.getOutgoingRequests(userId)
      
      // Fetch user details for each receiver
      const receiverPromises = receiverIds.map(async (receiverId) => {
        const user = await getUserById(receiverId)
        return userToFriend(user)
      })
      
      return await Promise.all(receiverPromises)
    },
    enabled: !!userId,
  })

  return {
    incoming: incomingQuery.data ?? [],
    outgoing: outgoingQuery.data ?? [],
    isLoading: incomingQuery.isLoading || outgoingQuery.isLoading,
    isError: incomingQuery.isError || outgoingQuery.isError,
  }
}

// Mutation: Send friend request
export function useSendFriendRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (receiverId: string) => friendshipAPI.sendFriendRequest(receiverId),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['outgoingRequests'] })
    },
  })
}

// Mutation: Accept friend request
export function useAcceptFriendRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ senderId, receiverId }: { senderId: string; receiverId: string }) =>
      friendshipAPI.acceptFriendRequest(senderId, receiverId),
    onSuccess: () => {
      // Invalidate all friend-related queries
      queryClient.invalidateQueries({ queryKey: ['friends'] })
      queryClient.invalidateQueries({ queryKey: ['incomingRequests'] })
      queryClient.invalidateQueries({ queryKey: ['onlineFriends'] })
    },
  })
}

// Mutation: Decline friend request
export function useDeclineFriendRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ senderId, receiverId }: { senderId: string; receiverId: string }) =>
      friendshipAPI.declineFriendRequest(senderId, receiverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomingRequests'] })
    },
  })
}

// Mutation: Cancel friend request
export function useCancelFriendRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ senderId, receiverId }: { senderId: string; receiverId: string }) =>
      friendshipAPI.cancelFriendRequest(senderId, receiverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outgoingRequests'] })
    },
  })
}

// Mutation: Remove friend
export function useRemoveFriend() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ senderId, receiverId }: { senderId: string; receiverId: string }) =>
      friendshipAPI.removeFriend(senderId, receiverId),
    onSuccess: () => {
      // Invalidate all friend-related queries
      queryClient.invalidateQueries({ queryKey: ['friends'] })
      queryClient.invalidateQueries({ queryKey: ['onlineFriends'] })
    },
  })
}

// Mutation: Block user
export function useBlockUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (blockedUserId: string) => friendshipAPI.blockUser(blockedUserId),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['friends'] })
      queryClient.invalidateQueries({ queryKey: ['blockedUsers'] })
      queryClient.invalidateQueries({ queryKey: ['onlineFriends'] })
    },
  })
}

// Mutation: Unblock user
export function useUnblockUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (blockedUserId: string) => friendshipAPI.unblockUser(blockedUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockedUsers'] })
    },
  })
}

// Query: Get friends who own a specific game
export function useFriendsWhoOwnGame(gameId: string) {
  return useQuery({
    queryKey: ['friendsWhoOwnGame', gameId],
    queryFn: () => friendshipAPI.getFriendsWhoOwnGame(gameId),
    enabled: !!gameId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

// Query: Get friends who have a game in their wishlist
export function useFriendsWhoWishlistGame(gameId: string) {
  return useQuery({
    queryKey: ['friendsWhoWishlistGame', gameId],
    queryFn: () => friendshipAPI.getFriendsWhoWishlistGame(gameId),
    enabled: !!gameId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

// Query: Get friendship status between two users
export function useFriendshipStatus(userId: string, otherUserId: string) {
  return useQuery({
    queryKey: ['friendshipStatus', userId, otherUserId],
    queryFn: async () => {
      const friendship = await friendshipAPI.getFriendshipBetweenUsers(userId, otherUserId)
      if (!friendship) return 'none'
      // If friendship exists, it means they are friends
      return 'friends'
    },
    enabled: !!userId && !!otherUserId && userId !== otherUserId,
  })
}

