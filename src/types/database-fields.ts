/**
 * Database Field Dictionary
 * 
 * This file contains comprehensive field mappings for all database tables
 * used in the Specify web application. It ensures consistent field naming
 * and type definitions across the entire codebase.
 */

// ============================================================================
// TABLE FIELD MAPPINGS
// ============================================================================

/**
 * companies_profile table fields
 * Primary company information and core data
 */
export const COMPANIES_PROFILE_FIELDS = {
  // Primary key
  key: 'key',
  
  // Basic information
  englishName: 'englishName',
  companyName: 'companyName',
  website: 'website',
  country: 'country',
  ceres_region: 'ceres_region',
  company_state: 'company_state',
  parent_company_name: 'parent_company_name',
  
  // Financial identifiers
  ticker: 'ticker',
  sec_code: 'sec_code',
  stock_market: 'stock_market',
  
  // Business information
  basicInformation: 'basicInformation',
  missionVisionValues: 'missionVisionValues',
  historyBackground: 'historyBackground',
  productServices: 'productServices',
  productTags: 'productTags',
  marketPosition: 'marketPosition',
  visualElement: 'visualElement',
  narrative: 'narrative',
  executiveTeam: 'executiveTeam',
  customerSegments: 'customerSegments',
  products: 'products',
  
  // Market data
  primaryMarket: 'primaryMarket',
  marketShare: 'marketShare',
  secondaryMarket: 'secondaryMarket',
  marketRegion: 'marketRegion',
  businessModel: 'businessModel',
  
  // Financial data
  parentRevenue: 'parentRevenue',
  
  // Classification
  Tier: 'Tier',
  rankingCategory: 'rankingCategory',
  rankingRationale: 'rankingRationale',
  rankingLicenseRationale: 'rankingLicenseRationale',
  rankingData: 'rankingData',
  rankingFocus: 'rankingFocus',
  
  // Core scores
  strategicFit: 'strategicFit',
  abilityToExecute: 'abilityToExecute',
  overallScore: 'overallScore',
  
  // Media
  logoUrl: 'logoUrl',
  
  // News and sentiment
  news_md: 'news_md',
  sentiment_md: 'sentiment_md',
  
  // Timestamps
  created_at: 'created_at',
  EvaluationDate: 'EvaluationDate'
} as const;

/**
 * company_financial table fields
 * Financial performance and investment capacity data
 */
export const COMPANY_FINANCIAL_FIELDS = {
  // Primary key
  key: 'key',
  
  // Company identification
  companyName: 'companyName',
  englishName: 'englishName',
  
  // Revenue data
  annual_revenue: 'annual_revenue',
  revenue_score: 'revenue_score',
  revenue_justification: 'revenue_justification',
  revenueTrend: 'revenueTrend',
  
  // Growth metrics
  '3Y_score': '3Y_score',
  '3Y_justification': '3Y_justification',
  growthRate: 'growthRate',
  
  // Profitability
  netProfitScore: 'netProfitScore',
  netProfitJustification: 'netProfitJustification',
  netProfitMargin: 'netProfitMargin',
  profitabilityAssessment: 'profitabilityAssessment',
  
  // Investment capacity
  investCapacityScore: 'investCapacityScore',
  investCapacityJustification: 'investCapacityJustification',
  investmentReadiness: 'investmentReadiness',
  
  // Overall ratings
  overallRating: 'overallRating',
  financialSummary: 'financialSummary',
  
  // Group structure
  structure: 'structure',
  groupName: 'groupName',
  groupRevenue: 'groupRevenue',
  revenueScoreRev: 'revenueScoreRev',
  
  // Research data
  financialReserach: 'financialReserach',
  
  // Timestamps
  created_at: 'created_at',
  evaluation_date: 'evaluation_date',
  
  // Core score
  finance_score: 'finance_score'
} as const;

/**
 * companies_industry table fields
 * Industry analysis and market positioning data
 */
export const COMPANIES_INDUSTRY_FIELDS = {
  // Primary key
  key: 'key',
  
  // Company identification
  companyName: 'companyName',
  englishName: 'englishName',
  
  // Core business analysis
  core_business_score: 'core_business_score',
  core_business_justification: 'core_business_justification',
  
  // Technology assessment
  technology_score: 'technology_score',
  technology_justification: 'technology_justification',
  
  // Market analysis
  market_score: 'market_score',
  market_justification: 'market_justification',
  
  // Analysis content
  rationale: 'rationale',
  opportunities: 'opportunities',
  
  // Research data
  industry_output: 'industry_output',
  
  // Timestamps
  created_at: 'created_at',
  evaluation_date: 'evaluation_date',
  
  // Core score
  industry_score: 'industry_score'
} as const;

