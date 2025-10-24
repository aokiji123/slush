import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/$nickname')({
  component: ProfileLayout,
})

function ProfileLayout() {
  return <Outlet />
}