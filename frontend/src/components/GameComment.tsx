import { BsThreeDots } from 'react-icons/bs'
import { FaRegStar, FaStar } from 'react-icons/fa'
import { CommentsIcon, FavoriteIcon } from '@/icons'

type GameCommentProps = {
  text: string
  stars: number
}

export const GameComment = ({ text, stars }: GameCommentProps) => {
  return (
    <div
      className="w-full p-[20px] rounded-[20px] flex flex-col gap-[30px] bg-[var(--color-background-15)] mb-[16px]"
      style={{ breakInside: 'avoid' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-[16px]">
          <img
            src="/avatar.png"
            alt="user avatar"
            className="object-cover size-[56px] rounded-full"
            loading="lazy"
          />
          <div className="flex flex-col gap-[8px]">
            <p className="text-[20px] font-bold">DenroyPro</p>
            <div className="flex items-center gap-[8px]">
              {Array.from({ length: 5 }).map((_, index) => {
                return index < stars ? (
                  <FaStar
                    key={index}
                    size={24}
                    className="text-[var(--color-background-10)]"
                  />
                ) : (
                  <FaRegStar
                    key={index}
                    size={24}
                    className="text-[var(--color-background-10)]"
                  />
                )
              })}
            </div>
          </div>
        </div>
        <button className="text-[var(--color-background)]">
          <BsThreeDots size={24} className="cursor-pointer" />
        </button>
      </div>
      <p className="text-[20px] font-normal">{text}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[16px]">
          <div className="flex items-center gap-[8px] py-[4px] px-[8px] cursor-pointer text-[var(--color-background-25)] bg-[var(--color-background-17)] rounded-[8px]">
            <FavoriteIcon className="text-[var(--color-background-10)]" />
            <p>2.5k</p>
          </div>
          <div className="flex items-center gap-[8px] py-[4px] px-[8px] cursor-pointer text-[var(--color-background-25)] bg-[var(--color-background-17)] rounded-[8px]">
            <CommentsIcon />
            <p>2.5k</p>
          </div>
        </div>
        <p className="text-[16px] font-normal text-[var(--color-background-25)]">
          21.02.2023
        </p>
      </div>
    </div>
  )
}
