import jsPDF from 'jspdf'
import type { Company, CompanyDossier } from '../types/company'

export interface PDFExportResult {
  success: boolean
  blob?: Blob
  filename?: string
  error?: string
}

export class PDFExportService {
  private readonly BRAND_COLOR = '#2563eb' // Blue-600
  private readonly TEXT_COLOR = '#1f2937' // Gray-800
  private readonly MUTED_COLOR = '#6b7280' // Gray-500

  async generateCompanyReport(company: Company): Promise<PDFExportResult> {
    try {
      const doc = new jsPDF('p', 'mm', 'a4')
      
      // Set up fonts and colors
      doc.setFont('helvetica')
      doc.setTextColor(this.TEXT_COLOR)

      // Header
      this.addHeader(doc, 'Company Report')
      
      // Company basic info
      this.addCompanyInfo(doc, company)
      
      // Scores section
      this.addScoresSection(doc, company)
      
      // Footer
      this.addFooter(doc)

      // Generate blob
      const pdfBlob = doc.output('blob')
      const filename = this.generateFilename(company, 'company-report')

      return {
        success: true,
        blob: pdfBlob,
        filename
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate PDF'
      }
    }
  }

  async generateCompareReport(companies: Company[]): Promise<PDFExportResult> {
    try {
      if (companies.length === 0) {
        return {
          success: false,
          error: 'No companies provided for comparison'
        }
      }

      if (companies.length > 5) {
        return {
          success: false,
          error: 'Cannot compare more than 5 companies'
        }
      }

      const doc = new jsPDF('p', 'mm', 'a4')
      
      // Set up fonts and colors
      doc.setFont('helvetica')
      doc.setTextColor(this.TEXT_COLOR)

      // Header
      this.addHeader(doc, 'Company Comparison Report')
      
      // Comparison table
      this.addComparisonTable(doc, companies)
      
      // Individual company details
      companies.forEach((company, index) => {
        if (index > 0) {
          doc.addPage()
        }
        this.addCompanyInfo(doc, company)
        this.addScoresSection(doc, company)
      })
      
      // Footer
      this.addFooter(doc)

      // Generate blob
      const pdfBlob = doc.output('blob')
      const filename = this.generateFilename(companies[0], 'compare-report')

      return {
        success: true,
        blob: pdfBlob,
        filename
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate PDF'
      }
    }
  }

  async generateDossierReport(dossier: CompanyDossier): Promise<PDFExportResult> {
    try {
      const doc = new jsPDF('p', 'mm', 'a4')
      
      // Set up fonts and colors
      doc.setFont('helvetica')
      doc.setTextColor(this.TEXT_COLOR)

      // Header
      this.addHeader(doc, 'Company Dossier')
      
      // Company basic info
      this.addCompanyInfo(doc, dossier.company)
      
      // Scores section
      this.addScoresSection(doc, dossier.company)
      
      // Pillars section
      this.addPillarsSection(doc, dossier.pillars)
      
      // Footer
      this.addFooter(doc)

      // Generate blob
      const pdfBlob = doc.output('blob')
      const filename = this.generateFilename(dossier.company, 'dossier')

      return {
        success: true,
        blob: pdfBlob,
        filename
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate PDF'
      }
    }
  }

  private addHeader(doc: jsPDF, title: string): void {
    // Title
    doc.setFontSize(20)
    doc.setTextColor(this.BRAND_COLOR)
    doc.text(title, 20, 30)
    
    // Date
    doc.setFontSize(10)
    doc.setTextColor(this.MUTED_COLOR)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 40)
    
