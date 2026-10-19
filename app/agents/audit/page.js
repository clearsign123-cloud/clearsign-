"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const groups = [
  {
    title: "Tenancy & parties",
    note: "Confirm the tenancy record and the people involved.",
    items: [
      ["agreement", "Signed tenancy agreement available", "agreement"],
      ["parties", "Tenant and landlord names match the agreement", "agreement"],
      ["address", "Property address and tenancy dates recorded", "agreement"],
      ["rent", "Rent, payment frequency and permitted charges reviewed", "agreement"],
      ["terms", "Unusual, unclear or potentially unfair clauses reviewed", "agreement"],
    ],
  },
  {
    title: "Deposit",
    note: "Check the record and evidence; do not mark verified without proof.",
    items: [
      ["amount", "Deposit amount checked against applicable cap", "deposit"],
      ["scheme", "Deposit protection scheme and reference recorded", "deposit"],
      ["prescribed", "Prescribed information and service evidence recorded", "deposit"],
      ["receipt", "Deposit payment/receipt evidence attached or referenced", "deposit"],
    ],
  },
  {
    title: "Property documents & safety",
    note: "Record the document, date and evidence for each applicable requirement.",
    items: [
      ["gas", "Gas safety record checked where applicable", "documents"],
      ["eicr", "Electrical installation condition report (EICR) checked", "documents"],
      ["epc", "Energy Performance Certificate (EPC) checked", "documents"],
      ["howto", "How to Rent guide service recorded where applicable", "documents"],
      ["licence", "Property/HMO/selective licence requirement checked", "documents"],
      ["alarms", "Smoke and carbon monoxide alarm requirements checked", "documents"],
    ],
  },
  {
    title: "Right to Rent & identity",
    note: "Use the applicable lawful process and retain records securely.",
    items: [
      ["rtr", "Right to Rent check completed for relevant occupiers", "identity"],
      ["id", "Identity and tenant details checked against the record", "identity"],
      ["followup", "Any time-limited follow-up check date recorded", "identity"],
    ],
  },
  {
    title: "Evidence & follow-up",
    note: "A tick means the agent has reviewed evidence, not simply that a task was attempted.",
    items: [
      ["evidence", "Supporting evidence is located and referenced", "evidence"],
      ["actions", "Outstanding issues have an owner and due date", "evidence"],
      ["reviewer", "Reviewer and review date recorded", "evidence"],
      ["tenantcopy", "Copies/service to tenant recorded where required", "evidence"],
    ],
  },
];

const statuses = [
  { value: "verified", label: "Verified" },
  { value: "attention", label: "Needs attention" },
  { value: "missing", label: "Missing evidence" },
  { value: "na", label: "Not applicable" },
  { value: "unchecked", label: "Not checked" },
];

