import React, { useState, useEffect } from 'react'
import type { Company, PillarScore } from '../types/company'
import { PDFExportService } from '../services/pdfExportService'
import { PillarScoreService } from '../services/pillarScoreService'
import { RadarChart } from './charts/RadarChart'

interface CompareModeProps {
  companies: Company[]
  onRemoveCompany: (companyKey: string) => void
  onClose: () => void
  className?: string
}

const MAX_COMPARE_COMPANIES = 5

export const CompareMode: React.FC<CompareModeProps> = ({
  companies,
  onRemoveCompany,
  onClose,
  className = ''
}) => {
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const [pillarScores, setPillarScores] = useState<PillarScore[]>([])
  const [isLoadingScores, setIsLoadingScores] = useState(false)
  const pdfService = new PDFExportService()
  const pillarScoreService = new PillarScoreService()

  // Load pillar scores when companies change
  useEffect(() => {
    const loadPillarScores = async () => {
      if (companies.length === 0) {
        setPillarScores([])
        return
      }

      setIsLoadingScores(true)
      try {
        const companyKeys = companies.map(c => c.key)
        const result = await pillarScoreService.getPillarScoresForCompanies(companyKeys)
        
        if (result.data) {
          setPillarScores(result.data)
        } else {
          // Fallback to mock data for development
          console.warn('Using mock pillar scores:', result.error)
          setPillarScores(pillarScoreService.generateMockPillarScores(companyKeys))
        }
      } catch (error) {
        console.error('Error loading pillar scores:', error)
        // Fallback to mock data
        const companyKeys = companies.map(c => c.key)
        setPillarScores(pillarScoreService.generateMockPillarScores(companyKeys))
      } finally {
        setIsLoadingScores(false)
      }
    }

    loadPillarScores()
  }, [companies])

  const handleExportPDF = async () => {
    if (companies.length === 0) return

    setIsExporting(true)
    setExportError(null)

    try {
      const result = await pdfService.generateCompareReport(companies)
      
      if (result.success && result.blob) {
        // Create download link
        const url = URL.createObjectURL(result.blob)
        const link = document.createElement('a')
        link.href = url
        link.download = result.filename || 'compare-report.pdf'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } else {
        setExportError(result.error || 'Failed to generate PDF')
      }
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'Failed to generate PDF')
    } finally {
      setIsExporting(false)
    }
  }


  const getScoreBadgeColor = (score: number) => {
    if (score >= 8.0) return 'bg-green-100 text-green-800'
    if (score >= 6.0) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const formatScore = (score: number) => score.toFixed(1)

  if (companies.length === 0) {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-blue-800">Select companies to compare (up to {MAX_COMPARE_COMPANIES})</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <h3 className="text-lg font-medium text-gray-900">Compare Companies</h3>
          <span className="ml-2 text-sm text-gray-500">({companies.length}/{MAX_COMPARE_COMPANIES})</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            disabled={isExporting || companies.length === 0}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Export Error */}
      {exportError && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 text-sm">{exportError}</p>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Overall Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Strategic Fit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ability to Execute
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Geography
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.map((company) => (
              <tr key={company.key} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{company.name}</div>
                      {company.ticker && (
                        <div className="text-sm text-gray-500">{company.ticker}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreBadgeColor(company.overallScore)}`}>
                    {formatScore(company.overallScore)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreBadgeColor(company.strategicFit)}`}>
                    {formatScore(company.strategicFit)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreBadgeColor(company.abilityToExecute)}`}>
                    {formatScore(company.abilityToExecute)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {company.tier || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {company.geography}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onRemoveCompany(company.key)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      {companies.length > 1 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Summary Statistics</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-gray-500">Average Overall Score</div>
              <div className="text-lg font-semibold text-gray-900">
                {formatScore(companies.reduce((sum, c) => sum + c.overallScore, 0) / companies.length)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Highest Strategic Fit</div>
              <div className="text-lg font-semibold text-gray-900">
                {formatScore(Math.max(...companies.map(c => c.strategicFit)))}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Highest Ability to Execute</div>
              <div className="text-lg font-semibold text-gray-900">
                {formatScore(Math.max(...companies.map(c => c.abilityToExecute)))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Radar Chart Section */}
      {companies.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="mb-4">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Pillar Scores Comparison</h4>
            <p className="text-sm text-gray-600">
              Compare companies across the 6 key evaluation dimensions
            </p>
          </div>
          
          {isLoadingScores ? (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600 text-sm">Loading pillar scores...</p>
              </div>
            </div>
          ) : (
            <RadarChart
              companies={companies}
              pillarScores={pillarScores}
              height={400}
              className="w-full"
            />
          )}
        </div>
      )}
    </div>
  )
}
