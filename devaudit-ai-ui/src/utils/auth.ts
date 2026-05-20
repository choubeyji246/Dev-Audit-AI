export const MANUAL_AUTH_TOKEN_KEY = 'devAuditManualToken';
export const MANUAL_AUTH_USER_KEY = 'devAuditManualUser';

export const getManualToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(MANUAL_AUTH_TOKEN_KEY);
};

export const setManualToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(MANUAL_AUTH_TOKEN_KEY, token);
};

export const clearManualAuth = (): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(MANUAL_AUTH_TOKEN_KEY);
  window.localStorage.removeItem(MANUAL_AUTH_USER_KEY);
};

export const setManualUser = (user: any): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(MANUAL_AUTH_USER_KEY, JSON.stringify(user));
};

export const getManualUser = (): any | null => {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(MANUAL_AUTH_USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const getAuthHeaders = async (getToken?: () => Promise<string | null>) => {
  const manualToken = getManualToken();
  if (manualToken) {
    return { Authorization: `Bearer ${manualToken}` };
  }

  if (getToken) {
    const clerkToken = await getToken();
    if (clerkToken) {
      return { Authorization: `Bearer ${clerkToken}` };
    }
  }

  return {};
};
