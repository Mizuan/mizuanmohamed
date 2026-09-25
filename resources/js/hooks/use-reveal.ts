import { useEffect, useRef } from 'react';

/** Lets an element glide up into place as it scrolls into view. */
export function useReveal<T extends HTMLElement>() {
    const ref = useRef<T | null>(null);

    useEffect(() => {
        const element = ref.current;

        if (
            !element ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                element.classList.toggle(
                    'reveal-below',
                    !entry.isIntersecting && entry.boundingClientRect.top > 0,
                );
            },
            { rootMargin: '0px 0px -12% 0px' },
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return ref;
}
