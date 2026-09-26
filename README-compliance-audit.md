# Compliance Audit — real implementation

This adds a genuine, working Compliance Audit feature: real UK letting-compliance
checklist, real AI analysis of the uploaded agreement text, and a payment gate
that refuses to run unless Whop confirms the payment was actually made and paid.

## Files

- `lib/compliance/checklist.ts` — the actual compliance rules being checked.
- `lib/compliance/audit.ts` — sends the agreement text + checklist to Claude.
- `lib/whop/verifyPayment.ts` — confirms a real, paid Whop payment exists.
- `app/api/compliance-audit/route.ts` — verifies payment, extracts PDF/txt text, runs audit.
- `app/for-agents/audit/page.tsx` — customer-facing audit page.

## Before production

Install `pdf-parse` and configure `ANTHROPIC_API_KEY`, `WHOP_API_KEY`, and optionally
`COMPLIANCE_AUDIT_PLAN_ID`. One-audit-per-payment redemption still needs durable storage.
