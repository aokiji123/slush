import { useMemo } from 'react'
import { Modal } from './Modal'
import { OptimizedImage } from './OptimizedImage'
import { formatPrice } from '@/utils/formatters'
import { useTranslation } from 'react-i18next'
import { FaApple, FaPlaystation, FaWindows, FaXbox } from 'react-icons/fa'
import type { GameData } from '@/api/types/game'

interface PurchaseConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  game: GameData
  walletBalance: number
  onConfirmPurchase: () => Promise<void>
  isPurchasing: boolean
}

export const PurchaseConfirmationModal = ({
  isOpen,
  onClose,
  game,
  walletBalance,
  onConfirmPurchase,
  isPurchasing,
}: PurchaseConfirmationModalProps) => {
  const { t } = useTranslation('game')
  
  // Calculate final price (sale price if on sale, otherwise regular price)
  const finalPrice = useMemo(() => {
    return game.salePrice > 0 ? game.salePrice : game.price
  }, [game.salePrice, game.price])
  
  // Calculate balance after purchase
  const balanceAfter = useMemo(() => {
    return walletBalance - finalPrice
  }, [walletBalance, finalPrice])
  
  // Check if user has sufficient funds
  const hasInsufficientFunds = balanceAfter < 0
  
  // Discount percentage calculation
  const discountPercent = useMemo(() => {
    if (game.salePrice > 0 && game.price > 0 && game.salePrice < game.price) {
      return Math.round(((game.price - game.salePrice) / game.price) * 100)
    }
    return 0
  }, [game.salePrice, game.price])
  
  const isOnSale = game.salePrice > 0 && game.salePrice < game.price

  const handleConfirm = async () => {
    if (hasInsufficientFunds) {
      onClose()
      return
    }
    
    await onConfirmPurchase()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={t('purchaseModal.title')}
      showCloseButton={true}
    >
      <div className="p-[32px] flex flex-col gap-[24px]">
        {/* Game Image */}
        {game.mainImage && (
          <div className="w-full h-[150px] rounded-[12px] overflow-hidden">
            <OptimizedImage
              src={game.mainImage}
              alt={game.name}
              className="w-full h-full object-cover"
              loading="eager"
              blurDataURL="/glow.png"
              placeholder="/glow.png"
            />
          </div>
        )}

        {/* Game Info */}
        <div className="flex flex-col gap-[8px]">
          <h3 className="text-[24px] font-bold text-[var(--color-background)] font-manrope">
            {game.name}
          </h3>
          <p className="text-[16px] text-[var(--color-background-25)] font-manrope">
            {game.developer}
          </p>
          
          {/* Platform Icons */}
          {game.platforms && Array.isArray(game.platforms) && game.platforms.length > 0 && (
            <div className="flex items-center gap-[12px] mt-[8px]">
              {game.platforms.some(p => {
                const lower = p.toLowerCase()
                return lower === 'windows' || lower === 'pc' || lower.includes('windows')
              }) && <FaWindows size={20} className="text-[var(--color-background-21)]" />}
              {game.platforms.some(p => {
                const lower = p.toLowerCase()
                return lower === 'apple' || lower === 'mac' || lower === 'macos' || lower.includes('mac')
              }) && <FaApple size={20} className="text-[var(--color-background-21)]" />}
              {game.platforms.some(p => {
                const lower = p.toLowerCase()
                return lower === 'playstation' || lower === 'ps' || lower.includes('ps') || lower.includes('playstation')
              }) && <FaPlaystation size={20} className="text-[var(--color-background-21)]" />}
              {game.platforms.some(p => {
                const lower = p.toLowerCase()
                return lower === 'xbox' || lower.includes('xbox')
              }) && <FaXbox size={20} className="text-[var(--color-background-21)]" />}
            </div>
          )}
        </div>

        {/* Price Section */}
        <div className="flex flex-col gap-[12px] bg-[var(--color-background-15)] p-[20px] rounded-[12px]">
          <p className="text-[14px] font-medium text-[var(--color-background-25)]">
            {t('purchaseModal.price')}
          </p>
          <div className="flex items-center gap-[8px]">
            {isOnSale && discountPercent > 0 && (
              <p className="rounded-[20px] bg-[var(--color-background-10)] text-[#00141F] px-[12px] py-[4px] text-[14px] font-bold">
                -{discountPercent}%
              </p>
            )}
            {isOnSale && (
              <>
                <p className="text-[32px] font-bold text-[var(--color-background)] font-manrope">
                  {formatPrice(game.salePrice)}
                </p>
                <p className="text-[24px] font-extralight line-through text-[var(--color-background-25)] font-manrope">
                  {formatPrice(game.price)}
                </p>
              </>
            )}
            {!isOnSale && (
              <p className="text-[32px] font-bold text-[var(--color-background)] font-manrope">
                {game.price === 0 ? t('actions.free') : formatPrice(game.price)}
              </p>
            )}
          </div>
        </div>

        {/* Wallet Info */}
        <div className="flex flex-col gap-[12px]">
          {/* Current Balance */}
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-medium text-[var(--color-background-25)]">
              {t('purchaseModal.currentBalance')}
            </p>
            <p className="text-[16px] font-bold text-[var(--color-background)] font-manrope">
              {formatPrice(walletBalance)}
            </p>
          </div>

          {/* Price to Pay */}
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-medium text-[var(--color-background-25)]">
              {t('purchaseModal.price')}
            </p>
            <p className="text-[16px] font-bold text-[var(--color-background)] font-manrope">
              -{formatPrice(finalPrice)}
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-[var(--color-background-16)]" />

          {/* Balance After Purchase */}
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-bold text-[var(--color-background)]">
              {t('purchaseModal.balanceAfter')}
            </p>
            <p
              className={`text-[16px] font-bold font-manrope ${
                hasInsufficientFunds
                  ? 'text-[var(--color-background-10)]'
                  : 'text-[var(--color-background-21)]'
              }`}
            >
              {formatPrice(balanceAfter)}
            </p>
          </div>

          {/* Insufficient Funds Warning */}
          {hasInsufficientFunds && (
            <div className="bg-[rgba(255,111,149,0.1)] border border-[var(--color-background-10)] rounded-[12px] p-[12px]">
              <p className="text-[14px] text-[var(--color-background-10)] font-medium">
                {t('purchaseModal.insufficientFunds')}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-[12px] mt-[8px]">
          <button
            onClick={handleConfirm}
            disabled={isPurchasing || hasInsufficientFunds}
            className={`h-[48px] flex items-center justify-center text-[20px] font-bold rounded-[20px] transition-colors font-manrope ${
              isPurchasing || hasInsufficientFunds
                ? 'bg-[var(--color-background-16)] text-[var(--color-background-25)] cursor-not-allowed'
                : 'bg-[var(--color-background-21)] text-[var(--color-night-background)] hover:bg-[var(--color-background-22)] cursor-pointer'
            }`}
            aria-label={t('purchaseModal.confirmButton')}
          >
            {isPurchasing ? t('purchaseModal.processing') : t('purchaseModal.confirmButton')}
          </button>

          <button
            onClick={onClose}
            disabled={isPurchasing}
            className="h-[48px] flex items-center justify-center text-[20px] font-medium rounded-[20px] bg-[var(--color-background-16)] text-[var(--color-background)] hover:bg-[var(--color-background-17)] cursor-pointer transition-colors font-manrope disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={t('purchaseModal.cancelButton')}
          >
            {t('purchaseModal.cancelButton')}
          </button>
        </div>
      </div>
    </Modal>
  )
}

