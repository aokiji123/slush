import type { ChangeEvent } from 'react'
import './style.scss'

interface FilePoleI {
  classTitle?: string
  title: string
  value: string
  onChange?: (a: string) => void
  onFileChange?: (file: File) => void
  classContainer?: string
  accept?: string
  fileType?: string
}

export const FilePole = ({
  classTitle = '',
  title,
  value,
  onChange,
  onFileChange,
  classContainer = '',
  accept,
  fileType,
}: FilePoleI) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // If onFileChange is provided, call it with the File object
    if (onFileChange) {
      onFileChange(file)
      return
    }

    // Otherwise, convert to base64 string (original behavior)
    if (onChange) {
      const reader = new FileReader()
      reader.onload = () => {
        // console.log(reader.result);
        if (typeof reader.result === 'string') {
          onChange(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }
  return (
    <div className={'w-full flex flex-col gap-[8px] ' + classContainer}>
      {title && (
        <div className="w-full flex justify-between items-center gap-[8px]">
          <h2
            className={
              'text-[16px] font-bold text-[var(--color-background)] ' +
              classTitle
            }
          >
            {title}
          </h2>
        </div>
      )}
      <div className="style-pole-file-c w-full rounded-[12px] gap-[12px] flex justify-center items-center relative h-[300px] bg-[var(--color-background-14)] flex-wrap hover:border-[var(--color-background-50)] cursor-pointer">
        {value === '' && (
          <>
            <p className="text-[16px] text-[var(--color-background-25)] text-center">
              Перетягніть файл сюди або
            </p>
            <button className="rounded-[20px] p-[9px] pl-[20px] pr-[20px] text-[var(--color-background)] bg-[var(--color-background-16)]">
              <span className="mt-[2px] flex">Завантажити</span>
            </button>
          </>
        )}
        {value ? (
          fileType?.startsWith('video/') ? (
            <video src={value} className="absolute h-full w-full object-cover opacity-100" controls />
          ) : (
            <img src={value} alt="Uploaded file preview" className="absolute h-full w-full object-cover opacity-100" />
          )
        ) : (
          <input
            onChange={handleFileChange}
            type="file"
            className="w-full absolute h-full opacity-0"
            accept={accept}
          />
        )}
      </div>
    </div>
  )
}
