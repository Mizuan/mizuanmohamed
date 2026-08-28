<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\TwoFactorLoginResponse as TwoFactorLoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class TwoFactorLoginResponse extends LoginResponse implements TwoFactorLoginResponseContract
{
    public function toResponse($request): Response
    {
        return parent::toResponse($request);
    }
}
