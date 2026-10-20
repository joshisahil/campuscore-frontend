import { apiRequest, ApiError, type ApiOptions } from './api';
import { clearSession, readSession } from '../auth/session';
/** For authenticated endpoints. Do not send the JWT to third-party URLs. */
export async function authenticatedRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const session = readSession();
  if (!session) throw new ApiError(401, 'Please sign in again.');
  try { return await apiRequest<T>(path, { ...options, token: session.token }); }
  catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      clearSession();
      // Force the current tab to discard any stale in-memory auth state.
      window.location.assign('/login');
    }
    throw error;
  }
}
