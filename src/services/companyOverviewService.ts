import { supabase } from '../lib/supabaseClient'
import type { CompanyOverview, CompanyFilters, ServiceResponse, PaginationParams } from '../types/company'

export interface CompanyQueryOptions extends PaginationParams {
  filters?: CompanyFilters
  sortBy?: keyof CompanyOverview
  sortOrder?: 'asc' | 'desc'
}

export class CompanyOverviewService {
  async getCompanies(options: CompanyQueryOptions = {}): Promise<ServiceResponse<CompanyOverview[]> & { count: number }> {
    try {
      let query = supabase
        .from('company_overview')
        .select('key, "englishName", website, country, ticker, "Tier", "strategicFit", "abilityToExecute", "overallScore", "finance_score", "industry_score", "H2Score", "IPActivityScore", "manufacturing_score", "OwnershipScore"', { count: 'exact' })

      // Apply filters
      if (options.filters) {
        const { countries, tiers, revenueBands, rankingCategories } = options.filters
        
        if (countries && countries.length > 0) {
          query = query.in('country', countries)
        }
        
        if (tiers && tiers.length > 0) {
          query = query.in('"Tier"', tiers)
        }
        
        if (revenueBands && revenueBands.length > 0) {
          // Convert revenue band strings to numeric ranges and filter
          const revenueConditions = revenueBands.map(band => {
            switch (band) {
              case '< $1M': return 'lt.1'
              case '$1M - $10M': return 'gte.1.and.lt.10'
              case '$10M - $100M': return 'gte.10.and.lt.100'  
              case '$100M - $1B': return 'gte.100.and.lt.1000'
              case '> $1B': return 'gte.1000'
              default: return null
            }
          }).filter(Boolean)
          
          if (revenueConditions.length > 0) {
            // For now, we'll implement a simple numeric range filter
            // This is a simplified approach - in production you'd want more sophisticated range filtering
            if (revenueBands.includes('< $1M')) {
              query = query.or('"parentRevenue".lt.1,parentRevenue.is.null')
            } else if (revenueBands.includes('> $1B')) {
              query = query.gte('"parentRevenue"', 1000)
            }
          }
        }
        
        // Note: rankingCategory not available in company_overview view
        // if (rankingCategories && rankingCategories.length > 0) {
        //   query = query.in('"rankingCategory"', rankingCategories)
        // }
      }

      // Apply sorting with tie-breakers
      const sortBy = options.sortBy || 'overallScore'
      const sortOrder = options.sortOrder || 'desc'
      
      // Map sortBy to the correct column name with quotes if needed
      const sortColumn = sortBy === 'overallScore' ? '"overallScore"' 
                       : sortBy === 'strategicFit' ? '"strategicFit"'
                       : sortBy === 'abilityToExecute' ? '"abilityToExecute"'
                       : sortBy === 'name' ? '"englishName"'
                       : sortBy
      
      query = query.order(sortColumn, { ascending: sortOrder === 'asc' })
      
      // Apply tie-breakers for consistent sorting
      if (sortBy !== 'abilityToExecute') {
        query = query.order('"abilityToExecute"', { ascending: false })
      }
      if (sortBy !== 'strategicFit') {
        query = query.order('"strategicFit"', { ascending: false })
      }
      if (sortBy !== 'name') {
        query = query.order('"englishName"', { ascending: true })
      }

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit)
      }
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 50) - 1)
      }

      const { data, error, count } = await query

      if (error) {
        return { data: [], count: 0, error: error.message }
      }

      // Map the data to match our interface
      const mappedData: CompanyOverview[] = (data || []).map((item: any) => ({
        key: item.key?.toString() || '',
        name: item.englishName || '',
        website: item.website,
        geography: item.country || '',
        ticker: item.ticker,
        tags: [], // productTags not available in company_overview view
        tier: item.Tier || 'Unknown',
        rankingCategory: 'Unknown', // rankingCategory not available in company_overview view
        strategicFit: item.strategicFit || 0,
        abilityToExecute: item.abilityToExecute || 0,
        overallScore: item.overallScore || 0,
        updated_at: new Date().toISOString() // created_at not available in company_overview view
      }))

      return { 
        data: mappedData, 
        count: count || 0, 
        error: null 
      }
    } catch (err) {
      return { 
        data: [], 
        count: 0, 
        error: err instanceof Error ? err.message : 'Unknown error' 
      }
    }
  }

  async getCompanyByKey(key: string): Promise<ServiceResponse<CompanyOverview>> {
    try {
      const { data, error } = await supabase
        .from('company_overview')
        .select('key, "englishName", website, country, ticker, "Tier", "strategicFit", "abilityToExecute", "overallScore", "finance_score", "industry_score", "H2Score", "IPActivityScore", "manufacturing_score", "OwnershipScore"')
        .eq('key', key)
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      // Map the single item data
      const mappedData: CompanyOverview = {
        key: data.key?.toString() || '',
        name: data.englishName || '',
        website: data.website,
        geography: data.country || '',
        ticker: data.ticker,
        tags: [], // productTags not available in company_overview view
        tier: data.Tier || 'Unknown',
        rankingCategory: 'Unknown', // rankingCategory not available in company_overview view
        strategicFit: data.strategicFit || 0,
        abilityToExecute: data.abilityToExecute || 0,
        overallScore: data.overallScore || 0,
        updated_at: new Date().toISOString() // created_at not available in company_overview view
      }

      return { data: mappedData, error: null }
    } catch (err) {
      return { 
        data: null, 
        error: err instanceof Error ? err.message : 'Unknown error' 
      }
    }
  }
}
