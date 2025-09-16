import React, { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { themePrefs, applyTheme, initializeTheme } from '../../../lib/prefs';
import type { ThemeMode } from '../../../lib/prefs';

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const prefs = themePrefs.get();
    setThemeState(prefs.mode);
    initializeTheme();
    setMounted(true);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const resolvedTheme = themePrefs.getResolvedTheme();
      applyTheme(resolvedTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    themePrefs.set(newTheme);
    
    const resolvedTheme = newTheme === 'system' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : newTheme;
    
    applyTheme(resolvedTheme);
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <button
        className={cn(
          'p-2 rounded-md hover:bg-accent hover:text-accent-foreground',
          className
        )}
        disabled
      >
        <Sun className="h-5 w-5" />
      </button>
    );
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-5 w-5" />;
      case 'dark':
        return <Moon className="h-5 w-5" />;
      case 'system':
        return <Monitor className="h-5 w-5" />;
    }
  };

  const getNextTheme = (): ThemeMode => {
    switch (theme) {
      case 'light':
        return 'dark';
      case 'dark':
        return 'system';
      case 'system':
        return 'light';
    }
  };

  return (
    <button
      onClick={() => handleThemeChange(getNextTheme())}
      className={cn(
        'p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        className
      )}
      aria-label={`Switch to ${getNextTheme()} theme`}
      title={`Current: ${theme}, click for ${getNextTheme()}`}
    >
      {getIcon()}
    </button>
  );
}
