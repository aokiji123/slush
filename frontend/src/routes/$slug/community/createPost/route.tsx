import { DescriptionPole } from '@/components/poleInput/DescriptionPole'
import { FilePole } from '@/components/poleInput/FilePole'
import { TextPole } from '@/components/poleInput/TextPole'
import { TitlePole } from '@/components/poleInput/TitlePole'
import { useNavigate, useParams } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState, type ChangeEvent } from 'react'

export const Route = createFileRoute('/$slug/community/createPost')({
  component: RouteComponent,
})

// const typePosts = [
//   "Обговорення",
//   "Скріншот",
//   "Відео",
//   "Гайд"
// ]
const typePosts = [
  {
    type: "Обговорення",
    title: { placeholder: "Тема вашого обговорення...", title: "Заголовок", limitSymbol: 160 },
    text: { placeholder: "Що ви хочете обговорити?", title: "Текст" },
    file: { placeholder: null, title: null },
  },
  {
    type: "Скріншот",
    title: { placeholder: "Ваш коментар до скріншота...", title: "Підпис", limitSymbol: null },
    file: { placeholder: null, title: null },
  },
  {
    type: "Відео",
    title: { placeholder: "Ваш коментар до відео...", title: "Підпис", limitSymbol: null },
    file: { placeholder: null, title: null },
  },
  {
    type: "Гайд",
    title: { placeholder: "Про що ваш гайд?", title: "Заголовок", limitSymbol: 160 },
    description: { placeholder: "Опишіть тему детальніше...", title: "Опис", limitSymbol: 300 },
    text: { placeholder: "Текст вашого гайду...", title: "Текст" },
    file: { placeholder: null, title: 'Обкладинка' },
  }
]

const rools = [
  "Публікуйте тільки оригінальний контент.",
  "Не допускайте образ та принижень на адресу інших гравців, розробників чи груп.",
  "Не включайте погрози або заохочення до заподіяння шкоди.",
  "Не завантажуйте контент, на який у вас немає прав.",
  "Не рекламуйте комерційний контент",
  "Переконайтеся, що контент, який ви публікуєте, відповідає місцю, де він розміщується.",
]




// title subscribe
//b text filed

