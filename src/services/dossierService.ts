import { supabase } from '../lib/supabaseClient'
import type { CompanyDossier, PillarScore, DetailedPillarScore, ServiceResponse, PillarSubScores } from '../types/company'
import { 
  getPillarTableName, 
  getPillarScoreField, 
  getPillarRationaleField, 
  getPillarFeaturesField,
  COMPANY_FINANCIAL_FIELDS,
  COMPANIES_INDUSTRY_FIELDS,
  COMPANIES_IP_REVISION_FIELDS,
  COMPANIES_MANUFACTURING_FIELDS,
  COMPANIES_OWNERSHIP_FIELDS,
  COMPANIES_HYDROGEN_FIELDS
} from '../types/database-fields'

export class DossierService {
  async getCompanyDossier(companyKey: string): Promise<ServiceResponse<CompanyDossier>> {
    try {
      // Get company basic info and pillar scores from company_overview view
      const { data: companyData, error: companyError } = await supabase
        .from('company_overview')
        .select('key, "englishName", website, country, ticker, "Tier", "strategicFit", "abilityToExecute", "overallScore", "finance_score", "industry_score", "H2Score", "IPActivityScore", "manufacturing_score", "OwnershipScore"')
        .eq('key', companyKey)
        .single()

      if (companyError) {
        return { data: null, error: companyError.message }
      }

      // Get pillar scores from all pillar tables using proper field mappings
      const pillarPromises = [
        this.getPillarScores('finance', companyKey),
        this.getPillarScores('industry', companyKey),
        this.getPillarScores('ip', companyKey),
        this.getPillarScores('manufacturing', companyKey),
        this.getPillarScores('ownership', companyKey),
        this.getPillarScores('hydrogen', companyKey)
      ]

      // Get detailed pillar scores for radar chart
      const detailedPillarPromises = [
        this.getDetailedPillarScores('finance', companyKey),
        this.getDetailedPillarScores('industry', companyKey),
        this.getDetailedPillarScores('ip', companyKey),
        this.getDetailedPillarScores('manufacturing', companyKey),
        this.getDetailedPillarScores('ownership', companyKey),
        this.getDetailedPillarScores('hydrogen', companyKey)
      ]

      const [pillarResults, detailedPillarResults] = await Promise.all([
        Promise.all(pillarPromises),
        Promise.all(detailedPillarPromises)
      ])

      const pillars: PillarScore[] = []
      const detailedPillars: DetailedPillarScore[] = []

      pillarResults.forEach((result, index) => {
        if (result.data) {
          pillars.push(...result.data)
        } else if (result.error) {
          console.warn(`Failed to load pillar ${index}:`, result.error)
        }
      })

      detailedPillarResults.forEach((result, index) => {
        if (result.data) {
          detailedPillars.push(...result.data)
        } else if (result.error) {
          console.warn(`Failed to load detailed pillar ${index}:`, result.error)
        }
      })

      // Map company data including pillar scores from company_overview view
      const company = {
        key: companyData.key?.toString() || '',
        name: companyData.englishName || '',
        website: companyData.website,
        geography: companyData.country || '',
        ticker: companyData.ticker,
        tags: [], // productTags not available in company_overview view
        tier: companyData.Tier || 'Unknown',
        strategicFit: companyData.strategicFit || 0,
        abilityToExecute: companyData.abilityToExecute || 0,
        overallScore: companyData.overallScore || 0,
        // Add pillar scores from company_overview view
        finance_score: companyData.finance_score,
        industry_score: companyData.industry_score,
        H2Score: companyData.H2Score,
        IPActivityScore: companyData.IPActivityScore,
        manufacturing_score: companyData.manufacturing_score,
        OwnershipScore: companyData.OwnershipScore,
        updated_at: new Date().toISOString()
      }

      return {
        data: {
          company,
          pillars,
          detailedPillars
        },
        error: null
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }
  }

  private async getPillarScores(pillarType: PillarScore['pillar'], companyKey: string): Promise<ServiceResponse<PillarScore[]>> {
    try {
      const tableName = getPillarTableName(pillarType)
      const scoreField = getPillarScoreField(pillarType)
      const rationaleField = getPillarRationaleField(pillarType)
      const featuresField = getPillarFeaturesField(pillarType)

      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('key', companyKey)

      if (error) {
        return { data: null, error: error.message }
      }

      const pillarScores: PillarScore[] = (data || []).map((item: any) => ({
        key: item.key?.toString() || companyKey,
        pillar: pillarType,
        score: item[scoreField],
        rationale_snippet: item[rationaleField],
        top_features: Array.isArray(item[featuresField]) ? item[featuresField] : [],
        evaluation_date: item.evaluation_date,
        source_url: item.source_url,
        last_verified_at: item.last_verified_at
      }))

      return { data: pillarScores, error: null }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }
  }

  async getPillarDetails(companyKey: string, pillar: PillarScore['pillar']): Promise<ServiceResponse<PillarScore>> {
    try {
      const tableName = getPillarTableName(pillar)
      const scoreField = getPillarScoreField(pillar)
      const rationaleField = getPillarRationaleField(pillar)
      const featuresField = getPillarFeaturesField(pillar)

      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('key', companyKey)
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      const pillarScore: PillarScore = {
        key: data.key?.toString() || companyKey,
        pillar,
        score: data[scoreField],
        rationale_snippet: data[rationaleField],
        top_features: Array.isArray(data[featuresField]) ? data[featuresField] : [],
        evaluation_date: data.evaluation_date,
        source_url: data.source_url,
        last_verified_at: data.last_verified_at
      }

      return { data: pillarScore, error: null }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }
  }

  private async getDetailedPillarScores(pillarType: PillarScore['pillar'], companyKey: string): Promise<ServiceResponse<DetailedPillarScore[]>> {
    try {
      const tableName = getPillarTableName(pillarType)
      const scoreField = getPillarScoreField(pillarType)
      const rationaleField = getPillarRationaleField(pillarType)
      const featuresField = getPillarFeaturesField(pillarType)

      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('key', companyKey)

      if (error) {
        return { data: null, error: error.message }
      }

      const detailedPillarScores: DetailedPillarScore[] = (data || []).map((item: any) => {
        const subScores = this.extractSubScores(pillarType, item)
        
        return {
          key: item.key?.toString() || companyKey,
          pillar: pillarType,
          overallScore: item[scoreField],
          subScores,
          rationale_snippet: item[rationaleField],
          top_features: Array.isArray(item[featuresField]) ? item[featuresField] : [],
          evaluation_date: item.evaluation_date,
          source_url: item.source_url,
          last_verified_at: item.last_verified_at
        }
      })

      return { data: detailedPillarScores, error: null }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }
  }

  private extractSubScores(pillarType: PillarScore['pillar'], data: any): PillarSubScores {
    const subScores: PillarSubScores = {}

    switch (pillarType) {
      case 'finance':
        subScores.finance = {
          revenue_score: data[COMPANY_FINANCIAL_FIELDS.revenue_score],
          '3Y_score': data[COMPANY_FINANCIAL_FIELDS['3Y_score']],
          netProfitScore: data[COMPANY_FINANCIAL_FIELDS.netProfitScore],
          investCapacityScore: data[COMPANY_FINANCIAL_FIELDS.investCapacityScore],
          overallRating: data[COMPANY_FINANCIAL_FIELDS.overallRating]
        }
        break

      case 'industry':
        subScores.industry = {
          core_business_score: data[COMPANIES_INDUSTRY_FIELDS.core_business_score],
          technology_score: data[COMPANIES_INDUSTRY_FIELDS.technology_score],
          market_score: data[COMPANIES_INDUSTRY_FIELDS.market_score]
        }
        break

      case 'ip':
        subScores.ip = {
          IPRelevantPatentsScore: data[COMPANIES_IP_REVISION_FIELDS.IPRelevantPatentsScore],
          IPCeresCitationsScore: data[COMPANIES_IP_REVISION_FIELDS.IPCeresCitationsScore],
          IPPortfolioGrowthScore: data[COMPANIES_IP_REVISION_FIELDS.IPPortfolioGrowthScore],
          IPFilingRecencyScore: data[COMPANIES_IP_REVISION_FIELDS.IPFilingRecencyScore],
          IPOverallRating: data[COMPANIES_IP_REVISION_FIELDS.IPOverallRating]
        }
        break

      case 'manufacturing':
        subScores.manufacturing = {
          ManufacturingMaterialsScore: data[COMPANIES_MANUFACTURING_FIELDS.ManufacturingMaterialsScore],
          ManufacturingScaleScore: data[COMPANIES_MANUFACTURING_FIELDS.ManufacturingScaleScore],
          ManufacturingQualityScore: data[COMPANIES_MANUFACTURING_FIELDS.ManufacturingQualityScore],
          ManufacturingSupplyChainScore: data[COMPANIES_MANUFACTURING_FIELDS.ManufacturingSupplyChainScore],
          ManufacturingRDScore: data[COMPANIES_MANUFACTURING_FIELDS.ManufacturingRDScore],
          ManufacturingOverallRating: data[COMPANIES_MANUFACTURING_FIELDS.ManufacturingOverallRating]
        }
        break

      case 'ownership':
        subScores.ownership = {
          OwnershipTypeScore: data[COMPANIES_OWNERSHIP_FIELDS.OwnershipTypeScore],
          OwnershipDecisionMakingScore: data[COMPANIES_OWNERSHIP_FIELDS.OwnershipDecisionMakingScore],
          OwnershipAlignmentScore: data[COMPANIES_OWNERSHIP_FIELDS.OwnershipAlignmentScore],
          OwnershipPartnershipsScore: data[COMPANIES_OWNERSHIP_FIELDS.OwnershipPartnershipsScore],
          OwnershipOverallRating: data[COMPANIES_OWNERSHIP_FIELDS.OwnershipOverallRating]
        }
        break

      case 'hydrogen':
        subScores.hydrogen = {
          H2investScore: data[COMPANIES_HYDROGEN_FIELDS.H2investScore],
          H2partnersScore: data[COMPANIES_HYDROGEN_FIELDS.H2partnersScore],
          H2TechScore: data[COMPANIES_HYDROGEN_FIELDS.H2TechScore],
          H2CommitScore: data[COMPANIES_HYDROGEN_FIELDS.H2CommitScore],
          H2ParticipationScore: data[COMPANIES_HYDROGEN_FIELDS.H2ParticipationScore],
          H2OverallRating: data[COMPANIES_HYDROGEN_FIELDS.H2OverallRating]
        }
        break
    }

    return subScores
  }

}