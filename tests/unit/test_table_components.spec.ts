import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TargetsList } from '../../src/components/TargetsList'
import { FiltersPanel } from '../../src/components/FiltersPanel'
import type { CompanyOverview, CompanyFilters } from '../../src/types/company'

describe('Table Components', () => {
  const mockCompanies: CompanyOverview[] = [
    {
      key: 'company-1',
      name: 'Company 1',
      geography: 'USA',
      overallScore: 8.5,
      strategicFit: 8.0,
      abilityToExecute: 9.0,
      tier: 'Tier 1',
      website: 'https://company1.com',
      ticker: 'COMP1',
      tags: ['technology']
    },
    {
      key: 'company-2',
      name: 'Company 2',
      geography: 'Germany',
      overallScore: 7.2,
      strategicFit: 7.5,
      abilityToExecute: 6.9,
      tier: 'Tier 2',
      website: 'https://company2.com',
      ticker: 'COMP2',
      tags: ['manufacturing']
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('TargetsList', () => {
    it('should render company list', () => {
      render(
        <TargetsList
          companies={mockCompanies}
          selectedKeys={[]}
          onSelectionChange={() => {}}
          onCompanyClick={() => {}}
        />
      )

      expect(screen.getByText('2 companies')).toBeInTheDocument()
      expect(screen.getByText('Company 1')).toBeInTheDocument()
      expect(screen.getByText('Company 2')).toBeInTheDocument()
    })

    it('should handle empty company list', () => {
      render(
        <TargetsList
          companies={[]}
          selectedKeys={[]}
          onSelectionChange={() => {}}
          onCompanyClick={() => {}}
        />
      )

      expect(screen.getByText('No companies found')).toBeInTheDocument()
      expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument()
    })

    it('should show selected companies count', () => {
      render(
        <TargetsList
          companies={mockCompanies}
          selectedKeys={['company-1']}
          onSelectionChange={() => {}}
          onCompanyClick={() => {}}
        />
      )

      expect(screen.getByText('1 selected')).toBeInTheDocument()
    })

    it('should handle company click', () => {
      const onCompanyClick = vi.fn()
      
      render(
        <TargetsList
          companies={mockCompanies}
          selectedKeys={[]}
          onSelectionChange={() => {}}
          onCompanyClick={onCompanyClick}
        />
      )

      fireEvent.click(screen.getByText('Company 1'))
      expect(onCompanyClick).toHaveBeenCalledWith(mockCompanies[0])
    })

    it('should handle selection change', () => {
      const onSelectionChange = vi.fn()
      
      render(
        <TargetsList
          companies={mockCompanies}
          selectedKeys={[]}
          onSelectionChange={onSelectionChange}
          onCompanyClick={() => {}}
        />
      )

      const checkbox = screen.getAllByRole('checkbox')[0]
      fireEvent.click(checkbox)
      
      expect(onSelectionChange).toHaveBeenCalledWith(['company-1'])
    })

    it('should handle sorting', () => {
      const onSortChange = vi.fn()
      
      render(
        <TargetsList
          companies={mockCompanies}
          selectedKeys={[]}
          onSelectionChange={() => {}}
          onCompanyClick={() => {}}
          onSortChange={onSortChange}
        />
      )

      fireEvent.click(screen.getByText('Strategic Fit'))
      expect(onSortChange).toHaveBeenCalledWith('strategicFit', 'desc')
    })

    it('should display company details correctly', () => {
      render(
        <TargetsList
          companies={mockCompanies}
          selectedKeys={[]}
          onSelectionChange={() => {}}
          onCompanyClick={() => {}}
        />
      )

      expect(screen.getByText('USA')).toBeInTheDocument()
      expect(screen.getByText('COMP1')).toBeInTheDocument()
      expect(screen.getByText('technology')).toBeInTheDocument()
      expect(screen.getByText('Overall: 8.5')).toBeInTheDocument()
    })
  })

  describe('FiltersPanel', () => {
    const mockFilters: CompanyFilters = {
      countries: ['USA'],
      tiers: ['Tier 1']
    }

    it('should render filter options', () => {
      render(
        <FiltersPanel
          filters={mockFilters}
          onFiltersChange={() => {}}
        />
      )

      expect(screen.getByText('Filters')).toBeInTheDocument()
      expect(screen.getByLabelText('Geography')).toBeInTheDocument()
      expect(screen.getByLabelText('Company Tier')).toBeInTheDocument()
      expect(screen.getByLabelText('Revenue Band')).toBeInTheDocument()
      expect(screen.getByLabelText('Ranking Categories')).toBeInTheDocument()
    })

    it('should show active filter count', () => {
      render(
        <FiltersPanel
          filters={mockFilters}
          onFiltersChange={() => {}}
        />
      )

      expect(screen.getByText('Clear All (2)')).toBeInTheDocument()
    })

    it('should handle filter changes', () => {
      const onFiltersChange = vi.fn()
      
      render(
        <FiltersPanel
          filters={{}}
          onFiltersChange={onFiltersChange}
        />
      )

      const geographyFilter = screen.getByLabelText('Geography')
      fireEvent.change(geographyFilter, { target: { value: 'USA' } })
      
      expect(onFiltersChange).toHaveBeenCalledWith({ countries: ['USA'] })
    })

    it('should clear all filters', () => {
      const onFiltersChange = vi.fn()
      
      render(
        <FiltersPanel
          filters={mockFilters}
          onFiltersChange={onFiltersChange}
        />
      )

      fireEvent.click(screen.getByText('Clear All (2)'))
      expect(onFiltersChange).toHaveBeenCalledWith({})
    })

    it('should not show clear button when no filters', () => {
      render(
        <FiltersPanel
          filters={{}}
          onFiltersChange={() => {}}
        />
      )

      expect(screen.queryByText('Clear All')).not.toBeInTheDocument()
    })

    it('should handle multiple filter changes', () => {
      const onFiltersChange = vi.fn()
      
      render(
        <FiltersPanel
          filters={{}}
          onFiltersChange={onFiltersChange}
        />
      )

      const geographyFilter = screen.getByLabelText('Geography')
      const tierFilter = screen.getByLabelText('Company Tier')
      
      fireEvent.change(geographyFilter, { target: { value: 'USA' } })
      fireEvent.change(tierFilter, { target: { value: 'Tier 1' } })
      
      expect(onFiltersChange).toHaveBeenCalledWith({ countries: ['USA'] })
      expect(onFiltersChange).toHaveBeenCalledWith({ tiers: ['Tier 1'] })
    })
  })
})