    // Line separator
    doc.setDrawColor(this.BRAND_COLOR)
    doc.setLineWidth(0.5)
    doc.line(20, 45, 190, 45)
  }

  private addCompanyInfo(doc: jsPDF, company: Company): void {
    let yPosition = 60
    
    // Company name
    doc.setFontSize(16)
    doc.setTextColor(this.TEXT_COLOR)
    doc.text(company.name, 20, yPosition)
    yPosition += 10
    
    // Basic details
    doc.setFontSize(12)
    doc.setTextColor(this.MUTED_COLOR)
    
    if (company.ticker) {
      doc.text(`Ticker: ${company.ticker}`, 20, yPosition)
      yPosition += 7
    }
    
    doc.text(`Geography: ${company.geography}`, 20, yPosition)
    yPosition += 7
    
    if (company.website) {
      doc.text(`Website: ${company.website}`, 20, yPosition)
      yPosition += 7
    }
    
    if (company.tier) {
      doc.text(`Tier: ${company.tier}`, 20, yPosition)
      yPosition += 7
    }
    
    if (company.tags && company.tags.length > 0) {
      doc.text(`Tags: ${company.tags.join(', ')}`, 20, yPosition)
      yPosition += 7
    }
  }

  private addScoresSection(doc: jsPDF, company: Company): void {
    let yPosition = 120
    
    // Section title
    doc.setFontSize(14)
    doc.setTextColor(this.BRAND_COLOR)
    doc.text('Scores', 20, yPosition)
    yPosition += 10
    
    // Scores table
    doc.setFontSize(12)
    doc.setTextColor(this.TEXT_COLOR)
    
    const scores = [
      { label: 'Overall Score', value: company.overallScore.toFixed(1) },
      { label: 'Strategic Fit', value: company.strategicFit.toFixed(1) },
      { label: 'Ability to Execute', value: company.abilityToExecute.toFixed(1) }
    ]
    
    scores.forEach(score => {
      doc.text(`${score.label}:`, 20, yPosition)
      doc.text(score.value, 80, yPosition)
      yPosition += 8
    })
  }

  private addPillarsSection(doc: jsPDF, pillars: any[]): void {
    let yPosition = 160
    
    // Section title
    doc.setFontSize(14)
    doc.setTextColor(this.BRAND_COLOR)
    doc.text('Pillar Analysis', 20, yPosition)
    yPosition += 10
    
    // Pillars
    doc.setFontSize(10)
    doc.setTextColor(this.TEXT_COLOR)
    
    pillars.forEach(pillar => {
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20
      }
      
      // Pillar name
      doc.setFontSize(12)
      doc.setTextColor(this.BRAND_COLOR)
      doc.text(pillar.pillar.charAt(0).toUpperCase() + pillar.pillar.slice(1), 20, yPosition)
      yPosition += 8
      
      // Pillar score
      doc.setFontSize(10)
      doc.setTextColor(this.TEXT_COLOR)
      doc.text(`Score: ${pillar.score?.toFixed(1) || 'N/A'}`, 20, yPosition)
      yPosition += 6
      
      // Rationale
      if (pillar.rationale_snippet) {
        const rationale = doc.splitTextToSize(pillar.rationale_snippet, 170)
        doc.text(rationale, 20, yPosition)
        yPosition += rationale.length * 4 + 5
      }
      
      // Features
      if (pillar.top_features && pillar.top_features.length > 0) {
        doc.text(`Key Features: ${pillar.top_features.join(', ')}`, 20, yPosition)
        yPosition += 6
      }
      
      yPosition += 5
    })
  }

  private addComparisonTable(doc: jsPDF, companies: Company[]): void {
    let yPosition = 60
    
    // Table header
    doc.setFontSize(12)
    doc.setTextColor(this.BRAND_COLOR)
    doc.text('Company Comparison', 20, yPosition)
    yPosition += 10
    
    // Table
    doc.setFontSize(10)
    doc.setTextColor(this.TEXT_COLOR)
    
    // Headers
    const headers = ['Company', 'Overall', 'Strategic Fit', 'Ability to Execute', 'Tier']
    const colWidths = [60, 20, 30, 30, 20]
    let xPosition = 20
    
    headers.forEach((header, index) => {
      doc.text(header, xPosition, yPosition)
      xPosition += colWidths[index]
    })
    yPosition += 8
    
    // Data rows
    companies.forEach(company => {
      xPosition = 20
      const rowData = [
        company.name.length > 25 ? company.name.substring(0, 25) + '...' : company.name,
        company.overallScore.toFixed(1),
        company.strategicFit.toFixed(1),
        company.abilityToExecute.toFixed(1),
        company.tier || 'N/A'
      ]
      
      rowData.forEach((data, index) => {
        doc.text(data, xPosition, yPosition)
        xPosition += colWidths[index]
      })
      yPosition += 6
    })
  }

  private addFooter(doc: jsPDF): void {
    const pageHeight = doc.internal.pageSize.height
    const footerY = pageHeight - 20
    
    // Footer line
    doc.setDrawColor(this.MUTED_COLOR)
    doc.setLineWidth(0.3)
    doc.line(20, footerY - 5, 190, footerY - 5)
    
    // Footer text
    doc.setFontSize(8)
    doc.setTextColor(this.MUTED_COLOR)
    doc.text('Generated by Targets Navigator', 20, footerY)
    doc.text(`Page ${doc.internal.getCurrentPageInfo().pageNumber}`, 170, footerY)
  }

  private generateFilename(company: Company, reportType: string): string {
    const companyName = company.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
    const date = new Date().toISOString().split('T')[0]
    return `${companyName}-${reportType}-${date}.pdf`
  }
}
