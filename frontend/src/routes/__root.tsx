import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Footer, Header } from '@/components'

function RootComponent() {
  const location = useLocation()

  return (
    <>
      <Header />
      <Outlet />
      {location.pathname !== '/chat' && <Footer />}
      <TanStackRouterDevtools />
    </>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
