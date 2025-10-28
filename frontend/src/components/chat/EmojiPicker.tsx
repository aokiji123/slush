import { useState, useEffect, useRef, memo, useCallback } from 'react'

interface EmojiPickerProps {
  isOpen: boolean
  onEmojiSelect: (emoji: string) => void
  onClose: () => void
}

const EMOJI_CATEGORIES = {
  frequently: {
    name: 'Frequently Used',
    emojis: ['👍', '❤️', '😂', '😮', '😢', '🙏', '🎉', '🔥', '✅', '❌', '💯', '👏']
  },
  smileys: {
    name: 'Smileys & People',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙']
  },
  animals: {
    name: 'Animals & Nature',
    emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🦆', '🦅', '🦉']
  },
  food: {
    name: 'Food & Drink',
    emojis: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒']
  },
  activities: {
    name: 'Activities',
    emojis: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥊', '🥋', '🥅', '⛳', '🏹', '🎣', '🥇', '🥈', '🥉', '🏆']
  },
  symbols: {
    name: 'Symbols',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️']
  }
}

export const EmojiPicker = memo<EmojiPickerProps>(({ isOpen, onEmojiSelect, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof EMOJI_CATEGORIES>('frequently')
  const [searchQuery, setSearchQuery] = useState('')
  const pickerRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, handleClickOutside])

  const handleEmojiClick = useCallback((emoji: string) => {
    onEmojiSelect(emoji)
    onClose()
  }, [onEmojiSelect, onClose])

  const filteredEmojis = Object.entries(EMOJI_CATEGORIES).reduce((acc, [category, data]) => {
    if (category === selectedCategory) {
      const filtered = data.emojis.filter(emoji => emoji.includes(searchQuery))
      acc.push(...filtered)
    }
    return acc
  }, [] as string[])

  if (!isOpen) return null

  return (
    <div 
      ref={pickerRef}
      className="absolute bottom-full left-0 mb-[12px] bg-[#004252] rounded-[20px] border border-[#046075] shadow-lg z-50 w-[340px] h-[400px] overflow-hidden flex flex-col"
    >
      {/* Search Bar */}
      <div className="p-[12px] border-b border-[#046075]">
        <input
          type="text"
          placeholder="Search emojis..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[rgba(0,20,31,0.4)] border border-[#046075] rounded-[12px] px-[12px] py-[8px] text-[#f1fdff] text-[14px] font-['Artifakt_Element'] placeholder-[rgba(204,248,255,0.5)] focus:outline-none focus:border-[#24e5c2]"
        />
      </div>

      {/* Categories */}
      <div className="flex border-b border-[#046075] overflow-x-auto">
        {Object.entries(EMOJI_CATEGORIES).map(([key, data]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key as keyof typeof EMOJI_CATEGORIES)}
            className={`px-[12px] py-[8px] text-[14px] font-['Artifakt_Element'] whitespace-nowrap transition-colors ${
              selectedCategory === key
                ? 'text-[#24e5c2] border-b-2 border-[#24e5c2]'
                : 'text-[rgba(204,248,255,0.65)] hover:text-[#f1fdff]'
            }`}
          >
            {data.name}
          </button>
        ))}
      </div>

      {/* Emoji Grid */}
      <div className="flex-1 overflow-y-auto p-[12px] grid grid-cols-8 gap-[4px]">
        {filteredEmojis.length > 0 ? (
          filteredEmojis.map((emoji, index) => (
            <button
              key={`${emoji}-${index}`}
              onClick={() => handleEmojiClick(emoji)}
              className="w-[36px] h-[36px] flex items-center justify-center text-[24px] rounded-[8px] hover:bg-[rgba(55,195,255,0.25)] transition-colors"
            >
              {emoji}
            </button>
          ))
        ) : (
          <div className="col-span-8 text-center text-[rgba(204,248,255,0.65)] text-[14px] font-['Artifakt_Element'] py-[20px]">
            No emojis found
          </div>
        )}
      </div>
    </div>
  )
})

EmojiPicker.displayName = 'EmojiPicker'


