import { createFileRoute } from '@tanstack/react-router'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/store-refund-policy')({
  component: StoreRefundPolicyPage,
})

function StoreRefundPolicyPage() {
  const { t } = useTranslation('policy')
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[var(--color-night-background)] relative">
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
              <h1 className="text-white font-bold text-[32px] leading-[1.25] font-manrope">
                {t('storeRefundPolicy.title')}
              </h1>

              {/* Content */}
              <div className="flex flex-col gap-[24px] text-white max-w-none">
                <p className="font-bold text-[20px] leading-[1.2] mb-0">
                  {t('storeRefundPolicy.introduction')}
                </p>
                
                <br />

                {/* Section 1 */}
                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  1. {t('storeRefundPolicy.section1')}
                </p>
                
                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  1.1. {t('storeRefundPolicy.section1_1')}
                </p>
                
                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  1.2. {t('storeRefundPolicy.section1_2')}
                </p>
                
                <br />

                {/* Section 2 */}
                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  2. {t('storeRefundPolicy.section2')}
                </p>
                
                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  2.1. {t('storeRefundPolicy.section2_1')}
                </p>
                
                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  2.2. {t('storeRefundPolicy.section2_2')}
                </p>
                
                <br />

                {/* Section 3 */}
                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  3. {t('storeRefundPolicy.section3')}
                </p>
                
                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  3.1. {t('storeRefundPolicy.section3_1')}
                </p>
                
                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  3.2. {t('storeRefundPolicy.section3_2')}
                </p>
                
                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  3.3. {t('storeRefundPolicy.section3_3')}
                </p>
                
                <br />

                {/* Section 4 */}
                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  4. {t('storeRefundPolicy.section4')}
                </p>
                
                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  4.1. {t('storeRefundPolicy.section4_1')}
                </p>
                
                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  4.2. {t('storeRefundPolicy.section4_2')}
                </p>
                
                <br />

                {/* Section 5 */}
                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  5. {t('storeRefundPolicy.section5')}
                </p>
                
                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  5.1. {t('storeRefundPolicy.section5_1')}
                </p>
                
                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  5.2. {t('storeRefundPolicy.section5_2')}
                </p>
                
                <br />

                {/* Section 6 */}
                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  6. {t('storeRefundPolicy.section6')}
                </p>
                
                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  6.1. {t('storeRefundPolicy.section6_1')}
                </p>
                
                <ul className="list-disc mb-0 pl-[1.5em]">
                  <li className="mb-0">
                    <span className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px]">{t('storeRefundPolicy.section6_1_1')}</span>
                  </li>
                  <li className="mb-0">
                    <span className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px]">{t('storeRefundPolicy.section6_1_2')}</span>
                  </li>
                  <li className="mb-0">
                    <span className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px]">{t('storeRefundPolicy.section6_1_3')}</span>
                  </li>
                  <li>
                    <span className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px]">{t('storeRefundPolicy.section6_1_4')}</span>
                  </li>
                </ul>
                
                <br />

                {/* Section 7 */}
                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  7. {t('storeRefundPolicy.section7')}
                </p>
                
                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  7.1. {t('storeRefundPolicy.section7_1')}
                </p>
                
                <br />

                {/* Section 8 */}
                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  8. {t('storeRefundPolicy.section8')}
                </p>
                
                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  8.1. {t('storeRefundPolicy.section8_1')}
                </p>
                
                <br />

                <p className="font-normal text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  {t('storeRefundPolicy.effectiveDate')}
                </p>
                
                <br />

                <p className="font-bold text-[20px] leading-[1.2] mb-0">
                  {t('storeRefundPolicy.closing1')}
                </p>
                
                <p className="font-bold text-[20px] leading-[1.2] mb-0">
                  {t('storeRefundPolicy.closing2')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
