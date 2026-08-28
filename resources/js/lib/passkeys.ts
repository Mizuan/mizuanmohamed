import {
    startAuthentication,
    startRegistration,
} from '@simplewebauthn/browser';
import type {
    PublicKeyCredentialCreationOptionsJSON,
    PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/browser';
import {
    login as loginRoute,
    loginOptions,
    registrationOptions,
    store as storeRoute,
} from '@/routes/passkey';

/** Whether this browser supports the WebAuthn APIs passkeys rely on. */
export function passkeysSupported(): boolean {
    return (
        typeof window !== 'undefined' &&
        typeof window.PublicKeyCredential !== 'undefined'
    );
}

function xsrfToken(): string {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);

    return match ? decodeURIComponent(match[1]) : '';
}

async function getOptions<T>(url: string): Promise<T> {
    const res = await fetch(url, {
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
    });

    if (!res.ok) {
        throw new PasskeyError(
            res.status === 423
                ? 'Please confirm your password again, then retry.'
                : 'Could not start the passkey ceremony.',
            res.status,
        );
    }

    const data = await res.json();

    return data.options as T;
}

async function post(url: string, body: unknown): Promise<Response> {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': xsrfToken(),
        },
        credentials: 'same-origin',
        body: JSON.stringify(body),
    });
}

/** A passkey ceremony failed for a reason worth surfacing to the user. */
export class PasskeyError extends Error {
    constructor(
        message: string,
        public status?: number,
    ) {
        super(message);
        this.name = 'PasskeyError';
    }
}

/** Register a new passkey for the signed-in user. */
export async function registerPasskey(name: string): Promise<void> {
    const optionsJSON =
        await getOptions<PublicKeyCredentialCreationOptionsJSON>(
            registrationOptions.url(),
        );

    let credential;

    try {
        credential = await startRegistration({ optionsJSON });
    } catch {
        throw new PasskeyError('Passkey setup was cancelled.');
    }

    const res = await post(storeRoute.url(), { name, credential });

    if (!res.ok) {
        throw new PasskeyError('Could not save the passkey. Please try again.');
    }
}

/**
 * Authenticate with a passkey. Resolves to the URL to redirect to on success.
 */
export async function loginWithPasskey(remember: boolean): Promise<string> {
    const optionsJSON =
        await getOptions<PublicKeyCredentialRequestOptionsJSON>(
            loginOptions.url(),
        );

    let credential;

    try {
        credential = await startAuthentication({ optionsJSON });
    } catch {
        throw new PasskeyError('Passkey sign-in was cancelled.');
    }

    const res = await post(loginRoute.url(), { credential, remember });

    if (!res.ok) {
        throw new PasskeyError('That passkey was not recognised.');
    }

    const data = await res.json();

    return (data.redirect as string) ?? '/admin';
}
