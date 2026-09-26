// lib/whop/verifyPayment.ts
//
// This is the piece that actually closes the "pay and get nothing" gap.
// Before running an audit, we confirm with Whop's own API that a real,
// paid payment exists for the Compliance Audit plan and hasn't already
// been redeemed.
//
// IMPORTANT: verify the exact endpoint/shape against Whop's current API
// reference (https://docs.whop.com) before relying on this in production —
// APIs change, and if you already have a working Whop verification
// function elsewhere in this repo, reuse that instead of this one.
//
// Requires WHOP_API_KEY to already be set and, new for this feature,
// COMPLIANCE_AUDIT_PLAN_ID.

const COMPLIANCE_AUDIT_PLAN_ID =
  process.env.COMPLIANCE_AUDIT_PLAN_ID || 'plan_HDjM1Y1fbSX5z';

export interface VerifiedPayment {
  paymentId: string;
  status: string;
  planId: string;
  paidAt: string | null;
}

export async function verifyComplianceAuditPayment(
  paymentId: string
): Promise<VerifiedPayment> {
  if (!process.env.WHOP_API_KEY) {
    throw new Error('WHOP_API_KEY is not set.');
  }
  if (!paymentId) {
    throw new Error('No payment/receipt ID supplied.');
  }

  const res = await fetch(`https://api.whop.com/api/v2/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${process.env.WHOP_API_KEY}`,
    },
  });

  if (!res.ok) {
    throw new Error(
      `Could not verify payment with Whop (status ${res.status}). Do not grant access on failure — fail closed.`
    );
  }

  const payment = await res.json();

  if (payment.plan_id !== COMPLIANCE_AUDIT_PLAN_ID) {
    throw new Error('This payment is not for the Compliance Audit plan.');
  }
  if (payment.status !== 'paid') {
    throw new Error(`Payment status is "${payment.status}", not "paid" — refusing to run audit.`);
  }

  return {
    paymentId: payment.id,
    status: payment.status,
    planId: payment.plan_id,
    paidAt: payment.paid_at ?? null,
  };
}
