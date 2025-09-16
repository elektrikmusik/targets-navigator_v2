import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CompanyOverviewService } from '../../src/services/companyOverviewService'
import type { CompanyOverview, CompanyFilters } from '../../src/types/company'

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
        in: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => ({
              range: vi.fn(() => ({
                data: [],
                error: null,
                count: 0
              }))
            }))
          }))
        })),
        order: vi.fn(() => ({
          order: vi.fn(() => ({
            order: vi.fn(() => ({
              limit: vi.fn(() => ({
                range: vi.fn(() => ({
                  data: [],
                  error: null,
                  count: 0
                }))
              }))
            }))
          }))
        })),
        limit: vi.fn(() => ({
          range: vi.fn(() => ({
            data: [],
            error: null,
            count: 0
          }))
        })),
        range: vi.fn(() => ({
          data: [],
          error: null,
          count: 0
        }))
      }))
    }))
  }
}))

describe('CompanyOverviewService', () => {
  let service: CompanyOverviewService

  beforeEach(() => {
    service = new CompanyOverviewService()
    vi.clearAllMocks()
  })

  describe('getCompanies', () => {
    it('should return companies with default options', async () => {
      const result = await service.getCompanies()
      
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('count')
      expect(result).toHaveProperty('error')
      expect(Array.isArray(result.data)).toBe(true)
    })

    it('should handle filters correctly', async () => {
      const filters: CompanyFilters = {
        countries: ['USA', 'Germany'],
        tiers: ['Tier 1', 'Tier 2']
      }

      const result = await service.getCompanies({ filters })
      
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('count')
      expect(result).toHaveProperty('error')
    })

    it('should handle sorting options', async () => {
      const result = await service.getCompanies({
        sortBy: 'overallScore',
        sortOrder: 'desc'
      })
      
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('count')
      expect(result).toHaveProperty('error')
    })

    it('should handle pagination', async () => {
      const result = await service.getCompanies({
        limit: 10,
        offset: 20
      })
      
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('count')
      expect(result).toHaveProperty('error')
    })

    it('should handle errors gracefully', async () => {
      // Mock an error response
      const mockSupabase = await import('../../src/lib/supabaseClient')
      mockSupabase.supabase.from = vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => ({
            order: vi.fn(() => ({
              order: vi.fn(() => ({
                limit: vi.fn(() => ({
                  range: vi.fn(() => ({
                    data: null,
                    error: { message: 'Database error' },
                    count: 0
                  }))
                }))
              }))
            }))
          }))
        }))
      }))

      const result = await service.getCompanies()
      
      expect(result.error).toBe('Database error')
      expect(result.data).toEqual([])
      expect(result.count).toBe(0)
    })
  })

  describe('getCompanyByKey', () => {
    it('should return a single company by key', async () => {
      const result = await service.getCompanyByKey('test-key')
      
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('error')
    })

    it('should handle company not found', async () => {
      // Mock an error response
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

      const result = await service.getCompanyByKey('nonexistent-key')
      
      expect(result.error).toBe('Company not found')
      expect(result.data).toBeNull()
    })
  })
})
