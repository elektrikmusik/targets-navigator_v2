import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CompanyDossierComponent } from '../components/CompanyDossier'
import { ErrorBoundary } from '../components/ErrorBoundary'

export const DossierView: React.FC = () => {
  const { companyKey } = useParams<{ companyKey: string }>()
  const navigate = useNavigate()

  const handleClose = () => {
    navigate('/')
  }

  if (!companyKey) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-900 font-medium mb-2">Invalid Company</p>
          <p className="text-gray-600 text-sm">No company key provided</p>
          <button
            onClick={handleClose}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to List
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ErrorBoundary>
          <CompanyDossierComponent
            companyKey={companyKey}
            onClose={handleClose}
            className="h-full"
          />
        </ErrorBoundary>
      </div>
    </div>
  )
}
