type SortDropdownProps = {
  options: Array<string>
  className?: string
}

export const SortDropdown = ({ options, className }: SortDropdownProps) => {
  return (
    <div
      className={`absolute ${className} rounded-[8px] py-[10px] px-[12px] bg-[var(--color-background-8)] border-1 border-[var(--color-background-16)] flex flex-col gap-[2px] z-10 ${className}`}
    >
      {options.map((option) => {
        return (
          <p
            key={option}
            className="text-[16px] font-normal text-[var(--color-background)] hover:bg-[var(--sky-25)] py-[6px] px-[12px] rounded-[20px] cursor-pointer"
          >
            {option}
          </p>
        )
      })}
    </div>
  )
}
