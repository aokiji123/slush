import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useRef, useState } from 'react'

export const Route = createFileRoute('/code-access')({
  component: RouteComponent,
})

function RouteComponent() {
  const [code, setCode] = useState(['', '', '', '', ''])
  const navigate = useNavigate()
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  return (
    <div className="bg-[var(--color-night-background)] text-white">
      <div
        className="w-full h-screen flex justify-center items-center"
        style={{
          background: `url(/auth-bg.png) no-repeat center center`,
          backgroundSize: 'cover',
        }}
      >
        <div className="w-full max-w-[470px] min-h-[400px] bg-[var(--color-background-15)] rounded-[20px] sm:p-[40px] p-[24px] flex flex-col items-center gap-[64px] mx-[16px]">
          <div className="flex flex-col gap-[32px] w-full">
            <div className="flex flex-col gap-[16px]">
              <p className="text-[24px] font-bold text-center font-manrope">
                Введіть код
              </p>
              <p className="text-[16px] font-normal text-center">
                На ваш e-mail був надісланий 5-значний код
              </p>
            </div>
            <div className="flex gap-[16px] justify-center">
              {[0, 1, 2, 3, 4].map((index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el
                  }}
                  type="text"
                  maxLength={1}
                  value={code[index]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="sm:w-[64px] sm:h-[76px] w-[48px] h-[56px] bg-[var(--color-background-14)] rounded-[12px] text-center text-[36px] font-bold border-1 border-[var(--color-background-16)] focus:border-[var(--color-background-21)] focus:outline-none"
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-[16px]">
            <button
              className="h-[48px] w-[200px] rounded-[22px] bg-[var(--color-background-21)] text-[16px] font-normal text-black cursor-pointer"
              onClick={() => {
                navigate({
                  to: '/change-password',
                })
              }}
            >
              Продовжити
            </button>
            <button className="text-[16px] font-medium hover:underline cursor-pointer">
              Надіслати код ще раз
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
