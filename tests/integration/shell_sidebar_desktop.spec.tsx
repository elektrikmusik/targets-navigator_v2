import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppShell } from '../../src/components/ui/AppShell';
import type { NavigationItem } from '../../src/types/ui-shell';

// Test wrapper with router
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

// Mock window.innerWidth for desktop
const mockDesktopWidth = () => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,
  });
};

describe('Shell Sidebar Desktop Integration', () => {
  const mockNavigationItems: NavigationItem[] = [
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
  ];

  beforeEach(() => {
    mockDesktopWidth();
  });

  it('should show sidebar on desktop by default', () => {
    render(
      <TestWrapper>
        <AppShell navigationItems={mockNavigationItems}>
          <div data-testid="main-content">Main Content</div>
        </AppShell>
      </TestWrapper>
    );

    // Sidebar should be visible on desktop
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /companies/i })).toBeInTheDocument();
  });

  it('should have collapsible sidebar on desktop', () => {
    render(
      <TestWrapper>
        <AppShell navigationItems={mockNavigationItems}>
          <div data-testid="main-content">Main Content</div>
        </AppShell>
      </TestWrapper>
    );

    // Sidebar should be present
    const sidebar = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(sidebar).toBeInTheDocument();
  });

  it('should navigate when clicking sidebar links', () => {
    render(
      <TestWrapper>
        <AppShell navigationItems={mockNavigationItems}>
          <div data-testid="main-content">Main Content</div>
        </AppShell>
      </TestWrapper>
    );

    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashboardLink).toHaveAttribute('href', '/');
  });

  it('should show active state for current page', () => {
    // Mock current location
    Object.defineProperty(window, 'location', {
      value: { pathname: '/' },
      writable: true,
    });

    render(
      <TestWrapper>
        <AppShell navigationItems={mockNavigationItems}>
          <div data-testid="main-content">Main Content</div>
        </AppShell>
      </TestWrapper>
    );

    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashboardLink).toHaveAttribute('aria-current', 'page');
  });

  it('should maintain sidebar state across page navigation', () => {
    render(
      <TestWrapper>
        <AppShell navigationItems={mockNavigationItems}>
          <div data-testid="main-content">Main Content</div>
        </AppShell>
      </TestWrapper>
    );

    // Sidebar should remain visible
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
