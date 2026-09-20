'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Nav, Footer } from '../../components/layout';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jbMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jbmono' });

const CHECKOUT_URL = 'https://whop.com/checkout/plan_482Kjc';
const ACCESS_KEY = 'clearsign_agent_access';
const DATA_KEY = 'clearsign_agent_workspace_v1';

const seedProperties = [
  { id:'p1', address:'14 Example Road, Manchester, M1 1AA', landlord:'Example Landlord', status:'attention', tenancyId:'t1', updated:'Today' },
  { id:'p2', address:'8 King Street, Manchester, M2 4AA', landlord:'Example Landlord', status:'ok', tenancyId:'t2', updated:'Today' },
  { id:'p3', address:'22 Market Lane, Salford, M5 2AB', landlord:'Example Homes Ltd', status:'problem', tenancyId:'t3', updated:'Yesterday' },
];
const seedTenancies = [
  { id:'t1', propertyId:'p1', tenant:'Example Tenant', start:'2026-06-01', rent:950, status:'attention', requirements:5, complete:4 },
  { id:'t2', propertyId:'p2', tenant:'Example Tenant', start:'2026-04-01', rent:1100, status:'ok', requirements:6, complete:6 },
  { id:'t3', propertyId:'p3', tenant:'Example Tenant', start:'2026-05-15', rent:875, status:'problem', requirements:6, complete:3 },
];
const seedFindings = [
  { id:'f1', tenancyId:'t1', severity:'attention', title:'Required information needs review', reason:'ClearSign found information that may need checking against the current tenancy requirements.', source:'GOV.UK tenancy guidance', sourceDate:'2026-06-01', next:'Review the tenancy information and record the supporting document.', status:'open' },
  { id:'f2', tenancyId:'t3', severity:'problem', title:'Right to Rent evidence needs review', reason:'The file does not currently show the evidence ClearSign expects to see for this adult occupier.', source:'Home Office Right to Rent code', sourceDate:'2026-06-30', next:'Check the original Right to Rent evidence and record the outcome.', status:'open' },
  { id:'f3', tenancyId:'t3', severity:'attention', title:'Deposit evidence incomplete', reason:'The compliance file does not currently contain all expected deposit evidence.', source:'ClearSign compliance checklist', sourceDate:'2026-09-01', next:'Add the deposit protection and prescribed information evidence.', status:'open' },
];
const seedActions = [
  { id:'a1', findingId:'f1', tenancyId:'t1', title:'Review required tenancy information', due:'2026-09-25', status:'open', evidence:false },
  { id:'a2', findingId:'f2', tenancyId:'t3', title:'Check and record Right to Rent evidence', due:'2026-09-22', status:'open', evidence:true },
  { id:'a3', findingId:'f3', tenancyId:'t3', title:'Add deposit evidence', due:'2026-09-30', status:'open', evidence:true },
];

function blankData(){ return { properties:[], tenancies:[], findings:[], actions:[], events:[] }; }
function loadData(){ try { const raw=localStorage.getItem(DATA_KEY); return raw ? JSON.parse(raw) : blankData(); } catch { return blankData(); } }
function saveData(data){ localStorage.setItem(DATA_KEY, JSON.stringify(data)); }
function uid(prefix){ return prefix + Math.random().toString(36).slice(2,9); }
function money(n){ return '£' + Number(n||0).toLocaleString('en-GB'); }
function dateLabel(value){ if(!value) return '—'; return new Date(value+'T12:00:00').toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}); }
function statusLabel(s){ return s==='problem'?'Problem':s==='attention'?'Needs attention':'Up to date'; }

