import { useEffect, useState } from 'react'

interface UseKeyboardNavigationOptions {
  enabled?: boolean
  itemCount: number
  onSelect?: (index: number) => void
  onEscape?: () => void
}

export const useKeyboardNavigation = ({
  enabled = true,
  itemCount,
  onSelect,
  onEscape
}: UseKeyboardNavigationOptions) => {
  const [selectedIndex, setSelectedIndex] = useState(-1)

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev < itemCount - 1 ? prev + 1 : prev))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault()
        onSelect?.(selectedIndex)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onEscape?.()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [enabled, itemCount, selectedIndex, onSelect, onEscape])

  const reset = () => setSelectedIndex(-1)

  return { selectedIndex, reset }
}
