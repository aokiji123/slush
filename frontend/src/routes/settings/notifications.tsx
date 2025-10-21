import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Switch } from '@/components/Switch'
import { useAuthenticatedUser, useNotifications, useUpdateNotifications } from '@/api/queries/useUser'
import type { NotificationsSettings } from '@/api/types/user'

export const Route = createFileRoute('/settings/notifications')({
  component: RouteComponent,
})

const notificationSettings = [
  { key: 'bigSale' as keyof NotificationsSettings, label: 'Великий розпродаж' },
  { key: 'wishlistDiscount' as keyof NotificationsSettings, label: 'Знижка на ігри з мого Бажаного' },
  { key: 'newProfileComment' as keyof NotificationsSettings, label: 'Новий коментар під моїм профілем' },
  { key: 'newFriendRequest' as keyof NotificationsSettings, label: 'Новий запит на дружбу' },
  { key: 'friendRequestAccepted' as keyof NotificationsSettings, label: 'Мій запит на дружбу прийнято' },
  { key: 'friendRequestDeclined' as keyof NotificationsSettings, label: 'Мій запит на дружбу відхилено' },
]

function RouteComponent() {
  const { data: user } = useAuthenticatedUser()
  const { data: notifications, isLoading: notificationsLoading } = useNotifications(user?.id || '')
  const updateNotificationsMutation = useUpdateNotifications()
  
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleNotificationToggle = async (key: keyof NotificationsSettings, checked: boolean) => {
    if (!user || !notifications) return

    try {
      const updatedSettings = {
        ...notifications,
        [key]: checked,
      }

      await updateNotificationsMutation.mutateAsync({
        userId: user.id,
        request: {
          userId: user.id,
          bigSale: updatedSettings.bigSale,
          wishlistDiscount: updatedSettings.wishlistDiscount,
          newProfileComment: updatedSettings.newProfileComment,
          newFriendRequest: updatedSettings.newFriendRequest,
          friendRequestAccepted: updatedSettings.friendRequestAccepted,
          friendRequestDeclined: updatedSettings.friendRequestDeclined,
        }
      })

      setMessage({ type: 'success', text: 'Налаштування сповіщень оновлено!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Помилка оновлення налаштувань сповіщень' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-white text-lg mb-4">Потрібно увійти в акаунт</p>
          <a 
            href="/login" 
            className="inline-block px-6 py-2 bg-[var(--color-background-21)] text-black rounded-lg hover:opacity-80"
          >
            Увійти
          </a>
        </div>
      </div>
    )
  }

  if (notificationsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-white">Завантаження налаштувань сповіщень...</p>
      </div>
    )
  }

  return (
    <div className="w-full bg-[var(--color-background-15)] rounded-[20px] overflow-hidden text-white p-[24px] pb-[40px] flex flex-col gap-[64px]">
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          {message.text}
        </div>
      )}

      <div className="w-full max-w-[500px] flex flex-col gap-[16px]">
        <p className="text-[20px] font-bold font-manrope">
          Беззвучні сповіщення
        </p>

        <ul className="w-full flex flex-col gap-[16px]">
          {notificationSettings.map(({ key, label }) => (
            <li
              key={key}
              className="flex items-center justify-between"
            >
              {label}
              <Switch 
                checked={Boolean(notifications?.[key])}
                onChange={(checked) => handleNotificationToggle(key, checked)}
                disabled={updateNotificationsMutation.isPending}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full max-w-[650px]">
        <p className="text-[20px] font-bold font-manrope">Чат</p>

        <div className="flex items-end justify-between">
          <p>Нове повідомлення у чаті</p>

          <div className="flex items-center gap-[77px]">
            <div className="flex flex-col items-center gap-[8px]">
              <p className="text-[16px] font-bold">Сповіщення</p>
              <Switch checked />
            </div>
            <div className="flex flex-col items-center gap-[8px]">
              <p className="text-[16px] font-bold">Звук</p>
              <Switch checked />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
