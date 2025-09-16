# Supabase Contracts: 001-specify-web-app

## Tables/Views Accessed (read-only)
- companies_profile (select)
- company_financial (select)
- companies_industry (select)
- companies_ip / companies_ip_revision (select)
- companies_manufacturing (select)
- companies_ownership (select)
- companies_hydrogen (select)
- company_overview (select)
- sec_* (select, when ticker present)

## Queries (illustrative)
```sql
-- List view
select key, name, geography, overallScore, strategicFit, abilityToExecute
from company_overview
where (industry = any(:industries) or :industries is null)
  and (country = any(:countries) or :countries is null)
  and (revenue_band = any(:revenueBands) or :revenueBands is null)
order by overallScore desc, abilityToExecute desc, strategicFit desc, name asc
limit :limit offset :offset;

-- Dossier pillars
select 'finance' as pillar, finance_score as score, finance_rationale as rationale_snippet, finance_features as top_features, evaluation_date, source_url, last_verified_at
from company_financial where key = :key
union all
select 'industry', industry_score, industry_rationale, industry_features, evaluation_date, source_url, last_verified_at
from companies_industry where key = :key
-- (continue for ip, manufacturing, ownership, hydrogen)
```

## RLS/Policies
- Ensure select policies for BD and exec roles across all pillar tables and views.
- No insert/update/delete from client.

## Client Env
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY


