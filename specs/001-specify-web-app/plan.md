# Implementation Plan: 001-specify-web-app

**Branch**: `001-specify-web-app` | **Date**: 2025-09-15 | **Spec**: `C:\Coding\specify\spectest\specs\001-specify-web-app\spec.md`
**Input**: Feature specification from `C:\Coding\specify\spectest\specs\001-specify-web-app\spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
4. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
5. Execute Phase 1 → contracts, data-model.md, quickstart.md
6. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
7. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
8. STOP - Ready for /tasks command
```

## Summary
Professional Targets Navigator web app to discover and prioritize target companies with explainable, read-only scores sourced live from the database. Core experience is a combined view with a bubble chart linked to a filterable table; selections and filters synchronize between the chart and table. UI also includes company dossier tabs, compare mode (up to 5), and branded PDF exports. No saved views.

## Technical Context
**Language/Version**: TypeScript (React 18), Vite 5
**Primary Dependencies**: React, Tailwind CSS, shadcn/ui, @supabase/supabase-js v2, react-plotly.js + plotly.js-dist-min, react-router-dom (optional), zod (validation), date-fns
**Storage**: Supabase Postgres (read-only scoring surfaces); RLS enforced
**Testing**: Vitest + @testing-library/react; Playwright optional for E2E
**Target Platform**: Web (desktop and mobile responsive)
**Project Type**: single (frontend-only app using Supabase client)
**Performance Goals**: Initial list render < 1.5s for ~500 rows; interactions < 100 ms median
**Constraints**: WCAG AA; do not expose secrets; use VITE_* envs; RLS on all tables
**Scale/Scope**: ~500 company records initially; future growth supported via virtualization

**ARGUMENTS (user-provided)**: Vite + React with shadcn; Supabase database; charts with Plotly; responsive for mobile.

## External References
- Proof of Concept repository: https://github.com/elektrikmusik/targets-navigator

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Simplicity**:
- Projects: 1 (frontend app)
- Using framework directly: Yes (React + Vite; no custom wrappers)
- Single data model: Yes; direct use of Supabase tables/views; no extra DTOs
- Avoiding patterns: Yes; no Repository/UoW

**Architecture**:
- Feature as library: N/A for single-frontend project; components and services are modular
- Libraries listed: shadcn/ui (UI primitives), supabase-js (DB/auth), react-plotly (charts)
- CLI per library: Not applicable
- Library docs: quickstart will reference toolchain scripts

**Testing (NON-NEGOTIABLE)**:
- TDD encouraged; key UI states have tests; contract tests target Supabase schemas
- Integration tests: data access and key flows; unit tests for formatters

**Observability**:
- Minimal: console structured logs in dev; error boundaries in UI

**Versioning**:
- App versioning via package.json; semantic versioning for releases

## Project Structure

### Documentation (this feature)
```
specs/001-specify-web-app/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Option 1: Single project (SELECTED)
src/
├── components/
├── pages/
├── services/
└── lib/

tests/
├── integration/
└── unit/
```

**Structure Decision**: Option 1 (single project). No backend project; Supabase used directly from client with RLS.

## Phase 0: Outline & Research
See `C:\Coding\specify\spectest\specs\001-specify-web-app\research.md` for decisions and rationale.

## Phase 1: Design & Contracts
See `C:\Coding\specify\spectest\specs\001-specify-web-app\data-model.md`, `C:\Coding\specify\spectest\specs\001-specify-web-app\contracts\supabase-contracts.md`, and `C:\Coding\specify\spectest\specs\001-specify-web-app\quickstart.md`.

## Phase 2: Task Planning Approach
The /tasks command will generate tasks from entities, contracts, and scenarios; order by tests-first, then implementation; parallelize independent UI components and Supabase query integration.

## Complexity Tracking
| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |

## Progress Tracking
**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---
*Based on Constitution v1.0.0 - See `C:\Coding\specify\spectest\.specify\memory\constitution.md`*


