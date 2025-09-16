import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppShell } from './components/ui/AppShell'
import { CombinedView } from './pages/CombinedView'
import { DossierView } from './pages/DossierView'
import { CompareView } from './pages/CompareView'
import { SearchView } from './pages/SearchView'
import { Home, Building2, FileText, BarChart3 } from 'lucide-react'
import type { NavigationItem } from './types/ui-shell'
import './index.css'

// Navigation items for the sidebar
const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Dashboard',
    destination: '/',
    iconName: 'Home',
  },
  {
    id: 'companies',
    label: 'Companies',
    destination: '/companies',
    iconName: 'Building2',
  },
  {
    id: 'dossiers',
    label: 'Dossiers',
    destination: '/dossiers',
    iconName: 'FileText',
  },
  {
    id: 'compare',
    label: 'Compare',
    destination: '/compare',
    iconName: 'BarChart3',
  },
]

export default function App() {
  return (
    <Router>
      <AppShell navigationItems={navigationItems}>
        <Routes>
          <Route path="/" element={<CombinedView />} />
          <Route path="/dossier/:companyKey" element={<DossierView />} />
          <Route path="/compare" element={<CompareView />} />
          <Route path="/search" element={<SearchView />} />
        </Routes>
      </AppShell>
    </Router>
  )
}
