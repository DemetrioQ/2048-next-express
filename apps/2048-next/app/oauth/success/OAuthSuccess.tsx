'use client';

import { useEffect } from 'react';

export default function OAuthSuccess() {
  useEffect(() => {
     const timer = setTimeout(() => {
      if (window.opener) {
        window.opener.postMessage({ type: 'oauth-success' }, window.location.origin);
        window.close();
      }
    }, 500); 

    // window.opener?.postMessage({ type: 'oauth-success' }, process.env.NEXT_PUBLIC_FRONTEND_URL!);
    // window.close();

        return () => clearTimeout(timer);
  }, []);

  return <p>Logging in…</p>;
}
