import { useEffect } from 'react'
import type { RefObject } from 'react'

/**
 * Hook for handling click outside events
 * @param ref Reference to the element to watch
 * @param callback Function to call when clicking outside
 * @param enabled Whether the hook is enabled
 */
export const useClickOutside = <T extends HTMLElement = HTMLDivElement>(
  ref: RefObject<T>, 
  callback: () => void, 
  enabled = true
) => {
  useEffect(() => {
    if (!enabled) return

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [ref, callback, enabled])
}
