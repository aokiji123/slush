import { createFileRoute } from '@tanstack/react-router'
import { Switch } from '@/components/Switch'

export const Route = createFileRoute('/settings/notifications')({
  component: RouteComponent,
})

const notifications = [
  'Великий розпродаж',
  'Знижка на ігри з мого Бажаного',
  'Новий коментар під моїм профілем',
  'Новий запит на дружбу',
  'Мій запит на дружбу прийнято',
  'Мій запит на дружбу відхилено',
]

function RouteComponent() {
  return (
    <div className="w-full bg-[var(--color-background-15)] rounded-[20px] overflow-hidden text-white p-[24px] pb-[40px] flex flex-col gap-[64px]">
      <div className="w-full max-w-[500px] flex flex-col gap-[16px]">
        <p className="text-[20px] font-bold">Беззвучні сповіщення</p>

        <ul className="w-full flex flex-col gap-[16px]">
          {notifications.map((notification) => (
            <li
              key={notification}
              className="flex items-center justify-between"
            >
              {notification}
              <Switch checked />
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full max-w-[650px]">
        <p className="text-[20px] font-bold">Чат</p>

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
