import { router } from '@inertiajs/react';
import { Fingerprint, KeyRound, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
    PasskeyError,
    passkeysSupported,
    registerPasskey,
} from '@/lib/passkeys';
import { destroy } from '@/routes/passkey';

type Passkey = {
    id: string;
    name: string;
    authenticator: string | null;
    last_used_at: string | null;
    created_at: string | null;
};

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

export default function PasskeyManager({ passkeys }: { passkeys: Passkey[] }) {
    const supported = passkeysSupported();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addPasskey = async (event: FormEvent) => {
        event.preventDefault();
        setBusy(true);
        setError(null);

        try {
            await registerPasskey(name.trim() || 'My device');
            setOpen(false);
            setName('');
            router.reload({ only: ['passkeys'] });
        } catch (err) {
            setError(
                err instanceof PasskeyError
                    ? err.message
                    : 'Something went wrong setting up the passkey.',
            );
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="space-y-6">
            <Heading
                variant="small"
                title="Passkeys"
                description="Sign in with Touch ID, Windows Hello, or a hardware key — no password required. Your password still works as a fallback."
            />

            {!supported ? (
                <p className="text-sm text-muted-foreground">
                    This browser doesn&apos;t support passkeys.
                </p>
            ) : (
                <div className="flex flex-col items-start gap-4">
                    {passkeys.length > 0 && (
                        <ul className="w-full divide-y rounded-md border">
                            {passkeys.map((passkey) => (
                                <li
                                    key={passkey.id}
                                    className="flex items-center justify-between gap-4 p-4"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <KeyRound className="size-5 shrink-0 text-muted-foreground" />
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium">
                                                {passkey.name}
                                            </p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {passkey.authenticator ??
                                                    'Passkey'}
                                                {passkey.last_used_at
                                                    ? ` · last used ${formatDate(passkey.last_used_at)}`
                                                    : passkey.created_at
                                                      ? ` · added ${formatDate(passkey.created_at)}`
                                                      : ''}
                                            </p>
                                        </div>
                                    </div>

                                    <ConfirmDialog
                                        title="Remove passkey?"
                                        description={`"${passkey.name}" will no longer be able to sign in.`}
                                        confirmLabel="Remove"
                                        onConfirm={() =>
                                            router.delete(
                                                destroy(Number(passkey.id)).url,
                                                { preserveScroll: true },
                                            )
                                        }
                                        trigger={
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-muted-foreground hover:text-destructive"
                                                aria-label={`Remove ${passkey.name}`}
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        }
                                    />
                                </li>
                            ))}
                        </ul>
                    )}

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Fingerprint />
                                Add passkey
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Add a passkey</DialogTitle>
                                <DialogDescription>
                                    Give it a name you&apos;ll recognise, then
                                    follow your device&apos;s prompt.
                                </DialogDescription>
                            </DialogHeader>

                            <form
                                onSubmit={addPasskey}
                                className="space-y-4"
                                id="add-passkey-form"
                            >
                                <div className="grid gap-2">
                                    <Label htmlFor="passkey_name">Name</Label>
                                    <Input
                                        id="passkey_name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="e.g. MacBook Touch ID"
                                        autoFocus
                                        maxLength={255}
                                    />
                                    <InputError message={error ?? undefined} />
                                </div>
                            </form>

                            <DialogFooter>
                                <Button
                                    type="submit"
                                    form="add-passkey-form"
                                    disabled={busy}
                                >
                                    {busy && <Spinner />}
                                    Create passkey
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </div>
    );
}
