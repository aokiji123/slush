import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { FaFacebookF, FaInstagram } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

export const Footer = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('common')

  const tabs = [
    {
      name: t('footer.termsOfUse'),
      href: '/',
    },
    {
      name: t('footer.privacyPolicy'),
      href: '/',
    },
    {
      name: t('footer.refundPolicy'),
      href: '/',
    },
  ]

  return (
    <footer className="h-[316px] bg-[var(--color-background-15)] flex relative z-10">
      <div className="flex justify-between items-start container mx-auto h-full pt-[40px]">
        <div className="flex flex-col gap-[24px]">
          <div>
            <img
              src="/logo.png"
              alt="logo"
              className="w-[100px] h-[25px] cursor-pointer"
              loading="lazy"
              onClick={() => {
                navigate({
                  to: '/',
                })
              }}
            />
          </div>
          <p className="max-w-[800px] w-full text-[var(--color-background-25)] text-[16px] font-normal">
            {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-[32px] mt-[16px]">
            {tabs.map((tab) => (
              <p key={tab.name} className="text-white text-[16px] font-normal">
                <a href={tab.href}>{tab.name}</a>
              </p>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-[8px]">
          <div className="border-1 border-white text-white rounded-full p-1 cursor-pointer">
            <FaFacebookF size={22} />
          </div>
          <div className="border-1 border-white text-white rounded-full p-1 cursor-pointer">
            <FaInstagram size={22} />
          </div>
          <div className="border-1 border-white text-white rounded-full p-1 cursor-pointer">
            <FaXTwitter size={22} />
          </div>
        </div>
      </div>
    </footer>
  )
}
