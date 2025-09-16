import React from 'react'
import type { CompanyFilters } from '../types/filters'

interface FiltersPanelProps {
  filters: CompanyFilters
  onFiltersChange: (filters: CompanyFilters) => void
  className?: string
}

// Filter options based on actual database columns
const FILTER_OPTIONS = {
  countries: [
    'USA', 'China', 'Germany', 'Japan', 'United Kingdom', 'Canada', 'Australia', 
    'France', 'Netherlands', 'South Korea', 'Italy', 'Spain', 'Sweden', 'Switzerland',
    'Norway', 'Denmark', 'Belgium', 'Austria', 'Brazil', 'India', 'Singapore'
  ],
  tiers: [
    'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Partner'
  ],
  revenueBands: [
    '< $1M', '$1M - $10M', '$10M - $100M', '$100M - $1B', '> $1B'
  ],
  rankingCategories: [
    'Advanced Electronics Manufacturing & Supply Chain Solutions',
    'Advanced Manufacturing & Clean Energy Technology',
    'Advanced Manufacturing & Electronics Components',
    'Advanced Manufacturing & Electronics Leaders',
    'Advanced Manufacturing & Mobility',
    'Advanced Manufacturing & Mobility Technology',
    'Advanced Materials & Specialty Manufacturing',
    'Automotive & Advanced Component Manufacturers',
    'Automotive & Mobility Giants',
    'Automotive Components & Thermal Systems',
    'Automotive Technology & Clean Mobility Solutions',
    'Data Center Infrastructure & Power Management',
    'Data Centers & Telecommunications',
    'Electronics & Advanced Manufacturing',
    'Electronics & Advanced Materials Manufacturer',
    'Electronics & Systems Integrators',
    'Energy & Engineering',
    'Environmental Protection & Industrial Equipment',
    'Established Power Systems & Energy Majors',
    'Fuel Cells & Hydrogen Transportation',
    'Green Hydrogen & Fuel Cell Technology Provider',
    'Green Hydrogen & Industrial Gas Producers',
    'Green Hydrogen Production',
    'Green Hydrogen Production & Advanced Materials',
    'Green Hydrogen Production & Electrolyzer Manufacturer',
    'Green Hydrogen Production & Electrolyzers',
    'Green Hydrogen Production and Industrial Power & Utility Scale',
    'Heavy Industry & Advanced Materials Manufacturing',
    'Heavy Industry & Energy Engineering',
    'Heavy Industry & Mobility OEMs',
    'Independent Power Producers & System Integrators',
    'Industrial & Advanced Materials Manufacturer',
    'Industrial & Energy Conglomerate',
    'Industrial & Energy Partnership',
    'Industrial & Heavy Industry',
    'Industrial & Heavy Industry Conglomerate',
    'Industrial Automation & Electronics',
    'Industrial Conglomerate & Energy Integrator',
    'Industrial Conglomerate & Energy Solutions Provider',
    'Industrial Conglomerates & Advanced Manufacturing',
    'Industrial Conglomerates & Clean Energy Solutions Provider',
    'Industrial Conglomerates & Downstream Manufacturers',
    'Industrial Conglomerates & Energy Infrastructure',
    'Industrial Conglomerates & Energy Majors',
    'Industrial Conglomerates & Materials Manufacturing',
    'Industrial Engineering & Consulting Services',
    'Industrial Gas & Energy Utility',
    'Industrial Gas conglomerate',
    'Industrial Manufacturing',
    'Industrial Manufacturing - Construction Machinery',
    'Industrial Manufacturing - Energy & Petrochemical',
    'Industrial Manufacturing - Fertilizer Production and Environmental Technologies',
    'Industrial Manufacturing - Petrochemicals',
    'Industrial Manufacturing - Shipbuilding and Offshore Engineering',
    'Industrial Manufacturing & Heavy Equipment Manufacturing',
    'Industrial Power',
    'Industrial Power & Electrical Equipment Manufacturing',
    'Industrial Power & Energy Equipment Manufacturer',
    'Industrial Power & Energy Holding Company',
    'Industrial Power & Energy Solutions',
    'Industrial Power & Heavy Equipment Manufacturer',
    'Industrial Power & Manufacturing',
    'Industrial Power & Marine & Defense Research and Development',
    'Industrial Power & Nuclear Energy',
    'Industrial Power & Transportation Manufacturing',
    'Industrial Power & Utility Scale',
    'Industrial Power & Utility Solutions',
    'Industrial Power Equipment Manufacturer',
    'National Energy Champions & Giga-Project Developers',
    'New Energy / Clean Energy Company',
    'Oil & Gas',
    'Oil & Gas / National Energy Champion',
    'Power & Thermal Equipment Manufacturers',
    'Power & Utility Infrastructure Provider',
    'Power & Utility Infrastructure Providers',
    'Power Generation & Utilities',
    'Power Management & Industrial Technology',
    'Renewable Energy',
    'Renewable Energy - Solar and Clean Power Solutions',
    'Renewable Energy (Solar PV Manufacturing)',
    'Renewable Energy & Energy Transition Consulting',
    'Renewable Energy & Hydrogen Solutions',
    'Renewable Energy & Power Electronics Manufacturer',
    'Renewable Energy & Solar Power',
    'Renewable Energy & Wind Power Manufacturer',
    'Renewable Energy and Integrated Power Solutions',
    'Renewable Energy Manufacturing',
    'Specialty Renewable Energy & Waste-to-Energy Solutions',
    'Steel Manufacturing and Heavy Industry'
  ]
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  filters,
  onFiltersChange,
  className = ''
}) => {

  const clearAllFilters = () => {
    onFiltersChange({})
  }

  const getActiveFilterCount = (): number => {
    return Object.values(filters).reduce((count, filterArray) => {
      return count + (Array.isArray(filterArray) ? filterArray.length : 0)
    }, 0)
  }

  const FilterSection: React.FC<{
    title: string
    filterKey: keyof CompanyFilters
    options: string[]
  }> = ({ title, filterKey, options }) => {
    const selectedValues = (filters[filterKey] as string[]) || []
    
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value
      if (value === '') {
        // Clear selection
        onFiltersChange({
          ...filters,
          [filterKey]: undefined
        })
      } else {
        // For single selection, replace the array with just this value
        onFiltersChange({
          ...filters,
          [filterKey]: [value]
        })
      }
    }

    return (
      <div className="mb-4">
        <label htmlFor={`filter-${String(filterKey)}`} className="block text-sm font-medium text-gray-900 mb-2">
          {title}
        </label>
        <select
          id={`filter-${String(filterKey)}`}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          value={selectedValues[0] || ''}
          onChange={handleSelectChange}
        >
          <option value="">All {title}</option>
          {options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div className={`bg-white p-4 border-r border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        {getActiveFilterCount() > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear All ({getActiveFilterCount()})
          </button>
        )}
      </div>

      <div className="space-y-4">
        <FilterSection
          title="Geography"
          filterKey="countries"
          options={FILTER_OPTIONS.countries}
        />

        <FilterSection
          title="Company Tier"
          filterKey="tiers"
          options={FILTER_OPTIONS.tiers}
        />

        <FilterSection
          title="Revenue Band"
          filterKey="revenueBands"
          options={FILTER_OPTIONS.revenueBands}
        />

        <FilterSection
          title="Ranking Categories"
          filterKey="rankingCategories"
          options={FILTER_OPTIONS.rankingCategories}
        />
      </div>
    </div>
  )
}
