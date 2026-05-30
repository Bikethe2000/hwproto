const STORAGE_TOKEN_KEY = 'hwproto_access_token';

const hasBrowser = typeof window !== 'undefined';

const getToken = () => (hasBrowser ? window.localStorage.getItem(STORAGE_TOKEN_KEY) : null);
const setToken = (t) => { if (hasBrowser) window.localStorage.setItem(STORAGE_TOKEN_KEY, t); };
const clearToken = () => { if (hasBrowser) window.localStorage.removeItem(STORAGE_TOKEN_KEY); };

// Base URL can be configured at build/deploy time via VITE_API_BASE_URL.
const RAW_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ? import.meta.env.VITE_API_BASE_URL : '';
const BASE = RAW_BASE ? RAW_BASE.replace(/\/$/, '') : '';
const apiRoot = BASE ? `${BASE}/api` : '/api';

const apiFetch = async (path, opts = {}) => {
  const token = getToken();
  const headers = opts.headers || {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${apiRoot}${path}`, { ...opts, headers });
  const text = await res.text();

  if (!res.ok) {
    const contentType = res.headers.get('content-type') || '';
    let message = text;
    if (contentType.includes('application/json')) {
      try {
        const errorData = JSON.parse(text);
        message = errorData?.error || errorData?.message || text;
      } catch {
        message = text;
      }
    }
    const error = new Error(message || `API error ${res.status}`);
    error.status = res.status;
    throw error;
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error(`Invalid JSON response from ${path}: ${err.message}`);
  }
};

const createEntity = (name) => ({
  list: async (sort, limit) => apiFetch(`/entities/${name}/list?sort=${sort || ''}&limit=${limit || ''}`),
  filter: async (filters) => apiFetch(`/entities/${name}/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters)
  }),
  create: async (data) => apiFetch(`/entities/${name}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  update: async (id, data) => apiFetch(`/entities/${name}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  delete: async (id) => apiFetch(`/entities/${name}/${id}`, {
    method: 'DELETE'
  }),
  get: async (id) => apiFetch(`/entities/${name}/${id}`)
});

const api = {
  auth: {
    me: async () => apiFetch('/auth/me'),
    loginViaEmailPassword: async (email, password) => {
      const data = await apiFetch('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      if (data.access_token) setToken(data.access_token);
      return data;
    },
    loginWithProvider: (provider, redirectUrl = '/') => {
      const baseRoot = BASE ? BASE.replace(/\/$/, '') : '';
      window.location.href = `${baseRoot}/api/auth/provider/${provider}?redirect=${encodeURIComponent(redirectUrl)}`;
    },
    register: async ({ email, password, name }) => {
      const data = await apiFetch('/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, name }) });
      if (data.access_token) setToken(data.access_token);
      return data;
    },
    verifyOtp: async () => ({}),
    setToken: (t) => setToken(t),
    resendOtp: async () => ({}),
    resetPasswordRequest: async () => ({}),
    resetPassword: async () => ({}),
    createAdmin: async ({ email, name }) => apiFetch('/auth/create-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name })
    }),
    logout: (redirectUrl) => { clearToken(); if (redirectUrl) window.location.href = redirectUrl; },
    redirectToLogin: (returnUrl) => { window.location.href = `/login?from=${encodeURIComponent(returnUrl || window.location.pathname)}`; },
  },
  entities: new Proxy({}, {
    get(target, prop) {
      if (!target[prop]) target[prop] = createEntity(prop.toString());
      return target[prop];
    }
  }),
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch(`${apiRoot}/uploads`, { method: 'POST', body: fd });
        if (!res.ok) throw new Error('upload failed');
        return res.json();
      },
      SendEmail: async ({ to, subject, body, html, from_name }) => {
        const res = await fetch(`${apiRoot}/send-email`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to, subject, body, html, from_name }) });
        if (!res.ok) throw new Error('send email failed');
        return res.json();
      },
      InvokeLLM: async () => ({ text: '' }),
    }
  }
};

export { api };
