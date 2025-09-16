import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Building2, FileText } from 'lucide-react';
import { cn } from '../lib/utils';
import type { SearchViewProps, SearchResult } from '../types/ui-shell';

export function SearchView({ className }: SearchViewProps) {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const query = searchParams.get('query') || '';
  const scope = (searchParams.get('scope') as 'all' | 'companies' | 'dossiers') || 'all';

  // Mock search results - in real implementation, this would call an API
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'company',
          title: `Company matching "${query}"`,
          subtitle: 'Technology Sector',
          href: '/companies/1',
        },
        {
          id: '2',
          type: 'dossier',
          title: `Dossier for "${query}"`,
          subtitle: 'Financial Analysis',
          href: '/dossiers/2',
        },
      ].filter(result => 
        scope === 'all' || result.type === scope
      );

      setResults(mockResults);
      setLoading(false);
    }, 500);
  }, [query, scope]);

  const getIcon = (type: 'company' | 'dossier') => {
    return type === 'company' ? Building2 : FileText;
  };

  return (
    <div className={cn('container mx-auto px-4 py-8', className)}>
      <div className="max-w-4xl mx-auto">
        {/* Search header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          {query && (
            <p className="text-muted-foreground">
              {loading ? 'Searching...' : `Found ${results.length} results for "${query}"`}
              {scope !== 'all' && ` in ${scope}`}
            </p>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No results found</h3>
            <p className="text-muted-foreground">
              {query ? 'Try adjusting your search terms' : 'Enter a search query to get started'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => {
              const Icon = getIcon(result.type);
              return (
                <div
                  key={result.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => window.location.href = result.href}
                >
                  <div className="flex-shrink-0">
                    <Icon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{result.title}</h3>
                    {result.subtitle && (
                      <p className="text-sm text-muted-foreground truncate">
                        {result.subtitle}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-xs px-2 py-1 bg-muted rounded-full">
                      {result.type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
