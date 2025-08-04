import { FaFacebookF, FaInstagram } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

const tabs = [
  {
    name: 'Умови використання',
    href: '/',
  },
  {
    name: 'Політика конфіденційності',
    href: '/',
  },
  {
    name: 'Політика повернення коштів магазину',
    href: '/',
  },
]

export const Footer = () => {
  return (
    <footer className="h-[316px] bg-[var(--color-background-15)] flex relative z-10">
      <div className="flex justify-between items-start container mx-auto h-full pt-[40px]">
        <div className="flex flex-col gap-[24px]">
          <div>
            <img src="/logo.png" alt="logo" className="w-[100px] h-[25px]" />
          </div>
          <p className="max-w-[800px] w-full text-[var(--color-background-25)] text-[16px] font-normal">
            © 2024, Zubarik inc, Inc. All rights reserved. Zubarik inc, Zubarik
            inc, the Zubarik inc logo, Zubarik, the Zubarik logo, Unreal, Unreal
            Engine, the Unreal Engine logo, Unreal Tournament, and the Unreal
            Tournament logo are trademarks or registered trademarks of Zubarik
            inc, Inc. in the United States of America and elsewhere. Other
            brands or product names are the trademarks of their respective
            owners.
          </p>
          <div className="flex items-center gap-[32px] mt-[16px]">
            {tabs.map((tab) => (
              <p className="text-white text-[16px] font-normal">
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
