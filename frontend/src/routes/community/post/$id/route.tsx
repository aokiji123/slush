import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useEffect } from 'react'
import { usePostById } from '@/api/queries/useCommunity'

export const Route = createFileRoute('/community/post/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { id } = useParams({ from: '/community/post/$id' })

  // Get post data to extract gameId
  const { data: post, isLoading: postLoading, error: postError } = usePostById(id)

  // Redirect to the correct game-specific community post URL
  useEffect(() => {
    if (post && post.gameId) {
      navigate({
        to: '/$slug/community/post/$id',
        params: {
          slug: post.gameId,
          id: id,
        },
        replace: true,
      })
    }
  }, [post, id, navigate])

  if (postLoading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="text-[#f1fdff]">Завантаження поста...</div>
      </div>
    )
  }

  if (postError || !post) {
    return (
      <div className="w-full flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-red-400">Помилка завантаження поста</div>
        <button
          onClick={() => navigate({ to: '/community' })}
          className="px-4 py-2 bg-[#24e5c2] text-[#00141f] rounded-[20px] hover:bg-[#1fd1a8] transition-colors"
        >
          Повернутися до спільноти
        </button>
      </div>
    )
  }

  return (
    <div className="w-full flex justify-center items-center h-64">
      <div className="text-[#f1fdff]">Перенаправлення...</div>
    </div>
  )
}