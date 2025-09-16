import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RadarChart } from '../../src/components/charts/RadarChart'
import type { Company, PillarScore } from '../../src/types/company'

// Mock Plotly component
vi.mock('react-plotly.js', () => ({
  default: ({ data, layout, config, style, className }: any) => (
    <div 
      data-testid="plotly-chart" 
      className={className || ''}
      style={style}
      data-layout={JSON.stringify(layout)}
      data-config={JSON.stringify(config)}
    >
      Mock Plotly Chart
    </div>
  )
}))

const mockCompanies: Company[] = [
  {
    key: 'test-1',
    name: 'Test Company 1',
    geography: 'USA',
    overallScore: 8.5,
    strategicFit: 8.0,
    abilityToExecute: 9.0,
    tier: 'Tier 1'
  },
  {
    key: 'test-2',
    name: 'Test Company 2',
    geography: 'Germany',
    overallScore: 7.5,
    strategicFit: 7.0,
    abilityToExecute: 8.0,
    tier: 'Tier 2'
  }
]

const mockPillarScores: PillarScore[] = [
  { key: 'test-1', pillar: 'finance', score: 8.5 },
  { key: 'test-1', pillar: 'industry', score: 7.8 },
  { key: 'test-1', pillar: 'ip', score: 9.2 },
  { key: 'test-1', pillar: 'manufacturing', score: 8.0 },
  { key: 'test-1', pillar: 'ownership', score: 7.5 },
  { key: 'test-1', pillar: 'hydrogen', score: 8.8 },
  { key: 'test-2', pillar: 'finance', score: 7.2 },
  { key: 'test-2', pillar: 'industry', score: 8.1 },
  { key: 'test-2', pillar: 'ip', score: 6.9 },
  { key: 'test-2', pillar: 'manufacturing', score: 8.5 },
  { key: 'test-2', pillar: 'ownership', score: 7.8 },
  { key: 'test-2', pillar: 'hydrogen', score: 7.0 }
]

describe('RadarChart', () => {
  it('renders with companies and pillar scores', () => {
    render(
      <RadarChart
        companies={mockCompanies}
        pillarScores={mockPillarScores}
        height={400}
      />
    )
    
    // The chart should render
    expect(screen.getByTestId('plotly-chart')).toBeInTheDocument()
  })

  it('shows empty state when no companies provided', () => {
    render(
      <RadarChart
        companies={[]}
        pillarScores={[]}
        height={400}
      />
    )
    
    expect(screen.getByText('Select companies to view pillar scores comparison')).toBeInTheDocument()
  })

  it('handles missing pillar scores gracefully', () => {
    render(
      <RadarChart
        companies={mockCompanies}
        pillarScores={[]}
        height={400}
      />
    )
    
    // Should render with zero scores for missing data
    expect(screen.getByTestId('plotly-chart')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <RadarChart
        companies={mockCompanies}
        pillarScores={mockPillarScores}
        height={400}
        className="custom-class"
      />
    )
    
    const chartContainer = container.firstChild as HTMLElement
    expect(chartContainer).toHaveClass('custom-class')
  })
})