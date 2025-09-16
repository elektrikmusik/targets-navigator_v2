import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppShell } from '../../src/components/ui/AppShell';
import type { NavigationItem } from '../../src/types/ui-shell';

// Test wrapper with router
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

// Mock window.innerWidth for mobile
const mockMobileWidth = () => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 375,
  });
};

describe('Shell Sidebar Mobile Integration', () => {
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
    mockMobileWidth();
  });

  it('should hide sidebar by default on mobile', () => {
    render(
      <TestWrapper>
        <AppShell navigationItems={mockNavigationItems}>
          <div data-testid="main-content">Main Content</div>
        </AppShell>
      </TestWrapper>
    );

    // Sidebar should be hidden initially on mobile (check for transform class)
    const sidebar = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(sidebar).toBeInTheDocument();
    // Check if sidebar container has the hidden class for mobile
    const sidebarContainer = sidebar.closest('div[class*="fixed"]');
    expect(sidebarContainer).toHaveClass('-translate-x-full');
  });

  it('should show menu button on mobile', () => {
    render(
      <TestWrapper>
        <AppShell navigationItems={mockNavigationItems}>
          <div data-testid="main-content">Main Content</div>
        </AppShell>
      </TestWrapper>
    );

    // Menu button should be present
    const menuButton = screen.getByLabelText('Open sidebar');
    expect(menuButton).toBeInTheDocument();
  });

  it('should open sidebar when menu button is clicked', () => {
    render(
      <TestWrapper>
        <AppShell navigationItems={mockNavigationItems}>
          <div data-testid="main-content">Main Content</div>
        </AppShell>
      </TestWrapper>
    );

    const menuButton = screen.getByLabelText('Open sidebar');
    fireEvent.click(menuButton);

    // Sidebar should now be visible
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /companies/i })).toBeInTheDocument();
  });

  it('should close sidebar when close button is clicked', () => {
    render(
      <TestWrapper>
        <AppShell navigationItems={mockNavigationItems}>
          <div data-testid="main-content">Main Content</div>
        </AppShell>
      </TestWrapper>
    );

    // Open sidebar
    const menuButton = screen.getByLabelText('Open sidebar');
    fireEvent.click(menuButton);

    // Close sidebar
    const closeButton = screen.getByLabelText('Close sidebar');
    fireEvent.click(closeButton);

    // Sidebar should be hidden again
    const sidebar = screen.getByRole('navigation', { name: 'Main navigation' });
    const sidebarContainer = sidebar.closest('div[class*="fixed"]');
    expect(sidebarContainer).toHaveClass('-translate-x-full');
  });

  it('should close sidebar when clicking backdrop', () => {
    render(
      <TestWrapper>
        <AppShell navigationItems={mockNavigationItems}>
          <div data-testid="main-content">Main Content</div>
        </AppShell>
      </TestWrapper>
    );

    // Open sidebar
    const menuButton = screen.getByLabelText('Open sidebar');
    fireEvent.click(menuButton);

    // Click backdrop
    const backdrop = document.querySelector('[data-testid="backdrop"]') || 
                    document.querySelector('.fixed.inset-0.bg-black\\/50');
    if (backdrop) {
      fireEvent.click(backdrop);
    }

    // Sidebar should be hidden
    const sidebar = screen.getByRole('navigation', { name: 'Main navigation' });
    const sidebarContainer = sidebar.closest('div[class*="fixed"]');
    expect(sidebarContainer).toHaveClass('-translate-x-full');
  });

  it('should close sidebar on escape key', () => {
    render(
      <TestWrapper>
        <AppShell navigationItems={mockNavigationItems}>
          <div data-testid="main-content">Main Content</div>
        </AppShell>
      </TestWrapper>
    );

    // Open sidebar
    const menuButton = screen.getByLabelText('Open sidebar');
    fireEvent.click(menuButton);

    // Press escape
    fireEvent.keyDown(document, { key: 'Escape' });

    // Sidebar should be hidden
    const sidebar = screen.getByRole('navigation', { name: 'Main navigation' });
    const sidebarContainer = sidebar.closest('div[class*="fixed"]');
    expect(sidebarContainer).toHaveClass('-translate-x-full');
  });
});
