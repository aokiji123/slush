import type { User } from '@/api/types/user'

export type FriendStatus = 'all' | 'online' | 'blocked' | 'pending'

export type Friend = {
  id: string
  userId: string
  nickname: string
  avatar?: string
  banner?: string
  isOnline: boolean
  level: number
  lastSeenAt?: string
  bio?: string
  email?: string
}

export type FriendRequest = {
  senderId: string
  receiverId: string
  status: string
  createdAt: string
  sender?: User
  receiver?: User
}

export type Friendship = {
  user1Id: string
  user2Id: string
  createdAt: string
  user1?: User
  user2?: User
}

export type SendFriendRequestDto = {
  receiverId: string
}

export type RespondFriendRequestDto = {
  senderId: string
  receiverId: string
}

export type BlockUserDto = {
  blockedUserId: string
}

export type UnblockUserDto = {
  blockedUserId: string
}

export type FriendWithGame = {
  id: string
  userId: string
  nickname: string
  avatar: string
}

export type FriendsWithGameResponse = {
  success: boolean
  message: string
  data: FriendWithGame[]
}

