import { Form, Link } from '@inertiajs/react';
import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { SidebarCard } from '@/components/admin/sidebar-card';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { index as articlesIndex } from '@/routes/admin/articles';
import type { RouteFormDefinition } from '@/wayfinder';

type Category = { id: number; name: string };
type Tag = { id: number; name: string };
type StatusOption = { value: string; label: string };

export type ArticleFormArticle = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    category_id: number | null;
    status: string;
    published_at: string | null;
    featured_image: string | null;
    tags: { id: number }[];
};

type Props = {
    form: RouteFormDefinition<'post' | 'put'>;
    submitLabel: string;
    categories: Category[];
    tags: Tag[];
    statuses: StatusOption[];
    article?: ArticleFormArticle;
};

const toLocalDateTime = (iso: string | null) => {
    if (!iso) {
        return '';
    }

    const date = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate(),
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/**
 * The article editor, laid out CMS-style: the writing surface (title, slug,
 * excerpt, content) in a wide main column, with publish controls, category,
 * tags, and the featured image in a sticky side rail — so metadata is always
 * at hand while writing. Columns stack on small screens.
 */
export function ArticleForm({
    form,
    submitLabel,
    categories,
    tags,
    statuses,
    article,
}: Props) {
    const [status, setStatus] = useState(article?.status ?? 'draft');
    const [categoryId, setCategoryId] = useState<string>(
        article?.category_id ? String(article.category_id) : '',
    );
    const [preview, setPreview] = useState<string | null>(null);

    const existingImageUrl = article?.featured_image
        ? `/storage/${article.featured_image}`
        : null;
    const selectedTagIds = new Set((article?.tags ?? []).map((tag) => tag.id));

    const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setPreview(file ? URL.createObjectURL(file) : null);
    };

    return (
        <Form {...form}>
            {({ processing, errors }) => (
                <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
                    {/* ── Main column: the writing surface ── */}
                    <div className="space-y-6 rounded-lg border bg-card p-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                required
                                autoFocus
                                defaultValue={article?.title}
                            />
                            <InputError message={errors.title} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">
                                Slug{' '}
                                {!article && (
                                    <span className="text-xs text-muted-foreground">
                                        (optional · auto-generated from title)
                                    </span>
                                )}
                            </Label>
                            <Input
                                id="slug"
                                name="slug"
                                defaultValue={article?.slug}
                            />
                            <InputError message={errors.slug} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="excerpt">
                                Excerpt{' '}
                                <span className="text-xs text-muted-foreground">
                                    (max 500)
                                </span>
                            </Label>
                            <Textarea
                                id="excerpt"
                                name="excerpt"
                                rows={3}
                                maxLength={500}
                                defaultValue={article?.excerpt ?? ''}
                                placeholder="A short teaser shown on listing pages."
                            />
                            <InputError message={errors.excerpt} />
                        </div>

                        <div className="space-y-2">
                            <Label>Content</Label>
                            <RichTextEditor
                                name="content"
                                defaultValue={article?.content}
                                placeholder="Start writing…"
                                minHeight="32rem"
                            />
                            <InputError message={errors.content} />
                        </div>
                    </div>

                    {/* ── Side rail: publish controls + metadata ── */}
                    <div className="space-y-4 lg:sticky lg:top-6">
                        <SidebarCard title="Publish">
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={status}
                                    onValueChange={setStatus}
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statuses.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <input
                                    type="hidden"
                                    name="status"
                                    value={status}
                                />
                                <InputError message={errors.status} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="published_at">
                                    Publish date{' '}
                                    <span className="text-xs text-muted-foreground">
                                        (optional)
                                    </span>
                                </Label>
                                <Input
                                    id="published_at"
                                    name="published_at"
                                    type="datetime-local"
                                    defaultValue={toLocalDateTime(
                                        article?.published_at ?? null,
                                    )}
                                />
                                <InputError message={errors.published_at} />
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t pt-4">
                                <Button variant="ghost" asChild>
                                    <Link href={articlesIndex()}>Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing && <Spinner />}
                                    {submitLabel}
                                </Button>
                            </div>
                        </SidebarCard>

                        <SidebarCard title="Category">
                            <Select
                                value={categoryId || '__none'}
                                onValueChange={(value) =>
                                    setCategoryId(
                                        value === '__none' ? '' : value,
                                    )
                                }
                            >
                                <SelectTrigger
                                    id="category_id"
                                    aria-label="Category"
                                >
                                    <SelectValue placeholder="Uncategorised" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="__none">
                                        Uncategorised
                                    </SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={String(category.id)}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <input
                                type="hidden"
                                name="category_id"
                                value={categoryId}
                            />
                            <InputError message={errors.category_id} />
                        </SidebarCard>

                        {tags.length > 0 && (
                            <SidebarCard title="Tags">
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <label
                                            key={tag.id}
                                            className="inline-flex cursor-pointer items-center gap-2 rounded-full border bg-background px-3 py-1 text-sm transition-colors hover:bg-accent has-[input:checked]:border-primary has-[input:checked]:bg-primary has-[input:checked]:text-primary-foreground"
                                        >
                                            <input
                                                type="checkbox"
                                                name="tag_ids[]"
                                                value={tag.id}
                                                defaultChecked={selectedTagIds.has(
                                                    tag.id,
                                                )}
                                                className="sr-only"
                                            />
                                            {tag.name}
                                        </label>
                                    ))}
                                </div>
                                <InputError message={errors.tag_ids} />
                            </SidebarCard>
                        )}

                        <SidebarCard title="Featured image">
                            {existingImageUrl && !preview && (
                                <div className="space-y-2">
                                    <img
                                        src={existingImageUrl}
                                        alt="Current featured image"
                                        className="max-h-40 w-full rounded-md border object-cover"
                                    />
                                    <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                                        <input
                                            type="checkbox"
                                            name="remove_featured_image"
                                            value="1"
                                        />
                                        Remove current image
                                    </label>
                                </div>
                            )}
                            <Input
                                id="featured_image"
                                name="featured_image"
                                type="file"
                                accept="image/*"
                                onChange={handleImage}
                            />
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="max-h-40 w-full rounded-md border object-cover"
                                />
                            )}
                            <p className="text-xs text-muted-foreground">
                                Optional · max 5 MB
                            </p>
                            <InputError message={errors.featured_image} />
                        </SidebarCard>
                    </div>
                </div>
            )}
        </Form>
    );
}
