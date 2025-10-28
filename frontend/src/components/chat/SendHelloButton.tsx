import { memo } from 'react'
import { useTranslation } from 'react-i18next'

interface SendHelloButtonProps {
  friendNickname: string
  onSendHello: () => void
  isConnected: boolean
}

export const SendHelloButton = memo<SendHelloButtonProps>(({
  onSendHello,
  isConnected,
}) => {
  const { t } = useTranslation('chat')

  return (
    <div className="flex items-center justify-center h-full">
      <button
        onClick={onSendHello}
        disabled={!isConnected}
        className={`
          flex flex-col items-center justify-center gap-[16px]
          px-[32px] py-[40px]
          bg-[rgba(55,195,255,0.1)] border-2 border-[#37C3FF]
          rounded-[24px] 
          transition-all duration-300
          hover:bg-[rgba(55,195,255,0.2)] hover:border-[#49FFDE] hover:scale-105
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          group
        `}
      >
        {/* Hand waving emoji */}
        <div className="text-6xl mb-[-8px] group-hover:animate-bounce">
          👋
        </div>
        
        {/* Text content */}
        <div className="flex flex-col items-center gap-[8px]">
          <h3 className="text-[20px] font-bold text-[#f1fdff] font-['Manrope']">
            {t('sendHello')}
          </h3>
          <p className="text-[14px] text-[rgba(204,248,255,0.65)]">
            {t('clickToSendHello')}
          </p>
        </div>
      </button>
    </div>
  )
})

SendHelloButton.displayName = 'SendHelloButton'

