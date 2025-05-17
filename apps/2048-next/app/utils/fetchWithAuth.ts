import { refreshToken } from './api';

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;
let failedQueue: (() => void)[] = [];

const processQueue = () => {
  failedQueue.forEach(cb => cb());
  failedQueue = [];
};

export async function fetchWithAuth(
  input: RequestInfo,
  init?: RequestInit & { _retry?: boolean }
): Promise<Response> {
  const doFetch = async () => {
    return fetch(input, {
      ...init,
      credentials: 'include',
    });
  };

  let res = await doFetch();

  if (res.status !== 401 || init?._retry) {
    return res;
  }

  if (!isRefreshing) {
    isRefreshing = true;
    refreshPromise = refreshToken()
      .catch(() => {
        console.error("Refresh token failed");
      })
      .finally(() => {
        isRefreshing = false;
        processQueue();
      });
  }

  await refreshPromise;

  return new Promise((resolve, reject) => {
    const retryCall = () => {
      doFetch()
        .then(resolve)
        .catch(reject);
    };
    failedQueue.push(retryCall);
    if (!isRefreshing) retryCall(); // in case refresh finished instantly
  });
}

