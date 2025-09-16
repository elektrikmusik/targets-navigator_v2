import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BubbleChart } from '../../src/components/charts/BubbleChart'
import type { CompanyOverview } from '../../src/types/company'

// Mock Plotly
vi.mock('react-plotly.js', () => ({
  default: ({ data, layout, config }: any) => {
    return (
      <div data-testid="plotly-chart">
        <div>Chart Data: {JSON.stringify(data)}</div>
        <div>Chart Layout: {JSON.stringify(layout)}</div>
        <div>Chart Config: {JSON.stringify(config)}</div>
      </div>
    )
  }
}))

describe('Chart Components', () => {
  const mockCompanies: CompanyOverview[] = [
    {
      key: 'company-1',
      name: 'Company 1',
      geography: 'USA',
      overallScore: 8.5,
      strategicFit: 8.0,
      abilityToExecute: 9.0,
      tier: 'Tier 1',
      website: 'https://company1.com',
      ticker: 'COMP1',
      tags: ['technology']
    },
    {
      key: 'company-2',
      name: 'Company 2',
      geography: 'Germany',
      overallScore: 7.2,
      strategicFit: 7.5,
      abilityToExecute: 6.9,
      tier: 'Tier 2',
      website: 'https://company2.com',
      ticker: 'COMP2',
      tags: ['manufacturing']
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('BubbleChart', () => {
    it('should render with company data', () => {
      render(
        <BubbleChart
          data={mockCompanies}
          xKey="strategicFit"
          yKey="abilityToExecute"
          sizeKey="overallScore"
          colorKey="tier"
          selectedKeys={[]}
          onSelectionChange={() => {}}
          height={400}
        />
      )

      expect(screen.getByTestId('plotly-chart')).toBeInTheDocument()
    })

    it('should handle empty data', () => {
      render(
        <BubbleChart
          data={[]}
          xKey="strategicFit"
          yKey="abilityToExecute"
          sizeKey="overallScore"
          colorKey="tier"
          selectedKeys={[]}
          onSelectionChange={() => {}}
          height={400}
        />
      )

      expect(screen.getByTestId('plotly-chart')).toBeInTheDocument()
    })

    it('should handle selection changes', () => {
      const onSelectionChange = vi.fn()
      
      render(
        <BubbleChart
          data={mockCompanies}
          xKey="strategicFit"
          yKey="abilityToExecute"
          sizeKey="overallScore"
          colorKey="tier"
          selectedKeys={['company-1']}
          onSelectionChange={onSelectionChange}
          height={400}
        />
      )

      expect(screen.getByTestId('plotly-chart')).toBeInTheDocument()
      // Note: In a real test, you'd simulate user interaction to test onSelectionChange
    })

    it('should handle different data keys', () => {
      render(
        <BubbleChart
          data={mockCompanies}
          xKey="overallScore"
          yKey="strategicFit"
          sizeKey="abilityToExecute"
          colorKey="geography"
          selectedKeys={[]}
          onSelectionChange={() => {}}
          height={400}
        />
      )

      expect(screen.getByTestId('plotly-chart')).toBeInTheDocument()
    })

    it('should handle null/undefined values gracefully', () => {
      const companiesWithNulls = [
        {
          ...mockCompanies[0],
          strategicFit: null as any,
          abilityToExecute: undefined as any
        }
      ]

      render(
        <BubbleChart
          data={companiesWithNulls}
          xKey="strategicFit"
          yKey="abilityToExecute"
          sizeKey="overallScore"
          colorKey="tier"
          selectedKeys={[]}
          onSelectionChange={() => {}}
          height={400}
        />
      )

      expect(screen.getByTestId('plotly-chart')).toBeInTheDocument()
    })
  })
})