/**
 * companies_ip_revision table fields
 * IP analysis and patent activity data (REVISION TABLE)
 */
export const COMPANIES_IP_REVISION_FIELDS = {
  // Primary key
  key: 'key',
  
  // Company identification
  companyName: 'companyName',
  englishName: 'englishName',
  
  // Patent scoring
  IPRelevantPatentsScore: 'IPRelevantPatentsScore',
  IPRelevantPatentsJustification: 'IPRelevantPatentsJustification',
  
  // Citation analysis
  IPCeresCitationsScore: 'IPCeresCitationsScore',
  IPCeresCitationsJustification: 'IPCeresCitationsJustification',
  
  // Portfolio growth
  IPPortfolioGrowthScore: 'IPPortfolioGrowthScore',
  IPPortfolioGrowthJustification: 'IPPortfolioGrowthJustification',
  
  // Filing recency
  IPFilingRecencyScore: 'IPFilingRecencyScore',
  IPFilingRecencyJustification: 'IPFilingRecencyJustification',
  
  // Overall ratings
  IPOverallRating: 'IPOverallRating',
  IPStrategySummary: 'IPStrategySummary',
  
  // Research data
  IPResearch: 'IPResearch',
  ipInsights: 'ipInsights',
  patentResearch: 'patentResearch',
  
  // Technology-specific counts
  sofcCount: 'sofcCount',
  sofcDescription: 'sofcDescription',
  sofcTrend: 'sofcTrend',
  soecCount: 'soecCount',
  soecDescription: 'soecDescription',
  soecTrend: 'soecTrend',
  fcCount: 'fcCount',
  fcDescription: 'fcDescription',
  fcTrend: 'fcTrend',
  
  // Strategic analysis
  industryPosition: 'industryPosition',
  differentiators: 'differentiators',
  emergingFocus: 'emergingFocus',
  innovation_activity: 'innovation_activity',
  competitive_position: 'competitive_position',
  technology_alignment: 'technology_alignment',
  partnership_potential: 'partnership_potential',
  
  // Timestamps
  created_at: 'created_at',
  evaluationDate: 'evaluationDate',
  
  // Core score
  IPActivityScore: 'IPActivityScore'
} as const;

/**
 * companies_manufacturing table fields
 * Manufacturing capabilities and supply chain data
 */
export const COMPANIES_MANUFACTURING_FIELDS = {
  // Primary key
  key: 'key',
  
  // Company identification
  companyName: 'companyName',
  englishName: 'englishName',
  
  // Materials assessment
  ManufacturingMaterialsScore: 'ManufacturingMaterialsScore',
  ManufacturingMaterialsJustification: 'ManufacturingMaterialsJustification',
  
  // Scale evaluation
  ManufacturingScaleScore: 'ManufacturingScaleScore',
  ManufacturingScaleJustification: 'ManufacturingScaleJustification',
  
  // Quality assessment
  ManufacturingQualityScore: 'ManufacturingQualityScore',
  ManufacturingQualityJustification: 'ManufacturingQualityJustification',
  
  // Supply chain analysis
  ManufacturingSupplyChainScore: 'ManufacturingSupplyChainScore',
  ManufacturingSupplyChainJustification: 'ManufacturingSupplyChainJustification',
  
  // R&D evaluation
  ManufacturingRDScore: 'ManufacturingRDScore',
  ManufacturingRDJustification: 'ManufacturingRDJustification',
  
  // Overall ratings
  ManufacturingOverallRating: 'ManufacturingOverallRating',
  ManufacturingSummary: 'ManufacturingSummary',
  
  // Research data
  ManufacturingResearch: 'ManufacturingResearch',
  
  // Timestamps
  EvaluationDate: 'EvaluationDate',
  
  // Core score
  manufacturing_score: 'manufacturing_score'
} as const;

/**
 * companies_ownership table fields
 * Ownership structure and decision-making analysis
 */
export const COMPANIES_OWNERSHIP_FIELDS = {
  // Primary key
  key: 'key',
  
  // Company identification
  companyName: 'companyName',
  englishName: 'englishName',
  
  // Ownership type analysis
  OwnershipTypeScore: 'OwnershipTypeScore',
  OwnershipTypeJustification: 'OwnershipTypeJustification',
  
  // Decision making assessment
  OwnershipDecisionMakingScore: 'OwnershipDecisionMakingScore',
  OwnershipDecisionMakingJustification: 'OwnershipDecisionMakingJustification',
  
  // Alignment evaluation
  OwnershipAlignmentScore: 'OwnershipAlignmentScore',
  OwnershipAlignmentJustification: 'OwnershipAlignmentJustification',
  
  // Partnership analysis
  OwnershipPartnershipsScore: 'OwnershipPartnershipsScore',
  OwnershipPartnershipsJustification: 'OwnershipPartnershipsJustification',
  
  // Overall ratings
  OwnershipOverallRating: 'OwnershipOverallRating',
  OwnershipSummary: 'OwnershipSummary',
  
  // Research data
  OwnershipResearch: 'OwnershipResearch',
  
  // Timestamps
  EvaluationDate: 'EvaluationDate',
  
  // Core score
  OwnershipScore: 'OwnershipScore'
} as const;

