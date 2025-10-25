import { memo } from 'react'

export const ChatEmptyState = memo(() => {
  return (
    <div className="h-full flex items-center justify-center bg-[#00141f]">
      <p className="font-['Manrope:Bold',sans-serif] font-bold leading-[1.1] opacity-60 text-[#f1fdff] text-[24px] text-center">
        Оберіть користувача, щоб почати листування
      </p>
    </div>
  )
})

ChatEmptyState.displayName = 'ChatEmptyState'
