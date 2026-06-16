import { X } from 'lucide-react';
import { useState  } from 'react';
import type {KeyboardEvent} from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type TagInputProps = {
    name: string;
    defaultValue?: string[];
    placeholder?: string;
    id?: string;
};

export function TagInput({
    name,
    defaultValue = [],
    placeholder = 'Type and press Enter',
    id,
}: TagInputProps) {
    const [items, setItems] = useState<string[]>(defaultValue);
    const [draft, setDraft] = useState('');

    const addItem = (value: string) => {
        const trimmed = value.trim();

        if (!trimmed || items.includes(trimmed)) {
return;
}

        setItems([...items, trimmed]);
    };

    const removeItem = (value: string) => {
        setItems(items.filter((item) => item !== value));
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            addItem(draft);
            setDraft('');

            return;
        }

        if (event.key === 'Backspace' && draft === '' && items.length > 0) {
            event.preventDefault();
            removeItem(items[items.length - 1]);
        }
    };

    return (
        <div
            className={cn(
                'flex flex-wrap items-center gap-1.5 rounded-md border bg-background px-2 py-1.5',
                'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
            )}
        >
            {items.map((item) => (
                <span
                    key={item}
                    className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium"
                >
                    {item}
                    <button
                        type="button"
                        onClick={() => removeItem(item)}
                        className="rounded-full text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={`Remove ${item}`}
                    >
                        <X className="size-3" />
                    </button>
                    <input type="hidden" name={`${name}[]`} value={item} />
                </span>
            ))}
            <Input
                id={id}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                    if (draft.trim()) {
                        addItem(draft);
                        setDraft('');
                    }
                }}
                placeholder={items.length === 0 ? placeholder : ''}
                className="h-6 flex-1 min-w-[8rem] border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
            />
        </div>
    );
}