/**
 * companies_hydrogen table fields
 * Hydrogen-specific strategy and readiness analysis
 */
export const COMPANIES_HYDROGEN_FIELDS = {
  // Primary key
  key: 'key',
  
  // Company identification
  companyName: 'companyName',
  englishName: 'englishName',
  
  // Investment focus
  H2investScore: 'H2investScore',
  H2investJustification: 'H2investJustification',
  H2investmentFocus: 'H2investmentFocus',
  
  // Partnership strategy
  H2partnersScore: 'H2partnersScore',
  H2partnersJustification: 'H2partnersJustification',
  H2partnershipStrategy: 'H2partnershipStrategy',
  
  // Technology readiness
  H2TechScore: 'H2TechScore',
  H2TechJustification: 'H2TechJustification',
  H2technologyReadiness: 'H2technologyReadiness',
  
  // Commitment level
  H2CommitScore: 'H2CommitScore',
  H2CommitJustification: 'H2CommitJustification',
  
  // Participation assessment
  H2ParticipationScore: 'H2ParticipationScore',
  H2ParticipationJustification: 'H2ParticipationJustification',
  
  // Market positioning
  H2marketPositioning: 'H2marketPositioning',
  
  // Research data
  H2Research: 'H2Research',
  
  // Overall ratings
  H2OverallRating: 'H2OverallRating',
  H2Summary: 'H2Summary',
  
  // Timestamps
  created_at: 'created_at',
  EvaluationDate: 'EvaluationDate',
  
  // Core score
  H2Score: 'H2Score'
} as const;

/**
 * company_overview view fields
 * Aggregated view combining data from multiple tables
 */
export const COMPANY_OVERVIEW_FIELDS = {
  // Primary key
  key: 'key',
  
  // Basic information
  englishName: 'englishName',
  companyName: 'companyName',
  logoUrl: 'logoUrl',
  website: 'website',
  country: 'country',
  ceres_region: 'ceres_region',
  company_state: 'company_state',
  parent_company_name: 'parent_company_name',
  ticker: 'ticker',
  visualElement: 'visualElement',
  primaryMarket: 'primaryMarket',
  businessModel: 'businessModel',
  Tier: 'Tier',
  
  // Core scores
  overallScore: 'overallScore',
  strategicFit: 'strategicFit',
  abilityToExecute: 'abilityToExecute',
  
  // Financial data
  annual_revenue: 'annual_revenue',
  finance_score: 'finance_score',
  financial_rating: 'financial_rating',
  
  // Pillar scores
  industry_score: 'industry_score',
  industry_rationale: 'industry_rationale',
  H2Score: 'H2Score',
  H2OverallRating: 'H2OverallRating',
  IPActivityScore: 'IPActivityScore',
  IPOverallRating: 'IPOverallRating',
  manufacturing_score: 'manufacturing_score',
  ManufacturingOverallRating: 'ManufacturingOverallRating',
  OwnershipScore: 'OwnershipScore',
  OwnershipOverallRating: 'OwnershipOverallRating'
} as const;

/**
 * scoring_weights table fields
 * Configurable scoring weights for different criteria
 */
export const SCORING_WEIGHTS_FIELDS = {
  // Primary key
  id: 'id',
  
  // Weight configuration
  criteria: 'criteria',
  weight: 'weight',
  
  // Timestamps
  created_at: 'created_at'
} as const;

// ============================================================================
// PILLAR SCORE FIELD MAPPINGS
// ============================================================================

/**
 * Pillar score field mappings for each pillar type
 * Maps pillar types to their respective score and rationale fields
 */
export const PILLAR_SCORE_FIELDS = {
  finance: {
    table: 'company_financial',
    scoreField: 'finance_score',
    rationaleField: 'financialSummary',
    featuresField: 'financialReserach'
  },
  industry: {
    table: 'companies_industry',
    scoreField: 'industry_score',
    rationaleField: 'rationale',
    featuresField: 'industry_output'
  },
  ip: {
    table: 'companies_ip_revision', // Using revision table
    scoreField: 'IPActivityScore',
    rationaleField: 'IPStrategySummary',
    featuresField: 'IPResearch'
  },
  manufacturing: {
    table: 'companies_manufacturing',
    scoreField: 'manufacturing_score',
    rationaleField: 'ManufacturingSummary',
    featuresField: 'ManufacturingResearch'
  },
  ownership: {
    table: 'companies_ownership',
    scoreField: 'OwnershipScore',
    rationaleField: 'OwnershipSummary',
    featuresField: 'OwnershipResearch'
  },
  hydrogen: {
    table: 'companies_hydrogen',
    scoreField: 'H2Score',
    rationaleField: 'H2Summary',
    featuresField: 'H2Research'
  }
} as const;

