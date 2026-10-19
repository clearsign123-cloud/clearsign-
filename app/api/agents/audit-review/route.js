import { NextResponse } from "next/server";
import pdf from "pdf-parse";

export const runtime = "nodejs";
export const maxDuration = 30;

const rules = [
  { id:"deposit-cap", severity:"high", title:"Deposit amount may exceed the permitted cap", pattern:/(?:deposit|security deposit)[^\n.]{0,100}?(?:£\s?[\d,]+|\d+(?:\.\d{2})?\s?(?:weeks?|months?))/ig, test:(s)=>{ const m=s.match(/£\s?([\d,]+(?:\.\d{2})?)/); return m ? Number(m[1].replace(/,/g,"")) : null; }, explain:"The tenancy deposit cap depends on the annual rent and tenancy circumstances. The extracted wording alone cannot establish whether the amount is lawful.", fix:"Compare the deposit with the applicable statutory cap using the rent and tenancy details; correct the clause or obtain advice if it exceeds the cap.", uncertain:true },
  { id:"landlord-entry", severity:"medium", title:"Landlord access wording may be too broad", pattern:/(?:enter|entry|access)[^\n.]{0,180}(?:at any time|without notice|whenever|any time)/ig, explain:"Unrestricted entry wording may conflict with a tenant's right to quiet enjoyment and the agreed notice arrangements.", fix:"Specify reasonable access for a legitimate purpose, with appropriate advance notice and the tenant's agreement except in a genuine emergency.", uncertain:true },
  { id:"repair-waiver", severity:"high", title:"Possible attempt to exclude repair obligations", pattern:/(?:landlord|lessor)[^\n.]{0,120}(?:not responsible|no liability|exclude|shall not repair)[^\n.]{0,100}(?:repair|structure|heating|water|condition)/ig, explain:"A clause cannot necessarily contract out of statutory landlord repairing or fitness obligations.", fix:"Have the clause reviewed against the property and applicable statutory duties; remove wording that purports to exclude non-excludable obligations.", uncertain:true },
  { id:"penalty-fee", severity:"medium", title:"Fee or penalty wording needs review", pattern:/(?:penalty|administration fee|default fee|late payment fee|charge of £)[^\n.]{0,160}/ig, explain:"Tenant fees are restricted. Whether a charge is permitted depends on its purpose, amount and circumstances.", fix:"Identify the legal basis for each charge and check it against current permitted-payment rules. Remove unsupported or prohibited charges.", uncertain:true },
  { id:"unfair-forfeiture", severity:"high", title:"Possible unilateral termination or forfeiture wording", pattern:/(?:landlord|agent)[^\n.]{0,160}(?:terminate immediately|evict without|change the locks|forfeit the tenancy without|end the tenancy at any time)/ig, explain:"A landlord generally must use the applicable lawful possession process; contract wording does not itself authorise unlawful eviction.", fix:"Replace with wording that accurately reflects the lawful notice and possession process for this tenancy. Obtain solicitor review.", uncertain:true },
  { id:"deposit-protection", severity:"medium", title:"Deposit protection wording found — verify the actual compliance record", pattern:/(?:deposit protection|tenancy deposit scheme|prescribed information)/ig, explain:"A clause mentioning deposit protection does not prove that the deposit was protected or prescribed information served on time.", fix:"Check the scheme certificate, dates and evidence of service separately; record the evidence in the audit checklist.", uncertain:true },
  { id:"break-clause", severity:"low", title:"Break clause identified for manual review", pattern:/(?:break clause|break option|early termination|terminate this agreement on giving)/ig, explain:"Break rights can depend on exact drafting, notice, timing and tenancy type.", fix:"Check who can exercise the clause, the notice period, service method, dates and consistency with current law.", uncertain:true },
  { id:"rent-review", severity:"medium", title:"Rent review clause identified for manual review", pattern:/(?:rent review|rent may be increased|increase the rent|review the rent)/ig, explain:"The validity and operation of rent increase wording depend on the tenancy type, drafting and current law.", fix:"Check the mechanism, timing, notice requirements and applicable statutory rules before relying on it.", uncertain:true },
  { id:"joint-liability", severity:"low", title:"Joint and several liability wording identified", pattern:/jointly and severally/ig, explain:"This wording can make each joint tenant liable for the whole contractual obligation. Confirm that this matches the intended arrangement and was clearly explained.", fix:"Confirm the tenancy is genuinely a joint tenancy and the allocation of liability is understood; obtain advice if circumstances are unusual.", uncertain:true },
  { id:"jurisdiction", severity:"high", title:"Agreement may be outside the supported jurisdiction", pattern:/(?:Scotland|Northern Ireland|Scottish secure tenancy|private residential tenancy)/ig, explain:"This checker covers England and Wales only.", fix:"Stop this review and use a checker or adviser familiar with the relevant jurisdiction.", uncertain:true }
];