function Pill({status, children}) {
  const cls=status==='problem'?'border-redline/60 text-red-300 bg-redline/10':status==='attention'?'border-brass/60 text-brass bg-brass/10':'border-line text-paper bg-white/5';
  return <span className={'inline-flex items-center rounded-full border px-2.5 py-1 text-xs '+cls}>{children || statusLabel(status)}</span>;
}
function Stat({label,value,sub}){ return <div className="bg-panel border border-line rounded-xl p-5"><p className="text-sm text-muted">{label}</p><p className="text-3xl mt-2">{value}</p>{sub&&<p className="text-xs text-muted mt-2">{sub}</p>}</div>; }
function Modal({title,onClose,children}){ return <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"><div className="w-full max-w-2xl max-h-[90vh] overflow-auto bg-panel border border-line rounded-xl p-6"><div className="flex items-start justify-between gap-4"><h2 className="text-2xl">{title}</h2><button onClick={onClose} className="text-muted text-2xl">×</button></div>{children}</div></div>; }

function DemoBanner({onLoad}) {
  return <div className="mb-8 border border-brass/40 bg-brass/5 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div><p className="text-brass text-xs uppercase tracking-widest">Start here</p><p className="text-sm text-paper mt-1">Load a small demo portfolio to see how ClearSign sorts properties, findings and actions. Demo data stays in this browser.</p></div>
    <button onClick={onLoad} className="shrink-0 px-4 py-2 rounded-lg border border-brass text-brass">Load demo portfolio</button>
  </div>;
}

function AccessGate({onAccess}) {
  const [code,setCode]=useState(''); const [state,setState]=useState('idle'); const [error,setError]=useState('');
  async function verify(e){ e.preventDefault(); setState('checking'); setError(''); try { const res=await fetch('/api/agent-access',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code})}); const data=await res.json(); if(!data.valid){setState('error');setError(data.error||'That subscription code is not active.');return;} localStorage.setItem(ACCESS_KEY,'true'); setState('success'); onAccess(); } catch { setState('error'); setError('We could not verify that code. Please try again.'); } }
  return <div className={inter.variable+' '+jbMono.variable+' min-h-screen'}><Nav/><main className="max-w-3xl mx-auto px-6 py-20"><p className="text-xs uppercase tracking-widest text-brass">ClearSign for Agents</p><h1 className="text-4xl md:text-5xl mt-2">Your agent workspace.</h1><p className="text-lg text-muted mt-5">Manage properties, see what needs attention, record actions and keep an audit trail in one place.</p><div className="grid md:grid-cols-2 gap-4 mt-10"><div className="bg-panel border border-line rounded-xl p-6"><p className="text-xs uppercase tracking-widest text-brass">New customer</p><h2 className="text-2xl mt-2">Get Agent access</h2><p className="text-sm text-muted mt-3">Subscribe using the existing Whop checkout, then return here.</p><a href={CHECKOUT_URL} target="_blank" rel="noreferrer" className="inline-block mt-6 px-5 py-3 rounded-lg bg-redline text-white font-medium">Subscribe to ClearSign for Agents</a></div><div className="bg-panel border border-line rounded-xl p-6"><p className="text-xs uppercase tracking-widest text-brass">Already subscribed?</p><h2 className="text-2xl mt-2">Restore your access</h2><p className="text-sm text-muted mt-3">Enter your Whop membership ID. ClearSign verifies it against Whop.</p><form onSubmit={verify} className="mt-5"><input required value={code} onChange={e=>setCode(e.target.value)} placeholder="Whop membership ID" className="w-full bg-ink border border-line rounded-lg px-4 py-3 text-paper"/><button disabled={state==='checking'} className="w-full mt-3 px-5 py-3 rounded-lg border border-line disabled:opacity-40">{state==='checking'?'Checking…':'Restore access'}</button></form>{state==='error'&&<p className="text-sm text-red-300 mt-3">{error}</p>}{state==='success'&&<p className="text-sm text-paper mt-3">Access restored.</p>}</div></div></main><Footer/></div>;
}

