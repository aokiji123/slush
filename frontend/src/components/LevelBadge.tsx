interface LevelBadgeProps {
  level: number
}

// Helper function to convert hex to RGB
const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return [0, 0, 0]
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ]
}

// Helper function to interpolate between two colors
const interpolateColor = (
  color1: string,
  color2: string,
  progress: number
): string => {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * progress)
  const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * progress)
  const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * progress)

  return `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// Calculate stroke color based on level
const getStrokeColor = (level: number): string => {
  if (level <= 30) {
    // Orange zone: #FFBD6F
    return '#FFBD6F'
  } else if (level <= 60) {
    // Purple zone: interpolate from orange to purple
    const progress = (level - 30) / 30
    return interpolateColor('#FFBD6F', '#B57FFF', progress)
  } else {
    // Blue zone: interpolate from purple to blue
    const progress = Math.min((level - 60) / 30, 1)
    return interpolateColor('#B57FFF', '#6F97FF', progress)
  }
}

export const LevelBadge = ({ level }: LevelBadgeProps) => {
  const strokeColor = getStrokeColor(level)

  return (
    <div className="relative inline-flex items-center justify-center w-[29px] h-[32px]">
      <svg
        width="29"
        height="32"
        viewBox="0 0 29 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0"
      >
        <path
          d="M27.5781 8.58594V23.4131L14.2891 30.8535L1 23.4131V8.58594L14.2891 1.14551L27.5781 8.58594Z"
          stroke={strokeColor}
          strokeWidth="2"
          fill="none"
        />
      </svg>
      <span className="relative z-10 font-bold text-[14px] text-[var(--color-background)] leading-none">
        {level}
      </span>
    </div>
  )
}

