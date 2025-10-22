interface LevelBadgeProps {
  level: number
}

export const LevelBadge = ({ level }: LevelBadgeProps) => {
  return (
    <div className="relative w-[33px] h-[32px]">
      <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-[14px] text-[var(--color-background)] leading-[1.15] tracking-[-0.14px]">
        {level}
      </p>
      <svg
        width="33"
        height="32"
        viewBox="0 0 33 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0"
      >
        <path
          d="M16.5 2L24.8923 6.5V15.5L16.5 20L8.10769 15.5V6.5L16.5 2Z"
          stroke="#FFBD6F"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M16.5 12L24.8923 16.5V25.5L16.5 30L8.10769 25.5V16.5L16.5 12Z"
          stroke="#FFBD6F"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </div>
  )
}

