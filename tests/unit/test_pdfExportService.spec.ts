import { describe, it, expect, beforeEach, vi } from 'vitest'
import { PDFExportService } from '../../src/services/pdfExportService'
import type { Company, CompanyDossier } from '../../src/types/company'

// Mock jsPDF
vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(() => ({
    addImage: vi.fn(),
    text: vi.fn(),
    setFontSize: vi.fn(),
    setTextColor: vi.fn(),
    addPage: vi.fn(),
    save: vi.fn(),
    output: vi.fn().mockReturnValue('PDF content'),
    setDrawColor: vi.fn(),
    setLineWidth: vi.fn(),
    line: vi.fn(),
    internal: {
      pageSize: { height: 297 },
      getCurrentPageInfo: () => ({ pageNumber: 1 })
    }
  }))
}))

describe('PDFExportService', () => {
  let service: PDFExportService
  let mockCompany: Company
  let mockDossier: CompanyDossier

  beforeEach(() => {
    service = new PDFExportService()
    
    mockCompany = {
      key: 'test-company-1',
      name: 'Test Company',
      geography: 'USA',
      overallScore: 8.5,
      strategicFit: 8.0,
      abilityToExecute: 9.0,
      tier: 'Tier 1',
      website: 'https://test.com',
      ticker: 'TEST',
      tags: ['technology', 'ai']
    }

    mockDossier = {
      company: mockCompany,
      pillars: [
        {
          key: 'test-company-1',
          pillar: 'finance',
          score: 8.2,
          rationale_snippet: 'Strong financial performance',
          top_features: ['Revenue Growth', 'Profit Margins'],
          evaluation_date: '2024-01-01',
          source_url: 'https://source.com',
          last_verified_at: '2024-01-01T00:00:00Z'
        },
        {
          key: 'test-company-1',
          pillar: 'industry',
          score: 7.8,
          rationale_snippet: 'Leading industry position',
          top_features: ['Market Share', 'Innovation'],
          evaluation_date: '2024-01-01',
          source_url: 'https://source.com',
          last_verified_at: '2024-01-01T00:00:00Z'
        }
      ]
    }
  })

  describe('generateCompanyReport', () => {
    it('should generate a company report PDF', async () => {
      const result = await service.generateCompanyReport(mockCompany)
      
      expect(result.success).toBe(true)
      expect(result.blob).toBeInstanceOf(Blob)
      expect(result.filename).toContain('test-company')
      expect(result.filename).toContain('company-report')
      expect(result.filename).toMatch(/\.pdf$/)
    })

    it('should handle PDF generation errors', async () => {
      // Mock jsPDF to throw an error
      const mockJsPDF = await import('jspdf')
      mockJsPDF.default = vi.fn().mockImplementation(() => {
        throw new Error('PDF generation failed')
      })

      const result = await service.generateCompanyReport(mockCompany)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('PDF generation failed')
    })
  })

  describe('generateCompareReport', () => {
    it('should generate a compare report PDF', async () => {
      const companies = [mockCompany, { ...mockCompany, key: 'test-company-2', name: 'Test Company 2' }]
      
      const result = await service.generateCompareReport(companies)
      
      expect(result.success).toBe(true)
      expect(result.blob).toBeInstanceOf(Blob)
      expect(result.filename).toContain('compare-report')
      expect(result.filename).toMatch(/\.pdf$/)
    })

    it('should handle empty companies array', async () => {
      const result = await service.generateCompareReport([])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('No companies provided for comparison')
    })

    it('should handle too many companies', async () => {
      const companies = Array.from({ length: 6 }, (_, i) => ({
        ...mockCompany,
        key: `test-company-${i + 1}`,
        name: `Test Company ${i + 1}`
      }))
      
      const result = await service.generateCompareReport(companies)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Cannot compare more than 5 companies')
    })
  })

  describe('generateDossierReport', () => {
    it('should generate a dossier report PDF', async () => {
      const result = await service.generateDossierReport(mockDossier)
      
      expect(result.success).toBe(true)
      expect(result.blob).toBeInstanceOf(Blob)
      expect(result.filename).toContain('test-company')
      expect(result.filename).toContain('dossier')
      expect(result.filename).toMatch(/\.pdf$/)
    })

    it('should handle dossier with no pillars', async () => {
      const dossierWithoutPillars = {
        ...mockDossier,
        pillars: []
      }
      
      const result = await service.generateDossierReport(dossierWithoutPillars)
      
      expect(result.success).toBe(true)
      expect(result.blob).toBeInstanceOf(Blob)
    })
  })

  describe('filename generation', () => {
    it('should generate proper filenames with special characters', async () => {
      const companyWithSpecialChars = {
        ...mockCompany,
        name: 'Test & Company (Ltd.)'
      }
      
      const result = await service.generateCompanyReport(companyWithSpecialChars)
      
      expect(result.success).toBe(true)
      expect(result.filename).toContain('test-company-ltd')
      expect(result.filename).not.toContain('&')
      expect(result.filename).not.toContain('(')
      expect(result.filename).not.toContain(')')
    })

    it('should include date in filename', async () => {
      const result = await service.generateCompanyReport(mockCompany)
      
      expect(result.success).toBe(true)
      expect(result.filename).toMatch(/\d{4}-\d{2}-\d{2}/)
    })
  })
})