export default function TenancyAuditPage() {
  const [property, setProperty] = useState("");
  const [tenant, setTenant] = useState("");
  const [landlord, setLandlord] = useState("");
  const [reference, setReference] = useState("");
  const [reviewer, setReviewer] = useState("");
  const [reviewDate, setReviewDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [entries, setEntries] = useState({});
  const [saved, setSaved] = useState(false);

  const allItems = groups.flatMap((g) => g.items);
  const counts = useMemo(() => {
    const result = { verified: 0, attention: 0, missing: 0, na: 0, unchecked: 0 };
    allItems.forEach(([id]) => {
      const s = entries[id] || "unchecked";
      result[s] = (result[s] || 0) + 1;
    });
    return result;
  }, [entries]);
  const reviewed = counts.verified + counts.attention + counts.missing + counts.na;
  const progress = Math.round((reviewed / allItems.length) * 100);
  const setStatus = (id, status) => {
    setEntries((current) => ({ ...current, [id]: status }));
    setSaved(false);
  };
  const reportText = () => {
    const lines = [
      "CLEARSIGN — TENANCY AUDIT",
      "Property: " + (property || "Not entered"),
      "Tenant(s): " + (tenant || "Not entered"),
      "Landlord: " + (landlord || "Not entered"),
      "Tenancy reference: " + (reference || "Not entered"),
      "Reviewer: " + (reviewer || "Not entered"),
      "Review date: " + (reviewDate || "Not entered"),
      "",
      "SUMMARY",
      "Verified: " + counts.verified,
      "Needs attention: " + counts.attention,
      "Missing evidence: " + counts.missing,
      "Not applicable: " + counts.na,
      "Not checked: " + counts.unchecked,
      "",
    ];
    groups.forEach((g) => {
      lines.push(g.title.toUpperCase());
      g.items.forEach(([id, label]) => {
        const s = statuses.find((x) => x.value === (entries[id] || "unchecked"));
        lines.push("- [" + s.label + "] " + label);
      });
      lines.push("");
    });
    lines.push("NOTES / ACTIONS", notes || "None entered");
    lines.push("", "This is an agent review aid, not a legal determination. Verify current requirements and source evidence before marking an item verified.");
    return lines.join("\n");
  };
  const downloadReport = () => {
    const blob = new Blob([reportText()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clearsign-tenancy-audit.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-[#080c11] text-[#f3f5f7]">
      <header className="border-b border-[#202a34]">
        <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/for-agents" className="font-semibold tracking-tight">ClearSign <span className="text-[#ef3340]">/ AGENTS</span></Link>
          <Link href="/agents" className="text-sm text-slate-300 hover:text-white">Agent sign in</Link>
        </nav>
      </header>
      <div className="max-w-5xl mx-auto px-5 py-10 md:py-14">
        <Link href="/for-agents" className="text-sm text-slate-400 hover:text-white">← Back to agent overview</Link>
        <div className="mt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-[.18em] text-[#ef3340] font-bold">Agent workspace · Preview</p>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mt-3">Tenancy audit checker</h1>
            <p className="text-slate-400 mt-3 max-w-2xl leading-6">Review the tenancy record, agreement, deposit, documents and evidence in one checklist. Flag gaps and export a report for follow-up.</p>
          </div>
          <button onClick={downloadReport} className="rounded-lg bg-[#ef3340] px-5 py-3 font-semibold text-white hover:bg-[#d92936]">Export audit report ↓</button>
        </div>

        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
          {[
            ["Reviewed", reviewed + " / " + allItems.length, progress + "% complete"],
            ["Verified", counts.verified, "Evidence reviewed"],
            ["Needs attention", counts.attention, "Agent follow-up"],
            ["Missing evidence", counts.missing, "Resolve or explain"],
          ].map(([label, value, sub]) => (
            <div key={label} className="rounded-xl border border-[#25303b] bg-[#0e141b] p-4">
              <p className="text-xs text-slate-400">{label}</p><p className="text-2xl font-semibold mt-2">{value}</p><p className="text-xs text-slate-500 mt-1">{sub}</p>
            </div>
          ))}
        </section>
        <div className="h-2 rounded-full bg-[#202a34] mt-4 overflow-hidden"><div className="h-full bg-[#ef3340] transition-all" style={{ width: progress + "%" }} /></div>

        <section className="mt-8 rounded-xl border border-[#25303b] bg-[#0e141b] p-5 md:p-6">
          <h2 className="text-xl font-semibold">Tenancy details</h2>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {[
              ["Property address", property, setProperty, "e.g. 14 Kingsway Road"],
              ["Tenant(s)", tenant, setTenant, "Tenant names"],
              ["Landlord", landlord, setLandlord, "Landlord / client"],
              ["Tenancy reference", reference, setReference, "Internal reference"],
              ["Reviewer", reviewer, setReviewer, "Agent completing the audit"],
            ].map(([label, value, setter, placeholder]) => (
              <label key={label} className="text-sm text-slate-300">{label}<input value={value} onChange={(e) => { setter(e.target.value); setSaved(false); }} placeholder={placeholder} className="mt-2 w-full rounded-lg border border-[#25303b] bg-[#080c11] px-3 py-3 text-white placeholder:text-slate-600 outline-none focus:border-[#ef3340]" /></label>
            ))}
            <label className="text-sm text-slate-300">Review date<input type="date" value={reviewDate} onChange={(e) => { setReviewDate(e.target.value); setSaved(false); }} className="mt-2 w-full rounded-lg border border-[#25303b] bg-[#080c11] px-3 py-3 text-white outline-none focus:border-[#ef3340]" /></label>
          </div>
        </section>

        <div className="mt-8 space-y-5">
          {groups.map((group, gi) => (
            <section key={group.title} className="rounded-xl border border-[#25303b] bg-[#0e141b] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#25303b]">
                <p className="text-xs text-[#ef3340] font-bold">SECTION {String(gi + 1).padStart(2, "0")}</p>
                <h2 className="text-xl font-semibold mt-1">{group.title}</h2>
                <p className="text-sm text-slate-400 mt-1">{group.note}</p>
              </div>
              <div className="divide-y divide-[#202a34]">
                {group.items.map(([id, label]) => (
                  <div key={id} className="p-4 md:px-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <p className="text-sm leading-5 text-slate-200">{label}</p>
                    <select aria-label={label + " status"} value={entries[id] || "unchecked"} onChange={(e) => setStatus(id, e.target.value)} className="w-full md:w-48 rounded-lg border border-[#25303b] bg-[#080c11] px-3 py-2.5 text-sm text-white">
                      {statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-xl border border-[#25303b] bg-[#0e141b] p-5 md:p-6">
          <h2 className="text-xl font-semibold">Findings and follow-up actions</h2>
          <p className="text-sm text-slate-400 mt-2">Record what needs correcting, who will handle it and the target date. Avoid entering unnecessary sensitive personal data.</p>
          <textarea value={notes} onChange={(e) => { setNotes(e.target.value); setSaved(false); }} rows={5} placeholder="e.g. Request updated EICR evidence from landlord; confirm deposit prescribed information service date..." className="mt-4 w-full rounded-lg border border-[#25303b] bg-[#080c11] px-3 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-[#ef3340]" />
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={() => { setSaved(true); }} className="rounded-lg border border-[#ef3340] px-5 py-3 font-semibold text-white hover:bg-[#251317]">Mark review completed</button>
            <button onClick={downloadReport} className="rounded-lg bg-[#ef3340] px-5 py-3 font-semibold text-white hover:bg-[#d92936]">Export audit report</button>
          </div>
          {saved && <p role="status" className="mt-4 text-sm text-emerald-300">Review marked complete in this page. Export the report to keep a copy; this preview does not save records to a shared database.</p>}
        </section>
        <p className="text-xs leading-5 text-slate-500 mt-8">Important: This checklist is a review aid for England and Wales, not legal advice or an automated certification of compliance. Requirements depend on the property and tenancy circumstances. “Verified” should only be selected after the agent has reviewed suitable evidence. This preview stores entries only in the current page session; exporting creates a local text report.</p>
      </div>
    </main>
  );
}
