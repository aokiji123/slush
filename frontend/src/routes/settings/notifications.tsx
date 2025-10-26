import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { Switch } from '@/components/Switch'
import { useAuthenticatedUser, useNotifications, useUpdateNotifications } from '@/api/queries/useUser'
import type { NotificationsSettings } from '@/api/types/user'

export const Route = createFileRoute('/settings/notifications')({
  component: RouteComponent,
})

const getNotificationSettings = (t: any) => [
  { key: 'bigSale' as keyof NotificationsSettings, label: t('notifications.bigSale') },
  { key: 'wishlistDiscount' as keyof NotificationsSettings, label: t('notifications.wishlistDiscount') },
  { key: 'newProfileComment' as keyof NotificationsSettings, label: t('notifications.newProfileComment') },
  { key: 'newFriendRequest' as keyof NotificationsSettings, label: t('notifications.newFriendRequest') },
  { key: 'friendRequestAccepted' as keyof NotificationsSettings, label: t('notifications.friendRequestAccepted') },
  { key: 'friendRequestDeclined' as keyof NotificationsSettings, label: t('notifications.friendRequestDeclined') },
]

function RouteComponent() {
  const { t } = useTranslation('settings')
  const { data: user } = useAuthenticatedUser()
  const { data: notifications, isLoading: notificationsLoading } = useNotifications(user?.id || '')
  const updateNotificationsMutation = useUpdateNotifications()
  
  const notificationSettings = getNotificationSettings(t)

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

      toast.success(t('notifications.success'))
    } catch (error) {
      toast.error(t('notifications.error'))
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-white text-lg mb-4">{t('notifications.loginRequired')}</p>
          <a 
            href="/login" 
            className="inline-block px-6 py-2 bg-[var(--color-background-21)] text-black rounded-lg hover:opacity-80"
          >
            {t('notifications.loginButton')}
          </a>
        </div>
      </div>
    )
  }

  if (notificationsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-white">{t('notifications.loading')}</p>
      </div>
    )
  }

  return (
    <div className="w-full bg-[var(--color-background-15)] rounded-[20px] overflow-hidden text-white p-[24px] pb-[40px] flex flex-col gap-[64px]">
      <div className="w-full max-w-[500px] flex flex-col gap-[16px]">
        <p className="text-[20px] font-bold font-manrope">
          {t('notifications.silentNotifications')}
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
        <p className="text-[20px] font-bold font-manrope">{t('notifications.chat')}</p>

        <div className="flex items-end justify-between">
          <p>{t('notifications.newChatMessage')}</p>

          <div className="flex items-center gap-[77px]">
            <div className="flex flex-col items-center gap-[8px]">
              <p className="text-[16px] font-bold">{t('notifications.notifications')}</p>
              <Switch checked />
            </div>
            <div className="flex flex-col items-center gap-[8px]">
              <p className="text-[16px] font-bold">{t('notifications.sound')}</p>
              <Switch checked />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
