import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ConversationList } from '@/components/chat/ConversationList'
import { ChatEmptyState } from '@/components/chat/ChatEmptyState'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { ChatProfileSidebar } from '@/components/chat/ChatProfileSidebar'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { MessageInput } from '@/components/chat/MessageInput'
import { MessageSkeleton } from '@/components/chat/MessageSkeleton'
import { ConnectionStatus } from '@/components/chat/ConnectionStatus'
import { DateDivider } from '@/components/chat/DateDivider'
import { ImageLightbox } from '@/components/chat/ImageLightbox'
import { SendHelloButton } from '@/components/chat/SendHelloButton'
import { useSignalRContext } from '@/providers/SignalRProvider'
import { uploadChatMedia } from '@/api/chatAPI'
import { useConversationHistory } from '@/api/queries/useChat'
import { ChatMessageTypeDto } from '@/api/types/chat'
import type { ChatConversationDto, ChatMessageDto } from '@/api/types/chat'

export const Route = createFileRoute('/chat')({
  component: ChatPage,
})

function ChatPage() {
  const { t } = useTranslation('chat')
  const [selectedConversation, setSelectedConversation] = useState<ChatConversationDto | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [messages, setMessages] = useState<ChatMessageDto[]>([])
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false)
  const [onlineFriends, setOnlineFriends] = useState<string[]>([])
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [displayMessages, setDisplayMessages] = useState<ChatMessageDto[]>([])
  const [isProfileOpen, setIsProfileOpen] = useState(false)
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

  const handleSendHello = useCallback(async () => {
    if (!selectedConversation || !isConnected) return
    
    const helloMessage = 'Hello! 👋'
    await sendTextMessage(selectedConversation.friendId, helloMessage)
  }, [selectedConversation, isConnected, sendTextMessage])

  // Initialize messages from API data when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      const conversationId = selectedConversation.friendId
      // Clear messages if switching to different conversation
      if (loadedConversationRef.current !== conversationId) {
        if (conversationMessages.length > 0) {
          setMessages(conversationMessages)
        } else if (!isLoadingMessages) {
          // Only clear messages if not loading
          setMessages([])
        }
        loadedConversationRef.current = conversationId
      } else if (loadedConversationRef.current === conversationId && conversationMessages.length > 0) {
        // Update messages if they've loaded for current conversation
        setMessages(conversationMessages)
      }
    } else {
      setMessages([])
      setDisplayMessages([])
      loadedConversationRef.current = null
    }
  }, [selectedConversation?.friendId, conversationMessages, isLoadingMessages])

  // Update display messages only when fully loaded
  useEffect(() => {
    if (!isLoadingMessages && messages.length > 0) {
      setDisplayMessages(messages)
    }
  }, [isLoadingMessages, messages])

  // Auto-scroll when new messages arrive (only if user is at bottom)
  useEffect(() => {
    if (messages.length > 0) {
      const container = messagesContainerRef.current
      if (container) {
        // Always scroll to bottom on initial load or when not scrolled up
        if (!isUserScrolledUp || loadedConversationRef.current !== selectedConversation?.friendId) {
          requestAnimationFrame(() => {
            container.scrollTop = container.scrollHeight
          })
        }
      }
    }
  }, [messages.length, isUserScrolledUp, selectedConversation?.friendId])

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

  // Sort and group display messages
  const groupedDisplayMessages = useMemo(() => {
    const sorted = [...displayMessages].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    return sorted.reduce((groups: Record<string, ChatMessageDto[]>, message: ChatMessageDto) => {
      const date = new Date(message.createdAt).toDateString()
      groups[date] = groups[date] ?? []
      groups[date].push(message)
      return groups
    }, {} as Record<string, ChatMessageDto[]>)
  }, [displayMessages])

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
    console.log('Voice recording not implemented yet')
  }, [])

  const handleImageClick = useCallback((url: string) => {
    setLightboxImage(url)
  }, [])

  const handleFileDownload = useCallback(async (url: string, fileName: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      link.click()
      URL.revokeObjectURL(link.href)
    } catch (error) {
      console.error('Failed to download file:', error)
    }
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

  const handleToggleProfile = useCallback(() => {
    setIsProfileOpen(prev => !prev)
  }, [])

  const handleCloseProfile = useCallback(() => {
    setIsProfileOpen(false)
  }, [])


  return (
    <ErrorBoundary>
      <ConnectionStatus isConnected={isConnected} />
      <div className="fixed inset-x-0 top-[90px] bottom-0 bg-[#00141f] flex overflow-hidden">
        {/* Left Sidebar - Conversation List */}
        <div className="hidden lg:flex w-[328px] bg-[#004252] flex-col px-[20px] py-[16px] overflow-hidden">
          <ConversationList
            selectedConversationId={selectedConversation?.friendId}
            onConversationSelect={handleConversationSelect}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
        </div>

        {/* Center Area - Chat Messages */}
        <div className="flex-1 flex flex-col bg-[#00141f] overflow-hidden">
          {selectedConversation ? (
            <>
              {/* Chat Header (mobile only) */}
              <div className="xl:hidden">
                <ChatHeader
                  conversation={selectedConversation}
                  isOnline={onlineFriends.includes(selectedConversation.friendId)}
                  onToggleProfile={handleToggleProfile}
                />
              </div>

              {/* Messages Area */}
              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-[12px] md:p-[20px] flex flex-col [&::-webkit-scrollbar]:w-[10px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[var(--color-background-16)] [&::-webkit-scrollbar-thumb]:rounded-[5px] [&::-webkit-scrollbar-thumb]:hover:bg-[var(--color-background-17)]">
                {isLoadingMessages && displayMessages.length === 0 ? (
                  <>
                    {/* Spacer pushes skeleton to bottom */}
                    <div className="flex-1 min-h-0" />
                    <MessageSkeleton count={5} />
                  </>
                ) : messagesError ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-red-400 text-[16px]">{t('failedToLoadMessages')}</div>
                  </div>
                ) : displayMessages.length === 0 && !selectedConversation.lastMessage ? (
                  <SendHelloButton
                    friendNickname={selectedConversation.friendNickname}
                    onSendHello={handleSendHello}
                    isConnected={isConnected}
                  />
                ) : displayMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-[#f1fdff] text-[16px]">{t('noMessagesYet')}</div>
                  </div>
                ) : (
                  <>
                    {/* Spacer pushes messages to bottom */}
                    <div className="flex-1 min-h-0" />
                    
                    {/* Messages always positioned at bottom */}
                    <div className="space-y-[12px]">
                      {Object.entries(groupedDisplayMessages).map(([date, dateMessages]) => (
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
                    </div>
                  </>
                )}
                
                {/* Scroll to bottom button */}
                {isUserScrolledUp && (
                  <button
                    onClick={scrollToBottom}
                    className="absolute bottom-[120px] right-[20px] xl:right-[calc(348px+20px)] w-[48px] h-[48px] bg-[#24e5c2] rounded-full flex items-center justify-center text-[#00141f] hover:bg-[#3de6c7] transition-colors shadow-lg z-10"
                    title="Scroll to bottom"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 14L12 9L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </div>

              {/* Message Input */}
              <div className="p-[12px] md:p-[20px]">
                <div className="bg-[#004252] rounded-[20px] px-[16px] py-[5px]">
                  <MessageInput
                    onSendMessage={handleSendMessage}
                    onSendFile={handleSendFile}
                    onSendVoice={handleSendVoice}
                    disabled={!isConnected}
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
          <>
            {/* Desktop: Always visible on xl+ screens */}
            <div className="hidden xl:flex w-[348px] bg-[#00141f] items-start justify-center pt-[38px]">
              <ChatProfileSidebar
                conversation={selectedConversation}
                isOnline={onlineFriends.includes(selectedConversation.friendId)}
              />
            </div>

            {/* Mobile: Overlay sidebar */}
            <ChatProfileSidebar
              conversation={selectedConversation}
              isOnline={onlineFriends.includes(selectedConversation.friendId)}
              isOpen={isProfileOpen}
              onClose={handleCloseProfile}
            />
          </>
        )}
      </div>

      {/* Image Lightbox */}
      <ImageLightbox imageUrl={lightboxImage} onClose={() => setLightboxImage(null)} />
    </ErrorBoundary>
  )
}
