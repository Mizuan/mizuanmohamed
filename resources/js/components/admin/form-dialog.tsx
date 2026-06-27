import type { ReactNode } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children: ReactNode;
    className?: string;
};

/**
 * A standard admin create/edit modal: a dialog with a title/description over a
 * form. Keep the form (with its submit/cancel footer) as the children.
 */
export function FormDialog({
    open,
    onOpenChange,
    title,
    description,
    children,
    className,
}: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    'max-h-[90vh] gap-0 overflow-y-auto sm:max-w-lg',
                    className,
                )}
            >
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && (
                        <DialogDescription>{description}</DialogDescription>
                    )}
                </DialogHeader>
                <div className="mt-5">{children}</div>
            </DialogContent>
        </Dialog>
    );
}
