import type { CommunityCommentI } from "@/types/community"
import type { Dispatch, SetStateAction } from "react"

interface CommentOneI extends CommunityCommentI {
  onSelected: Dispatch<SetStateAction<CommunityCommentI | null>>
}



export const GameComments = ({ name, date, text, like, avatar, _id, comments, onSelected }: CommentOneI) => {


  return <div className='bg-[var(--color-background-15)] rounded-[20px] comment-one-g'>
    <div className={`w-full flex flex-col pl-[24px] pr-[24px] pt-[16px] pb-[16px]`}>
      <div className="w-full flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-[12px]">
          <div className='flex bg-[var(--color-background-8)] rounded-[20px] items-center gap-[12px] pr-[16px]'>
            <img src={avatar} className='h-[36px]' alt="" />
            <p className='text-[var(--color-background)] text-[16px]'>{name}</p>
          </div>
          <p className='text-[14px] text-[var(--color-background-25)] mt-[3px]'>{date}</p>
        </div>

        <div className='flex gap-[3px] pt-[8px] pb-[8px] pr-[3px]'>
          <div className='w-[4px] h-[4px] rounded-[20px] bg-[var(--color-background)]'></div>
          <div className='w-[4px] h-[4px] rounded-[20px] bg-[var(--color-background)]'></div>
          <div className='w-[4px] h-[4px] rounded-[20px] bg-[var(--color-background)]'></div>
        </div>
      </div>

      {comments.map((el) => <div key={el._id} className="w-full flex flex-col items-start pt-[16px] pl-[24px] pb-[12px] pr-[24px] mt-[16px] gap-[12px] border-l-8 border-l-[var(--color-background-21)] rounded-[8px] bg-[var(--color-background-17)]">
        <div className='flex bg-[var(--color-background-18)] rounded-[20px] items-center gap-[12px] pr-[16px]'>
          <img src={el.avatar} className='h-[36px]' alt="" />
          <p className='text-[var(--color-background)] text-[16px]'>{el.name}</p>
        </div>
        <p className='text-[var(--color-background-25)] text-[14px]'>{el.text}</p>
      </div>)}

      <div className="w-full flex mt-[16px] gap-[20px]">
        <div>
          {text && <p className='text-[var(--color-background)] text-[16px] mb-[24px]'>{text}</p>}
        </div>
      </div>


      <div className="flex flex-row items-center gap-[12px]">
        <div className='flex bg-[var(--color-background-8)] rounded-[20px] items-center gap-[10px] pr-[8px]  pl-[8px] pb-[4px] pt-[4px]'>
          <svg viewBox="0 0 24 24" width="24.000000" height="24.000000" fill="none">
            <rect id="Heart" width="24.000000" height="24.000000" x="0.000000" y="0.000000" fill="rgb(255,255,255)" fillOpacity="0" />
            <path id="Vector" d="M12 20C11.717 20 11.5283 19.9071 11.3396 19.7213L3.60377 12.1038C2.56604 10.8962 2 9.59563 2 8.38798C2 6.99454 2.56604 5.60109 3.60377 4.57924C4.64151 3.55738 6.0566 3 7.4717 3C8.88679 3 10.3019 3.55738 11.3396 4.57924L12 5.22951L12.6604 4.57924C13.6981 3.55738 15.1132 3 16.5283 3C17.9434 3 19.3585 3.55738 20.3962 4.57924C21.434 5.60109 22 6.99454 22 8.38798C22 9.68853 21.434 10.8962 20.4906 12.1038L12.6604 19.8142C12.4717 19.9071 12.283 20 12 20ZM7.4717 4.85792C6.5283 4.85792 5.58491 5.22951 4.92453 5.87978C4.26415 6.53006 3.88679 7.36612 3.88679 8.38798C3.88679 9.22404 4.26415 10.0601 5.01887 10.9891L12 17.8634L19.0755 10.8962C19.7358 10.0601 20.1132 9.22404 20.1132 8.38798C20.1132 7.45902 19.7358 6.53006 19.0755 5.87978C17.7547 4.57924 15.3962 4.57924 13.9811 5.87978L12.6604 7.18033C12.283 7.55191 11.717 7.55191 11.3396 7.18033L10.0189 5.87978C9.35849 5.22951 8.41509 4.85792 7.4717 4.85792Z" fill="rgb(255,111,149)" fillRule="nonzero" />
          </svg>
          <p className='text-[14px] text-[var(--color-background-25)] mt-[3px]'>{like}</p>
        </div>
        <div onClick={() => onSelected({ name, date, text, like, avatar, _id, comments})} className='flex bg-[var(--color-background-8)] rounded-[20px] items-center gap-[10px] pr-[8px]  pl-[8px] pb-[4px] pt-[4px]'>
          <svg viewBox="0 0 24 24" width="24.000000" height="24.000000" fill="none">
            <rect id="Icons" width="24.000000" height="24.000000" x="0.000000" y="0.000000" fill="rgb(255,255,255)" fillOpacity="0" />
            <path id="Vector" d="M18.7 22L6.1 22C5.3 22 4.5 21.7 3.9 21.1C3.3 20.5 3 19.7 3 18.9L3 15.2C3 14.6 3.4 14.2 4 14.2C4.6 14.2 5 14.6 5 15.2L5 18.9C5 19.2 5.1 19.5 5.3 19.7C5.5 19.9 5.8 20 6.1 20L18.7 20C19 20 19.3 19.9 19.5 19.7C19.7 19.5 19.8 19.2 19.8 18.9L19.8 15.2C19.8 14.6 20.2 14.2 20.8 14.2C21.4 14.2 21.8 14.6 21.8 15.2L21.8 18.9C21.8 19.7 21.5 20.5 20.9 21.1C20.3 21.7 19.5 22 18.7 22ZM12.4 16C11.8 16 11.4 15.6 11.4 15L11.4 5.3L8.2 8.3C7.8 8.7 7.2 8.7 6.8 8.3C6.4 7.9 6.4 7.3 6.8 6.9L11.6 2.3C11.9 2 12.2 2 12.4 2C12.5 2 12.6 2 12.8 2.1C12.9 2.1 13 2.2 13.1 2.3L17.9 6.9C18.3 7.3 18.3 7.9 17.9 8.3C17.5 8.7 16.9 8.7 16.5 8.3L13.4 5.3L13.4 15C13.4 15.5 13 16 12.4 16Z" fill="rgb(241.196,253.376,255)" fillRule="nonzero" />
          </svg>

          <p className='text-[14px] text-[var(--color-background)] mt-[3px]'>Відповісти</p>
        </div>
      </div>
    </div>
  </div>

}