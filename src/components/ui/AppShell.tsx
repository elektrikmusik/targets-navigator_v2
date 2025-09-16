import React from 'react';
import { cn } from '../../lib/utils';
import { SidebarProvider } from './sidebar/SidebarProvider';
import { Sidebar } from './sidebar/Sidebar';
import { Header } from './header/Header';
import type { AppShellProps, NavigationItem } from '../../types/ui-shell';

export interface AppShellWithProviderProps extends AppShellProps {
  navigationItems: NavigationItem[];
  defaultSidebarOpen?: boolean;
}

export function AppShell({ 
  children, 
  className,
  navigationItems,
  defaultSidebarOpen = false 
}: AppShellWithProviderProps) {
  return (
    <SidebarProvider defaultOpen={defaultSidebarOpen}>
      <div className={cn('min-h-screen bg-background', className)}>
        <Sidebar navigationItems={navigationItems} />
        <div className="md:pl-64">
          <Header />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

// Export the inner component for use within SidebarProvider
export function AppShellInner({ children, className }: AppShellProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
