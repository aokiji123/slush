/**
 * Design tokens for consistent styling across the application
 * These map to CSS variables defined in colors.css
 */

export const colors = {
  // Semantic colors
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  accent: 'var(--color-accent)',
  
  // Surface colors
  surface: 'var(--color-surface)',
  surfaceElevated: 'var(--color-surface-elevated)',
  
  // Text colors
  textPrimary: 'var(--color-text-primary)',
  textSecondary: 'var(--color-text-secondary)',
  
  // Background colors (original system)
  background: 'var(--color-background)',
  nightBackground: 'var(--color-night-background)',
  
  // Specific UI colors
  success: 'var(--color-background-20)',
  error: 'var(--color-background-4)',
  warning: 'var(--color-background-2)',
  info: 'var(--color-background-7)',
} as const

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
} as const

export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  full: '9999px',
} as const

export const fontSize = {
  xs: '12px',
  sm: '14px',
  base: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
} as const

export const fontWeight = {
  light: 200,
  normal: 400,
  medium: 500,
  bold: 700,
  extraBold: 800,
} as const

export const transitions = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
} as const

export const zIndex = {
  dropdown: 10,
  sticky: 20,
  modal: 50,
  tooltip: 100,
} as const

// Type exports for TypeScript
export type Color = keyof typeof colors
export type Spacing = keyof typeof spacing
export type BorderRadius = keyof typeof borderRadius
export type FontSize = keyof typeof fontSize
export type FontWeight = keyof typeof fontWeight

