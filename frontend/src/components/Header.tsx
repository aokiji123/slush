import { GoDotFill } from 'react-icons/go'
import { useLocation, useNavigate } from '@tanstack/react-router'
import {
  CartIcon,
  FavoriteIcon,
  NotificationsIcon,
  SettingsIcon,
} from '@/icons'
import { useState } from 'react'
import { HiMenuAlt3 } from 'react-icons/hi'
import { IoClose } from 'react-icons/io5'
import { useAuthState } from '@/api/queries/useAuth'

const tabs = [
  {
    name: 'Крамниця',
    href: '/',
  },
  {
    name: 'Бібліотека',
    href: '/library',
  },
  // {
  //   name: 'Чат',
  //   href: '/',
  // },
]

export const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isAuth } = useAuthState()

  const isShopActive =
    location.pathname === '/' ||
    (location.pathname !== '/library' && location.pathname !== '/chat')
  const isLibraryActive = location.pathname === '/library'

  const handleNavigation = (to: string) => {
    navigate({ to })
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <header className="h-[90px] bg-[var(--color-background-15)] flex items-center justify-center relative z-50">
        <div className="flex items-center justify-between container mx-auto h-full px-4">
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-[35px] text-white">
            {tabs.map((tab) => {
              const isActive =
                (tab.href === '/' && isShopActive) ||
                (tab.href === '/library' && isLibraryActive)

              return (
                <p
                  key={tab.name}
                  className={`hover:text-[var(--color-background-23)] relative font-bold text-[20px] group ${
                    isActive ? 'text-[var(--color-background-23)]' : ''
                  }`}
                >
                  <a className="font-manrope" href={tab.href}>
                    {tab.name}
                  </a>
                  <GoDotFill
                    className={`absolute bottom-[-10px] right-1/2 translate-x-1/2 text-[var(--color-background-23)] ${
                      isActive
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
                    }`}
                    size={12}
                  />
                </p>
              )
            })}
          </div>

          {/* Desktop Auth */}
          {!isAuth ? (
            <div className="hidden md:block">
              <a
                href="/login"
                className="px-6 py-2 bg-[var(--color-background-16)] text-white rounded-[22px] text-[16px] font-medium"
              >
                Увійти
              </a>
            </div>
          ) : (
            <div className="hidden md:block">
              <div className="flex items-center gap-[8px]">
                <div
                  className={`w-[52px] h-[52px] flex items-center justify-center rounded-[20px] cursor-pointer
                    ${
                      location.pathname === '/settings'
                        ? 'bg-white text-[var(--color-background-16)]'
                        : 'bg-[var(--color-background-17)] text-[var(--color-background)]'
                    }`}
                  onClick={() => {
                    navigate({
                      to: '/settings',
                    })
                  }}
                >
                  <SettingsIcon className="w-[24px] h-[24px]" />
                </div>
                <div
                  className={`w-[52px] h-[52px] flex items-center justify-center bg-[var(--color-background-17)] text-[var(--color-background)] rounded-[20px] cursor-pointer
                    ${
                      location.pathname === '/settings/notifications'
                        ? 'bg-white text-[var(--color-background-16)]'
                        : 'bg-[var(--color-background-17)] text-[var(--color-background)]'
                    }`}
                  onClick={() => {
                    navigate({
                      to: '/settings/notifications',
                    })
                  }}
                >
                  <NotificationsIcon className="w-[24px] h-[24px]" />
                </div>
                <div className="w-[52px] h-[52px] flex items-center justify-center cursor-pointer">
                  <img
                    src={user?.avatar || '/avatar.png'}
                    alt="avatar"
                    className="w-[52px] h-[52px] rounded-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mobile Burger Menu */}
          <button
            className="md:hidden w-[40px] h-[40px] flex items-center justify-center text-white"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <HiMenuAlt3 size={32} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`fixed right-0 top-0 h-full w-[280px] bg-[var(--color-background-15)] transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--color-background-17)]">
            <img
              src="/logo.png"
              alt="logo"
              className="w-[80px] h-[20px]"
              loading="lazy"
            />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-[40px] h-[40px] flex items-center justify-center text-white"
              aria-label="Close menu"
            >
              <IoClose size={28} />
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex flex-col p-4">
            {/* Navigation Tabs */}
            <div className="flex flex-col gap-4 mb-6">
              {tabs.map((tab) => {
                const isActive =
                  (tab.href === '/' && isShopActive) ||
                  (tab.href === '/library' && isLibraryActive)

                return (
                  <a
                    key={tab.name}
                    href={tab.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-[18px] font-bold py-3 px-4 rounded-[12px] transition-colors ${
                      isActive
                        ? 'text-[var(--color-background-23)] bg-[var(--color-background-17)]'
                        : 'text-white hover:bg-[var(--color-background-17)]'
                    }`}
                  >
                    {tab.name}
                  </a>
                )
              })}
            </div>

            {/* Auth Section */}
            {!isAuth ? (
              <div className="mt-4">
                <a
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-6 py-3 bg-[var(--color-background-16)] text-white rounded-[22px] text-[16px] font-medium text-center"
                >
                  Увійти
                </a>
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                {/* User Profile */}
                <div className="flex items-center gap-3 p-3 bg-[var(--color-background-17)] rounded-[12px] overflow-hidden">
                  <img
                    src={user?.avatar || '/avatar.png'}
                    alt="avatar"
                    className="w-[48px] h-[48px] rounded-full object-cover flex-shrink-0"
                    loading="lazy"
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <p className="text-white text-[16px] font-bold truncate">
                      {user?.username || 'Юзернейм'}
                    </p>
                    <p className="text-[var(--color-background-25)] text-[14px] truncate">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </div>

                {/* Settings & Notifications */}
                <button
                  className={`flex items-center gap-3 p-3 rounded-[12px] transition-colors ${
                    location.pathname === '/settings'
                      ? 'bg-white text-[var(--color-background-16)]'
                      : 'bg-[var(--color-background-17)] text-white hover:bg-[var(--color-background-16)]'
                  }`}
                  onClick={() => handleNavigation('/settings')}
                >
                  <SettingsIcon className="w-[24px] h-[24px]" />
                  <span className="text-[16px] font-medium">Налаштування</span>
                </button>

                <button
                  className={`flex items-center gap-3 p-3 rounded-[12px] transition-colors ${
                    location.pathname === '/settings/notifications'
                      ? 'bg-white text-[var(--color-background-16)]'
                      : 'bg-[var(--color-background-17)] text-white hover:bg-[var(--color-background-16)]'
                  }`}
                  onClick={() => handleNavigation('/settings/notifications')}
                >
                  <NotificationsIcon className="w-[24px] h-[24px]" />
                  <span className="text-[16px] font-medium">Сповіщення</span>
                </button>

                <button
                  className={`flex sm:hidden items-center gap-3 p-3 rounded-[12px] transition-colors ${
                    location.pathname === '/settings/notifications'
                      ? 'bg-white text-[var(--color-background-16)]'
                      : 'bg-[var(--color-background-17)] text-white hover:bg-[var(--color-background-16)]'
                  }`}
                  onClick={() => handleNavigation('/settings/notifications')}
                >
                  <FavoriteIcon className="w-[24px] h-[24px]" />
                  <span className="text-[16px] font-medium">Вішлист</span>
                </button>

                <button
                  className={`flex sm:hidden items-center gap-3 p-3 rounded-[12px] transition-colors ${
                    location.pathname === '/settings/notifications'
                      ? 'bg-white text-[var(--color-background-16)]'
                      : 'bg-[var(--color-background-17)] text-white hover:bg-[var(--color-background-16)]'
                  }`}
                  onClick={() => handleNavigation('/settings/notifications')}
                >
                  <CartIcon className="w-[24px] h-[24px]" />
                  <span className="text-[16px] font-medium">Кошик</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
