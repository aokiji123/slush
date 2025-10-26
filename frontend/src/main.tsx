import { StrictMode, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Import query client
import { queryClient } from './lib/query-client'

// Import i18n configuration
import './lib/i18n'

// Import ErrorBoundary
import { ErrorBoundary } from './components/ErrorBoundary'

// Import SignalR Provider
import { SignalRProvider } from './providers/SignalRProvider'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
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
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'var(--color-background-15)',
                    color: 'var(--color-background)',
                    border: '1px solid var(--color-background-16)',
                  },
                  success: {
                    iconTheme: {
                      primary: '#24e5c2',
                      secondary: 'white',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ff6f95',
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
