import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { usePost, usePostComments, useCreateComment, useLikeComment, useUnlikeComment, useGamePosts } from '@/api/queries/useCommunity'
import { useAuthState } from '@/api/queries/useAuth'
import { CommunityPostCard } from '@/components/CommunityPostCard'
import { FavoriteIcon, FavoriteFilledIcon, ReplyIcon } from '@/icons'
import type { CreateCommentDto, CommentDto } from '@/types/community'

export const Route = createFileRoute('/$slug/community/post/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { slug, id } = useParams({ from: '/$slug/community/post/$id' })
  const { user } = useAuthState()
  const [commentText, setCommentText] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set())
  const [commentLikesCount, setCommentLikesCount] = useState<Record<string, number>>({})
  const [collapsedComments, setCollapsedComments] = useState<Set<string>>(new Set())
  const [commentSortBy, setCommentSortBy] = useState<'newest' | 'likes'>('newest')
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)

  // Get post data
  const { data: post, isLoading: postLoading, error: postError } = usePost(slug, id)
  
  // Get comments data
  const { data: comments, isLoading: commentsLoading } = usePostComments(id)
  
  // Get related discussions
  const { data: relatedPosts, isLoading: relatedPostsLoading } = useGamePosts(
    post?.gameId || '',
    { type: 0, sortBy: 'popular' } // Discussion type, popular sort
  )
  
  // Mutations
  const createCommentMutation = useCreateComment()
  const likeCommentMutation = useLikeComment()
  const unlikeCommentMutation = useUnlikeComment()

  const handleBackToCommunity = () => {
    navigate({
      to: '/$slug/community',
      params: { slug },
    })
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || !user) return

    setIsSubmittingComment(true)
    try {
      const dto: CreateCommentDto = {
        content: commentText.trim(),
      }
      await createCommentMutation.mutateAsync({ postId: id, dto })
      setCommentText('')
    } catch (error) {
      console.error('Failed to create comment:', error)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleLikeComment = async (commentId: string) => {
    if (!user) return

    const wasLiked = likedComments.has(commentId)
    const previousLikesCount = commentLikesCount[commentId] || comments?.find(c => c.id === commentId)?.likesCount || 0

    // Optimistic update
    setLikedComments(prev => {
      const newSet = new Set(prev)
      if (wasLiked) {
        newSet.delete(commentId)
      } else {
        newSet.add(commentId)
      }
      return newSet
    })
    
    setCommentLikesCount(prev => ({
      ...prev,
      [commentId]: wasLiked ? previousLikesCount - 1 : previousLikesCount + 1
    }))

    try {
      if (wasLiked) {
        await unlikeCommentMutation.mutateAsync(commentId)
      } else {
        await likeCommentMutation.mutateAsync(commentId)
      }
    } catch (error) {
      // Revert optimistic update on error
      setLikedComments(prev => {
        const newSet = new Set(prev)
        if (wasLiked) {
          newSet.add(commentId)
        } else {
          newSet.delete(commentId)
        }
        return newSet
      })
      
      setCommentLikesCount(prev => ({
        ...prev,
        [commentId]: previousLikesCount
      }))
      
      console.error('Failed to toggle comment like:', error)
    }
  }

  const handleReplyToComment = (commentId: string) => {
    setReplyingTo(commentId)
    setReplyText('')
  }

  const handleCancelReply = () => {
    setReplyingTo(null)
    setReplyText('')
  }

  const toggleRepliesCollapse = (commentId: string) => {
    setCollapsedComments(prev => {
      const newSet = new Set(prev)
      if (newSet.has(commentId)) {
        newSet.delete(commentId)
      } else {
        newSet.add(commentId)
      }
      return newSet
    })
  }

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || !user || !replyingTo) return

    setIsSubmittingComment(true)
    try {
      const dto: CreateCommentDto = {
        content: replyText.trim(),
        parentCommentId: replyingTo,
      }
      await createCommentMutation.mutateAsync({ postId: id, dto })
      setReplyText('')
      setReplyingTo(null)
    } catch (error) {
      console.error('Failed to create reply:', error)
    } finally {
      setIsSubmittingComment(false)
    }
  }


  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  // Load sort preference from localStorage
  useEffect(() => {
    const savedSort = localStorage.getItem('commentSortBy') as 'newest' | 'likes' | null
    if (savedSort) {
      setCommentSortBy(savedSort)
    }
  }, [])

  // Save sort preference to localStorage
  useEffect(() => {
    localStorage.setItem('commentSortBy', commentSortBy)
  }, [commentSortBy])

  // Click outside handler for sort dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSortDropdownOpen && !(event.target as Element).closest('.sort-dropdown')) {
        setIsSortDropdownOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isSortDropdownOpen])

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
          onClick={handleBackToCommunity}
          className="px-4 py-2 bg-[#24e5c2] text-[#00141f] rounded-[20px] hover:bg-[#1fd1a8] transition-colors"
        >
          Повернутися до спільноти
        </button>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-row gap-[24px]">
      {/* Left Column - Main Content */}
      <div className="w-[1092px] flex flex-col gap-[24px]">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[16px]">
            <button
              onClick={handleBackToCommunity}
              className="p-[8px] hover:bg-[rgba(55,195,255,0.12)] rounded-full transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 12H5M12 19l-7-7 7-7"
                  stroke="#F1FDFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="flex items-center gap-[16px]">
              <button
                onClick={() => navigate({
                  to: '/profile/$nickname',
                  params: { nickname: post.authorUsername ?? 'unknown' }
                })}
                className="bg-[#004252] rounded-[24px] flex items-center gap-[12px] pr-[16px] hover:bg-[#005a6b] transition-colors cursor-pointer"
              >
                <img
                  src={post.authorAvatar ?? '/avatar.png'}
                  alt={post.authorUsername ?? 'User'}
                  className="w-[48px] h-[48px] rounded-full"
                />
                <span className="text-[20px] font-bold text-[#f1fdff] font-artifakt">
                  {post.authorUsername ?? 'Unknown User'}
                </span>
              </button>
              <span className="text-[14px] text-[rgba(204,248,255,0.65)] font-artifakt">
                {formatDate(post.createdAt)}
              </span>
            </div>
          </div>
          
          <button className="p-[8px] hover:bg-[rgba(55,195,255,0.12)] rounded-full transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                fill="#F1FDFF"
              />
              <path
                d="M19 14C20.1046 14 21 13.1046 21 12C21 10.8954 20.1046 10 19 10C17.8954 10 17 10.8954 17 12C17 13.1046 17.8954 14 19 14Z"
                fill="#F1FDFF"
              />
              <path
                d="M5 14C6.10457 14 7 13.1046 7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12C3 13.1046 3.89543 14 5 14Z"
                fill="#F1FDFF"
              />
            </svg>
          </button>
        </div>

        {/* Post Content - Using CommunityPostCard */}
        <CommunityPostCard post={post} slug={slug} />

        {/* Comments Section */}
        <div className="flex flex-col gap-[16px]">
          {/* Sort + Input Row */}
          <div className="flex flex-col gap-[12px]">
            <div className="flex gap-[10px] items-center">
              <span className="text-[16px] text-[rgba(204,248,255,0.65)] font-artifakt">
                Сортування:
              </span>
              <div className="relative sort-dropdown">
                <button 
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className="flex items-center gap-[2px] text-[#f1fdff] text-[16px] font-artifakt font-medium hover:text-[#37c3ff] transition-colors"
                >
                  <span>{commentSortBy === 'newest' ? 'Спочатку нові' : 'За оцінкою'}</span>
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none"
                    className={`transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`}
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {isSortDropdownOpen && (
                  <div className="absolute top-full mt-[4px] left-0 bg-[#004252] border border-[#046075] rounded-[8px] p-[12px] flex flex-col gap-[2px] min-w-[200px] z-10">
                    <button
                      onClick={() => {
                        setCommentSortBy('newest')
                        setIsSortDropdownOpen(false)
                      }}
                      className={`px-[12px] py-[6px] rounded-[20px] text-[16px] text-[#f1fdff] font-artifakt text-left transition-colors ${
                        commentSortBy === 'newest' ? 'bg-[rgba(55,195,255,0.25)]' : 'hover:bg-[rgba(55,195,255,0.15)]'
                      }`}
                    >
                      Спочатку нові
                    </button>
                    <button
                      onClick={() => {
                        setCommentSortBy('likes')
                        setIsSortDropdownOpen(false)
                      }}
                      className={`px-[12px] py-[6px] rounded-[20px] text-[16px] text-[#f1fdff] font-artifakt text-left transition-colors ${
                        commentSortBy === 'likes' ? 'bg-[rgba(55,195,255,0.25)]' : 'hover:bg-[rgba(55,195,255,0.15)]'
                      }`}
                    >
                      За оцінкою
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Comment Input */}
            <div className="bg-[rgba(0,20,31,0.4)] border border-[#046075] rounded-[22px] px-[16px] py-[12px] flex flex-col gap-[8px]">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Написати коментар..."
                className="flex-1 bg-transparent text-[#f1fdff] placeholder-[rgba(204,248,255,0.65)] text-[16px] font-artifakt outline-none resize-none min-h-[44px] max-h-[180px]"
                rows={3}
              />
              {commentText.trim() && (
                <div className="flex gap-[12px] items-center justify-end">
                  <button
                    onClick={() => setCommentText('')}
                    className="px-[8px] py-[8px] text-[#ffa599] text-[16px] font-artifakt font-medium"
                  >
                    Відхилити
                  </button>
                  <button
                    onClick={handleSubmitComment}
                    disabled={isSubmittingComment}
                    className="bg-[#24e5c2] text-[#00141f] rounded-[20px] px-[20px] py-[8px] h-[40px] text-[16px] font-artifakt font-medium disabled:opacity-50"
                  >
                    {isSubmittingComment ? 'Відправка...' : 'Надіслати'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Reply Input Area */}
          {replyingTo && (
            <div className="bg-[rgba(0,20,31,0.4)] border border-[#046075] rounded-[22px] px-[16px] py-[12px] flex flex-col gap-[8px]">
              {/* Quoted Comment */}
              <div className="bg-[rgba(55,195,255,0.12)] border-l-[8px] border-[#24e5c2] rounded-[8px] rounded-l-[8px] rounded-r-[12px] p-[24px]">
                <div className="bg-[rgba(55,195,255,0.25)] rounded-[20px] flex items-center gap-[12px] pr-[16px] w-fit mb-[12px]">
                  <img
                    src={user?.avatar || '/avatar.png'}
                    alt={user?.username || 'User'}
                    className="w-[36px] h-[36px] rounded-full"
                  />
                  <span className="text-[16px] font-bold text-[#f1fdff] font-artifakt">
                    {user?.username || 'Unknown User'}
                  </span>
                </div>
                <p className="text-[16px] text-[rgba(204,248,255,0.65)] font-artifakt leading-[1.5]">
                  {comments?.find(c => c.id === replyingTo)?.content || 'Коментар...'}
                </p>
              </div>
              
              {/* Reply Textarea */}
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Написати відповідь..."
                className="bg-transparent text-[#f1fdff] placeholder-[rgba(204,248,255,0.65)] text-[16px] font-artifakt outline-none resize-none min-h-[44px] max-h-[180px]"
                rows={3}
              />
              
              {/* Reply Action Buttons */}
              <div className="flex gap-[12px] items-center justify-end">
                <button
                  onClick={handleCancelReply}
                  className="px-[8px] py-[8px] text-[#ffa599] text-[16px] font-artifakt font-medium"
                >
                  Відхилити
                </button>
                <button
                  onClick={handleSubmitReply}
                  disabled={!replyText.trim() || isSubmittingComment}
                  className="bg-[#24e5c2] text-[#00141f] rounded-[20px] px-[20px] py-[8px] h-[40px] text-[16px] font-artifakt font-medium disabled:opacity-50"
                >
                  {isSubmittingComment ? 'Відправка...' : 'Надіслати'}
                </button>
              </div>
            </div>
          )}

          {/* Comments List */}
          <div className="flex flex-col gap-[12px]">
            {commentsLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-[#f1fdff]">Завантаження коментарів...</div>
              </div>
            ) : comments && comments.length > 0 ? (
              comments
                .filter(comment => !comment.parentCommentId) // Only show top-level comments
                .sort((a, b) => {
                  if (commentSortBy === 'newest') {
                    // Sort by newest first (descending)
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                  } else {
                    // Sort by likes (descending), then by newest as tiebreaker
                    const likesA = commentLikesCount[a.id] ?? a.likesCount
                    const likesB = commentLikesCount[b.id] ?? b.likesCount
                    if (likesB !== likesA) {
                      return likesB - likesA
                    }
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                  }
                })
                .map((comment) => {
                  // Helper function to get all nested replies recursively
                  const getAllReplies = (commentId: string): CommentDto[] => {
                    const directReplies = comments.filter(c => c.parentCommentId === commentId)
                    const nestedReplies = directReplies.flatMap(reply => getAllReplies(reply.id))
                    return [...directReplies, ...nestedReplies]
                  }
                  
                  // Helper function to get parent comment details
                  const getParentComment = (parentId: string | undefined) => {
                    if (!parentId) return null
                    return comments.find(c => c.id === parentId)
                  }
                  
                  // Helper function to truncate text
                  const truncateText = (text: string, maxLength: number = 100) => {
                    if (text.length <= maxLength) return text
                    return text.substring(0, maxLength).trim() + '...'
                  }
                  
                  const replies = getAllReplies(comment.id)
                  
                  return (
                    <div key={comment.id} className="flex flex-col gap-[12px]">
                      {/* Main Comment */}
                      <div className="bg-[#002f3d] rounded-[20px] p-[24px] flex flex-col gap-[20px]">
                        <div className="flex flex-col gap-[16px]">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-[12px]">
                              <button
                                onClick={() => navigate({
                                  to: '/profile/$nickname',
                                  params: { nickname: comment.authorUsername || 'unknown' }
                                })}
                                className="bg-[#004252] rounded-[20px] flex items-center gap-[12px] pr-[16px] hover:bg-[#005a6b] transition-colors cursor-pointer"
                              >
                                <img
                                  src={comment.authorAvatar || '/avatar.png'}
                                  alt={comment.authorUsername || 'User'}
                                  className="w-[36px] h-[36px] rounded-full"
                                />
                                <span className="text-[16px] font-bold text-[#f1fdff] font-artifakt">
                                  {comment.authorUsername || 'Unknown User'}
                                </span>
                              </button>
                              <span className="text-[14px] text-[rgba(204,248,255,0.65)] font-artifakt">
                                {formatDate(comment.createdAt)}
                              </span>
                            </div>
                            
                            <button className="p-[8px] hover:bg-[rgba(55,195,255,0.12)] rounded-full transition-colors">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path
                                  d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                                  fill="#F1FDFF"
                                />
                                <path
                                  d="M19 14C20.1046 14 21 13.1046 21 12C21 10.8954 20.1046 10 19 10C17.8954 10 17 10.8954 17 12C17 13.1046 17.8954 14 19 14Z"
                                  fill="#F1FDFF"
                                />
                                <path
                                  d="M5 14C6.10457 14 7 13.1046 7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12C3 13.1046 3.89543 14 5 14Z"
                                  fill="#F1FDFF"
                                />
                              </svg>
                            </button>
                          </div>
                          
                          <div className="flex flex-col gap-[8px]">
                            <p className="text-[16px] text-[#f1fdff] font-artifakt leading-[1.5] tracking-[-0.16px]">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-[12px] items-center">
                          <button
                            onClick={() => handleLikeComment(comment.id)}
                            className={`flex items-center gap-[8px] py-[4px] px-[8px] cursor-pointer text-[#ccf8ffa6] bg-[#37c3ff1f] rounded-[8px] transition-colors ${
                              likedComments.has(comment.id) ? 'text-[#ff6f95]' : ''
                            }`}
                            disabled={!user}
                          >
                            {likedComments.has(comment.id) ? (
                              <FavoriteFilledIcon className="w-5 h-5 text-[#ff6f95]" />
                            ) : (
                              <FavoriteIcon className="w-5 h-5" />
                            )}
                            <p>{formatCount(commentLikesCount[comment.id] ?? comment.likesCount)}</p>
                          </button>
                          
                          <button 
                            onClick={() => handleReplyToComment(comment.id)}
                            className="flex items-center gap-[8px] py-[4px] px-[8px] cursor-pointer text-[#ccf8ffa6] bg-[#37c3ff1f] rounded-[8px] transition-colors"
                          >
                            <ReplyIcon className="w-5 h-4" />
                            <p>Відповісти</p>
                          </button>

                          {/* Collapse/Expand Replies Button */}
                          {replies.length > 0 && (
                            <button
                              onClick={() => toggleRepliesCollapse(comment.id)}
                              className="flex items-center gap-[8px] py-[4px] px-[8px] cursor-pointer text-[#ccf8ffa6] bg-[#37c3ff1f] rounded-[8px] transition-colors hover:bg-[#37c3ff2f]"
                            >
                              <svg 
                                width="16" 
                                height="16" 
                                viewBox="0 0 16 16" 
                                fill="none" 
                                className={`transition-transform duration-200 ${collapsedComments.has(comment.id) ? 'rotate-0' : 'rotate-180'}`}
                              >
                                <path 
                                  d="M4 6L8 10L12 6" 
                                  stroke="currentColor" 
                                  strokeWidth="2" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <p>
                                {collapsedComments.has(comment.id) ? `Показати ${replies.length} відповідей` : 'Приховати відповіді'}
                              </p>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Replies */}
                      {replies.length > 0 && !collapsedComments.has(comment.id) && (
                        <div className="ml-[24px] flex flex-col gap-[12px]">
                          {replies.map((reply) => {
                            const parentComment = getParentComment(reply.parentCommentId)
                            
                            return (
                              <div key={reply.id} className="bg-[#002f3d] rounded-[20px] p-[24px] flex flex-col gap-[20px] border-l-[8px] border-[#24e5c2]">
                                <div className="flex flex-col gap-[16px]">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-[12px]">
                                      <button
                                        onClick={() => navigate({
                                          to: '/profile/$nickname',
                                          params: { nickname: reply.authorUsername || 'unknown' }
                                        })}
                                        className="bg-[rgba(55,195,255,0.25)] rounded-[20px] flex items-center gap-[12px] pr-[16px] hover:bg-[rgba(55,195,255,0.35)] transition-colors cursor-pointer"
                                      >
                                        <img
                                          src={reply.authorAvatar || '/avatar.png'}
                                          alt={reply.authorUsername || 'User'}
                                          className="w-[36px] h-[36px] rounded-full"
                                        />
                                        <span className="text-[16px] font-bold text-[#f1fdff] font-artifakt">
                                          {reply.authorUsername || 'Unknown User'}
                                        </span>
                                      </button>
                                      <span className="text-[14px] text-[rgba(204,248,255,0.65)] font-artifakt">
                                        {formatDate(reply.createdAt)}
                                      </span>
                                    </div>
                                    
                                    <button className="p-[8px] hover:bg-[rgba(55,195,255,0.12)] rounded-full transition-colors">
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path
                                          d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                                          fill="#F1FDFF"
                                        />
                                        <path
                                          d="M19 14C20.1046 14 21 13.1046 21 12C21 10.8954 20.1046 10 19 10C17.8954 10 17 10.8954 17 12C17 13.1046 17.8954 14 19 14Z"
                                          fill="#F1FDFF"
                                        />
                                        <path
                                          d="M5 14C6.10457 14 7 13.1046 7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12C3 13.1046 3.89543 14 5 14Z"
                                          fill="#F1FDFF"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                  
                                  <div className="flex flex-col gap-[8px]">
                                    {/* Show "Replying to @nickname" and citation quote for ALL replies */}
                                    {parentComment && (
                                      <div className="bg-[rgba(55,195,255,0.1)] rounded-[12px] p-[12px] mb-[8px] border-l-[4px] border-[#37c3ff]">
                                        <div className="text-[12px] text-[#37c3ff] mb-[4px] font-artifakt font-medium">
                                          Replying to @{parentComment.authorUsername}
                                        </div>
                                        <div className="text-[14px] text-[rgba(204,248,255,0.8)] font-artifakt italic">
                                          "{truncateText(parentComment.content)}"
                                        </div>
                                      </div>
                                    )}
                                    <p className="text-[16px] text-[#f1fdff] font-artifakt leading-[1.5] tracking-[-0.16px]">
                                      {reply.content}
                                    </p>
                                  </div>
                                </div>
                              
                              <div className="flex gap-[12px] items-center">
                                <button
                                  onClick={() => handleLikeComment(reply.id)}
                                  className={`flex items-center gap-[8px] py-[4px] px-[8px] cursor-pointer text-[#ccf8ffa6] bg-[#37c3ff1f] rounded-[8px] transition-colors ${
                                    likedComments.has(reply.id) ? 'text-[#ff6f95]' : ''
                                  }`}
                                  disabled={!user}
                                >
                                  {likedComments.has(reply.id) ? (
                                    <FavoriteFilledIcon className="w-5 h-5 text-[#ff6f95]" />
                                  ) : (
                                    <FavoriteIcon className="w-5 h-5" />
                                  )}
                                  <p>{formatCount(commentLikesCount[reply.id] ?? reply.likesCount)}</p>
                                </button>
                                
                                <button 
                                  onClick={() => handleReplyToComment(reply.id)}
                                  className="flex items-center gap-[8px] py-[4px] px-[8px] cursor-pointer text-[#ccf8ffa6] bg-[#37c3ff1f] rounded-[8px] transition-colors"
                                >
                                  <ReplyIcon className="w-5 h-4" />
                                  <p>Відповісти</p>
                                </button>
                              </div>
                            </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })
            ) : (
              <div className="flex justify-center items-center h-32">
                <div className="text-[#f1fdff] opacity-60">Коментарів поки немає</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Sidebar */}
      <div className="w-[348px] flex flex-col gap-[32px]">
        {/* Game Info Section */}
        <div className="flex flex-col gap-[20px]">
          <div className="flex flex-col gap-[8px]">
            <h2 className="text-[16px] font-bold text-[#f1fdff] font-artifakt">
              {post?.title || 'Завантаження...'}
            </h2>
            <div className="flex gap-[32px]">
              <div className="flex gap-[4px] text-[14px] font-artifakt">
                <span className="font-bold text-[#f1fdff]">
                  {comments?.length ? Math.floor(comments.length * 12.5) : '0'}
                </span>
                <span className="text-[rgba(204,248,255,0.65)]">підписників</span>
              </div>
              <div className="flex gap-[4px] items-center">
                <span className="text-[14px] font-bold text-[#f1fdff] font-artifakt">
                  {comments?.length || 0}
                </span>
                <div className="w-[8px] h-[8px] bg-[#24e5c2] rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-[8px] items-center">
            <button className="flex-1 bg-[#24e5c2] text-[#00141f] rounded-[20px] px-[20px] py-[8px] flex items-center gap-[8px] justify-center h-[40px]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5V19M5 12H19"
                  stroke="#00141f"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[16px] font-artifakt font-medium">Створити пост</span>
            </button>
            
            <button className="bg-[#046075] rounded-[20px] p-[8px] w-[40px] h-[40px] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 8A6 6 0 0 0 6 8C6 7.7 6.1 7.4 6.2 7.1C6.5 6.4 6.8 5.7 7.2 5.1C7.6 4.5 8.1 4 8.7 3.6C9.3 3.2 10 3 10.7 3C11.4 3 12.1 3.2 12.7 3.6C13.3 4 13.8 4.5 14.2 5.1C14.6 5.7 14.9 6.4 15.2 7.1C15.3 7.4 15.4 7.7 15.4 8C15.4 8.3 15.3 8.6 15.2 8.9C14.9 9.6 14.6 10.3 14.2 10.9C13.8 11.5 13.3 12 12.7 12.4C12.1 12.8 11.4 13 10.7 13C10 13 9.3 12.8 8.7 12.4C8.1 12 7.6 11.5 7.2 10.9C6.8 10.3 6.5 9.6 6.2 8.9C6.1 8.6 6 8.3 6 8Z"
                  fill="#F1FDFF"
                />
              </svg>
            </button>
            
            <button className="bg-[#046075] rounded-[20px] p-[8px] w-[40px] h-[40px] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                  fill="#F1FDFF"
                />
                <path
                  d="M19 14C20.1046 14 21 13.1046 21 12C21 10.8954 20.1046 10 19 10C17.8954 10 17 10.8954 17 12C17 13.1046 17.8954 14 19 14Z"
                  fill="#F1FDFF"
                />
                <path
                  d="M5 14C6.10457 14 7 13.1046 7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12C3 13.1046 3.89543 14 5 14Z"
                  fill="#F1FDFF"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Related Discussions Section */}
        <div className="flex flex-col gap-[16px]">
          <h3 className="text-[20px] font-bold text-[#f1fdff] font-manrope">
            Інші обговорення
          </h3>
          
          <div className="flex flex-col gap-[8px]">
            {relatedPostsLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-[#f1fdff] opacity-60">Завантаження...</div>
              </div>
             ) : relatedPosts && relatedPosts.length > 0 ? (
               relatedPosts
                 .filter((relatedPost: any) => relatedPost.id !== post?.id) // Exclude current post
                 .slice(0, 5) // Limit to 5 posts
                 .map((relatedPost: any) => (
                   <CommunityPostCard 
                     key={relatedPost.id} 
                     post={relatedPost} 
                     slug={relatedPost.gameId}
                     showShareButton={false}
                   />
                 ))
            ) : (
              <div className="flex justify-center items-center h-32">
                <div className="text-[#f1fdff] opacity-60">Немає пов'язаних обговорень</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
