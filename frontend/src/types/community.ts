export enum PostType {
  Discussion = 0,
  Screenshot = 1,
  Video = 2,
  Guide = 3,
  News = 4
}

export enum MediaType {
  Image = 0,
  Video = 1
}

export interface MediaDto {
  id: string
  file: string
  isCover: boolean
  type: MediaType
}

export interface UploadMediaDto {
  file: string
  isCover: boolean
  type: MediaType
}

export interface PostDto {
  id: string
  title: string
  content: string
  type: PostType
  createdAt: string
  updatedAt: string
  authorId: string
  gameId: string
  media: MediaDto[]
  likesCount: number
  commentsCount: number
  authorUsername: string
  authorAvatar: string
  gameMainImage: string
  isLiked?: boolean
  isLikedByCurrentUser?: boolean
}

export interface CreatePostDto {
  title: string
  content: string
  type: PostType
  media?: UploadMediaDto[]
}

export interface UpdatePostDto {
  title: string
  content: string
  type: PostType
}

export interface CommentDto {
  id: string
  content: string
  createdAt: string
  authorId: string
  postId: string
  parentCommentId?: string
  authorUsername: string
  authorAvatar: string
  likesCount: number
}

export interface CreateCommentDto {
  content: string
  parentCommentId?: string
}

export interface PostFilters {
  type?: PostType
  sortBy?: 'popular' | 'newest' | 'rating' | 'comments'
  search?: string
}

export interface PostSortOption {
  value: 'popular' | 'newest' | 'rating' | 'comments'
  label: string
}

export interface CommunityStats {
  subscribers: number
  online: number
}

export interface ICommunityComment {
  id: string
  content: string
  createdAt: string
  authorId: string
  postId: string
  parentCommentId?: string
  authorUsername: string
  authorAvatar: string
  likesCount: number
}

export interface ICommentOne {
  _id: string
  name: string
  date: string
  title?: string | null
  text: string | null
  like: string
  comment: number
  avatar: string
  imageTop?: string | null
  imageBottom?: string | null
  imageLeft?: string | null
  imageBotto2?: string | null
  isNext?: boolean
  isHidUser?: boolean
  isComment?: boolean
  type?: string
  comments?: ICommentOne[]
}