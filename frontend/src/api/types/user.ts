export type User = {
  id: string
  nickname: string
  email: string
  bio?: string
  lang: string
  avatar?: string
  banner?: string
  balance: number
  isOnline?: boolean
  lastSeenAt?: string
}

export type UserUpdateRequest = {
  id: string
  nickname: string
  email: string
  bio?: string
  avatar?: string
  banner?: string
  lang: string
}

export type NotificationsRequest = {
  userId: string
  bigSale: boolean
  wishlistDiscount: boolean
  newProfileComment: boolean
  newFriendRequest: boolean
  friendRequestAccepted: boolean
  friendRequestDeclined: boolean
}

export type NotificationsSettings = {
  userId: string
  bigSale: boolean
  wishlistDiscount: boolean
  newProfileComment: boolean
  newFriendRequest: boolean
  friendRequestAccepted: boolean
  friendRequestDeclined: boolean
}

export type DeleteAccountRequest = {
  userId: string
  nickname: string
  password: string
  confirmPassword: string
}

export type ResetPasswordRequest = {
  email: string
  newPassword: string
  newPasswordConfirmed: string
}