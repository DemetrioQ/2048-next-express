// /utils/api.ts
import { fetchWithAuth } from './fetchWithAuth';
import { PublicUser } from 'shared-2048-logic/types/User';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getMe(): Promise<{ user: PublicUser } | null> {
  try {
    const res = await fetchWithAuth(`${backendUrl}/auth/me`, {
      credentials: "include",
      _retry: false
    });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    console.error('getMe error', e);
    return null;
  }
}

export async function login(email: string, password: string) {
  return fetchWithAuth(`${backendUrl}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then(res => res.json());
}

export async function refreshToken() {
  const res = await fetch(`${backendUrl}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Token refresh failed');
  return res.json();
}

export const loginWithOAuth = (
  provider:  'google' | 'github',
  onSuccess?: (user : PublicUser) => void,
  onError?: () => void
) => {
  const width = 500;
  const height = 600;
  const left = window.innerWidth / 2 - width / 2;
  const top = window.innerHeight / 2 - height / 2;

  const popup = window.open(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/${provider}`,
    'oauthPopup',
    `width=${width},height=${height},left=${left},top=${top}`
  );

  if (!popup) {
    onError?.();
    return;
  }

  const handleMessage = async (event: MessageEvent) => {
    console.log(event.origin);
    if (event.origin !== process.env.NEXT_PUBLIC_BACKEND_URL) return;
console.log(event.data?.type)
    if (event.data?.type === 'oauth-success') {
      window.removeEventListener('message', handleMessage);
      try {
        const res = await getMe()
        if (res?.user) {
          onSuccess?.(res.user);
        } else {
          onError?.();
        }
      } catch {
        onError?.();
      }
    }
  };

  window.addEventListener('message', handleMessage);
};


export async function logout() {
  return fetchWithAuth(`${backendUrl}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}
