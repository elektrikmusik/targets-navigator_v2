# Implementation Plan: Global Application Shell (Sidebar, Header, Theming, Status Panels)

**Branch**: $branch | **Date**: 2025-09-16 | **Spec**: C:\Coding\specify\spectest\specs\003-specify-create-this\spec.md
**Input**: Feature specification from /specs/003-specify-create-this/spec.md

## Execution Flow (/plan command scope)
`
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
6. Re-evaluate Constitution Check
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
7. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
8. STOP - Ready for /tasks command
`

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands.

## Summary
Create a consistent, theme-aware application shell present on all pages: collapsible sidebar, header with global search, and content/status panels. Use Lucide icons for navigation and actions. Ensure responsiveness, accessibility, and preference persistence.

## Technical Context
**Language/Version**: TypeScript (React 18) via Vite (Node >=18)
**Primary Dependencies**: React, Tailwind CSS, shadcn/ui, lucide-react, react-router-dom (for navigation)
**Storage**: N/A (UI shell). Preferences persisted in localStorage.
**Testing**: Vitest + @testing-library/react
**Target Platform**: Web (desktop/mobile)
**Project Type**: web (single project structure)
**Performance Goals**: Lighthouse ≥ 90; CLS < 0.1; responsive at 60fps interactions
**Constraints**: WCAG 2.1 AA; initial bundle < 200KB gzipped (excluding charts)
**Scale/Scope**: Entire UI shell; search over Companies/Dossiers

## Constitution Check
*Simplicity/Architecture/Testing/Observability/Versioning*
- Projects: 1 (app + tests) → within limit
- UI library: shadcn/ui + Tailwind (no additional UI frameworks)
- Icons: lucide-react
- Testing: add integration for shell behaviors before implementation
- Decision: Replicate Aceternity patterns using shadcn/ui primitives to comply with constitution

## Project Structure
- Documentation under specs/003-specify-create-this/ per template (this plan, research, data-model, quickstart, contracts/)
- Source under src/ with components in src/components/ui/* and layout wrappers in src/pages/*

**Structure Decision**: Option 1 (Single project)

## Phase 0: Outline & Research
Key unknowns were resolved (see research.md):
- Global search scope and destination
- Preference persistence duration and mechanism
- Navigation depth/overflow handling
- Accessibility guarantees and status semantics

**Output**: research.md (created)

## Phase 1: Design & Contracts
Artifacts created:
- data-model.md (entities: NavigationItem, SidebarState, ThemePreference, HeaderSearch, StatusBadge, ContentPanel)
- contracts/ui-shell-contract.md (component contracts)
- contracts/search-contract.md (search contract)
- quickstart.md (setup and validation steps)

Re-check constitution: PASS (no new violations)

## Phase 2: Task Planning Approach
- Tasks generated later will follow TDD: contract/integration tests before implementation
- Ordering: entities → providers → layout components → pages → polish
- Parallelizable: icon mapping, status badge tokens, accessibility pass

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
*Based on Constitution v1.0.0*
