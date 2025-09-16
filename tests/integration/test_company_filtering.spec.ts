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

describe('Company filtering integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should filter companies by geography', async () => {
    render(<CombinedView />)
    
    await waitFor(() => {
      expect(screen.getByText('3 companies')).toBeInTheDocument()
    })
    
    // Find and interact with geography filter
    const geographyFilter = screen.getByLabelText('Geography')
    fireEvent.change(geographyFilter, { target: { value: 'USA' } })
    
    // Should show filtered results
    await waitFor(() => {
      expect(screen.getByText('Test Company 1')).toBeInTheDocument()
      expect(screen.getByText('Test Company 3')).toBeInTheDocument()
      // Germany company should not be visible
      expect(screen.queryByText('Test Company 2')).not.toBeInTheDocument()
    })
  })

  it('should filter companies by tier', async () => {
    render(<CombinedView />)
    
    await waitFor(() => {
      expect(screen.getByText('3 companies')).toBeInTheDocument()
    })
    
    // Find and interact with tier filter
    const tierFilter = screen.getByLabelText('Company Tier')
    fireEvent.change(tierFilter, { target: { value: 'Tier 1' } })
    
    // Should show only Tier 1 companies
    await waitFor(() => {
      expect(screen.getByText('Test Company 1')).toBeInTheDocument()
      expect(screen.queryByText('Test Company 2')).not.toBeInTheDocument()
      expect(screen.queryByText('Test Company 3')).not.toBeInTheDocument()
    })
  })

  it('should clear all filters', async () => {
    render(<CombinedView />)
    
    await waitFor(() => {
      expect(screen.getByText('3 companies')).toBeInTheDocument()
    })
    
    // Apply a filter first
    const geographyFilter = screen.getByLabelText('Geography')
    fireEvent.change(geographyFilter, { target: { value: 'USA' } })
    
    await waitFor(() => {
      expect(screen.queryByText('Test Company 2')).not.toBeInTheDocument()
    })
    
    // Clear all filters
    const clearButton = screen.getByText('Clear All')
    fireEvent.click(clearButton)
    
    // Should show all companies again
    await waitFor(() => {
      expect(screen.getByText('Test Company 1')).toBeInTheDocument()
      expect(screen.getByText('Test Company 2')).toBeInTheDocument()
      expect(screen.getByText('Test Company 3')).toBeInTheDocument()
    })
  })

  it('should show active filter count', async () => {
    render(<CombinedView />)
    
    await waitFor(() => {
      expect(screen.getByText('3 companies')).toBeInTheDocument()
    })
    
    // Apply a filter
    const geographyFilter = screen.getByLabelText('Geography')
    fireEvent.change(geographyFilter, { target: { value: 'USA' } })
    
    // Should show active filter count
    await waitFor(() => {
      expect(screen.getByText('Clear All (1)')).toBeInTheDocument()
    })
  })

  it('should handle multiple filters simultaneously', async () => {
    render(<CombinedView />)
    
    await waitFor(() => {
      expect(screen.getByText('3 companies')).toBeInTheDocument()
    })
    
    // Apply geography filter
    const geographyFilter = screen.getByLabelText('Geography')
    fireEvent.change(geographyFilter, { target: { value: 'USA' } })
    
    // Apply tier filter
    const tierFilter = screen.getByLabelText('Company Tier')
    fireEvent.change(tierFilter, { target: { value: 'Tier 1' } })
    
    // Should show only companies matching both filters
    await waitFor(() => {
      expect(screen.getByText('Test Company 1')).toBeInTheDocument()
      expect(screen.queryByText('Test Company 2')).not.toBeInTheDocument()
      expect(screen.queryByText('Test Company 3')).not.toBeInTheDocument()
    })
  })
})
