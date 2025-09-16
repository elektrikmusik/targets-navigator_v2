# Data Model: 001-specify-web-app

## Entities

### Company
- key (uuid/text)
- name (text)
- website (text)
- geography (text)
- ticker (text, nullable)
- tags (text[] or jsonb)
- strategicFit (numeric)
- abilityToExecute (numeric)
- overallScore (numeric)
- updated_at (timestamptz)

### Pillar Scores
- key (fk Company)
- pillar (enum: finance, industry, ip, manufacturing, ownership, hydrogen)
- score (numeric, nullable)
- rationale_snippet (text)
- top_features (jsonb)
- evaluation_date (date)
- source_url (text)
- last_verified_at (timestamptz)

### Benchmark
- sector (text)
- geography (text)
- metric (text)
- median (numeric)
- updated_at (timestamptz)

### CompareSet (transient, client-side)
- ids (string[<=5])

### ReportConfig (transient)
- companies (string[])
- tabs (string[])
- generated_at (timestamptz)

## Views and Joins
- company_overview: optimized fields for list (includes overallScore and key badges)
- Joins: company + pillar aggregates by key; SEC overlay by ticker when needed

## Validation Rules
- overallScore 0..1; pillar score 0..1
- "insufficient data" when score null OR <50% inputs present OR evaluation_date older than 24 months


