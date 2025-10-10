import axios from 'axios'
// import { clearAuthToken } from './queries/useAuth'

const headers: Record<string, string> = {
  Accept: 'application/json',
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_DOTNET_API_URL,
  headers,
  withCredentials: true,
})

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       clearAuthToken()

//       if (window.location.pathname !== '/login') {
//         window.location.href =
//           '/login?message=Your session has expired. Please log in again.'
//       }
//     }
//     return Promise.reject(error)
//   },
// )

export default axiosInstance
