'use client';

import { useEffect } from 'react';
import { getMe } from '@/utils/api';

export default function OAuthSuccess() {
  useEffect(() => {
    const channel = new BroadcastChannel('oauth');

    getMe()
      .then((data) => {
        if (data?.user) {
          channel.postMessage({ type: 'oauth-success', user: data.user });
        } else {
          channel.postMessage({ type: 'oauth-error' });
        }
      })
      .catch(() => {
        channel.postMessage({ type: 'oauth-error' });
      })
      .finally(() => {
        channel.close();
        window.close();
      });
  }, []);

  return <p>Logging in…</p>;
}
