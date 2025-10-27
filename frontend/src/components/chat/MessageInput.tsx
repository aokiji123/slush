import { memo, useState, useRef, useCallback } from 'react'

interface MessageInputProps {
  onSendMessage: (content: string) => void
  onSendFile: (file: File) => void
  onSendVoice?: () => void
  disabled?: boolean
  placeholder?: string
}

export const MessageInput = memo<MessageInputProps>(({
  onSendMessage,
  onSendFile,
  onSendVoice,
  disabled = false,
  placeholder = 'Ваше повідомлення...'
}) => {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }, [message, onSendMessage, disabled])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }, [handleSubmit])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onSendFile(file)
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [onSendFile])

  const handleFileClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }, [disabled])

  const handleVoiceToggle = useCallback(async () => {
    if (!disabled) {
      if (isRecording && mediaRecorder) {
        // Stop recording
        mediaRecorder.stop()
        setIsRecording(false)
      } else {
        // Start recording
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
          const recorder = new MediaRecorder(stream)
          
          recorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              audioChunksRef.current.push(e.data)
            }
          }
          
          recorder.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
            const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, { 
              type: 'audio/webm' 
            })
            
            // Send the audio file
            onSendFile(audioFile)
            
            // Cleanup
            audioChunksRef.current = []
            stream.getTracks().forEach(track => track.stop())
            setMediaRecorder(null)
          }
          
          recorder.start()
          setMediaRecorder(recorder)
          setIsRecording(true)
          
          // Notify parent if provided
          onSendVoice?.()
        } catch (error) {
          console.error('Failed to start recording:', error)
          alert('Не вдалося отримати доступ до мікрофону')
        }
      }
    }
  }, [disabled, isRecording, mediaRecorder, onSendFile, onSendVoice])

  return (
    <>
      <form onSubmit={handleSubmit} className="flex items-center gap-[12px] w-full">
        {/* Left side buttons */}
        <div className="flex items-center gap-[8px]">
          {/* Emoji button */}
          <button
            type="button"
            disabled={disabled}
            className="w-[24px] h-[24px] flex items-center justify-center text-[#f1fdff] hover:text-[#24e5c2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Emoji"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M5 6C5.27614 6 5.5 5.77614 5.5 5.5C5.5 5.22386 5.27614 5 5 5C4.72386 5 4.5 5.22386 4.5 5.5C4.5 5.77614 4.72386 6 5 6Z"
                fill="currentColor"
              />
              <path
                d="M11 6C11.2761 6 11.5 5.77614 11.5 5.5C11.5 5.22386 11.2761 5 11 5C10.7239 5 10.5 5.22386 10.5 5.5C10.5 5.77614 10.7239 6 11 6Z"
                fill="currentColor"
              />
              <path
                d="M6 9C6 8.44772 6.44772 8 7 8H9C9.55228 8 10 8.44772 10 9C10 9.55228 9.55228 10 9 10H7C6.44772 10 6 9.55228 6 9Z"
                fill="currentColor"
              />
            </svg>
          </button>

          {/* File attachment button */}
          <button
            type="button"
            onClick={handleFileClick}
            disabled={disabled}
            className="w-[24px] h-[24px] flex items-center justify-center text-[#f1fdff] hover:text-[#24e5c2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Attach file"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1L9.5 5.5H14L10.5 8.5L12 13L8 10L4 13L5.5 8.5L2 5.5H6.5L8 1Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </button>
        </div>

        {/* Text input */}
        <div className="flex-1 bg-[rgba(0,20,31,0.4)] border border-[#046075] rounded-[22px] px-[16px] py-[10px]">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full bg-transparent text-[#f1fdff] placeholder-[rgba(204,248,255,0.65)] text-[16px] font-['Artifakt_Element'] resize-none outline-none min-h-[20px] max-h-[120px]"
            rows={1}
            style={{
              height: 'auto',
              minHeight: '20px',
              maxHeight: '120px'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = 'auto'
              target.style.height = Math.min(target.scrollHeight, 120) + 'px'
            }}
          />
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-[8px]">
          {/* Voice message button */}
          <button
            type="button"
            onClick={handleVoiceToggle}
            disabled={disabled}
            className={`w-[24px] h-[24px] flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isRecording 
                ? 'text-[#ff6f95]' 
                : 'text-[#f1fdff] hover:text-[#24e5c2]'
            }`}
            title={isRecording ? 'Stop recording' : 'Voice message'}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1C6.34315 1 5 2.34315 5 4V8C5 9.65685 6.34315 11 8 11C9.65685 11 11 9.65685 11 8V4C11 2.34315 9.65685 1 8 1Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M3 7V8C3 10.7614 5.23858 13 8 13C10.7614 13 13 10.7614 13 8V7"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M8 13V15M6 15H10"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </button>

          {/* Send button */}
          <button
            type="submit"
            disabled={disabled || !message.trim()}
            className="w-[24px] h-[24px] flex items-center justify-center text-[#f1fdff] hover:text-[#24e5c2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send message"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M1 8L15 1L11 8L15 15L1 8Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </button>
        </div>
      </form>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
        multiple={false}
      />
    </>
  )
})

MessageInput.displayName = 'MessageInput'