// ============================================================================
// COMMON FIELD MAPPINGS
// ============================================================================

/**
 * Common fields used across multiple tables
 */
export const COMMON_FIELDS = {
  // Primary keys
  key: 'key',
  id: 'id',
  
  // Company identification
  englishName: 'englishName',
  companyName: 'companyName',
  
  // Timestamps
  created_at: 'created_at',
  updated_at: 'updated_at',
  evaluation_date: 'evaluation_date',
  EvaluationDate: 'EvaluationDate',
  
  // Core scores (0-10 scale)
  overallScore: 'overallScore',
  strategicFit: 'strategicFit',
  abilityToExecute: 'abilityToExecute',
  
  // Pillar scores
  finance_score: 'finance_score',
  industry_score: 'industry_score',
  IPActivityScore: 'IPActivityScore',
  manufacturing_score: 'manufacturing_score',
  OwnershipScore: 'OwnershipScore',
  H2Score: 'H2Score'
} as const;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Pillar types supported in the system
 */
export type PillarType = keyof typeof PILLAR_SCORE_FIELDS;

/**
 * Table names for all company-related tables
 */
export type CompanyTableName = 
  | 'companies_profile'
  | 'company_financial'
  | 'companies_industry'
  | 'companies_ip_revision'
  | 'companies_manufacturing'
  | 'companies_ownership'
  | 'companies_hydrogen'
  | 'company_overview'
  | 'scoring_weights';

/**
 * Field name types for each table
 */
export type CompaniesProfileField = keyof typeof COMPANIES_PROFILE_FIELDS;
export type CompanyFinancialField = keyof typeof COMPANY_FINANCIAL_FIELDS;
export type CompaniesIndustryField = keyof typeof COMPANIES_INDUSTRY_FIELDS;
export type CompaniesIpRevisionField = keyof typeof COMPANIES_IP_REVISION_FIELDS;
export type CompaniesManufacturingField = keyof typeof COMPANIES_MANUFACTURING_FIELDS;
export type CompaniesOwnershipField = keyof typeof COMPANIES_OWNERSHIP_FIELDS;
export type CompaniesHydrogenField = keyof typeof COMPANIES_HYDROGEN_FIELDS;
export type CompanyOverviewField = keyof typeof COMPANY_OVERVIEW_FIELDS;
export type ScoringWeightsField = keyof typeof SCORING_WEIGHTS_FIELDS;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get the correct table name for a pillar type
 */
export function getPillarTableName(pillar: PillarType): string {
  return PILLAR_SCORE_FIELDS[pillar].table;
}

/**
 * Get the score field name for a pillar type
 */
export function getPillarScoreField(pillar: PillarType): string {
  return PILLAR_SCORE_FIELDS[pillar].scoreField;
}

/**
 * Get the rationale field name for a pillar type
 */
export function getPillarRationaleField(pillar: PillarType): string {
  return PILLAR_SCORE_FIELDS[pillar].rationaleField;
}

/**
 * Get the features field name for a pillar type
 */
export function getPillarFeaturesField(pillar: PillarType): string {
  return PILLAR_SCORE_FIELDS[pillar].featuresField;
}

/**
 * Validate if a field exists in a specific table
 */
export function isValidField(table: CompanyTableName, field: string): boolean {
  switch (table) {
    case 'companies_profile':
      return field in COMPANIES_PROFILE_FIELDS;
    case 'company_financial':
      return field in COMPANY_FINANCIAL_FIELDS;
    case 'companies_industry':
      return field in COMPANIES_INDUSTRY_FIELDS;
    case 'companies_ip_revision':
      return field in COMPANIES_IP_REVISION_FIELDS;
    case 'companies_manufacturing':
      return field in COMPANIES_MANUFACTURING_FIELDS;
    case 'companies_ownership':
      return field in COMPANIES_OWNERSHIP_FIELDS;
    case 'companies_hydrogen':
      return field in COMPANIES_HYDROGEN_FIELDS;
    case 'company_overview':
      return field in COMPANY_OVERVIEW_FIELDS;
    case 'scoring_weights':
      return field in SCORING_WEIGHTS_FIELDS;
    default:
      return false;
  }
}
