import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ChangeImageIcon } from '@/icons'
import { Select } from '@/components/Select'

export const Route = createFileRoute('/settings/')({
  component: RouteComponent,
})

const languageOptions = [
  {
    value: 'uk',
    label: 'Українська',
    icon: '/ua.svg',
  },
  {
    value: 'en',
    label: 'English',
    icon: '/english.svg',
  },
]

function RouteComponent() {
  const [selectedLanguage, setSelectedLanguage] = useState('uk')

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value)
    console.log('Language changed to:', value)
  }

  return (
    <div className="w-full bg-[var(--color-background-15)] rounded-[20px] overflow-hidden text-white">
      <div className="w-full relative">
        <img
          src="/banner-settings.jpg"
          alt="Banner for settings page"
          className="w-full h-[175px] object-cover rounded-none"
        />
        <div className="bg-white rounded-full p-[8px] absolute bottom-[16px] right-[16px] cursor-pointer">
          <ChangeImageIcon className="text-black" />
        </div>
      </div>

      <div className="p-[24px] w-full flex flex-col justify-between min-h-[600px]">
        <div className="flex gap-[24px]">
          <div className="w-[20%]">
            <div className="w-full relative">
              <img
                src="/avatar-settings.png"
                alt="Avatar"
                className="w-full h-full object-cover rounded-full"
              />
              <div className="bg-[var(--color-background-16)] rounded-full p-[8px] absolute bottom-0 right-[10px] cursor-pointer">
                <ChangeImageIcon className="text-white" />
              </div>
            </div>
          </div>
          <div className="w-[80%] flex flex-col gap-[24px]">
            <div className="flex items-center gap-[20px]">
              <div className="w-1/2 flex flex-col gap-[8px]">
                <label htmlFor="nickname" className="text-[16px] font-bold">
                  Нікнейм
                </label>
                <input
                  type="text"
                  className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)] placeholder:text-[var(--color-background-25)]"
                  placeholder="Нікнейм"
                />
              </div>
              <div className="w-1/2 flex flex-col gap-[8px]">
                <label htmlFor="email" className="text-[16px] font-bold">
                  Ел. пошта
                </label>
                <input
                  type="text"
                  className="w-full h-[44px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)] placeholder:text-[var(--color-background-25)]"
                  placeholder="example@gmail.com"
                />
              </div>
            </div>
            <div className="flex flex-col gap-[8px]">
              <div className="flex items-center justify-between">
                <p className="text-[16px] font-bold">Про себе</p>
                <p className="text-[var(--color-background-25)] text-[12px]">
                  0/100
                </p>
              </div>
              <textarea
                className="w-full h-[85px] border-1 border-[var(--color-background-16)] rounded-[20px] py-[10px] px-[16px] text-[16px] bg-[var(--color-background-14)] text-[var(--color-background)] placeholder:text-[var(--color-background-25)] resize-none"
                defaultValue="Готовий до нових перемог! Кожна гра – це новий шанс довести свою майстерність та досягти нових вершин."
              />
            </div>
            <div className="flex flex-col gap-[8px] max-w-[400px] w-full">
              <label htmlFor="language" className="text-[16px] font-bold">
                Мова сайту
              </label>
              <Select
                options={languageOptions}
                value={selectedLanguage}
                onChange={handleLanguageChange}
                placeholder="Оберіть мову..."
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-[12px]">
          <button className="h-[40px] w-[120px] text-[16px] text-[var(--color-background-19)] font-normal cursor-pointer flex items-center justify-center">
            Скасувати
          </button>
          <button className="h-[40px] w-[120px] rounded-[20px] bg-[var(--color-background-21)] text-[16px] font-normal text-black cursor-pointer flex items-center justify-center">
            Зберегти
          </button>
        </div>
      </div>
    </div>
  )
}
