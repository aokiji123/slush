import axiosInstance from '.'
import type {
  PostDto,
  CreatePostDto,
  UpdatePostDto,
  CommentDto,
  CreateCommentDto,
  PostFilters,
  MediaDto,
  PostType,
} from '../types/community'

// Get posts by game with optional filtering and sorting
export async function getPostsByGame(
  gameId: string,
  filters?: PostFilters
): Promise<PostDto[]> {
  const params = new URLSearchParams()
  
  if (filters?.type !== undefined) {
    params.append('type', filters.type.toString())
  }
  if (filters?.sortBy) {
    params.append('sortBy', filters.sortBy)
  }
  if (filters?.search) {
    params.append('search', filters.search)
  }

  const queryString = params.toString()
  const url = `/community/posts/${gameId}${queryString ? `?${queryString}` : ''}`
  
  const { data } = await axiosInstance.get(url)
  return data || []
}

// Get single post
export async function getPost(gameId: string, postId: string): Promise<PostDto> {
  const { data } = await axiosInstance.get(`/community/post/${gameId}/${postId}`)
  return data
}

// Get single post by ID only (for general community posts)
export async function getPostById(postId: string): Promise<PostDto> {
  const { data } = await axiosInstance.get(`/community/post/${postId}`)
  return data
}

// Create post
export async function createPost(gameId: string, dto: CreatePostDto): Promise<PostDto> {
  const { data } = await axiosInstance.post(`/community/post/${gameId}`, dto)
  console.log('Create post API response:', data)
  return data
}

// Update post
export async function updatePost(
  gameId: string,
  postId: string,
  dto: UpdatePostDto
): Promise<PostDto> {
  const { data } = await axiosInstance.put(`/community/post/${gameId}/${postId}`, dto)
  return data
}

// Delete post
export async function deletePost(gameId: string, postId: string): Promise<void> {
  await axiosInstance.delete(`/community/post/${gameId}/${postId}`)
}

// Get comments for a post
export async function getCommentsByPost(postId: string): Promise<CommentDto[]> {
  const { data } = await axiosInstance.get(`/community/comments/${postId}`)
  return data
}

// Create comment
export async function createComment(postId: string, dto: CreateCommentDto): Promise<CommentDto> {
  const { data } = await axiosInstance.post(`/community/comments/${postId}`, dto)
  return data
}

// Delete comment
export async function deleteComment(postId: string, commentId: string): Promise<void> {
  await axiosInstance.delete(`/community/comments/${postId}/${commentId}`)
}

// Like post
export async function likePost(postId: string): Promise<void> {
  await axiosInstance.post(`/community/like/post/${postId}`)
}

// Unlike post
export async function unlikePost(postId: string): Promise<void> {
  await axiosInstance.delete(`/community/like/post/${postId}`)
}

// Like comment
export async function likeComment(commentId: string): Promise<void> {
  await axiosInstance.post(`/community/like/comment/${commentId}`)
}

// Unlike comment
export async function unlikeComment(commentId: string): Promise<void> {
  await axiosInstance.delete(`/community/like/comment/${commentId}`)
}

// Upload media for a post
export async function uploadMedia(postId: string, file: File): Promise<MediaDto> {
  const formData = new FormData()
  formData.append('file', file)
  
  const { data } = await axiosInstance.post(`/community/upload?postId=${postId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

// Get library posts
export async function getLibraryPosts(filters?: {
  type?: PostType
  sortBy?: string
  limit?: number
}): Promise<PostDto[]> {
  const params = new URLSearchParams()
  
  if (filters?.type !== undefined) {
    params.append('type', filters.type.toString())
  }
  if (filters?.sortBy) {
    params.append('sortBy', filters.sortBy)
  }
  if (filters?.limit) {
    params.append('limit', filters.limit.toString())
  }

  const queryString = params.toString()
  const url = `/community/library-posts${queryString ? `?${queryString}` : ''}`
  
  const { data } = await axiosInstance.get(url)
  return data || []
}