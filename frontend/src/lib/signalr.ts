import * as signalR from '@microsoft/signalr'

export interface SignalRMessage {
  id: string
  senderId: string
  receiverId: string
  content?: string
  messageType: number
  mediaUrl?: string
  fileName?: string
  fileSize?: number
  contentType?: string
  createdAt: string
  isEdited: boolean
  editedAt?: string
  sender?: {
    id: string
    userName: string
    nickname: string
    avatar?: string
    isOnline: boolean
  }
  receiver?: {
    id: string
    userName: string
    nickname: string
    avatar?: string
    isOnline: boolean
  }
  attachments: Array<{
    id: string
    messageId: string
    attachmentType: number
    url: string
    fileName: string
    fileSize: number
    contentType?: string
    createdAt: string
  }>
}

export interface TypingIndicator {
  userId: string
  userNickname: string
  isTyping: boolean
}

export interface OnlineUser {
  userId: string
  connectionId: string
  lastSeen: string
}

class SignalRService {
  private connection: signalR.HubConnection | null = null
  private maxReconnectAttempts = 5
  private isConnecting = false

  private getConnectionUrl(): string {
    const baseUrl = import.meta.env.VITE_DOTNET_API_URL || 'http://localhost:5088'
    return `${baseUrl}/hubs/chat`
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token')
  }

