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

export async function refreshToken(): Promise<boolean> {
  try {
    const res = await fetch(`${backendUrl}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    // if (!res.ok) throw new Error('Token refresh failed');
    // return res.json();
    return res.ok;
  } catch (err) {
    return false;
  }
}

export const loginWithOAuth = (
  provider: 'google' | 'github',
  onSuccess?: (user: PublicUser) => void,
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

  let messageReceived = false;

  const handleMessage = async (event: MessageEvent) => {
    console.log(event.origin);
    if (event.origin !== process.env.NEXT_PUBLIC_BACKEND_URL) return;

    console.log(event.data?.type);
    if (event.data?.type === 'oauth-success') {
      console.log("success")
      messageReceived = true;
      window.removeEventListener('message', handleMessage);
      setTimeout(async () => {
        try {
          const res = await getMe();
          if (res?.user) {
            onSuccess?.(res.user);
          } else {
            onError?.();
          }
        } catch (err) {
          console.log(err);
          onError?.();
        }
      }, 150); // 50–100ms is usually enough
    }

    if (event.data?.type === 'oauth-error') {
      console.log("Error")
      messageReceived = true;
      window.removeEventListener('message', handleMessage);
      onError?.();
    }
  };

  window.addEventListener('message', handleMessage);

  const checkClosed = setInterval(() => {
    if (popup.closed && !messageReceived) {
      clearInterval(checkClosed);
      window.removeEventListener('message', handleMessage);
      onError?.();
    }
  }, 500);
};


export async function logout() {
  return fetchWithAuth(`${backendUrl}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function changeUserName(newUserName: string) {
  return fetchWithAuth(`${backendUrl}/profile/update-username`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newUserName }),
  }).then(res => res.json());
}

export async function registerUser(data: {
  email: string;
  username: string;
  password: string;
}) {
  const res = await fetch(`${backendUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Registration failed");
  }

  return await res.json(); // expected: { message: 'User registered successfully' }
}


export async function loginUser(credentials: { email: string; password: string }) {
  const res = await fetch(`${backendUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // IMPORTANT: so cookies are included
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Login failed");
  }

  return await res.json(); // expected: { message, user }
}



export async function checkUsernameAvailable(username: string) {
  const res = await fetch(`${backendUrl}/profile/check-username?username=${username}`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Login failed");
  }

  return await res.json();
}


export async function verifyEmail(token: string) {

  const res = await fetch(`${backendUrl}/profile/verify-email?token=${encodeURIComponent(token)}`);

  return res;
}


export async function resendEmailVerification() {

  const res = await fetchWithAuth(`${backendUrl}/profile/resend-verification`, {
    method: 'POST',
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to resend verification email');
  }

  return data;

}



