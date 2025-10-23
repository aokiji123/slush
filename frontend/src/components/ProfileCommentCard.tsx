interface ProfileCommentCardProps {
  comment: {
    id: string
    username: string
    avatar: string
    content: string
    createdAt: string
  }
  onDelete?: () => void
  canDelete?: boolean
}

export const ProfileCommentCard = ({ comment, onDelete, canDelete }: ProfileCommentCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-[var(--color-background-15)] rounded-[20px] p-[20px] mb-[16px]">
      <div className="flex items-start gap-[16px]">
        <img
          src={comment.avatar}
          alt={comment.username}
          className="w-[44px] h-[44px] rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-[8px]">
            <div className="flex items-center gap-[12px]">
              <h4 className="text-[16px] font-bold text-[var(--color-background)]">
                {comment.username}
              </h4>
              <span className="text-[14px] text-[var(--color-background-25)] opacity-65">
                {formatDate(comment.createdAt)}
              </span>
            </div>
            {canDelete && onDelete && (
              <button
                onClick={onDelete}
                className="text-[var(--color-background-25)] hover:text-[var(--color-background)] transition-colors"
                title="Видалити коментар"
              >
                ✕
              </button>
            )}
          </div>
          <p className="text-[16px] text-[var(--color-background)] leading-[1.5]">
            {comment.content}
          </p>
        </div>
      </div>
    </div>
  )
}
