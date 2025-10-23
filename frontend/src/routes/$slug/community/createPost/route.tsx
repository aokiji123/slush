import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useMemo, useState, useEffect } from 'react'
import { DescriptionPole } from '@/components/poleInput/DescriptionPole'
import { FilePole } from '@/components/poleInput/FilePole'
import { TextPole } from '@/components/poleInput/TextPole'
import { TitlePole } from '@/components/poleInput/TitlePole'
import { useCreatePost, useUploadMedia } from '@/api/queries/useCommunity'
import { useGameById } from '@/api/queries/useGame'
import { PostType, type CreatePostDto } from '@/types/community'

export const Route = createFileRoute('/$slug/community/createPost')({
  component: RouteComponent,
})

const typePosts = [
  {
    type: 'Обговорення',
    postType: PostType.Discussion,
    title: {
      placeholder: 'Тема вашого обговорення...',
      title: 'Заголовок',
      limitSymbol: 160,
    },
    text: { placeholder: 'Що ви хочете обговорити?', title: 'Текст' },
    file: { placeholder: null, title: null },
  },
  {
    type: 'Скріншот',
    postType: PostType.Screenshot,
    title: {
      placeholder: 'Ваш коментар до скріншота...',
      title: 'Підпис',
      limitSymbol: null,
    },
    file: { placeholder: null, title: null },
  },
  {
    type: 'Відео',
    postType: PostType.Video,
    title: {
      placeholder: 'Ваш коментар до відео...',
      title: 'Підпис',
      limitSymbol: null,
    },
    file: { placeholder: null, title: null },
  },
  {
    type: 'Гайд',
    postType: PostType.Guide,
    title: {
      placeholder: 'Про що ваш гайд?',
      title: 'Заголовок',
      limitSymbol: 160,
    },
    description: {
      placeholder: 'Опишіть тему детальніше...',
      title: 'Опис',
      limitSymbol: 300,
    },
    text: { placeholder: 'Текст вашого гайду...', title: 'Текст' },
    file: { placeholder: null, title: 'Обкладинка' },
  },
  {
    type: 'Новини',
    postType: PostType.News,
    title: {
      placeholder: 'Заголовок новини...',
      title: 'Заголовок',
      limitSymbol: 160,
    },
    text: { placeholder: 'Опишіть новину...', title: 'Текст' },
    file: { placeholder: null, title: 'Зображення' },
  },
]

const rools = [
  'Публікуйте тільки оригінальний контент.',
  'Не допускайте образ та принижень на адресу інших гравців, розробників чи груп.',
  'Не включайте погрози або заохочення до заподіяння шкоди.',
  'Не завантажуйте контент, на який у вас немає прав.',
  'Не рекламуйте комерційний контент',
  'Переконайтеся, що контент, який ви публікуєте, відповідає місцю, де він розміщується.',
]

