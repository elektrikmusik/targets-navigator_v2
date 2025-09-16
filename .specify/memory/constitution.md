# Spectest Web App Constitution

## Core Principles

### I. Stack-Minimal Vite + React + TypeScript
Use Vite for build/dev, React with TypeScript in strict mode. Avoid custom build steps unless essential. Environment via `.env` and `import.meta.env` only.

### II. UI Consistency with shadcn/ui + Tailwind
Adopt shadcn/ui components on top of Tailwind. Centralize tokens and themes. Prefer utility classes and shadcn primitives over ad-hoc CSS. Dark mode supported.

### III. Charts with Plotly
Use Plotly.js via a React wrapper for charts. Keep chart configuration pure and data-driven. Charts must be responsive and accessible. (If "plotty" is required, swap libraries equivalently.)

### IV. Test-First, Lightweight
Write minimal but meaningful tests for critical logic and key UI states using Vitest + Testing Library. Enforce type safety; treat TypeScript errors as build failures.

### V. Simplicity, Accessibility, Performance
Favor simple components and clear data flow. Meet basic a11y (labels, keyboard navigation, contrast). Ship small, lazy-load heavy charts when feasible.

### VI. Data with Supabase (Auth + DB)
Use Supabase for authentication and Postgres access. Enable RLS on all tables. Never expose service role keys in the client. Configure via Vite envs only.

### VII. Tooling via MCP (Model Context Protocol)
Prefer MCP tools when available for docs lookup, web crawling, platform operations, and diagnostics. Default to non-interactive flags; document actions via PRs/issues.

## Technology Stack Requirements

- Node >= 18; package manager: npm or pnpm
- Vite ^5, React ^18, TypeScript with `strict: true`
- Tailwind CSS + PostCSS + Autoprefixer configured for shadcn/ui
- shadcn/ui installed; components under `src/components/ui/*`; use provided `cn` utility
- Plotly: `react-plotly.js` + `plotly.js-dist-min`
- Supabase: `@supabase/supabase-js` ^2; optional `@supabase/auth-ui-react`
- Env vars in `.env.local`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Optional: Supabase CLI for local dev and types generation
- Optional routing: `react-router-dom` if multiple pages are introduced
- Linting/formatting: ESLint (eslint-config-next or standard React rules) + Prettier

## Development Workflow and Quality Gates

- Scripts: `dev`, `build`, `preview`, `test`, `lint`, `format`
- PRs must build cleanly, pass lint/tests, and keep bundle size reasonable
- UI work should reference `ui-designer.mdc`; debugging follows `expert-debugger.mdc`
- Any new UI elements should prefer shadcn/ui; any charts should use Plotly
- Supabase client created in `src/lib/supabaseClient.ts` using `createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)`
- Auth flows use session listener; protected routes optionally guard on session
- All database tables must have RLS enabled with explicit policies
- Never commit secrets; only `VITE_*` client-safe keys in the repo; `.env*` gitignored

- Prefer MCP tools for external search/docs, extraction, diagnostics, and service ops when possible


**Version**: 1.0.0 | **Ratified**: 2025-09-15 | **Last Amended**: 2025-09-15