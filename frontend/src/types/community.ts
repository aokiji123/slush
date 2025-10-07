import type { Dispatch, SetStateAction } from 'react'

export interface ICommunityComment {
  name: string
  date: string
  text: string
  like: number | string
  avatar: string
  _id: string
  comments: Array<{
    name: string
    text: string
    avatar: string
    _id: string
  }>
}

export interface ICommentOne {
  imageTop: null | string
  imageBottom: null | string
  imageBotto2?: null | string
  imageLeft: null | string
  name: string
  date: string
  title: string | null
  text: string | null
  like: number | string
  comment: number
  avatar: string
  _id: string
  isNext?: boolean
  isHidUser?: boolean
}
