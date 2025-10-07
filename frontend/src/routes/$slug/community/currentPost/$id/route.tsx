import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import posts from '../../posts.json';
import comments from '../../comments.json';
import '../../style.scss';
import { useMemo, useState, type ChangeEvent } from 'react';
import { GamePost } from '@/components/GamePost';
import { GamePostCurrent } from '@/components/GamePostCurrent';
import { GameComments } from '@/components/GameComments';
import type { CommunityCommentI } from '@/types/community';
export const Route = createFileRoute('/$slug/community/currentPost/$id')({
    component: RouteComponent,
})
const searchSelect = [
    {
        text: "Спочатку нові",
        showText: "Популярні"
    },
    {
        text: "За оцінкою",
        showText: "Hові"
    }
]

function RouteComponent() {
    const navigate = useNavigate()
    const { slug, id } = useParams({ from: '/$slug/community/currentPost/$id' });
    const comment = useMemo(() => posts.find(comment => comment._id === id), [id]);
    // const [user, setUser] = useState({

    // });

    const [currentComment, setCurrentComment] = useState<null | CommunityCommentI>(null);

    const [commentsList, setCommentsList] = useState<CommunityCommentI[]>(comments);
    const [valueSearch, setValueSearch] = useState('');
    const [postTypeSort, setPostTypeSort] = useState(searchSelect[0]);

    const onHedlerSearchValue = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setValueSearch(e.target.value)
  const onCancel = () => {
    setCurrentComment(null)
    setValueSearch('')
  }
  const onPublick = () => {
    currentComment?.comments.push({
      name: 'NikaNii',
      text: valueSearch,
      avatar: '/community/avatar.png',
      _id: Math.random().toString(36).substring(2, 9)
    })
    setValueSearch('')
    setCommentsList([...commentsList])
    setCurrentComment(null)
  }
    const memoAddNewComment = useMemo(() => {
        if (!currentComment) return <>
            <input className='w-full input-search-community' placeholder={'Написати коментар...'} value={valueSearch} onChange={onHedlerSearchValue} />
        </>

        return <div className="w-full flex flex-col items-start pt-[12px] pl-[16px] pb-[12px] pr-[16px] mt-[10px] gap-[12px] border-1 border-[var(--color-background-16)] rounded-[22px] bg-[var(--color-background-14)]">
            {currentComment.comments.map((el) => <div key={el._id} className="w-full flex flex-col items-start pt-[16px] pl-[24px] pb-[12px] pr-[24px] mt-[16px] gap-[12px] border-l-8 border-l-[var(--color-background-21)] rounded-[8px] bg-[var(--color-background-17)]">
                <div className='flex bg-[var(--color-background-18)] rounded-[20px] items-center gap-[12px] pr-[16px]'>
                    <img src={el.avatar} className='h-[36px]' alt="" />
                    <p className='text-[var(--color-background)] text-[16px]'>{el.name}</p>
                </div>
                <p className='text-[var(--color-background-25)] text-[14px]'>{el.text}</p>
            </div>)}
            <textarea className='w-full input-search-community-comment' placeholder={'Написати коментар...'} value={valueSearch} onChange={onHedlerSearchValue} />
            <div className="w-full flex justify-end mt-[6px] ">
                <button onClick={onCancel} className='px-[24px] py-[8px]  rounded-[20px] text-[16px] font-bold text-[var(--color-background-19)] cursor-not-allowed'>Відхилити</button>
                <button onClick={onPublick} className='px-[24px] py-[8px] bg-[var(--color-background-21)] rounded-[20px] text-[16px] font-bold text-[var(--color-night-background)] cursor-not-allowed'><span className="mt-[2px] flex">Опублікувати</span></button>
            </div>
        </div>
    }, [currentComment, postTypeSort, valueSearch]);





    if (!comment) return <h1 className='text-[32px] font-bold text-[var(--color-background)]'>Пост не знайдено</h1>
    return <div className="w-full flex flex-row gap-[24px]">
        <div className="w-[75%] flex flex-col gap-[8px] min-w-0 mb-[256px] justify-start">
            <p className="text-[32px] font-bold text-[var(--color-background)]">
                Cyberpunk 2077
            </p>


            <div className="w-full flex flex-col gap-[24px]">
                <GamePostCurrent {...comment} />
            </div>
            {/* comments add */}

            <div className="w-full flex flex-col mt-[12px]">
                <div className='flex items-center gap-[6px] relative'>
                    <p className='text-[var(--color-background-25)] text-[14px] cursor-pointer'>Сортування:</p>
                    <div className='search-select-g'>
                        <div className='flex items-center gap-[6px]'>
                            <p className='text-[var(--color-background)] text-[14px] cursor-pointer'>{postTypeSort.text}</p>
                            <svg className='mb-[5px]' width="12" height="7" viewBox="0 0 12 7" fill="none">
                                <path d="M6.01384 6.65464C5.81384 6.65464 5.51384 6.55464 5.31384 6.35464L0.313844 1.75464C-0.0861559 1.35464 -0.0861563 0.75464 0.213844 0.35464C0.613844 -0.04536 1.21384 -0.0453604 1.61384 0.25464L5.91384 4.25464L10.2138 0.25464C10.6138 -0.14536 11.2138 -0.04536 11.6138 0.35464C12.0138 0.75464 11.9138 1.35464 11.5138 1.75464L6.51384 6.35464C6.51384 6.55464 6.21384 6.65464 6.01384 6.65464Z" fill="#F1FDFF" />
                            </svg>
                        </div>
                        <div className='p-[10px] pl-[12px] pr-[12px] flex flex-col gap-[2px] search-select-c'>
                            {searchSelect.map(el => <p onClick={() => setPostTypeSort(el)} key={el.text} className={'p-[6px] pl-[12px] pr-[12px] rounded-[20px] text-[var(--color-background)] cursor-pointer ' + (el.text === postTypeSort.text ? 'bg-[var(--color-background-18)]' : '')}>{el.text}</p>)}
                        </div>
                    </div>
                </div>
                {memoAddNewComment}
            </div>

            {/* coments list */}

            {commentsList.map((el, i) => <GameComments key={el._id} {...el} onSelected={setCurrentComment} />)}



        </div>
        <div className="w-[25%] flex flex-col gap-[0px] min-w-[338px] mb-[256px]">
            <h2 className="text-[16px] font-bold text-[var(--color-background)] mb-[8px]">
                Якась гра, яка дуже всім сподобається
            </h2>
            <div className="w-full flex items-center justify-start mb-[20px]">
                <span className='text-[var(--color-background)] mr-[8px]'>10 000</span>
                <span className="text-[var(--color-background)] opacity-60 mr-[32px]">підписників</span>
                <span className='text-[var(--color-background)] mr-[6px]'>5 267</span>
                <div className='w-[8px] h-[8px] bg-[var(--color-background-10)] rounded-[100px]' ></div>
            </div>
            <div className="flex gap-[12px] mb-[32px] items-center">

                <div onClick={() => navigate({
                    to: '/$slug/community/createPost',
                    params: { slug },
                })} className="max-h-[48px] flex items-center rounded-[20px] gap-[12px] p-[16px] pl-[25px] pr-[25px] bg-[var(--color-background-21)] ">
                    <svg viewBox="0 0 16 16" width="16.000000" height="16.000000" fill="none">
                        <path id="Vector" d="M8 16C7.41463 16 7.02439 15.6098 7.02439 15.0244L7.02439 8.97561L0.97561 8.97561C0.390244 8.97561 0 8.58537 0 8C0 7.41463 0.390244 7.02439 0.97561 7.02439L7.02439 7.02439L7.02439 0.97561C7.02439 0.390244 7.41463 0 8 0C8.58537 0 8.97561 0.390244 8.97561 0.97561L8.97561 7.02439L15.0244 7.02439C15.6098 7.02439 16 7.41463 16 8C16 8.58537 15.6098 8.97561 15.0244 8.97561L8.97561 8.97561L8.97561 15.0244C8.97561 15.6098 8.58537 16 8 16Z" fill="rgb(0,19.8847,31.0698)" fillRule="nonzero" />
                    </svg>
                    <p className='text-[var(--color-night-background)] text-[20px]'>Створити пост</p>

                </div>

                <div className='w-[48px] h-[48px] bg-[var(--color-background-16)] rounded-[100px] flex items-center justify-center'>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" >
                        <path d="M4.87664 6.74052C5.37664 5.54052 6.17664 4.44052 7.27664 3.84052C7.77664 3.64052 7.97664 3.04052 7.67664 2.54052C7.37664 2.04052 6.77664 1.94052 6.27664 2.14052C4.77664 3.04052 3.67664 4.44052 3.07664 6.04052C2.87664 6.54052 3.07664 7.14052 3.57664 7.34052C4.07664 7.54052 4.67664 7.34052 4.87664 6.74052Z" fill="#F1FDFF" />
                        <path d="M13.8774 19.4412C13.3774 19.8412 12.6774 20.0412 11.9774 20.0412C11.2774 20.0412 10.5774 19.8412 10.0774 19.4412C9.67739 19.1412 8.97739 19.1412 8.67739 19.6412C8.37739 20.0412 8.37739 20.7412 8.87739 21.0412C9.67739 21.6412 10.7774 22.0412 11.9774 22.0412C13.1774 22.0412 14.2774 21.6412 15.0774 20.9412C15.4774 20.6412 15.5774 19.9412 15.2774 19.5412C14.8774 19.1412 14.2774 19.0412 13.8774 19.4412Z" fill="#F1FDFF" />
                        <path d="M19.3758 11.2412C19.3758 6.94121 16.1758 3.24121 11.9758 3.24121C7.87577 3.24121 4.67577 6.84121 4.67577 11.0412V13.0412C4.67577 14.2412 4.27577 15.1412 3.77577 15.8412C3.37577 16.3412 3.47577 16.9412 3.57577 17.3412C3.77577 17.7412 4.17577 18.3412 4.97577 18.3412H18.9758C19.7758 18.3412 20.1758 17.7412 20.3758 17.3412C20.5758 16.9412 20.5758 16.3412 20.2758 15.8412C19.7758 15.1412 19.3758 14.1412 19.3758 13.0412V11.2412ZM6.67577 11.1412C6.67577 7.84121 9.07577 5.24121 11.9758 5.24121C14.8758 5.24121 17.3758 7.84121 17.3758 11.2412V13.1412C17.3758 14.4412 17.7758 15.6412 18.2758 16.4412H5.77577C6.27577 15.5412 6.67577 14.4412 6.67577 13.1412" fill="#F1FDFF" />
                        <path d="M20.8762 6.04095C20.2762 4.34095 19.0762 3.04095 17.5762 2.14095C17.0762 1.84095 16.4763 2.04095 16.1763 2.54095C15.9763 3.04095 16.1763 3.64095 16.6763 3.94095C17.7763 4.54095 18.6762 5.54095 19.0762 6.74095C19.2762 7.24095 19.8762 7.54095 20.3762 7.34095C20.8762 7.14095 21.0762 6.54095 20.8762 6.04095Z" fill="#F1FDFF" />
                    </svg>
                </div>

                <div className='w-[48px] h-[48px] bg-[var(--color-background-16)] rounded-[100px] flex items-center justify-center'>
                    <svg width="18" height="4" viewBox="0 0 18 4" fill="none">
                        <path d="M4 2C4 3.10457 3.10457 4 2 4C0.895431 4 0 3.10457 0 2C0 0.895431 0.895431 0 2 0C3.10457 0 4 0.895431 4 2Z" fill="#F1FDFF" />
                        <path d="M9 4C10.1046 4 11 3.10457 11 2C11 0.895431 10.1046 0 9 0C7.89543 0 7 0.895431 7 2C7 3.10457 7.89543 4 9 4Z" fill="#F1FDFF" />
                        <path d="M16 4C17.1046 4 18 3.10457 18 2C18 0.895431 17.1046 0 16 0C14.8954 0 14 0.895431 14 2C14 3.10457 14.8954 4 16 4Z" fill="#F1FDFF" />
                    </svg>

                </div>

            </div>

            <div className='w-full flex flex-col gap-[8px]'>
                {posts.filter(elem => elem.isComment && elem._id !== id).slice(4).map((el, i) => <GamePost key={el._id} {...el} isNext={true} isHidUser={true} />)}
            </div>
        </div>
    </div>
}

//  <GamePost key={i + el.name} {...el} isNext={true} />