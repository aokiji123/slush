import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getPostsByGame,
  getPost,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getCommentsByPost,
  createComment,
  deleteComment,
  likePost,
  unlikePost,
  likeComment,
  unlikeComment,
  uploadMedia,
  getLibraryPosts,
} from '../communityAPI'
import type {
  CreatePostDto,
  UpdatePostDto,
  CreateCommentDto,
  PostFilters,
} from '../../types/community'

// Query keys
export const communityKeys = {
  all: ['community'] as const,
  posts: (gameId: string, filters?: PostFilters) => 
    [...communityKeys.all, 'posts', gameId, filters] as const,
  post: (gameId: string, postId: string) => 
    [...communityKeys.all, 'post', gameId, postId] as const,
  comments: (postId: string) => 
    [...communityKeys.all, 'comments', postId] as const,
  libraryPosts: (filters?: { type?: number, sortBy?: string, limit?: number }) => 
    [...communityKeys.all, 'library-posts', filters] as const,
}

// Get posts for a game with filtering and sorting
export function useGamePosts(gameId: string, filters?: PostFilters) {
  return useQuery({
    queryKey: communityKeys.posts(gameId, filters),
    queryFn: async () => {
      try {
        const result = await getPostsByGame(gameId, filters)
        return result || []
      } catch (error) {
        console.error('Error fetching posts:', error)
        return []
      }
    },
    enabled: !!gameId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

// Get single post
export function usePost(gameId: string, postId: string) {
  return useQuery({
    queryKey: communityKeys.post(gameId, postId),
    queryFn: () => getPost(gameId, postId),
    enabled: !!gameId && !!postId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

// Get single post by ID only (for general community posts)
export function usePostById(postId: string) {
  return useQuery({
    queryKey: ['community', 'post', postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

// Get comments for a post
export function usePostComments(postId: string) {
  return useQuery({
    queryKey: communityKeys.comments(postId),
    queryFn: () => getCommentsByPost(postId),
    enabled: !!postId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

// Create post mutation
export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ gameId, dto }: { gameId: string; dto: CreatePostDto }) => {
      console.log('Creating post with:', { gameId, dto })
      const result = await createPost(gameId, dto)
      console.log('Create post result:', result)
      return result
    },
    onSuccess: (data, { gameId }) => {
      console.log('Post created successfully:', data)
      // Invalidate and refetch posts for this game
      queryClient.invalidateQueries({
        queryKey: communityKeys.posts(gameId),
      })
    },
    onError: (error) => {
      console.error('Post creation failed:', error)
    },
  })
}

// Update post mutation
export function useUpdatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ 
      gameId, 
      postId, 
      dto 
    }: { 
      gameId: string; 
      postId: string; 
      dto: UpdatePostDto 
    }) => updatePost(gameId, postId, dto),
    onSuccess: (data, { gameId, postId }) => {
      // Update the specific post in cache
      queryClient.setQueryData(
        communityKeys.post(gameId, postId),
        data
      )
      // Invalidate posts list to reflect changes
      queryClient.invalidateQueries({
        queryKey: communityKeys.posts(gameId),
      })
    },
  })
}

// Delete post mutation
export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ gameId, postId }: { gameId: string; postId: string }) =>
      deletePost(gameId, postId),
    onSuccess: (_, { gameId }) => {
      // Invalidate posts for this game
      queryClient.invalidateQueries({
        queryKey: communityKeys.posts(gameId),
      })
    },
  })
}

// Create comment mutation
export function useCreateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, dto }: { postId: string; dto: CreateCommentDto }) =>
      createComment(postId, dto),
    onSuccess: (_, { postId }) => {
      // Invalidate comments for this post
      queryClient.invalidateQueries({
        queryKey: communityKeys.comments(postId),
      })
      // Also invalidate posts to update comment counts
      queryClient.invalidateQueries({
        queryKey: communityKeys.all,
      })
    },
  })
}

// Delete comment mutation
export function useDeleteComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, commentId }: { postId: string; commentId: string }) =>
      deleteComment(postId, commentId),
    onSuccess: (_, { postId }) => {
      // Invalidate comments for this post
      queryClient.invalidateQueries({
        queryKey: communityKeys.comments(postId),
      })
      // Also invalidate posts to update comment counts
      queryClient.invalidateQueries({
        queryKey: communityKeys.all,
      })
    },
  })
}

// Like post mutation
export function useLikePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      // Optimistically update all post caches
      queryClient.invalidateQueries({
        queryKey: communityKeys.all,
      })
    },
  })
}

// Unlike post mutation
export function useUnlikePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: unlikePost,
    onSuccess: () => {
      // Optimistically update all post caches
      queryClient.invalidateQueries({
        queryKey: communityKeys.all,
      })
    },
  })
}

// Like comment mutation
export function useLikeComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: likeComment,
    onSuccess: () => {
      // Invalidate all comment queries
      queryClient.invalidateQueries({
        queryKey: communityKeys.all,
      })
    },
  })
}

// Unlike comment mutation
export function useUnlikeComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: unlikeComment,
    onSuccess: () => {
      // Invalidate all comment queries
      queryClient.invalidateQueries({
        queryKey: communityKeys.all,
      })
    },
  })
}

// Upload media mutation
export function useUploadMedia() {
  return useMutation({
    mutationFn: ({ postId, file }: { postId: string; file: File }) =>
      uploadMedia(postId, file),
  })
}

// Get library posts
export function useLibraryPosts(filters?: {
  type?: number
  sortBy?: string
  limit?: number
}) {
  return useQuery({
    queryKey: communityKeys.libraryPosts(filters),
    queryFn: async () => {
      try {
        const result = await getLibraryPosts(filters)
        return result || []
      } catch (error) {
        console.error('Error fetching library posts:', error)
        return []
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  })
}
