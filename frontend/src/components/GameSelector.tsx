import { useState, useRef, useEffect } from 'react'
import { useUserLibrary } from '@/api/queries/useLibrary'
import type { Game } from '@/api/types/game'

interface GameSelectorProps {
  userId: string
  selectedGame: Game | null
  onSelectGame: (game: Game | null) => void
}

export const GameSelector = ({ userId, selectedGame, onSelectGame }: GameSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { data: libraryResponse } = useUserLibrary(userId)

  const games = libraryResponse?.data ?? []

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelectGame = (game: Game) => {
    onSelectGame(game)
    setIsOpen(false)
  }

  const handleClearSelection = () => {
    onSelectGame(null)
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-[8px] px-[16px] py-[8px] bg-[var(--color-background-15)] rounded-[12px] hover:bg-[var(--color-background-16)] transition-colors"
      >
        {selectedGame ? (
          <div className="flex items-center gap-[8px]">
            <img
              src={selectedGame.mainImage}
              alt={selectedGame.title}
              className="w-[32px] h-[32px] rounded-[6px] object-cover"
            />
            <span className="text-[14px] text-[var(--color-background)] font-medium">
              {selectedGame.title}
            </span>
          </div>
        ) : (
          <span className="text-[14px] text-[var(--color-background-25)] opacity-65">
            Оберіть гру
          </span>
        )}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-[8px] w-[320px] bg-[var(--color-background-15)] rounded-[12px] shadow-lg z-50 max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[var(--color-background-16)] [&::-webkit-scrollbar-thumb]:rounded-[3px]">
          {selectedGame && (
            <>
              <button
                onClick={handleClearSelection}
                className="w-full px-[16px] py-[12px] text-left text-[14px] text-[var(--color-background)] hover:bg-[var(--color-background-18)] transition-colors flex items-center gap-[8px]"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4L4 12M4 4L12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Скинути фільтр
              </button>
              <div className="h-[1px] bg-[var(--color-background-16)]" />
            </>
          )}

          {games.length === 0 ? (
            <div className="px-[16px] py-[24px] text-center">
              <p className="text-[14px] text-[var(--color-background-25)] opacity-65">
                У вашій бібліотеці немає ігор
              </p>
            </div>
          ) : (
            <div className="py-[8px]">
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => handleSelectGame(game)}
                  className="w-full px-[16px] py-[10px] text-left hover:bg-[var(--color-background-18)] transition-colors flex items-center gap-[12px]"
                >
                  <img
                    src={game.mainImage}
                    alt={game.title}
                    className="w-[40px] h-[40px] rounded-[6px] object-cover flex-shrink-0"
                  />
                  <span className="text-[14px] text-[var(--color-background)] font-medium line-clamp-2">
                    {game.title}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

