import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    Bold,
    Code,
    Heading2,
    Heading3,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Quote,
    Redo,
    Strikethrough,
    Undo,
} from 'lucide-react';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';

type RichTextEditorProps = {
    name: string;
    defaultValue?: string;
    placeholder?: string;
    minHeight?: string;
};

export function RichTextEditor({
    name,
    defaultValue = '',
    placeholder = 'Write something…',
    minHeight = '16rem',
}: RichTextEditorProps) {
    const [html, setHtml] = useState(defaultValue);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline underline-offset-4',
                },
            }),
            Placeholder.configure({ placeholder }),
        ],
        content: defaultValue,
        editorProps: {
            attributes: {
                class: cn(
                    'prose-like focus:outline-none px-4 py-3',
                    '[&_p.is-editor-empty:first-child]:before:pointer-events-none [&_p.is-editor-empty:first-child]:before:float-left [&_p.is-editor-empty:first-child]:before:h-0 [&_p.is-editor-empty:first-child]:before:text-muted-foreground [&_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]',
                ),
            },
        },
        onUpdate: ({ editor }) => setHtml(editor.getHTML()),
        immediatelyRender: false,
    });

    return (
        <div className="overflow-hidden rounded-md border bg-background">
            <Toolbar editor={editor} />
            <EditorContent
                editor={editor}
                className="max-h-[60vh] overflow-y-auto"
                style={{ minHeight }}
            />
            <input type="hidden" name={name} value={html} />
        </div>
    );
}

function Toolbar({ editor }: { editor: Editor | null }) {
    if (!editor) {
        return (
            <div className="flex h-10 items-center border-b bg-muted/30 px-2" />
        );
    }

    return (
        <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/30 px-2 py-1">
            <ToolbarButton
                label="Bold"
                pressed={editor.isActive('bold')}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
            >
                <Bold className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                label="Italic"
                pressed={editor.isActive('italic')}
                onPressedChange={() =>
                    editor.chain().focus().toggleItalic().run()
                }
            >
                <Italic className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                label="Strikethrough"
                pressed={editor.isActive('strike')}
                onPressedChange={() =>
                    editor.chain().focus().toggleStrike().run()
                }
            >
                <Strikethrough className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                label="Inline code"
                pressed={editor.isActive('code')}
                onPressedChange={() => editor.chain().focus().toggleCode().run()}
            >
                <Code className="size-4" />
            </ToolbarButton>

            <Divider />

            <ToolbarButton
                label="Heading 2"
                pressed={editor.isActive('heading', { level: 2 })}
                onPressedChange={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
            >
                <Heading2 className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                label="Heading 3"
                pressed={editor.isActive('heading', { level: 3 })}
                onPressedChange={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
            >
                <Heading3 className="size-4" />
            </ToolbarButton>

            <Divider />

            <ToolbarButton
                label="Bullet list"
                pressed={editor.isActive('bulletList')}
                onPressedChange={() =>
                    editor.chain().focus().toggleBulletList().run()
                }
            >
                <List className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                label="Numbered list"
                pressed={editor.isActive('orderedList')}
                onPressedChange={() =>
                    editor.chain().focus().toggleOrderedList().run()
                }
            >
                <ListOrdered className="size-4" />
            </ToolbarButton>
            <ToolbarButton
                label="Blockquote"
                pressed={editor.isActive('blockquote')}
                onPressedChange={() =>
                    editor.chain().focus().toggleBlockquote().run()
                }
            >
                <Quote className="size-4" />
            </ToolbarButton>

            <Divider />

            <ToolbarButton
                label="Link"
                pressed={editor.isActive('link')}
                onPressedChange={() => {
                    const previous = editor.getAttributes('link').href as
                        | string
                        | undefined;
                    const url = window.prompt('URL', previous ?? 'https://');
                    if (url === null) return;
                    if (url === '') {
                        editor
                            .chain()
                            .focus()
                            .extendMarkRange('link')
                            .unsetLink()
                            .run();
                        return;
                    }
                    editor
                        .chain()
                        .focus()
                        .extendMarkRange('link')
                        .setLink({ href: url })
                        .run();
                }}
            >
                <LinkIcon className="size-4" />
            </ToolbarButton>

            <div className="ml-auto flex items-center gap-0.5">
                <ToolbarButton
                    label="Undo"
                    pressed={false}
                    onPressedChange={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Undo className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Redo"
                    pressed={false}
                    onPressedChange={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Redo className="size-4" />
                </ToolbarButton>
            </div>
        </div>
    );
}

function ToolbarButton({
    label,
    pressed,
    onPressedChange,
    disabled,
    children,
}: {
    label: string;
    pressed: boolean;
    onPressedChange: () => void;
    disabled?: boolean;
    children: React.ReactNode;
}) {
    return (
        <Toggle
            size="sm"
            pressed={pressed}
            onPressedChange={onPressedChange}
            disabled={disabled}
            aria-label={label}
            title={label}
            className="size-8 p-0"
        >
            {children}
        </Toggle>
    );
}

function Divider() {
    return (
        <Separator
            orientation="vertical"
            className="mx-1 data-[orientation=vertical]:h-5"
        />
    );
}
