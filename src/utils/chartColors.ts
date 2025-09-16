/**
 * Chart color utilities that use CSS custom properties from index.css
 * This ensures all charts use the same color system and support dark mode
 */

/**
 * Get CSS custom property value as HSL string
 */
const getCSSVariable = (variable: string): string => {
  if (typeof window === 'undefined') return ''
  
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim()
  
  return value ? `hsl(${value})` : ''
}

/**
 * Chart tier colors mapped to CSS custom properties
 */
export const getTierColor = (tier: string): string => {
  switch (tier) {
    case 'Tier 1':
      return getCSSVariable('--chart-tier-1')
    case 'Tier 2':
      return getCSSVariable('--chart-tier-2')
    case 'Tier 3':
      return getCSSVariable('--chart-tier-3')
    case 'Tier 4':
      return getCSSVariable('--chart-tier-4')
    case 'Partner':
      return getCSSVariable('--chart-partner')
    default:
      return getCSSVariable('--chart-default')
  }
}

/**
 * Score-based colors using CSS custom properties
 */
export const getScoreColor = (score: number): string => {
  if (score >= 8.0) return getCSSVariable('--chart-score-excellent')
  if (score >= 6.0) return getCSSVariable('--chart-score-good')
  return getCSSVariable('--chart-score-poor')
}

/**
 * Chart UI colors from CSS custom properties
 */
export const chartColors = {
  grid: () => getCSSVariable('--chart-grid'),
  selected: () => getCSSVariable('--chart-selected'),
  text: () => getCSSVariable('--chart-text'),
  background: () => getCSSVariable('--background'),
  foreground: () => getCSSVariable('--foreground'),
}

/**
 * Generate distinct colors for multiple data series using CSS custom properties
 * Uses golden ratio distribution for optimal color separation
 */
export const getSeriesColor = (index: number): string => {
  // Use predefined chart colors from CSS custom properties
  const chartColors = [
    '--chart-tier-1',    // Blue
    '--chart-tier-2',    // Orange  
    '--chart-tier-3',    // Green
    '--chart-tier-4',    // Red
    '--chart-partner',   // Purple
    '--primary',         // Primary blue
    '--accent',          // Accent color
    '--secondary'        // Secondary color
  ]
  
  const colorIndex = index % chartColors.length
  return getCSSVariable(chartColors[colorIndex])
}

/**
 * Get color with transparency for fill areas
 */
export const getFillColor = (color: string, opacity: number = 0.3): string => {
  // Convert hsl to hsla for transparency
  if (color.startsWith('hsl(')) {
    return color.replace('hsl(', `hsla(`).replace(')', `, ${opacity})`)
  }
  // Fallback for OKLCH format (if any OKLCH colors are used)
  if (color.startsWith('oklch(')) {
    return color.replace('oklch(', `oklcha(`).replace(')', `, ${opacity})`)
  }
  return color
}

/**
 * Badge color classes for score indicators (using Tailwind classes)
 */
export const getScoreBadgeClass = (score: number): string => {
  if (score >= 8.0) return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
  if (score >= 6.0) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
  return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
}
