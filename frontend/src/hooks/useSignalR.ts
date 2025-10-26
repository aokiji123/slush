import { useEffect, useCallback, useState, useRef } from 'react'
import { signalRService, type SignalRMessage, type TypingIndicator } from '@/lib/signalr'
import { useAuthState } from '@/api/queries/useAuth'

export interface UseSignalRReturn {
  isConnected: boolean
  isConnecting: boolean
  connectionState: string | null
  sendTextMessage: (receiverId: string, content: string) => Promise<void>
  sendMediaMessage: (receiverId: string, dto: {
    receiverId: string
    content?: string | null
    messageType: number
    mediaUrl: string
    fileName: string
    fileSize: number
    contentType?: string
  }) => Promise<void>
  startTyping: (receiverId: string) => Promise<void>
  stopTyping: (receiverId: string) => Promise<void>
  joinConversation: (friendId: string) => Promise<void>
  leaveConversation: (friendId: string) => Promise<void>
  getOnlineFriends: () => Promise<void>
  onMessageReceived: (callback: (message: SignalRMessage) => void) => void
  onMessageSent: (callback: (message: SignalRMessage) => void) => void
  onTypingIndicator: (callback: (indicator: TypingIndicator) => void) => void
  onOnlineFriends: (callback: (users: string[]) => void) => void
  onUserStatusChanged: (callback: (data: { userId: string, isOnline: boolean }) => void) => void
  onError: (callback: (error: string) => void) => void
  onConnectionClosed: (callback: (error?: Error) => void) => void
  onReconnecting: (callback: (error?: Error) => void) => void
  onReconnected: (callback: (connectionId?: string) => void) => void
}

export const useSignalR = (): UseSignalRReturn => {
  const { isAuth, user } = useAuthState()
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionState, setConnectionState] = useState<string | null>(null)

  // Use ref to track current state without causing re-renders
  const stateRef = useRef({ isConnecting, isConnected })
  useEffect(() => {
    stateRef.current = { isConnecting, isConnected }
  }, [isConnecting, isConnected])

  const connect = useCallback(async () => {
    if (stateRef.current.isConnecting || stateRef.current.isConnected) return

    setIsConnecting(true)
    try {
      await signalRService.connect()
      // Only set as connected after the connection is fully established
      // The connection state will be updated by the event listeners
    } catch (error) {
      console.error('Failed to connect to SignalR:', error)
      setIsConnected(false)
      setConnectionState('Disconnected')
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(async () => {
    try {
      await signalRService.disconnect()
      setIsConnected(false)
      setConnectionState('Disconnected')
    } catch (error) {
      console.error('Failed to disconnect from SignalR:', error)
    }
  }, [])

  // Connect when user is authenticated
  useEffect(() => {
    if (isAuth && user) {
      connect()
    } else {
      disconnect()
    }

    return () => {
      disconnect()
    }
  }, [isAuth, connect, disconnect])

  // Set up event listeners
  useEffect(() => {
    const handleConnectionStateChange = () => {
      const state = signalRService.getConnectionState()
      const connected = signalRService.isConnected()
      console.log('useSignalR: Connection state changed, connected:', connected, 'state:', state)
      setIsConnected(connected)
      setConnectionState(state?.toString() || 'Disconnected')
    }

    // Listen for connection events
    signalRService.on('connectionEstablished', handleConnectionStateChange)
    signalRService.on('reconnecting', handleConnectionStateChange)
    signalRService.on('reconnected', handleConnectionStateChange)
    signalRService.on('connectionClosed', handleConnectionStateChange)

    // Check initial connection state
    handleConnectionStateChange()

    return () => {
      signalRService.off('connectionEstablished', handleConnectionStateChange)
      signalRService.off('reconnecting', handleConnectionStateChange)
      signalRService.off('reconnected', handleConnectionStateChange)
      signalRService.off('connectionClosed', handleConnectionStateChange)
    }
  }, [])

  // Message sending methods
  const sendTextMessage = useCallback(async (receiverId: string, content: string) => {
    if (!isConnected) {
      throw new Error('SignalR connection not established')
    }
    await signalRService.sendTextMessage(receiverId, content)
  }, [isConnected])

  const sendMediaMessage = useCallback(async (receiverId: string, dto: {
    receiverId: string
    messageType: number
    mediaUrl: string
    fileName: string
    fileSize: number
    contentType?: string
  }) => {
    if (!isConnected) {
      throw new Error('SignalR connection not established')
    }
    await signalRService.sendMediaMessage(receiverId, dto)
  }, [isConnected])

  const startTyping = useCallback(async (receiverId: string) => {
    if (!isConnected) return
    await signalRService.startTyping(receiverId)
  }, [isConnected])

  const stopTyping = useCallback(async (receiverId: string) => {
    if (!isConnected) return
    await signalRService.stopTyping(receiverId)
  }, [isConnected])

  const joinConversation = useCallback(async (friendId: string) => {
    if (!isConnected) {
      throw new Error('SignalR connection not established')
    }
    await signalRService.joinConversation(friendId)
  }, [isConnected])

  const leaveConversation = useCallback(async (friendId: string) => {
    if (!isConnected) return
    await signalRService.leaveConversation(friendId)
  }, [isConnected])

  const getOnlineFriends = useCallback(async () => {
    if (!isConnected) return
    await signalRService.getOnlineFriends()
  }, [isConnected])

  // Event subscription methods
  const onMessageReceived = useCallback((callback: (message: SignalRMessage) => void) => {
    signalRService.on('messageReceived', callback)
    return () => signalRService.off('messageReceived', callback)
  }, [])

  const onMessageSent = useCallback((callback: (message: SignalRMessage) => void) => {
    signalRService.on('messageSent', callback)
    return () => signalRService.off('messageSent', callback)
  }, [])

  const onTypingIndicator = useCallback((callback: (indicator: TypingIndicator) => void) => {
    signalRService.on('typingIndicator', callback)
    return () => signalRService.off('typingIndicator', callback)
  }, [])

  const onOnlineFriends = useCallback((callback: (users: string[]) => void) => {
    signalRService.on('onlineFriends', callback)
    return () => signalRService.off('onlineFriends', callback)
  }, [])

  const onUserStatusChanged = useCallback((callback: (data: { userId: string, isOnline: boolean }) => void) => {
    signalRService.on('userStatusChanged', callback)
    return () => signalRService.off('userStatusChanged', callback)
  }, [])

  const onError = useCallback((callback: (error: string) => void) => {
    signalRService.on('error', callback)
    return () => signalRService.off('error', callback)
  }, [])

  const onConnectionClosed = useCallback((callback: (error?: Error) => void) => {
    signalRService.on('connectionClosed', callback)
    return () => signalRService.off('connectionClosed', callback)
  }, [])

  const onReconnecting = useCallback((callback: (error?: Error) => void) => {
    signalRService.on('reconnecting', callback)
    return () => signalRService.off('reconnecting', callback)
  }, [])

  const onReconnected = useCallback((callback: (connectionId?: string) => void) => {
    signalRService.on('reconnected', callback)
    return () => signalRService.off('reconnected', callback)
  }, [])

  return {
    isConnected,
    isConnecting,
    connectionState,
    sendTextMessage,
    sendMediaMessage,
    startTyping,
    stopTyping,
    joinConversation,
    leaveConversation,
    getOnlineFriends,
    onMessageReceived,
    onMessageSent,
    onTypingIndicator,
    onOnlineFriends,
    onUserStatusChanged,
    onError,
    onConnectionClosed,
    onReconnecting,
    onReconnected,
  }
}
