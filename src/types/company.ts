export interface Company {
  key: string
  name: string
  website?: string
  geography: string
  ticker?: string
  tags?: string[]
  strategicFit: number
  abilityToExecute: number
  overallScore: number
  tier?: string
  updated_at?: string
  // Pillar scores from company_overview table
  finance_score?: number
  industry_score?: number
  H2Score?: number
  IPActivityScore?: number
  manufacturing_score?: number
  OwnershipScore?: number
}

export interface CompanyOverview extends Company {
  // Additional fields available in company_overview view
  companyName?: string
  logoUrl?: string
  ceres_region?: string
  company_state?: string
  parent_company_name?: string
  visualElement?: string
  primaryMarket?: string
  businessModel?: string
  annual_revenue?: number
  financial_rating?: string
  industry_rationale?: string
  H2OverallRating?: string
  IPOverallRating?: string
  ManufacturingOverallRating?: string
  OwnershipOverallRating?: string
  // Legacy fields (not available in company_overview view)
  revenue_band?: string
  industry?: string
  country?: string
  rankingCategory?: string
}

export interface PillarScore {
  key: string
  pillar: 'finance' | 'industry' | 'ip' | 'manufacturing' | 'ownership' | 'hydrogen'
  score: number | null
  rationale_snippet?: string
  top_features?: string[]
  evaluation_date?: string
  source_url?: string
  last_verified_at?: string
}

// Detailed pillar score interfaces for radar chart visualization
export interface DetailedPillarScore {
  key: string
  pillar: 'finance' | 'industry' | 'ip' | 'manufacturing' | 'ownership' | 'hydrogen' | 'overview'
  overallScore: number | null
  subScores: PillarSubScores
  rationale_snippet?: string
  top_features?: string[]
  evaluation_date?: string
  source_url?: string
  last_verified_at?: string
}

export interface PillarSubScores {
  finance?: FinanceSubScores
  industry?: IndustrySubScores
  ip?: IPSubScores
  manufacturing?: ManufacturingSubScores
  ownership?: OwnershipSubScores
  hydrogen?: HydrogenSubScores
}

export interface FinanceSubScores {
  revenue_score?: number | null
  '3Y_score'?: number | null
  netProfitScore?: number | null
  investCapacityScore?: number | null
  overallRating?: number | null
}

export interface IndustrySubScores {
  core_business_score?: number | null
  technology_score?: number | null
  market_score?: number | null
}

export interface IPSubScores {
  IPRelevantPatentsScore?: number | null
  IPCeresCitationsScore?: number | null
  IPPortfolioGrowthScore?: number | null
  IPFilingRecencyScore?: number | null
  IPOverallRating?: number | null
}

export interface ManufacturingSubScores {
  ManufacturingMaterialsScore?: number | null
  ManufacturingScaleScore?: number | null
  ManufacturingQualityScore?: number | null
  ManufacturingSupplyChainScore?: number | null
  ManufacturingRDScore?: number | null
  ManufacturingOverallRating?: number | null
}

export interface OwnershipSubScores {
  OwnershipTypeScore?: number | null
  OwnershipDecisionMakingScore?: number | null
  OwnershipAlignmentScore?: number | null
  OwnershipPartnershipsScore?: number | null
  OwnershipOverallRating?: number | null
}

export interface HydrogenSubScores {
  H2investScore?: number | null
  H2partnersScore?: number | null
  H2TechScore?: number | null
  H2CommitScore?: number | null
  H2ParticipationScore?: number | null
  H2OverallRating?: number | null
}

export interface Benchmark {
  sector: string
  geography: string
  metric: string
  median: number
  updated_at?: string
}

export interface CompareSet {
  ids: string[] // Max 5 companies
}

export interface ReportConfig {
  companies: string[]
  tabs: string[]
  generated_at: string
}

export interface CompanyDossier {
  company: Company
  pillars: PillarScore[]
  detailedPillars?: DetailedPillarScore[]
}

// Service response types
export interface ServiceResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginationParams {
  limit?: number
  offset?: number
}

export interface SortParams {
  sortBy?: keyof Company
  sortOrder?: 'asc' | 'desc'
}

// Validation helpers
export const isValidScore = (score: number | null): boolean => {
  return score !== null && score >= 0 && score <= 10
}

export const isInsufficientData = (score: number | null, evaluationDate?: string): boolean => {
  if (score === null) return true
  
  if (evaluationDate) {
    const evalDate = new Date(evaluationDate)
    const now = new Date()
    const monthsDiff = (now.getTime() - evalDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    return monthsDiff > 24
  }
  
  return false
}
