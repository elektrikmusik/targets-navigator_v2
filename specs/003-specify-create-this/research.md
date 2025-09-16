# Research: Global Application Shell

## Decisions
- Use shadcn/ui + Tailwind to replicate Aceternity sidebar patterns (no extra UI framework).
- Icons: lucide-react with consistent sizing via Tailwind (h-5 w-5).
- Theme persistence: localStorage with a 30-day TTL; fallback to prefers-color-scheme.
- Sidebar state: React Context provider (SidebarProvider) with open, setOpen exposed.
- Search: Global route navigates to a unified results view querying Companies/Dossiers by name, ticker, tags.
- Accessibility: WCAG 2.1 AA; keyboard navigation, focus traps for mobile overlay, ARIA landmarks.
- Status badges: success (green-500), pending (yellow-500), failed (red-500); ensure contrast in dark mode.

## Rationale
- Constitution mandates shadcn/ui + Tailwind; avoids extra dependencies.
- Lucide integrates cleanly with Tailwind and shadcn primitives.
- Local persistence is simple, privacy-preserving, and resilient.

## Alternatives Considered
- Adopt Aceternity UI components directly → Rejected (constitution conflict, extra deps).
- Server-persisted preferences → Rejected initially (scope creep, auth dependency).
- Multi-level (>2) navigation → Rejected (complexity and responsiveness concerns).
