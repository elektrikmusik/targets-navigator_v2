# Quickstart: 001-specify-web-app

## Prereqs
- Node 18+
- pnpm or npm
- Env: create `.env.local` with `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Install
```bash
pnpm install
pnpm dev
```

## UI
- shadcn/ui with Tailwind; apply theme tokens inspired by Tweakcn link.
- Responsive layouts: filters + list; dossier tabs; compare bar sticky.

## Data
- Supabase client in `src/lib/supabaseClient.ts` using envs.
- Read from `company_overview` for list; join pillar tables for dossier.

## Charts
- Use `react-plotly.js` components; ensure responsive by setting `useResizeHandler` and `style={{width:'100%', height:'100%'}}`.

## Export
- PDF only; generate from dedicated print routes or client-side renderer.


