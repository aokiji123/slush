import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Footer, Header } from '@/components'

function RootComponent() {
  const location = useLocation()
  const isChatPage = location.pathname === '/chat'
  
  return (
    <>
      <Header />
      <Outlet />
      {!isChatPage && <Footer />}
      <TanStackRouterDevtools />
    </>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
