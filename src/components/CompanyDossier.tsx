import React, { useState, useEffect } from 'react'
import type { CompanyDossier, PillarScore } from '../types/company'
import { DossierService } from '../services/dossierService'
import { DetailedRadarChart, SubScoreDetails } from './charts/DetailedRadarChart'

interface CompanyDossierComponentProps {
  companyKey: string
  onClose?: () => void
  className?: string
}

const PILLAR_LABELS: Record<PillarScore['pillar'], string> = {
  finance: 'Finance',
  industry: 'Industry',
  ip: 'Intellectual Property',
  manufacturing: 'Manufacturing',
  ownership: 'Ownership',
  hydrogen: 'Hydrogen'
}

const PILLAR_DESCRIPTIONS: Record<PillarScore['pillar'], string> = {
  finance: 'Financial performance, stability, and growth metrics',
  industry: 'Industry position, market share, and competitive advantage',
  ip: 'Patent portfolio, intellectual property assets, and innovation',
  manufacturing: 'Production capabilities, efficiency, and quality',
  ownership: 'Corporate structure, governance, and ownership details',
  hydrogen: 'Hydrogen technology capabilities and market position'
}

export const CompanyDossierComponent: React.FC<CompanyDossierComponentProps> = ({
  companyKey,
  onClose,
  className = ''
}) => {
  const [dossier, setDossier] = useState<CompanyDossier | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<PillarScore['pillar'] | 'overview'>('overview')

  const dossierService = new DossierService()

  useEffect(() => {
    const loadDossier = async () => {
      setLoading(true)
      setError(null)
      
      try {
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

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-500'
    if (score >= 8.0) return 'text-green-600'
    if (score >= 6.0) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadgeColor = (score: number | null) => {
    if (score === null) return 'bg-gray-200 text-gray-600'
    if (score >= 8.0) return 'bg-green-100 text-green-800'
    if (score >= 6.0) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const formatScore = (score: number | null) => {
    return score === null ? 'N/A' : score.toFixed(1)
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dossier...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-900 font-medium mb-2">Failed to load dossier</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (!dossier) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <p className="text-gray-500">No dossier data available</p>
        </div>
      </div>
    )
  }

  const { company, pillars, detailedPillars } = dossier

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{company.name}</h2>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            {company.ticker && (
              <span className="bg-gray-100 px-2 py-1 rounded">{company.ticker}</span>
            )}
            <span>{company.geography}</span>
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Website
              </a>
            )}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          {pillars.map((pillar) => (
            <button
              key={pillar.pillar}
              onClick={() => setActiveTab(pillar.pillar)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === pillar.pillar
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {PILLAR_LABELS[pillar.pillar]}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Company Info */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Tier</label>
                  <p className="text-sm text-gray-900">{company.tier || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Geography</label>
                  <p className="text-sm text-gray-900">{company.geography}</p>
                </div>
                {company.tags && company.tags.length > 0 && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Tags</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {company.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Scores */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Scores</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`text-2xl font-bold ${getScoreColor(company.overallScore)}`}>
                    {formatScore(company.overallScore)}
                  </div>
                  <div className="text-sm text-gray-600">Overall Score</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`text-2xl font-bold ${getScoreColor(company.strategicFit)}`}>
                    {formatScore(company.strategicFit)}
                  </div>
                  <div className="text-sm text-gray-600">Strategic Fit</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`text-2xl font-bold ${getScoreColor(company.abilityToExecute)}`}>
                    {formatScore(company.abilityToExecute)}
                  </div>
                  <div className="text-sm text-gray-600">Ability to Execute</div>
                </div>
              </div>
            </div>

            {/* Pillars Summary */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Pillar Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pillars.map((pillar) => (
                  <div key={pillar.pillar} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{PILLAR_LABELS[pillar.pillar]}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreBadgeColor(pillar.score)}`}>
                        {formatScore(pillar.score)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{PILLAR_DESCRIPTIONS[pillar.pillar]}</p>
                    {pillar.rationale_snippet && (
                      <p className="text-xs text-gray-500 line-clamp-2">{pillar.rationale_snippet}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Overall Pillar Radar Chart */}
            {pillars && pillars.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Pillar Scores Overview</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {(() => {
                    const overviewData = {
                      key: company.key,
                      pillar: 'overview' as any,
                      overallScore: company.overallScore,
                      subScores: {
                        finance: { overallRating: company.finance_score },
                        industry: { core_business_score: company.industry_score },
                        ip: { IPOverallRating: company.IPActivityScore },
                        manufacturing: { ManufacturingOverallRating: company.manufacturing_score },
                        ownership: { OwnershipOverallRating: company.OwnershipScore },
                        hydrogen: { H2OverallRating: company.H2Score }
                      }
                    }
                    console.log('Overview data:', overviewData)
                    console.log('Company pillar scores:', {
                      finance_score: company.finance_score,
                      industry_score: company.industry_score,
                      IPActivityScore: company.IPActivityScore,
                      manufacturing_score: company.manufacturing_score,
                      OwnershipScore: company.OwnershipScore,
                      H2Score: company.H2Score
                    })
                    return (
                      <DetailedRadarChart 
                        detailedPillar={overviewData}
                        height={400}
                        className="w-full"
                      />
                    )
                  })()}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab !== 'overview' && (
          <div>
            {(() => {
              const pillar = pillars.find(p => p.pillar === activeTab)
              const detailedPillar = detailedPillars?.find(p => p.pillar === activeTab)
              
              if (!pillar) {
                return (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No data available for this pillar</p>
                  </div>
                )
              }

              return (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      {PILLAR_LABELS[pillar.pillar]}
                    </h3>
                    <span className={`px-3 py-1 rounded text-sm font-medium ${getScoreBadgeColor(pillar.score)}`}>
                      Score: {formatScore(pillar.score)}
                    </span>
                  </div>

                  {/* Detailed Radar Chart */}
                  {detailedPillar && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <DetailedRadarChart 
                        detailedPillar={detailedPillar}
                        height={350}
                        className="w-full"
                      />
                    </div>
                  )}

                  {/* Sub-score Details */}
                  {detailedPillar && (
                    <SubScoreDetails detailedPillar={detailedPillar} />
                  )}

                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600">{PILLAR_DESCRIPTIONS[pillar.pillar]}</p>
                  </div>

                  {pillar.rationale_snippet && (
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-2">Rationale</h4>
                      <p className="text-gray-600">{pillar.rationale_snippet}</p>
                    </div>
                  )}

                  {pillar.top_features && Array.isArray(pillar.top_features) && pillar.top_features.length > 0 && (
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-2">Key Features</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {pillar.top_features.map((feature, index) => (
                          <li key={index} className="text-gray-600">{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {pillar.evaluation_date && (
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-2">Evaluation Date</h4>
                      <p className="text-gray-600">{new Date(pillar.evaluation_date).toLocaleDateString()}</p>
                    </div>
                  )}

                  {pillar.source_url && (
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-2">Source</h4>
                      <a
                        href={pillar.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View Source
                      </a>
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        )}
      </div>
    </div>
  )
}
