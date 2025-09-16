import React from 'react';
import { X, Menu, Home, Building2, FileText, BarChart3 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useSidebar } from './SidebarProvider';
import { SidebarLink } from './SidebarLink';
import type { NavigationItem } from '../../../types/ui-shell';

// Icon mapping for navigation items
const iconMap = {
  Home,
  Building2,
  FileText,
  BarChart3,
} as const;

export interface SidebarProps {
  navigationItems: NavigationItem[];
  className?: string;
}

export function Sidebar({ navigationItems, className }: SidebarProps) {
  const { open, setOpen, isMobile } = useSidebar();

  // Close sidebar on mobile when clicking outside
  const handleBackdropClick = () => {
    if (isMobile) {
      setOpen(false);
    }
  };

  // Close sidebar on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open && isMobile) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, isMobile, setOpen]);

  // Prevent body scroll when mobile sidebar is open
  React.useEffect(() => {
    if (isMobile && open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, open]);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <h2 className="text-lg font-semibold">Navigation</h2>
        {isMobile && (
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4" role="navigation" aria-label="Main navigation">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <div key={item.id}>
              <SidebarLink
                href={item.destination}
                label={item.label}
                icon={iconMap[item.iconName as keyof typeof iconMap] || Home}
              />
              
              {/* Render children if any */}
              {item.children && item.children.length > 0 && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <SidebarLink
                      key={child.id}
                      href={child.destination}
                      label={child.label}
                      icon={iconMap[child.iconName as keyof typeof iconMap] || Home}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile backdrop */}
        {open && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />
        )}
        
        {/* Mobile sidebar */}
        <div
          className={cn(
            'fixed top-0 left-0 z-50 h-full w-64 bg-background border-r transform transition-transform duration-300 ease-in-out',
            open ? 'translate-x-0' : '-translate-x-full',
            className
          )}
        >
          {sidebarContent}
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div
      className={cn(
        'hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:left-0 bg-background border-r',
        className
      )}
    >
      {sidebarContent}
    </div>
  );
}