function RouteComponent() {
  const [typePost, setTypePost] = useState(typePosts[0]);
  const { slug } = useParams({ from: '/$slug/community' });
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState('');
  const navigate = useNavigate()

  const onCancel = () => {
    navigate({
      to: '/$slug/community',
      params: { slug },
    })
    setTitle('')
    setText('')
    setFile('')
  }
  const onPublick = () => {
     navigate({
      to: '/$slug/community',
      params: { slug },
    })
    setTitle('')
    setText('')
    setFile('')
  }

  const momeComponents = useMemo(() => {
    switch (typePost.type) {
      case 'Обговорення': return <>
        <TitlePole
          classTitle=''
          classInput='p-[12px] rounded-[12px] bg-[var(--color-background-15)] text-[var(--color-background)]'
          limitSymbol={typePost.title.limitSymbol}
          onChange={setTitle}
          placeholder={typePost.title.placeholder}
          title={typePost.title.title}
          value={title}
        />
        <TextPole
          classContainer='mt-[12px]'
          classTitle=''
          classInput='p-[12px] rounded-[12px] bg-[var(--color-background-15)] text-[var(--color-background)]'
          onChange={setText}
          placeholder={typePost.text?.placeholder || ''}
          title={typePost.text?.title || ''}
          value={text}
        />
        <FilePole
          classContainer='mt-[12px]'
          classTitle=''
          onChange={setFile}
          title={typePost.file?.title || ''}
          value={file}
        />
      </>
      case 'Скріншот': return <>
        <FilePole
          classContainer='mt-[12px]'
          classTitle=''
          onChange={setFile}
          title={typePost.file?.title || ''}
          value={file}
        />
        <TitlePole
          classTitle='mt-[12px]'
          classInput='p-[12px] rounded-[12px] bg-[var(--color-background-15)] text-[var(--color-background)]'
          limitSymbol={typePost.title.limitSymbol}
          onChange={setTitle}
          placeholder={typePost.title.placeholder}
          title={typePost.title.title}
          value={title}
        />
      </>
      case 'Відео': return <>
        <FilePole
          classContainer='mt-[12px]'
          classTitle=''
          onChange={setFile}
          title={typePost.file?.title || ''}
          value={file}
        />
        <TitlePole
          classTitle='mt-[12px]'
          classInput='p-[12px] rounded-[12px] bg-[var(--color-background-15)] text-[var(--color-background)]'
          limitSymbol={typePost.title.limitSymbol}
          onChange={setTitle}
          placeholder={typePost.title.placeholder}
          title={typePost.title.title}
          value={title}
        />
      </>
      case 'Гайд': return <>
        <div className="w-full flex flex-row gap-[12px]">
          <div className="w-[50%] flex flex-col gap-[8px]">
            <FilePole
              // classContainer='mt-[12px]'
              classTitle=''
              onChange={setFile}
              title={typePost.file?.title || ''}
              value={file}
            />
          </div>
          <div className="w-[50%] flex flex-col gap-[12px]">
            <DescriptionPole
              classTitle=''
              classInput='p-[12px] h-[72px] rounded-[12px] bg-[var(--color-background-15)] text-[var(--color-background)]'
              limitSymbol={typePost.title.limitSymbol}
              onChange={setTitle}
              placeholder={typePost.title.placeholder}
              title={typePost.title.title}
              value={title}
            />
            <DescriptionPole
              classContainer=''
              classTitle=''
              classInput='h-[188px] p-[12px] rounded-[12px] bg-[var(--color-background-15)] text-[var(--color-background)]'
              onChange={setText}
              placeholder={typePost.description?.placeholder || ''}
              title={typePost.description?.title || ''}
              value={text}
              limitSymbol={typePost.description?.limitSymbol || null}
            />
          </div>
        </div>
        <TextPole
          classContainer='mt-[12px]'
          classTitle=''
          classInput='p-[12px] rounded-[12px] bg-[var(--color-background-15)] text-[var(--color-background)]'
          onChange={setText}
          placeholder={typePost.text?.placeholder || ''}
          title={typePost.text?.title || ''}
          value={text}
        />

      </>
      default: return null
    }
  }, [typePost, title, text, file])





  return <div className="w-full items-start flex flex-row gap-[24px]">
    <div className="w-[75%] flex flex-col gap-[8px] min-w-0 mb-[256px] justify-center">
      <h1 className='text-[32px] font-bold text-[var(--color-background)] mb-[20px]' >Створення поста</h1>
      <div className="rounded-[12px] w-full p-[12px] bg-[var(--color-background-15)] pb-[20px]">
        <div className='w-full flex gap-[20px] mb-[20px]'>
          {typePosts.map((el) => <div className={'type-create-text-btn cursor-pointer p-[8px] rounded-[12px] text-[18px] text-[var(--color-background)] ' + (typePost.type === el.type ? 'active' : '')} onClick={() => setTypePost(el)} key={el.type + el.title}>{el.type}</div>)}
        </div>
        {momeComponents}
        <div className="w-full flex justify-end mt-[20px] ">
          <button onClick={onCancel} className='px-[24px] py-[8px]  rounded-[20px] text-[16px] font-bold text-[var(--color-background-19)] cursor-not-allowed'>Відхилити</button>
          <button onClick={onPublick} className='px-[24px] py-[8px] bg-[var(--color-background-21)] rounded-[20px] text-[16px] font-bold text-[var(--color-night-background)] cursor-not-allowed'><span className="mt-[2px] flex">Опублікувати</span></button>
        </div>
      </div>



    </div>
    <div className="w-[25%] flex flex-col min-w-[338px] mb-[256px]">
      <h2 className='mt-[6px] text-[16px] font-bold text-[var(--color-background)] mb-[6px]' >Якась гра, яка дуже всім сподобається</h2>
      <div className="w-full flex items-center justify-start mb-[20px]">
        <span className='text-[var(--color-background)] mr-[8px]'>10 000</span>
        <span className="text-[var(--color-background)] opacity-60 mr-[32px]">підписників</span>
        <span className='text-[var(--color-background)] mr-[6px]'>5 267</span>
        <div className='w-[8px] h-[8px] bg-[var(--color-background-10)] rounded-[100px]' ></div>
      </div>
      <h1 className='text-[20px] font-bold text-[var(--color-background)] mb-[14px]' >Правила спільноти</h1>

      <div className='w-full p-[16px] bg-[var(--color-background-24)] rounded-[20px]'>
        <ol className='list-rool-c'>
          {rools.map((el, i) => <>
            <li className='ml-[16px] w-full text-[var(--color-background)] opacity-80' key={el + i}>{el}</li>
            {i + 1 !== rools.length && <div className='list-rool-line'></div>}
          </>)}
        </ol>
      </div>
    </div>
  </div>
}
