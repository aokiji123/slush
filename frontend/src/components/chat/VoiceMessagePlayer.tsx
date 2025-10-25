import { memo, useState, useRef, useEffect, useCallback } from 'react'

interface VoiceMessagePlayerProps {
  audioUrl: string
  duration?: number
  className?: string
}

export const VoiceMessagePlayer = memo<VoiceMessagePlayerProps>(({
  audioUrl,
  duration = 0,
  className = ''
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

  return (
    <div className={`flex items-center gap-[16px] p-[15px] bg-[#24e5c2] rounded-[60px] ${className}`}>
      {/* Play/Pause Button */}
      <button
        onClick={handlePlayPause}
        className="w-[24px] h-[24px] flex items-center justify-center bg-[#00141f] rounded-full hover:bg-[#00141f]/80 transition-colors"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M3 2H5V10H3V2Z"
              fill="#24e5c2"
            />
            <path
              d="M7 2H9V10H7V2Z"
              fill="#24e5c2"
            />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M3 2L9 6L3 10V2Z"
              fill="#24e5c2"
            />
          </svg>
        )}
      </button>

      {/* Progress Bar */}
      <div className="flex-1">
        <div
          ref={progressRef}
          onClick={handleProgressClick}
          className="h-[12px] bg-[#00141f] rounded-[6px] cursor-pointer relative overflow-hidden"
        >
          <div
            className="h-full bg-[#24e5c2] rounded-[6px] transition-all duration-100"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {/* Time Display */}
        <p className="text-[#00141f] text-[14px] font-['Artifakt_Element'] mt-[4px]">
          {formatTime(currentTime)} / {formatTime(actualDuration)}
        </p>
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
