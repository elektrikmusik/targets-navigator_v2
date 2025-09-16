import React, { useMemo } from 'react'
import Plot from 'react-plotly.js'
import type { DetailedPillarScore, PillarSubScores } from '../../types/company'
import { getScoreColor, getFillColor, chartColors, getScoreBadgeClass } from '../../utils/chartColors'

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
  const chartData = useMemo((): { scores: number[]; labels: string[]; hasData: boolean } => {
    const pillarType = detailedPillar.pillar
    const labels = SUB_SCORE_LABELS[pillarType] || {}
    
    
    if (pillarType === 'overview') {
      // For overview, extract overall scores from each pillar
      const allPillars = ['finance', 'industry', 'ip', 'manufacturing', 'ownership', 'hydrogen']
      
      const pillarScores: Array<{ key: string; value: number; label: string }> = allPillars.map(pillar => {
        const subScore = detailedPillar.subScores[pillar as keyof PillarSubScores]
        
        // Get the main score from each pillar's sub-scores
        const mainScore = Object.values(subScore as any).find(v => v !== null && v !== undefined && typeof v === 'number') as number || 0
        
        return {
          key: pillar,
          value: mainScore,
          label: labels[pillar] || pillar
        }
      })

      const scores = pillarScores.map((entry: { key: string; value: number; label: string }) => entry.value)
      const scoreLabels = pillarScores.map((entry: { key: string; value: number; label: string }) => entry.label)
      
      // Close the polygon by duplicating the first point at the end
      return {
        scores: [...scores, scores[0]],
        labels: [...scoreLabels, scoreLabels[0]],
        hasData: true
      }
    } else {
      // For individual pillars, extract sub-scores
      const subScores = detailedPillar.subScores[pillarType]

      // Convert sub-scores to arrays
      const scoreEntries: Array<{ key: string; value: number; label: string }> = Object.entries(subScores!)
        .filter(([_, value]) => typeof value === 'number')
        .map(([key, value]) => ({
          key,
          value: value as number,
          label: labels[key] || key
        }))

      const scores = scoreEntries.map((entry: { key: string; value: number; label: string }) => entry.value)
      const scoreLabels = scoreEntries.map((entry: { key: string; value: number; label: string }) => entry.label)
      
      // Close the polygon by duplicating the first point at the end
      return {
        scores: [...scores, scores[0]],
        labels: [...scoreLabels, scoreLabels[0]],
        hasData: true
      }
    }
  }, [detailedPillar])

  // Get color based on overall score using CSS custom properties
  const scoreColor = getScoreColor(detailedPillar.overallScore || 0)

  // Chart data configuration
  const plotData = useMemo(() => [{
      type: 'scatterpolar' as const,
      r: chartData.scores,
      theta: chartData.labels,
      fill: 'toself' as const,
      name: `${detailedPillar.pillar.charAt(0).toUpperCase() + detailedPillar.pillar.slice(1)} Sub-scores`,
      line: {
        color: scoreColor,
        width: 3
      },
      fillcolor: getFillColor(scoreColor, 0.2),
      hovertemplate: `<b>%{theta}</b><br>Score: %{r:.1f}<extra></extra>`,
      marker: {
        color: scoreColor,
        size: 6
      }
    }], [chartData, detailedPillar.pillar, scoreColor])

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
        gridcolor: chartColors.grid(),
        gridwidth: 1,
        linecolor: chartColors.grid(),
        linewidth: 1,
        tickmode: 'linear' as const,
        tick0: 0,
        dtick: 2
      },
      angularaxis: {
        visible: true,
        tickfont: { size: 11, family: 'Inter, sans-serif' },
        gridcolor: chartColors.grid(),
        gridwidth: 1,
        linecolor: chartColors.grid(),
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
        bgcolor: chartColors.background(),
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
    const allPillars = ['finance', 'industry', 'ip', 'manufacturing', 'ownership', 'hydrogen']
    
    const pillarScores = allPillars.map(pillar => {
      const subScore = detailedPillar.subScores[pillar as keyof PillarSubScores]
      const mainScore = Object.values(subScore as any).find(v => v !== null && v !== undefined && typeof v === 'number') as number || 0
      
      return {
        key: pillar,
        value: mainScore,
        label: labels[pillar] || pillar
      }
    })

    // Use the centralized badge color function

    return (
      <div className="space-y-3">
        <h4 className="text-md font-medium text-gray-900 mb-3">Pillar Scores</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {pillarScores.map(({ key, value, label }) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">{label}</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreBadgeClass(value)}`}>
                {value.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  } else {
    // For individual pillars, show sub-scores
    const subScores = detailedPillar.subScores[pillarType]

    const scoreEntries = Object.entries(subScores!)
      .filter(([_, value]) => typeof value === 'number')
      .map(([key, value]) => ({
        key,
        value: value as number,
        label: labels[key] || key
      }))

    // Use the centralized badge color function

    return (
      <div className="space-y-3">
        <h4 className="text-md font-medium text-gray-900 mb-3">Sub-score Breakdown</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {scoreEntries.map(({ key, value, label }) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">{label}</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreBadgeClass(value)}`}>
                {value.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
}
