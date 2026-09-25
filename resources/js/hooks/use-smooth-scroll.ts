import Lenis from 'lenis';
import { useEffect } from 'react';

/** Inertial page scrolling, paused while a dialog locks the page. */
export function useSmoothScroll(): void {
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const lenis = new Lenis({ lerp: 0.085 });

        let frame = requestAnimationFrame(function raf(time: number) {
            lenis.raf(time);
            frame = requestAnimationFrame(raf);
        });

        const observer = new MutationObserver(() => {
            if (document.body.hasAttribute('data-scroll-locked')) {
                lenis.stop();
            } else {
                lenis.start();
            }
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['data-scroll-locked'],
        });

        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            lenis.destroy();
        };
    }, []);
}
