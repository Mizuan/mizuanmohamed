import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { TagInput } from '@/components/admin/tag-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export type Section = {
    label: string;
    title: string;
    body: string;
    tags: string[];
};

type Row = Section & { _key: number };

/**
 * Repeater of About-page sections. Each row submits as `name[i][field]` so the
 * server receives an ordered array of section objects. Rows are uncontrolled
 * (defaultValue) but keyed, so reordering/removing keeps each field's value.
 */
export function SectionsRepeater({
    name = 'sections',
    defaultValue = [],
}: {
    name?: string;
    defaultValue?: Section[];
}) {
    const nextKey = useRef(defaultValue.length);
    const [rows, setRows] = useState<Row[]>(() =>
        defaultValue.map((section, i) => ({
            label: section.label ?? '',
            title: section.title ?? '',
            body: section.body ?? '',
            tags: section.tags ?? [],
            _key: i,
        })),
    );

    const add = () =>
        setRows((current) => [
            ...current,
            { label: '', title: '', body: '', tags: [], _key: nextKey.current++ },
        ]);

    const remove = (key: number) =>
        setRows((current) => current.filter((row) => row._key !== key));

    const move = (index: number, direction: -1 | 1) =>
        setRows((current) => {
            const target = index + direction;

            if (target < 0 || target >= current.length) {
                return current;
            }

            const next = [...current];
            [next[index], next[target]] = [next[target], next[index]];

            return next;
        });

    return (
        <div className="space-y-4">
            {rows.map((row, i) => (
                <div
                    key={row._key}
                    className="space-y-3 rounded-md border bg-background p-4"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                            Section {i + 1}
                        </span>
                        <div className="flex items-center gap-0.5">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                disabled={i === 0}
                                onClick={() => move(i, -1)}
                            >
                                <ChevronUp className="size-4" />
                                <span className="sr-only">Move up</span>
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                disabled={i === rows.length - 1}
                                onClick={() => move(i, 1)}
                            >
                                <ChevronDown className="size-4" />
                                <span className="sr-only">Move down</span>
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => remove(row._key)}
                            >
                                <Trash2 className="size-4" />
                                <span className="sr-only">Remove</span>
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label>Label</Label>
                            <Input
                                name={`${name}[${i}][label]`}
                                defaultValue={row.label}
                                placeholder="e.g. Intro"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Title</Label>
                            <Input
                                name={`${name}[${i}][title]`}
                                defaultValue={row.title}
                                placeholder="e.g. About"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label>
                            Body{' '}
                            <span className="text-xs text-muted-foreground">
                                (blank line = new paragraph)
                            </span>
                        </Label>
                        <Textarea
                            name={`${name}[${i}][body]`}
                            defaultValue={row.body}
                            rows={4}
                            placeholder="Write this section…"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>
                            Tags{' '}
                            <span className="text-xs text-muted-foreground">
                                (optional · shown as pills)
                            </span>
                        </Label>
                        <TagInput
                            name={`${name}[${i}][tags]`}
                            defaultValue={row.tags}
                            placeholder="e.g. Laravel, React"
                        />
                    </div>
                </div>
            ))}

            <Button
                type="button"
                variant="outline"
                onClick={add}
                className="w-full"
            >
                <Plus className="size-4" />
                Add section
            </Button>
        </div>
    );
}
