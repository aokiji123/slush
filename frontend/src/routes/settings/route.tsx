import {
  Outlet,
  createFileRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import {
  DeleteAccountIcon,
  GeneralSettingsIcon,
  NotificationsIcon,
  PasswordIcon,
  PaymentsIcon,
  ThemeIcon,
} from '@/icons'
import { Switch } from '@/components/Switch'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/settings')({
  component: RouteComponent,
})

const getSettings = (t: any) => [
  {
    icon: ThemeIcon,
    title: t('navigation.darkTheme'),
    hasSwitch: true,
  },
  {
    icon: GeneralSettingsIcon,
    title: t('navigation.general'),
    path: '/settings',
  },
  {
    icon: PasswordIcon,
    title: t('navigation.password'),
    path: '/settings/password',
  },
  {
    icon: NotificationsIcon,
    title: t('navigation.notifications'),
    path: '/settings/notifications',
  },
  {
    icon: PaymentsIcon,
    title: t('navigation.wallet'),
    path: '/settings/wallet',
  },
  {
    icon: DeleteAccountIcon,
    title: t('navigation.deleteAccount'),
    path: '/settings/delete-account',
  },
]

const glowCoords = [
  {
    id: 1,
    top: '-150px',
    left: '-200px',
    width: '700px',
    height: '700px',
  },
  {
    id: 2,
    top: '400px',
    right: '-300px',
    width: '900px',
    height: '900px',
  },
  {
    id: 3,
    bottom: '-50px',
    left: '-250px',
    width: '900px',
    height: '900px',
  },
]

function RouteComponent() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation('settings')
  const settings = getSettings(t)

  const handleSettingClick = (setting: (typeof settings)[0]) => {
    if (setting.hasSwitch) return
    if (setting.path) {
      navigate({ to: setting.path })
    }
  }

  const isActiveRoute = (path: string) => {
    if (path === '/settings') {
      return location.pathname === '/settings'
    }
    return location.pathname === path
  }

  return (
    <div className="bg-[var(--color-night-background)] relative overflow-hidden">
      <div className="container mx-auto relative z-20">
        <div className="flex flex-col lg:flex-row gap-[8px] sm:gap-[16px] lg:gap-[24px] my-[16px]">
          <div className="lg:w-[25%] w-full">
            <div className="w-full bg-[var(--color-background-8)] p-[20px] rounded-[20px] flex flex-col gap-[12px]">
              <input
                type="text"
                className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)]"
                placeholder={t('searchPlaceholder')}
              />
              <ul className="flex flex-col gap-[8px] text-white">
                {settings.map((setting, index) => (
                  <li
                    key={index}
                    className={`py-[8px] px-[12px] rounded-[12px] flex items-center gap-[12px] h-[40px] ${
                      setting.hasSwitch
                        ? 'justify-between'
                        : `hover:bg-[var(--color-background-18)] cursor-pointer ${
                            isActiveRoute(setting.path || '')
                              ? 'bg-[var(--color-background-18)]'
                              : ''
                          }`
                    }`}
                    onClick={() => handleSettingClick(setting)}
                  >
                    <div className="flex items-center gap-[12px] w-full">
                      <div className="flex-shrink-0">
                        <setting.icon />
                      </div>
                      <p className="text-[16px] truncate">{setting.title}</p>
                    </div>
                    {setting.hasSwitch && <Switch checked />}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="lg:w-[75%] w-full mb-[192px]">
            <Outlet />
          </div>
        </div>
      </div>

      {glowCoords.map((glow) => (
        <img
          key={glow.id}
          loading="lazy"
          src="/glow.png"
          alt="glow"
          className="absolute z-0 opacity-50"
          style={{
            top: glow.top,
            left: glow.left,
            right: glow.right,
            bottom: glow.bottom,
            width: glow.width,
            height: glow.height,
          }}
        />
      ))}
    </div>
  )
}
