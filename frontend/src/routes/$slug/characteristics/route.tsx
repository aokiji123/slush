import { createFileRoute } from '@tanstack/react-router'
import { FaChevronDown, FaWindows } from 'react-icons/fa'

export const Route = createFileRoute('/$slug/characteristics')({
  component: RouteComponent,
})

const minimalSettings = [
  {
    name: 'Версія системи',
    value: '64-bit Windows 10/11',
  },
  {
    name: 'CPU',
    value: 'Core i7-6700 або Ryzen 5 1600',
  },
  {
    name: 'Пам’ять',
    value: '12 GB ОП',
  },
  {
    name: 'GPU',
    value: 'GeForce GTX 1060 6GB або Radeon RX 580 8GB або Arc A380',
  },
  {
    name: 'DirectX',
    value: 'версії 12',
  },
  {
    name: 'Обсяг пам’яті',
    value: '70 GB',
  },
  {
    name: 'Звукова карта',
    value: 'Windows Compatible Audio Device',
  },
  {
    name: 'Контроллер',
    value: 'Клавіатура, геймпад',
  },
  {
    name: 'Додаткові примітки',
    value: 'Потрібен SSD',
  },
  {
    name: 'Мова',
    value: 'Англійська, Українська, Французька, Італійська, тощо',
  },
  {
    name: 'Звук',
    value: 'Англійська, Українська, Французька, Італійська, тощо',
  },
]

const recommendedSettings = [
  {
    name: 'Версія системи',
    value: '64-bit Windows 10',
  },
  {
    name: 'CPU',
    value: 'Core i7-12700 або Ryzen 7 7800X3D',
  },
  {
    name: 'Пам’ять',
    value: '16 GB ОП',
  },
  {
    name: 'GPU',
    value: 'GeForce RTX 2060 SUPER or Radeon RX 5700 XT or Arc A770',
  },
  {
    name: 'DirectX',
    value: 'версії 12',
  },
  {
    name: 'Обсяг пам’яті',
    value: '70 GB',
  },
  {
    name: 'Звукова карта',
    value: 'Windows Compatible Audio Device',
  },
]

function RouteComponent() {
  return (
    <>
      <div className="w-[50%] flex items-center justify-between h-[48px] py-[12px] px-[20px] rounded-[20px] bg-[var(--color-background-15)] text-[var(--color-background)] border-1 border-[var(--color-background-16)] mt-[8px]">
        <div className="flex items-center gap-[10px]">
          <FaWindows size={24} />
          <p className="text-[20px] font-medium font-manrope">Windows</p>
        </div>
        <FaChevronDown />
      </div>
      <div className="w-full flex gap-[64px] mt-[16px] text-[var(--color-background)]">
        <div className="w-[50%] flex flex-col gap-[16px] text-[20px]">
          <p className="text-[24px] font-medium font-manrope">
            Мінімальні налаштування
          </p>
          {minimalSettings.map((item) => {
            return (
              <div key={item.name} className="flex flex-col">
                <p className="font-bold">{item.name}</p>
                <p className="font-light">{item.value}</p>
              </div>
            )
          })}
        </div>
        <div className="w-[50%] flex flex-col gap-[16px] text-[20px]">
          <p className="text-[24px] font-medium font-manrope">
            Рекомендовані налаштування
          </p>
          {recommendedSettings.map((item, i) => {
            return (
              <div className="flex flex-col" key={item.name + i}>
                <p className="font-bold">{item.name}</p>
                <p className="font-light">{item.value}</p>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
