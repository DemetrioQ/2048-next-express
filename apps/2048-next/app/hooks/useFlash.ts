'use client';
import { useEffect, useRef, useState } from 'react';

export function useFlash(value: unknown, durationMs = 250): boolean {
    const [flashing, setFlashing] = useState(false);
    const isFirstRef = useRef(true);

    useEffect(() => {
        if (isFirstRef.current) {
            isFirstRef.current = false;
            return;
        }
        setFlashing(true);
        const id = setTimeout(() => setFlashing(false), durationMs);
        return () => clearTimeout(id);
    }, [value, durationMs]);

    return flashing;
}