const guidanceByRule = {
  "deposit-cap": [{ label:"GOV.UK: Tenancy deposit protection", url:"https://www.gov.uk/tenancy-deposit-protection" }],
  "deposit-protection": [{ label:"GOV.UK: Tenancy deposit protection", url:"https://www.gov.uk/tenancy-deposit-protection" }],
  "landlord-entry": [{ label:"Shelter: Landlord access and visits", url:"https://england.shelter.org.uk/housing_advice/repairs/landlord_access_and_visits" }],
  "repair-waiver": [{ label:"GOV.UK: Landlord and tenant responsibilities", url:"https://www.gov.uk/private-renting/your-landlords-safety-responsibilities" }],
  "penalty-fee": [{ label:"GOV.UK: Tenant Fees Act guidance", url:"https://www.gov.uk/government/collections/tenant-fees-act" }],
  "unfair-forfeiture": [{ label:"GOV.UK: Evicting tenants in England", url:"https://www.gov.uk/evicting-tenants" }],
  "break-clause": [{ label:"GOV.UK: Private renting", url:"https://www.gov.uk/private-renting" }],
  "rent-review": [{ label:"GOV.UK: Rent increases", url:"https://www.gov.uk/private-renting/rent-increases" }],
  "joint-liability": [{ label:"Shelter: Joint tenancies", url:"https://england.shelter.org.uk/housing_advice/private_renting/joint_tenancies" }],
  "jurisdiction": [{ label:"GOV.UK: Private renting", url:"https://www.gov.uk/private-renting" }]
};

function splitClauses(text) {
  const lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  const chunks = [];
  let current = "";
  for (const line of lines) {
    const heading = /^(?:clause\s+)?\d+(?:\.\d+)*[.)\s:-]+|^(?:section|schedule)\s+[a-z0-9]+/i.test(line);
    if (heading && current) { chunks.push(current); current = line; }
    else current += (current ? "\n" : "") + line;
    if (current.length > 4500) { chunks.push(current); current = ""; }
  }
  if (current) chunks.push(current);
  return chunks;
}

