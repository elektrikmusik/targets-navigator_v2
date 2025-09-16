import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppShell } from '../../src/components/ui/AppShell';
import { themePrefs } from '../../src/lib/prefs';
import type { NavigationItem } from '../../src/types/ui-shell';

// Test wrapper with router
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('Shell Theme Persistence Integration', () => {
  const mockNavigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Dashboard',
      destination: '/',
      iconName: 'Home',
    },
  ];

  beforeEach(() => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with system theme by default', () => {
    render(
      <TestWrapper>
        <AppShell navigationItems={mockNavigationItems}>
          <div data-testid="main-content">Main Content</div>
        </AppShell>
      </TestWrapper>
    );

    // Theme toggle should be present
    const themeToggle = screen.getByLabelText(/switch to.*theme/i);
    expect(themeToggle).toBeInTheDocument();
  });

  it('should persist theme changes to localStorage', () => {
    render(
      <TestWrapper>
        <AppShell navigationItems={mockNavigationItems}>
          <div data-testid="main-content">Main Content</div>
        </AppShell>
      </TestWrapper>
    );

    const themeToggle = screen.getByLabelText(/switch to.*theme/i);
    fireEvent.click(themeToggle);

    // Should call localStorage.setItem
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  it('should restore theme from localStorage on reload', () => {
    const storedTheme = {
      mode: 'dark',
      storedAt: new Date().toISOString(),
      ttlDays: 30,
    };

    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedTheme));

    render(
      <TestWrapper>
        <AppShell navigationItems={mockNavigationItems}>
          <div data-testid="main-content">Main Content</div>
        </AppShell>
      </TestWrapper>
    );

    // Should read from localStorage
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('spectest_theme_prefs');
  });

  it('should handle expired theme preferences', () => {
    const expiredTheme = {
      mode: 'dark',
      storedAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString(), // 31 days ago
      ttlDays: 30,
    };

    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(expiredTheme));

    render(
      <TestWrapper>
        <AppShell navigationItems={mockNavigationItems}>
          <div data-testid="main-content">Main Content</div>
        </AppShell>
      </TestWrapper>
    );

    // Should clear expired preferences
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('spectest_theme_prefs');
  });

  it('should cycle through theme modes', () => {
    render(
      <TestWrapper>
        <AppShell navigationItems={mockNavigationItems}>
          <div data-testid="main-content">Main Content</div>
        </AppShell>
      </TestWrapper>
    );

    const themeToggle = screen.getByLabelText(/switch to.*theme/i);
    
    // Click multiple times to cycle through themes
    fireEvent.click(themeToggle);
    fireEvent.click(themeToggle);
    fireEvent.click(themeToggle);

    // Should have called setItem multiple times
    expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(3);
  });

  it('should apply theme to document element', () => {
    render(
      <TestWrapper>
        <AppShell navigationItems={mockNavigationItems}>
          <div data-testid="main-content">Main Content</div>
        </AppShell>
      </TestWrapper>
    );

    const themeToggle = screen.getByLabelText(/switch to.*theme/i);
    fireEvent.click(themeToggle);

    // Document should have theme class applied
    expect(document.documentElement.classList.contains('light') || 
           document.documentElement.classList.contains('dark')).toBe(true);
  });
});
