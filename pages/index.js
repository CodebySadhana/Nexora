import { useState } from 'react';
import { useRouter } from 'next/router';
import { api, setToken } from '../lib/api';

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', full_name: '', org_name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const data = mode === 'login'
        ? await api.post('/api/auth/login', { email: form.email, password: form.password })
        : await api.post('/api/auth/register', { ...form, plan: 'scale' });
      if (data.token) { setToken(data.token); router.push('/dashboard'); }
      else setError(data.error || 'Something went wrong');
    } catch (e) { setError('Network error'); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg,#c9a84c,#8a6f2e)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '20px', fontFamily: 'Instrument Serif', color: '#0e0e0c' }}>N</div>
          <div style={{ fontFamily: 'Instrument Serif', fontSize: '24px', background: 'linear-gradient(135deg,#c9a84c,#e8d5a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Nexora</div>
          <div style={{ color: 'var(--text3)', fontSize: '12px', marginTop: '4px' }}>AI Automation Platform</div>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '28px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg,transparent,var(--gold-dim),transparent)' }}></div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', background: 'var(--surface2)', borderRadius: 'var(--r)', padding: '3px', marginBottom: '24px' }}>
            {['login','register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); }}
                style={{ flex: 1, padding: '7px', borderRadius: 'var(--r)', border: 'none', fontSize: '12px', fontWeight: '500', background: mode === m ? 'var(--surface3)' : 'transparent', color: mode === m ? 'var(--text)' : 'var(--text3)', transition: 'all 0.15s' }}>
                {m === 'login' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          <form onSubmit={handle}>
            {mode === 'register' && (
              <>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '5px' }}>Organization name</label>
                  <input value={form.org_name} onChange={e => setForm({...form, org_name: e.target.value})} placeholder="e.g. Acme Agency" required
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border2)', borderRadius: 'var(--r)', background: 'var(--surface2)', color: 'var(--text)', fontSize: '12px', outline: 'none' }} />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '5px' }}>Full name</label>
                  <input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} placeholder="Your name" required
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border2)', borderRadius: 'var(--r)', background: 'var(--surface2)', color: 'var(--text)', fontSize: '12px', outline: 'none' }} />
                </div>
              </>
            )}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '5px' }}>Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@company.com" required
                style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border2)', borderRadius: 'var(--r)', background: 'var(--surface2)', color: 'var(--text)', fontSize: '12px', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '5px' }}>Password</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" required minLength={8}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border2)', borderRadius: 'var(--r)', background: 'var(--surface2)', color: 'var(--text)', fontSize: '12px', outline: 'none' }} />
            </div>
            {error && <div style={{ background: 'var(--red-bg)', border: '1px solid var(--red)', borderRadius: 'var(--r)', padding: '8px 10px', fontSize: '12px', color: 'var(--red)', marginBottom: '16px' }}>{error}</div>}
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg,#c9a84c,#8a6f2e)', border: 'none', borderRadius: 'var(--r)', color: '#0e0e0c', fontSize: '13px', fontWeight: '600', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign in to Nexora' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
