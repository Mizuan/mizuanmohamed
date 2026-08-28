<?php

use function Pest\Laravel\withUnencryptedCookie;

it('renders the public site light even when the appearance cookie is dark', function () {
    withUnencryptedCookie('appearance', 'dark')
        ->get('/')
        ->assertOk()
        ->assertSee('data-public-site', false)
        ->assertDontSee('class="dark"', false);
});

it('keeps the dark class outside the public site', function () {
    withUnencryptedCookie('appearance', 'dark')
        ->get('/login')
        ->assertOk()
        ->assertSee('class="dark"', false)
        ->assertDontSee('data-public-site', false);
});
