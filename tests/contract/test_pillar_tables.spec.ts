import { describe, it, expect, beforeAll } from 'vitest'
import { supabase } from '../../src/lib/supabaseClient'

describe('Supabase pillar tables access', () => {
  const pillarTables = [
    'company_financial',
    'companies_industry', 
    'companies_ip_revision',
    'companies_manufacturing',
    'companies_ownership',
    'companies_hydrogen'
  ]

  beforeAll(async () => {
    // Test connection to at least one pillar table
    const { data, error } = await supabase.from('company_financial').select('count').limit(1)
    if (error) {
      throw new Error(`Failed to connect to pillar tables: ${error.message}`)
    }
  })

  it('should be able to select from all pillar tables', async () => {
    for (const tableName of pillarTables) {
      const { data, error } = await supabase
        .from(tableName)
        .select('key, pillar, score, rationale_snippet, evaluation_date')
        .limit(1)

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(Array.isArray(data)).toBe(true)
    }
  })

  it('should return expected columns from pillar tables', async () => {
    const { data, error } = await supabase
      .from('company_financial')
      .select('*')
      .limit(1)

    expect(error).toBeNull()
    expect(data).toBeDefined()
    expect(data?.length).toBeGreaterThan(0)
    
    if (data && data.length > 0) {
      const pillar = data[0]
      expect(pillar).toHaveProperty('key')
      expect(pillar).toHaveProperty('score')
      expect(pillar).toHaveProperty('evaluation_date')
    }
  })

  it('should support filtering by company key', async () => {
    // First get a company key from company_overview
    const { data: companies } = await supabase
      .from('company_overview')
      .select('key')
      .limit(1)

    if (companies && companies.length > 0) {
      const companyKey = companies[0].key
      
      const { data, error } = await supabase
        .from('company_financial')
        .select('key, score, rationale_snippet')
        .eq('key', companyKey)

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(Array.isArray(data)).toBe(true)
    }
  })

  it('should support ordering by evaluation_date', async () => {
    const { data, error } = await supabase
      .from('company_financial')
      .select('key, evaluation_date')
      .order('evaluation_date', { ascending: false })
      .limit(5)

    expect(error).toBeNull()
    expect(data).toBeDefined()
    expect(Array.isArray(data)).toBe(true)
  })

  it('should handle null scores gracefully', async () => {
    const { data, error } = await supabase
      .from('company_financial')
      .select('key, score')
      .is('score', null)
      .limit(5)

    expect(error).toBeNull()
    expect(data).toBeDefined()
    expect(Array.isArray(data)).toBe(true)
  })
})