export default function AgentsDashboard(){
  const [access,setAccess]=useState(false);
  const [data,setData]=useState(blankData);
  const [view,setView]=useState('dashboard');
  const [selected,setSelected]=useState(null);
  const [modal,setModal]=useState(null);
  const [query,setQuery]=useState('');
  const [toast,setToast]=useState('');

  useEffect(()=>{ setAccess(localStorage.getItem(ACCESS_KEY)==='true'); setData(loadData()); },[]);
  useEffect(()=>{ if(access) saveData(data); },[data,access]);

  const properties=data.properties||[], tenancies=data.tenancies||[], findings=data.findings||[], actions=data.actions||[];
  const openFindings=findings.filter(x=>x.status==='open');
  const openActions=actions.filter(x=>x.status!=='done');
  const problemCount=properties.filter(x=>x.status==='problem').length;
  const attentionCount=properties.filter(x=>x.status==='attention').length;
  const okCount=properties.filter(x=>x.status==='ok').length;
  const filteredProperties=properties.filter(p=>(p.address+' '+p.landlord).toLowerCase().includes(query.toLowerCase()));
  const selectedProperty=properties.find(p=>p.id===selected);
  const selectedTenancy=selectedProperty ? tenancies.find(t=>t.id===selectedProperty.tenancyId) : null;
  const selectedFindings=selectedTenancy ? findings.filter(f=>f.tenancyId===selectedTenancy.id) : [];
  const selectedActions=selectedTenancy ? actions.filter(a=>a.tenancyId===selectedTenancy.id) : [];

  function flash(message){ setToast(message); setTimeout(()=>setToast(''),2500); }
  function loadDemo(){ const d={properties:seedProperties,tenancies:seedTenancies,findings:seedFindings,actions:seedActions,events:[{id:uid('e'),text:'Demo portfolio loaded',at:new Date().toISOString()}]}; setData(d); flash('Demo portfolio loaded'); }
  function addProperty(e){ e.preventDefault(); const f=new FormData(e.currentTarget); const id=uid('p'), tId=uid('t'); const address=String(f.get('address')), landlord=String(f.get('landlord')), tenant=String(f.get('tenant')); setData(d=>({...d,properties:[...d.properties,{id,address,landlord,status:'attention',tenancyId:tId,updated:'Just now'}],tenancies:[...d.tenancies,{id:tId,propertyId:id,tenant,start:String(f.get('start')),rent:Number(f.get('rent')||0),status:'attention',requirements:0,complete:0}],events:[...d.events,{id:uid('e'),text:'Property added: '+address,at:new Date().toISOString()}]})); setModal(null); flash('Property added'); }
  function addFinding(e){ e.preventDefault(); const f=new FormData(e.currentTarget); const tenancyId=String(f.get('tenancyId')); const finding={id:uid('f'),tenancyId,severity:String(f.get('severity')),title:String(f.get('title')),reason:String(f.get('reason')),source:String(f.get('source'))||'User supplied information',sourceDate:new Date().toISOString().slice(0,10),next:String(f.get('next')),status:'open'}; setData(d=>({...d,findings:[...d.findings,finding],events:[...d.events,{id:uid('e'),text:'Finding recorded: '+finding.title,at:new Date().toISOString()}]})); setModal(null); flash('Finding recorded'); }
  function addAction(e){ e.preventDefault(); const f=new FormData(e.currentTarget); const action={id:uid('a'),findingId:String(f.get('findingId')||''),tenancyId:String(f.get('tenancyId')),title:String(f.get('title')),due:String(f.get('due')),status:'open',evidence:false}; setData(d=>({...d,actions:[...d.actions,action],events:[...d.events,{id:uid('e'),text:'Action created: '+action.title,at:new Date().toISOString()}]})); setModal(null); flash('Action created'); }
  function completeAction(id){ setData(d=>({...d,actions:d.actions.map(a=>a.id===id?{...a,status:'done',completedAt:new Date().toISOString()}:a),events:[...d.events,{id:uid('e'),text:'Action completed',at:new Date().toISOString()}]})); flash('Action marked done'); }
  function closeFinding(id){ setData(d=>({...d,findings:d.findings.map(f=>f.id===id?{...f,status:'resolved',resolvedAt:new Date().toISOString()}:f),events:[...d.events,{id:uid('e'),text:'Finding marked resolved',at:new Date().toISOString()}]})); flash('Finding resolved'); }
  function addEvidence(id){ setData(d=>({...d,actions:d.actions.map(a=>a.id===id?{...a,evidence:true}:a),events:[...d.events,{id:uid('e'),text:'Evidence recorded against an action',at:new Date().toISOString()}]})); flash('Evidence recorded'); }

  const nav=[['dashboard','Dashboard'],['properties','Properties'],['tenancies','Tenancies'],['actions','Actions'],['reports','Reports'],['history','History']];
  if(!access) return <AccessGate onAccess={()=>setAccess(true)}/>;

  return <div className={inter.variable+' '+jbMono.variable+' min-h-screen'}><Nav/><div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
    <div className="flex flex-col lg:flex-row gap-6">
      <aside className="lg:w-56 shrink-0"><div className="lg:sticky lg:top-6"><p className="text-xs uppercase tracking-widest text-brass px-3">ClearSign for Agents</p><p className="text-sm text-muted px-3 mt-1">Portfolio workspace</p><nav className="mt-5 space-y-1">{nav.map(([id,label])=><button key={id} onClick={()=>setView(id)} className={'w-full text-left px-3 py-2.5 rounded-lg text-sm '+(view===id?'bg-panel border border-line text-paper':'text-muted hover:text-paper')}>{label}</button>)}</nav><button onClick={()=>{localStorage.removeItem(ACCESS_KEY);setAccess(false)}} className="mt-6 px-3 text-xs text-muted hover:text-paper">Sign out</button></div></aside>
      <main className="flex-1 min-w-0">
        {toast&&<div className="fixed top-5 right-5 z-[60] bg-panel border border-line rounded-lg px-4 py-3 text-sm shadow-xl">{toast}</div>}
        {view==='dashboard'&&<><div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5"><div><p className="text-xs uppercase tracking-widest text-brass">Portfolio</p><h1 className="text-4xl mt-1">Compliance at a glance.</h1><p className="text-muted mt-3 max-w-2xl">ClearSign sorts the portfolio so you can start with the properties that need attention.</p></div><button onClick={()=>setModal('property')} className="px-5 py-3 rounded-lg bg-redline text-white font-medium">+ Add property</button></div>
        {properties.length===0&&<div className="mt-8"><DemoBanner onLoad={loadDemo}/></div>}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8"><Stat label="Properties" value={properties.length}/><Stat label="Problems" value={problemCount} sub="Potential issues to review"/><Stat label="Needs attention" value={attentionCount}/><Stat label="Up to date" value={okCount}/></section>
        <section className="mt-10"><div className="flex items-center justify-between mb-4"><div><p className="text-xs uppercase tracking-widest text-brass">Priority</p><h2 className="text-2xl mt-1">Properties needing attention</h2></div><button onClick={()=>setView('properties')} className="text-sm text-muted hover:text-paper">View all →</button></div>{properties.length===0?<Empty text="Add your first property or load the demo portfolio."/>:<div className="grid gap-3">{properties.filter(p=>p.status!=='ok').slice(0,6).map(p=><PropertyRow key={p.id} p={p} onClick={()=>{setSelected(p.id);setView('property')}}/>)}</div>}</section>
        <section className="mt-10 grid lg:grid-cols-2 gap-4"><div className="bg-panel border border-line rounded-xl p-6"><p className="text-xs uppercase tracking-widest text-brass">Open actions</p><h2 className="text-2xl mt-1">{openActions.length}</h2><p className="text-sm text-muted mt-2">Tasks waiting for an agent decision or completion.</p><button onClick={()=>setView('actions')} className="mt-5 text-sm border border-line rounded-lg px-4 py-2">Open action list</button></div><div className="bg-panel border border-line rounded-xl p-6"><p className="text-xs uppercase tracking-widest text-brass">Open findings</p><h2 className="text-2xl mt-1">{openFindings.length}</h2><p className="text-sm text-muted mt-2">ClearSign findings are potential issues for review, not final legal determinations.</p><button onClick={()=>setView('tenancies')} className="mt-5 text-sm border border-line rounded-lg px-4 py-2">Review findings</button></div></section></>}

        {view==='properties'&&<><Header title="Properties" subtitle="See the status of every property without opening every tenancy." action={<button onClick={()=>setModal('property')} className="px-5 py-3 rounded-lg bg-redline text-white">+ Add property</button>}/><div className="mt-6"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search address or landlord…" className="w-full bg-ink border border-line rounded-lg px-4 py-3"/></div><div className="mt-5 grid gap-3">{filteredProperties.length?filteredProperties.map(p=><PropertyRow key={p.id} p={p} onClick={()=>{setSelected(p.id);setView('property')}}/>):<Empty text="No properties match your search."/ >}</div></>}

        {view==='property'&&selectedProperty&&<PropertyDetail property={selectedProperty} tenancy={selectedTenancy} findings={selectedFindings} actions={selectedActions} onBack={()=>setView('properties')} onAddFinding={()=>setModal('finding')} onAddAction={()=>setModal('action')} onComplete={completeAction} onEvidence={addEvidence} onResolve={closeFinding}/>}
        {view==='property'&&!selectedProperty&&<Empty text="Select a property from the Properties view."/>}

        {view==='tenancies'&&<><Header title="Tenancies" subtitle="Each tenancy has its own compliance file, findings, actions and history."/><div className="mt-6 grid gap-3">{tenancies.length?tenancies.map(t=>{const p=properties.find(x=>x.id===t.propertyId);return <button key={t.id} onClick={()=>{setSelected(p?.id);setView('property')}} className="text-left bg-panel border border-line rounded-xl p-5 hover:border-brass/50"><div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3"><div><p className="text-paper font-medium">{p?.address||'Property'}</p><p className="text-sm text-muted mt-1">{t.tenant} · {money(t.rent)}/month · Started {dateLabel(t.start)}</p></div><div className="flex items-center gap-3"><span className="text-xs text-muted">{t.complete}/{t.requirements||0} requirements recorded</span><Pill status={t.status}/></div></div></button>}):<Empty text="No tenancies yet."/ >}</div></>}

        {view==='actions'&&<><Header title="Actions" subtitle="ClearSign identifies what may need doing. The agent decides whether and how to complete it." action={<button onClick={()=>setModal('action')} className="px-5 py-3 rounded-lg bg-redline text-white">+ Add action</button>}/><div className="mt-6 grid gap-3">{openActions.length?openActions.map(a=><ActionRow key={a.id} action={a} tenancy={tenancies.find(t=>t.id===a.tenancyId)} onComplete={completeAction} onEvidence={addEvidence}/>):<Empty text="No open actions."/ >}</div><h2 className="text-xl mt-10 mb-4">Completed</h2><div className="grid gap-3">{actions.filter(a=>a.status==='done').map(a=><ActionRow key={a.id} action={a} tenancy={tenancies.find(t=>t.id===a.tenancyId)} done/>)}</div></>}

        {view==='reports'&&<><Header title="Reports" subtitle="Generate a simple record of what ClearSign checked and what the agent recorded."/><div className="mt-6 grid md:grid-cols-2 gap-4"><ReportCard title="Portfolio status report" desc="A snapshot of properties by status and open actions." onClick={()=>window.print()}/><ReportCard title="Tenancy review record" desc="Use a tenancy's property page to review findings, sources and actions before printing." onClick={()=>{setView('properties');flash('Choose a property to review and print')}}/></div><div className="mt-6 bg-panel border border-line rounded-xl p-6"><p className="text-xs uppercase tracking-widest text-brass">Accuracy note</p><p className="text-sm text-muted mt-2">Reports record ClearSign's findings and the information available at the time. They do not certify legal compliance or replace professional advice.</p></div></>}

        {view==='history'&&<><Header title="History" subtitle="An audit trail of important changes made inside this workspace."/><div className="mt-6 bg-panel border border-line rounded-xl divide-y divide-line">{data.events?.length?data.events.slice().reverse().map(e=><div key={e.id} className="p-5 flex justify-between gap-4"><p className="text-sm">{e.text}</p><p className="text-xs text-muted whitespace-nowrap">{new Date(e.at).toLocaleString('en-GB')}</p></div>):<div className="p-8"><Empty text="No history yet."/></div>}</div></>}

        <div className="mt-10 text-sm"><Link href="/for-agents" className="text-muted hover:text-paper">← Agent information & pricing</Link></div>
      </main>
    </div>
  </div><Footer/>
  {modal==='property'&&<Modal title="Add property" onClose={()=>setModal(null)}><form onSubmit={addProperty} className="mt-6 space-y-4"><Field name="address" label="Property address" required/><Field name="landlord" label="Landlord / owner" required/><Field name="tenant" label="Current tenant" required/><div className="grid md:grid-cols-2 gap-4"><Field name="start" label="Tenancy start" type="date" required/><Field name="rent" label="Monthly rent (£)" type="number" required/></div><Submit>Add property</Submit></form></Modal>}
  {modal==='finding'&&selectedTenancy&&<Modal title="Record a finding" onClose={()=>setModal(null)}><form onSubmit={addFinding} className="mt-6 space-y-4"><input type="hidden" name="tenancyId" value={selectedTenancy.id}/><Field name="title" label="What was flagged?" required/><Field name="reason" label="Why was it flagged?" required textarea/><Field name="source" label="Source / guidance checked"/><Field name="next" label="Suggested next step" required textarea/><label className="block text-sm text-muted">Severity<select name="severity" className="w-full mt-1 bg-ink border border-line rounded-lg px-3 py-2 text-paper"><option value="attention">Needs attention</option><option value="problem">Problem</option></select></label><Submit>Record finding</Submit></form></Modal>}
  {modal==='action'&&<Modal title="Create action" onClose={()=>setModal(null)}><form onSubmit={addAction} className="mt-6 space-y-4"><label className="block text-sm text-muted">Tenancy<select name="tenancyId" required className="w-full mt-1 bg-ink border border-line rounded-lg px-3 py-2 text-paper">{tenancies.map(t=><option key={t.id} value={t.id}>{properties.find(p=>p.id===t.propertyId)?.address||t.tenant}</option>)}</select></label><Field name="title" label="Action" required/><Field name="due" label="Due date" type="date" required/><Submit>Create action</Submit></form></Modal>}
  </div>;
}

function Header({title,subtitle,action}){return <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5"><div><p className="text-xs uppercase tracking-widest text-brass">ClearSign for Agents</p><h1 className="text-4xl mt-1">{title}</h1><p className="text-muted mt-3">{subtitle}</p></div>{action}</div>;}
function Empty({text}){return <div className="bg-panel border border-line rounded-xl p-8 text-center text-sm text-muted">{text}</div>;}
function PropertyRow({p,onClick}){return <button onClick={onClick} className="w-full text-left bg-panel border border-line rounded-xl p-5 hover:border-brass/50"><div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div><p className="text-paper font-medium">{p.address}</p><p className="text-sm text-muted mt-1">{p.landlord} · Updated {p.updated}</p></div><Pill status={p.status}/></div></button>;}
function PropertyDetail({property,tenancy,findings,actions,onBack,onAddFinding,onAddAction,onComplete,onEvidence,onResolve}){return <><button onClick={onBack} className="text-sm text-muted hover:text-paper">← Back to properties</button><div className="mt-5"><Header title={property.address} subtitle={tenancy?tenancy.tenant+' · '+money(tenancy.rent)+'/month':'No tenancy recorded'} action={<Pill status={property.status}/>} /></div><div className="mt-8 grid lg:grid-cols-3 gap-4"><Stat label="Findings" value={findings.filter(f=>f.status==='open').length} sub="Open potential issues"/><Stat label="Actions" value={actions.filter(a=>a.status!=='done').length} sub="Still to complete"/><Stat label="Tenancy start" value={dateLabel(tenancy?.start)} /></div><section className="mt-8"><div className="flex justify-between items-center mb-4"><div><p className="text-xs uppercase tracking-widest text-brass">Findings</p><h2 className="text-2xl mt-1">What ClearSign found</h2></div><button onClick={onAddFinding} className="border border-line rounded-lg px-4 py-2 text-sm">+ Finding</button></div>{findings.length?findings.map(f=><div key={f.id} className="bg-panel border border-line rounded-xl p-5 mb-3"><div className="flex justify-between gap-4"><div><div className="flex items-center gap-2"><Pill status={f.severity}/><h3 className="font-medium">{f.title}</h3></div><p className="text-sm text-muted mt-3">{f.reason}</p><div className="mt-4 grid md:grid-cols-2 gap-3 text-xs"><div><span className="text-muted">Source:</span> {f.source}</div><div><span className="text-muted">Source date:</span> {dateLabel(f.sourceDate)}</div></div><p className="text-sm mt-4"><span className="text-muted">Next step:</span> {f.next}</p></div>{f.status==='open'&&<button onClick={()=>onResolve(f.id)} className="text-xs text-muted hover:text-paper whitespace-nowrap">Resolve</button>}</div></div>):<Empty text="No findings recorded for this tenancy."/>}</section><section className="mt-8"><div className="flex justify-between items-center mb-4"><div><p className="text-xs uppercase tracking-widest text-brass">Actions</p><h2 className="text-2xl mt-1">What needs doing</h2></div><button onClick={onAddAction} className="border border-line rounded-lg px-4 py-2 text-sm">+ Action</button></div>{actions.length?actions.map(a=><ActionRow key={a.id} action={a} onComplete={onComplete} onEvidence={onEvidence}/>):<Empty text="No actions recorded yet."/>}</section><section className="mt-8 bg-panel border border-line rounded-xl p-6"><p className="text-xs uppercase tracking-widest text-brass">Compliance file</p><h2 className="text-2xl mt-1">Record what was checked</h2><p className="text-sm text-muted mt-2">Use the findings and actions above to build the tenancy record. Documents and file attachments can be added in the next backend layer.</p></section></>;}
function ActionRow({action,tenancy,onComplete,onEvidence,done}){return <div className="bg-panel border border-line rounded-xl p-5"><div className="flex flex-col md:flex-row md:justify-between gap-4"><div><div className="flex items-center gap-2"><Pill status={done||action.status==='done'?'ok':new Date(action.due)<new Date()?'problem':'attention'}>{done||action.status==='done'?'Done':new Date(action.due)<new Date()?'Overdue':'Open'}</Pill><h3 className="font-medium">{action.title}</h3></div>{tenancy&&<p className="text-sm text-muted mt-2">{tenancy.tenant}</p>}<p className="text-xs text-muted mt-2">Due {dateLabel(action.due)} · Evidence {action.evidence?'recorded':'not recorded'}</p></div>{!done&&action.status!=='done'&&<div className="flex gap-2"><button onClick={()=>onEvidence(action.id)} className="text-xs border border-line rounded-lg px-3 py-2">Record evidence</button><button onClick={()=>onComplete(action.id)} className="text-xs bg-redline text-white rounded-lg px-3 py-2">Mark done</button></div>}</div></div>;}
function ReportCard({title,desc,onClick}){return <div className="bg-panel border border-line rounded-xl p-6"><h2 className="text-xl">{title}</h2><p className="text-sm text-muted mt-2">{desc}</p><button onClick={onClick} className="mt-5 border border-line rounded-lg px-4 py-2 text-sm">Open / print</button></div>;}
function Field({name,label,type='text',required,textarea}){return <label className="block text-sm text-muted">{label}{textarea?<textarea name={name} required={required} rows="3" className="w-full mt-1 bg-ink border border-line rounded-lg px-3 py-2 text-paper"/>:<input name={name} type={type} required={required} className="w-full mt-1 bg-ink border border-line rounded-lg px-3 py-2 text-paper"/>}</label>;}
function Submit({children}){return <button type="submit" className="w-full px-5 py-3 rounded-lg bg-redline text-white font-medium">{children}</button>;}
