# Order, report, and check-in performance

## Deploy

1. Install dependencies with `npm ci` in both `backend` and `frontend`.
2. In `backend`, with the production MongoDB configuration available, run
   `NODE_ENV=production npm run db:indexes`. This adds indexes without dropping existing ones.
3. Restart the backend (`npm run prod`). The email worker starts after MongoDB connects.
4. Build and deploy the frontend (`npm run build`).

No Redis or additional service is required. The backend must remain running for queued
emails to be processed. Publishing menu emails is unchanged.

## Confirmation emails

Customer orders (login and invitation) atomically store the confirmation email snapshot
inside the order. The API responds after that write, without waiting for Resend.
The private payload is excluded from normal queries and JSON responses. Existing orders
without a queued email are not sent again.

A worker claims one due email atomically, with a two-minute lease, and submits it with a
30-second timeout and a stable Resend idempotency key. Expired leases allow recovery after
a restart; job ID and lease checks protect newer jobs from an older worker's acknowledgement.
Each process sends at most one job per tick, with a two-second pause between ticks.
Failures back off exponentially, up to one hour. After ten failed attempts the job remains
on the order with `confirmationEmail.failedAt`, with no scheduled retry. The worker logs
that terminal failure. Fix the provider/configuration before an operator resets attempts
and nextAttemptAt for selected failed jobs; do not replay all historical orders.
Provider idempotency retention is finite, so recovery/replay is not an exactly-once guarantee.

Deleting an order also deletes its pending email. Rolling back to an older backend leaves
queued emails unprocessed until a worker from this version is running again.

## Validation

- `cd backend && npm test`
- `cd frontend && npm test && npm run build`

Tests use controlled models and provider responses; no real emails or production database
writes are performed. After deployment, compare request latency and MongoDB
`explain("executionStats")` on production-like data. Verify the new indexes actually exist,
and monitor email failures and queue delay.

Report queries filter menus by Vietnam calendar day and invoice orders by date range.
Read-only report queries use projections and lean documents. Floor restrictions and report
calculation logic are retained. Manual check-in updates the row from the API's confirmed
timestamp without re-fetching the entire list; stale date responses are ignored.
