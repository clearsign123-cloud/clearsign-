'use client';
const PRO_KEY = 'clearsign_pro';
const USAGE_KEY = 'clearsign_usage';
export const FREE_MONTHLY_LIMIT = 2;
export function isPro() { if (typeof window === 'undefined') return false; return window.localStorage.getItem(PRO_KEY) === 'true'; }
export function activatePro() { if (typeof window === 'undefined') return; window.localStorage.setItem(PRO_KEY, 'true'); }
function monthKey() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth()}`; }
function readUsage() {
  if (typeof window === 'undefined') return {};
  try { const raw = JSON.parse(window.localStorage.getItem(USAGE_KEY) || '{}'); if (raw.month !== monthKey()) return { month: monthKey(), counts: {} }; return raw; } catch { return { month: monthKey(), counts: {} }; }
}
export function remainingUses(toolId) { if (isPro()) return Infinity; const usage = readUsage(); const used = (usage.counts && usage.counts[toolId]) || 0; return Math.max(0, FREE_MONTHLY_LIMIT - used); }
export function recordUse(toolId) { if (typeof window === 'undefined' || isPro()) return; const usage = readUsage(); usage.month = monthKey(); usage.counts = usage.counts || {}; usage.counts[toolId] = (usage.counts[toolId] || 0) + 1; window.localStorage.setItem(USAGE_KEY, JSON.stringify(usage)); }
export const WHOP_URL = 'https://whop.com/checkout/plan_JwVD2VX0kHS0r';
