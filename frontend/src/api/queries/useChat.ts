import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getConversations,
  getConversationHistory,
  uploadChatMedia,
  deleteMessage,
  getMessage,
  sendTextMessage,
  sendMediaMessage,
  clearConversationHistory,
} from '../chatAPI'
import type {
  ChatMessageDto,
  ChatConversationDto,
  SendTextMessageDto,
  SendMediaMessageDto,
} from '../types/chat'

// Query keys
export const chatKeys = {
  all: ['chat'] as const,
  conversations: () => [...chatKeys.all, 'conversations'] as const,
  conversationsPage: (page: number, pageSize: number) => 
    [...chatKeys.conversations(), { page, pageSize }] as const,
  conversationHistory: (friendId: string) => 
    [...chatKeys.all, 'conversationHistory', friendId] as const,
  conversationHistoryPage: (friendId: string, page: number, pageSize: number) => 
    [...chatKeys.conversationHistory(friendId), { page, pageSize }] as const,
  message: (messageId: string) => [...chatKeys.all, 'message', messageId] as const,
}

// Get conversations with pagination
export const useConversations = (page: number = 1, pageSize: number = 20) => {
  return useQuery({
    queryKey: chatKeys.conversationsPage(page, pageSize),
    queryFn: () => getConversations(page, pageSize),
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

// Get conversation history with pagination
export const useConversationHistory = (
  friendId: string,
  page: number = 1,
  pageSize: number = 50,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: chatKeys.conversationHistoryPage(friendId, page, pageSize),
    queryFn: () => getConversationHistory(friendId, page, pageSize),
    enabled: enabled && !!friendId,
    staleTime: 1000 * 60 * 1, // 1 minute
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

// Get specific message
export const useMessage = (messageId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: chatKeys.message(messageId),
    queryFn: () => getMessage(messageId),
    enabled: enabled && !!messageId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

// Upload chat media mutation
export const useUploadChatMedia = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => uploadChatMedia(file),
    onSuccess: () => {
      // Invalidate conversations to refresh last message previews
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() })
    },
  })
}

// Delete message mutation
export const useDeleteMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (messageId: string) => deleteMessage(messageId),
    onSuccess: (_, messageId) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() })
      
      // Remove the specific message from cache
      queryClient.removeQueries({ queryKey: chatKeys.message(messageId) })
      
      // Invalidate conversation history queries
      queryClient.invalidateQueries({ queryKey: chatKeys.all })
    },
  })
}

// Send text message mutation (REST API fallback)
export const useSendTextMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: SendTextMessageDto) => sendTextMessage(dto),
    onSuccess: (message) => {
      // Invalidate conversations to refresh last message previews
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() })
      
      // Invalidate conversation history for the specific friend
      queryClient.invalidateQueries({ 
        queryKey: chatKeys.conversationHistory(message.receiverId) 
      })
    },
  })
}

// Send media message mutation (REST API fallback)
export const useSendMediaMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: SendMediaMessageDto) => sendMediaMessage(dto),
    onSuccess: (message) => {
      // Invalidate conversations to refresh last message previews
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() })
      
      // Invalidate conversation history for the specific friend
      queryClient.invalidateQueries({ 
        queryKey: chatKeys.conversationHistory(message.receiverId) 
      })
    },
  })
}

// Helper hook to add a message to conversation history cache
export const useAddMessageToCache = () => {
  const queryClient = useQueryClient()

  return (message: ChatMessageDto) => {
    const friendId = message.senderId === message.receiverId ? message.senderId : 
      (message.senderId === message.receiverId ? message.senderId : 
        (message.senderId === message.receiverId ? message.senderId : message.receiverId))
    
    // Add message to conversation history cache
    queryClient.setQueryData(
      chatKeys.conversationHistory(friendId),
      (oldData: ChatMessageDto[] | undefined) => {
        if (!oldData) return [message]
        return [...oldData, message]
      }
    )

    // Update conversations list with new last message
    queryClient.setQueryData(
      chatKeys.conversations(),
      (oldData: ChatConversationDto[] | undefined) => {
        if (!oldData) return []
        
        return oldData.map(conversation => {
          if (conversation.friendId === friendId) {
            return {
              ...conversation,
              lastMessage: message,
              lastActivityAt: message.createdAt,
              unreadCount: message.senderId !== friendId ? conversation.unreadCount + 1 : conversation.unreadCount,
            }
          }
          return conversation
        })
      }
    )
  }
}

// Helper hook to update message in cache
export const useUpdateMessageInCache = () => {
  const queryClient = useQueryClient()

  return (messageId: string, updates: Partial<ChatMessageDto>) => {
    // Update specific message
    queryClient.setQueryData(
      chatKeys.message(messageId),
      (oldData: ChatMessageDto | undefined) => {
        if (!oldData) return oldData
        return { ...oldData, ...updates }
      }
    )

    // Update message in conversation history
    queryClient.setQueriesData(
      { queryKey: chatKeys.all },
      (oldData: ChatMessageDto[] | undefined) => {
        if (!oldData) return oldData
        return oldData.map(msg => msg.id === messageId ? { ...msg, ...updates } : msg)
      }
    )
  }
}

// Clear conversation history mutation
export const useClearConversationHistory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (friendId: string) => clearConversationHistory(friendId),
    onSuccess: (_, friendId) => {
      // Invalidate conversation history for this friend
      queryClient.invalidateQueries({ queryKey: chatKeys.conversationHistory(friendId) })
      
      // Invalidate conversations list
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() })
    },
  })
}
