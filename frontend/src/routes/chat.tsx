import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ConversationList } from '@/components/chat/ConversationList'
import { ChatEmptyState } from '@/components/chat/ChatEmptyState'
import { ChatProfileSidebar } from '@/components/chat/ChatProfileSidebar'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { MessageInput } from '@/components/chat/MessageInput'
import { DateDivider } from '@/components/chat/DateDivider'
import { useSignalRContext } from '@/providers/SignalRProvider'
import { uploadChatMedia } from '@/api/chatAPI'
import { useConversationHistory } from '@/api/queries/useChat'
import { ChatMessageTypeDto } from '@/api/types/chat'
import type { ChatConversationDto, ChatMessageDto } from '@/api/types/chat'

export const Route = createFileRoute('/chat')({
  component: ChatPage,
})

function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<ChatConversationDto | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [messages, setMessages] = useState<ChatMessageDto[]>([])
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false)
  const [onlineFriends, setOnlineFriends] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const loadedConversationRef = useRef<string | null>(null)
  const { sendTextMessage, sendMediaMessage, isConnected, onMessageReceived, onMessageSent, onOnlineFriends, onUserStatusChanged, getOnlineFriends } = useSignalRContext()

  // Load conversation history from API
  const { 
    data: conversationMessages = [], 
    isLoading: isLoadingMessages,
    error: messagesError 
  } = useConversationHistory(
    selectedConversation?.friendId || '', 
    1, 
    50, 
    !!selectedConversation
  )

  const handleConversationSelect = useCallback((conversation: ChatConversationDto) => {
    setSelectedConversation(conversation)
  }, [])

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  // Initialize messages from API data when conversation changes
  useEffect(() => {
    if (selectedConversation && conversationMessages.length > 0) {
      const conversationId = selectedConversation.friendId
      // Only initialize if we haven't loaded this conversation yet
      if (loadedConversationRef.current !== conversationId) {
        setMessages(conversationMessages)
        loadedConversationRef.current = conversationId
      }
    } else if (!selectedConversation) {
      setMessages([])
      loadedConversationRef.current = null
    }
  }, [selectedConversation?.friendId, conversationMessages.length])

  // Helper function to determine message type from MIME type
  const getMessageType = useCallback((contentType: string): number => {
    if (contentType.startsWith('image/')) return ChatMessageTypeDto.Image
    if (contentType.startsWith('video/')) return ChatMessageTypeDto.Video
    if (contentType.startsWith('audio/')) return ChatMessageTypeDto.Audio
    // For documents, we'll treat them as text messages and handle them in MessageBubble
    return ChatMessageTypeDto.Text
  }, [])

  // Listen for incoming messages
  useEffect(() => {
    const handleMessageReceived = (message: ChatMessageDto) => {
      console.log('📨 Message received:', message)
      setMessages(prev => {
        // Check if message already exists to avoid duplicates
        const exists = prev.some(m => m.id === message.id)
        if (exists) {
          console.log('Message already exists, skipping duplicate')
          return prev
        }
        return [...prev, message]
      })
      // Auto-scroll for received messages (not sent ones)
      setTimeout(() => {
        if (!isUserScrolledUp) {
          const container = messagesContainerRef.current
          if (container) {
            container.scrollTo({
              top: container.scrollHeight,
              behavior: 'smooth'
            })
          }
        }
      }, 100)
    }

    const handleMessageSent = (message: ChatMessageDto) => {
      console.log('📤 Message sent:', message)
      setMessages(prev => {
        // Check if message already exists to avoid duplicates
        const exists = prev.some(m => m.id === message.id)
        if (exists) {
          console.log('Message already exists, skipping duplicate')
          return prev
        }
        return [...prev, message]
      })
      // Auto-scroll for sent messages only if user is near bottom
      setTimeout(() => {
        if (!isUserScrolledUp) {
          const container = messagesContainerRef.current
          if (container) {
            container.scrollTo({
              top: container.scrollHeight,
              behavior: 'smooth'
            })
          }
        }
      }, 100)
    }

    onMessageReceived(handleMessageReceived)
    onMessageSent(handleMessageSent)

    return () => {
      // Cleanup listeners if needed
    }
  }, [onMessageReceived, onMessageSent, isUserScrolledUp])

  // Listen for online friends updates
  useEffect(() => {
    const handleOnlineFriends = (userIds: string[]) => {
      console.log('📱 Online friends updated:', userIds)
      setOnlineFriends(userIds)
    }

    onOnlineFriends(handleOnlineFriends)

    // Get initial online friends list when connected
    if (isConnected) {
      getOnlineFriends()
    }

    return () => {
      // Cleanup if needed
    }
  }, [onOnlineFriends, getOnlineFriends, isConnected])

  // Periodic online status refresh
  useEffect(() => {
    if (!isConnected) return

    const refreshOnlineStatus = () => {
      console.log('🔄 Refreshing online status...')
      getOnlineFriends()
    }

    // Refresh immediately when connected
    refreshOnlineStatus()

    // Set up periodic refresh every 30 seconds
    const interval = setInterval(refreshOnlineStatus, 30000)

    return () => {
      clearInterval(interval)
    }
  }, [isConnected, getOnlineFriends])

  // Listen for real-time user status changes
  useEffect(() => {
    const handleUserStatusChanged = (data: { userId: string, isOnline: boolean }) => {
      console.log('👤 User status changed:', data)
      setOnlineFriends(prev => {
        if (data.isOnline) {
          // Add user to online list if not already present
          return prev.includes(data.userId) ? prev : [...prev, data.userId]
        } else {
          // Remove user from online list
          return prev.filter(id => id !== data.userId)
        }
      })
    }

    onUserStatusChanged(handleUserStatusChanged)

    return () => {
      // Cleanup if needed
    }
  }, [onUserStatusChanged])

  // Sort messages chronologically (oldest first) and group by date
  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
  }, [messages])

  // Detect if user has scrolled up
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50
      setIsUserScrolledUp(!isNearBottom)
    }

    // Initial check
    handleScroll()

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [sortedMessages.length]) // Re-run when messages change

  const groupedMessages = sortedMessages.reduce((groups: Record<string, ChatMessageDto[]>, message: ChatMessageDto) => {
    const date = new Date(message.createdAt).toDateString()
    groups[date] = groups[date] ?? []
    groups[date].push(message)
    return groups
  }, {} as Record<string, ChatMessageDto[]>)

  const handleSendMessage = useCallback(async (content: string) => {
    if (!selectedConversation) return
    
    try {
      await sendTextMessage(selectedConversation.friendId, content)
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }, [selectedConversation, sendTextMessage])

  const handleSendFile = useCallback(async (file: File) => {
    if (!selectedConversation) return
    
    try {
      console.log('Uploading file:', file.name)
      console.log('File details:', {
        name: file.name,
        size: file.size,
        type: file.type
      })
      
      // Validate file exists and has content
      // Allow empty text files but warn about them
      if (file.size === 0) {
        if (file.type === 'text/plain') {
          console.warn('Uploading empty text file - this may not be useful')
        } else {
          throw new Error('Invalid file: file is empty')
        }
      }
      
      // Check if file type is supported
      const supportedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/x-flv', 'video/x-ms-wmv']
      const supportedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      const supportedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/aac', 'audio/flac']
      const supportedDocumentTypes = ['text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf', 'application/rtf', 'application/vnd.oasis.opendocument.text']
      
      const isSupported = [...supportedVideoTypes, ...supportedImageTypes, ...supportedAudioTypes, ...supportedDocumentTypes].includes(file.type)
      if (!isSupported) {
        console.warn('File type might not be supported:', file.type)
        console.log('Supported types:', [...supportedVideoTypes, ...supportedImageTypes, ...supportedAudioTypes, ...supportedDocumentTypes])
      }
      
      const uploadResult = await uploadChatMedia(file, selectedConversation.friendId)
      console.log('File uploaded successfully:', uploadResult.url)
      console.log('Upload result details:', uploadResult)
      
      // Validate file size
      if (!uploadResult.fileSize || uploadResult.fileSize <= 0) {
        throw new Error('Invalid file size')
      }
      
      // Validate required fields
      if (!uploadResult.url || !uploadResult.fileName) {
        throw new Error('Missing required upload data')
      }
      
      // Determine message type from file MIME type
      const messageType = getMessageType(uploadResult.contentType)
      console.log('Determined message type:', messageType, 'for content type:', uploadResult.contentType)
      
      // Prepare media message data
      const mediaMessageData = {
        receiverId: selectedConversation.friendId,
        content: null, // Optional content field
        messageType,
        mediaUrl: uploadResult.url,
        fileName: uploadResult.fileName,
        fileSize: Number(uploadResult.fileSize), // Ensure it's a number
        contentType: uploadResult.contentType
      }
      
      console.log('Sending media message data:', mediaMessageData)
      
      // Additional validation before sending
      if (!mediaMessageData.mediaUrl || !mediaMessageData.fileName || mediaMessageData.fileSize <= 0) {
        throw new Error('Invalid media message data')
      }
      
      // Send media message via SignalR
      await sendMediaMessage(selectedConversation.friendId, mediaMessageData)
      
      console.log('Media message sent successfully')
    } catch (error: any) {
      console.error('Failed to send media message:', error)
      
      // Show more detailed error information
      if (error.response?.data?.message) {
        console.error('Backend error:', error.response.data.message)
      }
      if (error.response?.data?.errors) {
        console.error('Validation errors:', error.response.data.errors)
      }
    }
  }, [selectedConversation, getMessageType, sendMediaMessage])

  const handleSendVoice = useCallback(() => {
    // TODO: Implement voice recording
    console.log('Voice recording not implemented yet')
  }, [])

  const handleImageClick = useCallback((url: string) => {
    // TODO: Open image in modal/lightbox
    console.log('Open image:', url)
  }, [])

  const handleFileDownload = useCallback((url: string, fileName: string) => {
    // TODO: Download file
    console.log('Download file:', url, fileName)
  }, [])

  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      })
    }
    setIsUserScrolledUp(false)
  }, [])


  return (
    <ErrorBoundary>
      <div className="h-[calc(100vh-90px)] bg-[#00141f] flex">
        {/* Left Sidebar - Conversation List */}
        <div className="w-[328px] bg-[#004252] flex flex-col px-[20px] py-[16px]">
          <ConversationList
            selectedConversationId={selectedConversation?.friendId}
            onConversationSelect={handleConversationSelect}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
        </div>

        {/* Center Area - Chat Messages */}
        <div className="flex-1 flex flex-col bg-[#00141f]">
          {selectedConversation ? (
            <>
              {/* Messages Area */}
              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-[20px] space-y-[12px] relative">
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-[#f1fdff] text-[16px]">Loading messages...</div>
                  </div>
                ) : messagesError ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-red-400 text-[16px]">Failed to load messages</div>
                  </div>
                ) : Object.entries(groupedMessages).length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-[#f1fdff] text-[16px]">No messages yet</div>
                  </div>
                ) : (
                  <>
                    {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                      <div key={date}>
                        <DateDivider date={dateMessages[0].createdAt} />
                        <div className="space-y-[12px]">
                          {dateMessages.map((message: ChatMessageDto) => (
                            <MessageBubble
                              key={message.id}
                              message={message}
                              isOwn={message.senderId !== selectedConversation.friendId}
                              onImageClick={handleImageClick}
                              onFileDownload={handleFileDownload}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
                
                {/* Scroll to bottom button */}
                {isUserScrolledUp && (
                  <button
                    onClick={scrollToBottom}
                    className="fixed bottom-[120px] right-[calc(348px+40px)] w-[48px] h-[48px] bg-[#24e5c2] rounded-full flex items-center justify-center text-[#00141f] hover:bg-[#3de6c7] transition-colors shadow-lg z-10"
                    title="Scroll to bottom"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 14L12 9L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </div>

              {/* Message Input */}
              <div className="p-[20px]">
                <div className="bg-[#004252] rounded-[20px] px-[16px] py-[5px]">
                  <MessageInput
                    onSendMessage={handleSendMessage}
                    onSendFile={handleSendFile}
                    onSendVoice={handleSendVoice}
                    disabled={!isConnected || isLoadingMessages}
                  />
                </div>
              </div>
            </>
          ) : (
            <ChatEmptyState />
          )}
        </div>

        {/* Right Sidebar - Profile Panel */}
        {selectedConversation && (
          <div className="w-[348px] bg-[#00141f] flex items-start justify-center pt-[38px]">
            <ChatProfileSidebar
              conversation={selectedConversation}
              isOnline={onlineFriends.includes(selectedConversation.friendId)}
            />
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}
