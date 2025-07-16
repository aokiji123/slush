import { createFileRoute } from '@tanstack/react-router'
import { Banner } from '@/components'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="text-center">
      <Banner />
    </div>
  )
}
