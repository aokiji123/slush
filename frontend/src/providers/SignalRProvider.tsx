import React, { createContext, useContext, useEffect, type ReactNode } from 'react'
import { useSignalR } from '@/hooks/useSignalR'
import { useAuthState } from '@/api/queries/useAuth'

interface SignalRContextType {
  isConnected: boolean
  isConnecting: boolean
  connectionState: string | null
  sendTextMessage: (receiverId: string, content: string) => Promise<void>
  sendMediaMessage: (receiverId: string, dto: {
    receiverId: string
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
  onMessageReceived: (callback: (message: any) => void) => void
  onMessageSent: (callback: (message: any) => void) => void
  onTypingIndicator: (callback: (indicator: any) => void) => void
  onOnlineFriends: (callback: (users: any[]) => void) => void
  onUserStatusChanged: (callback: (data: { userId: string, isOnline: boolean }) => void) => void
  onError: (callback: (error: string) => void) => void
  onConnectionClosed: (callback: (error?: Error) => void) => void
  onReconnecting: (callback: (error?: Error) => void) => void
  onReconnected: (callback: (connectionId?: string) => void) => void
}

const SignalRContext = createContext<SignalRContextType | undefined>(undefined)

interface SignalRProviderProps {
  children: ReactNode
}

export const SignalRProvider: React.FC<SignalRProviderProps> = ({ children }) => {
  const { isAuth } = useAuthState()
  const signalR = useSignalR()

  // Auto-connect when user is authenticated
  useEffect(() => {
    if (isAuth) {
      // Connection is handled by useSignalR hook
      console.log('SignalR: User authenticated, connection will be established')
    } else {
      console.log('SignalR: User not authenticated, connection will be closed')
    }
  }, [isAuth])

  // Log connection state changes
  useEffect(() => {
    console.log('SignalR connection state:', signalR.connectionState)
  }, [signalR.connectionState])

  const contextValue: SignalRContextType = {
    isConnected: signalR.isConnected,
    isConnecting: signalR.isConnecting,
    connectionState: signalR.connectionState,
    sendTextMessage: signalR.sendTextMessage,
    sendMediaMessage: signalR.sendMediaMessage,
    startTyping: signalR.startTyping,
    stopTyping: signalR.stopTyping,
    joinConversation: signalR.joinConversation,
    leaveConversation: signalR.leaveConversation,
    getOnlineFriends: signalR.getOnlineFriends,
    onMessageReceived: signalR.onMessageReceived,
    onMessageSent: signalR.onMessageSent,
    onTypingIndicator: signalR.onTypingIndicator,
    onOnlineFriends: signalR.onOnlineFriends,
    onUserStatusChanged: signalR.onUserStatusChanged,
    onError: signalR.onError,
    onConnectionClosed: signalR.onConnectionClosed,
    onReconnecting: signalR.onReconnecting,
    onReconnected: signalR.onReconnected,
  }

  return (
    <SignalRContext.Provider value={contextValue}>
      {children}
    </SignalRContext.Provider>
  )
}

export const useSignalRContext = (): SignalRContextType => {
  const context = useContext(SignalRContext)
  if (context === undefined) {
    throw new Error('useSignalRContext must be used within a SignalRProvider')
  }
  return context
}