function RouteComponent() {
  const [typePost, setTypePost] = useState(typePosts[0])
  const { slug } = useParams({ from: '/$slug/community' })
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [fileType, setFileType] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // Get game data
  const { data: game, isLoading: gameLoading } = useGameById(slug)
  
  // Mutations
  const createPostMutation = useCreatePost()
  const uploadMediaMutation = useUploadMedia()

  const onCancel = () => {
    navigate({
      to: '/$slug/community',
      params: { slug },
    })
    setTitle('')
    setText('')
    setDescription('')
    setFile(null)
    setFilePreview(null)
    setFileType(null)
    setError(null)
  }

  const handleFileChange = (file: File) => {
    setFile(file)
    setFileType(file.type)
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setFilePreview(previewUrl)
  }

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview)
      }
    }
  }, [filePreview])

  const onPublish = async () => {
    if (!game?.data?.id) {
      setError('Гра не знайдена')
      return
    }

    if (!title.trim() && !text.trim() && !description.trim()) {
      setError('Заповніть хоча б одне поле')
      return
    }

    // Validate file if provided
    if (file) {
      const maxSize = 10 * 1024 * 1024 // 10MB
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      const allowedVideoTypes = ['video/mp4', 'video/webm']
      const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes]
      
      if (file.size > maxSize) {
        setError('Розмір файлу не повинен перевищувати 10MB')
        return
      }
      
      if (!allowedTypes.includes(file.type)) {
        setError('Дозволені типи файлів: JPG, PNG, GIF, WEBP, MP4, WEBM')
        return
      }
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Prepare post data
      const postData: CreatePostDto = {
        title: title.trim(),
        content: typePost.postType === PostType.Guide 
          ? `${description.trim()}\n\n${text.trim()}`.trim()
          : text.trim(),
        type: typePost.postType,
      }

      // Create the post first
      const createdPost = await createPostMutation.mutateAsync({
        gameId: game.data.id,
        dto: postData,
      })

      console.log('Created post response:', createdPost)

      // Check if createdPost has the expected structure
      if (!createdPost || !createdPost.id) {
        throw new Error('Invalid response from server: missing post ID')
      }

      // Upload media if provided
      if (file) {
        try {
          console.log('Uploading file:', {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
          })
          
          await uploadMediaMutation.mutateAsync({
            postId: createdPost.id,
            file: file,
          })
          
          console.log('Media uploaded successfully')
        } catch (uploadError: any) {
          console.error('Failed to upload media:', uploadError)
          console.error('Upload error details:', {
            status: uploadError?.response?.status,
            data: uploadError?.response?.data,
            message: uploadError?.message
          })
          
          // Don't fail the entire operation if media upload fails
          setError(`Пост створено, але не вдалося завантажити медіа: ${uploadError?.response?.data?.message || uploadError?.message || 'Невідома помилка'}`)
        }
      }

      // Navigate back to community
      navigate({
        to: '/$slug/community',
        params: { slug },
      })
    } catch (error: any) {
      console.error('Failed to create post:', error)
      setError(error?.message || error?.response?.data?.message || 'Помилка створення поста')
    } finally {
      setIsSubmitting(false)
    }
  }

  const momeComponents = useMemo(() => {
    switch (typePost.type) {
      case 'Обговорення':
        return (
          <>
            <TitlePole
              classTitle=""
              classInput="p-[12px] rounded-[12px] bg-[var(--color-background-15)] text-[var(--color-background)]"
              limitSymbol={typePost.title.limitSymbol}
              onChange={setTitle}
              placeholder={typePost.title.placeholder}
              title={typePost.title.title}
              value={title}
            />
            <TextPole
              classContainer="mt-[12px]"
              classTitle=""
              classInput="p-[12px] rounded-[12px] bg-[var(--color-background-15)] text-[var(--color-background)]"
              onChange={setText}
              placeholder={typePost.text?.placeholder || ''}
              title={typePost.text?.title || ''}
              value={text}
            />
            <FilePole
              classContainer="mt-[12px]"
              classTitle=""
              onFileChange={handleFileChange}
              onChange={() => {}} // Dummy function for compatibility
              title={`${typePost.file.title || ''} (JPG, PNG, GIF, WEBP, MP4, WEBM, макс. 10MB)`}
              value={filePreview || ''}
              accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm"
              fileType={fileType || undefined}
            />
          </>
        )
      case 'Скріншот':
        return (
          <>
            <FilePole
              classContainer="mt-[12px]"
              classTitle=""
              onFileChange={handleFileChange}
              onChange={() => {}} // Dummy function for compatibility
              title={`${typePost.file.title || ''} (JPG, PNG, GIF, WEBP, MP4, WEBM, макс. 10MB)`}
              value={filePreview || ''}
              accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm"
              fileType={fileType || undefined}
            />
            <TitlePole
              classTitle="mt-[12px]"
              classInput="p-[12px] rounded-[12px] bg-[var(--color-background-15)] text-[var(--color-background)]"
              limitSymbol={typePost.title.limitSymbol}
              onChange={setTitle}
              placeholder={typePost.title.placeholder}
              title={typePost.title.title}
              value={title}
            />
          </>
        )
      case 'Відео':
        return (
          <>
            <FilePole
              classContainer="mt-[12px]"
              classTitle=""
              onFileChange={handleFileChange}
              onChange={() => {}} // Dummy function for compatibility
              title={`${typePost.file.title || ''} (JPG, PNG, GIF, WEBP, MP4, WEBM, макс. 10MB)`}
              value={filePreview || ''}
              accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm"
              fileType={fileType || undefined}
            />
            <TitlePole
              classTitle="mt-[12px]"
              classInput="p-[12px] rounded-[12px] bg-[var(--color-background-15)] text-[var(--color-background)]"
              limitSymbol={typePost.title.limitSymbol}
              onChange={setTitle}
              placeholder={typePost.title.placeholder}
              title={typePost.title.title}
              value={title}
            />
          </>
        )
      case 'Гайд':
        return (
          <>
            <div className="w-full flex flex-row gap-[12px]">
              <div className="w-[50%] flex flex-col gap-[8px]">
                <FilePole
                  classContainer=""
                  classTitle=""
                  onFileChange={handleFileChange}
                  onChange={() => {}} // Dummy function for compatibility
                  title={`${typePost.file.title || ''} (JPG, PNG, GIF, WEBP, MP4, WEBM, макс. 10MB)`}
                  value={filePreview || ''}
                  accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm"
                />
              </div>
              <div className="w-[50%] flex flex-col gap-[12px]">
                <DescriptionPole
                  classTitle=""
                  classInput="p-[12px] h-[72px] rounded-[12px] bg-[var(--color-background-15)] text-[var(--color-background)]"
                  limitSymbol={typePost.title.limitSymbol}
                  onChange={setTitle}
                  placeholder={typePost.title.placeholder}
                  title={typePost.title.title}
                  value={title}
                />
                <DescriptionPole
                  classContainer=""
                  classTitle=""
                  classInput="h-[188px] p-[12px] rounded-[12px] bg-[var(--color-background-15)] text-[var(--color-background)]"
                  onChange={setDescription}
                  placeholder={typePost.description?.placeholder || ''}
                  title={typePost.description?.title || ''}
                  value={description}
                  limitSymbol={typePost.description?.limitSymbol}
                />
              </div>
            </div>
            <TextPole
              classContainer="mt-[12px]"
              classTitle=""
              classInput="p-[12px] rounded-[12px] bg-[var(--color-background-15)] text-[var(--color-background)]"
              onChange={setText}
              placeholder={typePost.text?.placeholder || ''}
              title={typePost.text?.title || ''}
              value={text}
            />
          </>
        )
      default:
        return null
    }
  }, [typePost, title, text, description, file])

  return (
    <div className="w-full items-start flex flex-row gap-[24px]">
      <div className="w-[75%] flex flex-col gap-[8px] min-w-0 mb-[256px] justify-center">
        <h1 className="text-[32px] font-bold text-[var(--color-background)] mb-[20px]">
          Створення поста
        </h1>
        <div className="rounded-[12px] w-full p-[12px] bg-[var(--color-background-15)] pb-[20px]">
          <div className="w-full flex gap-[20px] mb-[20px]">
            {typePosts.map((el) => (
              <div
                className={
                  'type-create-text-btn cursor-pointer p-[8px] rounded-[12px] text-[18px] text-[var(--color-background)] ' +
                  (typePost.type === el.type ? 'active' : '')
                }
                onClick={() => setTypePost(el)}
                key={el.type + el.title}
              >
                {el.type}
              </div>
            ))}
          </div>
          {momeComponents}
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-[12px] text-red-300 text-[14px]">
              {error}
            </div>
          )}
          
          <div className="w-full flex justify-end mt-[20px] gap-3">
            <button
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-[24px] py-[8px] rounded-[20px] text-[16px] font-bold text-[#f1fdff] hover:text-[#24e5c2] transition-colors disabled:opacity-50"
            >
              Відхилити
            </button>
            <button
              onClick={onPublish}
              disabled={isSubmitting || (!title.trim() && !text.trim())}
              className="px-[24px] py-[8px] bg-[#24e5c2] rounded-[20px] text-[16px] font-bold text-[#00141f] hover:bg-[#1fd1a8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="mt-[2px] flex">
                {isSubmitting ? 'Публікація...' : 'Опублікувати'}
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="w-[25%] flex flex-col min-w-[338px] mb-[256px]">
        {gameLoading ? (
          <div className="text-[#f1fdff]">Завантаження...</div>
        ) : game?.data ? (
          <>
            <h2 className="mt-[6px] text-[16px] font-bold text-[#f1fdff] mb-[6px]">
              {game.data.name}
            </h2>
            <div className="w-full flex items-center justify-start mb-[20px]">
              <span className="text-[#f1fdff] mr-[8px]">
                10 000
              </span>
              <span className="text-[#f1fdff] opacity-60 mr-[32px]">
                підписників
              </span>
              <span className="text-[#f1fdff] mr-[6px]">5 267</span>
              <div className="w-[8px] h-[8px] bg-[#24e5c2] rounded-[100px]"></div>
            </div>
          </>
        ) : (
          <div className="text-[#f1fdff] opacity-60">Гра не знайдена</div>
        )}
        <h1 className="text-[20px] font-bold text-[var(--color-background)] mb-[14px]">
          Правила спільноти
        </h1>

        <div className="w-full p-[16px] bg-[var(--color-background-24)] rounded-[20px]">
          <ol className="list-rool-c">
            {rools.map((el, i) => (
              <>
                <li
                  className="ml-[16px] w-full text-[var(--color-background)] opacity-80"
                  key={el + i}
                >
                  {el}
                </li>
                {i + 1 !== rools.length && (
                  <div className="list-rool-line"></div>
                )}
              </>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
