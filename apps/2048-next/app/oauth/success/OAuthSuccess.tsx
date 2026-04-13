'use client';

import { useEffect } from 'react';

export default function OAuthSuccess() {
  useEffect(() => {
    const channel = new BroadcastChannel('oauth');
    const token = window.location.hash.slice(1);

    if (token) {
      channel.postMessage({ type: 'oauth-token', token });
    } else {
      channel.postMessage({ type: 'oauth-error' });
    }

    channel.close();
    window.close();
  }, []);

  return <p>Logging in…</p>;
}
