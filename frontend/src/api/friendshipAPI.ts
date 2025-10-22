import axiosInstance from '.'
import type {
  FriendRequest,
  Friendship,
  SendFriendRequestDto,
  RespondFriendRequestDto,
  BlockUserDto,
  UnblockUserDto,
} from '../types/friendship'

// Send friend request
export async function sendFriendRequest(receiverId: string): Promise<FriendRequest> {
  const dto: SendFriendRequestDto = { receiverId }
  const { data } = await axiosInstance.post('/friendship/send', dto)
  return data.data
}

// Accept friend request
export async function acceptFriendRequest(
  senderId: string,
  receiverId: string
): Promise<Friendship> {
  const dto: RespondFriendRequestDto = { senderId, receiverId }
  const { data } = await axiosInstance.post('/friendship/accept', dto)
  return data.data
}

// Decline friend request
export async function declineFriendRequest(
  senderId: string,
  receiverId: string
): Promise<void> {
  const dto: RespondFriendRequestDto = { senderId, receiverId }
  await axiosInstance.post('/friendship/decline', dto)
}

// Cancel friend request
export async function cancelFriendRequest(
  senderId: string,
  receiverId: string
): Promise<void> {
  const dto: RespondFriendRequestDto = { senderId, receiverId }
  await axiosInstance.delete('/friendship/cancel', { data: dto })
}

// Remove friend
export async function removeFriend(
  senderId: string,
  receiverId: string
): Promise<void> {
  const dto: RespondFriendRequestDto = { senderId, receiverId }
  await axiosInstance.delete('/friendship/remove', { data: dto })
}

// Block user
export async function blockUser(blockedUserId: string): Promise<void> {
  const dto: BlockUserDto = { blockedUserId }
  await axiosInstance.post('/friendship/block', dto)
}

// Unblock user
export async function unblockUser(blockedUserId: string): Promise<void> {
  const dto: UnblockUserDto = { blockedUserId }
  await axiosInstance.delete('/friendship/unblock', { data: dto })
}

// Get friends
export async function getFriends(userId: string): Promise<Friendship[]> {
  const { data } = await axiosInstance.get(`/friendship/friends/${userId}`)
  return data.data
}

// Get online friends
export async function getOnlineFriends(userId: string): Promise<string[]> {
  const { data } = await axiosInstance.get(`/friendship/online/${userId}`)
  return data.data
}

// Get blocked users
export async function getBlockedUsers(userId: string): Promise<string[]> {
  const { data } = await axiosInstance.get(`/friendship/blocked/${userId}`)
  return data.data
}

// Get incoming requests
export async function getIncomingRequests(userId: string): Promise<string[]> {
  const { data } = await axiosInstance.get(`/friendship/incoming/${userId}`)
  return data.data
}

// Get outgoing requests
export async function getOutgoingRequests(userId: string): Promise<string[]> {
  const { data } = await axiosInstance.get(`/friendship/outgoing/${userId}`)
  return data.data
}

