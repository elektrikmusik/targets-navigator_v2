import React, { useMemo } from 'react'
import Plot from 'react-plotly.js'
import type { DetailedPillarScore, PillarSubScores } from '../../types/company'

interface DetailedRadarChartProps {
  detailedPillar: DetailedPillarScore
  width?: number
  height?: number
  className?: string
}

// Sub-score labels for each pillar type
const SUB_SCORE_LABELS: Record<string, Record<string, string>> = {
  overview: {
    finance: 'Finance',
    industry: 'Industry',
    ip: 'Intellectual Property',
    manufacturing: 'Manufacturing',
    ownership: 'Ownership',
    hydrogen: 'Hydrogen'
  },
  finance: {
    revenue_score: 'Revenue',
    '3Y_score': '3Y Growth',
    netProfitScore: 'Profitability',
    investCapacityScore: 'Investment Capacity',
    overallRating: 'Overall Rating'
  },
  industry: {
    core_business_score: 'Core Business',
    technology_score: 'Technology',
    market_score: 'Market Position'
  },
  ip: {
    IPRelevantPatentsScore: 'Relevant Patents',
    IPCeresCitationsScore: 'Ceres Citations',
    IPPortfolioGrowthScore: 'Portfolio Growth',
    IPFilingRecencyScore: 'Filing Recency',
    IPOverallRating: 'Overall Rating'
  },
  manufacturing: {
    ManufacturingMaterialsScore: 'Materials',
    ManufacturingScaleScore: 'Scale',
    ManufacturingQualityScore: 'Quality',
    ManufacturingSupplyChainScore: 'Supply Chain',
    ManufacturingRDScore: 'R&D',
    ManufacturingOverallRating: 'Overall Rating'
  },
  ownership: {
    OwnershipTypeScore: 'Type',
    OwnershipDecisionMakingScore: 'Decision Making',
    OwnershipAlignmentScore: 'Alignment',
    OwnershipPartnershipsScore: 'Partnerships',
    OwnershipOverallRating: 'Overall Rating'
  },
  hydrogen: {
    H2investScore: 'Investment Focus',
    H2partnersScore: 'Partnerships',
    H2TechScore: 'Technology',
    H2CommitScore: 'Commitment',
    H2ParticipationScore: 'Participation',
    H2OverallRating: 'Overall Rating'
  }
}

