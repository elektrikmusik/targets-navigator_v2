# Tasks: 001-specify-web-app

**Input**: Design documents from `/specs/001-specify-web-app/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 3.1: Setup
- [x] T001 [P] Configure Vite + React + TypeScript project structure in existing setup
- [x] T002 [P] Install and configure shadcn/ui components with Tailwind CSS
- [x] T003 [P] Setup Supabase client configuration in src/lib/supabaseClient.ts
- [x] T004 [P] Configure react-plotly.js and plotly.js-dist-min for charts
- [x] T005 [P] Setup environment variables for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- [x] T006 [P] Configure Vitest + @testing-library/react for testing
- [x] T007 [P] Setup ESLint and Prettier configuration

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [x] T008 [P] Contract test Supabase company_overview view access in tests/contract/test_company_overview.spec.ts
- [x] T009 [P] Contract test Supabase pillar tables access in tests/contract/test_pillar_tables.spec.ts
- [x] T010 [P] Integration test company list loading in tests/integration/test_company_list.spec.ts
- [x] T011 [P] Integration test company filtering in tests/integration/test_company_filtering.spec.ts
- [x] T012 [P] Integration test chart-table synchronization in tests/integration/test_chart_table_sync.spec.ts
- [x] T013 [P] Integration test company dossier loading in tests/integration/test_company_dossier.spec.ts
- [x] T014 [P] Integration test PDF export functionality in tests/integration/test_pdf_export.spec.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [x] T015 [P] Company model types in src/types/company.ts
- [x] T016 [P] CompanyFilters interface in src/types/filters.ts
- [x] T017 [P] CompanyOverviewService in src/services/companyOverviewService.ts
- [x] T018 [P] DossierService in src/services/dossierService.ts
- [x] T019 [P] BubbleChart component in src/components/charts/BubbleChart.tsx
- [x] T020 [P] TargetsList component in src/components/TargetsList.tsx
- [x] T021 [P] FiltersPanel component in src/components/FiltersPanel.tsx
- [x] T022 [P] CompanyDossier component in src/components/CompanyDossier.tsx
- [x] T023 [P] CompareMode component in src/components/CompareMode.tsx
- [x] T024 [P] PDFExportService in src/services/pdfExportService.ts
- [x] T025 [P] CombinedView page in src/pages/CombinedView.tsx
- [x] T026 [P] DossierView page in src/pages/DossierView.tsx
- [x] T027 [P] CompareView page in src/pages/CompareView.tsx

## Phase 3.4: Integration
- [x] T028 Connect CompanyOverviewService to Supabase company_overview view
- [x] T029 Connect DossierService to Supabase pillar tables
- [x] T030 Implement RLS policies validation for all data access
- [x] T031 Setup error boundaries for chart and table components
- [x] T032 Implement responsive design for mobile and desktop
- [x] T033 Setup routing between CombinedView, DossierView, and CompareView
- [x] T034 Implement PDF generation with company data and branding

## Phase 3.5: Polish
- [x] T035 [P] Unit tests for CompanyOverviewService in tests/unit/test_companyOverviewService.spec.ts
- [x] T036 [P] Unit tests for DossierService in tests/unit/test_dossierService.spec.ts
- [x] T037 [P] Unit tests for PDFExportService in tests/unit/test_pdfExportService.spec.ts
- [x] T038 [P] Unit tests for chart components in tests/unit/test_chart_components.spec.ts
- [x] T039 [P] Unit tests for table components in tests/unit/test_table_components.spec.ts
- [x] T040 Performance optimization for large datasets (virtualization)
- [x] T041 Accessibility compliance (WCAG AA) for all components
- [x] T042 [P] Update documentation in docs/targets-navigator.md
- [x] T043 Remove console.log statements and add proper logging
- [x] T044 Run manual testing checklist

## Dependencies
- Tests (T008-T014) before implementation (T015-T027)
- T015-T016 blocks T017-T018
- T017-T018 blocks T028-T029
- T019-T021 blocks T025
- T022-T024 blocks T026-T027
- Implementation before integration (T028-T034)
- Integration before polish (T035-T044)

## Parallel Example
```
# Launch T008-T014 together (Contract and Integration Tests):
Task: "Contract test Supabase company_overview view access in tests/contract/test_company_overview.spec.ts"
Task: "Contract test Supabase pillar tables access in tests/contract/test_pillar_tables.spec.ts"
Task: "Integration test company list loading in tests/integration/test_company_list.spec.ts"
Task: "Integration test company filtering in tests/integration/test_company_filtering.spec.ts"
Task: "Integration test chart-table synchronization in tests/integration/test_chart_table_sync.spec.ts"
Task: "Integration test company dossier loading in tests/integration/test_company_dossier.spec.ts"
Task: "Integration test PDF export functionality in tests/integration/test_pdf_export.spec.ts"

# Launch T015-T027 together (Core Implementation - different files):
Task: "Company model types in src/types/company.ts"
Task: "CompanyFilters interface in src/types/filters.ts"
Task: "CompanyOverviewService in src/services/companyOverviewService.ts"
Task: "DossierService in src/services/dossierService.ts"
Task: "BubbleChart component in src/components/charts/BubbleChart.tsx"
Task: "TargetsList component in src/components/TargetsList.tsx"
Task: "FiltersPanel component in src/components/FiltersPanel.tsx"
Task: "CompanyDossier component in src/components/CompanyDossier.tsx"
Task: "CompareMode component in src/components/CompareMode.tsx"
Task: "PDFExportService in src/services/pdfExportService.ts"
Task: "CombinedView page in src/pages/CombinedView.tsx"
Task: "DossierView page in src/pages/DossierView.tsx"
Task: "CompareView page in src/pages/CompareView.tsx"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts
- Focus on responsive design and accessibility
- Ensure RLS policies are properly implemented

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Supabase contracts → contract test tasks [P]
   - Database views → service integration tasks
   
2. **From Data Model**:
   - Company entity → model creation task [P]
   - Pillar Scores entity → model creation task [P]
   - Benchmark entity → model creation task [P]
   - CompareSet/ReportConfig → transient model tasks [P]
   
3. **From User Stories**:
   - Combined view → integration test [P]
   - Dossier view → integration test [P]
   - Compare mode → integration test [P]
   - PDF export → integration test [P]

4. **Ordering**:
   - Setup → Tests → Models → Services → Components → Pages → Integration → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All contracts have corresponding tests
- [x] All entities have model tasks
- [x] All tests come before implementation
- [x] Parallel tasks truly independent
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task