import { createFileRoute } from '@tanstack/react-router'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/terms-of-use')({
  component: TermsOfUsePage,
})

function TermsOfUsePage() {
  const { t } = useTranslation('policy')
  return (
    <ErrorBoundary>
      <div className="relative bg-[var(--color-night-background)] min-h-screen overflow-x-hidden">
        {/* Decorative background vectors */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute h-[459px] w-[497px] left-[103px] top-[862px] opacity-20">
            <div className="absolute inset-[-130.72%] overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 497 459" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0L497 0L497 459L0 459L0 0Z" fill="url(#pattern0)" fillOpacity="0.1"/>
                <defs>
                  <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use href="#image0" transform="scale(0.001 0.00108431)"/>
                  </pattern>
                </defs>
              </svg>
            </div>
          </div>
          
          <div className="absolute h-[459px] w-[497px] left-[1468px] top-[1450px] opacity-20">
            <div className="absolute inset-[-130.72%] overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 497 459" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0L497 0L497 459L0 459L0 0Z" fill="url(#pattern1)" fillOpacity="0.1"/>
                <defs>
                  <pattern id="pattern1" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use href="#image1" transform="scale(0.001 0.00108431)"/>
                  </pattern>
                </defs>
              </svg>
            </div>
          </div>
          
          <div className="absolute h-[459px] w-[497px] left-[1111px] top-[-84px] opacity-20">
            <div className="absolute inset-[-130.72%] overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 497 459" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0L497 0L497 459L0 459L0 0Z" fill="url(#pattern2)" fillOpacity="0.1"/>
                <defs>
                  <pattern id="pattern2" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use href="#image2" transform="scale(0.001 0.00108431)"/>
                  </pattern>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="container mx-auto px-[228px] py-[64px] relative">
          <div className="bg-[var(--color-background-15)] rounded-[30px] p-[64px] box-border">
            <div className="flex flex-col gap-[48px]">
              {/* Title */}
              <h1 className="text-white font-bold text-[32px] leading-[1.25] font-manrope mb-0">
                {t('termsOfUse.title')}
              </h1>

              {/* Content */}
              <div className="flex flex-col text-white max-w-none">
                <p className="font-bold text-[20px] leading-[1.2] mb-0">
                  {t('termsOfUse.introduction')}
                </p>
                
                <p className="leading-[1.25] mb-0 text-[32px]">&nbsp;</p>

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  1. {t('termsOfUse.section1')}
                </p>

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0"> </p>

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  1.1. {t('termsOfUse.section1_1')}
                </p>

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  1.2. {t('termsOfUse.section1_2')}
                </p>

                <p className="leading-[1.25] mb-0 text-[32px]">&nbsp;</p>

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  2. {t('termsOfUse.section2')}
                </p>

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  2.1. {t('termsOfUse.section2_1')}
                </p>

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  2.2. {t('termsOfUse.section2_2')}
                </p>

                <p className="leading-[1.25] mb-0 text-[32px]">&nbsp;</p>

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  3. {t('termsOfUse.section3')}
                </p>

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  3.1. {t('termsOfUse.section3_1')}
                </p>

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  3.2. {t('termsOfUse.section3_2')}
                </p>

                <p className="leading-[1.25] mb-0 text-[32px]">&nbsp;</p>

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  4. {t('termsOfUse.section4')}
                </p>

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  4.1. {t('termsOfUse.section4_1')}
                </p>

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  4.2. {t('termsOfUse.section4_2')}
                </p>

                <p className="leading-[1.25] mb-0 text-[32px]">&nbsp;</p>

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  5. {t('termsOfUse.section5')}
                </p>

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  5.1. {t('termsOfUse.section5_1')}
                </p>

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  5.2. {t('termsOfUse.section5_2')}
                </p>

                <p className="leading-[1.25] mb-0 text-[32px]">&nbsp;</p>

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  6. {t('termsOfUse.section6')}
                </p>

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  6.1. {t('termsOfUse.section6_1')}
                </p>

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  6.2. {t('termsOfUse.section6_2')}
                </p>

                <p className="leading-[1.25] mb-0 text-[32px]">&nbsp;</p>

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  7. {t('termsOfUse.section7')}
                </p>

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  7.1. {t('termsOfUse.section7_1')}
                </p>

                <p className="leading-[1.25] mb-0 text-[20px]">&nbsp;</p>

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  8. {t('termsOfUse.section8')}
                </p>

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  8.1. {t('termsOfUse.section8_1')}
                </p>

                <p className="leading-[1.25] mb-0 text-[32px]">&nbsp;</p>

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  9. {t('termsOfUse.section9')}
                </p>

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  9.1. {t('termsOfUse.section9_1')}
                </p>

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  {t('termsOfUse.effectiveDate')}
                </p>

                <p className="leading-[1.25] mb-0 text-[20px]">&nbsp;</p>

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  10. {t('termsOfUse.section10')}
                </p>

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  10.1. {t('termsOfUse.section10_1')}
                </p>

                <p className="leading-[1.25] mb-0 text-[32px]">&nbsp;</p>

                <p className="font-bold text-[20px] leading-[1.2] mb-0">
                  {t('termsOfUse.closing')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
