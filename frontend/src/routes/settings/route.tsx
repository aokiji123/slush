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

export const Route = createFileRoute('/settings')({
  component: RouteComponent,
})

const settings = [
  {
    icon: ThemeIcon,
    title: 'Темна тема',
    hasSwitch: true,
  },
  {
    icon: GeneralSettingsIcon,
    title: 'Загальні налаштування',
    path: '/settings',
  },
  {
    icon: PasswordIcon,
    title: 'Пароль',
    path: '/settings/password',
  },
  {
    icon: NotificationsIcon,
    title: 'Сповіщення',
    path: '/settings/notifications',
  },
  {
    icon: PaymentsIcon,
    title: 'Гаманець',
    path: '/settings/wallet',
  },
  {
    icon: DeleteAccountIcon,
    title: 'Видалення акаунту',
    path: '/settings/delete-account',
  },
]

function RouteComponent() {
  const navigate = useNavigate()
  const location = useLocation()

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
        <div className="flex gap-[24px] my-[16px]">
          <div className="w-[25%]">
            <div className="w-full bg-[var(--color-background-8)] p-[20px] rounded-[20px] flex flex-col gap-[12px]">
              <input
                type="text"
                className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)]"
                placeholder="Пошук налаштувань..."
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
                    <div className="flex items-center gap-[12px]">
                      <setting.icon />
                      <p>{setting.title}</p>
                    </div>
                    {setting.hasSwitch && <Switch checked />}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="w-[75%] mb-[192px]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
