import type { ReactNode } from 'react';

/** A titled card for the editor side rail (publish controls, metadata, …). */
export function SidebarCard({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <section className="space-y-4 rounded-lg border bg-card p-5">
            <h3 className="text-sm font-medium">{title}</h3>
            {children}
        </section>
    );
}
