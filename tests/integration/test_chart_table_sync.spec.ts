import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { CombinedView } from '../../src/pages/CombinedView'

// Mock the services
vi.mock('../../src/services/companyOverviewService', () => ({
  CompanyOverviewService: vi.fn().mockImplementation(() => ({
    getCompanies: vi.fn().mockResolvedValue({
      data: [
        {
          key: 'test-company-1',
          name: 'Test Company 1',
          geography: 'USA',
          overallScore: 8.5,
          strategicFit: 8.0,
          abilityToExecute: 9.0,
          tier: 'Tier 1',
          website: 'https://test1.com',
          ticker: 'TEST1',
          tags: ['technology', 'ai']
        },
        {
          key: 'test-company-2', 
          name: 'Test Company 2',
          geography: 'Germany',
          overallScore: 7.2,
          strategicFit: 7.5,
          abilityToExecute: 6.9,
          tier: 'Tier 2',
          website: 'https://test2.com',
          ticker: 'TEST2',
          tags: ['manufacturing', 'automotive']
        },
        {
          key: 'test-company-3',
          name: 'Test Company 3', 
          geography: 'USA',
          overallScore: 6.8,
          strategicFit: 6.5,
          abilityToExecute: 7.1,
          tier: 'Tier 3',
          website: 'https://test3.com',
          ticker: 'TEST3',
          tags: ['energy', 'renewable']
        }
      ],
      error: null
    })
  }))
}))

// Mock the BubbleChart component
vi.mock('../../src/components/charts/BubbleChart', () => ({
  BubbleChart: ({ selectedKeys, onSelectionChange, data }: any) => {
    return React.createElement('div', { 'data-testid': 'bubble-chart' }, [
      React.createElement('div', { key: 'chart-info' }, `Chart with ${data.length} companies`),
      React.createElement('div', { key: 'selected-info' }, `Selected: ${selectedKeys.length} companies`),
      React.createElement('button', {
        key: 'select-btn',
        onClick: () => onSelectionChange(['test-company-1', 'test-company-2']),
        'data-testid': 'select-companies'
      }, 'Select Companies'),
      React.createElement('button', {
        key: 'clear-btn',
        onClick: () => onSelectionChange([]),
        'data-testid': 'clear-selection'
      }, 'Clear Selection')
    ])
  }
}))

describe('Chart-table synchronization integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should synchronize selection between chart and table', async () => {
    render(<CombinedView />)
    
    await waitFor(() => {
      expect(screen.getByText('3 companies')).toBeInTheDocument()
    })
    
    // Initially no selection
    expect(screen.getByText('Selected: 0 companies')).toBeInTheDocument()
    
    // Select companies from chart
    const selectButton = screen.getByTestId('select-companies')
    fireEvent.click(selectButton)
    
    // Should update selection count
    await waitFor(() => {
      expect(screen.getByText('Selected: 2 companies')).toBeInTheDocument()
      expect(screen.getByText('2 companies selected')).toBeInTheDocument()
    })
  })

  it('should clear selection from chart', async () => {
    render(<CombinedView />)
    
    await waitFor(() => {
      expect(screen.getByText('3 companies')).toBeInTheDocument()
    })
    
    // Select companies first
    const selectButton = screen.getByTestId('select-companies')
    fireEvent.click(selectButton)
    
    await waitFor(() => {
      expect(screen.getByText('Selected: 2 companies')).toBeInTheDocument()
    })
    
    // Clear selection
    const clearButton = screen.getByTestId('clear-selection')
    fireEvent.click(clearButton)
    
    // Should clear selection
    await waitFor(() => {
      expect(screen.getByText('Selected: 0 companies')).toBeInTheDocument()
      expect(screen.queryByText('companies selected')).not.toBeInTheDocument()
    })
  })

  it('should clear selection from table clear button', async () => {
    render(<CombinedView />)
    
    await waitFor(() => {
      expect(screen.getByText('3 companies')).toBeInTheDocument()
    })
    
    // Select companies first
    const selectButton = screen.getByTestId('select-companies')
    fireEvent.click(selectButton)
    
    await waitFor(() => {
      expect(screen.getByText('Selected: 2 companies')).toBeInTheDocument()
    })
    
    // Use table clear button
    const clearButton = screen.getByText('Clear Selection')
    fireEvent.click(clearButton)
    
    // Should clear selection
    await waitFor(() => {
      expect(screen.getByText('Selected: 0 companies')).toBeInTheDocument()
    })
  })

  it('should show selected companies count in header', async () => {
    render(<CombinedView />)
    
    await waitFor(() => {
      expect(screen.getByText('3 companies')).toBeInTheDocument()
    })
    
    // Select companies
    const selectButton = screen.getByTestId('select-companies')
    fireEvent.click(selectButton)
    
    // Should show count in header
    await waitFor(() => {
      expect(screen.getByText('2 companies selected')).toBeInTheDocument()
    })
  })

  it('should disable clear button when no selection', async () => {
    render(<CombinedView />)
    
    await waitFor(() => {
      expect(screen.getByText('3 companies')).toBeInTheDocument()
    })
    
    // Clear button should be disabled initially
    const clearButton = screen.getByText('Clear Selection')
    expect(clearButton).toBeDisabled()
    
    // Select companies
    const selectButton = screen.getByTestId('select-companies')
    fireEvent.click(selectButton)
    
    // Clear button should be enabled
    await waitFor(() => {
      expect(clearButton).not.toBeDisabled()
    })
  })
})
