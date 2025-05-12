// /lib/api.ts
import { fetchWithErrorHandling } from './fetchWithErrorHandling';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function login(email: string, password: string) {
  return fetchWithErrorHandling<{ user: User }>(`${backendUrl}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export const loginWithOAuth = (
    provider: string,
    onSuccess?: () => void,
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
  
    // Listen for message from popup
    const handleMessage = async (event: MessageEvent) => {
        // console.log(event);
      if (event.data?.type === 'oauth-success') {
        window.removeEventListener('message', handleMessage);
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, {
            credentials: 'include',
          });
  
          if (res.ok) {
            onSuccess?.();
          } else {
            onError?.();
          }
        } catch (e) {
          onError?.();
        }
      }
    };
  
    window.addEventListener('message', handleMessage);
  };
  

export async function getMe() {
  return fetchWithErrorHandling<{ user: User }>(`${backendUrl}/auth/me`, {
    credentials: 'include',
  });
}



  