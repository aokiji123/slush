import { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react'
import { GROUP_LABELS, mapEmojibaseGroupToKey, type EmojiRecord } from '@/data/emojiGroups'
import { useTranslation } from 'react-i18next'

type CategoryKey = 'frequently' | keyof typeof GROUP_LABELS

interface EmojiPickerProps {
  isOpen: boolean
  onEmojiSelect: (emoji: string) => void
  onClose: () => void
}

interface EmojiData {
  emoji: string
  name: string
  shortcodes?: string[]
}

const getFrequentlyUsedEmojis = (): EmojiData[] => [
      { emoji: '👍', name: 'thumbs up' },
      { emoji: '❤️', name: 'red heart' },
      { emoji: '😂', name: 'laughing crying' },
      { emoji: '😮', name: 'open mouth' },
      { emoji: '😢', name: 'crying' },
      { emoji: '🙏', name: 'prayer hands' },
      { emoji: '🎉', name: 'party' },
      { emoji: '🔥', name: 'fire' },
      { emoji: '✅', name: 'checkmark' },
      { emoji: '❌', name: 'cross mark' },
      { emoji: '💯', name: 'hundred' },
      { emoji: '👏', name: 'clapping' }
]

export const EmojiPicker = memo<EmojiPickerProps>(({ isOpen, onEmojiSelect, onClose }) => {
  const { t } = useTranslation('chat')
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('frequently')
  const [searchQuery, setSearchQuery] = useState('')
  const pickerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [allEmojis, setAllEmojis] = useState<EmojiRecord[]>([])
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([])
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  const gridRef = useRef<HTMLDivElement>(null)
  
  const frequentlyUsedEmojis = useMemo(() => getFrequentlyUsedEmojis(), [])

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

  // Clear search when closing
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('')
      setFocusedIndex(-1)
    }
  }, [isOpen])

  const handleEmojiClick = useCallback((emoji: string) => {
    onEmojiSelect(emoji)
    onClose()
  }, [onEmojiSelect, onClose])

  const handleCategoryClick = useCallback((category: CategoryKey) => {
    setSelectedCategory(category)
    setSearchQuery('')
    setFocusedIndex(-1)
    buttonsRef.current = []
    if (gridRef.current) {
      gridRef.current.scrollTop = 0
    }
  }, [])


  // Lazy-load emojibase dataset on open
  useEffect(() => {
    let active = true
    async function load() {
      if (!isOpen || allEmojis.length > 0) return
      setIsLoading(true)
      try {
        const mod = await import('emojibase-data/en/data.json')
        const raw: any[] = (mod as any).default || (mod as any)
        const mapped: EmojiRecord[] = raw
          .filter((e) => !!e.emoji && !!e.label && !!e.group)
          .map((e) => {
            const key = mapEmojibaseGroupToKey(e.group as number)
            return key
              ? {
                  emoji: e.emoji as string,
                  name: e.label as string,
                  group: key,
                  shortcodes: Array.isArray(e.tags) ? (e.tags as string[]) : Array.isArray(e.shortcodes) ? (e.shortcodes as string[]) : undefined,
                }
              : null
          })
          .filter(Boolean) as EmojiRecord[]
        if (active) setAllEmojis(mapped)
      } catch {
        // Keep curated minimal set on failure
      } finally {
        if (active) setIsLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [isOpen, allEmojis.length])

  // Build dataset categories (not strictly required; keeping for potential future use)
  const datasetByCategory = useMemo(() => {
    const groups: Record<string, EmojiRecord[]> = {}
    for (const key of Object.keys(GROUP_LABELS)) groups[key] = []
    for (const e of allEmojis) groups[e.group].push(e)
    return groups
  }, [allEmojis])

  // Filter emojis based on search query (by name/shortcodes, not emoji char)
  const filteredEmojis = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase().trim()
    
    // If searching, search across all categories
    if (normalizedQuery) {
      const base: Array<EmojiData> = [
        ...frequentlyUsedEmojis,
        ...allEmojis,
      ]
      return base.filter(emojiData => {
        const inName = emojiData.name.toLowerCase().includes(normalizedQuery)
        const codes = (emojiData.shortcodes || [])
        const inCodes = codes.some(c => c.toLowerCase().includes(normalizedQuery))
        return inName || inCodes
      })
    }
    
    // Otherwise, show only selected category
    if (selectedCategory === 'frequently') {
      return frequentlyUsedEmojis
    }
    // Derive list directly from allEmojis to avoid any grouping mismatches
    const list = allEmojis.filter(e => e.group === selectedCategory)
    // Stable order by name to keep indexing predictable within a category
    const normalized = list.map(({ emoji, name, shortcodes }) => ({ emoji, name, shortcodes }))
    normalized.sort((a, b) => a.name.localeCompare(b.name))
    return normalized
  }, [searchQuery, selectedCategory, allEmojis, frequentlyUsedEmojis])

  // Keyboard navigation within grid
  const handleGridKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (filteredEmojis.length === 0) return
    const cols = 8
    let next = focusedIndex
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        next = Math.min(filteredEmojis.length - 1, Math.max(0, focusedIndex) + 1)
        break
      case 'ArrowLeft':
        e.preventDefault()
        next = Math.max(0, (focusedIndex === -1 ? 0 : focusedIndex) - 1)
        break
      case 'ArrowDown':
        e.preventDefault()
        next = Math.min(filteredEmojis.length - 1, (focusedIndex === -1 ? 0 : focusedIndex) + cols)
        break
      case 'ArrowUp':
        e.preventDefault()
        next = Math.max(0, (focusedIndex === -1 ? 0 : focusedIndex) - cols)
        break
      case 'Enter':
        if (focusedIndex >= 0 && focusedIndex < filteredEmojis.length) {
          const item = filteredEmojis[focusedIndex]
          handleEmojiClick((item as any).emoji)
        }
        return
      case 'Escape':
        onClose()
        return
      default:
        return
    }
    setFocusedIndex(next)
    const btn = buttonsRef.current[next]
    if (btn) btn.focus()
  }, [filteredEmojis, focusedIndex, onClose, handleEmojiClick])

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
          placeholder={t('emojiPicker.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[rgba(0,20,31,0.4)] border border-[#046075] rounded-[12px] px-[12px] py-[8px] text-[#f1fdff] text-[14px] font-['Artifakt_Element'] placeholder-[rgba(204,248,255,0.5)] focus:outline-none focus:border-[#24e5c2] transition-colors"
        />
      </div>

      {/* Categories - Hide when searching */}
      {!searchQuery && (
        <div className="flex border-b border-[#046075] overflow-x-auto [&::-webkit-scrollbar]:h-[8px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[var(--color-background-16)] [&::-webkit-scrollbar-thumb]:rounded-[4px] [&::-webkit-scrollbar-thumb]:hover:bg-[var(--color-background-17)]">
          {([
            ['frequently', t('emojiPicker.categories.frequently')] as [CategoryKey, string],
            ...Object.entries(GROUP_LABELS) as Array<[CategoryKey, string]>,
          ]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handleCategoryClick(key)}
              className={`px-[12px] py-[8px] text-[14px] font-['Artifakt_Element'] whitespace-nowrap transition-colors focus:outline-none ${
                selectedCategory === key
                  ? 'text-[#24e5c2] border-b-2 border-[#24e5c2]'
                  : 'text-[rgba(204,248,255,0.65)] hover:text-[#f1fdff]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Emoji Grid with custom scrollbar */}
      <div
        role="grid"
        tabIndex={0}
        onKeyDown={handleGridKeyDown}
        ref={gridRef}
        className="emoji-font flex-1 overflow-y-auto p-[12px] grid grid-cols-8 gap-[4px] content-start auto-rows-min [&::-webkit-scrollbar]:w-[10px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[var(--color-background-16)] [&::-webkit-scrollbar-thumb]:rounded-[5px] [&::-webkit-scrollbar-thumb]:hover:bg-[var(--color-background-17)] focus:outline-none"
        aria-label="Emoji grid"
      >
        {isLoading && (
          <div className="col-span-8 text-center text-[rgba(204,248,255,0.65)] text-[14px] font-['Artifakt_Element'] py-[20px]">
            {t('emojiPicker.loading')}
          </div>
        )}
        {!isLoading && filteredEmojis.length > 0 && filteredEmojis.map((emojiData, index) => (
          <button
            ref={(el) => { buttonsRef.current[index] = el }}
            role="gridcell"
            key={`${emojiData.emoji}-${index}`}
            onClick={() => handleEmojiClick((emojiData as any).emoji)}
            className={`emoji-font w-[36px] h-[36px] flex items-center justify-center text-[24px] rounded-[8px] hover:bg-[rgba(55,195,255,0.25)] transition-colors active:scale-95 ${focusedIndex === index ? 'outline outline-[#24e5c2]' : ''}`}
            title={(emojiData as any).name}
            aria-label={(emojiData as any).name}
            aria-selected={focusedIndex === index}
          >
            {(emojiData as any).emoji}
          </button>
        ))}
        {!isLoading && filteredEmojis.length === 0 && (
          <div className="col-span-8 text-center text-[rgba(204,248,255,0.65)] text-[14px] font-['Artifakt_Element'] py-[20px]">
            {t('emojiPicker.noResults')}
          </div>
        )}
      </div>
    </div>
  )
})

EmojiPicker.displayName = 'EmojiPicker'