export async function POST(request) {
  try {
    const form = await request.formData();
    const file = form.get("agreement");
    const jurisdiction = String(form.get("jurisdiction") || "england");
    const tenancyStart = String(form.get("tenancyStart") || "");
    const rent = String(form.get("rent") || "");
    if (!file || typeof file.arrayBuffer !== "function") return NextResponse.json({ error:"Upload a PDF or plain-text agreement first." }, { status:400 });
    if (file.size === 0) return NextResponse.json({ error:"The selected file is empty (0 bytes). Please choose the actual PDF from Finder and confirm it has a non-zero file size." }, { status:400 });
    if (file.size > 12 * 1024 * 1024) return NextResponse.json({ error:"File is larger than 12 MB. Upload a smaller PDF or text file." }, { status:413 });
    if (!/\.pdf$|\.txt$/i.test(file.name)) return NextResponse.json({ error:"This first version accepts searchable PDF and .txt files. Word files and scanned-image PDFs are not supported yet." }, { status:415 });
    if (jurisdiction !== "england" && jurisdiction !== "wales") return NextResponse.json({ error:"This checker covers England and Wales only." }, { status:400 });
    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.length === 0) return NextResponse.json({ error:"The uploaded file is empty (0 bytes). Please select the actual PDF file from your computer." }, { status:400 });
    let text = "";
    if (/\.pdf$/i.test(file.name)) {
      try {
        const parsed = await pdf(buffer);
        text = parsed?.text || "";
      } catch (parseError) {
        console.error("ClearSign PDF extraction failed", parseError?.stack || parseError);
        return NextResponse.json({ error:"PDF reading failed. Please open the PDF in Preview, choose File → Export as PDF, and upload the newly saved copy. Scanned PDFs require OCR." }, { status:422 });
      }
    } else text = buffer.toString("utf8");
    text = text.replace(/\\u0000/g, "").trim();
    if (text.length < 120) {
      console.warn("ClearSign extracted little text", { filename:file.name, bytes:buffer.length, chars:text.length });
      return NextResponse.json({ error:"The PDF opened, but it contains almost no selectable text. If it is a scan or photo, OCR is required before this checker can review it." }, { status:422 });
    }
    const clauses = splitClauses(text);
    const findings = [];
    for (const rule of rules) {
      rule.pattern.lastIndex = 0;
      const matches = [];
      let match;
      while ((match = rule.pattern.exec(text)) !== null) {
        const snippet = match[0].replace(/\\s+/g, " ").trim().slice(0, 420);
        if (!matches.some(item => item.toLowerCase() === snippet.toLowerCase())) matches.push(snippet);
        if (match[0].length === 0) rule.pattern.lastIndex++;
      }
      if (!matches.length) continue;
      // One finding per rule: related phrases (e.g. deposit protection and
      // prescribed information) are evidence for the same compliance check,
      // not separate risks.
      const quote = matches[0];
      const index = text.toLowerCase().indexOf(quote.toLowerCase());
      const before = text.slice(Math.max(0,index-180), index);
      const headingMatch = before.match(/(?:clause\\s+)?(\\d+(?:\\.\\d+)+|\\d{1,2})[.)\\s:-]+[^\\n]{0,100}\\n?[^\\n]{0,80}$/i);
      findings.push({
        id: rule.id,
        severity: rule.severity,
        title: rule.title,
        clauseReference: headingMatch ? "Possible clause " + headingMatch[1] : "Reference not reliably extracted",
        quote,
        evidence: matches.slice(1, 6),
        additionalMatches: Math.max(0, matches.length - 1),
        guidance: guidanceByRule[rule.id] || [],
        issue: rule.explain,
        suggestedFix: rule.fix,
        confidence: "Needs human verification",
        basis: "Keyword/pattern match; not a legal conclusion"
      });
    }
    const counts = { high:0, medium:0, low:0 };
    findings.forEach(f => counts[f.severity]++);
    const clausesReviewed = clauses.length;
    return NextResponse.json({
      filename:file.name,
      jurisdiction:jurisdiction === "wales" ? "Wales" : "England",
      extractedCharacters:text.length,
      clausesDetected:clausesReviewed,
      context:{ tenancyStart:tenancyStart || null, monthlyRent:rent || null },
      counts, findings,
      summary: findings.length
        ? "The initial automated scan found " + findings.length + " item(s) for human review. Findings are pattern matches, not confirmed breaches; read the quoted wording in context."
        : "No configured risk patterns matched the extracted text. This does not mean the agreement is compliant; manual review is still required.",
      limitations:[
        "This initial scanner uses transparent text-pattern rules, not a legal AI model or a complete clause-by-clause legal opinion.",
        "A match can be a false positive and clauses can be missed. Clause references are best-effort.",
        "The scan does not verify deposit scheme records, certificates, service, property facts or current external legal records.",
        "Use the checklist alongside this report and have high-risk or unclear findings reviewed by a qualified solicitor."
      ]
    });
  } catch (error) {
    console.error("ClearSign agreement review failed", error?.stack || error);
    return NextResponse.json({ error:"Agreement review failed. Please try again with a searchable PDF or plain-text file." }, { status:500 });
  }
}
