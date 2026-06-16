import { Form, Head, Link } from '@inertiajs/react';
import { useState  } from 'react';
import type {ChangeEvent} from 'react';
import { AdminPage } from '@/components/admin/admin-page';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
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
import { dashboard } from '@/routes';
import { index as articlesIndex, store } from '@/routes/admin/articles';

type Category = { id: number; name: string };
type Tag = { id: number; name: string };
type StatusOption = { value: string; label: string };

type Props = {
    categories: Category[];
    tags: Tag[];
    statuses: StatusOption[];
};

export default function ArticleCreate({ categories, tags, statuses }: Props) {
    const [status, setStatus] = useState('draft');
    const [categoryId, setCategoryId] = useState<string>('');
    const [preview, setPreview] = useState<string | null>(null);

    const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setPreview(file ? URL.createObjectURL(file) : null);
    };

    return (
        <>
            <Head title="New article" />
            <AdminPage
                title="New article"
                description="Long-form content with rich text, tags, and a featured image."
            >
                <div className="mx-auto max-w-3xl">
                    <Form
                        {...store.form()}
                        className="space-y-6 rounded-lg border bg-card p-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        required
                                        autoFocus
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">
                                        Slug{' '}
                                        <span className="text-xs text-muted-foreground">
                                            (optional · auto-generated from
                                            title)
                                        </span>
                                    </Label>
                                    <Input id="slug" name="slug" />
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
                                        placeholder="A short teaser shown on listing pages."
                                    />
                                    <InputError message={errors.excerpt} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Content</Label>
                                    <RichTextEditor
                                        name="content"
                                        placeholder="Start writing…"
                                        minHeight="24rem"
                                    />
                                    <InputError message={errors.content} />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="category_id">
                                            Category
                                        </Label>
                                        <Select
                                            value={categoryId}
                                            onValueChange={(value) =>
                                                setCategoryId(
                                                    value === '__none'
                                                        ? ''
                                                        : value,
                                                )
                                            }
                                        >
                                            <SelectTrigger id="category_id">
                                                <SelectValue placeholder="Uncategorised" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="__none">
                                                    Uncategorised
                                                </SelectItem>
                                                {categories.map((category) => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={String(
                                                            category.id,
                                                        )}
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
                                        <InputError
                                            message={errors.category_id}
                                        />
                                    </div>

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
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="published_at">
                                        Publish date{' '}
                                        <span className="text-xs text-muted-foreground">
                                            (optional · defaults to now when
                                            publishing)
                                        </span>
                                    </Label>
                                    <Input
                                        id="published_at"
                                        name="published_at"
                                        type="datetime-local"
                                    />
                                    <InputError message={errors.published_at} />
                                </div>

                                {tags.length > 0 && (
                                    <div className="space-y-2">
                                        <Label>Tags</Label>
                                        <div className="flex flex-wrap gap-2 rounded-md border p-3">
                                            {tags.map((tag) => (
                                                <label
                                                    key={tag.id}
                                                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border bg-background px-3 py-1 text-sm transition-colors hover:bg-accent has-[input:checked]:border-primary has-[input:checked]:bg-primary has-[input:checked]:text-primary-foreground"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        name="tag_ids[]"
                                                        value={tag.id}
                                                        className="sr-only"
                                                    />
                                                    {tag.name}
                                                </label>
                                            ))}
                                        </div>
                                        <InputError message={errors.tag_ids} />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="featured_image">
                                        Featured image{' '}
                                        <span className="text-xs text-muted-foreground">
                                            (optional · max 4 MB)
                                        </span>
                                    </Label>
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
                                            className="mt-2 max-h-48 rounded-md border object-contain"
                                        />
                                    )}
                                    <InputError
                                        message={errors.featured_image}
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-2 border-t pt-4">
                                    <Button variant="ghost" asChild>
                                        <Link href={articlesIndex()}>
                                            Cancel
                                        </Link>
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {processing && <Spinner />}
                                        Create article
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </AdminPage>
        </>
    );
}

ArticleCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Articles', href: articlesIndex() },
        { title: 'New', href: '' },
    ],
};
