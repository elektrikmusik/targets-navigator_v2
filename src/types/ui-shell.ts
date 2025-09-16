/**
 * UI Shell types based on data model
 * Defines entities for the global application shell
 */

export interface NavigationItem {
  id: string;
  label: string;
  destination: string; // URL or route name
  iconName: string; // Lucide icon key
  group?: string;
  children?: NavigationItem[]; // max depth: 2
  visible?: boolean | ((context: any) => boolean);
}

export interface SidebarState {
  isOpen: boolean;
  isPinned?: boolean;
  lastInteraction?: string; // ISO datetime
  deviceContext: 'mobile' | 'desktop';
}

export interface ThemePreference {
  mode: 'light' | 'dark' | 'system';
  storedAt: string; // ISO datetime
  ttlDays: number; // default 30
}

export interface HeaderSearch {
  query: string;
  scope: 'companies' | 'dossiers' | 'all'; // default 'all'
  destination: string; // '/search'
  lastUsed?: string; // ISO datetime
}

export interface StatusBadge {
  code: 'success' | 'pending' | 'failed';
  label: string;
  colorToken: string; // e.g., 'green-500'
  description?: string;
}

export interface ContentPanel {
  title: string;
  summary?: string;
  actions?: {
    label: string;
    icon?: string; // Lucide icon key
    href?: string;
  }[];
  statusBadges?: StatusBadge[];
}

// Component prop types
export interface SidebarProviderProps {
  children: React.ReactNode;
}

export interface SidebarLinkProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>; // LucideIcon
  className?: string;
  isActive?: boolean;
}

export interface AppShellProps {
  children: React.ReactNode;
  className?: string;
}

export interface StatusBadgeProps {
  code: 'success' | 'pending' | 'failed';
  label?: string;
  className?: string;
}

export interface HeaderProps {
  className?: string;
  onSearch?: (query: string, scope: 'all' | 'companies' | 'dossiers') => void;
}

export interface SearchViewProps {
  query?: string;
  scope?: 'all' | 'companies' | 'dossiers';
  className?: string;
}

// Context types
export interface SidebarContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  isMobile: boolean;
}

// Search result types
export interface SearchResult {
  id: string;
  type: 'company' | 'dossier';
  title: string;
  subtitle?: string;
  href: string;
}

// Theme context types
export interface ThemeContextValue {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  resolvedTheme: 'light' | 'dark';
}
