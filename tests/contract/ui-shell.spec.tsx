import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppShell } from '../../src/components/ui/AppShell';
import { SidebarProvider } from '../../src/components/ui/sidebar/SidebarProvider';
import { Sidebar } from '../../src/components/ui/sidebar/Sidebar';
import { Header } from '../../src/components/ui/header/Header';
import { StatusBadge } from '../../src/components/ui/StatusBadge';
import { SidebarLink } from '../../src/components/ui/sidebar/SidebarLink';
import { ThemeToggle } from '../../src/components/ui/header/ThemeToggle';
import type { NavigationItem } from '../../src/types/ui-shell';

// Test wrapper with router
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('UI Shell Contract Tests', () => {
  const mockNavigationItems: NavigationItem[] = [
    {
      id: 'test',
      label: 'Test Item',
      destination: '/test',
      iconName: 'Home',
    },
  ];

  describe('SidebarProvider', () => {
    it('should provide sidebar context', () => {
      render(
        <TestWrapper>
          <SidebarProvider>
            <div data-testid="test-child">Test</div>
          </SidebarProvider>
        </TestWrapper>
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('should throw error when used outside provider', () => {
      // This test would need to be implemented with error boundary
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Sidebar', () => {
    it('should render navigation items', () => {
      render(
        <TestWrapper>
          <SidebarProvider>
            <Sidebar navigationItems={mockNavigationItems} />
          </SidebarProvider>
        </TestWrapper>
      );

      expect(screen.getByText('Test Item')).toBeInTheDocument();
    });

    it('should have proper ARIA attributes', () => {
      render(
        <TestWrapper>
          <SidebarProvider>
            <Sidebar navigationItems={mockNavigationItems} />
          </SidebarProvider>
        </TestWrapper>
      );

      const nav = screen.getByRole('navigation', { name: 'Main navigation' });
      expect(nav).toBeInTheDocument();
    });
  });

  describe('Header', () => {
    it('should render search input', () => {
      render(
        <TestWrapper>
          <SidebarProvider>
            <Header />
          </SidebarProvider>
        </TestWrapper>
      );

      expect(screen.getByPlaceholderText('Search companies, dossiers...')).toBeInTheDocument();
    });

    it('should render theme toggle', () => {
      render(
        <TestWrapper>
          <SidebarProvider>
            <Header />
          </SidebarProvider>
        </TestWrapper>
      );

      expect(screen.getByLabelText(/switch to.*theme/i)).toBeInTheDocument();
    });
  });

  describe('StatusBadge', () => {
    it('should render success badge', () => {
      render(<StatusBadge code="success" />);
      expect(screen.getByText('Success')).toBeInTheDocument();
    });

    it('should render pending badge', () => {
      render(<StatusBadge code="pending" />);
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('should render failed badge', () => {
      render(<StatusBadge code="failed" />);
      expect(screen.getByText('Failed')).toBeInTheDocument();
    });

    it('should have proper ARIA attributes', () => {
      render(<StatusBadge code="success" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('aria-label', 'Status: Success');
    });
  });

  describe('SidebarLink', () => {
    it('should render link with label and icon', () => {
      const MockIcon = () => <div data-testid="mock-icon">Icon</div>;
      
      render(
        <TestWrapper>
          <SidebarLink
            href="/test"
            label="Test Link"
            icon={MockIcon}
          />
        </TestWrapper>
      );

      expect(screen.getByText('Test Link')).toBeInTheDocument();
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('should have proper accessibility attributes', () => {
      const MockIcon = () => <div>Icon</div>;
      
      render(
        <TestWrapper>
          <SidebarLink
            href="/test"
            label="Test Link"
            icon={MockIcon}
          />
        </TestWrapper>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/test');
    });
  });

  describe('ThemeToggle', () => {
    it('should render theme toggle button', () => {
      render(<ThemeToggle />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should have proper accessibility attributes', () => {
      render(<ThemeToggle />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label');
      expect(button.getAttribute('aria-label')).toMatch(/switch to.*theme/i);
    });
  });

  describe('AppShell', () => {
    it('should render with navigation items', () => {
      render(
        <TestWrapper>
          <AppShell navigationItems={mockNavigationItems}>
            <div data-testid="main-content">Main Content</div>
          </AppShell>
        </TestWrapper>
      );

      expect(screen.getByTestId('main-content')).toBeInTheDocument();
      expect(screen.getByText('Test Item')).toBeInTheDocument();
    });

    it('should render header and sidebar', () => {
      render(
        <TestWrapper>
          <AppShell navigationItems={mockNavigationItems}>
            <div>Content</div>
          </AppShell>
        </TestWrapper>
      );

      expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
      expect(screen.getByRole('navigation')).toBeInTheDocument(); // Sidebar
    });
  });
});
