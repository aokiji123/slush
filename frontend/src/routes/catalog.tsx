import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Search, SidebarFilter } from '@/components'
import { GridIcon, GridRowIcon } from '@/icons'
import { Product } from '@/components/Product'

const glowCoords = [
  {
    id: 1,
    top: '-150px',
    left: '-200px',
    width: '700px',
    height: '700px',
  },
  {
    id: 2,
    top: '400px',
    right: '-300px',
    width: '900px',
    height: '900px',
  },
  {
    id: 3,
    bottom: '-50px',
    left: '-250px',
    width: '900px',
    height: '900px',
  },
]

export const Route = createFileRoute('/catalog')({
  validateSearch: (search: Record<string, unknown>): { title?: string } => {
    return typeof search.title === 'string' ? { title: search.title } : {}
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { title } = Route.useSearch()
  return <Catalog title={title} />
}

const Catalog = ({ title }: { title?: string }) => {
  const [linear, setLinear] = useState(false)

  return (
    <div className="bg-[var(--color-night-background)] relative overflow-hidden">
      <div className="container mx-auto relative z-20">
        <div className="flex items-center justify-center">
          <Search className="my-[16px] w-full" />
        </div>

        {title && (
          <h2 className="text-[48px] font-bold text-[var(--color-background)] mt-[32px]">
            {title}
          </h2>
        )}

        <div className="w-full flex gap-[24px] mt-[16px]">
          <div className="w-[25%]">
            <SidebarFilter />
          </div>
          <div className="w-[75%] pb-[256px]">
            <div className="flex items-center justify-end text-[var(--color-background)]">
              <div className="flex items-center gap-[16px]">
                <p className="text-[var(--color-background-25)]">Вид:</p>
                <div onClick={() => setLinear(false)}>
                  <GridIcon
                    className={`cursor-pointer hover:text-[var(--color-background-23)] ${
                      !linear && 'text-[var(--color-background-23)]'
                    }`}
                  />
                </div>
                <div onClick={() => setLinear(true)}>
                  <GridRowIcon
                    className={`cursor-pointer hover:text-[var(--color-background-23)] ${
                      linear ? 'text-[var(--color-background-23)]' : ''
                    }`}
                  />
                </div>
              </div>
            </div>

            {linear ? (
              <div className="flex flex-col gap-[12px] mt-[16px]">
                {Array.from({ length: 9 }).map((_, index) => (
                  <Product key={index} linear={linear} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-[24px] mt-[16px]">
                {Array.from({ length: 9 }).map((_, index) => (
                  <Product key={index} linear={linear} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {glowCoords.map((glow) => (
        <img
          key={glow.id}
          loading="lazy"
          src="/glow.png"
          alt="glow"
          className="absolute z-0 opacity-50"
          style={{
            top: glow.top,
            left: glow.left,
            right: glow.right,
            bottom: glow.bottom,
            width: glow.width,
            height: glow.height,
          }}
        />
      ))}
    </div>
  )
}
