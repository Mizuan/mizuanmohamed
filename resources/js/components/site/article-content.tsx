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
        const root = ref.current;

        if (!root) {
            return;
        }

        const controller = new AbortController();

        // Syntax highlighting.
        root.querySelectorAll<HTMLElement>('pre code').forEach((block) => {
            if (block.dataset.highlighted !== 'yes') {
                hljs.highlightElement(block);
            }
        });

        // Open external links in a new tab and flag them safely.
        root.querySelectorAll<HTMLAnchorElement>(
            'a[href^="http"]',
        ).forEach((anchor) => {
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
        });

        // Wrap code blocks with a toolbar (language label + copy button).
        root.querySelectorAll<HTMLPreElement>('pre').forEach((pre) => {
            if (pre.dataset.enhanced === 'yes' || !pre.parentNode) {
                return;
            }

            pre.dataset.enhanced = 'yes';

            const code = pre.querySelector('code');
            const langMatch = code?.className.match(/language-([\w+#-]+)/);
            const lang =
                langMatch && langMatch[1] !== 'plaintext' ? langMatch[1] : '';

            const wrapper = document.createElement('div');
            wrapper.className = 'code-block';
            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);

            const bar = document.createElement('div');
            bar.className = 'code-block__bar';

            const label = document.createElement('span');
            label.className = 'code-block__lang';
            label.textContent = lang;
            bar.appendChild(label);

            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'code-block__copy';
            button.textContent = 'Copy';
            button.addEventListener(
                'click',
                () => {
                    void navigator.clipboard
                        ?.writeText(code?.textContent ?? '')
                        .then(() => {
                            button.textContent = 'Copied';
                            window.setTimeout(() => {
                                button.textContent = 'Copy';
                            }, 1500);
                        });
                },
                { signal: controller.signal },
            );
            bar.appendChild(button);

            wrapper.appendChild(bar);
        });

        return () => controller.abort();
    }, [html]);

    return (
        <div
            ref={ref}
            className={cn('prose-like', className)}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
