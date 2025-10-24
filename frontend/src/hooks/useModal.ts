import { useCallback, useState } from 'react'

/**
 * Hook for managing modal state
 * @param initialState Initial open state of the modal
 * @returns Modal state and control functions
 */
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState)
  
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(prev => !prev), [])
  
  return { isOpen, open, close, toggle }
}
