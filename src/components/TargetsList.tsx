import React, { useMemo, useCallback } from 'react'
// import * as ReactWindow from 'react-window' // TODO: Fix react-window integration
import type { CompanyOverview } from '../types/company'

interface TargetsListProps {
  companies: CompanyOverview[]
  selectedKeys?: string[]
  onSelectionChange?: (selectedKeys: string[]) => void
  onCompanyClick?: (company: CompanyOverview) => void
  sortBy?: keyof CompanyOverview
  sortOrder?: 'asc' | 'desc'
  onSortChange?: (sortBy: keyof CompanyOverview, sortOrder: 'asc' | 'desc') => void
  height?: number
  className?: string
}

interface CompanyRowProps {
  index: number
  style: React.CSSProperties
  data: {
    companies: CompanyOverview[]
    selectedKeys: string[]
    onSelectionChange?: (selectedKeys: string[]) => void
    onCompanyClick?: (company: CompanyOverview) => void
  }
}

const CompanyRow = ({ index, style, data }: CompanyRowProps) => {
  const { companies, selectedKeys, onSelectionChange, onCompanyClick } = data
  const company = companies[index]
  
  if (!company) return null

  const isSelected = selectedKeys.includes(company.key)

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    if (!onSelectionChange) return

    const newSelectedKeys = e.target.checked
      ? [...selectedKeys, company.key]
      : selectedKeys.filter(key => key !== company.key)
    
    onSelectionChange(newSelectedKeys)
  }

  const handleRowClick = () => {
    if (onCompanyClick) {
      onCompanyClick(company)
    }
  }

  const getPillarBadgeColor = (score: number | null) => {
    if (score === null) return 'bg-gray-200 text-gray-600'
    if (score >= 8.0) return 'bg-green-100 text-green-800'
    if (score >= 6.0) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const formatScore = (score: number) => score.toFixed(1)

  return (
    <div
      style={style}
      className={`flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
        isSelected ? 'bg-blue-50 border-blue-200' : ''
      }`}
      onClick={handleRowClick}
    >
      <div className="flex items-center mr-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {company.name}
              </h3>
              {company.ticker && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {company.ticker}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <span>{company.geography}</span>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  Website
                </a>
              )}
            </div>

            {company.tags && company.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {company.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
                {company.tags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{company.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="ml-4 text-right">
            <div className="mb-2">
              <div className={`inline-block text-sm font-bold px-3 py-1 rounded ${getPillarBadgeColor(company.overallScore)}`}>
                Overall: {formatScore(company.overallScore)}
              </div>
            </div>

            <div className="flex gap-1">
              <div className={`text-xs px-2 py-1 rounded ${getPillarBadgeColor(company.strategicFit)}`}>
                SF: {formatScore(company.strategicFit)}
              </div>
              <div className={`text-xs px-2 py-1 rounded ${getPillarBadgeColor(company.abilityToExecute)}`}>
                AE: {formatScore(company.abilityToExecute)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const TargetsList: React.FC<TargetsListProps> = ({
  companies,
  selectedKeys = [],
  onSelectionChange,
  onCompanyClick,
  sortBy = 'overallScore',
  sortOrder = 'desc',
  onSortChange,
  height = 600,
  className = ''
}) => {
  // Memoize the data passed to the virtual list
  const listData = useMemo(() => ({
    companies,
    selectedKeys,
    onSelectionChange,
    onCompanyClick
  }), [companies, selectedKeys, onSelectionChange, onCompanyClick])

  const handleSort = useCallback((field: keyof CompanyOverview) => {
    if (!onSortChange) return

    const newSortOrder = sortBy === field && sortOrder === 'desc' ? 'asc' : 'desc'
    onSortChange(field, newSortOrder)
  }, [sortBy, sortOrder, onSortChange])

  const getSortIcon = (field: keyof CompanyOverview) => {
    if (sortBy !== field) return '↕️'
    return sortOrder === 'desc' ? '↓' : '↑'
  }

  if (companies.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 text-gray-500 ${className}`}>
        <div className="text-center">
          <p className="text-lg mb-2">No companies found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-900">
            {companies.length} companies
          </span>
          {selectedKeys.length > 0 && (
            <span className="text-sm text-blue-600">
              {selectedKeys.length} selected
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Sort by:</span>
          <button
            onClick={() => handleSort('overallScore')}
            className={`px-2 py-1 rounded hover:bg-gray-200 ${
              sortBy === 'overallScore' ? 'bg-gray-200' : ''
            }`}
          >
            Overall Score {getSortIcon('overallScore')}
          </button>
          <button
            onClick={() => handleSort('strategicFit')}
            className={`px-2 py-1 rounded hover:bg-gray-200 ${
              sortBy === 'strategicFit' ? 'bg-gray-200' : ''
            }`}
          >
            Strategic Fit {getSortIcon('strategicFit')}
          </button>
          <button
            onClick={() => handleSort('abilityToExecute')}
            className={`px-2 py-1 rounded hover:bg-gray-200 ${
              sortBy === 'abilityToExecute' ? 'bg-gray-200' : ''
            }`}
          >
            Ability to Execute {getSortIcon('abilityToExecute')}
          </button>
          <button
            onClick={() => handleSort('name')}
            className={`px-2 py-1 rounded hover:bg-gray-200 ${
              sortBy === 'name' ? 'bg-gray-200' : ''
            }`}
          >
            Name {getSortIcon('name')}
          </button>
        </div>
      </div>

      {/* Company List */}
      <div className="overflow-y-auto" style={{ height: height - 60 }}>
        {companies.map((company, index) => (
          <CompanyRow
            key={company.key}
            index={index}
            style={{}}
            data={listData}
          />
        ))}
      </div>
    </div>
  )
}
