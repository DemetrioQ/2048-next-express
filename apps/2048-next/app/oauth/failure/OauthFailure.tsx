'use client';
import { useEffect } from 'react';


export default function OAuthFailure() {
  useEffect(() => {
    console.log(window.opener)
    window.opener?.postMessage({ type: 'oauth-error' }, process.env.NEXT_PUBLIC_FRONTEND_URL!);
    window.close();
  }, []);

  return <p>Login failed or was canceled.</p>;
}
