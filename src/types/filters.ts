export interface CompanyFilters {
  countries?: string[]
  tiers?: string[]
  revenueBands?: string[]
  rankingCategories?: string[]
  industries?: string[]
  minScore?: number
  maxScore?: number
  tags?: string[]
}

export interface FilterOptions {
  countries: string[]
  tiers: string[]
  revenueBands: string[]
  rankingCategories: string[]
  industries: string[]
}

export const DEFAULT_FILTER_OPTIONS: FilterOptions = {
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
  ],
  industries: [
    'Technology', 'Manufacturing', 'Energy', 'Automotive', 'Healthcare',
    'Finance', 'Retail', 'Telecommunications', 'Aerospace', 'Chemicals'
  ]
}

// Filter validation helpers
export const validateFilters = (filters: CompanyFilters): CompanyFilters => {
  const validated: CompanyFilters = {}
  
  if (filters.countries && Array.isArray(filters.countries)) {
    validated.countries = filters.countries.filter(country => 
      DEFAULT_FILTER_OPTIONS.countries.includes(country)
    )
  }
  
  if (filters.tiers && Array.isArray(filters.tiers)) {
    validated.tiers = filters.tiers.filter(tier => 
      DEFAULT_FILTER_OPTIONS.tiers.includes(tier)
    )
  }
  
  if (filters.revenueBands && Array.isArray(filters.revenueBands)) {
    validated.revenueBands = filters.revenueBands.filter(band => 
      DEFAULT_FILTER_OPTIONS.revenueBands.includes(band)
    )
  }
  
  if (filters.rankingCategories && Array.isArray(filters.rankingCategories)) {
    validated.rankingCategories = filters.rankingCategories.filter(category => 
      DEFAULT_FILTER_OPTIONS.rankingCategories.includes(category)
    )
  }
  
  if (filters.industries && Array.isArray(filters.industries)) {
    validated.industries = filters.industries.filter(industry => 
      DEFAULT_FILTER_OPTIONS.industries.includes(industry)
    )
  }
  
  if (filters.minScore !== undefined && filters.minScore >= 0 && filters.minScore <= 10) {
    validated.minScore = filters.minScore
  }
  
  if (filters.maxScore !== undefined && filters.maxScore >= 0 && filters.maxScore <= 10) {
    validated.maxScore = filters.maxScore
  }
  
  if (filters.tags && Array.isArray(filters.tags)) {
    validated.tags = filters.tags.filter(tag => typeof tag === 'string' && tag.length > 0)
  }
  
  return validated
}

export const hasActiveFilters = (filters: CompanyFilters): boolean => {
  return Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== undefined
  )
}

export const getActiveFilterCount = (filters: CompanyFilters): number => {
  return Object.values(filters).reduce((count, value) => {
    return count + (Array.isArray(value) ? value.length : (value !== undefined ? 1 : 0))
  }, 0)
}
