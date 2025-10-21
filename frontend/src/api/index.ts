import axios from 'axios'
import { clearAuthToken } from './queries/useAuth'
import i18n from '@/lib/i18n'

const headers: Record<string, string> = {
  Accept: 'application/json',
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_DOTNET_API_URL,
  headers,
  withCredentials: true,
})

// Add request interceptor to include token in Authorization header and language
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add language header
    const language = i18n.language || 'uk'
    config.headers['Accept-Language'] = language
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthToken()

      if (window.location.pathname !== '/login') {
        window.location.href =
          '/login?message=Your session has expired. Please log in again.'
      }
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
