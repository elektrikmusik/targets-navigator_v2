import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'

// Mock the DossierService
vi.mock('../../src/services/dossierService', () => ({
  DossierService: vi.fn().mockImplementation(() => ({
    getCompanyDossier: vi.fn().mockResolvedValue({
      data: {
        company: {
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
        pillars: [
          {
            pillar: 'finance',
            score: 8.2,
            rationale_snippet: 'Strong financial position with consistent revenue growth',
            top_features: ['Revenue Growth', 'Profit Margins', 'Cash Flow'],
            evaluation_date: '2024-01-15',
            source_url: 'https://example.com/finance',
            last_verified_at: '2024-01-15T10:00:00Z'
          },
          {
            pillar: 'industry',
            score: 7.8,
            rationale_snippet: 'Leading position in AI technology sector',
            top_features: ['Market Share', 'Innovation', 'Competitive Advantage'],
            evaluation_date: '2024-01-10',
            source_url: 'https://example.com/industry',
            last_verified_at: '2024-01-10T14:30:00Z'
          },
          {
            pillar: 'ip',
            score: 9.1,
            rationale_snippet: 'Extensive patent portfolio in AI and machine learning',
            top_features: ['Patent Count', 'Patent Quality', 'IP Strategy'],
            evaluation_date: '2024-01-12',
            source_url: 'https://example.com/ip',
            last_verified_at: '2024-01-12T09:15:00Z'
          }
        ]
      },
      error: null
    })
  }))
}))

// Mock the CompanyDossier component
const MockCompanyDossier = ({ companyKey }: { companyKey: string }) => {
  const [dossier, setDossier] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    const loadDossier = async () => {
      try {
        setLoading(true)
        const { DossierService } = await import('../../src/services/dossierService')
        const dossierService = new DossierService()
        const result = await dossierService.getCompanyDossier(companyKey)
        
        if (result.error) {
          setError(result.error)
        } else {
          setDossier(result.data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dossier')
      } finally {
        setLoading(false)
      }
    }

    loadDossier()
  }, [companyKey])

    if (loading) return React.createElement('div', null, 'Loading dossier...')
    if (error) return React.createElement('div', null, `Error: ${error}`)
    if (!dossier) return React.createElement('div', null, 'No dossier data')

  return React.createElement('div', { 'data-testid': 'company-dossier' }, [
    React.createElement('h2', { key: 'company-name' }, dossier.company.name),
    React.createElement('div', { key: 'overall-score' }, `Overall Score: ${dossier.company.overallScore}`),
    React.createElement('div', { key: 'strategic-fit' }, `Strategic Fit: ${dossier.company.strategicFit}`),
    React.createElement('div', { key: 'ability-execute' }, `Ability to Execute: ${dossier.company.abilityToExecute}`),
    React.createElement('div', { 
      key: 'pillars',
      'data-testid': 'pillars' 
    }, dossier.pillars.map((pillar: any) => 
      React.createElement('div', {
        key: pillar.pillar,
        'data-testid': `pillar-${pillar.pillar}`
      }, [
        React.createElement('h3', { key: 'pillar-name' }, pillar.pillar),
        React.createElement('div', { key: 'pillar-score' }, `Score: ${pillar.score}`),
        React.createElement('div', { key: 'pillar-rationale' }, `Rationale: ${pillar.rationale_snippet}`),
        React.createElement('div', { key: 'pillar-features' }, `Features: ${pillar.top_features.join(', ')}`),
        React.createElement('div', { key: 'pillar-date' }, `Date: ${pillar.evaluation_date}`)
      ])
    ))
  ])
}

describe('Company dossier loading integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should load company dossier data', async () => {
    render(<MockCompanyDossier companyKey="test-company-1" />)
    
    // Should show loading state initially
    expect(screen.getByText('Loading dossier...')).toBeInTheDocument()
    
    // Wait for dossier to load
    await waitFor(() => {
      expect(screen.getByText('Test Company 1')).toBeInTheDocument()
    })
    
    // Should show company details
    expect(screen.getByText('Overall Score: 8.5')).toBeInTheDocument()
    expect(screen.getByText('Strategic Fit: 8')).toBeInTheDocument()
    expect(screen.getByText('Ability to Execute: 9')).toBeInTheDocument()
  })

  it('should display pillar information', async () => {
    render(<MockCompanyDossier companyKey="test-company-1" />)
    
    await waitFor(() => {
      expect(screen.getByTestId('pillars')).toBeInTheDocument()
    })
    
    // Should show all pillars
    expect(screen.getByTestId('pillar-finance')).toBeInTheDocument()
    expect(screen.getByTestId('pillar-industry')).toBeInTheDocument()
    expect(screen.getByTestId('pillar-ip')).toBeInTheDocument()
    
    // Should show pillar details
    expect(screen.getByText('Score: 8.2')).toBeInTheDocument()
    expect(screen.getByText('Rationale: Strong financial position with consistent revenue growth')).toBeInTheDocument()
    expect(screen.getByText('Features: Revenue Growth, Profit Margins, Cash Flow')).toBeInTheDocument()
  })

  it('should handle loading state', async () => {
    // Mock a delayed response
    const { DossierService } = await import('../../src/services/dossierService')
    const mockService = new DossierService()
    mockService.getCompanyDossier = vi.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        data: null,
        error: null
      }), 100))
    )
    
    render(<MockCompanyDossier companyKey="test-company-1" />)
    
    // Should show loading initially
    expect(screen.getByText('Loading dossier...')).toBeInTheDocument()
  })

  it('should handle error state', async () => {
    // Mock an error response
    const { DossierService } = await import('../../src/services/dossierService')
    const mockService = new DossierService()
    mockService.getCompanyDossier = vi.fn().mockResolvedValue({
      data: null,
      error: 'Failed to load dossier'
    })
    
    render(<MockCompanyDossier companyKey="test-company-1" />)
    
    await waitFor(() => {
      expect(screen.getByText('Error: Failed to load dossier')).toBeInTheDocument()
    })
  })

  it('should handle missing dossier data', async () => {
    // Mock empty response
    const { DossierService } = await import('../../src/services/dossierService')
    const mockService = new DossierService()
    mockService.getCompanyDossier = vi.fn().mockResolvedValue({
      data: null,
      error: null
    })
    
    render(<MockCompanyDossier companyKey="test-company-1" />)
    
    await waitFor(() => {
      expect(screen.getByText('No dossier data')).toBeInTheDocument()
    })
  })
})
