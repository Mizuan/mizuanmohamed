import { Form, Head, Link, router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState, type ChangeEvent } from 'react';
import { AdminPage } from '@/components/admin/admin-page';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
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
import {
    destroy,
    index as articlesIndex,
    update,
} from '@/routes/admin/articles';

type Category = { id: number; name: string };
type Tag = { id: number; name: string };
type StatusOption = { value: string; label: string };

type Article = {
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
    article: Article;
    categories: Category[];
    tags: Tag[];
    statuses: StatusOption[];
};

export default function ArticleEdit({
    article,
    categories,
    tags,
    statuses,
}: Props) {
    const [status, setStatus] = useState(article.status);
    const [categoryId, setCategoryId] = useState<string>(
        article.category_id ? String(article.category_id) : '',
    );
    const [preview, setPreview] = useState<string | null>(null);

    const existingImageUrl = article.featured_image
        ? `/storage/${article.featured_image}`
        : null;

    const selectedTagIds = new Set(article.tags.map((tag) => tag.id));

    const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setPreview(file ? URL.createObjectURL(file) : null);
    };

    const toLocalDateTime = (iso: string | null) => {
        if (!iso) return '';
        const date = new Date(iso);
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
            date.getDate(),
        )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    return (
        <>
            <Head title={`Edit ${article.title}`} />
            <AdminPage
                title="Edit article"
                description={article.title}
                actions={
                    <ConfirmDialog
                        title="Delete article?"
                        description={`"${article.title}" will be permanently removed.`}
                        confirmLabel="Delete"
                        onConfirm={() =>
                            router.delete(destroy(article.slug).url)
                        }
                        trigger={
                            <Button variant="destructive">
                                <Trash2 />
                                Delete
                            </Button>
                        }
                    />
                }
            >
                <div className="mx-auto max-w-3xl">
                    <Form
                        {...update.form(article.slug)}
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
                                        defaultValue={article.title}
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        name="slug"
                                        defaultValue={article.slug}
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
                                        defaultValue={article.excerpt ?? ''}
                                    />
                                    <InputError message={errors.excerpt} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Content</Label>
                                    <RichTextEditor
                                        name="content"
                                        defaultValue={article.content}
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
                                            value={categoryId || '__none'}
                                            onValueChange={(value) =>
                                                setCategoryId(
                                                    value === '__none'
                                                        ? ''
                                                        : value,
                                                )
                                            }
                                        >
                                            <SelectTrigger id="category_id">
                                                <SelectValue />
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
                                            (optional)
                                        </span>
                                    </Label>
                                    <Input
                                        id="published_at"
                                        name="published_at"
                                        type="datetime-local"
                                        defaultValue={toLocalDateTime(
                                            article.published_at,
                                        )}
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
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="featured_image">
                                        Featured image{' '}
                                        <span className="text-xs text-muted-foreground">
                                            (optional · max 4 MB)
                                        </span>
                                    </Label>
                                    {existingImageUrl && !preview && (
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={existingImageUrl}
                                                alt="Current featured image"
                                                className="max-h-32 rounded-md border object-contain"
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
                                        Save changes
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

ArticleEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Articles', href: articlesIndex() },
        { title: 'Edit', href: '' },
    ],
};
