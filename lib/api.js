const API = process.env.NEXT_PUBLIC_API_URL || 'https://nexora-psi-pearl.vercel.app';

export const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('nexora_token') : null;
export const setToken = (t) => localStorage.setItem('nexora_token', t);
export const clearToken = () => localStorage.removeItem('nexora_token');

const headers = (extra = {}) => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
});

export const api = {
  get: async (path) => {
    const r = await fetch(`${API}${path}`, { headers: headers() });
    return r.json();
  },
  post: async (path, body) => {
    const r = await fetch(`${API}${path}`, {
      method: 'POST', headers: headers(), body: JSON.stringify(body)
    });
    return r.json();
  },
  patch: async (path, body) => {
    const r = await fetch(`${API}${path}`, {
      method: 'PATCH', headers: headers(), body: JSON.stringify(body)
    });
    return r.json();
  },
};
