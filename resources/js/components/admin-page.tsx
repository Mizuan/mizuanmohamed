import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type AdminPageProps = {
    title: string;
    description?: string;
    actions?: ReactNode;
    children: ReactNode;
    className?: string;
};

export function AdminPage({
    title,
    description,
    actions,
    children,
    className,
}: AdminPageProps) {
    return (
        <div className={cn('mx-auto w-full max-w-7xl px-4 py-8', className)}>
            <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {title}
                    </h1>
                    {description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
                {actions && (
                    <div className="flex items-center gap-2">{actions}</div>
                )}
            </header>
            <div>{children}</div>
        </div>
    );
}
