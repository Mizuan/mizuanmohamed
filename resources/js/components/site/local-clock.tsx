import { useEffect, useState } from 'react';

/**
 * Live local time in Malé (UTC+5), updated every second — a small dynamic
 * touch for the page chrome.
 */
export function LocalClock({ className }: { className?: string }) {
    const [time, setTime] = useState('');

    useEffect(() => {
        const formatter = new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'Indian/Maldives',
        });

        const tick = () => setTime(formatter.format(new Date()));
        tick();
        const id = window.setInterval(tick, 1000);

        return () => window.clearInterval(id);
    }, []);

    return (
        <span className={className}>
            {time}
            {time && ' MVT'}
        </span>
    );
}
