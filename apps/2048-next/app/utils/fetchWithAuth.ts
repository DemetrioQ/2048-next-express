import { refreshToken } from './api';

let isRefreshing = false;
let refreshPromise: Promise<boolean>;
let failedQueue: (() => void)[] = [];

const processQueue = (shouldRetry: boolean) => {
  if (shouldRetry) {
    failedQueue.forEach(cb => cb());
  } else {
    failedQueue = []; // Don't retry, just clear
  }
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

  const res = await doFetch();

  if (res.status !== 401 || init?._retry) {
    return res;
  }

  if (!isRefreshing) {
    isRefreshing = true;
    refreshPromise = refreshToken()
      .then(success => {
        processQueue(success);
        return success;
      })
      .catch(() => {
        processQueue(false);
        return false;
      })
      .finally(() => {
        isRefreshing = false;
      });
  }




  const refreshSucceeded = await refreshPromise;
  processQueue(refreshSucceeded);

  if (!refreshSucceeded) {
    // Optional: you could redirect to login or show an error
    return res; // return the original 401 response
  }

  return new Promise((resolve, reject) => {
    const retryCall = () => {
      doFetch()
        .then(resolve)
        .catch(reject);
    };
    failedQueue.push(retryCall);
    if (!isRefreshing) retryCall(); // edge case: refresh completed fast
  });
}
