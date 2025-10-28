import type { ReactNode } from 'react'

type JustifyContent = 'start' | 'center' | 'end' | 'between' | 'around'

interface CardActionsProps {
  children: ReactNode
  className?: string
  justify?: JustifyContent
}

const justifyClasses: Record<JustifyContent, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
}

export const CardActions = ({ 
  children, 
  className = '', 
  justify = 'start' 
}: CardActionsProps) => {
  const justifyClass = justifyClasses[justify]
  
  return (
    <div className={`flex items-center gap-3 ${justifyClass} ${className}`}>
      {children}
    </div>
  )
}
