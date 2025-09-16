import React, { useCallback, useMemo } from 'react'
import Plot from 'react-plotly.js'
import type { CompanyOverview } from '../../types/company'
import { getTierColor, chartColors } from '../../utils/chartColors'

interface BubbleChartProps {
  data: CompanyOverview[]
  xKey: keyof CompanyOverview
  yKey: keyof CompanyOverview
  sizeKey: keyof CompanyOverview
  colorKey: keyof CompanyOverview
  selectedKeys?: string[]
  onSelectionChange?: (selectedKeys: string[]) => void
  width?: number
  height?: number
  className?: string
}

export const BubbleChart: React.FC<BubbleChartProps> = ({
  data,
  xKey,
  yKey,
  sizeKey,
  colorKey,
  selectedKeys = [],
  onSelectionChange,
  width,
  height = 600,
  className
}) => {
  // Prepare chart data
  const chartData = useMemo(() => {
    const x = data.map(item => item[xKey] as number)
    const y = data.map(item => item[yKey] as number)
    const size = data.map(item => {
      const value = item[sizeKey] as number
      if (!value) return 10
      
      // Find min and max values for proper scaling
      const values = data.map(d => d[sizeKey] as number).filter(v => v > 0)
      const minValue = Math.min(...values)
      const maxValue = Math.max(...values)
      
      // Scale to range 10-50 pixels based on actual data range
      const minSize = 10
      const maxSize = 50
      const normalizedValue = (value - minValue) / (maxValue - minValue)
      return minSize + (normalizedValue * (maxSize - minSize))
    })
    
    // Handle categorical coloring for tiers
    const isNumericColor = typeof data[0]?.[colorKey] === 'number'
    
    const color = isNumericColor 
      ? data.map(item => item[colorKey] as number)
      : data.map(item => {
          // Map tier values to colors using CSS custom properties
          const tier = item[colorKey] as string
          return getTierColor(tier)
        })
    const text = data.map(item => 
      `${item.name}<br>` +
      `${String(xKey)}: ${item[xKey]}<br>` +
      `${String(yKey)}: ${item[yKey]}<br>` +
      `${String(sizeKey)}: ${item[sizeKey]}<br>` +
      `${String(colorKey)}: ${item[colorKey]}`
    )
    const ids = data.map(item => item.key)

    // Highlight selected points
    const opacity = data.map(item => 
      selectedKeys.length === 0 || selectedKeys.includes(item.key) ? 0.8 : 0.3
    )

    return [{
      x,
      y,
      mode: 'markers' as const,
      marker: {
        size,
        color,
        ...(isNumericColor ? {
          colorscale: 'Viridis',
          showscale: true,
          colorbar: {
            title: { text: String(colorKey) },
            titleside: 'right'
          }
        } : {
          // For categorical colors, don't show colorscale
          showscale: false
        }),
        opacity,
        line: {
          width: selectedKeys.length > 0 ? data.map(item => 
            selectedKeys.includes(item.key) ? 3 : 1
          ) : 1,
          color: selectedKeys.length > 0 ? data.map(item => 
            selectedKeys.includes(item.key) ? chartColors.selected() : chartColors.foreground()
          ) : chartColors.foreground()
        }
      },
      text,
      hovertemplate: '%{text}<extra></extra>',
      customdata: ids,
      type: 'scatter' as const
    }]
  }, [data, xKey, yKey, sizeKey, colorKey, selectedKeys])

  // Handle point selection
  const handleSelection = useCallback((eventData: any) => {
    if (!onSelectionChange) return

    if (eventData && eventData.points) {
      const newSelectedKeys = eventData.points.map((point: any) => point.customdata)
      onSelectionChange(newSelectedKeys)
    }
  }, [onSelectionChange])

  // Handle point clicks
  const handleClick = useCallback((eventData: any) => {
    if (!onSelectionChange) return

    if (eventData && eventData.points && eventData.points.length > 0) {
      const clickedKey = eventData.points[0].customdata
      
      // Toggle selection
      const newSelectedKeys = selectedKeys.includes(clickedKey)
        ? selectedKeys.filter(key => key !== clickedKey)
        : [...selectedKeys, clickedKey]
      
      onSelectionChange(newSelectedKeys)
    }
  }, [selectedKeys, onSelectionChange])

  // Layout configuration
  const layout = useMemo(() => ({
    title: {
      text: 'Company Analysis Bubble Chart',
      font: { size: 16 }
    },
    xaxis: {
      title: { 
        text: 'Strategic Fit',
        font: { size: 14, family: 'Inter, sans-serif' }
      },
      gridcolor: chartColors.grid(), // Use CSS custom property for grid color
      gridwidth: 2, // Consistent grid line thickness
      showgrid: true,
      // Fixed axis range for 4-quadrant view
      range: [0, 10],
      showticklabels: false, // Hide axis values
      fixedrange: true, // Disable zoom/pan
      zeroline: true,
      zerolinecolor: chartColors.grid(), // Use CSS custom property for zero line
      zerolinewidth: 2 // Same thickness as grid lines
    },
    yaxis: {
      title: { 
        text: 'Ability to Execute',
        font: { size: 14, family: 'Inter, sans-serif' }
      },
      gridcolor: chartColors.grid(), // Use CSS custom property for grid color
      gridwidth: 2, // Consistent grid line thickness
      showgrid: true,
      // Fixed axis range for 4-quadrant view
      range: [0, 10],
      showticklabels: false, // Hide axis values
      fixedrange: true, // Disable zoom/pan
      zeroline: true,
      zerolinecolor: chartColors.grid(), // Use CSS custom property for zero line
      zerolinewidth: 2 // Same thickness as grid lines
    },
    hovermode: 'closest' as const,
    showlegend: false,
    margin: { t: 50, r: 80, b: 50, l: 60 },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Inter, sans-serif' },
    // Add annotations for size explanation
    annotations: [
      {
        x: 0.02,
        y: 0.98,
        xref: 'paper' as const,
        yref: 'paper' as const,
        text: 'Bubble size = Overall Score',
        showarrow: false,
        font: { size: 12, color: chartColors.text(), family: 'Inter, sans-serif' },
        bgcolor: chartColors.background(),
        bordercolor: chartColors.grid(),
        borderwidth: 1,
        borderpad: 4
      }
    ]
  }), [xKey, yKey])

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
        data={chartData}
        layout={layout}
        config={config}
        style={{ width: width || '100%', height }}
        useResizeHandler={true}
        onSelected={handleSelection}
        onClick={handleClick}
      />
    </div>
  )
}
