# Tasks: Global Application Shell (Sidebar, Header, Theming, Status Panels)

**Input**: Design documents from `/specs/003-specify-create-this/`
**Prerequisites**: `plan.md` (required), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
   → quickstart.md: Extract validation scenarios → integration tests
3. Generate tasks by category:
   → Setup → Tests → Core → Integration → Polish
4. Apply rules:
   → Different files = mark [P]; Same file = sequential
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Create dependency notes and parallel examples
7. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- Single project: `src/`, `tests/` at repository root

## Phase 3.1: Setup
- [x] T001 Ensure Tailwind + shadcn/ui configured per constitution (verify) in `tailwind.config.ts` and `src/components/ui/*`
- [x] T002 Install icons dependency: run `npm i lucide-react` (document in `README.md`)
- [x] T003 [P] Create utility `src/lib/prefs.ts` for theme/sidebar persistence with 30-day TTL

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
Contract tests (from contracts/*.md):
- [x] T004 [P] Contract test: UI shell components in `tests/contract/ui-shell.spec.tsx`
- [x] T005 [P] Contract test: Global search behavior in `tests/contract/search.spec.tsx`

Integration tests (from user stories & quickstart):
- [x] T006 [P] Integration: Sidebar expand/collapse desktop in `tests/integration/shell_sidebar_desktop.spec.tsx`
- [x] T007 [P] Integration: Sidebar overlay mobile in `tests/integration/shell_sidebar_mobile.spec.tsx`
- [x] T008 [P] Integration: Header search routes to global results in `tests/integration/shell_search_navigation.spec.tsx`
- [x] T009 [P] Integration: Theme toggle persists across refresh (30 days) in `tests/integration/shell_theme_persistence.spec.tsx`
- [x] T010 [P] Integration: Status badges render with correct colors in `tests/integration/shell_status_badges.spec.tsx`
- [x] T011 [P] Integration: Collapsed nav tooltips/labels + keyboard nav in `tests/integration/shell_accessibility_nav.spec.tsx`
- [x] T012 [P] Integration: A11y focus order and landmarks in `tests/integration/shell_accessibility_focus.spec.tsx`

## Phase 3.3: Core Implementation (ONLY after tests are failing)
Types/models (from data-model.md):
- [x] T013 [P] Define UI shell types in `src/types/ui-shell.ts` (NavigationItem, SidebarState, ThemePreference, HeaderSearch, StatusBadge, ContentPanel)

Context and state:
- [x] T014 Create `SidebarProvider` with context in `src/components/ui/sidebar/SidebarProvider.tsx` (open, setOpen)
- [x] T015 Wire persistence in `SidebarProvider` using `src/lib/prefs.ts`

Layout components:
- [x] T016 Build `Sidebar.tsx` (collapsible desktop, overlay mobile) in `src/components/ui/sidebar/Sidebar.tsx`
- [x] T017 Build `SidebarLink.tsx` with Lucide icons + tooltip labels in `src/components/ui/sidebar/SidebarLink.tsx`
- [x] T018 Build `Header.tsx` with search input and utilities in `src/components/ui/header/Header.tsx`
- [x] T019 Build `StatusBadge.tsx` with success/pending/failed tokens in `src/components/ui/StatusBadge.tsx`
- [x] T020 Build `AppShell.tsx` combining sidebar, header, main slot in `src/components/ui/AppShell.tsx`

Search view and routing:
- [x] T021 Create `SearchView.tsx` in `src/pages/SearchView.tsx` (reads query/scope; placeholder list)
- [x] T022 Add navigation handling from `Header.tsx` to `/search?query=...&scope=all` (use existing router or minimal handler)

Theming:
- [x] T023 Implement theme toggle + localStorage TTL logic in `src/components/ui/header/ThemeToggle.tsx`
- [x] T024 Apply theme-aware classes at app root in `src/components/ui/AppShell.tsx`

## Phase 3.4: Integration
- [ ] T025 Ensure keyboard navigation and focus management across shell in `src/components/ui/*` (aria-labels, role=menubar/nav, focus traps on mobile)
- [ ] T026 Configure status color tokens (light/dark) in `tailwind.config.ts` (ensure contrast)
- [ ] T027 Wire example status cards/grid in an existing page using `StatusBadge` (e.g., `src/pages/CombinedView.tsx` demo section)

## Phase 3.5: Polish
- [ ] T028 [P] Unit tests for `prefs` TTL and theme persistence in `tests/unit/test_prefs.spec.ts`
- [ ] T029 [P] Unit tests for `StatusBadge` rendering in `tests/unit/test_status_badge.spec.tsx`
- [ ] T030 Performance pass: reduce layout shifts (verify CLS < 0.1), memoize heavy components
- [ ] T031 [P] Update `specs/003-specify-create-this/quickstart.md` with any setup nuances
- [ ] T032 Accessibility audit (axe) and fixes

## Dependencies
- Setup (T001–T003) before Tests/Implementation
- Contract + Integration tests (T004–T012) must fail before Core (T013–T024)
- Types (T013) before components (T016–T020)
- `SidebarProvider` (T014–T015) before `Sidebar` and `AppShell` (T016, T020)
- Search view (T021) before header navigation wiring (T022)
- Theme toggle (T023) before root theme classes (T024)
- Integration (T025–T027) after Core
- Polish (T028–T032) last

## Parallel Example
```
# Launch contract + integration tests together (after setup):
Task: "Contract test: UI shell components in tests/contract/ui-shell.spec.tsx"
Task: "Contract test: Global search behavior in tests/contract/search.spec.tsx"
Task: "Integration: Sidebar expand/collapse desktop in tests/integration/shell_sidebar_desktop.spec.tsx"
Task: "Integration: Sidebar overlay mobile in tests/integration/shell_sidebar_mobile.spec.tsx"
Task: "Integration: Header search routes to global results in tests/integration/shell_search_navigation.spec.tsx"
Task: "Integration: Theme toggle persists across refresh (30 days) in tests/integration/shell_theme_persistence.spec.tsx"
```

## Validation Checklist
- [ ] All contracts have corresponding tests (T004–T005)
- [ ] All entities have model tasks (T013)
- [ ] All tests come before implementation (T004–T012 before T013+)
- [ ] Parallel tasks truly independent ([P] only on different files)
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task
