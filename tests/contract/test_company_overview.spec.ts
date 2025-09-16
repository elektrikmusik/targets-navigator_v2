import { describe, it, expect, beforeAll } from 'vitest'
import { supabase } from '../../src/lib/supabaseClient'

describe('Supabase company_overview view access', () => {
  beforeAll(async () => {
    // Ensure we can connect to Supabase
    const { data, error } = await supabase.from('company_overview').select('count').limit(1)
    if (error) {
      throw new Error(`Failed to connect to Supabase: ${error.message}`)
    }
  })

  it('should be able to select from company_overview view', async () => {
    const { data, error } = await supabase
      .from('company_overview')
      .select('key, name, geography, overallScore, strategicFit, abilityToExecute')
      .limit(5)

    expect(error).toBeNull()
    expect(data).toBeDefined()
    expect(Array.isArray(data)).toBe(true)
  })

  it('should return expected columns from company_overview', async () => {
    const { data, error } = await supabase
      .from('company_overview')
      .select('*')
      .limit(1)

    expect(error).toBeNull()
    expect(data).toBeDefined()
    expect(data?.length).toBeGreaterThan(0)
    
    if (data && data.length > 0) {
      const company = data[0]
      expect(company).toHaveProperty('key')
      expect(company).toHaveProperty('name')
      expect(company).toHaveProperty('geography')
      expect(company).toHaveProperty('overallScore')
      expect(company).toHaveProperty('strategicFit')
      expect(company).toHaveProperty('abilityToExecute')
    }
  })

  it('should support filtering by geography', async () => {
    const { data, error } = await supabase
      .from('company_overview')
      .select('key, name, geography')
      .eq('geography', 'USA')
      .limit(5)

    expect(error).toBeNull()
    expect(data).toBeDefined()
    expect(Array.isArray(data)).toBe(true)
  })

  it('should support ordering by overallScore', async () => {
    const { data, error } = await supabase
      .from('company_overview')
      .select('key, name, overallScore')
      .order('overallScore', { ascending: false })
      .limit(5)

    expect(error).toBeNull()
    expect(data).toBeDefined()
    expect(Array.isArray(data)).toBe(true)
    
    if (data && data.length > 1) {
      // Verify ordering
      for (let i = 0; i < data.length - 1; i++) {
        expect(data[i].overallScore).toBeGreaterThanOrEqual(data[i + 1].overallScore)
      }
    }
  })

  it('should support limit and offset for pagination', async () => {
    const { data, error } = await supabase
      .from('company_overview')
      .select('key, name')
      .range(0, 4) // limit 5, offset 0

    expect(error).toBeNull()
    expect(data).toBeDefined()
    expect(Array.isArray(data)).toBe(true)
    expect(data?.length).toBeLessThanOrEqual(5)
  })
})
