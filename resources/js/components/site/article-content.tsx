import { useEffect, useRef } from 'react';
import { hljs } from '@/lib/highlight';
import { cn } from '@/lib/utils';

type Props = {
    html: string;
    className?: string;
};

export function ArticleContent({ html, className }: Props) {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const blocks = ref.current?.querySelectorAll<HTMLElement>('pre code');
        blocks?.forEach((block) => {
            if (block.dataset.highlighted !== 'yes') {
                hljs.highlightElement(block);
            }
        });
    }, [html]);

    return (
        <div
            ref={ref}
            className={cn('prose-like', className)}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
