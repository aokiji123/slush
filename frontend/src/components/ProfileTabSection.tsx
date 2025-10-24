import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

export interface ProfileTabSectionProps {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
  icon?: React.ReactNode
  className?: string
}

export const ProfileTabSection = ({
  title,
  children,
  defaultExpanded = true,
  icon,
  className = ''
}: ProfileTabSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className={`flex flex-col gap-[16px] ${className}`}>
      {/* Section Header */}
      <div className="flex gap-[8px] items-center">
        {icon && (
          <div className="size-[24px] flex items-center justify-center">
            {icon}
          </div>
        )}
        <button
          onClick={handleToggle}
          className="flex items-center gap-[8px] text-[#f1fdff] hover:text-[#24E5C2] transition-colors"
        >
          <h3 className="text-[20px] font-artifakt">{title}</h3>
          {isExpanded ? (
            <FaChevronUp size={16} />
          ) : (
            <FaChevronDown size={16} />
          )}
        </button>
      </div>

      {/* Section Content */}
      {isExpanded && (
        <div className="flex flex-col gap-[8px]">
          {children}
        </div>
      )}
    </div>
  )
}
