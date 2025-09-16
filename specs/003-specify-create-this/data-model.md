# Data Model: Global Application Shell

## NavigationItem
- id: string
- label: string
- destination: string (URL or route name)
- iconName: string (Lucide icon key)
- group?: string
- children?: NavigationItem[] (max depth: 2)
- visible?: boolean | rule

## SidebarState
- isOpen: boolean
- isPinned?: boolean
- lastInteraction?: ISO datetime
- deviceContext: 'mobile' | 'desktop'

## ThemePreference
- mode: 'light' | 'dark' | 'system'
- storedAt: ISO datetime
- ttlDays: number (default 30)

## HeaderSearch
- query: string
- scope: 'companies' | 'dossiers' | 'all' (default 'all')
- destination: string ('/search')
- lastUsed?: ISO datetime

## StatusBadge
- code: 'success' | 'pending' | 'failed'
- label: string
- colorToken: string (e.g., 'green-500')
- description?: string

## ContentPanel
- title: string
- summary?: string
- actions?: { label: string; icon?: string; href?: string }[]
- statusBadges?: StatusBadge[]
