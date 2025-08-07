import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$slug/community')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full flex flex-col gap-[24px]">
      <p className="text-[32px] font-bold text-[var(--color-background)]">
        Спільнота
      </p>
    </div>
  )
}
