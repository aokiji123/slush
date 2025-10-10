export type LoginRequest = {
  email: string
  password: string
}

export type RegisterRequest = {
  username: string
  email: string
  password: string
}

export type RegisterResponse = {
  token: string
  username: string
  email: string
  avatar: string | null
  emailConfirmed: boolean
}

export type LoginResponse = RegisterResponse
