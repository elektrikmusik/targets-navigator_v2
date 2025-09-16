# Feature Specification: Professional Targets Navigator Web App

**Feature Branch**: `001-specify-web-app`  
**Created**: 2025-09-15  
**Status**: Draft  
**Input**: User description: "/specify Web‑app content and structure (guided by docs/targets-navigator.md, visuals per ui-designer.mdc)
- **Global layout**: Header with search/global actions; left facets panel; main list/content; sticky compare/export bar; responsive 2–3 column grid.
- **Targets list & filters**: Multi-facet filtering (sector, geo, revenue, ownership, H2, IP), sort by any score, fast pagination/virtualization.
- **Company cards**: Logo/name/geo/tags, overallScore sparkline, color‑coded pillar badges with tooltips, “View Dossier”, “Add to Compare”, evidence link.
- **Company dossier (tabs)**: Overview, Finance, Industry, IP, Manufacturing, Ownership, Hydrogen, SEC Signals; each shows score, rationale snippet, top contributing features, evidence links; peer benchmarks where ticker exists.
- **Compare mode**: Up to 5 companies; table of pillar scores, rationales hints, sector/geo medians; highlight strengths/weaknesses; quick export.
- **Report builder**: Assemble selected companies/tabs into branded PDF/Slides; include rationales, benchmarks, and evidence citations.
- **Weights & versions (admin)**: View and adjust scoring_weights, show versioning and impact preview; audit trail.
- **Signals timeline (public peers)**: SEC forms and derived metrics timeline; overlays vs peers; alerts on changes.
- **Provenance & freshness**: Source URLs, last verified timestamps, “insufficient data” states; data dictionary modal.
- **Performance & UX polish**: <1.5s list load (use company_overview), skeleton loaders, keyboard‑first filters, accessible contrasts, light/dark theme, subtle micro‑interactions.
- **Access & security**: Role‑based read policies aligned with RLS across pillar tables.
This structure delivers quick discovery, explainable scoring, deep drill‑downs, and standout polish with shareable outputs."

