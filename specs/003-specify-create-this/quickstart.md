# Quickstart: Global Application Shell

## Prerequisites
- Node 18+, Vite project with Tailwind configured
- shadcn/ui installed and src/components/ui/* available

## Steps
1) Add dependencies (if missing): 
pm i lucide-react
2) Create context provider SidebarProvider under src/components/ui/sidebar/ with open, setOpen.
3) Build AppShell layout with:
   - Left sidebar (collapsible, hover-expand on desktop, overlay on mobile)
   - Top header with search input and profile/status area
   - Main content area using card/grid patterns
4) Wire theme toggle and persist to localStorage (30-day TTL).
5) Add tooltips/aria-labels for collapsed icons and ensure keyboard navigation.
6) Route search submissions to /search?query=...&scope=all (placeholder view acceptable initially).

## Validate
- Resize to mobile/desktop and verify sidebar behavior
- Toggle dark mode and refresh (preference persists)
- Run tests: 
pm run test
"@;
 = @"
# Contract: UI Shell Components

## SidebarProvider (Context)
Props: none
Context value: { open: boolean; setOpen(next: boolean): void }

## SidebarLink
Props: { href: string; label: string; icon: LucideIcon; className?: string }

## AppShell
Props: { children: ReactNode }
Behavior:
- Renders sidebar + header + main
- Responsive: overlay on mobile, collapsible on desktop
- Theme-aware classes applied at root

## StatusBadge
Props: { code: 'success' | 'pending' | 'failed'; label?: string }
"@;
 = @"
# Contract: Global Search

## Request
- Path: /search
- Query params: query: string, scope?: 'all' | 'companies' | 'dossiers'

## Result Item
- { id: string; type: 'company' | 'dossier'; title: string; subtitle?: string; href: string }

## Behavior
- Submitting from header search navigates to /search with provided params.
