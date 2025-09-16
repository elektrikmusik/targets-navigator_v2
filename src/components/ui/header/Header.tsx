import React, { useState } from 'react';
import { Search, Menu } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useSidebar } from '../sidebar/SidebarProvider';
import { ThemeToggle } from './ThemeToggle';
import type { HeaderProps } from '../../../types/ui-shell';

export function Header({ className, onSearch }: HeaderProps) {
  const { open, setOpen, isMobile } = useSidebar();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchScope, setSearchScope] = useState<'all' | 'companies' | 'dossiers'>('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery, searchScope);
    } else {
      // Default behavior: navigate to search page
      const params = new URLSearchParams({
        query: searchQuery,
        scope: searchScope,
      });
      window.location.href = `/search?${params.toString()}`;
    }
  };

  return (
    <header
      className={cn(
        'flex h-16 items-center justify-between px-4 border-b bg-background',
        'sticky top-0 z-30',
        className
      )}
    >
      {/* Left side - Mobile menu button and search */}
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile menu button */}
        {isMobile && (
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search companies, dossiers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
          
          {/* Search scope selector */}
          <div className="flex gap-2 mt-2">
            {(['all', 'companies', 'dossiers'] as const).map((scope) => (
              <button
                key={scope}
                type="button"
                onClick={() => setSearchScope(scope)}
                className={cn(
                  'px-3 py-1 text-xs rounded-full transition-colors',
                  searchScope === scope
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {scope.charAt(0).toUpperCase() + scope.slice(1)}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Right side - Theme toggle and profile */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <ThemeToggle />

        {/* Profile placeholder */}
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
          <span className="text-xs font-medium">U</span>
        </div>
      </div>
    </header>
  );
}
