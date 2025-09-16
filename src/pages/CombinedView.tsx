import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { BubbleChart } from '../components/charts/BubbleChart'
import { TargetsList } from '../components/TargetsList'
import { FiltersPanel } from '../components/FiltersPanel'
import { CompanyOverviewService } from '../services/companyOverviewService'
import type { CompanyOverview } from '../types/company'
import type { CompanyFilters } from '../types/filters'

export const CombinedView: React.FC = () => {
  // Navigation
  const navigate = useNavigate()

  // State management
  const [companies, setCompanies] = useState<CompanyOverview[]>([])
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyOverview[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [filters, setFilters] = useState<CompanyFilters>({})
  const [sortBy, setSortBy] = useState<keyof CompanyOverview>('overallScore')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Services
  const companyService = useMemo(() => new CompanyOverviewService(), [])

  // Load companies data
  useEffect(() => {
    const loadCompanies = async () => {
      setLoading(true)
      try {
        const result = await companyService.getCompanies({
          filters,
          sortBy,
          sortOrder,
          limit: 1000 // Load more for better chart visualization
        })

        if (result.error) {
          setError(result.error)
        } else {
          setCompanies(result.data || [])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load companies')
      } finally {
        setLoading(false)
      }
    }

    loadCompanies()
  }, [companyService, filters, sortBy, sortOrder])

  // Apply client-side filtering and sorting for real-time responsiveness
  useEffect(() => {
    let filtered = [...companies]

    // Apply selection filtering if any companies are selected
    if (selectedKeys.length > 0) {
      filtered = filtered.filter(company => selectedKeys.includes(company.key))
    }

    // Sort the filtered results
    filtered.sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]
      
      if (aValue === bValue) {
        // Apply tie-breakers
        if (sortBy !== 'abilityToExecute') {
          const diff = b.abilityToExecute - a.abilityToExecute
          if (diff !== 0) return diff
        }
        if (sortBy !== 'strategicFit') {
          const diff = b.strategicFit - a.strategicFit
          if (diff !== 0) return diff
        }
        if (sortBy !== 'name') {
          return a.name.localeCompare(b.name)
        }
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const result = aValue.localeCompare(bValue)
        return sortOrder === 'desc' ? -result : result
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const result = aValue - bValue
        return sortOrder === 'desc' ? -result : result
      }

      return 0
    })

    setFilteredCompanies(filtered)
  }, [companies, selectedKeys, sortBy, sortOrder])

  // Handle chart selection changes
  const handleChartSelectionChange = useCallback((newSelectedKeys: string[]) => {
    setSelectedKeys(newSelectedKeys)
  }, [])

  // Handle table selection changes
  const handleTableSelectionChange = useCallback((newSelectedKeys: string[]) => {
    setSelectedKeys(newSelectedKeys)
  }, [])

  // Handle company click
  const handleCompanyClick = useCallback((company: CompanyOverview) => {
    navigate(`/dossier/${company.key}`)
  }, [navigate])

  // Handle sort changes
  const handleSortChange = useCallback((newSortBy: keyof CompanyOverview, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)
  }, [])

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: CompanyFilters) => {
    setFilters(newFilters)
    setSelectedKeys([]) // Clear selection when filters change
  }, [])

  // Handle compare navigation
  const handleCompare = useCallback(() => {
    if (selectedKeys.length > 0) {
      const companyParams = selectedKeys.join(',')
      navigate(`/compare?companies=${companyParams}`)
    }
  }, [selectedKeys, navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading companies...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-900 font-medium mb-2">Failed to load data</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex">
      {/* Filters Panel */}
      {sidebarOpen && (
        <div className="w-64 flex-shrink-0">
          <FiltersPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
            className="h-full"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {sidebarOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Targets Navigator</h1>
                <p className="text-gray-600">
                  Discover and prioritize target companies with linked visualization
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {selectedKeys.length > 0 && (
                <div className="text-sm text-blue-600">
                  {selectedKeys.length} companies selected
                </div>
              )}
              {selectedKeys.length > 0 && (
                <button
                  onClick={handleCompare}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Compare ({selectedKeys.length})
                </button>
              )}
              <button
                onClick={() => setSelectedKeys([])}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={selectedKeys.length === 0}
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>

        {/* Chart and Table Layout */}
        <div className="flex-1 flex">
          {/* Chart Section - 2/3 width */}
          <div className="w-2/3 p-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
              <BubbleChart
                data={companies}
                xKey="strategicFit"
                yKey="abilityToExecute"
                sizeKey="overallScore"
                colorKey="tier"
                selectedKeys={selectedKeys}
                onSelectionChange={handleChartSelectionChange}
                height={500}
              />
            </div>
          </div>

          {/* Table Section - 1/3 width */}
          <div className="w-1/3 p-6 pl-0">
            <div className="bg-white rounded-lg border border-gray-200 h-full">
              <TargetsList
                companies={selectedKeys.length > 0 ? filteredCompanies : companies}
                selectedKeys={selectedKeys}
                onSelectionChange={handleTableSelectionChange}
                onCompanyClick={handleCompanyClick}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
                height={580}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
