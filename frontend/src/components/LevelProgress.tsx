import { LevelBadge } from './LevelBadge'

interface LevelProgressProps {
  currentLevel: number
  experience: number
  nextLevelExperience: number
}

export const LevelProgress = ({ currentLevel, experience, nextLevelExperience }: LevelProgressProps) => {
  // Calculate progress percentage
  const previousLevelExp = currentLevel === 1 ? 0 : (currentLevel - 1) * 25 // Simplified calculation
  const progressPercentage = Math.min(
    ((experience - previousLevelExp) / (nextLevelExperience - previousLevelExp)) * 100,
    100
  )

  return (
    <div className="flex flex-col gap-[12px] items-center w-full">
      {/* Current XP Display */}
      <div className="flex flex-col gap-[2px] items-center">
        <p className="text-[20px] font-bold text-[var(--color-background)] font-artifakt leading-[1.2] tracking-[-0.2px]">
          {experience}
        </p>
        <div className="flex items-center justify-center">
          <div className="rotate-180">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 1L12.5 6.5L7 12L1.5 6.5L7 1Z" fill="var(--color-background)" />
            </svg>
          </div>
        </div>
      </div>

      {/* Progress Bar and Level Info */}
      <div className="flex flex-col gap-[12px] items-center w-full">
        {/* Progress Bar */}
        <div className="bg-[rgba(55,195,255,0.25)] h-[8px] w-full rounded-[20px] overflow-hidden">
          <div 
            className="bg-[#6f97ff] h-full rounded-[20px] transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Level Badges and Points */}
        <div className="flex items-center justify-between w-full">
          {/* Current Level */}
          <div className="flex items-center gap-[12px]">
            <LevelBadge level={currentLevel} />
            <p className="text-[16px] text-[rgba(204,248,255,0.65)] font-artifakt leading-[1.25] tracking-[-0.16px]">
              {previousLevelExp} очок
            </p>
          </div>

          {/* Next Level */}
          <div className="flex items-center gap-[12px]">
            <p className="text-[16px] text-[rgba(204,248,255,0.65)] font-artifakt leading-[1.25] tracking-[-0.16px]">
              {nextLevelExperience} очок
            </p>
            <LevelBadge level={currentLevel + 1} />
          </div>
        </div>
      </div>
    </div>
  )
}
