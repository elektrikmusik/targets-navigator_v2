# Research: 001-specify-web-app

## Decisions
- Vite + React + TypeScript with shadcn/ui and Tailwind for UI primitives and theming (baseline inspired by Tweakcn theme).
- Supabase Postgres is source of truth for scores; read-only from client; RLS enforced.
- Charts via react-plotly.js with plotly.js-dist-min; responsive and accessible. Primary visualization is a bubble chart linked to a filterable table (bidirectional selection and highlighting).
- Exports as branded PDF only (A4 portrait); no Slides export.
- No saved views; filters remain in-session only.

## Rationale
- Vite + React ensures fast dev and simple build; shadcn/ui standardizes components.
- Supabase gives low-friction auth and data; RLS supports safe client-side reads.
- Plotly provides rich charts with minimal setup; supports responsiveness.
- PDF export satisfies executive reporting with minimal complexity.

## Alternatives Considered
- Next.js (SSR/ISR) → Not required; dataset small and SPA acceptable.
- Recharts/Chart.js → Plotly chosen for interactive annotations and subplots.
- Saved views feature → Out of scope per requirements; can add later.

## Open Items Closed
- Sorting defaults and tie-breakers defined.
- Insufficient data thresholds defined.
- Branding defaults defined (no external logo provided).
- Prioritized PoC features: bubble chart, table filtering, and linked table–chart combined view.

## References
- Spec: `C:\Coding\specify\spectest\specs\001-specify-web-app\spec.md`
- Constitution: `C:\Coding\specify\spectest\.specify\memory\constitution.md`
- Theme inspiration: https://tweakcn.com/themes/cmf8vzzdr000404l2d013ag53
- PoC repository: https://github.com/elektrikmusik/targets-navigator


