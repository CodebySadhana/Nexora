import { useRouter } from 'next/router';
import { clearToken } from '../lib/api';

const NAV = [
  { group: 'Platform', items: [
    { id: 'dashboard', label: 'Dashboard', icon: '⬡' },
    { id: 'automations', label: 'Automations', icon: '◈', badge: '20' },
    { id: 'logs', label: 'Run Logs', icon: '≡' },
  ]},
  { group: 'Modules', items: [
    { id: 'invoices', label: 'Invoices', icon: '◻' },
    { id: 'leads', label: 'Leads', icon: '◻' },
    { id: 'content', label: 'Content', icon: '◻' },
    { id: 'support', label: 'Support', icon: '◻' },
  ]},
  { group: 'Config', items: [
    { id: 'settings', label: 'Settings', icon: '◻' },
  ]},
];

export default function Sidebar({ active }) {
  const router = useRouter();

  return (
    <aside style={{ width: '210px', minWidth: '210px', background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Logo */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '9px' }}>
        <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg,#c9a84c,#8a6f2e)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Instrument Serif', fontSize: '14px', color: '#0e0e0c', flexShrink: 0 }}>N</div>
        <span style={{ fontFamily: 'Instrument Serif', fontSize: '17px', background: 'linear-gradient(135deg,#c9a84c,#e8d5a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Nexora</span>
        <span style={{ fontSize: '10px', fontWeight: '500', color: 'var(--text3)', background: 'var(--surface2)', padding: '1px 6px', borderRadius: '4px', marginLeft: 'auto' }}>v1.0</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px', overflowY: 'auto' }}>
        {NAV.map(group => (
          <div key={group.group}>
            <div style={{ fontSize: '9px', fontWeight: '600', color: 'var(--text3)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 8px 4px' }}>{group.group}</div>
            {group.items.map(item => (
              <div key={item.id} onClick={() => router.push(`/dashboard?tab=${item.id}`)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', borderRadius: 'var(--r)', cursor: 'pointer', color: active === item.id ? 'var(--gold)' : 'var(--text2)', fontSize: '12px', marginBottom: '1px', background: active === item.id ? 'var(--gold-bg)' : 'transparent', border: active === item.id ? '1px solid var(--gold-dim)' : '1px solid transparent', transition: 'all 0.12s' }}>
                <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>{item.icon}</span>
                {item.label}
                {item.badge && <span style={{ marginLeft: 'auto', background: 'var(--surface3)', color: 'var(--text3)', fontSize: '9px', fontWeight: '600', padding: '1px 6px', borderRadius: '8px' }}>{item.badge}</span>}
              </div>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '10px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', borderRadius: 'var(--r)', background: 'var(--surface2)', cursor: 'pointer' }}
          onClick={() => { clearToken(); router.push('/'); }}>
          <div style={{ width: '26px', height: '26px', background: 'linear-gradient(135deg,#c9a84c,#8a6f2e)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: '#0e0e0c', flexShrink: 0 }}>SA</div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '500' }}>Sadhna A.</div>
            <div style={{ fontSize: '10px', color: 'var(--gold)', opacity: 0.8 }}>Scale Plan</div>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--text3)' }}>↩</span>
        </div>
      </div>
    </aside>
  );
}
