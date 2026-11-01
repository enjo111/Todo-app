// apiClient.ts
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const authToken = {
  get: () => document.cookie.split('; ').find(value => value.startsWith('authToken='))?.slice('authToken='.length),
  set: (token: string) => { document.cookie = `authToken=${encodeURIComponent(token)}; Path=/; SameSite=Lax`; },
  clear: () => { document.cookie = 'authToken=; Path=/; Max-Age=0; SameSite=Lax'; },
};

interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: Record<string, unknown> | Array<unknown> | BodyInit | null;
}

async function api<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const token = authToken.get();
  
  const url = `${BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
    ...(options.headers as Record<string, string>),
  };

  // 1. Separate 'body' from the rest of the options to avoid type clashing
  const { body, ...restOptions } = options;

  const config: RequestInit = {
    ...restOptions,
    headers,
  };

  // 2. Safely transform and assign the body to config.body
  if (body && typeof body === 'object' && !(body instanceof Blob || body instanceof FormData || body instanceof URLSearchParams)) {
    config.body = JSON.stringify(body);
  } else if (body) {
    // If it's already a native BodyInit (FormData, Blob, string), cast it safely
    config.body = body as BodyInit;
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = (await response.json().catch(() => null)) as Record<string, unknown> | null;
    throw new Error(((errorData?.message || errorData?.error) as string) || `HTTP error! Status: ${response.status}`);
  }

  if (response.status === 204) return null as T;

  return response.json() as Promise<T>;
}

// 3. Fix the helper methods: 'body' payload types (U) should be decoupled from the response types (T)
export const client = {
  get: <T>(url: string, options?: FetchOptions) => 
    api<T>(url, { ...options, method: 'GET' }),
    
  post: <T, U extends Record<string, unknown> | unknown[] | BodyInit | null | undefined = FetchOptions['body']>(url: string, body?: U, options?: FetchOptions) => 
    api<T>(url, { ...options, method: 'POST', body }),
    
  put: <T, U extends Record<string, unknown> | unknown[] | BodyInit | null | undefined = FetchOptions['body']>(url: string, body?: U, options?: FetchOptions) => 
    api<T>(url, { ...options, method: 'PUT', body }),
    
  delete: <T>(url: string, options?: FetchOptions) => 
    api<T>(url, { ...options, method: 'DELETE' }),
};
