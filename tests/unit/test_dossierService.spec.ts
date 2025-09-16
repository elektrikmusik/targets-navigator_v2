import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DossierService } from '../../src/services/dossierService'
import type { CompanyDossier, PillarScore } from '../../src/types/company'

// Mock Supabase client
vi.mock('../../src/lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: null,
            error: null
          }))
        })),
        data: [],
        error: null
      }))
    }))
  }
}))

describe('DossierService', () => {
  let service: DossierService

  beforeEach(() => {
    service = new DossierService()
    vi.clearAllMocks()
  })

  describe('getCompanyDossier', () => {
    it('should return company dossier with pillars', async () => {
      // Mock company data
      const mockSupabase = await import('../../src/lib/supabaseClient')
      mockSupabase.supabase.from = vi.fn((tableName) => {
        if (tableName === 'company_overview') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn(() => ({
                  data: {
                    key: 'test-company-1',
                    englishName: 'Test Company',
                    website: 'https://test.com',
                    country: 'USA',
                    ticker: 'TEST',
                    Tier: 'Tier 1',
                    strategicFit: 8.0,
                    abilityToExecute: 9.0,
                    overallScore: 8.5,
                    finance_score: 8.2,
                    industry_score: 7.8,
                    H2Score: 8.5,
                    IPActivityScore: 7.9,
                    manufacturing_score: 8.1,
                    OwnershipScore: 8.3
                  },
                  error: null
                }))
              }))
            }))
          }
        } else {
          // Pillar tables
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                data: [{
                  key: 'test-company-1',
                  score: 8.2,
                  rationale_snippet: 'Strong performance',
                  top_features: ['Feature 1', 'Feature 2'],
                  evaluation_date: '2024-01-01',
                  source_url: 'https://source.com',
                  last_verified_at: '2024-01-01T00:00:00Z'
                }],
                error: null
              }))
            }))
          }
        }
      })

      const result = await service.getCompanyDossier('test-company-1')
      
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('error')
      expect(result.data).toHaveProperty('company')
      expect(result.data).toHaveProperty('pillars')
      expect(Array.isArray(result.data?.pillars)).toBe(true)
    })

    it('should handle company not found', async () => {
      const mockSupabase = await import('../../src/lib/supabaseClient')
      mockSupabase.supabase.from = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => ({
              data: null,
              error: { message: 'Company not found' }
            }))
          }))
        }))
      }))

      const result = await service.getCompanyDossier('nonexistent-key')
      
      expect(result.error).toBe('Company not found')
      expect(result.data).toBeNull()
    })

    it('should handle pillar loading errors gracefully', async () => {
      // Mock company data but pillar errors
      const mockSupabase = await import('../../src/lib/supabaseClient')
      mockSupabase.supabase.from = vi.fn((tableName) => {
        if (tableName === 'company_overview') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn(() => ({
                  data: {
                    key: 'test-company-1',
                    englishName: 'Test Company',
                    country: 'USA',
                    strategicFit: 8.0,
                    abilityToExecute: 9.0,
                    overallScore: 8.5,
                    finance_score: 8.2,
                    industry_score: 7.8,
                    H2Score: 8.5,
                    IPActivityScore: 7.9,
                    manufacturing_score: 8.1,
                    OwnershipScore: 8.3
                  },
                  error: null
                }))
              }))
            }))
          }
        } else {
          // Pillar tables with errors
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                data: null,
                error: { message: 'Pillar table error' }
              }))
            }))
          }
        }
      })

      const result = await service.getCompanyDossier('test-company-1')
      
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('error')
      expect(result.data).toHaveProperty('company')
      expect(result.data).toHaveProperty('pillars')
      expect(Array.isArray(result.data?.pillars)).toBe(true)
    })
  })

  describe('getPillarDetails', () => {
    it('should return pillar details for a specific pillar', async () => {
      const mockSupabase = await import('../../src/lib/supabaseClient')
      mockSupabase.supabase.from = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => ({
              data: {
                key: 'test-company-1',
                score: 8.2,
                rationale_snippet: 'Strong financial performance',
                top_features: ['Revenue Growth', 'Profit Margins'],
                evaluation_date: '2024-01-01',
                source_url: 'https://source.com',
                last_verified_at: '2024-01-01T00:00:00Z'
              },
              error: null
            }))
          }))
        }))
      }))

      const result = await service.getPillarDetails('test-company-1', 'finance')
      
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('error')
      expect(result.data).toHaveProperty('pillar', 'finance')
      expect(result.data).toHaveProperty('score', 8.2)
    })

    it('should handle unknown pillar type', async () => {
      const result = await service.getPillarDetails('test-company-1', 'unknown' as any)
      
      expect(result.error).toBe('Unknown pillar type: unknown')
      expect(result.data).toBeNull()
    })

    it('should handle pillar not found', async () => {
      const mockSupabase = await import('../../src/lib/supabaseClient')
      mockSupabase.supabase.from = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => ({
              data: null,
              error: { message: 'Pillar not found' }
            }))
          }))
        }))
      }))

      const result = await service.getPillarDetails('test-company-1', 'finance')
      
      expect(result.error).toBe('Pillar not found')
      expect(result.data).toBeNull()
    })
  })
})
