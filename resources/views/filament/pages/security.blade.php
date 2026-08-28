<x-filament-panels::page>
    <form wire:submit="updatePassword" class="grid gap-y-6">
        {{ $this->form }}

        <x-filament::actions :actions="$this->getFormActions()" />
    </form>

    @if ($this->canManageTwoFactor())
        <x-filament::section>
            <x-slot name="heading">Two-factor authentication</x-slot>
            <x-slot name="description">
                Require a one-time code from your authenticator app when signing in.
            </x-slot>

            @if (! $this->twoFactorEnabled() && ! $this->twoFactorPending())
                <p class="fi-section-content-text text-sm text-gray-500 dark:text-gray-400">
                    Two-factor authentication is currently disabled.
                </p>

                <div class="mt-4">
                    {{ $this->enableTwoFactorAction }}
                </div>
            @else
                @if ($this->twoFactorPending())
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        Scan this QR code with your authenticator app, then enter the code it shows.
                    </p>

                    <div class="mt-4 inline-block rounded-lg bg-white p-4">
                        {!! $this->getQrCodeSvg() !!}
                    </div>

                    <div class="mt-4 flex flex-wrap gap-3">
                        {{ $this->confirmTwoFactorAction }}
                        {{ $this->disableTwoFactorAction }}
                    </div>
                @else
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        Two-factor authentication is enabled.
                    </p>

                    <div class="mt-4 flex flex-wrap gap-3">
                        {{ $this->showRecoveryCodesAction }}
                        {{ $this->regenerateRecoveryCodesAction }}
                        {{ $this->disableTwoFactorAction }}
                    </div>

                    @if ($showRecoveryCodes)
                        <div class="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-white/5">
                            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                Store these somewhere safe. Each code can be used once.
                            </p>
                            <ul class="grid gap-1 font-mono text-sm">
                                @foreach ($this->getRecoveryCodes() as $code)
                                    <li>{{ $code }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif
                @endif
            @endif
        </x-filament::section>
    @endif

    @if ($this->canManagePasskeys())
        <x-filament::section>
            <x-slot name="heading">Passkeys</x-slot>
            <x-slot name="description">
                Sign in with Touch ID, Windows Hello, or a hardware key instead of a password.
            </x-slot>

            <div
                x-data="passkeyRegistration({
                    optionsUrl: @js(route('passkey.registration-options')),
                    storeUrl: @js(route('passkey.store')),
                })"
            >
                @if (count($this->getPasskeys()))
                    <ul class="divide-y divide-gray-200 dark:divide-white/10">
                        @foreach ($this->getPasskeys() as $passkey)
                            <li class="flex items-center justify-between gap-4 py-3">
                                <div>
                                    <p class="text-sm font-medium">{{ $passkey['name'] }}</p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">
                                        Added {{ $passkey['created_at'] }}
                                        @if ($passkey['last_used_at'])
                                            · last used {{ $passkey['last_used_at'] }}
                                        @endif
                                    </p>
                                </div>

                                {{ ($this->deletePasskeyAction)(['passkey' => $passkey['id']]) }}
                            </li>
                        @endforeach
                    </ul>
                @else
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        You haven't added any passkeys yet.
                    </p>
                @endif

                <div class="mt-4 flex items-center gap-3">
                    <x-filament::button type="button" x-on:click="register()" x-bind:disabled="busy">
                        <span x-show="! busy">Add passkey</span>
                        <span x-show="busy" x-cloak>Waiting for your device…</span>
                    </x-filament::button>

                    <p x-show="error" x-cloak x-text="error" class="text-sm text-danger-600 dark:text-danger-400"></p>
                </div>
            </div>
        </x-filament::section>
    @endif
</x-filament-panels::page>

@script
<script>
    Alpine.data('passkeyRegistration', ({ optionsUrl, storeUrl }) => ({
        busy: false,
        error: null,

        base64UrlToBuffer(value) {
            const padded = value.replace(/-/g, '+').replace(/_/g, '/')
            const binary = atob(padded)

            return Uint8Array.from(binary, (char) => char.charCodeAt(0))
        },

        bufferToBase64Url(buffer) {
            const binary = String.fromCharCode(...new Uint8Array(buffer))

            return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
        },

        async register() {
            this.error = null

            if (! window.PublicKeyCredential) {
                this.error = 'This browser does not support passkeys.'

                return
            }

            this.busy = true

            try {
                const optionsResponse = await fetch(optionsUrl, {
                    headers: { Accept: 'application/json' },
                    credentials: 'same-origin',
                })

                if (! optionsResponse.ok) {
                    throw new Error('Could not start passkey registration.')
                }

                const options = await optionsResponse.json()

                options.challenge = this.base64UrlToBuffer(options.challenge)
                options.user.id = this.base64UrlToBuffer(options.user.id)
                options.excludeCredentials = (options.excludeCredentials ?? []).map((credential) => ({
                    ...credential,
                    id: this.base64UrlToBuffer(credential.id),
                }))

                const credential = await navigator.credentials.create({ publicKey: options })

                const payload = {
                    id: credential.id,
                    type: credential.type,
                    rawId: this.bufferToBase64Url(credential.rawId),
                    response: {
                        clientDataJSON: this.bufferToBase64Url(credential.response.clientDataJSON),
                        attestationObject: this.bufferToBase64Url(credential.response.attestationObject),
                    },
                }

                const storeResponse = await fetch(storeUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify({
                        name: navigator.platform || 'Passkey',
                        passkey: JSON.stringify(payload),
                    }),
                })

                if (! storeResponse.ok) {
                    throw new Error('That passkey could not be saved.')
                }

                window.location.reload()
            } catch (exception) {
                this.error = exception.name === 'NotAllowedError'
                    ? 'Passkey registration was cancelled.'
                    : exception.message
            } finally {
                this.busy = false
            }
        },
    }))
</script>
@endscript
