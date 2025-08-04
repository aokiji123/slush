import { GoDotFill } from 'react-icons/go'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { NotificationsIcon, SettingsIcon } from '@/icons'

const tabs = [
  {
    name: 'Крамниця',
    href: '/',
  },
  {
    name: 'Бібліотека',
    href: '/',
  },
  {
    name: 'Чат',
    href: '/',
  },
]

const matchedUrls = [
  '/login',
  '/sign-up',
  '/reset-password',
  '/forgot-password',
  '/change-password',
  '/code-access',
]

export const Header = () => {
  const location = useLocation()
  const url = location.pathname
  const navigate = useNavigate()

  return (
    <header className="h-[90px] bg-[var(--color-background-15)] flex items-center justify-center">
      <div className="flex items-center justify-between container mx-auto h-full">
        <div>
          <h1 className="hidden">Slush</h1>
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
        <div className="flex items-center gap-[35px] text-white">
          {tabs.map((tab) => (
            <p className="hover:text-[var(--color-background-23)] relative font-bold text-[20px] group">
              <a href={tab.href}>{tab.name}</a>
              <GoDotFill
                className="absolute bottom-[-10px] right-1/2 translate-x-1/2 text-[var(--color-background-23)] opacity-0 group-hover:opacity-100"
                size={12}
              />
            </p>
          ))}
        </div>
        {matchedUrls.includes(url) ? (
          <div>
            <a
              href="/login"
              className="px-6 py-2 bg-[var(--color-background-16)] text-white rounded-[22px] text-[16px] font-medium"
            >
              Увійти
            </a>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-[8px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center bg-[var(--color-background-17)] rounded-[20px] cursor-pointer">
                <SettingsIcon className="w-[24px] h-[24px]" />
              </div>
              <div className="w-[52px] h-[52px] flex items-center justify-center bg-[var(--color-background-17)] rounded-[20px] cursor-pointer">
                <NotificationsIcon className="w-[24px] h-[24px]" />
              </div>
              <div className="w-[52px] h-[52px] flex items-center justify-center cursor-pointer">
                <img
                  src="/avatar.png"
                  alt="avatar"
                  className="w-[52px] h-[52px] rounded-full"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
