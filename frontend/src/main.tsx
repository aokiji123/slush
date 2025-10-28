import { StrictMode, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { routeTree } from './routeTree.gen'
import { queryClient } from './lib/query-client'
import { ErrorBoundary } from './components/ErrorBoundary'
import { SignalRProvider } from './providers/SignalRProvider'
import { ToastContainer } from './components/Toast'
import reportWebVitals from './reportWebVitals.ts'
import './lib/i18n'
import './styles.css'

const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: any
  }
}

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <QueryClientProvider client={queryClient}>
            <SignalRProvider>
              <RouterProvider router={router} />
              <ToastContainer />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'var(--color-background-8)',
                    color: 'var(--color-background)',
                    borderRadius: '12px',
                    border: '1px solid var(--color-background-16)',
                  },
                  success: {
                    iconTheme: {
                      primary: 'var(--color-background-21)',
                      secondary: 'white',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: 'var(--color-background-10)',
                      secondary: 'white',
                    },
                  },
                }}
              />
            </SignalRProvider>
          </QueryClientProvider>
        </Suspense>
      </ErrorBoundary>
    </StrictMode>,
  )
}

reportWebVitals()
