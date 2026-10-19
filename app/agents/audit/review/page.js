"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const severityStyle = { high:"border-red-500/50 bg-red-950/30", medium:"border-amber-500/40 bg-amber-950/20", low:"border-slate-600 bg-slate-900/60" };

export default function AgreementReviewPage() {
  const [file, setFile] = useState(null);
  const [jurisdiction, setJurisdiction] = useState("england");
  const [tenancyStart, setTenancyStart] = useState("");
  const [rent, setRent] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState("all");
  const [findingStatus, setFindingStatus] = useState({});
  const [findingNotes, setFindingNotes] = useState({});
  const [findingOwner, setFindingOwner] = useState({});
  const counts = useMemo(() => result?.counts || {high:0,medium:0,low:0}, [result]);
  async function runReview(e) {
    e.preventDefault();
    if (!file) { setError("Choose a searchable PDF or .txt agreement first."); return; }
    setBusy(true); setError(""); setResult(null);
    try {
      const data = new FormData();
      data.append("agreement", file);
      data.append("jurisdiction", jurisdiction);
      data.append("tenancyStart", tenancyStart);
      data.append("rent", rent);
      const response = await fetch("/api/agents/audit-review", { method:"POST", body:data });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Review failed.");
      setResult(body);
    } catch (err) { setError(err.message || "Review failed. Please try again."); }
    finally { setBusy(false); }
  }
  function exportReport() {
    if (!result) return;
    const lines = [
      "CLEARSIGN — TENANCY AGREEMENT REVIEW",
      "File: " + result.filename,
      "Jurisdiction: " + result.jurisdiction,
      "Generated: " + new Date().toLocaleString("en-GB"),
      "Extracted characters: " + result.extractedCharacters,
      "Potential high risks: " + result.counts.high,
      "Potential medium risks: " + result.counts.medium,
      "Potential low risks: " + result.counts.low,
      "", "SUMMARY", result.summary, ""
    ];
    result.findings.forEach((f,i) => lines.push(
      (i+1)+". ["+f.severity.toUpperCase()+"] "+f.title,
      "Clause reference: "+f.clauseReference,
      "Wording: “"+f.quote+"”",
      ...(f.evidence || []).map((q)=>"Additional matched wording: “"+q+"”"),
      "Issue: "+f.issue,
      "Suggested fix: "+f.suggestedFix,
      "Review status: "+(findingStatus[f.id] || "Open"),
      "Action owner: "+(findingOwner[f.id] || "Unassigned"),
      "Reviewer notes: "+(findingNotes[f.id] || "None recorded"),
      ...(f.guidance || []).map((g)=>"Guidance: "+g.label+" — "+g.url),
      "Confidence: "+f.confidence,
      ""
    ));
    lines.push("LIMITATIONS", ...result.limitations.map(x=>"- "+x), "", "Not legal advice. England and Wales only.");
    const url = URL.createObjectURL(new Blob([lines.join("\n")], {type:"text/plain;charset=utf-8"}));
    const a = document.createElement("a"); a.href=url; a.download="clearsign-agreement-review.txt"; a.click(); URL.revokeObjectURL(url);
  }
  const visible = result?.findings.filter(f => filter === "all" || f.severity === filter) || [];

  return <main className="min-h-screen bg-[#080c11] text-[#f3f5f7]">
    <header className="border-b border-[#202a34]"><nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between"><Link href="/for-agents" className="font-semibold">ClearSign <span className="text-[#ef3340]">/ AGENTS</span></Link><Link href="/agents/audit" className="text-sm text-slate-300 hover:text-white">Checklist workspace →</Link></nav></header>
    <div className="max-w-5xl mx-auto px-5 py-10 md:py-14">
      <Link href="/agents/audit" className="text-sm text-slate-400 hover:text-white">← Back to tenancy audit</Link>
      <div className="mt-6"><p className="text-xs uppercase tracking-[.18em] text-[#ef3340] font-bold">Agreement review · Early access</p><h1 className="text-3xl md:text-5xl font-bold tracking-tight mt-3">Tenancy agreement checker</h1><p className="text-slate-400 mt-3 max-w-3xl leading-6">Upload one agreement to extract its text and scan for common wording that may need compliance review. Findings include the matched wording, risk level and suggested next step.</p></div>
      <form onSubmit={runReview} className="mt-8 rounded-xl border border-[#25303b] bg-[#0e141b] p-5 md:p-7 space-y-5">
        <label className="block text-sm text-slate-300">Tenancy agreement (searchable PDF or plain text, max 12 MB)
          <input type="file" accept=".pdf,.txt,application/pdf,text/plain" onChange={e=>{setFile(e.target.files?.[0]||null);setError("");setResult(null);}} className="block mt-3 w-full rounded-lg border border-[#25303b] bg-[#080c11] p-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-[#ef3340] file:px-3 file:py-2 file:font-semibold file:text-white"/>
        </label>
        {file && <p className="text-xs text-slate-400">Selected: {file.name} · {(file.size/1024/1024).toFixed(2)} MB</p>}
        <div className="grid md:grid-cols-3 gap-4">
          <label className="text-sm text-slate-300">Jurisdiction<select value={jurisdiction} onChange={e=>setJurisdiction(e.target.value)} className="mt-2 w-full rounded-lg border border-[#25303b] bg-[#080c11] p-3 text-white"><option value="england">England</option><option value="wales">Wales</option><option value="scotland">Scotland (out of scope)</option><option value="northern-ireland">Northern Ireland (out of scope)</option></select></label>
          <label className="text-sm text-slate-300">Tenancy start date (optional)<input type="date" value={tenancyStart} onChange={e=>setTenancyStart(e.target.value)} className="mt-2 w-full rounded-lg border border-[#25303b] bg-[#080c11] p-3 text-white"/></label>
          <label className="text-sm text-slate-300">Monthly rent (£, optional)<input inputMode="decimal" value={rent} onChange={e=>setRent(e.target.value)} placeholder="e.g. 1500" className="mt-2 w-full rounded-lg border border-[#25303b] bg-[#080c11] p-3 text-white placeholder:text-slate-600"/></label>
        </div>
        <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4 text-sm text-amber-100">This first pass is a rule-based risk scan, not a complete legal AI review. Files are processed for this request and are not saved by this feature. Use a copy with unnecessary personal data removed.</div>
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        <button disabled={busy||!file} className="rounded-lg bg-[#ef3340] px-5 py-3 font-semibold text-white disabled:opacity-50">{busy?"Extracting and scanning…":"Review agreement →"}</button>
      </form>

      {result && <section className="mt-8 space-y-5" aria-live="polite">
        <div className="rounded-xl border border-[#25303b] bg-[#0e141b] p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4"><div><p className="text-xs uppercase tracking-wider text-[#ef3340] font-bold">Review result</p><h2 className="text-xl font-semibold mt-2">{result.filename}</h2><p className="text-sm text-slate-400 mt-2">{result.jurisdiction} · {result.clausesDetected} text sections detected · {result.extractedCharacters.toLocaleString()} characters extracted</p></div><button onClick={exportReport} className="rounded-lg border border-[#ef3340] px-4 py-2.5 text-sm font-semibold">Export report ↓</button></div>
          <p className="mt-5 text-slate-200 leading-6">{result.summary}</p>
          <div className="grid grid-cols-3 gap-3 mt-5">{[["High",counts.high,"text-red-300"],["Medium",counts.medium,"text-amber-300"],["Low",counts.low,"text-slate-200"]].map(([l,n,c])=><div key={l} className="rounded-lg border border-[#25303b] p-4"><p className="text-xs text-slate-400">{l} priority</p><p className={"text-2xl font-semibold mt-1 "+c}>{n}</p></div>)}</div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-semibold">Potential findings ({result.findings.length})</h2><div className="flex gap-2">{[["all","All"],["high","High"],["medium","Medium"],["low","Low"]].map(([v,l])=><button key={v} onClick={()=>setFilter(v)} className={"rounded-full border px-3 py-1.5 text-sm "+(filter===v?"border-[#ef3340] bg-[#251317]":"border-[#25303b] text-slate-400")}>{l}</button>)}</div></div>
        {visible.length===0 && <div className="rounded-xl border border-[#25303b] p-5 text-slate-300">No findings at this priority. A clean scan is not proof of compliance.</div>}
        {visible.map((f,i)=><article key={f.id} className={"rounded-xl border p-5 "+severityStyle[f.severity]}><div className="flex flex-wrap items-center gap-2"><span className="text-xs uppercase font-bold tracking-wider">{f.severity} priority</span><span className="text-xs text-slate-400">· {f.clauseReference}</span></div><h3 className="text-lg font-semibold mt-2">{f.title}</h3><blockquote className="mt-3 border-l-2 border-slate-500 pl-3 text-sm text-slate-300">“{f.quote}”</blockquote>{f.evidence?.length > 0 && <div className="mt-3 text-xs text-slate-400"><p className="font-semibold">{f.additionalMatches} additional matching phrase(s) grouped into this finding</p><ul className="mt-2 list-disc pl-5 space-y-1">{f.evidence.map((q,j)=><li key={j}>“{q}”</li>)}</ul></div>}<p className="mt-4 text-sm leading-6"><strong>Why it matters:</strong> {f.issue}</p><p className="mt-2 text-sm leading-6"><strong>Suggested next step:</strong> {f.suggestedFix}</p><div className="mt-4 grid gap-3 rounded-lg border border-[#39434e] bg-black/20 p-4 md:grid-cols-2"><label className="text-sm text-slate-300">Review status<select value={findingStatus[f.id] || "Open"} onChange={e=>setFindingStatus(prev=>({...prev,[f.id]:e.target.value}))} className="mt-1 w-full rounded-md border border-[#39434e] bg-[#080c11] p-2.5 text-white"><option>Open</option><option>In progress</option><option>Resolved</option><option>Not applicable</option></select></label><label className="text-sm text-slate-300">Action owner<input value={findingOwner[f.id] || ""} onChange={e=>setFindingOwner(prev=>({...prev,[f.id]:e.target.value}))} placeholder="Name or team" className="mt-1 w-full rounded-md border border-[#39434e] bg-[#080c11] p-2.5 text-white placeholder:text-slate-600"/></label><label className="text-sm text-slate-300 md:col-span-2">Evidence / follow-up notes<textarea value={findingNotes[f.id] || ""} onChange={e=>setFindingNotes(prev=>({...prev,[f.id]:e.target.value}))} placeholder="Record what was checked, evidence location, or the next action…" rows={3} className="mt-1 w-full rounded-md border border-[#39434e] bg-[#080c11] p-2.5 text-white placeholder:text-slate-600"/></label><p className="text-xs text-slate-500 md:col-span-2">These review notes stay in this page session and are included when you export the report. They are not saved to a shared database.</p></div>{f.guidance?.length > 0 && <div className="mt-3 text-sm"><p className="font-semibold text-slate-300">Reference guidance</p><ul className="mt-1 space-y-1">{f.guidance.map((g,j)=><li key={j}><a href={g.url} target="_blank" rel="noreferrer" className="text-sky-300 underline underline-offset-2 hover:text-sky-200">{g.label} ↗</a></li>)}</ul><p className="mt-1 text-xs text-slate-500">Guidance links provide context; they do not verify compliance or replace checking the current rules.</p></div>}<p className="mt-3 text-xs text-slate-500">{f.basis}. Human verification required; not a confirmed breach.</p></article>)}
        <div className="rounded-xl border border-[#25303b] bg-[#0e141b] p-5"><h3 className="font-semibold">Scope and limitations</h3><ul className="mt-3 list-disc pl-5 space-y-2 text-sm text-slate-400">{result.limitations.map(x=><li key={x}>{x}</li>)}</ul><p className="mt-4 text-xs text-slate-500">Not legal advice. Tenancy law changes; confirm the current position on GOV.UK or with a qualified solicitor.</p></div>
      </section>}
      <p className="text-xs leading-5 text-slate-500 mt-8">Supported: England and Wales. One searchable PDF or text file per review. Scanned PDFs requiring OCR, Word documents, batch uploads and automated checks against external records are not supported in this first version.</p>
    </div>
  </main>;
}
