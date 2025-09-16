import React, { createContext, useContext, useEffect, useState } from 'react';
import { sidebarPrefs, type SidebarPrefs } from '../../../lib/prefs';
import type { SidebarContextValue } from '../../../types/ui-shell';

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function SidebarProvider({ children, defaultOpen = false }: SidebarProviderProps) {
  const [open, setOpenState] = useState(defaultOpen);
  const [isMobile, setIsMobile] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const prefs = sidebarPrefs.get();
    setOpenState(prefs.isOpen);
    setIsMobile(prefs.deviceContext === 'mobile');
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-close sidebar on mobile when switching from desktop
      if (mobile && open) {
        setOpenState(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [open]);

  // Persist changes to localStorage
  useEffect(() => {
    const currentPrefs = sidebarPrefs.get();
    const updatedPrefs: Partial<SidebarPrefs> = {
      isOpen: open,
      deviceContext: isMobile ? 'mobile' : 'desktop',
    };

    // Only update if there's a meaningful change
    if (
      currentPrefs.isOpen !== open ||
      currentPrefs.deviceContext !== updatedPrefs.deviceContext
    ) {
      sidebarPrefs.set(updatedPrefs);
    }
  }, [open, isMobile]);

  const setOpen = (newOpen: boolean) => {
    setOpenState(newOpen);
  };

  const toggle = () => {
    setOpenState(prev => !prev);
  };

  const value: SidebarContextValue = {
    open,
    setOpen,
    toggle,
    isMobile,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