  async connect(): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected || this.isConnecting) {
      return
    }

    const token = this.getAuthToken()
    if (!token) {
      throw new Error('No authentication token available')
    }

    this.isConnecting = true

    try {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(this.getConnectionUrl(), {
          accessTokenFactory: () => token,
          withCredentials: true,
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            if (retryContext.previousRetryCount < this.maxReconnectAttempts) {
              return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000)
            }
            return null
          },
        })
        .configureLogging(signalR.LogLevel.Information)
        .build()

      // Set up event handlers
      this.setupEventHandlers()

      await this.connection.start()
      this.isConnecting = false

      console.log('SignalR connection established')
      this.emit('connectionEstablished')
    } catch (error) {
      this.isConnecting = false
      console.error('Failed to establish SignalR connection:', error)
      throw error
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop()
        console.log('SignalR connection closed')
      } catch (error) {
        console.error('Error closing SignalR connection:', error)
      } finally {
        this.connection = null
      }
    }
  }

  private setupEventHandlers(): void {
    if (!this.connection) return

    // Message events
    this.connection.on('ReceiveMessage', (message: SignalRMessage) => {
      this.emit('messageReceived', message)
    })

    this.connection.on('MessageSent', (message: SignalRMessage) => {
      this.emit('messageSent', message)
    })

    // Typing indicators
    this.connection.on('TypingIndicator', (indicator: TypingIndicator) => {
      this.emit('typingIndicator', indicator)
    })

    // Online friends
    this.connection.on('OnlineFriends', (users: string[]) => {
      this.emit('onlineFriends', users)
    })

    // User status changes
    this.connection.on('UserStatusChanged', (data: { userId: string, isOnline: boolean }) => {
      this.emit('userStatusChanged', data)
    })

    // Error handling
    this.connection.on('Error', (error: string) => {
      console.error('SignalR error:', error)
      this.emit('error', error)
    })

    // Connection state changes
    this.connection.onclose((error) => {
      console.log('SignalR connection closed:', error)
      this.emit('connectionClosed', error)
    })

    this.connection.onreconnecting((error) => {
      console.log('SignalR reconnecting:', error)
      this.emit('reconnecting', error)
    })

    this.connection.onreconnected((connectionId) => {
      console.log('SignalR reconnected:', connectionId)
      this.emit('reconnected', connectionId)
    })
  }

  // Message sending methods
  async sendTextMessage(receiverId: string, content: string): Promise<void> {
    console.log('sendTextMessage: Called with receiverId:', receiverId, 'content:', content)
    console.log('sendTextMessage: Connection exists:', !!this.connection, 'state:', this.connection?.state)
    
    // Add a small delay to ensure connection state is updated
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Wait for connection to be established with retry
    await this.waitForConnection()

    try {
      console.log('sendTextMessage: About to invoke SendTextMessage')
      await this.connection!.invoke('SendTextMessage', receiverId, content)
      console.log('sendTextMessage: Message sent successfully')
    } catch (error) {
      console.error('Failed to send text message:', error)
      throw error
    }
  }

  async sendMediaMessage(receiverId: string, dto: {
    receiverId: string
    content?: string | null
    messageType: number
    mediaUrl: string
    fileName: string
    fileSize: number
    contentType?: string
  }): Promise<void> {
    // Wait for connection to be established with retry
    await this.waitForConnection()

    try {
      await this.connection!.invoke('SendMediaMessage', receiverId, dto)
    } catch (error) {
      console.error('Failed to send media message:', error)
      throw error
    }
  }

  // Typing indicators
  async startTyping(receiverId: string): Promise<void> {
    try {
      await this.waitForConnection()
      await this.connection!.invoke('StartTyping', receiverId)
    } catch (error) {
      console.error('Failed to start typing indicator:', error)
    }
  }

  async stopTyping(receiverId: string): Promise<void> {
    try {
      await this.waitForConnection()
      await this.connection!.invoke('StopTyping', receiverId)
    } catch (error) {
      console.error('Failed to stop typing indicator:', error)
    }
  }

  // Conversation management
  async joinConversation(friendId: string): Promise<void> {
    try {
      await this.waitForConnection()
      await this.connection!.invoke('JoinConversation', friendId)
    } catch (error) {
      console.error('Failed to join conversation:', error)
      throw error
    }
  }

  async leaveConversation(friendId: string): Promise<void> {
    try {
      await this.waitForConnection()
      await this.connection!.invoke('LeaveConversation', friendId)
    } catch (error) {
      console.error('Failed to leave conversation:', error)
    }
  }

  // Online friends
  async getOnlineFriends(): Promise<void> {
    try {
      await this.waitForConnection()
      await this.connection!.invoke('GetOnlineFriends')
    } catch (error) {
      console.error('Failed to get online friends:', error)
    }
  }

  // Connection state
  getConnectionState(): signalR.HubConnectionState | null {
    return this.connection?.state || null
  }

  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected
  }

  // Wait for connection to be established
  private async waitForConnection(maxRetries: number = 20, delayMs: number = 50): Promise<void> {
    console.log('waitForConnection: Starting, connection exists:', !!this.connection, 'state:', this.connection?.state)
    
    // Wait for connection object to exist
    for (let i = 0; i < 10; i++) {
      if (this.connection) {
        break
      }
      console.log(`waitForConnection: Waiting for connection object, attempt ${i + 1}`)
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    if (!this.connection) {
      console.log('waitForConnection: Connection object not available')
      throw new Error('SignalR connection object not available')
    }
    
    // If already connected, return immediately
    if (this.isConnected()) {
      console.log('waitForConnection: Already connected')
      return
    }
    
    // If disconnected, throw error immediately
    if (this.connection.state === signalR.HubConnectionState.Disconnected) {
      console.log('waitForConnection: Connection is disconnected')
      throw new Error('SignalR connection is disconnected')
    }
    
    // Wait for connection to be established
    for (let i = 0; i < maxRetries; i++) {
      console.log(`waitForConnection: Attempt ${i + 1}, state:`, this.connection.state)
      
      if (this.isConnected()) {
        console.log('waitForConnection: Connection established!')
        return
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
    
    console.log('waitForConnection: Failed after maximum retries')
    throw new Error('SignalR connection not established after maximum retries')
  }

  // Event emitter functionality
  private listeners: { [key: string]: ((data?: any) => void)[] } = {}

  on(event: string, callback: (data?: any) => void): void {
    if (!(event in this.listeners)) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  off(event: string, callback: (data?: any) => void): void {
    const eventListeners = this.listeners[event]
    if (eventListeners && eventListeners.length > 0) {
      this.listeners[event] = eventListeners.filter(cb => cb !== callback)
    }
  }

  private emit(event: string, data?: any): void {
    const eventListeners = this.listeners[event]
    if (eventListeners && eventListeners.length > 0) {
      eventListeners.forEach(callback => callback(data))
    }
  }
}

// Create singleton instance
export const signalRService = new SignalRService()

// Auto-cleanup on page unload
window.addEventListener('beforeunload', () => {
  signalRService.disconnect()
})
