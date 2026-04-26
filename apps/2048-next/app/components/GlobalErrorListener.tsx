'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

// Catches errors that escape React's render lifecycle:
//   - errors thrown in event handlers / async callbacks
//   - unhandled promise rejections (most common case — `await fetch` that throws)
// React's ErrorBoundary doesn't see any of these, so without this listener
// the user sees nothing while the console fills up.
const GlobalErrorListener = () => {
    useEffect(() => {
        // Dev-only: avoid double-toasting in StrictMode dev re-mounts.
        const seen = new WeakSet<object>();

        const onError = (event: ErrorEvent) => {
            const err = event.error ?? event.message;
            if (typeof err === 'object' && err !== null) {
                if (seen.has(err)) return;
                seen.add(err);
            }
            console.error('[window.error]', err);
            toast.error('Something went wrong. Please try again.');
        };

        const onRejection = (event: PromiseRejectionEvent) => {
            const reason = event.reason;
            if (typeof reason === 'object' && reason !== null) {
                if (seen.has(reason)) return;
                seen.add(reason);
            }
            console.error('[unhandledRejection]', reason);
            toast.error('Something went wrong. Please try again.');
        };

        window.addEventListener('error', onError);
        window.addEventListener('unhandledrejection', onRejection);
        return () => {
            window.removeEventListener('error', onError);
            window.removeEventListener('unhandledrejection', onRejection);
        };
    }, []);

    return null;
};

export default GlobalErrorListener;
