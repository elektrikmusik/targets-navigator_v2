import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
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
        }
      ],
      error: null
    })
  }))
}))

describe('Company list loading integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should load and display company list', async () => {
    render(<CombinedView />)
    
    // Should show loading state initially
    expect(screen.getByText('Loading companies...')).toBeInTheDocument()
    
    // Wait for companies to load
    await waitFor(() => {
      expect(screen.getByText('Test Company 1')).toBeInTheDocument()
      expect(screen.getByText('Test Company 2')).toBeInTheDocument()
    })
    
    // Should show company count
    expect(screen.getByText('2 companies')).toBeInTheDocument()
  })

  it('should display company details correctly', async () => {
    render(<CombinedView />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Company 1')).toBeInTheDocument()
    })
    
    // Check company details
    expect(screen.getByText('USA')).toBeInTheDocument()
    expect(screen.getByText('TEST1')).toBeInTheDocument()
    expect(screen.getByText('technology')).toBeInTheDocument()
    expect(screen.getByText('Overall: 8.5')).toBeInTheDocument()
  })

  it('should handle loading state', async () => {
    // Mock a delayed response
    const { CompanyOverviewService } = await import('../../src/services/companyOverviewService')
    const mockService = new CompanyOverviewService()
    mockService.getCompanies = vi.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        data: [],
        error: null
      }), 100))
    )
    
    render(<CombinedView />)
    
    // Should show loading initially
    expect(screen.getByText('Loading companies...')).toBeInTheDocument()
  })

  it('should handle error state', async () => {
    // Mock an error response
    const { CompanyOverviewService } = await import('../../src/services/companyOverviewService')
    const mockService = new CompanyOverviewService()
    mockService.getCompanies = vi.fn().mockResolvedValue({
      data: [],
      error: 'Failed to load companies'
    })
    
    render(<CombinedView />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load data')).toBeInTheDocument()
      expect(screen.getByText('Failed to load companies')).toBeInTheDocument()
    })
  })
})
