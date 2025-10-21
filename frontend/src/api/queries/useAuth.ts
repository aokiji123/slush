import { useMutation } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import axiosInstance from '..'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../types/auth'

async function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
  const { data } = await axiosInstance.post('/auth/login', credentials)

  return {
    token: data.Token || data.token,
    username: data.Username || data.username,
    email: data.Email || data.email,
    avatar: data.Avatar || data.avatar,
    emailConfirmed: data.EmailConfirmed || data.emailConfirmed,
  }
}

async function registerUser(
  credentials: RegisterRequest,
): Promise<RegisterResponse> {
  const { data } = await axiosInstance.post('/auth/register', credentials)

  return {
    token: data.Token || data.token,
    username: data.Username || data.username,
    email: data.Email || data.email,
    avatar: data.Avatar || data.avatar,
    emailConfirmed: data.EmailConfirmed || data.emailConfirmed,
  }
}

async function sendVerificationCode(email: string): Promise<void> {
  await axiosInstance.post('/auth/send-verification-code', { email })
}

async function resendVerificationCode(email: string): Promise<void> {
  await axiosInstance.post('/auth/resend-verification', { email })
}

async function verifyCode(email: string, code: string): Promise<void> {
  await axiosInstance.post('/auth/verify-reset-code', { email, code })
}

async function forgotPassword(email: string): Promise<void> {
  await axiosInstance.post('/auth/forgot-password', { email })
}

async function resetPassword(
  email: string,
  newPassword: string,
  newPasswordConfirmed: string,
): Promise<void> {
  await axiosInstance.post('/auth/reset-password', {
    email,
    newPassword,
    newPasswordConfirmed,
  })
}

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginRequest) => loginUser(credentials),
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: (credentials: RegisterRequest) => registerUser(credentials),
  })
}

export const useSendVerificationCode = () => {
  return useMutation({
    mutationFn: ({ email }: { email: string }) => sendVerificationCode(email),
  })
}

export const useResendVerificationCode = () => {
  return useMutation({
    mutationFn: ({ email }: { email: string }) => resendVerificationCode(email),
  })
}

export const useVerifyCode = () => {
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      verifyCode(email, code),
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: ({ email }: { email: string }) => forgotPassword(email),
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({
      email,
      newPassword,
      newPasswordConfirmed,
    }: {
      email: string
      newPassword: string
      newPasswordConfirmed: string
    }) => resetPassword(email, newPassword, newPasswordConfirmed),
  })
}

export function clearAuthToken() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('user')
  
  // Dispatch event to notify components of auth state change
  window.dispatchEvent(new Event('authStateChanged'))
}

export function useAuthState() {
  const [user, setUser] = useState<LoginResponse | null>(null)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    const checkAuthState = () => {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token')
      const userData =
        localStorage.getItem('user') || sessionStorage.getItem('user')

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData) as LoginResponse
          setUser(parsedUser)
          setIsAuth(true)
        } catch (error) {
          console.error('Failed to parse user data:', error)
          setIsAuth(false)
          setUser(null)
        }
      } else {
        setIsAuth(false)
        setUser(null)
      }
    }

    checkAuthState()

    window.addEventListener('storage', checkAuthState)
    window.addEventListener('authStateChanged', checkAuthState)

    return () => {
      window.removeEventListener('storage', checkAuthState)
      window.removeEventListener('authStateChanged', checkAuthState)
    }
  }, [])

  return { user, isAuth }
}
