-- Workshop seed markets for fake-money Yes/No trading demos.

insert into public.markets (id, title, description, status, close_date)
values
  (
    'a0000000-0000-4000-8000-000000000001',
    'Will the demo app ship on time?',
    'A fictional open market for workshop buy-flow practice with fake money only.',
    'open',
    '2027-12-31 23:59:59+00'
  ),
  (
    'a0000000-0000-4000-8000-000000000002',
    'Will it rain at the workshop venue?',
    'Another open market with a sooner close date for testing.',
    'open',
    '2027-06-30 12:00:00+00'
  ),
  (
    'a0000000-0000-4000-8000-000000000003',
    'Did the old feature launch last quarter?',
    'Closed market — buying should be unavailable.',
    'closed',
    '2026-01-01 00:00:00+00'
  ),
  (
    'a0000000-0000-4000-8000-000000000004',
    'Was the beta signup goal met?',
    'Open status but past close date — not buyable.',
    'open',
    '2020-01-01 00:00:00+00'
  ),
  (
    'a0000000-0000-4000-8000-000000000005',
    'Did the mascot win the poll?',
    'Resolved market — buying should be unavailable.',
    'resolved',
    '2025-06-01 00:00:00+00'
  )
on conflict (id) do nothing;
