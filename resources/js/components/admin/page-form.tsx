import { Form, Link } from '@inertiajs/react';
import { useState } from 'react';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { SectionsRepeater } from '@/components/admin/sections-repeater';
import type { Section } from '@/components/admin/sections-repeater';
import { SidebarCard } from '@/components/admin/sidebar-card';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { index as pagesIndex } from '@/routes/admin/pages';
import type { RouteFormDefinition } from '@/wayfinder';

export type PageFormPage = {
    id: number;
    title: string;
    slug: string;
    content: string | null;
    sections: Section[] | null;
    meta_description: string | null;
    is_published: boolean;
};

type Props = {
    form: RouteFormDefinition<'post' | 'put'>;
    submitLabel: string;
    page?: PageFormPage;
};

/**
 * The page editor, laid out CMS-style like the article editor: the writing
 * surface (title, slug, content, and the About sections when editing the
 * about page) in a wide main column, with publish controls and SEO metadata
 * in a sticky side rail. Columns stack on small screens.
 */
export function PageForm({ form, submitLabel, page }: Props) {
    const [isPublished, setIsPublished] = useState(page?.is_published ?? true);

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
                                defaultValue={page?.title}
                                placeholder="About"
                            />
                            <InputError message={errors.title} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">
                                Slug{' '}
                                {!page && (
                                    <span className="text-xs text-muted-foreground">
                                        (optional · auto-generated from title)
                                    </span>
                                )}
                            </Label>
                            <Input
                                id="slug"
                                name="slug"
                                defaultValue={page?.slug}
                                placeholder="about"
                            />
                            <InputError message={errors.slug} />
                        </div>

                        <div className="space-y-2">
                            <Label>Content</Label>
                            <RichTextEditor
                                name="content"
                                defaultValue={page?.content ?? ''}
                                placeholder="Write the page content…"
                                minHeight="24rem"
                            />
                            <InputError message={errors.content} />
                        </div>

                        {page?.slug === 'about' && (
                            <div className="space-y-2">
                                <Label>About sections</Label>
                                <p className="text-xs text-muted-foreground">
                                    The intro, experience, approach and toolkit
                                    panels shown on the public About page.
                                </p>
                                <SectionsRepeater
                                    name="sections"
                                    defaultValue={page.sections ?? []}
                                />
                                <InputError message={errors.sections} />
                            </div>
                        )}
                    </div>

                    {/* ── Side rail: publish controls + SEO ── */}
                    <div className="space-y-4 lg:sticky lg:top-6">
                        <SidebarCard title="Publish">
                            <div className="flex items-center gap-3 rounded-md border p-3">
                                <Checkbox
                                    id="is_published"
                                    checked={isPublished}
                                    onCheckedChange={(value) =>
                                        setIsPublished(value === true)
                                    }
                                />
                                <input
                                    type="hidden"
                                    name="is_published"
                                    value={isPublished ? '1' : '0'}
                                />
                                <div className="flex-1">
                                    <Label
                                        htmlFor="is_published"
                                        className="cursor-pointer"
                                    >
                                        Published
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Uncheck to keep this page hidden from
                                        the public site.
                                    </p>
                                </div>
                            </div>
                            <InputError message={errors.is_published} />

                            <div className="flex items-center justify-end gap-2 border-t pt-4">
                                <Button variant="ghost" asChild>
                                    <Link href={pagesIndex()}>Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing && <Spinner />}
                                    {submitLabel}
                                </Button>
                            </div>
                        </SidebarCard>

                        <SidebarCard title="SEO">
                            <div className="space-y-2">
                                <Label htmlFor="meta_description">
                                    Meta description{' '}
                                    <span className="text-xs text-muted-foreground">
                                        (max 255)
                                    </span>
                                </Label>
                                <Textarea
                                    id="meta_description"
                                    name="meta_description"
                                    rows={3}
                                    maxLength={255}
                                    defaultValue={page?.meta_description ?? ''}
                                />
                                <InputError
                                    message={errors.meta_description}
                                />
                            </div>
                        </SidebarCard>
                    </div>
                </div>
            )}
        </Form>
    );
}
