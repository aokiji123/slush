import { createFileRoute } from '@tanstack/react-router'
import { FaChevronDown, FaWindows } from 'react-icons/fa'
import { useGameCharacteristics } from '@/api/queries/useGame'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/$slug/characteristics')({
  component: RouteComponent,
})

function RouteComponent() {
  const { slug } = Route.useParams()
  const { t } = useTranslation('game')
  const {
    data: characteristics,
    isLoading,
    isError,
  } = useGameCharacteristics(slug)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-white text-2xl">{t('characteristics.loading')}</p>
      </div>
    )
  }

  if (isError || !characteristics?.data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-white text-2xl">
          {t('characteristics.error')}
        </p>
      </div>
    )
  }

  const { data } = characteristics

  // Map API data to UI structure for minimal settings
  const minimalSettings = [
    { name: t('characteristics.os'), value: data.minVersion },
    { name: t('characteristics.processor'), value: data.minCpu },
    { name: t('characteristics.memory'), value: data.minRam },
    { name: t('characteristics.graphics'), value: data.minGpu },
    { name: t('characteristics.directx'), value: data.minDirectX },
    { name: t('characteristics.storage'), value: data.minMemory },
    { name: t('characteristics.soundCard'), value: data.minAudioCard },
  ]

  // Map API data to UI structure for recommended settings
  const recommendedSettings = [
    { name: t('characteristics.os'), value: data.recommendedVersion },
    { name: t('characteristics.processor'), value: data.recommendedCpu },
    { name: t('characteristics.memory'), value: data.recommendedRam },
    { name: t('characteristics.graphics'), value: data.recommendedGpu },
    { name: t('characteristics.directx'), value: data.recommendedDirectX },
    { name: t('characteristics.storage'), value: data.recommendedMemory },
    { name: t('characteristics.soundCard'), value: data.recommendedAudioCard },
  ]

  return (
    <>
      <div className="w-[50%] flex items-center justify-between h-[48px] py-[12px] px-[20px] rounded-[20px] bg-[var(--color-background-15)] text-[var(--color-background)] border-1 border-[var(--color-background-16)] mt-[8px]">
        <div className="flex items-center gap-[10px]">
          <FaWindows size={24} />
          <p className="text-[20px] font-medium font-manrope">
            {data.platform}
          </p>
        </div>
        <FaChevronDown />
      </div>
      <div className="w-full flex gap-[64px] mt-[16px] text-[var(--color-background)]">
        <div className="w-[50%] flex flex-col gap-[16px] text-[20px]">
          <p className="text-[24px] font-medium font-manrope">
            {t('characteristics.minimal')}
          </p>
          {minimalSettings.map((item, index) => (
            <div key={`min-${index}`} className="flex flex-col">
              <p className="font-bold">{item.name}</p>
              <p className="font-light">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="w-[50%] flex flex-col gap-[16px] text-[20px]">
          <p className="text-[24px] font-medium font-manrope">
            {t('characteristics.recommended')}
          </p>
          {recommendedSettings.map((item, index) => (
            <div key={`rec-${index}`} className="flex flex-col">
              <p className="font-bold">{item.name}</p>
              <p className="font-light">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Additional information */}
      {data.controller && (
        <div className="w-full mt-[32px] text-[var(--color-background)]">
          <div className="flex flex-col gap-[16px] text-[20px]">
            <p className="text-[24px] font-medium font-manrope">
              {t('characteristics.additionalInfo')}
            </p>
            <div className="flex flex-col">
              <p className="font-bold">{t('characteristics.controls')}</p>
              <p className="font-light">{data.controller}</p>
            </div>
            {data.additional && (
              <div className="flex flex-col">
                <p className="font-bold">{t('characteristics.additional')}</p>
                <p className="font-light">{data.additional}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Language support */}
      {(data.langAudio.length > 0 || data.langText.length > 0) && (
        <div className="w-full mt-[32px] text-[var(--color-background)]">
          <div className="flex flex-col gap-[16px] text-[20px]">
            <p className="text-[24px] font-medium font-manrope">
              {t('characteristics.languageSupport')}
            </p>
            {data.langAudio.length > 0 && (
              <div className="flex flex-col">
                <p className="font-bold">{t('characteristics.audio')}</p>
                <p className="font-light">{data.langAudio.join(', ')}</p>
              </div>
            )}
            {data.langText.length > 0 && (
              <div className="flex flex-col">
                <p className="font-bold">{t('characteristics.text')}</p>
                <p className="font-light">{data.langText.join(', ')}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
