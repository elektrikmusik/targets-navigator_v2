import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CompareMode } from '../components/CompareMode'
import type { Company } from '../types/company'

export const CompareView: React.FC = () => {
  const navigate = useNavigate()
  const [companies, setCompanies] = useState<Company[]>([])

  useEffect(() => {
    // Load companies from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search)
    const companyKeys = urlParams.get('companies')?.split(',') || []
    
    // Use provided keys or default to 3 companies for demo
    const keysToUse = companyKeys.length > 0 ? companyKeys : ['demo-1', 'demo-2', 'demo-3']
    
    // In a real app, you'd fetch company data by keys
    // For now, we'll use mock data with more realistic company names
    const companyNames = [
      'Hydrogen Dynamics Inc.',
      'Clean Energy Solutions',
      'GreenTech Manufacturing',
      'Sustainable Power Corp',
      'EcoFuel Technologies'
    ]
    
    const geographies = ['USA', 'Germany', 'Japan', 'Canada', 'Netherlands']
    const tiers = ['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Partner']
    
    const mockCompanies: Company[] = keysToUse.map((key, index) => ({
      key,
      name: companyNames[index] || `Company ${index + 1}`,
      geography: geographies[index] || 'USA',
      overallScore: 8.5 - index * 0.5,
      strategicFit: 8.0 - index * 0.3,
      abilityToExecute: 9.0 - index * 0.4,
      tier: tiers[index] || `Tier ${index + 1}`,
      website: `https://${companyNames[index]?.toLowerCase().replace(/\s+/g, '') || `company${index + 1}`}.com`,
      ticker: `${companyNames[index]?.split(' ')[0]?.substring(0, 4) || 'COMP'}${index + 1}`,
      tags: ['hydrogen', 'clean-tech', 'renewable-energy']
    }))
    
    setCompanies(mockCompanies)
  }, [])

  const handleRemoveCompany = (companyKey: string) => {
    setCompanies(prev => prev.filter(c => c.key !== companyKey))
  }

  const handleClose = () => {
    navigate('/')
  }

  return (
    <div className="h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CompareMode
          companies={companies}
          onRemoveCompany={handleRemoveCompany}
          onClose={handleClose}
          className="h-full"
        />
      </div>
    </div>
  )
}
