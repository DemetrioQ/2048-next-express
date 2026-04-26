'use client';
import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface AnimatedNumberProps {
    value: number;
    durationMs?: number;
}

const AnimatedNumber = ({ value, durationMs = 250 }: AnimatedNumberProps) => {
    const [display, setDisplay] = useState(value);
    // Tracks the value currently on screen. Updated on every tick so that when
    // a new `value` arrives mid-animation, the next animation starts from where
    // we actually are — not from the old animation's start point (which would
    // make the number visibly jump backward).
    const displayRef = useRef(value);
    const reducedMotion = usePrefersReducedMotion();

    useEffect(() => {
        const from = displayRef.current;
        const to = value;
        if (from === to) {
            setDisplay(to);
            return;
        }
        if (reducedMotion) {
            setDisplay(to);
            displayRef.current = to;
            return;
        }
        const start = performance.now();
        let raf = 0;
        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / durationMs);
            const eased = 1 - Math.pow(1 - t, 3);
            const next = Math.round(from + (to - from) * eased);
            setDisplay(next);
            displayRef.current = next;
            if (t < 1) {
                raf = requestAnimationFrame(tick);
            } else {
                displayRef.current = to;
            }
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [value, durationMs, reducedMotion]);

    return <>{display}</>;
};

export default AnimatedNumber;
