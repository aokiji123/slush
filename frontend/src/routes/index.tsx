import { createFileRoute } from '@tanstack/react-router'
import { Banner, Home } from '@/components'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="text-center overflow-hidden">
      <Banner />
      <Home />
    </div>
  )
}
