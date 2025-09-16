import { supabase } from '../lib/supabaseClient'
import type { PillarScore, ServiceResponse } from '../types/company'
import { PILLAR_SCORE_FIELDS, getPillarTableName, getPillarScoreField, getPillarRationaleField, getPillarFeaturesField } from '../types/database-fields'

export class PillarScoreService {
  async getPillarScoresForCompanies(companyKeys: string[]): Promise<ServiceResponse<PillarScore[]>> {
    try {
      if (companyKeys.length === 0) {
        return { data: [], error: null }
      }

      const allPillarScores: PillarScore[] = []
      const pillarTypes: PillarScore['pillar'][] = ['finance', 'industry', 'ip', 'manufacturing', 'ownership', 'hydrogen']

      // Fetch scores from each pillar table using field dictionary
      for (const pillar of pillarTypes) {
        const tableName = getPillarTableName(pillar)
        const scoreColumn = getPillarScoreField(pillar)
        
        const rationaleColumn = getPillarRationaleField(pillar)
        const featuresColumn = getPillarFeaturesField(pillar)
        
        const { data, error } = await supabase
          .from(tableName)
          .select(`key, ${scoreColumn}, ${rationaleColumn}, ${featuresColumn}, evaluation_date, source_url, last_verified_at`)
          .in('key', companyKeys)

        if (error) {
          console.warn(`Error fetching ${pillar} scores:`, error.message)
          continue
        }

        if (data) {
          const pillarScores: PillarScore[] = data.map(item => ({
            key: item.key?.toString() || '',
            pillar: pillar,
            score: item[scoreColumn as keyof typeof item] as number | null,
            rationale_snippet: item[rationaleColumn as keyof typeof item] as string,
            top_features: Array.isArray(item[featuresColumn as keyof typeof item]) ? item[featuresColumn as keyof typeof item] as string[] : [],
            evaluation_date: item.evaluation_date,
            source_url: item.source_url,
            last_verified_at: item.last_verified_at
          }))
          
          allPillarScores.push(...pillarScores)
        }
      }

      return { data: allPillarScores, error: null }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error fetching pillar scores'
      }
    }
  }

  // Generate mock data for development/testing
  generateMockPillarScores(companyKeys: string[]): PillarScore[] {
    const pillars: PillarScore['pillar'][] = ['finance', 'industry', 'ip', 'manufacturing', 'ownership', 'hydrogen']
    const mockScores: PillarScore[] = []

    companyKeys.forEach((companyKey, companyIndex) => {
      pillars.forEach((pillar, pillarIndex) => {
        // Generate varied but realistic scores
        const baseScore = 5 + Math.sin(companyIndex * 0.5 + pillarIndex * 0.3) * 2
        const randomVariation = (Math.random() - 0.5) * 2
        const score = Math.max(0, Math.min(10, baseScore + randomVariation))
        
        mockScores.push({
          key: companyKey,
          pillar,
          score: Math.round(score * 10) / 10, // Round to 1 decimal place
          rationale_snippet: `Mock rationale for ${pillar} score`,
          top_features: [`Feature 1 for ${pillar}`, `Feature 2 for ${pillar}`],
          evaluation_date: new Date().toISOString().split('T')[0],
          source_url: `https://example.com/${companyKey}/${pillar}`,
          last_verified_at: new Date().toISOString()
        })
      })
    })

    return mockScores
  }
}
