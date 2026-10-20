/** Same-origin requests go through the Vite dev proxy. */
const baseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly details?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

export type ApiOptions = RequestInit & { token?: string };

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const requestHeaders = new Headers(headers);
  if (token) requestHeaders.set('Authorization', `Bearer ${token}`);
  if (rest.body && !(rest.body instanceof FormData) && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }
  const response = await fetch(`${baseUrl}${normalizedPath}`, { ...rest, headers: requestHeaders });
  const contentType = response.headers.get('content-type') || '';
  const body: unknown = response.status === 204 ? null : contentType.includes('json')
    ? await response.json().catch(() => null)
    : await response.text().catch(() => '');
  if (!response.ok) {
    const object = body && typeof body === 'object' ? body as Record<string, unknown> : null;
    const message = object && typeof object.message === 'string' ? object.message
      : typeof body === 'string' && body.trim() ? body
      : `Request failed (${response.status})`;
    throw new ApiError(response.status, message, body);
  }
  return body as T;
}
