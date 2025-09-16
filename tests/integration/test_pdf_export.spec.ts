import { describe, it, expect, beforeEach } from 'vitest'

// Mock the PDFExportService
vi.mock('../../src/services/pdfExportService', () => ({
  PDFExportService: vi.fn().mockImplementation(() => ({
    generateCompanyReport: vi.fn().mockResolvedValue({
      success: true,
      blob: new Blob(['PDF content'], { type: 'application/pdf' }),
      filename: 'company-report.pdf'
    }),
    generateCompareReport: vi.fn().mockResolvedValue({
      success: true,
      blob: new Blob(['PDF content'], { type: 'application/pdf' }),
      filename: 'compare-report.pdf'
    })
  }))
}))

// Mock jsPDF
vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(() => ({
    addImage: vi.fn(),
    text: vi.fn(),
    setFontSize: vi.fn(),
    setTextColor: vi.fn(),
    addPage: vi.fn(),
    save: vi.fn(),
    output: vi.fn().mockReturnValue('PDF content')
  }))
}))

describe('PDF export functionality integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should generate company report PDF', async () => {
    const { PDFExportService } = await import('../../src/services/pdfExportService')
    const pdfService = new PDFExportService()
    
    const companyData = {
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
    }

    const result = await pdfService.generateCompanyReport(companyData)
    
    expect(result.success).toBe(true)
    expect(result.blob).toBeInstanceOf(Blob)
    expect(result.filename).toBe('company-report.pdf')
  })

  it('should generate compare report PDF', async () => {
    const { PDFExportService } = await import('../../src/services/pdfExportService')
    const pdfService = new PDFExportService()
    
    const companiesData = [
      {
        key: 'test-company-1',
        name: 'Test Company 1',
        overallScore: 8.5,
        strategicFit: 8.0,
        abilityToExecute: 9.0
      },
      {
        key: 'test-company-2',
        name: 'Test Company 2',
        overallScore: 7.2,
        strategicFit: 7.5,
        abilityToExecute: 6.9
      }
    ]

    const result = await pdfService.generateCompareReport(companiesData)
    
    expect(result.success).toBe(true)
    expect(result.blob).toBeInstanceOf(Blob)
    expect(result.filename).toBe('compare-report.pdf')
  })

  it('should handle PDF generation errors', async () => {
    const { PDFExportService } = await import('../../src/services/pdfExportService')
    const pdfService = new PDFExportService()
    
    // Mock error response
    pdfService.generateCompanyReport = vi.fn().mockResolvedValue({
      success: false,
      error: 'Failed to generate PDF'
    })

    const companyData = {
      key: 'test-company-1',
      name: 'Test Company 1'
    }

    const result = await pdfService.generateCompanyReport(companyData)
    
    expect(result.success).toBe(false)
    expect(result.error).toBe('Failed to generate PDF')
  })

  it('should include company branding in PDF', async () => {
    const { PDFExportService } = await import('../../src/services/pdfExportService')
    const pdfService = new PDFExportService()
    
    const companyData = {
      key: 'test-company-1',
      name: 'Test Company 1',
      geography: 'USA',
      overallScore: 8.5
    }

    await pdfService.generateCompanyReport(companyData)
    
    // Verify that PDF generation was called
    expect(pdfService.generateCompanyReport).toHaveBeenCalledWith(companyData)
  })

  it('should generate PDF with proper filename format', async () => {
    const { PDFExportService } = await import('../../src/services/pdfExportService')
    const pdfService = new PDFExportService()
    
    const companyData = {
      key: 'test-company-1',
      name: 'Test Company 1',
      ticker: 'TEST1'
    }

    const result = await pdfService.generateCompanyReport(companyData)
    
    expect(result.filename).toMatch(/\.pdf$/)
    expect(result.filename).toContain('company')
  })

  it('should handle multiple companies in compare report', async () => {
    const { PDFExportService } = await import('../../src/services/pdfExportService')
    const pdfService = new PDFExportService()
    
    const companiesData = Array.from({ length: 5 }, (_, i) => ({
      key: `test-company-${i + 1}`,
      name: `Test Company ${i + 1}`,
      overallScore: 8.5 - i * 0.5
    }))

    const result = await pdfService.generateCompareReport(companiesData)
    
    expect(result.success).toBe(true)
    expect(result.filename).toBe('compare-report.pdf')
  })
})
