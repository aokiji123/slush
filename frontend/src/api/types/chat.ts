export interface ChatMessageDto {
  id: string
  senderId: string
  receiverId: string
  content?: string
  messageType: ChatMessageTypeDto
  mediaUrl?: string
  fileName?: string
  fileSize?: number
  contentType?: string
  createdAt: string
  isEdited: boolean
  editedAt?: string
  sender?: UserBasicDto
  receiver?: UserBasicDto
  attachments: ChatMessageAttachmentDto[]
}

export interface ChatMessageAttachmentDto {
  id: string
  messageId: string
  attachmentType: ChatMessageTypeDto
  url: string
  fileName: string
  fileSize: number
  contentType?: string
  createdAt: string
}

export interface UserBasicDto {
  id: string
  userName: string
  nickname: string
  avatar?: string
  isOnline: boolean
}

export enum ChatMessageTypeDto {
  Text = 0,
  Image = 1,
  Video = 2,
  Audio = 3
}

export interface ChatConversationDto {
  friendId: string
  friendNickname: string
  friendAvatar?: string
  friendIsOnline: boolean
  lastMessage?: ChatMessageDto
  unreadCount: number
  lastActivityAt: string
}

export interface SendTextMessageDto {
  receiverId: string
  content: string
}

export interface SendMediaMessageDto {
  receiverId: string
  messageType: ChatMessageTypeDto
  mediaUrl: string
  fileName: string
  fileSize: number
  contentType?: string
}

export interface TypingIndicatorDto {
  userId: string
  userNickname: string
  isTyping: boolean
}

export interface FileUploadDto {
  url: string
  fileName: string
  fileSize: number
  contentType: string
}

export interface ChatApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
}
