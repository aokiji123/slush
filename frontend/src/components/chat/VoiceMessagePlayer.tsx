import { memo, useState, useRef, useEffect, useCallback } from 'react'

interface VoiceMessagePlayerProps {
  audioUrl: string
  duration?: number
  className?: string
  isOwn?: boolean
}

export const VoiceMessagePlayer = memo<VoiceMessagePlayerProps>(({
  audioUrl,
  duration = 0,
  className = '',
  isOwn = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [actualDuration, setActualDuration] = useState(duration)
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  const handlePlayPause = useCallback(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
  }, [isPlaying])

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }, [])

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setActualDuration(audioRef.current.duration)
    }
  }, [])

  const handleEnded = useCallback(() => {
    setIsPlaying(false)
    setCurrentTime(0)
  }, [])

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return

    const rect = progressRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const percentage = clickX / width
    const newTime = percentage * actualDuration

    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }, [actualDuration])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('play', () => setIsPlaying(true))
    audio.addEventListener('pause', () => setIsPlaying(false))

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('play', () => setIsPlaying(true))
      audio.removeEventListener('pause', () => setIsPlaying(false))
    }
  }, [handleTimeUpdate, handleLoadedMetadata, handleEnded])

  const progressPercentage = actualDuration > 0 ? (currentTime / actualDuration) * 100 : 0

  const getContainerClasses = () => {
    if (isOwn) {
      return `bg-[rgba(36,229,194,0.2)] box-border content-stretch flex gap-[16px] items-center p-[20px] relative rounded-bl-[20px] rounded-br-[6px] rounded-tl-[20px] rounded-tr-[20px] w-full ${className}`
    }
    return `bg-[rgba(55,195,255,0.25)] box-border content-stretch flex gap-[16px] items-center p-[20px] relative rounded-bl-[6px] rounded-br-[20px] rounded-tl-[20px] rounded-tr-[20px] w-full ${className}`
  }

  return (
    <div className={getContainerClasses()}>
      {/* Green circular icon container */}
      <div className="bg-[#24e5c2] box-border content-stretch flex items-center justify-center p-[15px] relative rounded-[60px] shrink-0">
        <button
          onClick={handlePlayPause}
          className="relative shrink-0 size-[24px] text-[#00141f] hover:opacity-80 transition-opacity"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="block">
              <path
                d="M8 6H12V18H8V6ZM14 6H18V18H14V6Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="block">
              <path
                d="M8 5L16 12L8 19V5Z"
                fill="currentColor"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Progress and time container */}
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="box-border content-stretch flex flex-[1_0_0] flex-col gap-[4px] min-h-px min-w-px relative shrink-0">
          {/* Waveform/Progress Bar */}
          <div 
            ref={progressRef}
            onClick={handleProgressClick}
            className="h-[12px] relative shrink-0 w-full cursor-pointer flex items-center"
          >
            {/* Full width white line with dot */}
            <div className="h-[1px] w-full bg-[#ffffff] relative">
              {/* White dot at current position */}
              <div 
                className="absolute w-[8px] h-[8px] bg-[#ffffff] rounded-full top-1/2 -translate-y-1/2 transition-all duration-100"
                style={{ left: `${progressPercentage}%` }}
              />
            </div>
          </div>
          
          {/* Time Display */}
          <p className="font-['Artifakt_Element:Regular',sans-serif] leading-[1.15] not-italic relative text-[14px] text-[rgba(204,248,255,0.65)] tracking-[-0.14px]">
            {formatTime(currentTime)} / {formatTime(actualDuration)}
          </p>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
      />
    </div>
  )
})

VoiceMessagePlayer.displayName = 'VoiceMessagePlayer'
