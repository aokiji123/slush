import { memo } from 'react'
import { useTranslation } from 'react-i18next'

interface ConnectionStatusProps {
  isConnected: boolean
}

export const ConnectionStatus = memo<ConnectionStatusProps>(({ isConnected }) => {
  const { t } = useTranslation('chat')
  
  if (isConnected) return null
  
  return (
    <div className="fixed top-[100px] left-1/2 -translate-x-1/2 z-50 bg-[#ff6f95] text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
      <div className="w-2 h-2 bg-white rounded-full" />
      <span className="text-sm font-medium">{t('connectingToChat')}</span>
    </div>
  )
})

ConnectionStatus.displayName = 'ConnectionStatus'

