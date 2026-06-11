import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import { api, getToken } from '../lib/api';

// ── STYLES ──
const s = {
  layout: { display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' },
  topbar: { background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '0 22px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 },
  content: { flex: 1, overflowY: 'auto', padding: '20px 22px' },
  btn: { display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: 'var(--r)', fontSize: '12px', fontWeight: '500', cursor: 'pointer', border: '1px solid var(--border2)', background: 'var(--surface2)', color: 'var(--text2)', transition: 'all 0.12s' },
  btnGold: { background: 'linear-gradient(135deg,#c9a84c,#8a6f2e)', color: '#0e0e0c', border: 'none', fontWeight: '600' },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--rl)', padding: '14px 16px', position: 'relative', overflow: 'hidden' },
  pill: (color, bg) => ({ display: 'inline-flex', alignItems: 'center', padding: '2px 7px', borderRadius: '8px', fontSize: '10px', fontWeight: '600', color, background: bg }),
  input: { width: '100%', padding: '8px 10px', border: '1px solid var(--border2)', borderRadius: 'var(--r)', background: 'var(--surface2)', color: 'var(--text)', fontSize: '12px', outline: 'none', fontFamily: 'DM Sans,sans-serif' },
  label: { display: 'block', fontSize: '10px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '5px' },
};

const TABS = { dashboard: 'Dashboard', automations: 'Automations', logs: 'Run Logs', invoices: 'Invoices', leads: 'Leads', content: 'Content Engine', support: 'Support', settings: 'Settings' };

const AUTOMATIONS = [
  {name:"Invoice follow-up",desc:"Sends reminders at 3, 7, 14 days",status:"active",runs:2103,pct:98,color:"#c9a84c"},
  {name:"Email categorization",desc:"Labels inbound emails by type",status:"active",runs:1820,pct:99,color:"#4caf7d"},
  {name:"PDF extraction",desc:"OCR + AI field extraction",status:"active",runs:412,pct:94,color:"#e0a84c"},
  {name:"Meeting summaries",desc:"Transcribes + extracts actions",status:"active",runs:289,pct:97,color:"#9a6cd6"},
  {name:"Podcast repurposing",desc:"Episodes → social posts",status:"paused",runs:134,pct:96,color:"#4caf7d"},
  {name:"Lead generation",desc:"Scrapes + enriches contacts",status:"active",runs:567,pct:91,color:"#e06c4c"},
  {name:"Blog generation",desc:"Keyword → outline → draft",status:"active",runs:201,pct:93,color:"#5a9ae0"},
  {name:"Spreadsheet cleanup",desc:"Normalizes data + formulas",status:"paused",runs:88,pct:89,color:"#7ac94c"},
  {name:"Contract analysis",desc:"Extracts + flags risk clauses",status:"active",runs:156,pct:95,color:"#b06cd6"},
  {name:"Research outlines",desc:"Web research + citations",status:"active",runs:244,pct:96,color:"#5a7ae0"},
  {name:"Email drafting",desc:"Detects intent + drafts replies",status:"active",runs:1820,pct:98,color:"#e05a5a"},
  {name:"Transaction categorization",desc:"Matches merchants + flags anomalies",status:"paused",runs:320,pct:97,color:"#888880"},
  {name:"Support chatbot",desc:"Responds + escalates if needed",status:"active",runs:932,pct:94,color:"#4caf8d"},
  {name:"Fraud screening",desc:"Risk scores + anomaly detection",status:"active",runs:445,pct:99,color:"#e05a6a"},
  {name:"Scheduling assistant",desc:"Reads calendar + sends slots",status:"active",runs:678,pct:97,color:"#5aaae0"},
  {name:"Legal research",desc:"Precedents + risk summaries",status:"paused",runs:77,pct:92,color:"#d4a84c"},
  {name:"Clerical automation",desc:"Maps + syncs records",status:"paused",runs:190,pct:96,color:"#707068"},
  {name:"Media recaps",desc:"Stats + engagement publishing",status:"paused",runs:63,pct:90,color:"#b06cd6"},
  {name:"SEO generation",desc:"Keyword → optimized copy",status:"active",runs:308,pct:94,color:"#4caf5a"},
  {name:"Real estate listings",desc:"Descriptions + autoresponders",status:"active",runs:142,pct:97,color:"#e0844c"},
];

export default function Dashboard() {
  const router = useRouter();
  const tab = router.query.tab || 'dashboard';
  const [stats, setStats] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [leads, setLeads] = useState([]);
  const [logs, setLogs] = useState([]);
  const [content, setContent] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [runOutput, setRunOutput] = useState('');
  const [runLoading, setRunLoading] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({ customer_name:'', customer_email:'', invoice_number:'', amount:'', due_date:'' });
  const [contentForm, setContentForm] = useState({ platform:'blog', topic:'', tone:'professional', word_count_target:'medium' });
  const [supportForm, setSupportForm] = useState({ customer_email:'', subject:'', query:'' });

  useEffect(() => {
    if (!getToken()) { router.push('/'); return; }
    loadData();
  }, [tab]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const loadData = async () => {
    setLoading(true);
    try {
      if (tab === 'dashboard') {
        const s = await api.get('/api/data/stats');
        setStats(s);
      }
      if (tab === 'invoices') {
        const d = await api.get('/api/data/invoices');
        setInvoices(d.invoices || []);
      }
      if (tab === 'leads') {
        const d = await api.get('/api/data/leads');
        setLeads(d.leads || []);
      }
      if (tab === 'logs') {
        const d = await api.get('/api/automations/logs');
        setLogs(d.logs || []);
      }
      if (tab === 'content') {
        const d = await api.get('/api/data/content');
        setContent(d.posts || []);
      }
      if (tab === 'support') {
        const d = await api.get('/api/data/support');
        setTickets(d.tickets || []);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const runInvoice = async (inv) => {
    setRunLoading(true);
    const r = await api.post('/api/automations/invoice/run', {
      customer_email: inv.customer_email,
      customer_name: inv.customer_name,
      invoice_id: inv.invoice_number,
      amount: Number(inv.amount),
      days_overdue: inv.days_overdue || 7,
      due_date: inv.due_date,
    });
    setRunLoading(false);
    showToast(r.success ? `Reminder sent to ${inv.customer_email}!` : `Error: ${r.error}`);
    loadData();
  };

  const generateContent = async (e) => {
    e.preventDefault();
    setRunLoading(true);
    const r = await api.post('/api/data/content/generate', contentForm);
    setRunLoading(false);
    if (r.post) { showToast('Content generated!'); loadData(); }
    else showToast(`Error: ${r.error}`);
  };

  const createInvoice = async (e) => {
    e.preventDefault();
    const r = await api.post('/api/data/invoices', { ...invoiceForm, amount: Number(invoiceForm.amount) });
    if (r.invoice) { showToast('Invoice created!'); setInvoiceForm({ customer_name:'', customer_email:'', invoice_number:'', amount:'', due_date:'' }); loadData(); }
    else showToast(`Error: ${r.error}`);
  };

  const submitSupport = async (e) => {
    e.preventDefault();
    setRunLoading(true);
    const r = await api.post('/api/data/support', supportForm);
    setRunLoading(false);
    if (r.ticket) { showToast('AI responded to ticket!'); setSupportForm({ customer_email:'', subject:'', query:'' }); loadData(); }
    else showToast(`Error: ${r.error}`);
  };

  const runMeeting = async () => {
    setRunLoading(true);
    const r = await api.post('/api/automations/meeting/run', {
      meeting_title: 'Strategy Review',
      meeting_date: new Date().toISOString().split('T')[0],
      attendees: 'Sadhna, Alex',
      transcript: 'Sadhna: We need to finalize pricing by next week. Alex: I will prepare the competitor analysis by Friday. Sadhna: Also schedule a demo for TechCorp.',
    });
    setRunLoading(false);
    setRunOutput(r.result?.ai_response || JSON.stringify(r, null, 2));
    showToast('Meeting summary generated!');
  };

  // ── RENDER PANELS ──
  const renderDashboard = () => (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'Tasks automated', value: stats?.tasks?.total?.toLocaleString() || '—', delta: `${stats?.tasks?.success_rate || 0}% success rate` },
          { label: 'Active workflows', value: '14', delta: '6 paused' },
          { label: 'Overdue invoices', value: stats?.invoices?.overdue || '—', delta: `$${stats?.invoices?.total_overdue_amount?.toLocaleString() || 0} outstanding` },
          { label: 'Support tickets', value: stats?.support?.total || '—', delta: `${stats?.support?.ai_resolved || 0} AI-resolved` },
        ].map(m => (
          <div key={m.label} style={{ ...s.card }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg,transparent,#8a6f2e,transparent)' }}></div>
            <div style={{ fontSize: '10px', fontWeight: '500', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>{m.label}</div>
            <div style={{ fontSize: '24px', fontWeight: '300', fontFamily: 'Instrument Serif', letterSpacing: '-0.5px' }}>{loading ? '...' : m.value}</div>
            <div style={{ fontSize: '10px', color: 'var(--green)', marginTop: '5px' }}>{m.delta}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={s.card}>
          <div style={{ fontSize: '11px', fontWeight: '600', marginBottom: '12px' }}>Top modules</div>
          {[['Invoice follow-up','82%','#c9a84c'],['Email categorization','67%','#5a9ae0'],['Meeting summaries','54%','#9a6cd6'],['Lead generation','39%','#e0a84c']].map(([name, pct, color]) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text2)', width: '130px', flexShrink: 0 }}>{name}</span>
              <div style={{ flex: 1, height: '4px', background: 'var(--surface3)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: pct, background: color, borderRadius: '2px' }}></div>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text3)', width: '26px', textAlign: 'right' }}>{pct}</span>
            </div>
          ))}
        </div>
        <div style={s.card}>
          <div style={{ fontSize: '11px', fontWeight: '600', marginBottom: '12px' }}>Quick actions</div>
          {[
            ['Run invoice follow-ups', () => { router.push('/dashboard?tab=invoices'); showToast('Go to Invoices → Send all reminders'); }],
            ['Generate blog post', () => router.push('/dashboard?tab=content')],
            ['Run meeting summary', runMeeting],
            ['View run logs', () => router.push('/dashboard?tab=logs')],
          ].map(([label, fn]) => (
            <button key={label} onClick={fn} style={{ ...s.btn, width: '100%', justifyContent: 'flex-start', marginBottom: '6px', fontSize: '11px' }}>
              ▷ {label}
            </button>
          ))}
          {runOutput && (
            <div style={{ marginTop: '10px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '10px', fontSize: '11px', color: 'var(--text2)', maxHeight: '120px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
              {runOutput}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAutomations = () => (
    <div>
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '12px', fontWeight: '600' }}>All automations</div>
        <div style={{ fontSize: '10px', color: 'var(--text3)', marginTop: '2px' }}>20 modules · 14 active · 6 paused</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px' }}>
        {AUTOMATIONS.map(a => (
          <div key={a.name} style={{ ...s.card, cursor: 'pointer' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.status === 'active' ? 'var(--green)' : 'var(--text3)', marginBottom: '8px' }}></div>
            <div style={{ fontSize: '11px', fontWeight: '600', marginBottom: '2px', color: 'var(--text)' }}>{a.name}</div>
            <div style={{ fontSize: '10px', color: 'var(--text3)', marginBottom: '8px' }}>{a.desc}</div>
            <div style={{ fontSize: '10px', color: 'var(--text3)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: a.status === 'active' ? 'var(--green)' : 'var(--text3)' }}>{a.status}</span>
              <span>{a.runs.toLocaleString()} runs</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLogs = () => (
    <div>
      <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '14px' }}>Run logs</div>
      {loading ? <div style={{ color: 'var(--text3)', fontSize: '12px' }}>Loading...</div> :
        logs.length === 0 ? <div style={{ color: 'var(--text3)', fontSize: '12px', padding: '20px', textAlign: 'center' }}>No runs yet. Trigger an automation to see logs here.</div> :
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--rl)', overflow: 'hidden' }}>
          {logs.map((l, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 14px', borderBottom: i < logs.length-1 ? '1px solid var(--border)' : 'none', fontSize: '11px' }}>
              <span style={{ fontSize: '9px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px', flexShrink: 0, background: l.status === 'success' ? 'var(--green-bg)' : l.status === 'error' ? 'var(--red-bg)' : 'var(--amber-bg)', color: l.status === 'success' ? 'var(--green)' : l.status === 'error' ? 'var(--red)' : 'var(--amber)' }}>{l.status?.toUpperCase()}</span>
              <span style={{ color: 'var(--text3)', flexShrink: 0, fontFamily: 'DM Mono,monospace', fontSize: '10px' }}>{new Date(l.created_at).toLocaleTimeString()}</span>
              <span style={{ flex: 1, color: 'var(--text2)' }}>{l.workflow_name} — {l.error_message || 'Completed successfully'}</span>
            </div>
          ))}
        </div>
      }
    </div>
  );

  const renderInvoices = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600' }}>Invoices</div>
          <div style={{ fontSize: '10px', color: 'var(--text3)', marginTop: '2px' }}>Auto-reminders at 3, 7, 14 days overdue</div>
        </div>
        <button style={{ ...s.btn, ...s.btnGold, fontSize: '11px' }} onClick={async () => {
          const r = await api.post('/api/automations/invoice/run-all', {});
          showToast(r.triggered ? `${r.succeeded}/${r.triggered} reminders sent!` : r.message || 'No overdue invoices');
        }}>Send all reminders</button>
      </div>

      {/* Add invoice form */}
      <form onSubmit={createInvoice} style={{ ...s.card, marginBottom: '14px' }}>
        <div style={{ fontSize: '11px', fontWeight: '600', marginBottom: '12px' }}>Add invoice</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '8px' }}>
          {[['Customer name','customer_name','text'],['Email','customer_email','email'],['Invoice #','invoice_number','text'],['Amount','amount','number'],['Due date','due_date','date']].map(([ph,key,type]) => (
            <div key={key}>
              <label style={s.label}>{ph}</label>
              <input type={type} placeholder={ph} value={invoiceForm[key]} onChange={e => setInvoiceForm({...invoiceForm, [key]: e.target.value})} required style={s.input} />
            </div>
          ))}
        </div>
        <button type="submit" style={{ ...s.btn, ...s.btnGold, marginTop: '10px', fontSize: '11px' }}>+ Add invoice</button>
      </form>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--rl)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>{['Client','Invoice #','Amount','Due date','Status',''].map(h => <th key={h} style={{ fontSize: '9px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '8px 14px', background: 'var(--surface2)', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>{h}</th>)}</tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: 'var(--text3)', fontSize: '12px' }}>Loading...</td></tr> :
            invoices.length === 0 ? <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: 'var(--text3)', fontSize: '12px' }}>No invoices yet. Add one above.</td></tr> :
            invoices.map(inv => (
              <tr key={inv.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '9px 14px', fontSize: '11px', color: 'var(--text)', fontWeight: '500' }}>{inv.customer_name}</td>
                <td style={{ padding: '9px 14px', fontSize: '10px', fontFamily: 'DM Mono,monospace', color: 'var(--text2)' }}>{inv.invoice_number}</td>
                <td style={{ padding: '9px 14px', fontSize: '11px', fontWeight: '500', color: 'var(--text)' }}>${Number(inv.amount).toLocaleString()}</td>
                <td style={{ padding: '9px 14px', fontSize: '11px', color: 'var(--text2)' }}>{inv.due_date}</td>
                <td style={{ padding: '9px 14px' }}><span style={s.pill(inv.status === 'paid' ? 'var(--green)' : inv.status === 'overdue' ? 'var(--red)' : 'var(--amber)', inv.status === 'paid' ? 'var(--green-bg)' : inv.status === 'overdue' ? 'var(--red-bg)' : 'var(--amber-bg)')}>{inv.status}</span></td>
                <td style={{ padding: '9px 14px' }}><button style={{ ...s.btn, fontSize: '10px', padding: '3px 8px' }} disabled={runLoading} onClick={() => runInvoice(inv)}>Send reminder</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderLeads = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ fontSize: '12px', fontWeight: '600' }}>Lead pipeline</div>
        <button style={{ ...s.btn, ...s.btnGold, fontSize: '11px' }} onClick={async () => {
          const r = await api.post('/api/data/leads', { company_name: 'New Lead', contact_name: 'Unknown', stage: 'scraped', lead_score: 50 });
          if (r.lead) { showToast('Lead added!'); loadData(); }
        }}>+ Add lead</button>
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--rl)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>{['Company','Contact','Role','Source','Stage','Score'].map(h => <th key={h} style={{ fontSize: '9px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '8px 14px', background: 'var(--surface2)', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>{h}</th>)}</tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: 'var(--text3)', fontSize: '12px' }}>Loading...</td></tr> :
            leads.length === 0 ? <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: 'var(--text3)', fontSize: '12px' }}>No leads yet.</td></tr> :
            leads.map(l => (
              <tr key={l.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '9px 14px', fontSize: '11px', color: 'var(--text)', fontWeight: '500' }}>{l.company_name}</td>
                <td style={{ padding: '9px 14px', fontSize: '11px', color: 'var(--text2)' }}>{l.contact_name}</td>
                <td style={{ padding: '9px 14px', fontSize: '11px', color: 'var(--text2)' }}>{l.role}</td>
                <td style={{ padding: '9px 14px', fontSize: '11px', color: 'var(--text2)' }}>{l.source}</td>
                <td style={{ padding: '9px 14px' }}><span style={s.pill('var(--blue)','var(--blue-bg)')}>{l.stage}</span></td>
                <td style={{ padding: '9px 14px', fontSize: '11px', color: 'var(--gold)', fontWeight: '600' }}>{l.lead_score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '12px' }}>Generate content</div>
          <form onSubmit={generateContent} style={s.card}>
            <div style={{ marginBottom: '12px' }}>
              <label style={s.label}>Content type</label>
              <select value={contentForm.platform} onChange={e => setContentForm({...contentForm, platform: e.target.value})} style={s.input}>
                {['blog','linkedin','twitter','seo','email','listing'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={s.label}>Topic / keyword</label>
              <input value={contentForm.topic} onChange={e => setContentForm({...contentForm, topic: e.target.value})} placeholder="e.g. AI automation for SMBs" required style={s.input} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={s.label}>Tone</label>
              <select value={contentForm.tone} onChange={e => setContentForm({...contentForm, tone: e.target.value})} style={s.input}>
                {['professional','casual','educational','persuasive'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <button type="submit" disabled={runLoading} style={{ ...s.btn, ...s.btnGold, width: '100%', justifyContent: 'center', fontSize: '12px' }}>
              {runLoading ? 'Generating...' : '✦ Generate with AI'}
            </button>
          </form>
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '12px' }}>Generated content</div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--rl)', overflow: 'hidden' }}>
            {loading ? <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text3)', fontSize: '12px' }}>Loading...</div> :
            content.length === 0 ? <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text3)', fontSize: '12px' }}>Generate content to see it here.</div> :
            content.slice(0,5).map(p => (
              <div key={p.id} style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={s.pill('var(--blue)','var(--blue-bg)')}>{p.platform}</span>
                <span style={{ fontSize: '11px', color: 'var(--text)', flex: 1 }}>{p.title}</span>
                <span style={{ fontSize: '10px', color: 'var(--text3)' }}>{p.word_count}w</span>
                <span style={s.pill(p.status === 'published' ? 'var(--green)' : 'var(--amber)', p.status === 'published' ? 'var(--green-bg)' : 'var(--amber-bg)')}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSupport = () => (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '12px' }}>Submit query</div>
          <form onSubmit={submitSupport} style={s.card}>
            <div style={{ marginBottom: '12px' }}>
              <label style={s.label}>Customer email</label>
              <input type="email" value={supportForm.customer_email} onChange={e => setSupportForm({...supportForm, customer_email: e.target.value})} placeholder="customer@company.com" required style={s.input} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={s.label}>Subject</label>
              <input value={supportForm.subject} onChange={e => setSupportForm({...supportForm, subject: e.target.value})} placeholder="Issue summary" style={s.input} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={s.label}>Query</label>
              <textarea value={supportForm.query} onChange={e => setSupportForm({...supportForm, query: e.target.value})} placeholder="Describe the issue..." required rows={4} style={{ ...s.input, resize: 'vertical' }} />
            </div>
            <button type="submit" disabled={runLoading} style={{ ...s.btn, ...s.btnGold, width: '100%', justifyContent: 'center' }}>
              {runLoading ? 'AI is responding...' : '✦ Submit & AI respond'}
            </button>
          </form>
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '12px' }}>Tickets</div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--rl)', overflow: 'hidden' }}>
            {loading ? <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text3)', fontSize: '12px' }}>Loading...</div> :
            tickets.length === 0 ? <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text3)', fontSize: '12px' }}>No tickets yet.</div> :
            tickets.map(t => (
              <div key={t.id} style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '10px', color: 'var(--gold)' }}>{t.ticket_number}</span>
                  <span style={s.pill(t.status === 'resolved' ? 'var(--green)' : t.status === 'escalated' ? 'var(--amber)' : 'var(--blue)', t.status === 'resolved' ? 'var(--green-bg)' : t.status === 'escalated' ? 'var(--amber-bg)' : 'var(--blue-bg)')}>{t.status}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text2)' }}>{t.query?.slice(0,80)}...</div>
                {t.response && <div style={{ fontSize: '10px', color: 'var(--text3)', marginTop: '4px', fontStyle: 'italic' }}>AI: {t.response?.slice(0,100)}...</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div style={{ maxWidth: '500px' }}>
      <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '14px' }}>Settings</div>
      <div style={s.card}>
        <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '14px', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>Organization</div>
        <div style={{ marginBottom: '12px' }}><label style={s.label}>Organization name</label><input defaultValue="Nexora (Sadhna's workspace)" style={s.input} /></div>
        <div style={{ marginBottom: '12px' }}><label style={s.label}>Admin email</label><input defaultValue="sadhna@nexora.io" style={s.input} /></div>
        <div style={{ marginBottom: '16px' }}><label style={s.label}>Plan</label>
          <select style={s.input}><option>Scale — $1,000/month</option><option>Growth — $750/month</option></select>
        </div>
        <div style={{ marginBottom: '12px' }}><label style={s.label}>API Base URL</label><input defaultValue="https://nexora-psi-pearl.vercel.app" style={{ ...s.input, fontFamily: 'DM Mono,monospace', fontSize: '11px' }} /></div>
        <button style={{ ...s.btn, ...s.btnGold }} onClick={() => showToast('Settings saved!')}>Save changes</button>
      </div>
    </div>
  );

  const PANELS = { dashboard: renderDashboard, automations: renderAutomations, logs: renderLogs, invoices: renderInvoices, leads: renderLeads, content: renderContent, support: renderSupport, settings: renderSettings };

  return (
    <>
      <Head><title>Nexora — {TABS[tab] || 'Dashboard'}</title></Head>
      <div style={s.layout}>
        <Sidebar active={tab} />
        <main style={s.main}>
          <header style={s.topbar}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontFamily: 'Instrument Serif', fontSize: '18px', background: 'linear-gradient(135deg,var(--text),var(--text2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{TABS[tab] || 'Dashboard'}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--green)' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }}></span>Live
              </span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button style={s.btn} onClick={() => router.push('/dashboard?tab=logs')}>View logs</button>
              <button style={{ ...s.btn, ...s.btnGold }} onClick={() => router.push('/dashboard?tab=invoices')}>+ New automation</button>
            </div>
          </header>
          <div style={s.content}>
            {(PANELS[tab] || renderDashboard)()}
          </div>
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', background: 'var(--surface2)', border: '1px solid var(--gold-dim)', color: 'var(--gold)', padding: '10px 14px', borderRadius: 'var(--r)', fontSize: '12px', fontWeight: '500', zIndex: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
          ✓ {toast}
        </div>
      )}
    </>
  );
}
