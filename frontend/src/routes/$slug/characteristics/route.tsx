import { createFileRoute } from '@tanstack/react-router'
import {
  FaWindows,
  FaPlaystation,
  FaXbox,
  FaApple,
  FaChevronDown,
} from 'react-icons/fa'
import { useGamePlatformInfo } from '@/api/queries/useGame'
import { useTranslation } from 'react-i18next'
import { useState, useRef, useEffect } from 'react'

export const Route = createFileRoute('/$slug/characteristics')({
  component: RouteComponent,
})

function RouteComponent() {
  const { slug } = Route.useParams()
  const { t } = useTranslation('game')
  const { data: platformInfo, isLoading, isError } = useGamePlatformInfo(slug)

  const [selectedPlatform, setSelectedPlatform] = useState<string>('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Set default platform when data loads
  useEffect(() => {
    if (platformInfo?.data && !selectedPlatform) {
      const platforms = platformInfo.data.availablePlatforms
      if (platforms.length > 0) {
        // Prefer Windows/PC, then first available
        const defaultPlatform =
          platforms.find(
            (p) =>
              p.toLowerCase().includes('windows') ||
              p.toLowerCase().includes('pc'),
          ) || platforms[0]
        setSelectedPlatform(defaultPlatform)
      }
    }
  }, [platformInfo, selectedPlatform])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-white text-2xl">{t('characteristics.loading')}</p>
      </div>
    )
  }

  if (isError || !platformInfo?.data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-white text-2xl">{t('characteristics.error')}</p>
      </div>
    )
  }

  const { pcCharacteristics, consoleFeatures, availablePlatforms } =
    platformInfo.data

  // Get platform icon and display name
  const getPlatformInfo = (platform: string) => {
    const lower = platform.toLowerCase()

    // Check for Windows (could be "Windows", "PC", etc.)
    if (
      lower.includes('windows') ||
      (lower.includes('pc') && !lower.includes('playstation'))
    ) {
      return {
        icon: <FaWindows size={24} />,
        displayName: 'Windows',
      }
    }

    // Check for PlayStation
    if (lower.includes('playstation') || lower.includes('ps')) {
      return {
        icon: <FaPlaystation size={24} />,
        displayName: platform, // Use the original platform name for console
      }
    }

    // Check for Xbox
    if (lower.includes('xbox')) {
      return {
        icon: <FaXbox size={24} />,
        displayName: platform, // Use the original platform name for console
      }
    }

    // Check for Mac
    if (lower.includes('mac') || lower.includes('apple')) {
      return {
        icon: <FaApple size={24} />,
        displayName: 'macOS',
      }
    }

    // Default fallback
    return {
      icon: <FaWindows size={24} />,
      displayName: 'Windows',
    }
  }

  // Check if platform is PC (Windows/Mac)
  const isPcPlatform = (platform: string) => {
    const lower = platform.toLowerCase()
    return (
      lower.includes('windows') ||
      lower.includes('pc') ||
      lower.includes('mac') ||
      lower.includes('apple')
    )
  }

  // Get current platform data (with flexible matching)
  // Match "PC" from availablePlatforms with "Windows" from database
  const normalizePlatformForMatching = (platform: string) => {
    const lower = platform.toLowerCase()
    if (lower === 'pc' || lower.includes('windows')) return 'windows'
    return lower
  }

  const selectedNormalized = normalizePlatformForMatching(selectedPlatform)

  const currentPcData = pcCharacteristics.find((pc) => {
    const pcNormalized = normalizePlatformForMatching(pc.platform)
    return pcNormalized === selectedNormalized
  })

  const currentConsoleData = consoleFeatures.find(
    (cf) => cf.platform.toLowerCase() === selectedPlatform.toLowerCase(),
  )

  return (
    <>
      {/* Platform Dropdown */}
      <div className="relative w-full sm:w-[50%]" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between h-[44px] sm:h-[48px] py-[10px] sm:py-[12px] px-[16px] sm:px-[20px] rounded-[20px] bg-[var(--color-background-15)] text-[var(--color-background)] border-1 border-[var(--color-background-16)] mt-[8px] cursor-pointer hover:bg-[var(--color-background-16)] transition-colors"
        >
          <div className="flex items-center gap-[8px] sm:gap-[10px]">
            <div className="text-[var(--color-background)]">
              {getPlatformInfo(selectedPlatform || 'Windows').icon}
            </div>
            <p className="text-[16px] sm:text-[18px] lg:text-[20px] font-medium font-manrope">
              {selectedPlatform
                ? getPlatformInfo(selectedPlatform).displayName
                : 'Windows'}
            </p>
          </div>
          <FaChevronDown
            className={`text-[var(--color-background)] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && availablePlatforms.length > 1 && (
          <div className="absolute top-[56px] left-0 w-full bg-[var(--color-background-15)] border-1 border-[var(--color-background-16)] rounded-[20px] overflow-hidden z-10 shadow-lg">
            {availablePlatforms.map((platform) => {
              const platformDisplayInfo = getPlatformInfo(platform)
              const isSelected = platform === selectedPlatform
              return (
                <button
                  key={platform}
                  onClick={() => {
                    setSelectedPlatform(platform)
                    setIsDropdownOpen(false)
                  }}
                  className={`w-full flex items-center gap-[10px] px-[20px] py-[12px] hover:bg-[var(--color-background-16)] transition-colors ${
                    isSelected ? 'bg-[var(--color-primary)]' : ''
                  }`}
                >
                  <div className="text-[var(--color-background)]">
                    {platformDisplayInfo.icon}
                  </div>
                  <p className="text-[18px] font-medium font-manrope text-[var(--color-background)]">
                    {platformDisplayInfo.displayName}
                  </p>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* PC Platform: Show System Requirements */}
      {isPcPlatform(selectedPlatform) && currentPcData && (
        <>
          <div className="w-full flex flex-col sm:flex-row gap-[24px] sm:gap-[32px] lg:gap-[64px] mt-[16px] text-[var(--color-background)]">
            <div className="w-full sm:w-[50%] flex flex-col gap-[12px] sm:gap-[16px] text-[16px] sm:text-[18px] lg:text-[20px]">
              <p className="text-[20px] sm:text-[22px] lg:text-[24px] font-medium font-manrope">
                {t('characteristics.minimal')}
              </p>
              <div className="flex flex-col">
                <p className="font-bold">{t('characteristics.os')}</p>
                <p className="font-light">{currentPcData.minVersion}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-bold">{t('characteristics.processor')}</p>
                <p className="font-light">{currentPcData.minCpu}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-bold">{t('characteristics.memory')}</p>
                <p className="font-light">{currentPcData.minRam}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-bold">{t('characteristics.graphics')}</p>
                <p className="font-light">{currentPcData.minGpu}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-bold">{t('characteristics.directx')}</p>
                <p className="font-light">{currentPcData.minDirectX}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-bold">{t('characteristics.storage')}</p>
                <p className="font-light">{currentPcData.minMemory}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-bold">{t('characteristics.soundCard')}</p>
                <p className="font-light">{currentPcData.minAudioCard}</p>
              </div>
            </div>

            <div className="w-full sm:w-[50%] flex flex-col gap-[12px] sm:gap-[16px] text-[16px] sm:text-[18px] lg:text-[20px]">
              <p className="text-[20px] sm:text-[22px] lg:text-[24px] font-medium font-manrope">
                {t('characteristics.recommended')}
              </p>
              <div className="flex flex-col">
                <p className="font-bold">{t('characteristics.os')}</p>
                <p className="font-light">{currentPcData.recommendedVersion}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-bold">{t('characteristics.processor')}</p>
                <p className="font-light">{currentPcData.recommendedCpu}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-bold">{t('characteristics.memory')}</p>
                <p className="font-light">{currentPcData.recommendedRam}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-bold">{t('characteristics.graphics')}</p>
                <p className="font-light">{currentPcData.recommendedGpu}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-bold">{t('characteristics.directx')}</p>
                <p className="font-light">{currentPcData.recommendedDirectX}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-bold">{t('characteristics.storage')}</p>
                <p className="font-light">{currentPcData.recommendedMemory}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-bold">{t('characteristics.soundCard')}</p>
                <p className="font-light">
                  {currentPcData.recommendedAudioCard}
                </p>
              </div>
            </div>
          </div>

          {/* Additional information for PC */}
          {currentPcData.controller && (
            <div className="w-full mt-[24px] sm:mt-[32px] text-[var(--color-background)]">
              <div className="flex flex-col gap-[12px] sm:gap-[16px] text-[16px] sm:text-[18px] lg:text-[20px]">
                <p className="text-[20px] sm:text-[22px] lg:text-[24px] font-medium font-manrope">
                  {t('characteristics.additionalInfo')}
                </p>
                <div className="flex flex-col">
                  <p className="font-bold">{t('characteristics.controls')}</p>
                  <p className="font-light">{currentPcData.controller}</p>
                </div>
                {currentPcData.additional && (
                  <div className="flex flex-col">
                    <p className="font-bold">
                      {t('characteristics.additional')}
                    </p>
                    <p className="font-light">{currentPcData.additional}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Language support for PC */}
          {(currentPcData.langAudio.length > 0 ||
            currentPcData.langText.length > 0) && (
            <div className="w-full mt-[24px] sm:mt-[32px] text-[var(--color-background)]">
              <div className="flex flex-col gap-[12px] sm:gap-[16px] text-[16px] sm:text-[18px] lg:text-[20px]">
                <p className="text-[20px] sm:text-[22px] lg:text-[24px] font-medium font-manrope">
                  {t('characteristics.languageSupport')}
                </p>
                {currentPcData.langAudio.length > 0 && (
                  <div className="flex flex-col">
                    <p className="font-bold">{t('characteristics.audio')}</p>
                    <p className="font-light">
                      {currentPcData.langAudio.join(', ')}
                    </p>
                  </div>
                )}
                {currentPcData.langText.length > 0 && (
                  <div className="flex flex-col">
                    <p className="font-bold">{t('characteristics.text')}</p>
                    <p className="font-light">
                      {currentPcData.langText.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Console Platform: Show Console Features */}
      {!isPcPlatform(selectedPlatform) && currentConsoleData && (
        <div className="w-full mt-[16px] text-[var(--color-background)]">
          <div className="flex flex-col gap-[16px] sm:gap-[20px] lg:gap-[24px] text-[16px] sm:text-[18px] lg:text-[20px]">
            <p className="text-[20px] sm:text-[22px] lg:text-[24px] font-medium font-manrope">
              {t('characteristics.consoleFeatures', 'Console Features')}
            </p>

            {currentConsoleData.resolution && (
              <div className="flex flex-col">
                <p className="font-bold">
                  {t('characteristics.resolution', 'Resolution')}
                </p>
                <p className="font-light">{currentConsoleData.resolution}</p>
              </div>
            )}

            {currentConsoleData.frameRate && (
              <div className="flex flex-col">
                <p className="font-bold">
                  {t('characteristics.frameRate', 'Frame Rate')}
                </p>
                <p className="font-light">{currentConsoleData.frameRate}</p>
              </div>
            )}

            {currentConsoleData.performanceModes && (
              <div className="flex flex-col">
                <p className="font-bold">
                  {t('characteristics.performanceModes', 'Performance Modes')}
                </p>
                <p className="font-light">
                  {currentConsoleData.performanceModes}
                </p>
              </div>
            )}

            <div className="flex flex-col">
              <p className="font-bold">
                {t('characteristics.hdrSupport', 'HDR Support')}
              </p>
              <p className="font-light">
                {currentConsoleData.hdrSupport
                  ? t('common.yes', 'Yes')
                  : t('common.no', 'No')}
              </p>
            </div>

            <div className="flex flex-col">
              <p className="font-bold">
                {t('characteristics.rayTracing', 'Ray Tracing')}
              </p>
              <p className="font-light">
                {currentConsoleData.rayTracingSupport
                  ? t('common.yes', 'Yes')
                  : t('common.no', 'No')}
              </p>
            </div>

            {currentConsoleData.controllerFeatures && (
              <div className="flex flex-col">
                <p className="font-bold">
                  {t(
                    'characteristics.controllerFeatures',
                    'Controller Features',
                  )}
                </p>
                <p className="font-light">
                  {currentConsoleData.controllerFeatures}
                </p>
              </div>
            )}

            {currentConsoleData.storageRequired && (
              <div className="flex flex-col">
                <p className="font-bold">{t('characteristics.storage')}</p>
                <p className="font-light">
                  {currentConsoleData.storageRequired}
                </p>
              </div>
            )}

            <div className="flex flex-col">
              <p className="font-bold">
                {t('characteristics.onlineRequired', 'Online Play Required')}
              </p>
              <p className="font-light">
                {currentConsoleData.onlinePlayRequired
                  ? t('common.yes', 'Yes')
                  : t('common.no', 'No')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* No data available */}
      {!currentPcData && !currentConsoleData && (
        <div className="w-full mt-[16px] text-[var(--color-background)]">
          <p className="text-[16px] sm:text-[18px] lg:text-[20px]">
            {t(
              'characteristics.noDataForPlatform',
              'No characteristics available for this platform.',
            )}
          </p>
        </div>
      )}
    </>
  )
}
