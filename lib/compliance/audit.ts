// lib/compliance/audit.ts
//
// This is the real analysis engine. It sends the tenancy agreement text
// plus the compliance checklist to Claude and requires a structured JSON
// response — no template output, no hardcoded "example" findings.
//
// Requires ANTHROPIC_API_KEY to be set in your Vercel project's
// environment variables (Project Settings → Environment Variables).
// Get a key at https://console.anthropic.com

import { getChecklistForJurisdiction, ComplianceRule } from './checklist';

export interface ComplianceFinding {
  ruleId: string;
  title: string;
  status: 'compliant' | 'non_compliant' | 'unclear' | 'not_applicable';
  severity: 'high' | 'medium' | 'low';
  explanation: string;
  quotedText: string | null;
  legalBasis: string;
  recommendation: string;
}

export interface ComplianceAuditReport {
  generatedAt: string;
  jurisdiction: 'england' | 'wales';
  overallRiskLevel: 'low' | 'medium' | 'high';
  summary: string;
  findings: ComplianceFinding[];
  disclaimer: string;
}

const DISCLAIMER =
  'This audit is an automated first-pass review against a defined checklist of common England & Wales letting compliance requirements. ' +
  'It is not legal advice, is not a substitute for a solicitor or qualified letting compliance professional, and does not verify facts ' +
  'that cannot be confirmed from the document text alone (such as whether certificates referenced actually exist, or licensing register status). ' +
  'Always get professional advice before acting on it.';

function buildSystemPrompt(rules: ComplianceRule[]): string {
  const checklistText = rules
    .map(
      (r) =>
        `- [${r.id}] ${r.title}\n  What to check: ${r.whatToCheck}\n  Legal basis: ${r.legalBasis}`
    )
    .join('\n\n');

  return `You are a UK residential lettings compliance analyst. You will be given the text of a tenancy agreement (and possibly surrounding notes/schedules). Assess it against the checklist below, item by item.

For EVERY checklist item, produce a finding. Do not skip items. If the document does not contain enough information to assess an item, mark it "unclear" rather than guessing, and say exactly what is missing.

Ground every finding in the actual document text. If you flag a clause as non-compliant, quote the relevant text (trimmed to the essential part, max ~40 words). If nothing in the document is relevant to an item (e.g. no letting agent involved, so agent-only rules don't apply), mark it "not_applicable".

Be conservative: do not invent facts about certificates, licences, or checks that aren't stated in the text. "The gas safety certificate was provided" should only be marked compliant if the document actually says so.

CHECKLIST:

${checklistText}

Respond with ONLY valid JSON (no markdown fences, no commentary before or after) matching exactly this shape:

{
  "overallRiskLevel": "low" | "medium" | "high",
  "summary": "2-3 sentence plain-English summary of the biggest issues, or confirmation of good compliance",
  "findings": [
    {
      "ruleId": "one of the checklist ids above",
      "status": "compliant" | "non_compliant" | "unclear" | "not_applicable",
      "severity": "high" | "medium" | "low",
      "explanation": "plain-English reasoning",
      "quotedText": "relevant excerpt or null",
      "recommendation": "concrete next step for the agent/landlord, or empty string if compliant"
    }
  ]
}`;
}

export async function runComplianceAudit(
  agreementText: string,
  jurisdiction: 'england' | 'wales' = 'england'
): Promise<ComplianceAuditReport> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      'ANTHROPIC_API_KEY is not set. Add it in Vercel → Project Settings → Environment Variables.'
    );
  }
  if (!agreementText || agreementText.trim().length < 200) {
    throw new Error(
      'Agreement text is too short to audit meaningfully. Check text extraction from the uploaded file.'
    );
  }

  const rules = getChecklistForJurisdiction(jurisdiction);
  const systemPrompt = buildSystemPrompt(rules);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-5',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Here is the tenancy agreement text to audit:\n\n---\n${agreementText.slice(
            0,
            60000
          )}\n---`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Claude API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const textBlock = data.content?.find((b: any) => b.type === 'text');
  if (!textBlock?.text) {
    throw new Error('Claude API returned no text content to parse.');
  }

  let parsed: {
    overallRiskLevel: 'low' | 'medium' | 'high';
    summary: string;
    findings: Array<{
      ruleId: string;
      status: ComplianceFinding['status'];
      severity: ComplianceFinding['severity'];
      explanation: string;
      quotedText: string | null;
      recommendation: string;
    }>;
  };

  try {
    const cleaned = textBlock.text.replace(/^\`\`\`json\s*|\`\`\`\s*$/g, '').trim();
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(
      `Failed to parse audit result as JSON: ${(err as Error).message}. Raw response: ${textBlock.text.slice(
        0,
        500
      )}`
    );
  }

  const ruleById = new Map(rules.map((r) => [r.id, r]));
  const findings: ComplianceFinding[] = parsed.findings.map((f) => {
    const rule = ruleById.get(f.ruleId);
    return {
      ruleId: f.ruleId,
      title: rule?.title ?? f.ruleId,
      status: f.status,
      severity: f.severity,
      explanation: f.explanation,
      quotedText: f.quotedText,
      legalBasis: rule?.legalBasis ?? 'See checklist',
      recommendation: f.recommendation,
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    jurisdiction,
    overallRiskLevel: parsed.overallRiskLevel,
    summary: parsed.summary,
    findings,
    disclaimer: DISCLAIMER,
  };
}
