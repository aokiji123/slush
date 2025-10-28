import { createFileRoute } from '@tanstack/react-router'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/privacy-policy')({
  component: PrivacyPolicyPage,
})

function PrivacyPolicyPage() {
  const { t } = useTranslation('policy')
  return (
    <ErrorBoundary>
      <div className="relative bg-[var(--color-night-background)] min-h-screen">
        {/* Decorative background vectors */}
        <div className="hidden md:block absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute h-[459px] w-[497px] left-[103px] top-[862px] opacity-20">
            <div className="absolute inset-[-130.72%] overflow-hidden">
              <svg
                className="w-full h-full"
                viewBox="0 0 497 459"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 0L497 0L497 459L0 459L0 0Z"
                  fill="url(#pattern0)"
                  fillOpacity="0.1"
                />
                <defs>
                  <pattern
                    id="pattern0"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use href="#image0" transform="scale(0.001 0.00108431)" />
                  </pattern>
                </defs>
              </svg>
            </div>
          </div>

          <div className="absolute h-[459px] w-[497px] left-[1468px] top-[1450px] opacity-20">
            <div className="absolute inset-[-130.72%] overflow-hidden">
              <svg
                className="w-full h-full"
                viewBox="0 0 497 459"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 0L497 0L497 459L0 459L0 0Z"
                  fill="url(#pattern1)"
                  fillOpacity="0.1"
                />
                <defs>
                  <pattern
                    id="pattern1"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use href="#image1" transform="scale(0.001 0.00108431)" />
                  </pattern>
                </defs>
              </svg>
            </div>
          </div>

          <div className="absolute h-[459px] w-[497px] left-[1111px] top-[-84px] opacity-20">
            <div className="absolute inset-[-130.72%] overflow-hidden">
              <svg
                className="w-full h-full"
                viewBox="0 0 497 459"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 0L497 0L497 459L0 459L0 0Z"
                  fill="url(#pattern2)"
                  fillOpacity="0.1"
                />
                <defs>
                  <pattern
                    id="pattern2"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use href="#image2" transform="scale(0.001 0.00108431)" />
                  </pattern>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-24 xl:px-[120px] 2xl:px-[228px] py-[32px] sm:py-[48px] lg:py-[64px]">
          <div className="bg-[var(--color-background-15)] rounded-[20px] sm:rounded-[24px] lg:rounded-[30px] p-[24px] sm:p-[32px] md:p-[48px] lg:p-[64px] box-border">
            <div className="flex flex-col gap-[24px] sm:gap-[32px] lg:gap-[48px]">
              {/* Title */}
              <h1 className="text-white font-bold text-[24px] sm:text-[28px] lg:text-[32px] leading-[1.25] font-manrope">
                {t('privacyPolicy.title')}
              </h1>

              {/* Content */}
              <div className="flex flex-col gap-[16px] sm:gap-[20px] lg:gap-[24px] text-white max-w-none">
                {/* Introduction */}
                <p className="font-bold text-[16px] sm:text-[18px] lg:text-[20px] leading-[1.2] mb-0">
                  {t('privacyPolicy.introduction')}
                </p>

                <br />

                {/* Section 1 */}
                <p className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  1. {t('privacyPolicy.section1')}
                </p>

                <p className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  1.1. {t('privacyPolicy.section1_1')}
                </p>

                <p className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  1.2. {t('privacyPolicy.section1_2')}
                </p>

                <br />

                {/* Section 2 */}
                <p className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  2. {t('privacyPolicy.section2')}
                </p>

                <p className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  2.1. {t('privacyPolicy.section2_1')}
                </p>

                <ul className="list-disc mb-0 pl-[1.5em]">
                  <li className="mb-2">
                    <span className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px]">
                      {t('privacyPolicy.section2_1_1')}
                    </span>
                  </li>
                  <li className="mb-2">
                    <span className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px]">
                      {t('privacyPolicy.section2_1_2')}
                    </span>
                  </li>
                  <li className="mb-2">
                    <span className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px]">
                      {t('privacyPolicy.section2_1_3')}
                    </span>
                  </li>
                  <li className="mb-2">
                    <span className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px]">
                      {t('privacyPolicy.section2_1_4')}
                    </span>
                  </li>
                  <li className="mb-2">
                    <span className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px]">
                      {t('privacyPolicy.section2_1_5')}
                    </span>
                  </li>
                </ul>

                <br />

                {/* Section 3 */}
                <p className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  3. {t('privacyPolicy.section3')}
                </p>

                <p className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  3.1. {t('privacyPolicy.section3_1')}
                </p>

                <ul className="list-disc mb-0 pl-[1.5em]">
                  <li className="mb-2">
                    <span className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px]">
                      {t('privacyPolicy.section3_1_1')}
                    </span>
                  </li>
                  <li className="mb-2">
                    <span className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px]">
                      {t('privacyPolicy.section3_1_2')}
                    </span>
                  </li>
                  <li className="mb-2">
                    <span className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px]">
                      {t('privacyPolicy.section3_1_3')}
                    </span>
                  </li>
                </ul>

                <br />

                {/* Section 4 */}
                <p className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  4. {t('privacyPolicy.section4')}
                </p>

                <p className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  4.1. {t('privacyPolicy.section4_1')}
                </p>

                <p className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  4.2. {t('privacyPolicy.section4_2')}
                </p>

                <br />

                {/* Section 5 */}
                <p className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  5. {t('privacyPolicy.section5')}
                </p>

                <p className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  5.1. {t('privacyPolicy.section5_1')}
                </p>

                <p className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  5.2. {t('privacyPolicy.section5_2')}
                </p>

                <br />

                {/* Section 6 */}
                <p className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  6. {t('privacyPolicy.section6')}
                </p>

                <p className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  6.1. {t('privacyPolicy.section6_1')}
                </p>

                <br />

                {/* Section 7 */}
                <p className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  7. {t('privacyPolicy.section7')}
                </p>

                <p className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  7.1. {t('privacyPolicy.section7_1')}
                </p>

                <ul className="list-disc mb-0 pl-[1.5em]">
                  <li className="mb-2">
                    <span className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px]">
                      {t('privacyPolicy.section7_1_1')}
                    </span>
                  </li>
                  <li className="mb-2">
                    <span className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px]">
                      {t('privacyPolicy.section7_1_2')}
                    </span>
                  </li>
                  <li className="mb-2">
                    <span className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px]">
                      {t('privacyPolicy.section7_1_3')}
                    </span>
                  </li>
                  <li className="mb-2">
                    <span className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px]">
                      {t('privacyPolicy.section7_1_4')}
                    </span>
                  </li>
                  <li className="mb-2">
                    <span className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px]">
                      {t('privacyPolicy.section7_1_5')}
                    </span>
                  </li>
                  <li className="mb-2">
                    <span className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px]">
                      {t('privacyPolicy.section7_1_6')}
                    </span>
                  </li>
                </ul>

                <br />

                {/* Section 8 */}
                <p className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  8. {t('privacyPolicy.section8')}
                </p>

                <p className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  8.1. {t('privacyPolicy.section8_1')}
                </p>

                <p className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  8.2. {t('privacyPolicy.section8_2')}
                </p>

                <br />

                {/* Section 9 */}
                <p className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  9. {t('privacyPolicy.section9')}
                </p>

                <p className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  9.1. {t('privacyPolicy.section9_1')}
                </p>

                <br />

                <p className="font-normal text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] tracking-[-0.2px] mb-0">
                  {t('privacyPolicy.effectiveDate')}
                </p>

                <br />

                <p className="font-bold text-[16px] sm:text-[18px] lg:text-[20px] leading-[1.2] mb-0">
                  {t('privacyPolicy.closing')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