export const DetailedRadarChart: React.FC<DetailedRadarChartProps> = ({
  detailedPillar,
  width,
  height = 400,
  className
}) => {
  // Extract sub-scores and labels for the specific pillar
  const chartData = useMemo(() => {
    const pillarType = detailedPillar.pillar
    const labels = SUB_SCORE_LABELS[pillarType] || {}
    
    console.log('DetailedRadarChart - detailedPillar:', detailedPillar)
    console.log('DetailedRadarChart - pillarType:', pillarType)
    
    if (pillarType === 'overview') {
      // For overview, extract overall scores from each pillar
      // Always include all 6 pillars, using 0 for missing data to ensure connected polygon
      const allPillars = ['finance', 'industry', 'ip', 'manufacturing', 'ownership', 'hydrogen']
      
      const pillarScores = allPillars.map(pillar => {
        const subScore = detailedPillar.subScores[pillar as keyof PillarSubScores]
        console.log(`Processing pillar ${pillar}:`, subScore)
        
        // Get the main score from each pillar's sub-scores
        let mainScore: number
        if (subScore && Object.values(subScore).some(v => v !== null && v !== undefined && typeof v === 'number')) {
          mainScore = Object.values(subScore as any).find(v => v !== null && v !== undefined && typeof v === 'number') as number
          console.log(`Found valid score for ${pillar}:`, mainScore)
        } else {
          // Use 0.1 for missing data to ensure edge connection
          mainScore = 0.1
          console.log(`No valid score for ${pillar}, using 0.1`)
        }
        
        return {
          key: pillar,
          value: mainScore,
          label: labels[pillar] || pillar
        }
      })

      return {
        scores: pillarScores.map(entry => entry.value),
        labels: pillarScores.map(entry => entry.label),
        hasData: pillarScores.some(entry => entry.value > 0.1) || pillarScores.length > 0 // Consider hasData true if at least one pillar has real data or we have any pillars
      }
    } else {
      // For individual pillars, extract sub-scores
      const subScores = detailedPillar.subScores[pillarType]
      
      if (!subScores) {
        return { scores: [], labels: [], hasData: false }
      }

      // Convert sub-scores to arrays, filtering out null/undefined/non-numeric values
      const scoreEntries = Object.entries(subScores)
        .filter(([_, value]) => value !== null && value !== undefined && typeof value === 'number')
        .map(([key, value]) => ({
          key,
          value: value as number,
          label: labels[key] || key
        }))

      return {
        scores: scoreEntries.map(entry => entry.value),
        labels: scoreEntries.map(entry => entry.label),
        hasData: scoreEntries.length > 0
      }
    }
  }, [detailedPillar])

  // Get color based on overall score
  const getScoreColor = (score: number | null) => {
    if (score === null) return '#6b7280'
    if (score >= 8.0) return '#10b981'
    if (score >= 6.0) return '#f59e0b'
    return '#ef4444'
  }

  const scoreColor = getScoreColor(detailedPillar.overallScore)

  // Chart data configuration
  const plotData = useMemo(() => {
    if (!chartData.hasData) {
      return []
    }

    return [{
      type: 'scatterpolar' as const,
      r: chartData.scores,
      theta: chartData.labels,
      fill: 'toself' as const,
      name: `${detailedPillar.pillar.charAt(0).toUpperCase() + detailedPillar.pillar.slice(1)} Sub-scores`,
      line: {
        color: scoreColor,
        width: 3
      },
      fillcolor: `${scoreColor}20`,
      hovertemplate: `<b>%{theta}</b><br>Score: %{r:.1f}<extra></extra>`,
      marker: {
        color: scoreColor,
        size: 6
      }
    }]
  }, [chartData, detailedPillar.pillar, scoreColor])

  // Layout configuration
  const layout = useMemo(() => ({
    title: {
      text: detailedPillar.pillar === 'overview' 
        ? 'Pillar Scores Overview' 
        : `${detailedPillar.pillar.charAt(0).toUpperCase() + detailedPillar.pillar.slice(1)} Detailed Analysis`,
      font: { size: 16, family: 'Inter, sans-serif' },
      x: 0.5
    },
    polar: {
      radialaxis: {
        visible: true,
        range: [0, 10],
        tickfont: { size: 10, family: 'Inter, sans-serif' },
        gridcolor: '#e5e7eb',
        gridwidth: 1,
        linecolor: '#d1d5db',
        linewidth: 1,
        tickmode: 'linear' as const,
        tick0: 0,
        dtick: 2
      },
      angularaxis: {
        visible: true,
        tickfont: { size: 11, family: 'Inter, sans-serif' },
        gridcolor: '#e5e7eb',
        gridwidth: 1,
        linecolor: '#d1d5db',
        linewidth: 1
      },
      bgcolor: 'rgba(0,0,0,0)'
    },
    showlegend: false,
    margin: { t: 60, r: 50, b: 50, l: 50 },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Inter, sans-serif' },
    annotations: [
      {
        x: 0.02,
        y: 0.98,
        xref: 'paper' as const,
        yref: 'paper' as const,
        text: `Overall: ${detailedPillar.overallScore?.toFixed(1) || 'N/A'}`,
        showarrow: false,
        font: { size: 12, color: scoreColor, family: 'Inter, sans-serif' },
        bgcolor: 'rgba(255,255,255,0.9)',
        bordercolor: scoreColor,
        borderwidth: 1,
        borderpad: 4
      }
    ]
  }), [detailedPillar.overallScore, scoreColor])

  // Configuration options
  const config = useMemo(() => ({
    displayModeBar: true,
    modeBarButtonsToRemove: ['pan2d' as any, 'lasso2d' as any, 'zoom2d' as any, 'zoomIn2d' as any, 'zoomOut2d' as any, 'autoScale2d' as any, 'resetScale2d' as any],
    displaylogo: false,
    responsive: true
  }), [])

  // Show message if no data
  if (!chartData.hasData) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg ${className}`} style={{ height }}>
        <div className="text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-500 text-sm">No detailed scores available for this pillar</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <Plot
        data={plotData}
        layout={layout}
        config={config}
        style={{ width: width || '100%', height }}
        useResizeHandler={true}
      />
    </div>
  )
}

// Helper component for displaying sub-score details
export const SubScoreDetails: React.FC<{ detailedPillar: DetailedPillarScore }> = ({ detailedPillar }) => {
  const pillarType = detailedPillar.pillar
  const labels = SUB_SCORE_LABELS[pillarType] || {}

  if (pillarType === 'overview') {
    // For overview, show overall pillar scores
    // Always include all 6 pillars, using 0 for missing data
    const allPillars = ['finance', 'industry', 'ip', 'manufacturing', 'ownership', 'hydrogen']
    
    const pillarScores = allPillars.map(pillar => {
      const subScore = detailedPillar.subScores[pillar as keyof PillarSubScores]
      // Get the main score from each pillar's sub-scores, default to 0.1 if missing (to ensure edge connection)
      const mainScore = subScore && Object.values(subScore).some(v => v !== null && v !== undefined && typeof v === 'number')
        ? Object.values(subScore as any).find(v => v !== null && v !== undefined && typeof v === 'number') as number
        : 0.1
      
      return {
        key: pillar,
        value: mainScore,
        label: labels[pillar] || pillar
      }
    })

    if (pillarScores.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">No pillar scores available</p>
        </div>
      )
    }

    const getScoreBadgeColor = (score: number | null) => {
      if (score === null || score === 0.1) return 'bg-gray-200 text-gray-600'
      if (score >= 8.0) return 'bg-green-100 text-green-800'
      if (score >= 6.0) return 'bg-yellow-100 text-yellow-800'
      return 'bg-red-100 text-red-800'
    }

    return (
      <div className="space-y-3">
        <h4 className="text-md font-medium text-gray-900 mb-3">Pillar Scores</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {pillarScores.map(({ key, value, label }) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">{label}</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreBadgeColor(value)}`}>
                {value === 0.1 ? 'N/A' : (typeof value === 'number' ? value.toFixed(1) : 'N/A')}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  } else {
    // For individual pillars, show sub-scores
    const subScores = detailedPillar.subScores[pillarType]

    if (!subScores) {
      return (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">No detailed scores available</p>
        </div>
      )
    }

    const scoreEntries = Object.entries(subScores)
      .filter(([_, value]) => value !== null && value !== undefined && typeof value === 'number')
      .map(([key, value]) => ({
        key,
        value: value as number,
        label: labels[key] || key
      }))

    const getScoreBadgeColor = (score: number | null) => {
      if (score === null) return 'bg-gray-200 text-gray-600'
      if (score >= 8.0) return 'bg-green-100 text-green-800'
      if (score >= 6.0) return 'bg-yellow-100 text-yellow-800'
      return 'bg-red-100 text-red-800'
    }

    return (
      <div className="space-y-3">
        <h4 className="text-md font-medium text-gray-900 mb-3">Sub-score Breakdown</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {scoreEntries.map(({ key, value, label }) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">{label}</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreBadgeColor(value)}`}>
                {typeof value === 'number' ? value.toFixed(1) : 'N/A'}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
}
