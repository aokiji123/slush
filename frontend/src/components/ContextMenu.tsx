import { useRef, useEffect } from 'react'
import { useClickOutside } from '@/hooks'

interface ContextMenuProps {
  isOpen: boolean
  onClose: () => void
  actions: Array<{
    label: string
    onClick: () => void
    icon?: React.ReactNode
    danger?: boolean
  }>
  position?: { x: number; y: number }
}

export const ContextMenu = ({ 
  isOpen, 
  onClose, 
  actions,
  position = { x: 0, y: 0 }
}: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null)
  
  useClickOutside(menuRef as React.RefObject<HTMLElement>, () => {
    if (isOpen) {
      onClose()
    }
  })

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const menu = menuRef.current
      const rect = menu.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      // Adjust position if menu goes off screen
      let left = position.x
      let top = position.y

      if (left + rect.width > viewportWidth) {
        left = viewportWidth - rect.width - 10
      }
      if (top + rect.height > viewportHeight) {
        top = viewportHeight - rect.height - 10
      }
      if (left < 0) {
        left = 10
      }
      if (top < 0) {
        top = 10
      }

      menu.style.left = `${left}px`
      menu.style.top = `${top}px`
    }
  }, [isOpen, position])

  if (!isOpen || actions.length === 0) return null

  return (
    <div
      ref={menuRef}
      className="absolute z-[1000] bg-[var(--color-background-20)] rounded-[12px] border border-[var(--color-background-25)] shadow-lg min-w-[160px] py-[8px]"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => {
            action.onClick()
            onClose()
          }}
          className={`w-full text-left px-[16px] py-[12px] text-[16px] font-medium hover:bg-[var(--color-background-15)] transition-colors flex items-center gap-[12px] ${
            action.danger ? 'text-red-400' : 'text-white'
          }`}
        >
          {action.icon && <span className="text-[20px]">{action.icon}</span>}
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  )
}