References considered during drafting: `docs/targets-navigator.md` (content and data foundations), visual direction per `ui-designer.mdc`, and theme baseline via [Tweakcn shadcn/ui theme](https://tweakcn.com/themes/cmf8vzzdr000404l2d013ag53).

## Execution Flow (main)
```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors, actions, data, constraints
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

### Section Requirements
- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

### For AI Generation
When creating this spec from a user prompt:
1. **Mark all ambiguities**: Use [NEEDS CLARIFICATION: specific question] for any assumption you'd need to make
2. **Don't guess**: If the prompt doesn't specify something (e.g., "login system" without auth method), mark it
3. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item
4. **Common underspecified areas**:
   - User types and permissions
   - Data retention/deletion policies  
   - Performance targets and scale
   - Error handling behaviors
   - Integration requirements
   - Security/compliance needs

---

## User Scenarios & Testing (mandatory)

### Primary User Story
As a BD manager or analyst, I need to quickly discover, score, and prioritize companies for partnerships, licensing, investments, and market expansion, with transparent rationales and evidence, so that I can confidently create shortlists, drill into dossiers, compare peers, and share/export polished reports with stakeholders.

### Acceptance Scenarios
1. Given a new session, when I filter by sector, geography, revenue band, ownership type, hydrogen readiness, and IP activity, then I see a paginated/virtualized list updating under 1.5 seconds with accurate counts and the ability to sort by overall or any pillar score.
2. Given a company in the list, when I open its dossier, then each tab (Overview, Finance, Industry, IP, Manufacturing, Ownership, Hydrogen) displays the current score, a rationale snippet, top contributing features, and working evidence links.
3. Given multiple companies, when I add up to five to compare, then I see a comparison table with pillar scores, rationale hints, and sector/geo medians, highlighting strengths and weaknesses, and I can export the comparison.
4. Given selected companies and tabs, when I build a report, then a branded PDF export is generated including rationales, benchmarks, and evidence citations.
5. Given scores are sourced directly from the database, when viewing lists, cards, and dossiers, then scores are read-only, always current, and require no sync-status UI; no in-app score or weight editing is possible.
6. Given benchmarks are available for a sector/geo, when viewing dossier and compare, then medians are shown; when not available, a clear "benchmark not available" state is displayed.
7. Given sparse or missing data, when a pillar has insufficient inputs, then the UI clearly labels "insufficient data" and shows last verified timestamps and source links where available.

### Edge Cases
- Empty or overly broad filters return many results: list remains responsive with virtualization and clear messaging on applied filters.
- No results match filters: show an empty state with guidance to adjust facets.
- Benchmarks unavailable for a sector/geo: show a clear "benchmark not available" state with guidance.
- Missing media (e.g., logo): fall back to initials placeholder without layout shift.
- Compare selection beyond five: prevent the sixth selection with a helper message.
- Role without permission attempts access to restricted content: display access-denied messaging consistent with policy.
- Slow network or data freshness lag: show skeleton loaders and last verified timestamps; avoid blocking the workflow.
- Evidence link unavailable: show graceful fallback and allow alternate sources where defined.

## Requirements (mandatory)

### Functional Requirements
- **FR-001 Global layout**: Provide a responsive layout with header (search and global actions), left facets panel, main list/content area, and a sticky compare/export bar; adapt to 2–3 column grids based on viewport.
- **FR-002 Filtering & sorting**: Support multi-facet filtering by sector/industry, geography, revenue bands, ownership type, hydrogen readiness, and IP activity. Allow sorting by overall score or any pillar score.
- **FR-003 List performance**: The targets list loads in under 1.5 seconds for the current dataset using an optimized overview and virtualization/pagination for responsiveness.
- **FR-004 Company cards**: Each card shows logo, name, website, geography, tags, a sparkline for overall score trend, color-coded pillar badges with tooltips, and actions: "View Dossier", "Add to Compare", and an evidence link.
- **FR-005 Read-only scores**: Scores are sourced directly from the authoritative database and are read-only in the UI. They are always current at view time; no sync-status or last-sync display is required. No in-app scoring or weight editing is available.
- **FR-006 Dossier tabs**: Provide tabs for Overview, Finance, Industry, IP, Manufacturing, Ownership, and Hydrogen. Each tab displays the latest score, rationale snippet, top contributing features, and evidence links.
- **FR-007 Benchmarks**: Display sector/geo medians where available within dossier and compare views; peer benchmarks are out of scope for now.
- **FR-008 Compare mode**: Allow selecting up to five companies to compare side-by-side with pillar scores, rationale hints, and medians; highlight strengths/weaknesses; enable quick export.
- **FR-009 Report builder**: Enable assembly of selected companies and tabs into a branded PDF export including rationales, benchmarks, and evidence citations.
- **FR-010 Provenance & freshness**: Display source URLs, last verified timestamps, and clearly indicate "insufficient data" states; provide a data dictionary modal describing surfaced fields.
- **FR-011 Performance & UX polish**: Include skeleton loaders, keyboard-first filter navigation, accessible color/contrast, light/dark theme, and subtle micro-interactions to reinforce actions.
- **FR-012 Access & security**: Enforce role-based read policies aligned with defined data access rules across pillar content.

### Non-Functional and Success Criteria
- **NF-001 Performance**: Targets list initial render under 1.5 seconds for ~500 records; interactions remain under 100 ms median.
- **NF-002 Accessibility**: Meets WCAG AA contrast and keyboard navigability for filter and list interactions.
- **NF-003 Reliability**: Evidence links and timestamps displayed for ≥95% of records where available; clear fallback for missing.
- **NF-004 Usability**: Compare selection discoverable within two clicks; exports produced without configuration errors.

### Assumptions & Defaults
- **Branding and exports**: Use the Tweakcn theme colors and typography as baseline. Exports are PDF-only (A4, portrait, 16 mm margins), with app name "Targets Navigator" as header text (no custom logo provided). Footer shows generation date and page x of y. Single-company dossier and compare views are exportable.
- **Default sort and tie-breakers**: Default sort is `overallScore` descending. Tie-breakers: `abilityToExecute` desc, `strategicFit` desc, then `name` ascending for stability.
- **"Insufficient data" thresholds**: A pillar shows "insufficient data" if (a) its pillar score is null, or (b) fewer than 50% of required inputs for that pillar are present, or (c) the pillar `evaluation_date` is older than 24 months.

### Key Entities (include if feature involves data)
- **Company**: A target organization with identity, geography, website, tags, composite and pillar scores, and evidence provenance.
- **Pillar Score**: A category score (Finance, Industry, IP, Manufacturing, Ownership, Hydrogen) with rationale snippet and contributing features.
- **Compare Set**: A transient selection of up to five companies for side-by-side analysis and export.
- **Report**: A branded export artifact composed of selected companies and tabs, including rationales, benchmarks, and citations.
- **Score Metadata**: Read-only metadata describing the scoring versioning and updated_at timestamps stored in the database.
- **Evidence**: One or more source citations supporting scores and rationales, each with a URL and last verified timestamp.
- **Benchmark**: Sector and geography reference statistics used for medians and percentile positioning.
- **User Role**: An access profile determining visibility of content and administrative controls.

---

## Review & Acceptance Checklist
"GATE" checks to complete before planning and build.

### Content Quality
- [ ] No implementation details (languages, frameworks, APIs)
- [ ] Focused on user value and business needs
- [ ] Written for non-technical stakeholders
- [ ] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous  
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status
Status to be updated during processing and review.

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---


 