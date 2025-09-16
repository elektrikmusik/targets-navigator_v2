import React, { useMemo } from 'react'
import Plot from 'react-plotly.js'
import type { Company, PillarScore } from '../../types/company'

interface RadarChartProps {
  companies: Company[]
  pillarScores: PillarScore[]
  selectedCompanyKeys?: string[]
  width?: number
  height?: number
  className?: string
}

const PILLAR_LABELS: Record<PillarScore['pillar'], string> = {
  finance: 'Finance',
  industry: 'Industry',
  ip: 'IP',
  manufacturing: 'Manufacturing',
  ownership: 'Ownership',
  hydrogen: 'Hydrogen'
}

const PILLAR_ORDER: PillarScore['pillar'][] = [
  'finance',
  'industry', 
  'ip',
  'manufacturing',
  'ownership',
  'hydrogen'
]

export const RadarChart: React.FC<RadarChartProps> = ({
  companies,
  pillarScores,
  selectedCompanyKeys = [],
  width,
  height = 500,
  className
}) => {
  // Prepare chart data for each company
  const chartData = useMemo(() => {
    const companyData = companies.map(company => {
      // Get pillar scores for this company
      const companyPillarScores = pillarScores.filter(score => score.key === company.key)
      
      // Create score array in the correct order, filling with 0 for missing scores
      const scores = PILLAR_ORDER.map(pillar => {
        const pillarScore = companyPillarScores.find(ps => ps.pillar === pillar)
        return pillarScore?.score ?? 0
      })
      
      // Determine if this company should be highlighted
      const isSelected = selectedCompanyKeys.length === 0 || selectedCompanyKeys.includes(company.key)
      
      return {
        name: company.name,
        scores,
        isSelected,
        opacity: isSelected ? 0.8 : 0.3,
        lineWidth: isSelected ? 3 : 1
      }
    })

    // Create traces for each company
    return companyData.map((company, index) => ({
      type: 'scatterpolar' as const,
      r: company.scores,
      theta: PILLAR_ORDER.map(pillar => PILLAR_LABELS[pillar]),
      name: company.name,
      line: {
        color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`, // Generate distinct colors
        width: company.lineWidth
      },
      fill: 'toself',
      fillcolor: `hsla(${(index * 137.5) % 360}, 70%, 50%, ${company.opacity * 0.3})`,
      opacity: company.opacity,
      hovertemplate: `<b>${company.name}</b><br>` +
        PILLAR_ORDER.map((pillar, i) => 
          `${PILLAR_LABELS[pillar]}: ${company.scores[i].toFixed(1)}`
        ).join('<br>') +
        '<extra></extra>'
    }))
  }, [companies, pillarScores, selectedCompanyKeys])

  // Layout configuration
  const layout = useMemo(() => ({
    title: {
      text: 'Company Pillar Scores Comparison',
      font: { size: 16, family: 'Inter, sans-serif' }
    },
    polar: {
      radialaxis: {
        visible: true,
        range: [0, 10],
        tickfont: { size: 10, family: 'Inter, sans-serif' },
        gridcolor: '#d1d5db',
        gridwidth: 1,
        linecolor: '#d1d5db',
        linewidth: 1
      },
      angularaxis: {
        visible: true,
        tickfont: { size: 12, family: 'Inter, sans-serif' },
        gridcolor: '#d1d5db',
        gridwidth: 1,
        linecolor: '#d1d5db',
        linewidth: 1
      },
      bgcolor: 'rgba(0,0,0,0)'
    },
    showlegend: true,
    legend: {
      orientation: 'v',
      x: 1.05,
      y: 1,
      font: { size: 11, family: 'Inter, sans-serif' }
    },
    margin: { t: 50, r: 150, b: 50, l: 50 },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Inter, sans-serif' },
    // Add annotations for score explanation
    annotations: [
      {
        x: 0.02,
        y: 0.98,
        xref: 'paper' as const,
        yref: 'paper' as const,
        text: 'Scores: 0-10 scale',
        showarrow: false,
        font: { size: 12, color: '#666', family: 'Inter, sans-serif' },
        bgcolor: 'rgba(255,255,255,0.8)',
        bordercolor: '#d1d5db',
        borderwidth: 1,
        borderpad: 4
      }
    ]
  }), [])

  // Configuration options
  const config = useMemo(() => ({
    displayModeBar: true,
    modeBarButtonsToRemove: ['pan2d' as any, 'lasso2d' as any, 'zoom2d' as any, 'zoomIn2d' as any, 'zoomOut2d' as any, 'autoScale2d' as any, 'resetScale2d' as any],
    displaylogo: false,
    responsive: true
  }), [])

  // Show message if no data
  if (companies.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg ${className}`} style={{ height }}>
        <div className="text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-500 text-sm">Select companies to view pillar scores comparison</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <Plot
        data={chartData}
        layout={layout}
        config={config}
        style={{ width: width || '100%', height }}
        useResizeHandler={true}
      />
    </div>
  )
}
