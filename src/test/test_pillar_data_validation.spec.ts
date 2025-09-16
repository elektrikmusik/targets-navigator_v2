import { describe, it, expect } from 'vitest'

// Test data validation for pillar top_features
describe('Pillar Data Validation', () => {
  it('should handle non-array top_features gracefully', () => {
    // Test cases for different data types that might come from the database
    const testCases = [
      { top_features: null },
      { top_features: undefined },
      { top_features: 'string instead of array' },
      { top_features: 123 },
      { top_features: {} },
      { top_features: true },
      { top_features: [] }, // valid empty array
      { top_features: ['feature1', 'feature2'] } // valid array
    ]

    testCases.forEach((testCase, index) => {
      // Simulate the validation logic from our service
      const validatedFeatures = Array.isArray(testCase.top_features) 
        ? testCase.top_features 
        : []
      
      expect(Array.isArray(validatedFeatures)).toBe(true)
      expect(validatedFeatures).toEqual(
        Array.isArray(testCase.top_features) ? testCase.top_features : []
      )
    })
  })

  it('should handle map operation safely', () => {
    const pillar = {
      top_features: ['Feature 1', 'Feature 2', 'Feature 3']
    }

    // This should work without error
    const features = pillar.top_features && Array.isArray(pillar.top_features) && pillar.top_features.length > 0
      ? pillar.top_features.map((feature, index) => ({ feature, index }))
      : []

    expect(features).toHaveLength(3)
    expect(features[0]).toEqual({ feature: 'Feature 1', index: 0 })
  })

  it('should handle invalid top_features without crashing', () => {
    const invalidPillars = [
      { top_features: null },
      { top_features: 'not an array' },
      { top_features: 123 }
    ]

    invalidPillars.forEach(pillar => {
      // This should not throw an error
      const shouldRender = pillar.top_features && Array.isArray(pillar.top_features) && pillar.top_features.length > 0
      expect(shouldRender).toBe(false)
    })
  })
})
