/**
 * Preferences utility for theme and sidebar persistence
 * Implements 30-day TTL as per research decisions
 */

export type ThemeMode = 'light' | 'dark' | 'system';

export interface SidebarPrefs {
  isOpen: boolean;
  isPinned?: boolean;
  lastInteraction?: string;
  deviceContext: 'mobile' | 'desktop';
}

export interface ThemePrefs {
  mode: ThemeMode;
  storedAt: string;
  ttlDays: number;
}

const TTL_DAYS = 30;
const STORAGE_KEYS = {
  SIDEBAR: 'spectest_sidebar_prefs',
  THEME: 'spectest_theme_prefs',
} as const;

/**
 * Check if stored data is still valid based on TTL
 */
function isExpired(storedAt: string, ttlDays: number): boolean {
  const stored = new Date(storedAt);
  const now = new Date();
  const diffDays = (now.getTime() - stored.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays > ttlDays;
}

/**
 * Get system theme preference
 */
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Sidebar preferences management
 */
export const sidebarPrefs = {
  get(): SidebarPrefs {
    if (typeof window === 'undefined') {
      return {
        isOpen: false,
        deviceContext: 'desktop',
      };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SIDEBAR);
      if (!stored) {
        return {
          isOpen: false,
          deviceContext: window.innerWidth < 768 ? 'mobile' : 'desktop',
        };
      }

      const parsed = JSON.parse(stored) as SidebarPrefs & { storedAt: string };
      
      // Check TTL
      if (isExpired(parsed.storedAt, TTL_DAYS)) {
        this.clear();
        return {
          isOpen: false,
          deviceContext: window.innerWidth < 768 ? 'mobile' : 'desktop',
        };
      }

      return {
        isOpen: parsed.isOpen,
        isPinned: parsed.isPinned,
        lastInteraction: parsed.lastInteraction,
        deviceContext: parsed.deviceContext,
      };
    } catch {
      return {
        isOpen: false,
        deviceContext: window.innerWidth < 768 ? 'mobile' : 'desktop',
      };
    }
  },

  set(prefs: Partial<SidebarPrefs>): void {
    if (typeof window === 'undefined') return;

    try {
      const current = this.get();
      const updated = {
        ...current,
        ...prefs,
        lastInteraction: new Date().toISOString(),
      };

      localStorage.setItem(
        STORAGE_KEYS.SIDEBAR,
        JSON.stringify({
          ...updated,
          storedAt: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.warn('Failed to save sidebar preferences:', error);
    }
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.SIDEBAR);
  },
};

/**
 * Theme preferences management
 */
export const themePrefs = {
  get(): ThemePrefs {
    if (typeof window === 'undefined') {
      return {
        mode: 'system',
        storedAt: new Date().toISOString(),
        ttlDays: TTL_DAYS,
      };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.THEME);
      if (!stored) {
        return {
          mode: 'system',
          storedAt: new Date().toISOString(),
          ttlDays: TTL_DAYS,
        };
      }

      const parsed = JSON.parse(stored) as ThemePrefs;
      
      // Check TTL
      if (isExpired(parsed.storedAt, parsed.ttlDays)) {
        this.clear();
        return {
          mode: 'system',
          storedAt: new Date().toISOString(),
          ttlDays: TTL_DAYS,
        };
      }

      return parsed;
    } catch {
      return {
        mode: 'system',
        storedAt: new Date().toISOString(),
        ttlDays: TTL_DAYS,
      };
    }
  },

  set(mode: ThemeMode): void {
    if (typeof window === 'undefined') return;

    try {
      const prefs: ThemePrefs = {
        mode,
        storedAt: new Date().toISOString(),
        ttlDays: TTL_DAYS,
      };

      localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(prefs));
    } catch (error) {
      console.warn('Failed to save theme preferences:', error);
    }
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.THEME);
  },

  /**
   * Get the actual theme to apply (resolves 'system' to actual theme)
   */
  getResolvedTheme(): 'light' | 'dark' {
    const prefs = this.get();
    if (prefs.mode === 'system') {
      return getSystemTheme();
    }
    return prefs.mode;
  },
};

/**
 * Apply theme to document
 */
export function applyTheme(theme: 'light' | 'dark'): void {
  if (typeof document === 'undefined') return;
  
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
  document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Initialize theme on app startup
 */
export function initializeTheme(): void {
  const resolvedTheme = themePrefs.getResolvedTheme();
  applyTheme(resolvedTheme);
}
