import axiosInstance from './index'
import type {
  ChatMessageDto,
  ChatConversationDto,
  SendTextMessageDto,
  SendMediaMessageDto,
  FileUploadDto,
  ChatApiResponse,
} from './types/chat'

// Get all conversations for the current user
export const getConversations = async (
  page: number = 1,
  pageSize: number = 20
): Promise<ChatConversationDto[]> => {
  const { data } = await axiosInstance.get<ChatApiResponse<ChatConversationDto[]>>(
    `/chat/conversations?page=${page}&pageSize=${pageSize}`
  )
  
  if (!data.success || !data.data) {
    throw new Error(data.message || 'Failed to fetch conversations')
  }
  
  return data.data
}

// Get conversation history between the current user and a friend
export const getConversationHistory = async (
  friendId: string,
  page: number = 1,
  pageSize: number = 50
): Promise<ChatMessageDto[]> => {
  const { data } = await axiosInstance.get<ChatApiResponse<ChatMessageDto[]>>(
    `/chat/messages/${friendId}?page=${page}&pageSize=${pageSize}`
  )
  
  if (!data.success || !data.data) {
    throw new Error(data.message || 'Failed to fetch conversation history')
  }
  
  return data.data
}

// Upload a media file for chat
export const uploadChatMedia = async (file: File, receiverId?: string): Promise<FileUploadDto> => {
  console.log('uploadChatMedia called with:', { fileName: file.name, fileSize: file.size, fileType: file.type, receiverId })
  
  const formData = new FormData()
  formData.append('file', file)
  
  // Debug FormData contents
  console.log('FormData entries:')
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value)
  }
  
  const url = receiverId ? `/chat/upload-file?receiverId=${receiverId}` : '/chat/upload-file'
  console.log('Upload URL:', url)
  
  const { data } = await axiosInstance.post<ChatApiResponse<FileUploadDto>>(
    url,
    formData
  )
  
  if (!data.success || !data.data) {
    throw new Error(data.message || 'Failed to upload media file')
  }
  
  return data.data
}

// Delete a message
export const deleteMessage = async (messageId: string): Promise<void> => {
  const { data } = await axiosInstance.delete<ChatApiResponse<object>>(
    `/chat/messages/${messageId}`
  )
  
  if (!data.success) {
    throw new Error(data.message || 'Failed to delete message')
  }
}

// Get a specific message by ID
export const getMessage = async (messageId: string): Promise<ChatMessageDto> => {
  const { data } = await axiosInstance.get<ChatApiResponse<ChatMessageDto>>(
    `/chat/messages/details/${messageId}`
  )
  
  if (!data.success || !data.data) {
    throw new Error(data.message || 'Failed to fetch message')
  }
  
  return data.data
}

// Send a text message (for REST API fallback)
export const sendTextMessage = async (dto: SendTextMessageDto): Promise<ChatMessageDto> => {
  const { data } = await axiosInstance.post<ChatApiResponse<ChatMessageDto>>(
    '/chat/send-text',
    dto
  )
  
  if (!data.success || !data.data) {
    throw new Error(data.message || 'Failed to send text message')
  }
  
  return data.data
}

// Send a media message (for REST API fallback)
export const sendMediaMessage = async (dto: SendMediaMessageDto): Promise<ChatMessageDto> => {
  const { data } = await axiosInstance.post<ChatApiResponse<ChatMessageDto>>(
    '/chat/send-media',
    dto
  )
  
  if (!data.success || !data.data) {
    throw new Error(data.message || 'Failed to send media message')
  }
  
  return data.data
}
