## Targets Navigator — Concept and Data Foundation

### Audience
- **Primary**: Business Development (BD) managers and analysts
- **Secondary**: Executives (C-suite, BU leads) for portfolio and board-level reporting

### Objective
- **Quickly discover, score, and prioritize target companies** for partnerships, licensing, investments, M&A, and market expansion.
- Provide **explainable scores** with drill-down to qualitative rationales and linked evidence.

### Data Foundation (from Supabase project `AI Lead Assistant`)
- **Core master**: `companies_profile` (478 rows) keyed by `key`, with identity, website, geography, ticker, markets, strategy fields, and top-level composite scores: `strategicFit`, `abilityToExecute`, `overallScore`.
- **Functional pillars** joined by `key`:
  - `company_financial` (478): revenue, growth, profitability, investment capacity, narrative, and `finance_score`.
  - `companies_industry` (478): core business, technology, market, `industry_score`, rationales, `industry_output` JSON.
  - `companies_ip` (481) and `companies_ip_revision` (478): IP activity and quality (e.g., citations, recency), narratives, and `IPActivityScore`/`IPOverallRating`.
  - `companies_manufacturing` (478): materials, scale, quality, supply chain, R&D, `manufacturing_score`.
  - `companies_ownership` (478): alignment, decision making, partnerships, `OwnershipScore`.
  - `companies_hydrogen` (478): H2-specific readiness and strategy, `H2Score`.
- **Public-company signals**:
  - `sec_companies`, `sec_filing_metadata` (5k+), `sec_financial_metrics` (2k+), `sec_derived_metrics` (147): time-series financials and forms for public peers.
- **Calibration and weights**:
  - `scoring_weights` (32): configurable weights per criterion.
  - `companies_calibration` (60): labeled cases for category and licensing rationale.

### Core Use Cases
- **Pipeline generation**: Filter and rank targets by strategic fit, execution ability, sector, geography, and revenue bands.
- **Account deep-dive**: One-page dossier combining profile, IP, manufacturing, ownership, industry, and SEC metrics.
- **Comparative shortlists**: Side-by-side comparison versus peer set and sector medians.
- **Executive reporting**: Roll-ups by region/sector, with score distribution, top movers, and rationale highlights.

### Target Scoring Model (explainable)
- Base features per company from pillar tables, joined on `companies_profile.key`.
- Weighted composite: `overallScore = w_strategicFit*strategicFit + w_execute*abilityToExecute + w_finance*finance_score + w_industry*industry_score + w_ip*IPActivityScore + w_mfg*manufacturing_score + w_owner*OwnershipScore + w_h2*H2Score`
- Weights sourced from `scoring_weights` and governed in the database; UI is read-only for scoring. Scores are computed/stored in the database and always current (no manual sync in the app).
- Explanations: pull top contributing features and their textual justifications from each pillar table.

### Key Views and APIs
- **Company overview view** (already present): `company_overview` materialized view style fields for fast list rendering.
- **Peer benchmarks**: join `companies_profile` with `sec_*` by `ticker` when present to overlay market comps.
- **Signals timeline**: SEC forms and derived metrics plotted for public targets.

### UX Outline (refer to `ui-designer.mdc` for visual design; theme baseline via [Tweakcn shadcn/ui theme](https://tweakcn.com/themes/cmf8vzzdr000404l2d013ag53))
- **List & Filters**
  - Facets: sector/industry, geography, revenue bands, ownership type, H2 readiness, IP activity.
  - Sort by `overallScore`, or any pillar score. Saved views are not used.
- **Company Card**
  - Name, logo, website, geography, tags; sparkline for `overallScore` trend; badges for pillar strengths.
- **Detail Dossier**
  - Tabs: Overview, Finance, Industry, IP, Manufacturing, Ownership, Hydrogen, SEC Signals.
  - Each tab: score, rationale snippet, and evidence links.
- **Compare Mode**
  - Select up to 5 companies; table of pillar scores, rationales, and key metrics.
- **Report Builder**
  - Assemble snapshots into an export (PDF/Slides) with explanations and peer context.

### Example Queries
- Top targets by composite score with thresholds:
  - Filter: `overallScore >= 0.7`, `industry in ('Energy','Materials')`, `country IN (...)`.
- IP-led targets:
  - `IPActivityScore >= 0.7` AND `IPCeresCitationsScore >= 0.6` AND recent `evaluationDate`.
- Manufacturing partners:
  - `manufacturing_score >= 0.7` AND `ManufacturingScaleScore >= 0.7` AND supply-chain justification present.

### Data Gaps and Enhancements
- **Private revenue coverage**: Normalize private-company revenue; enrich firmographics where `annual_revenue` is null.
- **Temporal consistency**: Align `EvaluationDate`/`evaluation_date`/`created_at` across pillars for trends.
- **Peer overlays**: Expand `sec_derived_metrics` and surface in `company_overview` for instant comps.
- **Workflow capture**: Backfill `companies_blueprint` to log research, charts, and partnership/investment leads.
- **Provenance fields**: Add `source_url` and `last_verified_at` to pillar tables for auditability.
- **Benchmarks**: Create sector/geography benchmarks materialized view for percentile ranks.

### Governance & Explainability
- All scores map to source columns and `*_Justification`/narrative fields; store provenance.
- Version weights in `scoring_weights` and stamp profiles with `version` to ensure reproducibility. The database is the source of truth; the UI does not modify scores or weights.

### Rollout Plan
- Phase 1: Read-only navigator with filters, list, card, and dossier using existing views.
- Phase 2: Compare mode and report builder; add peer overlays via `sec_*`.
- Phase 3: Calibration loops using `companies_calibration`; admin UI for weights.

### Acceptance Criteria (Phase 1)
- List view loads <1.5s for 478 records with multi-facet filtering.
- Dossier shows scores and at least one rationale per pillar when available.
- Export single-company dossier to PDF.

### Risks
- Data sparsity in certain pillars; mitigate with null-safe scoring and clear "insufficient data" labels.
- RLS across pillar tables; ensure appropriate read policies for BD and exec roles.


