// app/oauth-success/OAuthSuccess.tsx

'use client';

import { useEffect } from 'react';

export default function OAuthSuccess() {
  useEffect(() => {
    console.log(window.opener)
    window.opener?.postMessage({ type: 'oauth-success' }, process.env.NEXT_PUBLIC_FRONTEND_URL!);
    window.close();
  }, []);

  return <p>Logging in…</p>;
}
